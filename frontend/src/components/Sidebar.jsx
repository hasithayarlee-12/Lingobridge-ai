/* Sidebar — Tech Stack + How It Works + Features
   Only shows technologies that ACTUALLY exist in this project. */

const TECH_STACK = [
  { layer: 'Frontend',       name: 'React 19 + Vite 8',      icon: '⚛️'  },
  { layer: 'Styling',        name: 'Pure CSS (CSS Variables)', icon: '🎨'  },
  { layer: 'HTTP Client',    name: 'Axios',                   icon: '📡'  },
  { layer: 'Backend',        name: 'Python + FastAPI',        icon: '🐍'  },
  { layer: 'AI / LLM',       name: 'Gemini 2.0 Flash',        icon: '✨'  },
  { layer: 'PDF Processing', name: 'PyMuPDF (fitz)',           icon: '📄'  },
  { layer: 'Image AI',       name: 'Gemini Vision',           icon: '🖼️'  },
  { layer: 'Voice Input',    name: 'Web Speech API (Chrome)', icon: '🎤'  },
  { layer: 'API Design',     name: 'REST / JSON',             icon: '🔌'  },
];

const PIPELINE = [
  { label: 'User Input',         desc: 'Text, voice, PDF or image'         },
  { label: 'Language Detection', desc: 'English / Hindi / Telugu selector'  },
  { label: 'Prompt Engineering', desc: 'Level-aware prompts built in Python' },
  { label: 'Gemini 2.0 Flash',   desc: 'AI generates explanation / quiz'    },
  { label: 'Response Delivery',  desc: 'FastAPI → Vite proxy → React UI'   },
];

const FEATURES = [
  { icon: '💬', text: 'Multilingual AI Chat' },
  { icon: '🌐', text: 'Hindi & Telugu support' },
  { icon: '📊', text: 'Beginner / Intermediate / Advanced' },
  { icon: '🎤', text: 'Voice input (Chrome)' },
  { icon: '📄', text: 'PDF text extraction' },
  { icon: '🖼️', text: 'Image / diagram explanation' },
  { icon: '🧠', text: 'Auto quiz generation' },
  { icon: '✅', text: 'Quiz scoring + revision tips' },
];

export default function Sidebar() {
  return (
    <aside className="sidebar">

      {/* ── Features ── */}
      <section className="sidebar-section">
        <div className="sidebar-title">🚀 Features</div>
        <div className="feature-list">
          {FEATURES.map(f => (
            <div key={f.text} className="feature-item">
              <span className="feature-icon">{f.icon}</span>
              {f.text}
            </div>
          ))}
        </div>
      </section>

      {/* ── Tech Stack ── */}
      <section className="sidebar-section">
        <div className="sidebar-title">⚙️ Technology Stack</div>
        <div className="tech-grid">
          {TECH_STACK.map(t => (
            <div key={t.layer} className="tech-item">
              <div className="tech-icon">{t.icon}</div>
              <div className="tech-info">
                <div className="tech-layer">{t.layer}</div>
                <div className="tech-name">{t.name}</div>
              </div>
              <div className="tech-dot" title="Active" />
            </div>
          ))}
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="sidebar-section">
        <div className="sidebar-title">🔄 How LingoBridge Works</div>
        <div className="pipeline">
          {PIPELINE.map((step, i) => (
            <div key={i} className="pipeline-step">
              <div className="pipeline-num">{i + 1}</div>
              <div className="pipeline-content">
                <div className="pipeline-label">{step.label}</div>
                <div className="pipeline-desc">{step.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

    </aside>
  );
}
