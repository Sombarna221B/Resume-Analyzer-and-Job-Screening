import re
import pandas as pd

def prepare_courses(df: pd.DataFrame) -> pd.DataFrame:
    df = df.rename(columns={
        "Course Name":      "course_title",
        "University":       "university",
        "Difficulty Level": "difficulty",
        "Course Rating":    "rating",
        "Course URL":       "url",
        "Skills":           "skills_text",
    }).copy()
    df["rating"] = pd.to_numeric(df["rating"], errors="coerce")
    df["rating"].fillna(df["rating"].median(), inplace=True)
    df["difficulty"] = df["difficulty"].replace({"Conversant": "Intermediate", "Not Calibrated": "N/A"})
    df["search_text"] = (df["course_title"].fillna("") + " " + df["skills_text"].fillna("")).str.lower()
    return df

def recommend_courses(missing_skills: list[str], courses_df: pd.DataFrame, top_n: int = 5) -> list[dict]:
    if not missing_skills:
        return [{"course_title": "No skill gaps identified.", "university": "", "url": "#",
                 "skill": "-", "difficulty": "-", "rating": None, "relevance": 100}]
    scored = []
    for _, row in courses_df.iterrows():
        text = row["search_text"]
        hits = sum(bool(re.search(r"\b" + re.escape(s) + r"\b", text)) for s in missing_skills)
        if hits > 0:
            matched = next((s for s in missing_skills if re.search(r"\b" + re.escape(s) + r"\b", text)), missing_skills[0])
            scored.append({"course_title": row["course_title"], "university": row.get("university", ""),
                           "url": row["url"], "difficulty": row["difficulty"],
                           "rating": float(row["rating"]), "skill": matched, "relevance": hits})
    scored.sort(key=lambda x: (x["relevance"], x["rating"]), reverse=True)
    seen, results = set(), []
    for c in scored:
        if c["skill"] not in seen or len(results) < 3:
            results.append(c); seen.add(c["skill"])
        if len(results) >= top_n:
            break
    for s in missing_skills:
        if s not in seen and len(results) < top_n:
            results.append({"course_title": f"Coursera Search: {s.title()}", "university": "Coursera",
                            "url": f"https://www.coursera.org/search?query={s.replace(' ', '+')}",
                            "difficulty": "Varies", "rating": None, "skill": s, "relevance": 0})
            seen.add(s)
    return results[:top_n]
