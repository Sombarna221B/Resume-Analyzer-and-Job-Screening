import io
from flask import Blueprint, request, jsonify

upload_bp = Blueprint("upload", __name__)

@upload_bp.post("/api/parse-resume")
def parse_resume():
    if "file" not in request.files:
        return jsonify({"error": "No file provided"}), 400
    f    = request.files["file"]
    name = f.filename.lower()
    try:
        if name.endswith(".txt"):
            text = f.read().decode("utf-8", errors="ignore")
        elif name.endswith(".pdf"):
            import fitz  # PyMuPDF
            doc  = fitz.open(stream=f.read(), filetype="pdf")
            text = "\n".join(page.get_text() for page in doc)
        elif name.endswith(".docx"):
            from docx import Document
            doc  = Document(io.BytesIO(f.read()))
            text = "\n".join(p.text for p in doc.paragraphs)
        else:
            return jsonify({"error": "Unsupported format. Use .txt, .pdf, or .docx"}), 400
        text = text.strip()
        if not text:
            return jsonify({"error": "Could not extract text from file."}), 422
        return jsonify({"text": text, "chars": len(text)}), 200
    except ImportError as e:
        return jsonify({"error": f"Missing dependency: {e}. pip install PyMuPDF python-docx"}), 500
    except Exception as e:
        return jsonify({"error": str(e)}), 500
