// Settings page
import { useState } from 'react';
import { LANGUAGES, DIFFICULTIES } from '../config/languages';

export default function Settings({ user, language, difficulty, onLanguage, onDifficulty, onLogout }) {
  const [voiceEnabled, setVoiceEnabled]   = useState(true);
  const [darkMode,     setDarkMode]       = useState(false);
  const [notifications,setNotifications]  = useState(true);
  const [name, setName]                   = useState(user?.name || '');
  const [email, setEmail]                 = useState(user?.email || '');
  const [saved, setSaved]                 = useState(false);

  function saveProfile(e) {
    e.preventDefault();
    setSaved(true); setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="page-inner" style={{ maxWidth: 720 }}>
      <h2 className="t-headline-md" style={{ marginBottom: 'var(--sp-3)' }}>⚙️ Settings</h2>

      {/* Profile */}
      <div className="card card-p3 settings-section">
        <div className="settings-section-title">👤 Profile</div>
        <form onSubmit={saveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="lb-input-wrap">
              <label className="lb-label">Full Name</label>
              <input className="lb-input" value={name} onChange={e => setName(e.target.value)} />
            </div>
            <div className="lb-input-wrap">
              <label className="lb-label">Email</label>
              <input className="lb-input" type="email" value={email} onChange={e => setEmail(e.target.value)} />
            </div>
          </div>
          <div>
            <button type="submit" className="btn btn-primary btn-sm">
              {saved ? '✅ Saved!' : 'Save Profile'}
            </button>
          </div>
        </form>
      </div>

      {/* Language Preferences */}
      <div className="card card-p3 settings-section">
        <div className="settings-section-title">🌐 Language Preferences</div>
        <div className="settings-row">
          <div>
            <div className="settings-row-label">Preferred Language</div>
            <div className="settings-row-sub">Language for AI explanations</div>
          </div>
          <select className="lb-select" value={language} onChange={e => onLanguage(e.target.value)}>
            {LANGUAGES.map(l => <option key={l.value} value={l.value}>{l.flag} {l.value}</option>)}
          </select>
        </div>
      </div>

      {/* Learning Preferences */}
      <div className="card card-p3 settings-section">
        <div className="settings-section-title">📊 Learning Preferences</div>
        <div className="settings-row">
          <div>
            <div className="settings-row-label">Difficulty Level</div>
            <div className="settings-row-sub">Controls complexity of explanations</div>
          </div>
          <select className="lb-select" value={difficulty} onChange={e => onDifficulty(e.target.value)}>
            {DIFFICULTIES.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
      </div>

      {/* Voice */}
      <div className="card card-p3 settings-section">
        <div className="settings-section-title">🎤 Voice Settings</div>
        <div className="settings-row">
          <div>
            <div className="settings-row-label">Voice Assistant</div>
            <div className="settings-row-sub">Enable microphone input (Chrome only)</div>
          </div>
          <label className="toggle">
            <input type="checkbox" checked={voiceEnabled} onChange={e => setVoiceEnabled(e.target.checked)} />
            <div className="toggle-track"/>
          </label>
        </div>
      </div>

      {/* Appearance */}
      <div className="card card-p3 settings-section">
        <div className="settings-section-title">🎨 Appearance</div>
        <div className="settings-row">
          <div>
            <div className="settings-row-label">Dark Mode</div>
            <div className="settings-row-sub">Coming soon</div>
          </div>
          <label className="toggle">
            <input type="checkbox" checked={darkMode} onChange={e => setDarkMode(e.target.checked)} disabled />
            <div className="toggle-track"/>
          </label>
        </div>
      </div>

      {/* Notifications */}
      <div className="card card-p3 settings-section">
        <div className="settings-section-title">🔔 Notifications</div>
        <div className="settings-row">
          <div>
            <div className="settings-row-label">Learning Reminders</div>
            <div className="settings-row-sub">Get notified about your learning goals</div>
          </div>
          <label className="toggle">
            <input type="checkbox" checked={notifications} onChange={e => setNotifications(e.target.checked)} />
            <div className="toggle-track"/>
          </label>
        </div>
      </div>

      {/* Account */}
      <div className="card card-p3 settings-section">
        <div className="settings-section-title">🔐 Account</div>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <button className="btn btn-ghost btn-sm">🔑 Change Password</button>
          <button className="btn btn-ghost btn-sm" onClick={onLogout}>🚪 Log Out</button>
          <button className="btn btn-danger btn-sm">⚠️ Delete Account</button>
        </div>
      </div>
    </div>
  );
}
