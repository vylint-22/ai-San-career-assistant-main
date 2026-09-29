from flask import Flask, request, jsonify
from flask_cors import CORS
import fitz   # PyMuPDF
import spacy

app = Flask(__name__)
CORS(app)   # IMPORTANT

nlp = spacy.load("en_core_web_sm")

SKILLS = [
    "python", "java", "c", "c++",
    "html", "css", "javascript",
    "react", "node",
    "django", "fastapi",
    "sql", "mysql",
    "machine learning",
    "data structures", "algorithms",
    "dbms", "os", "git", "github"
]

def extract_text(file):
    try:
        doc = fitz.open(stream=file.read(), filetype="pdf")
        text = ""
        for page in doc:
            text += page.get_text()
        return text.lower()
    except Exception as e:
        print("PDF Error:", e)
        return ""

def extract_skills(text):
    found = []
    for skill in SKILLS:
        if skill in text:
            found.append(skill)
    return found

@app.route("/parse-resume", methods=["POST"])
def parse_resume():
    try:
        if "resume" not in request.files:
            return jsonify({"error": "No file uploaded"}), 400

        file = request.files["resume"]

        text = extract_text(file)
        skills = extract_skills(text)

        return jsonify({
            "skills": skills
        })

    except Exception as e:
        print("Server Error:", e)
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True, port=8000)