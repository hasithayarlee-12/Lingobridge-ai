# LingoBridge AI — Hackathon Development Plan

## Top-Level Overview

**Goal:** Build an MVP of LingoBridge AI — a multilingual AI tutor for Indian college students — for a hackathon demo. The app will allow students to ask educational questions, select their preferred language (English, Hindi, Telugu) and difficulty level (Beginner, Intermediate, Advanced), and receive AI-generated explanations adapted to both. Additional features include voice input, document/image upload with explanation, and topic-based quiz generation with scoring.

**Tech Stack:**
- **Frontend:** React (Vite) — fast to scaffold, easy to deploy locally
- **Backend:** Python + FastAPI — lightweight, fast to write, great AI library support
- **AI Provider:** Google Gemini API (gemini-1.5-flash model) — free tier, multilingual, supports vision and long-context
- **PDF Parsing:** PyMuPDF (fitz) — extract text from PDFs on the backend
- **Voice Input:** Browser Web Speech API — no extra key, works in Chrome
- **No database** — all state lives in the browser session (simple for hackathon)

**Deployment:** Local laptop (React on port 5173, FastAPI on port 8000)

**Scope:** Full MVP with all 8 core features implemented in order of dependency.

---

## Architecture Overview

```
User Browser
  └── React Frontend (Vite, port 5173)
        ├── Chat UI (language/level selectors + chat messages)
        ├── Voice Input (Web Speech API)
        ├── File Upload (image or PDF)
        └── Quiz UI (questions, answers, score, suggestions)
              │
              │ HTTP (fetch/axios)
              ▼
       FastAPI Backend (port 8000)
        ├── POST /chat          → Gemini text chat
        ├── POST /upload        → PDF text extract or image → Gemini
        ├── POST /quiz/generate → Gemini quiz generation
        └── POST /quiz/score    → Gemini quiz scoring + revision
              │
              ▼
       Google Gemini API (gemini-1.5-flash)
```

---

## Environment Variables / API Keys Required

| Variable | Where to get it | Used by |
|---|---|---|
| `GEMINI_API_KEY` | Google AI Studio (aistudio.google.com) | FastAPI backend |

The frontend needs no secrets. The API key lives in a `.env` file in the backend folder and is never sent to the browser.

---

## Folder Structure

