// Translator page — text + document translation via /api/chat
import { useState, useEffect } from 'react';
import { sendChat, uploadFile } from '../api/lingoApi';
import { useSpeechInput } from '../hooks/useSpeechInput';
import { LANGUAGES } from '../config/languages';

const TABS = ['Text', 'Document'];

export default function Translator({ language: globalLang, onAddHistory }) {
  const [tab,         setTab]         = useState('Text');
  const [sourceLang,  setSourceLang]  = useState('English');
  const [targetLang,  setTargetLang]  = useState(
    globalLang && globalLang !== 'English' ? globalLang : 'Hindi'
  );
  const [sourceText,  setSourceText]  = useState('');
  const [translation, setTranslation] = useState('');
  const [isLoading,   setIsLoading]   = useState(false);
  const [error,       setError]       = useState('');
  const [copied,      setCopied]      = useState(false);

  // Sync target language when global language changes
  useEffect(() => {
    if (globalLang && globalLang !== 'English') setTargetLang(globalLang);
  }, [globalLang]);

  const { transcript, isListening, isSupported, startListening, stopListening, clearTranscript } =
    useSpeechInput(sourceLang);

  // Safe: only run when transcript changes
  useEffect(() => {
    if (transcript) {
      setSourceText(p => (p ? p + ' ' + transcript : transcript));
      clearTranscript();
    }
  }, [transcript]); // eslint-disable-line

  async function handleTranslate() {
    const text = sourceText.trim();
    if (!text) return;
    setIsLoading(true); setError(''); setTranslation('');
    try {
      const prompt = `Translate the following text from ${sourceLang} to ${targetLang}.
Return ONLY the translated text, nothing else. Do not add explanations or notes.

Text to translate:
${text}`;
      const result = await sendChat(prompt, targetLang, 'Intermediate');
      setTranslation(result);
      onAddHistory?.('Translator', text.slice(0, 60), targetLang, {
        extra: `${sourceLang} → ${targetLang}`,
      });
    } catch (err) {
      setError(err?.response?.data?.detail || 'Translation failed. Is the backend running?');
    } finally { setIsLoading(false); }
  }

  function swapLanguages() {
    setSourceLang(targetLang);
    setTargetLang(sourceLang);
    setSourceText(translation);
    setTranslation(sourceText);
  }

  function copyResult() {
    navigator.clipboard.writeText(translation).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  function downloadResult() {
    const blob = new Blob([translation], { type: 'text/plain;charset=utf-8' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = `translation_${targetLang.toLowerCase()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  return (
    <div className="page-inner">
      {/* Header */}
      <div style={{ marginBottom: 'var(--sp-3)' }}>
        <h2 className="t-headline-md">Document & Text Translator</h2>
        <p className="t-body-md" style={{ marginTop: 4 }}>
          Translate text and documents between English and Indian languages instantly.
        </p>
      </div>

      {/* Tabs */}
      <div className="tabs">
        {TABS.map(t => (
          <button
            key={t}
            className={`tab-btn ${tab === t ? 'active' : ''}`}
            onClick={() => setTab(t)}
          >
            {t === 'Text' ? '📝' : '📄'} {t}
          </button>
        ))}
      </div>

      {/* Translator panel */}
      <div className="translator-panel">
        {/* Language bar */}
        <div className="trans-lang-bar">
          <select
            className="lb-select"
            value={sourceLang}
            onChange={e => setSourceLang(e.target.value)}
          >
            {LANGUAGES.map(l => <option key={l.value} value={l.value}>{l.flag} {l.value}</option>)}
          </select>

          <button
            className="trans-swap-btn"
            onClick={swapLanguages}
            title="Swap languages"
            disabled={isLoading}
          >
            ⇄
          </button>

          <select
            className="lb-select"
            value={targetLang}
            onChange={e => setTargetLang(e.target.value)}
          >
            {LANGUAGES.map(l => <option key={l.value} value={l.value}>{l.flag} {l.value}</option>)}
          </select>
        </div>

        {/* Text tab */}
        {tab === 'Text' && (
          <div className="trans-body">
            {/* Source column */}
            <div className="trans-col">
              <div className="trans-col-label">Source — {sourceLang}</div>
              <textarea
                className="lb-textarea"
                placeholder="Type or paste text here…"
                value={sourceText}
                onChange={e => setSourceText(e.target.value)}
                onKeyDown={e => {
                  if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') handleTranslate();
                }}
                style={{ minHeight: 180, width: '100%', flex: 1 }}
              />
              <div className="trans-actions">
                {isSupported && (
                  <button
                    className="btn btn-ghost btn-sm"
                    onClick={isListening ? stopListening : startListening}
                    style={isListening ? { borderColor: 'var(--error)', color: 'var(--error)' } : {}}
                  >
                    {isListening ? '🔴 Listening…' : '🎤 Voice'}
                  </button>
                )}
                {sourceText && (
                  <button
                    className="btn btn-ghost btn-sm"
                    onClick={() => { setSourceText(''); setTranslation(''); }}
                  >
                    ✕ Clear
                  </button>
                )}
                <button
                  className="btn btn-primary"
                  onClick={handleTranslate}
                  disabled={isLoading || !sourceText.trim()}
                >
                  {isLoading ? '⏳ Translating…' : '🔄 Translate'}
                </button>
              </div>
            </div>

            {/* Output column */}
            <div className="trans-col trans-col--right">
              <div className="trans-col-label">Translation — {targetLang}</div>
              <div className="trans-output" style={{ flex: 1, whiteSpace: 'pre-wrap' }}>
                {isLoading
                  ? <span style={{ color: 'var(--muted)' }}>Translating…</span>
                  : translation
                    || <span style={{ color: 'var(--muted)' }}>Translation will appear here</span>
                }
              </div>
              <div className="trans-actions">
                {translation && (
                  <>
                    <button className="btn btn-ghost btn-sm" onClick={copyResult}>
                      {copied ? '✅ Copied!' : '📋 Copy'}
                    </button>
                    <button className="btn btn-ghost btn-sm" onClick={downloadResult}>
                      ⬇ Download
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Document tab */}
        {tab === 'Document' && (
          <div style={{ padding: 'var(--sp-3)', display: 'flex', flexDirection: 'column', gap: 'var(--sp-2)' }}>
            <p className="t-body-md">
              Upload a PDF to extract and translate its text content.
            </p>
            <div
              className="upload-zone"
              style={{ padding: 'var(--sp-4)', justifyContent: 'center', cursor: 'pointer' }}
              onClick={() => !isLoading && document.getElementById('trans-doc-input').click()}
            >
              <input
                id="trans-doc-input"
                type="file"
                accept=".pdf"
                style={{ display: 'none' }}
                onChange={async e => {
                  const file = e.target.files[0];
                  if (!file) return;
                  e.target.value = '';
                  setIsLoading(true); setError('');
                  try {
                    const ans = await uploadFile(file, targetLang, 'Intermediate');
                    setTranslation(ans);
                    setTab('Text');
                    onAddHistory?.('Translator', `Doc: ${file.name}`.slice(0, 60), targetLang, {
                      extra: `PDF → ${targetLang}`,
                    });
                  } catch (err) {
                    setError(err?.response?.data?.detail || 'Upload failed. Is the backend running?');
                  } finally { setIsLoading(false); }
                }}
              />
              <span>{isLoading ? '⏳' : '📄'}</span>
              <span>{isLoading ? 'Processing document…' : 'Drop a PDF here or click to browse'}</span>
            </div>
            {isLoading && <p className="t-helper">⏳ Extracting and translating document content…</p>}
          </div>
        )}
      </div>

      {error && <div className="error-bar" style={{ marginTop: 'var(--sp-2)' }}>⚠️ {error}</div>}
    </div>
  );
}
