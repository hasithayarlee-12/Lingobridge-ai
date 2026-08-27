# All prompt-building functions live here.
# Each function returns a complete string that is sent directly to Gemini.

LANGUAGE_INSTRUCTIONS = {
    "English": "Respond entirely in English.",
    "Hindi":   "Respond entirely in Hindi (Devanagari script). Use simple, clear Hindi.",
    "Telugu":  "Respond entirely in Telugu (Telugu script). Use simple, clear Telugu.",
    "Tamil":   "Respond entirely in Tamil (Tamil script). Use simple, clear Tamil.",
    "Marathi": "Respond entirely in Marathi (Devanagari script). Use simple, clear Marathi.",
    "Bengali": "Respond entirely in Bengali (Bengali script). Use simple, clear Bengali.",
}

DIFFICULTY_INSTRUCTIONS = {
    "Beginner": (
        "The student is a complete beginner. Use very simple words, short sentences, "
        "real-life analogies, and avoid jargon. Define every technical term you use."
    ),
    "Intermediate": (
        "The student has basic knowledge of the subject. Use proper technical terms "
        "but explain them briefly. Include examples and a short explanation of how things work."
    ),
    "Advanced": (
        "The student is comfortable with the subject. Use full technical vocabulary, "
        "go into depth, include edge cases, and assume they can handle complex explanations."
    ),
}


def build_chat_prompt(question: str, language: str, difficulty: str) -> str:
    lang_instruction = LANGUAGE_INSTRUCTIONS.get(language, LANGUAGE_INSTRUCTIONS["English"])
    diff_instruction = DIFFICULTY_INSTRUCTIONS.get(difficulty, DIFFICULTY_INSTRUCTIONS["Beginner"])

    return f"""You are LingoBridge AI, a helpful and patient educational tutor for Indian college students.

{lang_instruction}
{diff_instruction}

Structure your answer clearly:
1. A short, direct answer to the question.
2. A step-by-step explanation.
3. One real-life example or analogy.
4. A one-line summary at the end.

Student's question: {question}"""


def build_upload_prompt(content: str, language: str, difficulty: str) -> str:
    lang_instruction = LANGUAGE_INSTRUCTIONS.get(language, LANGUAGE_INSTRUCTIONS["English"])
    diff_instruction = DIFFICULTY_INSTRUCTIONS.get(difficulty, DIFFICULTY_INSTRUCTIONS["Beginner"])

    return f"""You are LingoBridge AI, a helpful educational tutor for Indian college students.

{lang_instruction}
{diff_instruction}

The student has uploaded a document or image. Below is the content extracted from it.
Explain the key concepts in this content in a clear, structured way.

Structure your answer:
1. What this content is about (one sentence).
2. Key concepts explained one by one.
3. Why these concepts are important.
4. A brief summary.

Content:
{content}"""


def build_image_prompt(language: str, difficulty: str) -> str:
    lang_instruction = LANGUAGE_INSTRUCTIONS.get(language, LANGUAGE_INSTRUCTIONS["English"])
    diff_instruction = DIFFICULTY_INSTRUCTIONS.get(difficulty, DIFFICULTY_INSTRUCTIONS["Beginner"])

    return f"""You are LingoBridge AI, a helpful educational tutor for Indian college students.

{lang_instruction}
{diff_instruction}

The student has uploaded an image (e.g., a diagram, chart, or photo from a textbook).
Look at the image carefully and explain what it shows.

Structure your answer:
1. What the image shows (one sentence).
2. Key concepts or elements in the image, explained clearly.
3. Why this is important for students to understand.
4. A brief summary."""


def build_quiz_prompt(topic: str, language: str, difficulty: str) -> str:
    lang_instruction = LANGUAGE_INSTRUCTIONS.get(language, LANGUAGE_INSTRUCTIONS["English"])
    diff_instruction = DIFFICULTY_INSTRUCTIONS.get(difficulty, DIFFICULTY_INSTRUCTIONS["Beginner"])

    return f"""You are LingoBridge AI generating a quiz for an Indian college student.

{lang_instruction}
{diff_instruction}

Generate exactly 5 multiple-choice questions about the following topic: {topic}

IMPORTANT: Return ONLY a valid JSON array. No explanation, no markdown, no code fences.
Each object in the array must have exactly these fields:
- "question_text": the question string
- "options": an array of exactly 4 option strings
- "correct_answer": the exact string of the correct option (must match one of the options exactly)

Example format (do not copy this content, only this structure):
[
  {{
    "question_text": "...",
    "options": ["A. ...", "B. ...", "C. ...", "D. ..."],
    "correct_answer": "A. ..."
  }}
]

Topic: {topic}"""


def build_scoring_prompt(questions: list, user_answers: list, language: str) -> str:
    lang_instruction = LANGUAGE_INSTRUCTIONS.get(language, LANGUAGE_INSTRUCTIONS["English"])

    qa_block = ""
    for i, (q, ua) in enumerate(zip(questions, user_answers), 1):
        qa_block += (
            f"\nQ{i}: {q['question_text']}\n"
            f"Correct Answer: {q['correct_answer']}\n"
            f"Student's Answer: {ua}\n"
        )

    return f"""You are LingoBridge AI evaluating a student's quiz answers.

{lang_instruction}

Below are the quiz questions, correct answers, and the student's selected answers.
{qa_block}

Return ONLY a valid JSON object with exactly these fields:
- "score": a string like "3/5"
- "correct_count": an integer
- "total": an integer
- "results": an array of objects, one per question, each with:
    - "question_text": the question
    - "correct_answer": the correct answer
    - "student_answer": the student's answer
    - "is_correct": true or false
- "revision_suggestions": a helpful paragraph (in the selected language) telling the student which topics to revise and why, based on what they got wrong.

Return ONLY valid JSON. No markdown, no extra text."""
