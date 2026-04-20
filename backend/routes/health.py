from flask import Blueprint, jsonify
from ml.matcher import matcher

health_bp = Blueprint("health", __name__)

@health_bp.get("/api/health")
def health():
    return jsonify({
        "status":         "ok",
        "mock_mode":      matcher.mock_mode,
        "models_loaded":  matcher.rf is not None,
        "courses_loaded": matcher.courses_df is not None,
    })
