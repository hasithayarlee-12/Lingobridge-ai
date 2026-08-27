// Language Bot page — conversational language practice
import { useState, useEffect, useRef } from 'react';
import { sendChat } from '../api/lingoApi';
import { useSpeechInput } from '../hooks/useSpeechInput';
import { LANGUAGES, DIFFICULTIES } from '../config/languages';

const LEARNING_PATH = [
  { id: 'greetings', label: 'Greetings',          sub: 'Basic introductions & polite phrases', done: true  },
  { id: 'daily',     label: 'Daily Conversations', sub: 'Everyday talk',                        done: true  },
  { id: 'food',      label: 'Ordering Food',       sub: 'Restaurant & menus',                   active: true },
  { id: 'travel',    label: 'Travel & Transport',  sub: 'Directions & transport'                             },
  { id: 'smalltalk', label: 'Small Talk',          sub: 'Weather, sports, family'                            },
  { id: 'business',  label: 'Business Language',   sub: 'Professional vocabulary'                            },
];

const SUGGESTED = [
  'How do I say "I am vegetarian"?',
  'Ask for water in Hindi',
  'How do I request the bill?',
];

export default function LanguageBot({ language: globalLang, difficulty: globalDiff, onAddHistory }) {
  const [targetLang,   setTargetLang]   = useState('Hindi');
  const [difficulty,   setDifficulty]   = useState(globalDiff || 'Beginner');
  const [activeLesson, setActiveLesson] = useState('food');
  const [messages,     setMessages]     = useState([{
    role: 'ai',
    text: "Namaste! 🙏 Let's practice ordering food. How would you say 'Can I get the menu, please?' in Hindi?",
  }]);
  const [input,        setInput]        = useState('');
  const [isLoading,    setIsLoading]    = useState(false);
  const [error,        setError]        = useState('');

  const chatEndRef = useRef(null);

  // Sync difficulty from global settings
  useEffect(() => { setDifficulty(globalDiff || 'Beginner'); }, [globalDiff]);

  // Auto-scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // When lesson changes, send an AI intro for that lesson
  useEffect(() => {
    const lesson = LEARNING_PATH.find(s => s.id === activeLesson);
    if (!lesson) return;
    setMessages([{
      role: 'ai',
      text: `Let's start: **${lesson.label}** — ${lesson.sub}. Ask me anything about this topic in ${targetLang} or English!`,
    }]);
  }, [activeLesson, targetLang]); // eslint-disable-line

  const { transcript, isListening, isSupported, startListening, stopListening, clearTranscript } =
    useSpeechInput(targetLang);

  useEffect(() => {
    if (transcript) { setInput(transcript); clearTranscript(); }
  }, [transcript]); // eslint-disable-line

  // 2 completed + active = approx 42% of 6
  const completedCount = LEARNING_PATH.filter(s => s.done).length;
  const progress = Math.round((completedCount / LEARNING_PATH.length) * 100);

  async function handleSend(q) {
    const question = (q || input).trim();
    if (!question) return;
    setInput('');
    setMessages(p => [...p, { role: 'user', text: question }]);
    setIsLoading(true); setError('');

    const lessonLabel = LEARNING_PATH.find(s => s.id === activeLesson)?.label || 'Practice';

    try {
      const prompt = `You are a language learning tutor helping a student practice ${targetLang} at ${difficulty} level.
Current lesson: "${lessonLabel}".
The student said: "${question}"

Respond helpfully in English with:
1. A positive response to their attempt (if they tried in ${targetLang})
2. The correct ${targetLang} phrase in both native script and phonetic pronunciation
3. A brief word-by-word breakdown
4. An encouraging next step`;

      const answer = await sendChat(prompt, 'English', difficulty);
      setMessages(p => [...p, { role: 'ai', text: answer }]);
      onAddHistory?.(
        'Language Bot',
        `${targetLang} — ${lessonLabel}`,
        targetLang,
        { difficulty }
      );
    } catch (err) {
      setError(err?.response?.data?.detail || 'Error. Is the backend running?');
    } finally { setIsLoading(false); }
  }

  return (
    <div className="langbot-layout">
      {/* ── Learning Path sidebar ── */}
      <aside className="langbot-panel">
        <div style={{ marginBottom: '1rem' }}>
          <div className="t-headline-sm" style={{ marginBottom: 4 }}>Learning Path</div>

          <select
            className="lb-select"
            style={{ width: '100%', marginBottom: 10 }}
            value={targetLang}
            onChange={e => setTargetLang(e.target.value)}
          >
            {LANGUAGES.filter(l => l.value !== 'English').map(l => (
              <option key={l.value} value={l.value}>{l.flag} {l.value}</option>
            ))}
          </select>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
            <span className="t-helper">{difficulty}</span>
            <span className="t-helper" style={{ color: 'var(--primary)' }}>{progress}%</span>
          </div>
          <div className="progress-bar-wrap" style={{ marginBottom: 8 }}>
            <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
          </div>
        </div>

        {LEARNING_PATH.map(step => (
          <div
            key={step.id}
            className={`learning-path-item ${activeLesson === step.id ? 'active' : ''} ${step.done ? 'done' : ''}`}
            onClick={() => setActiveLesson(step.id)}
          >
            <div className="lp-dot" />
            <div>
              <div className="lp-label">{step.label} {step.done ? '✓' : ''}</div>
              <div className="lp-sub">{step.sub}</div>
            </div>
          </div>
        ))}
      </aside>

      {/* ── Conversation area ── */}
      <div className="langbot-main">
        {/* Topbar */}
        <div style={{
          padding: '14px 20px',
          borderBottom: '1px solid var(--surface-high)',
          background: 'var(--surface)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexShrink: 0,
        }}>
          <div>
            <div style={{ fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: '1rem' }}>
              Practice: {LEARNING_PATH.find(s => s.id === activeLesson)?.label}
            </div>
            <div className="t-helper" style={{ marginTop: 2 }}>
              💡 Try the phrase — I'll correct and explain!
            </div>
          </div>
          <select className="lb-select" value={difficulty} onChange={e => setDifficulty(e.target.value)}>
            {DIFFICULTIES.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>

        {/* Messages */}
        <div className="chat-scroll">
          {messages.map((m, i) => (
            <div key={i} className={`chat-bubble chat-bubble--${m.role}`}>
              <div className="bubble-label">
                {m.role === 'user' ? '🧑‍🎓 You' : `🤖 ${targetLang} Tutor`}
              </div>
              <div className="bubble-body" style={{ whiteSpace: 'pre-wrap' }}>{m.text}</div>
            </div>
          ))}
          {isLoading && (
            <div className="chat-bubble chat-bubble--ai">
              <div className="bubble-label">🤖 {targetLang} Tutor</div>
              <div className="bubble-typing">
                <div className="typing-dot"/><div className="typing-dot"/><div className="typing-dot"/>
                <span style={{ marginLeft: 4 }}>Thinking…</span>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {error && <div className="error-bar" style={{ margin: '0 16px 8px' }}>⚠️ {error}</div>}

        {/* Suggested prompts */}
        <div style={{ padding: '6px 16px', display: 'flex', gap: 8, flexWrap: 'wrap', flexShrink: 0 }}>
          {SUGGESTED.map(s => (
            <button key={s} className="chip" onClick={() => handleSend(s)} style={{ fontSize: '.75rem' }}>
              {s}
            </button>
          ))}
        </div>

        {/* Input */}
        <div className="chat-input-area" style={{ flexShrink: 0 }}>
          <div className="chat-input-row">
            <textarea
              className="lb-textarea"
              placeholder={`Type in ${targetLang} or ask in English…`}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
              rows={2}
              disabled={isLoading}
              style={{ minHeight: 'unset' }}
            />
            {isSupported && (
              <button
                className={`btn-icon-round ${isListening ? 'active' : ''}`}
                onClick={isListening ? stopListening : startListening}
                title={isListening ? 'Stop' : `Speak in ${targetLang}`}
              >
                {isListening ? '🔴' : '🎤'}
              </button>
            )}
            <button
              className="btn btn-primary"
              onClick={() => handleSend()}
              disabled={isLoading || !input.trim()}
            >
              {isLoading ? '⏳' : '➤ Send'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
