import re

TECH_SKILLS = [
    "python", "java", "scala", "r", "sql", "javascript", "typescript", "c++", "bash",
    "machine learning", "deep learning", "tensorflow", "pytorch", "scikit-learn",
    "nlp", "computer vision", "statistical modeling", "statistics",
    "pandas", "numpy", "scipy", "matplotlib", "seaborn",
    "aws", "azure", "gcp", "docker", "kubernetes", "devops", "jenkins",
    "spark", "pyspark", "hadoop", "kafka", "airflow", "hive",
    "mysql", "postgresql", "mongodb", "elasticsearch", "redis", "bigquery",
    "tableau", "power bi",
    "flask", "django", "fastapi", "react", "rest api",
    "git", "linux", "mlflow", "sap", "analytics",
]

def extract_skills(text: str) -> list[str]:
    text = text.lower()
    return [s for s in TECH_SKILLS if re.search(r"\b" + re.escape(s) + r"\b", text)]

def compute_skill_gap(resume_text: str, job_text: str) -> dict:
    from ml.text_cleaner import clean_text
    r = set(extract_skills(clean_text(resume_text)))
    j = set(extract_skills(clean_text(job_text)))
    return {
        "matched":   sorted(r & j),
        "missing":   sorted(j - r),
        "bonus":     sorted(r - j),
        "gap_score": round(len(r & j) / max(len(j), 1) * 100, 1),
    }
