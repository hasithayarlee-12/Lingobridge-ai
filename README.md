# 🌐 LingoBridge AI — Multilingual AI Tutor
🚀 **[Live Demo](https://lingobridge-iqm2pqeqk-infer-x.vercel.app/)**
> A hackathon MVP that helps Indian college students understand technical
> content in their preferred language: **English, Hindi, Telugu, Tamil, Marathi, or Bengali**.

---

## 📦 Project Structure

```
Lingobridge-ai/
├── backend/          ← FastAPI + Python 3.14
│   ├── main.py           # 5 API routes
│   ├── gemini_client.py  # Google Gemini (gemini-3.6-flash)
│   ├── prompts.py        # All prompt builders
│   ├── pdf_parser.py     # PyMuPDF text extraction
│   ├── requirements.txt
│   ├── .env              # ← Your API key goes here (gitignored)
│   └── .env.example
└── frontend/         ← React 19 + Vite 8
    ├── index.html
    ├── vite.config.js    # Proxy /api → localhost:8000
    └── src/
        ├── App.jsx               # Root: routing, auth, session history
        ├── api/lingoApi.js       # All backend calls
        ├── config/languages.js   # 6 languages, speech codes
        ├── hooks/useSpeechInput.js
        ├── components/
        │   ├── AppShell.jsx      # Sidebar + topnav + Help modal
        │   └── VoiceFAB.jsx      # Floating mic button
        ├── pages/
        │   ├── Dashboard.jsx
        │   ├── AITutor.jsx       # Chat + upload + quiz
        │   ├── LanguageBot.jsx   # Language practice
        │   ├── Translator.jsx    # Text & PDF translation
        │   ├── History.jsx       # Session history
        │   ├── Settings.jsx
        │   └── Auth.jsx          # SignIn + CreateAccount
        └── styles/index.css      # Vibrant Clarity design system
```

---

## 🚀 How to Run

Open **two terminals** side by side.

### Terminal 1 — Backend

```powershell
cd backend
.\venv\Scripts\activate
uvicorn main:app --reload
```

The backend starts at **http://localhost:8000**
Health check: `http://localhost:8000/health` → `{"status":"ok"}`

### Terminal 2 — Frontend

```powershell
cd frontend
npm run dev
```

The app opens at **http://localhost:5173**

---

## 🔑 API Key

The key is already in `backend/.env`.
If it stops working, replace it:

```env
# backend/.env
GEMINI_API_KEY=your_key_here
```

Get a free key at: https://aistudio.google.com/app/apikey

---

## ✨ Features

| Feature | Description |
|---|---|
| 🎓 AI Tutor | Ask any question, get multilingual explanations at Beginner/Intermediate/Advanced level |
| 📎 File Upload | Upload PDF or image from textbook → AI explains the content |
| 🧠 Quiz | Generate 5 MCQs from any explained topic, score them, get revision suggestions |
| 💬 Language Bot | Conversational practice in 5 Indian languages with lesson paths |
| 🔄 Translator | Translate text or PDF documents between English and Indian languages |
| 🎤 Voice Input | Speak your questions/translations (Chrome/Edge) |
| 🕐 Session History | All activity tracked during your session |
| ❓ Help Center | In-app modal guide for all features |

---

## 🌐 Languages Supported

| Language | Script | Voice |
|---|---|---|
| English | Latin | ✅ en-US |
| Hindi | Devanagari | ✅ hi-IN |
| Telugu | Telugu | ✅ te-IN |
| Tamil | Tamil | ✅ ta-IN |
| Marathi | Devanagari | ✅ mr-IN |
| Bengali | Bengali | ✅ bn-IN |

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, Vite 8, Axios |
| Backend | FastAPI, Python 3.14, Uvicorn |
| AI | Google Gemini gemini-3.6-flash (google-genai SDK) |
| PDF | PyMuPDF (import pymupdf) |
| Voice | Web Speech API (browser-native, no key needed) |
| Fonts | Be Vietnam Pro · Noto Sans · Atkinson Hyperlegible Next |

---

## 📡 Backend Routes

| Method | Route | Purpose |
|---|---|---|
| GET | /health | Health check |
| POST | /chat | AI explanation (language + difficulty) |
| POST | /upload | PDF or image analysis |
| POST | /quiz/generate | Generate 5 MCQs as JSON |
| POST | /quiz/score | Score answers + revision suggestions |

---

## 🗒 Notes for Hackathon Demo

- **Auth is demo-only** — any email/password works, no real database
- **History is session-based** — resets on page refresh (no persistence)
- **Voice input** needs Chrome or Edge (not Firefox)
- **PDF extraction** is limited to first 5 pages for speed
- The Vite proxy handles CORS automatically — no manual CORS configuration needed
