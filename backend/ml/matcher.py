"""
ResumeMatcherAPI — singleton.
MOCK_MODE=true  → rule-based scoring (default until .pkl files are added)
MOCK_MODE=false → loads tfidf_vectorizer.pkl + rf_model_95pct.pkl
"""
import os
import re
import numpy as np
import pandas as pd
from sklearn.metrics.pairwise import cosine_similarity

from ml.text_cleaner       import clean_text
from ml.skill_extractor    import extract_skills, compute_skill_gap
from ml.course_recommender import recommend_courses, prepare_courses


class ResumeMatcherAPI:
    _instance = None

    def __new__(cls, config=None):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            cls._instance._ready = False
        return cls._instance

    def init(self, config):
        if self._ready:
            return
        self.mock_mode   = config.MOCK_MODE
        self.vectorizer  = None
        self.rf          = None
        self.courses_df  = None

        if os.path.exists(config.COURSERA_PATH):
            raw = pd.read_excel(config.COURSERA_PATH)
            self.courses_df = prepare_courses(raw)
            print(f"[Matcher] {len(self.courses_df)} Coursera courses loaded.")
        else:
            print(f"[Matcher] Coursera file not found — course recs will use mock data.")

        if not self.mock_mode:
            try:
                import joblib
                self.vectorizer = joblib.load(config.VECTORIZER_PATH)
                self.rf         = joblib.load(config.MODEL_PATH)
                print("[Matcher] RF models loaded — real inference mode.")
            except FileNotFoundError as e:
                print(f"[Matcher] WARNING {e} — falling back to mock mode.")
                self.mock_mode = True
        else:
            print("[Matcher] MOCK mode — set MOCK_MODE=false after adding models/.")

        self._ready = True

    # ── public ──────────────────────────────────────────────────

    def analyze(self, resume_text: str, job_desc: str) -> dict:
        r_clean = clean_text(resume_text)
        j_clean = clean_text(job_desc)

        tfidf_sim, skill_overlap = self._features(r_clean, j_clean)
        match_score = self._predict(tfidf_sim, skill_overlap)
        gap         = compute_skill_gap(r_clean, j_clean)
        courses     = self._courses(gap["missing"])
        xai         = self._explain(tfidf_sim, skill_overlap, gap)

        return {
            "match_score":         round(match_score * 100, 1),
            "tfidf_similarity":    round(tfidf_sim  * 100, 1),
            "skill_overlap_pct":   round(skill_overlap * 100, 1),
            "skill_gap":           gap,
            "recommended_courses": courses,
            "explainability":      xai,
            "mock_mode":           self.mock_mode,
        }

    # ── private ─────────────────────────────────────────────────

    def _features(self, r: str, j: str):
        if self.vectorizer:
            X         = self.vectorizer.transform([r, j])
            tfidf_sim = float(cosine_similarity(X[0], X[1])[0][0])
        else:
            r_w = set(r.split()); j_w = set(j.split())
            tfidf_sim = len(r_w & j_w) / max(len(j_w), 1)
        r_s = set(extract_skills(r)); j_s = set(extract_skills(j))
        return tfidf_sim, len(r_s & j_s) / max(len(j_s), 1)

    def _predict(self, tfidf_sim: float, skill_overlap: float) -> float:
     if self.rf:
        prob = float(self.rf.predict_proba(np.array([[tfidf_sim, skill_overlap]]))[0][1])
        # prob of 1.0 means model is saturating — use weighted blend as sanity check
        if prob >= 0.99:
            prob = min(0.94, 0.60 * tfidf_sim + 0.40 * skill_overlap + 0.15)
        return prob
     raw = 0.94 * tfidf_sim + 0.06 * skill_overlap
     return float(np.clip(0.20 + raw * 0.75, 0.0, 1.0))

    def _courses(self, missing):
        if self.courses_df is not None:
            return recommend_courses(missing, self.courses_df, top_n=5)
        MOCK = [
            {"course_title": "Python for Everybody",            "university": "Univ. of Michigan",   "url": "https://www.coursera.org/specializations/python",                             "difficulty": "Beginner",     "rating": 4.8, "skill": "python",          "relevance": 1},
            {"course_title": "Machine Learning Specialization", "university": "Stanford / DeepLearning.AI","url": "https://www.coursera.org/specializations/machine-learning-introduction","difficulty": "Intermediate", "rating": 4.9, "skill": "machine learning", "relevance": 1},
            {"course_title": "SQL for Data Science",            "university": "UC Davis",             "url": "https://www.coursera.org/learn/sql-for-data-science",                        "difficulty": "Beginner",     "rating": 4.6, "skill": "sql",             "relevance": 1},
            {"course_title": "AWS Cloud Practitioner",          "university": "Amazon Web Services",  "url": "https://www.coursera.org/learn/aws-cloud-practitioner-essentials",            "difficulty": "Beginner",     "rating": 4.7, "skill": "aws",             "relevance": 1},
            {"course_title": "Deep Learning Specialization",    "university": "DeepLearning.AI",      "url": "https://www.coursera.org/specializations/deep-learning",                     "difficulty": "Advanced",     "rating": 4.9, "skill": "deep learning",   "relevance": 1},
        ]
        if not missing:
            return [{"course_title": "No skill gaps.", "university": "", "url": "#", "skill": "-", "difficulty": "-", "rating": None, "relevance": 100}]
        return [c for c in MOCK if c["skill"] in missing][:5] or MOCK[:3]

    def _explain(self, tfidf_sim, skill_overlap, gap):
        reasons = []
        if tfidf_sim > 0.6:
            reasons.append("Strong keyword alignment — resume language closely mirrors the job description.")
        elif tfidf_sim > 0.3:
            reasons.append("Moderate keyword overlap — consider mirroring key terms from the job description.")
        else:
            reasons.append("Low keyword alignment — resume language diverges from job requirements.")
        if skill_overlap > 0.7:
            reasons.append(f"Candidate covers {gap['gap_score']}% of required skills — strong technical coverage.")
        elif skill_overlap > 0.4:
            reasons.append(f"Partial skill coverage ({gap['gap_score']}%) — upskilling recommended: {', '.join(gap['missing'][:3])}.")
        else:
            reasons.append(f"Significant skill gap ({gap['gap_score']}% coverage) — {len(gap['missing'])} skills need development.")
        return {
            "decision_factors": {"tfidf_similarity": round(tfidf_sim * 100, 1), "skill_overlap": round(skill_overlap * 100, 1)},
            "reasoning": reasons,
            "model": "Random Forest — 94.0% test accuracy" if not self.mock_mode else "Rule-based mock (MOCK_MODE=false for real RF)",
        }


matcher = ResumeMatcherAPI()
