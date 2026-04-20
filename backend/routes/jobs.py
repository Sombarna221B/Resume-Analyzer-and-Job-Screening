import os
import pandas as pd
from flask import Blueprint, request, jsonify, current_app

jobs_bp  = Blueprint("jobs", __name__)
_cache   = None

def _load():
    global _cache
    if _cache is not None:
        return _cache
    path = current_app.config.get("JOBS_PATH", "data/naukri_data_science_jobs_india.xlsx")
    if os.path.exists(path):
        df = pd.read_excel(path)
        _cache = df[["Job_Role","Company","Location","Skills/Description"]].rename(columns={
            "Job_Role": "title", "Company": "company",
            "Location": "location", "Skills/Description": "description"
        }).dropna(subset=["description"]).reset_index(drop=True)
    else:
        _cache = pd.DataFrame([
            {"title":"Senior Data Scientist", "company":"UPL",       "location":"Bangalore", "description":"python, machine learning, statistical modeling, scala, aws, statistics"},
            {"title":"Data Engineer",         "company":"Infosys",   "location":"Hyderabad", "description":"python, sql, spark, kafka, airflow, aws, docker, pyspark"},
            {"title":"ML Engineer",           "company":"Flipkart",  "location":"Bangalore", "description":"python, pytorch, deep learning, mlflow, kubernetes, docker, tensorflow"},
            {"title":"Data Analyst",          "company":"Razorpay",  "location":"Bangalore", "description":"sql, python, tableau, analytics, pandas, statistics"},
            {"title":"Azure Data Engineer",   "company":"TCS",       "location":"Pune",      "description":"azure, python, spark, pyspark, sql, bigquery"},
            {"title":"NLP Engineer",          "company":"Swiggy",    "location":"Bangalore", "description":"python, nlp, deep learning, pytorch, tensorflow, spacy"},
            {"title":"Business Analyst",      "company":"HDFC Bank", "location":"Mumbai",    "description":"sql, analytics, tableau, power bi, statistics, python"},
            {"title":"DevOps Engineer",       "company":"Zomato",    "location":"Gurgaon",   "description":"docker, kubernetes, jenkins, devops, python, linux, aws"},
        ])
    return _cache

@jobs_bp.get("/api/jobs")
def get_jobs():
    q     = request.args.get("q", "").lower().strip()
    limit = int(request.args.get("limit", 25))
    df    = _load()
    if q:
        mask = (df["title"].str.lower().str.contains(q, na=False) |
                df["company"].str.lower().str.contains(q, na=False) |
                df["description"].str.lower().str.contains(q, na=False))
        df = df[mask]
    rows = df.head(limit).reset_index()
    return jsonify({"jobs": [
        {"id": int(r["index"]), "title": r["title"], "company": r["company"],
         "location": r.get("location",""), "description": r["description"]}
        for _, r in rows.iterrows()
    ], "total": len(rows)})

@jobs_bp.get("/api/jobs/<int:job_id>")
def get_job(job_id):
    df = _load()
    if job_id < 0 or job_id >= len(df):
        return jsonify({"error": "Not found"}), 404
    r = df.iloc[job_id]
    return jsonify({"id": job_id, "title": r["title"], "company": r["company"],
                    "location": r.get("location",""), "description": r["description"]})
