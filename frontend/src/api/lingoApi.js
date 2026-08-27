import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://lingobridge-ai.onrender.com',
});

/**
 * Send a chat question and get an AI explanation.
 * @param {string} question
 * @param {string} language  - "English" | "Hindi" | "Telugu"
 * @param {string} difficulty - "Beginner" | "Intermediate" | "Advanced"
 * @returns {Promise<string>} the AI answer text
 */
export async function sendChat(question, language, difficulty) {
  const res = await api.post('/chat', { question, language, difficulty });
  return res.data.answer;
}

/**
 * Upload a PDF or image and get an AI explanation.
 * @param {File} file
 * @param {string} language
 * @param {string} difficulty
 * @returns {Promise<string>} the AI answer text
 */
export async function uploadFile(file, language, difficulty) {
  const form = new FormData();
  form.append('file', file);
  form.append('language', language);
  form.append('difficulty', difficulty);
  const res = await api.post('/upload', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data.answer;
}

/**
 * Generate a 5-question quiz about a topic.
 * @param {string} topic
 * @param {string} language
 * @param {string} difficulty
 * @returns {Promise<Array>} array of question objects
 */
export async function generateQuiz(topic, language, difficulty) {
  const res = await api.post('/quiz/generate', { topic, language, difficulty });
  return res.data.questions;
}

/**
 * Score quiz answers and get revision suggestions.
 * @param {Array}  questions   - array from generateQuiz
 * @param {Array}  userAnswers - array of selected option strings
 * @param {string} language
 * @returns {Promise<Object>} scoring result with score, results, revision_suggestions
 */
export async function scoreQuiz(questions, userAnswers, language) {
  const res = await api.post('/quiz/score', { questions, user_answers: userAnswers, language });
  return res.data;
}
