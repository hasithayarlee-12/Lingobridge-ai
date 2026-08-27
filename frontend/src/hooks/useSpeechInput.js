import { useState, useRef } from 'react';
import { LANG_SPEECH_CODES } from '../config/languages';

/**
 * Hook that wraps the browser Web Speech API for voice input.
 * Works in Chrome/Edge. Falls back gracefully elsewhere.
 */
export function useSpeechInput(language = 'English') {
  const [transcript, setTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);

  const SpeechRecognition =
    typeof window !== 'undefined' &&
    (window.SpeechRecognition || window.webkitSpeechRecognition);

  const isSupported = Boolean(SpeechRecognition);

  function startListening() {
    if (!isSupported) return;
    const recognition = new SpeechRecognition();
    recognition.lang = LANG_SPEECH_CODES[language] || 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart  = () => setIsListening(true);
    recognition.onresult = (e) => setTranscript(e.results[0][0].transcript);
    recognition.onerror  = () => setIsListening(false);
    recognition.onend    = () => setIsListening(false);

    recognitionRef.current = recognition;
    recognition.start();
  }

  function stopListening() {
    recognitionRef.current?.stop();
    setIsListening(false);
  }

  function clearTranscript() { setTranscript(''); }

  return { transcript, isListening, isSupported, startListening, stopListening, clearTranscript };
}
