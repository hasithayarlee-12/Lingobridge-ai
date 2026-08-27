// Global VoiceFAB — floating microphone button (bottom-right)
// When transcript is ready, fires onTranscript callback if provided.
import { useEffect } from 'react';
import { useSpeechInput } from '../hooks/useSpeechInput';

export default function VoiceFAB({ language, onTranscript }) {
  const {
    isListening, isSupported,
    startListening, stopListening,
    transcript, clearTranscript,
  } = useSpeechInput(language);

  // Bubble transcript up safely via useEffect (not in render body)
  useEffect(() => {
    if (transcript && onTranscript) {
      onTranscript(transcript);
      clearTranscript();
    }
  }, [transcript]); // eslint-disable-line

  if (!isSupported) return null;

  return (
    <button
      className={`voice-fab ${isListening ? 'listening' : ''}`}
      onClick={isListening ? stopListening : startListening}
      title={isListening ? 'Stop listening' : 'Voice input (Chrome/Edge)'}
      aria-label={isListening ? 'Stop voice input' : 'Start voice input'}
    >
      {isListening ? '🔴' : '🎤'}
    </button>
  );
}
