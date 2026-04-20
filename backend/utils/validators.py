from flask import request, jsonify
from functools import wraps

def validate_analyze(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        data = request.get_json(silent=True)
        if not data:
            return jsonify({"error": "Request body must be JSON."}), 400
        if not data.get("resume_text", "").strip():
            return jsonify({"error": "resume_text is required."}), 400
        if len(data["resume_text"].strip()) < 30:
            return jsonify({"error": "resume_text too short (min 30 chars)."}), 400
        if not data.get("job_desc", "").strip():
            return jsonify({"error": "job_desc is required."}), 400
        return f(*args, **kwargs)
    return decorated
