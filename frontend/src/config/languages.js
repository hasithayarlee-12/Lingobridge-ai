// Shared language / difficulty config — single source of truth
export const LANGUAGES = [
  { value: 'English', label: 'English', flag: '🇬🇧', speechCode: 'en-US' },
  { value: 'Hindi',   label: 'हिंदी (Hindi)',   flag: '🇮🇳', speechCode: 'hi-IN' },
  { value: 'Telugu',  label: 'తెలుగు (Telugu)',  flag: '🇮🇳', speechCode: 'te-IN' },
  { value: 'Tamil',   label: 'தமிழ் (Tamil)',   flag: '🇮🇳', speechCode: 'ta-IN' },
  { value: 'Marathi', label: 'मराठी (Marathi)',  flag: '🇮🇳', speechCode: 'mr-IN' },
  { value: 'Bengali', label: 'বাংলা (Bengali)',  flag: '🇮🇳', speechCode: 'bn-IN' },
];

export const DIFFICULTIES = ['Beginner', 'Intermediate', 'Advanced'];

export const LANG_SPEECH_CODES = Object.fromEntries(
  LANGUAGES.map(l => [l.value, l.speechCode])
);
