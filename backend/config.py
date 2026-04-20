import os

class Config:
    SECRET_KEY       = os.getenv("SECRET_KEY", "dev-secret")
    MODEL_PATH       = os.getenv("MODEL_PATH",       "models/rf_model_95pct.pkl")
    VECTORIZER_PATH  = os.getenv("VECTORIZER_PATH",  "models/tfidf_vectorizer.pkl")
    COURSERA_PATH    = os.getenv("COURSERA_PATH",    "data/Coursera.xlsx")
    JOBS_PATH        = os.getenv("JOBS_PATH",        "data/naukri_data_science_jobs_india.xlsx")
    MOCK_MODE        = os.getenv("MOCK_MODE", "true").lower() == "true"
    CORS_ORIGINS     = os.getenv("CORS_ORIGINS", "http://localhost:5173").split(",")
