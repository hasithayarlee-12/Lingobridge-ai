import { useState, useEffect } from 'react';
import { useSpeechInput } from '../hooks/useSpeechInput';

export default function ChatInput({ onSend, isLoading, language }) {
  const [text, setText] = useState('');
  const { transcript, isListening, isSupported, startListening, stopListening, clearTranscript } =
    useSpeechInput(language);

  // When speech transcript arrives, populate the input field
  useEffect(() => {
    if (transcript) {
      setText(transcript);
      clearTranscript();
    }
  }, [transcript]);

  function handleSend() {
    const trimmed = text.trim();
    if (!trimmed || isLoading) return;
    onSend(trimmed);
    setText('');
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <div className="chat-input-bar">
      <textarea
        className="chat-input-textarea"
        placeholder="Ask a question… (press Enter to send)"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        rows={2}
        disabled={isLoading}
      />

      {isSupported && (
        <button
          className={`btn btn-icon ${isListening ? 'btn-listening' : ''}`}
          onClick={isListening ? stopListening : startListening}
          title={isListening ? 'Stop listening' : 'Speak your question'}
          disabled={isLoading}
        >
          {isListening ? '🔴' : '🎤'}
        </button>
      )}

      <button
        className="btn btn-primary"
        onClick={handleSend}
        disabled={isLoading || !text.trim()}
      >
        {isLoading ? '⏳' : 'Send'}
      </button>
    </div>
  );
}
