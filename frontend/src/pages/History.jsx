// History page
// Session-based: shows real activity logged during this browser session.
// The backend has no database or persistence — this is an honest implementation.

const FEATURE_META = {
  'AI Tutor':     { icon: '🎓', color: 'pi-purple' },
  'Language Bot': { icon: '💬', color: 'pi-teal'   },
  'Translator':   { icon: '🔄', color: 'pi-orange'  },
};

const FEATURE_ORDER = ['AI Tutor', 'Language Bot', 'Translator'];

function timeAgo(isoString) {
  const diff = Date.now() - new Date(isoString).getTime();
  const mins  = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days  = Math.floor(diff / 86400000);
  if (mins  < 1)  return 'just now';
  if (mins  < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

export default function History({ sessionHistory, onNav }) {
  const entries = sessionHistory || [];

  // Group by feature
  const grouped = FEATURE_ORDER.reduce((acc, feat) => {
    const items = entries.filter(e => e.feature === feat);
    if (items.length) acc[feat] = items;
    return acc;
  }, {});

  const isEmpty = entries.length === 0;

  return (
    <div className="page-inner" style={{ maxWidth: 800 }}>
      {/* Header */}
      <div style={{ marginBottom: 'var(--sp-3)' }}>
        <h2 className="t-headline-md">🕐 History</h2>
        <p className="t-body-md" style={{ marginTop: 4 }}>
          Your learning and translation activity this session.
        </p>
        <p className="t-helper" style={{ marginTop: 6 }}>
          Note: History is session-based and resets on page reload. A database is not connected.
        </p>
      </div>

      {isEmpty ? (
        /* ── Empty state ── */
        <div className="card card-p4" style={{ textAlign: 'center', padding: 'var(--sp-5)' }}>
          <div style={{ fontSize: '3rem', marginBottom: 'var(--sp-2)' }}>📭</div>
          <div className="t-headline-sm" style={{ marginBottom: 8 }}>No activity yet</div>
          <p className="t-body-md" style={{ marginBottom: 'var(--sp-3)' }}>
            Start using AI Tutor, Language Bot, or Translator — your activity will appear here.
          </p>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="btn btn-primary" onClick={() => onNav('tutor')}>🎓 AI Tutor</button>
            <button className="btn btn-secondary" onClick={() => onNav('langbot')}>💬 Language Bot</button>
            <button className="btn btn-ghost" onClick={() => onNav('translator')}>🔄 Translator</button>
          </div>
        </div>
      ) : (
        /* ── Grouped history ── */
        Object.entries(grouped).map(([feature, items]) => {
          const meta = FEATURE_META[feature] || { icon: '📌', color: 'pi-orange' };
          return (
            <div key={feature} style={{ marginBottom: 'var(--sp-3)' }}>
              <div className="section-header" style={{ marginBottom: 'var(--sp-1)' }}>
                <div className="section-title">{meta.icon} {feature}</div>
                <span className="t-helper">{items.length} {items.length === 1 ? 'entry' : 'entries'}</span>
              </div>

              <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                {items.map((entry, i) => (
                  <div
                    key={entry.id}
                    className="history-item"
                    style={{ borderBottom: i < items.length - 1 ? '1px solid var(--surface-high)' : 'none' }}
                  >
                    <div className={`project-icon ${meta.color}`} style={{ flexShrink: 0 }}>
                      {meta.icon}
                    </div>
                    <div className="project-info" style={{ flex: 1, minWidth: 0 }}>
                      <div className="project-name">{entry.title}</div>
                      <div className="project-meta">
                        {entry.language}
                        {entry.difficulty ? ` · ${entry.difficulty}` : ''}
                        {entry.extra ? ` · ${entry.extra}` : ''}
                        <span style={{ marginLeft: 8, color: 'var(--muted)' }}>{timeAgo(entry.timestamp)}</span>
                      </div>
                    </div>
                    <button
                      className="btn btn-ghost btn-sm"
                      onClick={() => onNav(
                        feature === 'AI Tutor'     ? 'tutor'      :
                        feature === 'Language Bot' ? 'langbot'    : 'translator'
                      )}
                    >
                      Open →
                    </button>
                  </div>
                ))}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
