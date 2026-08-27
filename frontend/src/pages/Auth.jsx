// Auth pages — SignIn + CreateAccount
import { useState } from 'react';
import { LANGUAGES, DIFFICULTIES } from '../config/languages';

export function SignIn({ onSignIn, onSwitchToRegister }) {
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!email || !password) { setError('Please fill in all fields.'); return; }
    setLoading(true); setError('');
    // Demo auth — accept any credentials
    await new Promise(r => setTimeout(r, 600));
    const name = email.split('@')[0];
    onSignIn({ name, email });
    setLoading(false);
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <div className="auth-logo-icon">🌐</div>
          <div className="auth-logo-name">LingoBridge AI</div>
        </div>

        <h2 className="t-headline-sm" style={{ textAlign: 'center', marginBottom: 4 }}>Welcome back</h2>
        <p className="t-helper" style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          Sign in to continue learning
        </p>

        {error && <div className="error-bar" style={{ marginBottom: '1rem' }}>⚠️ {error}</div>}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="lb-input-wrap">
            <label className="lb-label">Email</label>
            <input className="lb-input" type="email" placeholder="you@example.com"
              value={email} onChange={e => setEmail(e.target.value)} autoComplete="email" />
          </div>

          <div className="lb-input-wrap">
            <label className="lb-label">Password</label>
            <input className="lb-input" type="password" placeholder="••••••••"
              value={password} onChange={e => setPassword(e.target.value)} autoComplete="current-password" />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: '.83rem', color: 'var(--on-surface-variant)', cursor: 'pointer' }}>
              <input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)} style={{ accentColor: 'var(--primary)' }} />
              Remember me
            </label>
            <span className="auth-link" style={{ fontSize: '.83rem' }}>Forgot password?</span>
          </div>

          <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading}>
            {loading ? '⏳ Signing in…' : 'Sign In'}
          </button>
        </form>

        <div className="auth-divider">OR</div>

        <p style={{ textAlign: 'center', fontSize: '.875rem', color: 'var(--on-surface-variant)' }}>
          Don't have an account?{' '}
          <span className="auth-link" onClick={onSwitchToRegister}>Create account</span>
        </p>
      </div>
    </div>
  );
}

export function CreateAccount({ onSignIn, onSwitchToSignIn }) {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '', lang: 'Hindi', level: 'Beginner' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function set(k, v) { setForm(p => ({...p, [k]: v})); }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) { setError('Please fill in all required fields.'); return; }
    if (form.password !== form.confirm) { setError('Passwords do not match.'); return; }
    setLoading(true); setError('');
    await new Promise(r => setTimeout(r, 700));
    onSignIn({ name: form.name, email: form.email, preferredLang: form.lang, level: form.level });
    setLoading(false);
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <div className="auth-logo-icon">🌐</div>
          <div className="auth-logo-name">LingoBridge AI</div>
        </div>

        <h2 className="t-headline-sm" style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          Create your account
        </h2>

        {error && <div className="error-bar" style={{ marginBottom: '1rem' }}>⚠️ {error}</div>}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="lb-input-wrap">
            <label className="lb-label">Full Name *</label>
            <input className="lb-input" placeholder="Arjun Sharma" value={form.name} onChange={e => set('name', e.target.value)} />
          </div>
          <div className="lb-input-wrap">
            <label className="lb-label">Email *</label>
            <input className="lb-input" type="email" placeholder="you@example.com" value={form.email} onChange={e => set('email', e.target.value)} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="lb-input-wrap">
              <label className="lb-label">Password *</label>
              <input className="lb-input" type="password" placeholder="••••••••" value={form.password} onChange={e => set('password', e.target.value)} />
            </div>
            <div className="lb-input-wrap">
              <label className="lb-label">Confirm Password *</label>
              <input className="lb-input" type="password" placeholder="••••••••" value={form.confirm} onChange={e => set('confirm', e.target.value)} />
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="lb-input-wrap">
              <label className="lb-label">Preferred Language</label>
              <select className="lb-select" value={form.lang} onChange={e => set('lang', e.target.value)}>
                {LANGUAGES.map(l => <option key={l.value} value={l.value}>{l.flag} {l.value}</option>)}
              </select>
            </div>
            <div className="lb-input-wrap">
              <label className="lb-label">Learning Level</label>
              <select className="lb-select" value={form.level} onChange={e => set('level', e.target.value)}>
                {DIFFICULTIES.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
          </div>
          <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading}>
            {loading ? '⏳ Creating…' : 'Create Account'}
          </button>
        </form>

        <p style={{ textAlign: 'center', fontSize: '.875rem', color: 'var(--on-surface-variant)', marginTop: '1rem' }}>
          Already have an account?{' '}
          <span className="auth-link" onClick={onSwitchToSignIn}>Sign in</span>
        </p>
      </div>
    </div>
  );
}
