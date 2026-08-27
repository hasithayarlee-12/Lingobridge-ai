// AI Tutor page — chat, upload, quiz
import { useState, useEffect, useRef } from 'react';
import { sendChat, uploadFile, generateQuiz, scoreQuiz } from '../api/lingoApi';
import { useSpeechInput } from '../hooks/useSpeechInput';
import { LANGUAGES, DIFFICULTIES } from '../config/languages';

const CHIPS = [
  { icon: '⚛️', text: 'Explain React hooks' },
  { icon: '🧮', text: 'What is Big-O notation?' },
  { icon: '🔌', text: 'How does an API work?' },
  { icon: '🧬', text: 'Explain DNA replication' },
  { icon: '📡', text: 'What is machine learning?' },
  { icon: '⚡', text: "Explain Ohm's Law" },
  { icon: '🌍', text: 'What is quantum entanglement?' },
];

export default function AITutor({ language: globalLang, difficulty: globalDiff, onAddHistory }) {
  const [language,    setLanguage]    = useState(globalLang  || 'English');
  const [difficulty,  setDifficulty]  = useState(globalDiff  || 'Beginner');
  const [messages,    setMessages]    = useState([]);
  const [isLoading,   setIsLoading]   = useState(false);
  const [quizTopic,   setQuizTopic]   = useState('');
  const [quiz,        setQuiz]        = useState(null);
  const [quizLoading, setQuizLoading] = useState(false);
  const [error,       setError]       = useState('');
  const [input,       setInput]       = useState('');

  const chatEndRef = useRef(null);

  // Sync language/difficulty when global props change
  useEffect(() => { setLanguage(globalLang || 'English'); }, [globalLang]);
  useEffect(() => { setDifficulty(globalDiff || 'Beginner'); }, [globalDiff]);

  // Auto-scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const { transcript, isListening, isSupported, startListening, stopListening, clearTranscript } =
    useSpeechInput(language);

  useEffect(() => {
    if (transcript) { setInput(transcript); clearTranscript(); }
  }, [transcript]); // eslint-disable-line

  function addMsg(role, text) {
    setMessages(p => [...p, { role, text }]);
  }

  async function handleSend(q) {
    const question = (q || input).trim();
    if (!question) return;
    setInput('');
    addMsg('user', question);
    setQuizTopic(question);
    setIsLoading(true); setError('');
    try {
      const answer = await sendChat(question, language, difficulty);
      addMsg('ai', answer);
      onAddHistory?.('AI Tutor', question.slice(0, 60), language, { difficulty });
    } catch (err) {
      setError(err?.response?.data?.detail || err?.message || 'Backend error. Is the server running?');
    } finally { setIsLoading(false); }
  }

  async function handleUpload(file) {
    addMsg('user', `📎 Uploaded: ${file.name}`);
    setIsLoading(true); setError('');
    try {
      const answer = await uploadFile(file, language, difficulty);
      addMsg('ai', answer);
      setQuizTopic(`content from ${file.name}`);
      onAddHistory?.('AI Tutor', `Upload: ${file.name}`.slice(0, 60), language, { difficulty });
    } catch (err) {
      setError(err?.response?.data?.detail || 'Upload failed.');
    } finally { setIsLoading(false); }
  }

  async function handleGenerateQuiz() {
    if (!quizTopic) return;
    setQuizLoading(true); setError('');
    try { setQuiz(await generateQuiz(quizTopic, language, difficulty)); }
    catch (err) { setError(err?.response?.data?.detail || 'Quiz generation failed.'); }
    finally { setQuizLoading(false); }
  }

  const hasAI = messages.some(m => m.role === 'ai');

  if (quiz) return (
    <QuizView
      questions={quiz}
      language={language}
      onClose={() => setQuiz(null)}
    />
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Controls bar */}
      <div style={{
        padding: '12px 20px',
        borderBottom: '1px solid var(--surface-high)',
        background: 'var(--surface)',
        display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center',
        flexShrink: 0,
      }}>
        <div style={{ fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: '1.1rem', color: 'var(--on-surface)', marginRight: 'auto' }}>
          🎓 AI Tutor
        </div>
        <div className="lb-input-wrap" style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <label className="lb-label">Language</label>
          <select className="lb-select" value={language} onChange={e => setLanguage(e.target.value)}>
            {LANGUAGES.map(l => <option key={l.value} value={l.value}>{l.flag} {l.value}</option>)}
          </select>
        </div>
        <div className="lb-input-wrap" style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <label className="lb-label">Level</label>
          <select className="lb-select" value={difficulty} onChange={e => setDifficulty(e.target.value)}>
            {DIFFICULTIES.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
      </div>

      {/* Chat area */}
      <div className="chat-scroll" style={{ flex: 1 }}>
        {messages.length === 0 && !isLoading ? (
          <div className="chat-welcome">
            <div className="chat-welcome-emoji">🎓</div>
            <div className="chat-welcome-title">Ask me anything!</div>
            <div className="chat-welcome-sub">
              I'll explain in simple {language}. Pick a topic or type below.
            </div>
            <div className="chat-welcome-chips">
              {CHIPS.map(c => (
                <button key={c.text} className="chip chip-saffron" onClick={() => handleSend(c.text)}>
                  {c.icon} {c.text}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <>
            {messages.map((m, i) => (
              <div key={i} className={`chat-bubble chat-bubble--${m.role}`}>
                <div className="bubble-label">{m.role === 'user' ? '🧑‍🎓 You' : '🤖 LingoBridge AI'}</div>
                <div className="bubble-body" style={{ whiteSpace: 'pre-wrap' }}>{m.text}</div>
              </div>
            ))}
            {isLoading && (
              <div className="chat-bubble chat-bubble--ai">
                <div className="bubble-label">🤖 LingoBridge AI</div>
                <div className="bubble-typing">
                  <div className="typing-dot"/><div className="typing-dot"/><div className="typing-dot"/>
                  <span style={{ marginLeft: 4 }}>Thinking…</span>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </>
        )}
      </div>

      {error && <div className="error-bar" style={{ margin: '0 16px 8px' }}>⚠️ {error}</div>}

      {hasAI && !isLoading && (
        <div style={{ padding: '4px 16px', flexShrink: 0 }}>
          <button className="btn btn-secondary btn-sm" onClick={handleGenerateQuiz} disabled={quizLoading}>
            {quizLoading ? '⏳ Generating…' : '🧠 Generate Quiz on This Topic'}
          </button>
        </div>
      )}

      {/* Input area */}
      <div className="chat-input-area" style={{ flexShrink: 0 }}>
        <UploadZone onUpload={handleUpload} isLoading={isLoading} />
        <div className="chat-input-row">
          <textarea
            className="lb-textarea"
            placeholder="Ask a question… (Enter to send, Shift+Enter for new line)"
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
              disabled={isLoading}
              title={isListening ? 'Stop listening' : 'Speak your question'}
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
  );
}

/* ── Inline upload zone ── */
function UploadZone({ onUpload, isLoading }) {
  const [drag, setDrag] = useState(false);
  const [name, setName] = useState('');

  function handle(file) {
    if (!file) return;
    setName(file.name);
    onUpload(file);
  }

  return (
    <div
      className={`upload-zone ${drag ? 'upload-zone--active' : ''}`}
      onDragOver={e => { e.preventDefault(); setDrag(true); }}
      onDragLeave={() => setDrag(false)}
      onDrop={e => { e.preventDefault(); setDrag(false); handle(e.dataTransfer.files[0]); }}
      onClick={() => { if (!isLoading) document.getElementById('tutor-file-input').click(); }}
    >
      <input
        id="tutor-file-input"
        type="file"
        accept=".pdf,.jpg,.jpeg,.png,.webp"
        onChange={e => { handle(e.target.files[0]); e.target.value = ''; }}
        style={{ display: 'none' }}
      />
      <span>{isLoading ? '⏳' : name ? '✅' : '📄'}</span>
      <span>
        {isLoading
          ? 'Processing…'
          : name
            ? `${name} — click to replace`
            : 'Drop PDF or image, or click to browse'
        }
      </span>
    </div>
  );
}

/* ── Inline quiz view ── */
function QuizView({ questions, language, onClose }) {
  const [sel,     setSel]     = useState({});
  const [result,  setResult]  = useState(null);
  const [scoring, setScoring] = useState(false);
  const [err,     setErr]     = useState('');

  const answered = Object.keys(sel).length;
  const total    = questions.length;
  const progress = result ? 100 : Math.round((answered / total) * 100);

  async function submit() {
    if (answered < total) { setErr(`Please answer all ${total} questions first.`); return; }
    setErr(''); setScoring(true);
    try {
      const r = await scoreQuiz(questions, questions.map((_, i) => sel[i] || ''), language);
      setResult(r);
    } catch (e) {
      setErr(e?.response?.data?.detail || 'Scoring failed. Please try again.');
    } finally { setScoring(false); }
  }

  return (
    <div className="quiz-wrap">
      <div className="quiz-topbar">
        <div>
          <div className="quiz-topbar-title">🧠 Quiz — {total} Questions</div>
          {!result && <div className="t-helper">{answered}/{total} answered · {language}</div>}
        </div>
        <button className="btn btn-ghost btn-sm" onClick={onClose}>✕ Close</button>
      </div>

      <div className="quiz-prog-wrap">
        <div className="quiz-prog-fill" style={{ width: `${progress}%` }} />
      </div>

      <div className="quiz-body-scroll">
        {questions.map((q, i) => {
          const qr = result?.results?.[i];
          return (
            <div key={i} className="quiz-q-card">
              <div className="quiz-q-num">Question {i + 1} of {total}</div>
              <p className="quiz-q-text">{q.question_text}</p>
              <div className="quiz-opts">
                {q.options.map(opt => {
                  let cls = 'quiz-opt';
                  if (qr) {
                    if (opt === q.correct_answer) cls += ' correct';
                    else if (opt === qr.student_answer && !qr.is_correct) cls += ' wrong';
                  } else if (sel[i] === opt) {
                    cls += ' selected';
                  }
                  return (
                    <label key={opt} className={cls}>
                      <input
                        type="radio"
                        name={`q${i}`}
                        value={opt}
                        checked={sel[i] === opt}
                        onChange={() => !result && setSel(s => ({ ...s, [i]: opt }))}
                        disabled={Boolean(result)}
                      />
                      {opt}
                      {qr && opt === q.correct_answer && (
                        <span style={{ marginLeft: 'auto', color: 'var(--success)', fontSize: '.8rem' }}>✓ Correct</span>
                      )}
                    </label>
                  );
                })}
              </div>
            </div>
          );
        })}

        {result && (
          <div className="quiz-result-card">
            <div className="quiz-score-big">{result.correct_count}/{result.total}</div>
            <div className="t-body-md" style={{ marginBottom: 8 }}>
              🎯 {result.score} ·{' '}
              {result.correct_count === result.total
                ? '🌟 Perfect score!'
                : result.correct_count >= Math.ceil(result.total / 2)
                  ? '👍 Good effort!'
                  : '📚 Keep studying!'}
            </div>
            {result.revision_suggestions && (
              <div className="revision-card">
                <div className="revision-card-title">📖 Revision Suggestions</div>
                <p className="revision-card-text" style={{ whiteSpace: 'pre-wrap' }}>
                  {result.revision_suggestions}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {err && (
        <p style={{ padding: '0 var(--sp-3)', color: 'var(--error)', fontSize: '.83rem' }}>⚠️ {err}</p>
      )}

      <div className="quiz-footer">
        <span className="t-helper">
          {result ? `Final score: ${result.score}` : `${answered}/${total} answered`}
        </span>
        {result ? (
          <button className="btn btn-ghost btn-sm" onClick={onClose}>Close Quiz</button>
        ) : (
          <button
            className="btn btn-primary btn-sm"
            onClick={submit}
            disabled={scoring || answered < total}
          >
            {scoring ? '⏳ Scoring…' : `Submit (${answered}/${total})`}
          </button>
        )}
      </div>
    </div>
  );
}
