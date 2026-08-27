import { useState } from 'react';
import { scoreQuiz } from '../api/lingoApi';

export default function QuizPanel({ questions, language, onClose }) {
  const [selected,   setSelected]   = useState({});
  const [result,     setResult]     = useState(null);
  const [isScoring,  setIsScoring]  = useState(false);
  const [error,      setError]      = useState('');

  const answered = Object.keys(selected).length;
  const total    = questions.length;
  const progress = result ? 100 : Math.round((answered / total) * 100);

  async function handleSubmit() {
    if (answered < total) {
      setError(`Please answer all ${total} questions before submitting.`);
      return;
    }
    setError('');
    setIsScoring(true);
    try {
      const userAnswers = questions.map((_, i) => selected[i] || '');
      const res = await scoreQuiz(questions, userAnswers, language);
      setResult(res);
    } catch (err) {
      setError(err?.response?.data?.detail || 'Failed to score quiz. Please try again.');
    } finally {
      setIsScoring(false);
    }
  }

  return (
    <div className="quiz-panel">
      {/* Top bar */}
      <div className="quiz-top-bar">
        <div>
          <div className="quiz-top-title">🧠 Quiz — {total} Questions</div>
          {!result && (
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 2 }}>
              {answered} of {total} answered
            </div>
          )}
        </div>
        <button className="btn btn-ghost btn-sm" onClick={onClose}>✕ Close Quiz</button>
      </div>

      {/* Progress bar */}
      <div className="quiz-progress-bar-wrap">
        <div className="quiz-progress-bar" style={{ width: `${progress}%` }} />
      </div>

      {/* Questions */}
      <div className="quiz-body">
        {questions.map((q, i) => {
          const qResult = result?.results?.[i];
          return (
            <div key={i} className="quiz-question-card">
              <div className="quiz-q-num">Question {i + 1} of {total}</div>
              <p className="quiz-question-text">{q.question_text}</p>
              <div className="quiz-options">
                {q.options.map((opt) => {
                  let cls = 'quiz-option';
                  if (qResult) {
                    if (opt === q.correct_answer)           cls += ' quiz-option--correct';
                    else if (opt === qResult.student_answer && !qResult.is_correct)
                                                            cls += ' quiz-option--wrong';
                  } else if (selected[i] === opt) {
                    cls += ' quiz-option--selected';
                  }
                  return (
                    <label key={opt} className={cls}>
                      <input
                        type="radio"
                        name={`q${i}`}
                        value={opt}
                        checked={selected[i] === opt}
                        onChange={() => !result && setSelected(s => ({ ...s, [i]: opt }))}
                        disabled={Boolean(result)}
                      />
                      {opt}
                      {qResult && opt === q.correct_answer && (
                        <span style={{ marginLeft: 'auto', color: 'var(--green)', fontSize: '0.8rem' }}>✓ Correct</span>
                      )}
                    </label>
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* Result card */}
        {result && (
          <div className="quiz-result-card">
            <div className="quiz-score-big">
              {result.correct_count} / {result.total}
            </div>
            <div className="quiz-score-label">
              🎯 Score: {result.score} &nbsp;·&nbsp;{' '}
              {result.correct_count === result.total
                ? '🌟 Perfect score!'
                : result.correct_count >= Math.ceil(result.total / 2)
                  ? '👍 Good effort!'
                  : '📚 Keep practicing!'}
            </div>
            {result.revision_suggestions && (
              <div className="revision-box">
                <div className="revision-title">📖 Revision Suggestions</div>
                <p className="revision-text">{result.revision_suggestions}</p>
              </div>
            )}
          </div>
        )}
      </div>

      {error && <p className="quiz-error">⚠️ {error}</p>}

      {/* Footer */}
      <div className="quiz-footer">
        <div className="quiz-footer-left">
          {result
            ? `Final score: ${result.score}`
            : `${answered} / ${total} answered`}
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {result ? (
            <button className="btn btn-ghost btn-sm" onClick={onClose}>
              Close Quiz
            </button>
          ) : (
            <button
              className="btn btn-primary btn-sm"
              onClick={handleSubmit}
              disabled={isScoring || answered < total}
            >
              {isScoring ? '⏳ Scoring…' : `Submit ${answered}/${total}`}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
