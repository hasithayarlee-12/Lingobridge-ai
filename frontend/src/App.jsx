import { useState, useCallback } from 'react';
import AppShell from './components/AppShell';
import VoiceFAB from './components/VoiceFAB';
import Dashboard from './pages/Dashboard';
import AITutor from './pages/AITutor';
import LanguageBot from './pages/LanguageBot';
import Translator from './pages/Translator';
import Settings from './pages/Settings';
import History from './pages/History';
import { SignIn, CreateAccount } from './pages/Auth';
import './styles/index.css';

// ── History entry shape ──────────────────────────────────────────
// { id, feature, title, language, difficulty?, extra?, icon, timestamp }
// "feature" must match FEATURE_META keys in History.jsx:
//   'AI Tutor' | 'Language Bot' | 'Translator'
// ────────────────────────────────────────────────────────────────

let _idCounter = 0;
function makeEntry(feature, title, language, opts = {}) {
  return {
    id:         ++_idCounter,
    feature,
    title,
    language,
    difficulty: opts.difficulty || null,
    extra:      opts.extra      || null,
    icon:       opts.icon       || '📌',
    timestamp:  new Date().toISOString(),
  };
}

// Pages that need their own full-height scroll management
const FULLHEIGHT_PAGES = new Set(['tutor', 'langbot']);

export default function App() {
  // ── Auth ──
  const [authPage, setAuthPage] = useState('signin');
  const [user,     setUser]     = useState(null);

  // ── App ──
  const [page,       setPage]       = useState('dashboard');
  const [language,   setLanguage]   = useState('English');
  const [difficulty, setDifficulty] = useState('Beginner');

  // ── Session history (shared across all pages) ──
  const [sessionHistory, setSessionHistory] = useState([]);

  const addHistory = useCallback((feature, title, lang, opts) => {
    const entry = makeEntry(feature, title, lang, opts);
    setSessionHistory(prev => [entry, ...prev]);
  }, []);

  // ── Auth handlers ──
  function handleSignIn(userData) {
    setUser(userData);
    if (userData.preferredLang) setLanguage(userData.preferredLang);
    if (userData.level)         setDifficulty(userData.level);
    setPage('dashboard');
  }

  function handleLogout() {
    setUser(null);
    setAuthPage('signin');
    setSessionHistory([]);
  }

  // ── Not logged in ──
  if (!user) {
    return authPage === 'signin' ? (
      <SignIn
        onSignIn={handleSignIn}
        onSwitchToRegister={() => setAuthPage('register')}
      />
    ) : (
      <CreateAccount
        onSignIn={handleSignIn}
        onSwitchToSignIn={() => setAuthPage('signin')}
      />
    );
  }

  function renderPage() {
    switch (page) {
      case 'dashboard':
        return <Dashboard user={user} onNav={setPage} sessionHistory={sessionHistory} />;

      case 'tutor':
        return (
          <AITutor
            language={language}
            difficulty={difficulty}
            onAddHistory={addHistory}
          />
        );

      case 'langbot':
        return (
          <LanguageBot
            language={language}
            difficulty={difficulty}
            onAddHistory={addHistory}
          />
        );

      case 'translator':
        return (
          <Translator
            language={language}
            onAddHistory={addHistory}
          />
        );

      case 'history':
        return <History sessionHistory={sessionHistory} onNav={setPage} />;

      case 'settings':
        return (
          <Settings
            user={user}
            language={language}
            difficulty={difficulty}
            onLanguage={setLanguage}
            onDifficulty={setDifficulty}
            onLogout={handleLogout}
          />
        );

      default:
        return <Dashboard user={user} onNav={setPage} sessionHistory={sessionHistory} />;
    }
  }

  const isFullHeight = FULLHEIGHT_PAGES.has(page);

  return (
    <>
      <AppShell
        page={page}
        onNav={setPage}
        language={language}
        onLanguage={setLanguage}
        user={user}
        onLogout={handleLogout}
        sessionHistory={sessionHistory}
      >
        {isFullHeight ? (
          <div style={{
            height: 'calc(100vh - var(--topnav-h))',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
          }}>
            {renderPage()}
          </div>
        ) : (
          renderPage()
        )}
      </AppShell>

      <VoiceFAB language={language} onTranscript={null} />
    </>
  );
}
