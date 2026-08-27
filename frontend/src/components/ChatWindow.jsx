import { useEffect, useRef } from 'react';

export default function ChatWindow({ messages, isLoading, onChipClick, chips }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  /* ── Welcome / empty state ── */
  if (messages.length === 0 && !isLoading) {
    return (
      <div className="chat-window chat-welcome">
        <div className="welcome-emoji">🌐</div>
        <h2 className="welcome-title">Ask me anything!</h2>
        <p className="welcome-sub">
          I'll explain in <strong>{chips ? 'English, Hindi or Telugu' : 'your language'}</strong>.
          Pick a topic below or type your own question.
        </p>
        {chips && (
          <div className="welcome-chips">
            {chips.map((c) => (
              <button key={c.text} className="chip" onClick={() => onChipClick(c.text)}>
                <span>{c.icon}</span> {c.text}
              </button>
            ))}
          </div>
        )}
        <div ref={bottomRef} />
      </div>
    );
  }

  return (
    <div className="chat-window">
      {messages.map((msg, i) => (
        <div key={i} className={`chat-bubble chat-bubble--${msg.role}`}>
          <div className="bubble-label">
            {msg.role === 'user' ? '🧑‍🎓 You' : '🤖 LingoBridge AI'}
          </div>
          <div className="bubble-body">{msg.text}</div>
        </div>
      ))}

      {/* Typing indicator while waiting for AI */}
      {isLoading && (
        <div className="chat-bubble chat-bubble--ai">
          <div className="bubble-label">🤖 LingoBridge AI</div>
          <div className="bubble-typing">
            <div className="typing-dot" />
            <div className="typing-dot" />
            <div className="typing-dot" />
            <span style={{ marginLeft: 4 }}>Thinking…</span>
          </div>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
}
