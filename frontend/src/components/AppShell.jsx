// AppShell — sidebar + topnav
// Workspaces removed. History wired. Profile dropdown functional.
// Search queries session history. Help Center is an inline modal.
import { useState, useRef, useEffect } from 'react';
import { LANGUAGES } from '../config/languages';

const NAV_ITEMS = [
  { id: 'dashboard',  icon: '🏠', label: 'Dashboard'   },
  { id: 'tutor',      icon: '🎓', label: 'AI Tutor'    },
  { id: 'langbot',    icon: '💬', label: 'Language Bot' },
  { id: 'translator', icon: '🔄', label: 'Translator'  },
  { id: 'history',    icon: '🕐', label: 'History'     },
];

const BOTTOM_ITEMS = [
  { id: 'helpcenter', icon: '❓', label: 'Help Center' },
  { id: 'settings',   icon: '⚙️', label: 'Settings'   },
  { id: 'logout',     icon: '🚪', label: 'Log Out'     },
];

const TOP_TABS = [
  { label: 'Dashboard', page: 'dashboard' },
  { label: 'History',   page: 'history'   },
];

export default function AppShell({
  page, onNav, language, onLanguage, user, onLogout,
  sessionHistory,
  children,
}) {
  const [searchQuery,   setSearchQuery]   = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchOpen,    setSearchOpen]    = useState(false);
  const [profileOpen,   setProfileOpen]   = useState(false);
  const [helpOpen,      setHelpOpen]      = useState(false);

  const searchRef  = useRef(null);
  const profileRef = useRef(null);

  // ── Close dropdowns on outside click ──
  useEffect(() => {
    function handleClick(e) {
      if (searchRef.current  && !searchRef.current.contains(e.target))  setSearchOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // ── Close help modal on Escape ──
  useEffect(() => {
    function handleKey(e) {
      if (e.key === 'Escape') setHelpOpen(false);
    }
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, []);

  // ── Search session history ──
  function handleSearch(q) {
    setSearchQuery(q);
    if (!q.trim()) { setSearchResults([]); setSearchOpen(false); return; }
    const lower = q.toLowerCase();
    const hits = (sessionHistory || []).filter(
      h => h.title.toLowerCase().includes(lower) || h.feature.toLowerCase().includes(lower)
    ).slice(0, 6);
    setSearchResults(hits);
    setSearchOpen(true);
  }

  function handleNav(id) {
    if (id === 'logout')     { onLogout(); return; }
    if (id === 'helpcenter') { setHelpOpen(true); return; }
    onNav(id);
  }

  const initials = user?.name
    ? user.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
    : '?';

  return (
    <>
      <div className="app-shell">
        {/* ════════════════ SIDEBAR ════════════════ */}
        <aside className="lb-sidebar">
          <div className="sidebar-brand">
            <div className="sidebar-logo-wrap">🌐</div>
            <div>
              <div className="sidebar-brand-name">LingoBridge AI</div>
              <div className="sidebar-brand-tag">Multilingual AI</div>
            </div>
          </div>

          <button className="sidebar-new-btn" onClick={() => onNav('tutor')}>
            <span>＋</span>
            <span>New Session</span>
          </button>

          <nav className="sidebar-nav">
            <div className="sidebar-section-label">Main</div>
            {NAV_ITEMS.map(item => (
              <button
                key={item.id}
                className={`nav-item ${page === item.id ? 'active' : ''}`}
                onClick={() => handleNav(item.id)}
              >
                <span className="nav-icon">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </nav>

          <div className="sidebar-bottom">
            {BOTTOM_ITEMS.map(item => (
              <button
                key={item.id}
                className={`nav-item ${page === item.id ? 'active' : ''}`}
                onClick={() => handleNav(item.id)}
              >
                <span className="nav-icon">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </aside>

        {/* ════════════════ CONTENT COLUMN ════════════════ */}
        <div className="page-content-col">

          {/* ── Top Nav ── */}
          <nav className="lb-topnav">

            {/* Left: Dashboard | History tabs */}
            <div className="topnav-tabs">
              {TOP_TABS.map(t => (
                <button
                  key={t.page}
                  className={`topnav-tab ${page === t.page ? 'active' : ''}`}
                  onClick={() => onNav(t.page)}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Right: Search · Language · Profile */}
            <div className="topnav-right">

              {/* ── Search ── */}
              <div className="topnav-search-wrap" ref={searchRef}>
                <div className="topnav-search">
                  <span style={{ fontSize: '0.85rem' }}>🔍</span>
                  <input
                    placeholder="Search history…"
                    value={searchQuery}
                    onChange={e => handleSearch(e.target.value)}
                    onFocus={() => searchQuery && setSearchOpen(searchResults.length > 0)}
                  />
                  {searchQuery && (
                    <button
                      className="search-clear-btn"
                      onClick={() => { setSearchQuery(''); setSearchResults([]); setSearchOpen(false); }}
                    >
                      ×
                    </button>
                  )}
                </div>

                {searchOpen && (
                  <div className="search-dropdown">
                    {searchResults.length === 0 ? (
                      <div className="search-empty">
                        {(sessionHistory || []).length === 0
                          ? 'No history yet. Start a session to build history.'
                          : `No results for "${searchQuery}"`
                        }
                      </div>
                    ) : (
                      searchResults.map((r, i) => (
                        <button
                          key={i}
                          className="search-result-item"
                          onClick={() => { onNav('history'); setSearchOpen(false); setSearchQuery(''); }}
                        >
                          <span className="search-result-icon">{r.icon}</span>
                          <div>
                            <div className="search-result-title">{r.title}</div>
                            <div className="search-result-meta">{r.feature} · {r.language}</div>
                          </div>
                        </button>
                      ))
                    )}
                  </div>
                )}
              </div>

              {/* ── Language selector ── */}
              <select
                className="lang-selector-mini"
                value={language}
                onChange={e => onLanguage(e.target.value)}
                title="AI interaction language"
              >
                {LANGUAGES.map(l => (
                  <option key={l.value} value={l.value}>{l.flag} {l.value}</option>
                ))}
              </select>

              {/* ── Profile dropdown ── */}
              <div className="profile-wrap" ref={profileRef}>
                <button
                  className="profile-avatar-btn"
                  onClick={() => setProfileOpen(p => !p)}
                  title={user?.name || 'Profile'}
                >
                  {initials}
                </button>

                {profileOpen && (
                  <div className="profile-dropdown">
                    <div className="profile-dropdown-header">
                      <div className="profile-avatar-lg">{initials}</div>
                      <div>
                        <div className="profile-name">{user?.name || 'User'}</div>
                        <div className="profile-email">{user?.email || ''}</div>
                      </div>
                    </div>
                    <div className="profile-dropdown-divider" />
                    <button className="profile-menu-item" onClick={() => { onNav('settings'); setProfileOpen(false); }}>
                      ⚙️ Settings
                    </button>
                    <button className="profile-menu-item" onClick={() => { onNav('history'); setProfileOpen(false); }}>
                      🕐 History
                    </button>
                    <div className="profile-dropdown-divider" />
                    <button
                      className="profile-menu-item profile-menu-item--danger"
                      onClick={() => { setProfileOpen(false); onLogout(); }}
                    >
                      🚪 Log Out
                    </button>
                  </div>
                )}
              </div>

            </div>
          </nav>

          {/* Page content */}
          <div className="page-scroll">
            {children}
          </div>
        </div>
      </div>

      {/* ════════════════ HELP CENTER MODAL ════════════════ */}
      {helpOpen && (
        <div className="modal-overlay" onClick={() => setHelpOpen(false)}>
          <div className="modal-card" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div className="t-headline-sm">❓ Help Center</div>
              <button className="btn btn-ghost btn-sm" onClick={() => setHelpOpen(false)}>✕ Close</button>
            </div>

            <div className="modal-body">
              <div className="help-section">
                <div className="help-section-title">🎓 AI Tutor</div>
                <p className="t-body-md">Ask any academic or technical question. The AI will explain it in your chosen language and difficulty level. You can also upload a PDF or image from your textbook.</p>
              </div>

              <div className="help-section">
                <div className="help-section-title">💬 Language Bot</div>
                <p className="t-body-md">Practice speaking and writing in Hindi, Telugu, Tamil, and more. Select a lesson topic, type your attempt, and the AI will correct and guide you.</p>
              </div>

              <div className="help-section">
                <div className="help-section-title">🔄 Translator</div>
                <p className="t-body-md">Translate text or PDF documents between English and Indian languages. Use the Voice button to speak your text, or upload a PDF for document translation.</p>
              </div>

              <div className="help-section">
                <div className="help-section-title">🎤 Voice Input</div>
                <p className="t-body-md">Click the microphone button in any chat or translator panel to speak instead of type. Voice input works in Chrome and Edge browsers.</p>
              </div>

              <div className="help-section">
                <div className="help-section-title">🧠 Quizzes</div>
                <p className="t-body-md">After the AI explains a topic in the AI Tutor, click "Generate Quiz" to test yourself. Submit your answers to get a score and personalised revision suggestions.</p>
              </div>

              <div className="help-section">
                <div className="help-section-title">⚙️ Languages & Difficulty</div>
                <p className="t-body-md">Use the language selector in the top bar or in each page to choose English, Hindi, Telugu, Tamil, Marathi, or Bengali. Change difficulty in Settings or per-page.</p>
              </div>

              <div style={{ marginTop: 'var(--sp-3)', padding: 'var(--sp-2)', background: 'var(--surface-low)', borderRadius: 'var(--r-md)' }}>
                <p className="t-helper" style={{ textAlign: 'center' }}>
                  Built for Indian college students · LingoBridge AI Hackathon MVP
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
