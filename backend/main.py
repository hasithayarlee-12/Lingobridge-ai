import json
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from gemini_client import call_gemini, call_gemini_vision
from pdf_parser import extract_text_from_pdf
from prompts import (
    build_chat_prompt,
    build_upload_prompt,
    build_image_prompt,
    build_quiz_prompt,
    build_scoring_prompt,
)

app = FastAPI(title="LingoBridge AI Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------- Request / Response models ----------

class ChatRequest(BaseModel):
    question: str
    language: str = "English"
    difficulty: str = "Beginner"

class ChatResponse(BaseModel):
    answer: str


class QuizGenerateRequest(BaseModel):
    topic: str
    language: str = "English"
    difficulty: str = "Beginner"


class QuizQuestion(BaseModel):
    question_text: str
    options: list[str]
    correct_answer: str


class QuizScoreRequest(BaseModel):
    questions: list[QuizQuestion]
    user_answers: list[str]
    language: str = "English"


# ---------- Routes ----------

@app.get("/health")
def health_check():
    return {"status": "ok"}


@app.post("/chat", response_model=ChatResponse)
def chat(req: ChatRequest):
    """Accept a question + language + difficulty, return an AI explanation."""
    prompt = build_chat_prompt(req.question, req.language, req.difficulty)
    answer = call_gemini(prompt)
    return ChatResponse(answer=answer)


@app.post("/upload", response_model=ChatResponse)
async def upload(
    file: UploadFile = File(...),
    language: str = Form("English"),
    difficulty: str = Form("Beginner"),
):
    """
    Accept a PDF or image upload.
    - PDF  → extract text with PyMuPDF → Gemini text model
    - Image → send inline bytes → Gemini vision
    """
    file_bytes = await file.read()
    filename = file.filename.lower() if file.filename else ""
    content_type = file.content_type or ""

    if filename.endswith(".pdf") or "pdf" in content_type:
        text = extract_text_from_pdf(file_bytes)
        prompt = build_upload_prompt(text, language, difficulty)
        answer = call_gemini(prompt)

    elif any(filename.endswith(ext) for ext in (".jpg", ".jpeg", ".png", ".webp")):
        mime = content_type if content_type.startswith("image/") else "image/jpeg"
        prompt = build_image_prompt(language, difficulty)
        answer = call_gemini_vision(prompt, file_bytes, mime)

    else:
        raise HTTPException(
            status_code=400,
            detail="Unsupported file type. Please upload a PDF, JPG, PNG, or WEBP image.",
        )

    return ChatResponse(answer=answer)


@app.post("/quiz/generate")
def quiz_generate(req: QuizGenerateRequest):
    """Generate 5 MCQs about the given topic. Returns a JSON array of questions."""
    prompt = build_quiz_prompt(req.topic, req.language, req.difficulty)
    raw = call_gemini(prompt)

    # Strip markdown code fences if Gemini wraps the JSON
    cleaned = raw.strip()
    if cleaned.startswith("```"):
        lines = cleaned.split("\n")
        # Remove first line (```json or ```) and last line (```)
        cleaned = "\n".join(lines[1:-1]).strip()

    try:
        questions = json.loads(cleaned)
    except json.JSONDecodeError:
        raise HTTPException(
            status_code=500,
            detail="AI returned malformed quiz data. Please try again.",
        )

    return {"questions": questions}


@app.post("/quiz/score")
def quiz_score(req: QuizScoreRequest):
    """Score the user's quiz answers and return revision suggestions."""
    questions_dicts = [q.model_dump() for q in req.questions]
    prompt = build_scoring_prompt(questions_dicts, req.user_answers, req.language)
    raw = call_gemini(prompt)

    cleaned = raw.strip()
    if cleaned.startswith("```"):
        lines = cleaned.split("\n")
        cleaned = "\n".join(lines[1:-1]).strip()

    try:
        result = json.loads(cleaned)
    except json.JSONDecodeError:
        raise HTTPException(
            status_code=500,
            detail="AI returned malformed scoring data. Please try again.",
        )

    return result