```
lingobridge-ai/
├── backend/
│   ├── main.py              # FastAPI app, all route handlers
│   ├── gemini_client.py     # Wrapper for Gemini API calls
│   ├── pdf_parser.py        # PyMuPDF PDF text extraction
│   ├── prompts.py           # All system prompt templates
│   ├── requirements.txt     # Python dependencies
│   └── .env                 # GEMINI_API_KEY (not committed to git)
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── App.jsx          # Root layout, global state
│   │   ├── main.jsx         # Vite entry point
│   │   ├── components/
│   │   │   ├── LanguageLevelSelector.jsx   # Language + difficulty dropdowns
│   │   │   ├── ChatWindow.jsx              # Message list display
│   │   │   ├── ChatInput.jsx               # Text input + voice button + send
│   │   │   ├── FileUpload.jsx              # PDF/image drag-drop or click upload
│   │   │   └── QuizPanel.jsx               # Quiz display, answer selection, scoring
│   │   ├── hooks/
│   │   │   └── useSpeechInput.js           # Web Speech API hook
│   │   ├── api/
│   │   │   └── lingoApi.js                 # All fetch calls to backend
│   │   └── styles/
│   │       └── index.css
│   ├── index.html
│   ├── vite.config.js       # Proxy /api → localhost:8000
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## MVP Features (Build These)

| # | Feature | Included in MVP |
|---|---|---|
| 1 | Language selector (English/Hindi/Telugu) | ✅ Yes |
| 2 | Difficulty selector (Beginner/Intermediate/Advanced) | ✅ Yes |
| 3 | AI chat for educational questions | ✅ Yes |
| 4 | AI explanations adapted to language + level | ✅ Yes |
| 5 | Voice input (Web Speech API) | ✅ Yes |
| 6 | Upload PDF or image and get explanation | ✅ Yes |
| 7 | Generate quiz from explained topic | ✅ Yes |
| 8 | Score quiz and give revision suggestions | ✅ Yes |

## Postponed / Out of Scope

| Feature | Reason to Postpone |
|---|---|
| User accounts / login | Adds database + auth complexity, not needed for demo |
| Chat history persistence | No database in MVP; session state is enough |
| Mobile app | Web demo is sufficient for hackathon |
| Text-to-speech (audio output) | Nice to have but complex; not in MVP |
| Support for more languages | Add after Hindi/Telugu are proven |
| Streaming AI responses | Simpler to do full response for now |

---

## Development Phases

### Phase 1 — Project Scaffolding
Set up the empty folder structure, initialize the React app with Vite, set up the FastAPI project, and confirm both servers run locally.

### Phase 2 — Backend Core (Gemini Chat)
Build the `/chat` endpoint in FastAPI that accepts a question, language, and difficulty level, constructs the correct prompt, calls the Gemini API, and returns the AI explanation. This is the most critical feature.

### Phase 3 — Frontend Chat UI
Build the React chat interface: language/level selectors, a message input box, a chat message display area, and wire it to the `/chat` backend endpoint. The user can now ask questions and get multilingual answers.

### Phase 4 — Voice Input
Add a microphone button to the chat input that uses the browser's Web Speech API to transcribe voice into the text field. The user can then send the transcribed text as a normal chat message.

### Phase 5 — File Upload (PDF + Image)
Build the `/upload` backend endpoint. For PDFs, use PyMuPDF to extract text and pass it to Gemini with an explanation prompt. For images, send them directly to Gemini Vision. Wire the `FileUpload` React component to this endpoint so the user gets an explanation pasted into the chat.

### Phase 6 — Quiz Generation
Build the `/quiz/generate` backend endpoint that takes the last explained topic, language, and difficulty, and asks Gemini to generate 5 multiple-choice questions in JSON format. Build the `QuizPanel` React component to display the questions and let the user pick answers.

### Phase 7 — Quiz Scoring + Revision Suggestions
Build the `/quiz/score` backend endpoint that receives the questions and the user's answers, sends them to Gemini, and gets back a score + specific revision suggestions. Display the results in the `QuizPanel`.

### Phase 8 — Polish + Demo Prep
Style the UI to look clean and presentable, add the LingoBridge AI logo/name, test all features end-to-end in Hindi and Telugu, and write the README with setup instructions.

---

## Sub-Tasks

---

### Sub-Task 1 — Project Scaffolding

**Intent:** Create the empty folder structure and confirm both servers start without errors. No features yet — just the skeleton.

**Expected Outcomes:**
- `frontend/` folder with a running Vite + React app at `localhost:5173`
- `backend/` folder with a running FastAPI server at `localhost:8000`
- `GET /health` endpoint on FastAPI returns `{ "status": "ok" }`
- `.gitignore` excludes `node_modules/`, `__pycache__/`, `.env`

**Todo List:**
1. Create the root folder structure as defined above
2. Run `npm create vite@latest frontend -- --template react` inside the project root
3. Run `npm install` in `frontend/`
4. Create `backend/requirements.txt` with: `fastapi`, `uvicorn`, `google-generativeai`, `PyMuPDF`, `python-dotenv`, `python-multipart`
5. Create `backend/main.py` with a minimal FastAPI app and a `GET /health` endpoint
6. Create `backend/.env` with a placeholder `GEMINI_API_KEY=your_key_here`
7. Create `.gitignore` at root
8. Test: run `uvicorn main:app --reload` in backend and `npm run dev` in frontend simultaneously
9. Confirm both servers respond

**Relevant Context:** No existing code. Start fresh.

**Status:** [x] done

---

### Sub-Task 2 — Backend Core: Gemini Chat Endpoint

**Intent:** Build the central AI feature — a FastAPI endpoint that accepts a user question, language, and difficulty level, and returns an AI-generated explanation in the correct language and style.

**Expected Outcomes:**
- `POST /chat` accepts JSON: `{ question, language, difficulty }`
- Returns JSON: `{ answer: "..." }`
- Gemini responds in the requested language
- A Beginner explanation is simpler than an Advanced one
- API key is loaded from `.env`, never hardcoded

**Todo List:**
1. Create `backend/gemini_client.py` — initialize the Gemini SDK using the API key from `.env`
2. Create `backend/prompts.py` — write a `build_chat_prompt(question, language, difficulty)` function that returns a complete system prompt string
3. The system prompt must instruct Gemini to: respond in the selected language, use vocabulary appropriate for the difficulty level, give a structured explanation with examples
4. Add the `POST /chat` route in `main.py` that calls `gemini_client.py` with the constructed prompt
5. Test using a REST client (like `curl` or browser fetch) with a sample question

**Relevant Context:**
- `backend/gemini_client.py`, `backend/prompts.py`, `backend/main.py`
- Gemini model to use: `gemini-1.5-flash`
- System prompt language instruction example: "Respond entirely in Hindi. Use simple Hindi vocabulary."

**Status:** [x] done

---

### Sub-Task 3 — Frontend Chat UI

**Intent:** Build the visible React interface so users can type a question, select language/difficulty, and see the AI response in the chat window.

**Expected Outcomes:**
- `LanguageLevelSelector` component renders two dropdowns: Language and Difficulty
- `ChatWindow` component displays the conversation (user messages on right, AI on left)
- `ChatInput` component has a text box and a Send button
- Sending a question calls `POST /chat` and shows the AI response
- Selected language and difficulty are passed with every request
- The Vite proxy forwards `/api/*` to `localhost:8000` to avoid CORS issues

**Todo List:**
1. Configure `vite.config.js` to proxy `/api` to `http://localhost:8000`
2. Create `src/api/lingoApi.js` with a `sendChat(question, language, difficulty)` function
3. Create `LanguageLevelSelector.jsx` with controlled dropdowns for language and difficulty
4. Create `ChatWindow.jsx` that renders a list of `{ role, text }` message objects
5. Create `ChatInput.jsx` with a text input and Send button
6. Wire everything together in `App.jsx` with shared state for messages, language, difficulty
7. Test end-to-end: type a question → select Hindi + Beginner → click Send → see response

**Relevant Context:**
- `frontend/src/App.jsx`, `frontend/src/api/lingoApi.js`
- `frontend/src/components/ChatInput.jsx`, `ChatWindow.jsx`, `LanguageLevelSelector.jsx`
- Vite proxy config goes in `frontend/vite.config.js`

**Status:** [x] done

---

### Sub-Task 4 — Voice Input

**Intent:** Let users speak their question instead of typing, using the browser's built-in speech recognition.

**Expected Outcomes:**
- A microphone button appears in `ChatInput`
- Clicking it starts listening; speaking populates the text field
- Works in Chrome (Web Speech API is Chrome-native)
- No new backend endpoint needed

**Todo List:**
1. Create `src/hooks/useSpeechInput.js` using `window.SpeechRecognition` or `window.webkitSpeechRecognition`
2. The hook should expose: `startListening()`, `stopListening()`, `transcript` (the recognized text), `isListening` (boolean)
3. Set the recognition language based on the currently selected language (e.g., `hi-IN` for Hindi, `te-IN` for Telugu, `en-US` for English)
4. Add a mic icon button to `ChatInput.jsx` that calls `startListening()` and sets the input field value to `transcript`
5. Show a visual indicator (e.g., red dot or "Listening...") when `isListening` is true
6. Test: speak a question in Hindi → text appears in input → send it

**Relevant Context:**
- `frontend/src/hooks/useSpeechInput.js`
- `frontend/src/components/ChatInput.jsx`
- Language code map: `{ English: 'en-US', Hindi: 'hi-IN', Telugu: 'te-IN' }`

**Status:** [x] done

---

### Sub-Task 5 — File Upload (PDF + Image)

**Intent:** Allow users to upload a PDF or image of a textbook page and get an AI explanation of its content.

**Expected Outcomes:**
- `POST /upload` backend endpoint accepts a file upload (PDF or image)
- For PDFs: extract text with PyMuPDF and send to Gemini text model
- For images: send base64-encoded image directly to Gemini Vision
- Response is the same format as `/chat` — a text explanation
- `FileUpload.jsx` component shows a drag-and-drop or click-to-upload area
- After upload, the explanation appears in the main chat window

**Todo List:**
1. Create `backend/pdf_parser.py` with a `extract_text_from_pdf(file_bytes)` function using PyMuPDF
2. Add `POST /upload` in `main.py` that:
   - Accepts a `multipart/form-data` request with the file + language + difficulty fields
   - Detects file type by extension or MIME type
   - If PDF: extract text → build explanation prompt → call Gemini text model
   - If image (jpg/png/webp): encode to base64 → call Gemini Vision model
3. Add `uploadFile(file, language, difficulty)` function in `lingoApi.js`
4. Create `FileUpload.jsx` with a file input button
5. On upload success, push the AI explanation as a new AI message in the chat
6. Test: upload a PDF page → get explanation in Hindi → upload a photo of a diagram → get description

**Relevant Context:**
- `backend/pdf_parser.py`, `backend/main.py`
- `frontend/src/components/FileUpload.jsx`
- `frontend/src/api/lingoApi.js`
- PyMuPDF import: `import fitz`
- Gemini Vision requires sending the image as a Part object with inline_data

**Status:** [x] done

---

### Sub-Task 6 — Quiz Generation

**Intent:** After a topic has been explained, allow the user to generate a quiz to test their understanding.

**Expected Outcomes:**
- `POST /quiz/generate` accepts `{ topic, language, difficulty }` and returns 5 MCQs
- Each question has: `question_text`, `options` (list of 4), `correct_answer` (the correct option text)
- The JSON is structured so the frontend can render it easily
- `QuizPanel.jsx` displays the questions with radio button options
- The user can select answers and click "Submit Quiz"

**Todo List:**
1. Add a `build_quiz_prompt(topic, language, difficulty)` function in `prompts.py` that asks Gemini to return a JSON array of 5 MCQ objects
2. Add `POST /quiz/generate` in `main.py` that calls Gemini and parses the JSON from the response
3. Add a safeguard: ask Gemini to return only valid JSON with no extra text (use a strict prompt instruction)
4. Add `generateQuiz(topic, language, difficulty)` in `lingoApi.js`
5. Create `QuizPanel.jsx` that receives the questions array and renders each one
6. Add a "Generate Quiz" button somewhere in the UI (e.g., below the last AI message) that passes the last topic to the quiz endpoint
7. Test: explain "Newton's Laws" in Telugu → click Generate Quiz → 5 questions appear in Telugu

**Relevant Context:**
- `backend/prompts.py`, `backend/main.py`
- `frontend/src/components/QuizPanel.jsx`
- `frontend/src/api/lingoApi.js`
- The quiz topic can be inferred from the last user question in the chat

**Status:** [x] done

---

### Sub-Task 7 — Quiz Scoring + Revision Suggestions

**Intent:** After the user answers the quiz, score their responses and provide targeted revision suggestions for wrong answers.

**Expected Outcomes:**
- `POST /quiz/score` accepts the questions + the user's selected answers
- Returns: `{ score: "3/5", results: [...], revision_suggestions: "..." }`
- `QuizPanel.jsx` shows correct/wrong indicators per question after submission
- Revision suggestions are shown as a block of text below the score
- The suggestions are in the same language as the quiz

**Todo List:**
1. Add `build_scoring_prompt(questions, user_answers, language)` in `prompts.py` that asks Gemini to evaluate answers and give revision tips
2. Add `POST /quiz/score` in `main.py`
3. Add `scoreQuiz(questions, userAnswers, language)` in `lingoApi.js`
4. Update `QuizPanel.jsx` to handle a "submitted" state — show the score, highlight correct/wrong answers, and display revision suggestions
5. Test: answer 3 out of 5 correctly → score shows "3/5" → suggestions mention the topics of wrong answers

**Relevant Context:**
- `backend/prompts.py`, `backend/main.py`
- `frontend/src/components/QuizPanel.jsx`
- `frontend/src/api/lingoApi.js`

**Status:** [x] done

---

### Sub-Task 8 — UI Polish + Demo Prep

**Intent:** Make the app look clean and presentable for the hackathon demo, and ensure all features work together reliably.

**Expected Outcomes:**
- App has a clear header with "LingoBridge AI" branding
- All components are styled consistently (colors, fonts, spacing)
- Language/difficulty selector is clearly visible
- Chat bubbles clearly distinguish user vs AI messages
- Quiz panel looks distinct from the chat window
- README has local setup instructions (install, run backend, run frontend)
- End-to-end test in all 3 languages passes

**Todo List:**
1. Add a clean header component with app name and tagline ("Your AI Tutor in Your Language")
2. Style `ChatWindow.jsx` — user bubble on right (blue), AI bubble on left (grey), with avatar icons
3. Style `QuizPanel.jsx` — card-style questions, green for correct, red for wrong after submission
4. Style `FileUpload.jsx` — dashed border drag-drop zone
5. Ensure the Vite proxy is correctly configured so there are no CORS errors in the demo
6. Write `README.md` with: prerequisites, how to get Gemini API key, how to run backend, how to run frontend
7. Do a full end-to-end run: ask in Hindi → upload a PDF → generate quiz → score quiz → check revision

**Relevant Context:**
- All frontend components
- `README.md`

**Status:** [x] done

---

## How to Test Each Feature

| Feature | How to Test |
|---|---|
| Gemini Chat | Use `curl -X POST localhost:8000/chat -d '{"question":"What is gravity?","language":"Hindi","difficulty":"Beginner"}'` |
| Language switching | Ask the same question with language set to English, Hindi, Telugu — verify response language changes |
| Difficulty switching | Ask the same question at Beginner vs Advanced — verify vocabulary complexity differs |
| Voice input | Open Chrome, click mic, say "What is photosynthesis", verify text appears in input |
| PDF upload | Upload a 1-2 page PDF of any textbook — verify explanation appears in chat |
| Image upload | Upload a photo of a diagram — verify description appears in chat |
| Quiz generation | After any explanation, click "Generate Quiz" — verify 5 questions appear |
| Quiz scoring | Answer some questions wrong — verify score and revision suggestions appear |

---

## Potential Technical Risks

| Risk | Likelihood | Mitigation |
|---|---|---|
| Gemini API rate limits on free tier | Medium | Use `gemini-1.5-flash` (higher free quota than Pro). Add a simple error message if rate-limited. |
| Gemini returns malformed JSON for quiz | Medium | Wrap the quiz JSON parse in a try/except and retry once. Use a strict prompt instruction: "Return only valid JSON, no extra text." |
| Web Speech API not working | Low | Only works in Chrome. Tell users to use Chrome. Show a fallback message in other browsers. |
| CORS errors between React and FastAPI | Medium | Use the Vite proxy so all frontend requests go to `/api/...` which Vite forwards to FastAPI. Add FastAPI CORS middleware as backup. |
| PyMuPDF install issues on Windows | Low | Include exact install command in README: `pip install PyMuPDF`. Test before the demo. |
| Gemini Vision not reading low-quality images | Low | Add a note in the UI: "For best results, upload a clear, well-lit image." |
| Large PDF extraction too slow | Low | Limit to first 5 pages in `pdf_parser.py` for the demo. |
| Hindi/Telugu speech recognition accuracy | Medium | Use a clear microphone. For the demo, have a typed backup ready. |
