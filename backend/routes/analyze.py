from flask import Blueprint, request, jsonify
from ml.matcher import matcher
from utils.validators import validate_analyze

analyze_bp = Blueprint("analyze", __name__)

@analyze_bp.post("/api/analyze")
@validate_analyze
def analyze():
    data = request.get_json()
    try:
        result = matcher.analyze(data["resume_text"].strip(), data["job_desc"].strip())
        return jsonify(result), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
