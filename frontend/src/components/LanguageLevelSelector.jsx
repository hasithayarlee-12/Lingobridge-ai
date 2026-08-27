const LANGUAGES   = ['English', 'Hindi', 'Telugu'];
const DIFFICULTIES = ['Beginner', 'Intermediate', 'Advanced'];

export default function LanguageLevelSelector({ language, difficulty, onChange }) {
  return (
    <div className="selector-bar">
      <div className="selector-group">
        <span className="selector-label-text">🌐 Language</span>
        <select
          value={language}
          onChange={(e) => onChange('language', e.target.value)}
          className="selector-select"
        >
          {LANGUAGES.map((l) => (
            <option key={l} value={l}>{l}</option>
          ))}
        </select>
      </div>

      <div className="selector-group">
        <span className="selector-label-text">📊 Level</span>
        <select
          value={difficulty}
          onChange={(e) => onChange('difficulty', e.target.value)}
          className="selector-select"
        >
          {DIFFICULTIES.map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
      </div>
    </div>
  );
}
