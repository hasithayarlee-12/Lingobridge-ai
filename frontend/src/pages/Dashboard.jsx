// Dashboard page — real session history + dynamic language stats
export default function Dashboard({ user, onNav, sessionHistory }) {
  const FEATURE_CARDS = [
    {
      id: 'tutor',
      icon: '🎓', iconBg: 'ic-purple', accent: 'feature-card--purple',
      title: 'AI Tutor',
      desc: 'Understand complex technical, science, maths and academic concepts in your language.',
    },
    {
      id: 'langbot',
      icon: '💬', iconBg: 'ic-teal', accent: 'feature-card--teal',
      title: 'Language Bot',
      desc: 'Practice conversations in Hindi, Tamil, Telugu and more with live AI coaching.',
    },
    {
      id: 'translator',
      icon: '🔄', iconBg: 'ic-cyan', accent: 'feature-card--cyan',
      title: 'Translator',
      desc: 'Translate text and documents between English and Indian languages instantly.',
    },
  ];

  const FEATURE_COLOR = {
    'AI Tutor':     { bg: 'pi-purple', icon: '🎓' },
    'Language Bot': { bg: 'pi-teal',   icon: '💬' },
    'Translator':   { bg: 'pi-orange', icon: '🔄' },
  };

  const entries     = sessionHistory || [];
  const recentItems = entries.slice(0, 4);
  const hasHistory  = recentItems.length > 0;

  // ── Dynamic language stats from real session history ──
  const langCounts = entries.reduce((acc, e) => {
    acc[e.language] = (acc[e.language] || 0) + 1;
    return acc;
  }, {});
  const totalEntries = entries.length;

  // Build sorted language stats (top 3 only)
  const langStats = totalEntries > 0
    ? Object.entries(langCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([lang, count], i) => ({
          lang,
          pct: Math.round((count / totalEntries) * 100),
          cls: i === 0 ? '' : i === 1 ? 'progress-bar-fill--teal' : 'progress-bar-fill--purple',
        }))
    : [
        { lang: 'Hindi',   pct: 65, cls: '' },
        { lang: 'Telugu',  pct: 25, cls: 'progress-bar-fill--teal' },
        { lang: 'Tamil',   pct: 10, cls: 'progress-bar-fill--purple' },
      ];

  return (
    <div className="page-inner">
      {/* Greeting */}
      <div className="dash-greeting">
        <h1 className="t-headline-md" style={{ marginBottom: 4 }}>
          Namaste, {user?.name || 'Learner'}! 🙏
        </h1>
        <p className="t-body-md">What would you like to learn today?</p>
      </div>

      {/* Feature cards */}
      <div className="dash-feature-grid">
        {FEATURE_CARDS.map(c => (
          <div
            key={c.id}
            className={`feature-card ${c.accent}`}
            onClick={() => onNav(c.id)}
            style={{ cursor: 'pointer' }}
          >
            <span className="feature-card-arrow">↗</span>
            <div className={`feature-card-icon ${c.iconBg}`}>{c.icon}</div>
            <div className="feature-card-title">{c.title}</div>
            <div className="feature-card-desc">{c.desc}</div>
          </div>
        ))}
      </div>

      {/* Bottom grid */}
      <div className="dash-bottom-grid">
        {/* Recent Activity */}
        <div className="card card-p3">
          <div className="section-header">
            <div className="section-title">Recent Activity</div>
            <button className="btn btn-tertiary btn-sm" onClick={() => onNav('history')}>
              View All →
            </button>
          </div>

          {!hasHistory ? (
            <div style={{ padding: 'var(--sp-2) 0', textAlign: 'center' }}>
              <p className="t-helper" style={{ marginBottom: 8 }}>No activity yet this session.</p>
              <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
                <button className="btn btn-primary btn-sm" onClick={() => onNav('tutor')}>
                  🎓 Start AI Tutor
                </button>
                <button className="btn btn-secondary btn-sm" onClick={() => onNav('langbot')}>
                  💬 Language Bot
                </button>
                <button className="btn btn-ghost btn-sm" onClick={() => onNav('translator')}>
                  🔄 Translator
                </button>
              </div>
            </div>
          ) : (
            recentItems.map(r => {
              const meta = FEATURE_COLOR[r.feature] || { bg: 'pi-orange', icon: '📌' };
              return (
                <div
                  key={r.id}
                  className="project-item"
                  onClick={() => onNav('history')}
                  style={{ cursor: 'pointer' }}
                >
                  <div className={`project-icon ${meta.bg}`}>{meta.icon}</div>
                  <div className="project-info">
                    <div className="project-name">{r.title}</div>
                    <div className="project-meta">{r.feature} · {r.language}</div>
                  </div>
                  <span className="project-arrow">›</span>
                </div>
              );
            })
          )}
        </div>

        {/* Language Status */}
        <div className="card card-p3">
          <div className="section-title" style={{ marginBottom: '1rem' }}>
            Language Usage
            {totalEntries === 0 && (
              <span className="t-helper" style={{ marginLeft: 8, fontWeight: 400 }}>(sample data)</span>
            )}
          </div>
          {langStats.map(s => (
            <div key={s.lang} className="lang-stat">
              <div className="lang-stat-header">
                <span>{s.lang}</span>
                <span className="lang-stat-pct">{s.pct}%</span>
              </div>
              <div className="progress-bar-wrap">
                <div className={`progress-bar-fill ${s.cls}`} style={{ width: `${s.pct}%` }} />
              </div>
            </div>
          ))}
          {totalEntries > 0 && (
            <p className="t-helper" style={{ marginTop: 8 }}>
              Based on {totalEntries} session {totalEntries === 1 ? 'activity' : 'activities'}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
