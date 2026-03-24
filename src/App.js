import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import PHASES from './data/phases';
import { DEMO_CONVERSATIONS, DEMO_EXTRACTED } from './data/demoData';
import { chatCompletion, extractData } from './utils/llm';
import { buildExportPayload } from './utils/export';
import { saveSession, loadSession, clearSession } from './utils/storage';
import Sidebar from './components/Sidebar';
import LandingPage from './components/LandingPage';
import { Bubble, TypingDots, DataPanel, ExportModal, Toast } from './components/ChatComponents';

export default function App() {
  // ── Core state ──
  const [mode, setMode] = useState(null); // null | "demo" | "live"
  const [llmConfig, setLlmConfig] = useState({ apiKey: "", baseUrl: "https://api.openai.com/v1", model: "gpt-4o" });
  const [phase, setPhase] = useState("welcome");
  const [completed, setCompleted] = useState([]);
  const [convos, setConvos] = useState({});
  const [extracted, setExtracted] = useState({});

  // ── UI state ──
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showData, setShowData] = useState(false);
  const [error, setError] = useState(null);
  const [exportJson, setExportJson] = useState(null);
  const [toast, setToast] = useState(null); // { message, type }
  const [savedSession, setSavedSession] = useState(null); // session to offer resuming

  const initRef = useRef({});
  const endRef = useRef(null);
  const inputRef = useRef(null);
  const demoTimers = useRef([]);

  const msgs = useMemo(() => convos[phase] || [], [convos, phase]);
  const phaseObj = PHASES.find(p => p.id === phase);
  const pct = Math.round((completed.length / (PHASES.length - 1)) * 100);

  // ── Load saved session on mount ──
  useEffect(() => {
    const session = loadSession();
    if (session && session.mode === "live") {
      setSavedSession(session);
    }
  }, []);

  // ── Auto-save on state changes (live mode only) ──
  useEffect(() => {
    if (mode !== "live") return;
    saveSession({ mode, phase, completed, convos, extracted, llmConfig });
  }, [mode, phase, completed, convos, extracted, llmConfig]);

  // ── Auto-scroll ──
  const scroll = useCallback(() => {
    setTimeout(() => endRef.current?.scrollIntoView({ behavior: "smooth" }), 80);
  }, []);
  useEffect(() => { scroll(); }, [msgs, loading, scroll]);

  // ── Show toast helper ──
  const showToast = useCallback((message, type = "success") => {
    setToast({ message, type });
  }, []);

  // ── Demo engine ──
  const runDemo = useCallback(() => {
    const phaseIds = Object.keys(DEMO_CONVERSATIONS);
    let delay = 0;
    const timers = [];

    phaseIds.forEach((pid) => {
      const convo = DEMO_CONVERSATIONS[pid];
      convo.forEach((msg) => {
        delay += msg.role === "assistant" ? 1200 : 600;
        const d = delay;
        timers.push(setTimeout(() => {
          setPhase(pid);
          setConvos(prev => ({ ...prev, [pid]: [...(prev[pid] || []), msg] }));
        }, d));
      });
      delay += 400;
      const dd = delay;
      timers.push(setTimeout(() => {
        if (DEMO_EXTRACTED[pid]) setExtracted(prev => ({ ...prev, [pid]: DEMO_EXTRACTED[pid] }));
        setCompleted(prev => [...new Set([...prev, pid])]);
      }, dd));
    });

    demoTimers.current = timers;
  }, []);

  const startDemo = () => {
    setSavedSession(null);
    setMode("demo");
    setShowData(true);
    setConvos({});
    setExtracted({});
    setCompleted([]);
    setPhase("welcome");
    setError(null);
    setTimeout(() => runDemo(), 300);
  };

  const startLive = () => {
    if (!llmConfig.apiKey) {
      setError("Please enter an API key to start a live session.");
      return;
    }
    setSavedSession(null);
    clearSession();
    setError(null);
    setMode("live");
  };

  const resumeSession = (session) => {
    setSavedSession(null);
    setMode(session.mode);
    setPhase(session.phase);
    setCompleted(session.completed || []);
    setConvos(session.convos || {});
    setExtracted(session.extracted || {});
    setShowData(true);
    // Re-initialize initRef so we don't re-send the welcome message for completed phases
    const ref = {};
    (session.completed || []).forEach(pid => { ref[pid] = true; });
    if (session.phase) ref[session.phase] = true; // will re-trigger sendInit for current phase
    initRef.current = ref;
    showToast("Session restored — pick up right where you left off.", "success");
  };

  const resetAll = () => {
    demoTimers.current.forEach(clearTimeout);
    clearSession();
    setSavedSession(null);
    setMode(null);
    setConvos({});
    setExtracted({});
    setCompleted([]);
    setPhase("welcome");
    setShowData(false);
    setExportJson(null);
    setError(null);
    setToast(null);
    initRef.current = {};
  };

  // ── Live mode: send initial message per phase ──
  const sendInit = useCallback(async (pid) => {
    if (initRef.current[pid]) return;
    initRef.current[pid] = true;
    setLoading(true);
    setError(null);
    const p = PHASES.find(x => x.id === pid);
    try {
      const ctx = Object.entries(extracted)
        .filter(([, v]) => v && Object.keys(v).length > 0)
        .map(([k, v]) => `[${k}]: ${JSON.stringify(v)}`)
        .join("\n");
      const sys = p.systemContext + (ctx ? `\n\n---\nContext captured in previous phases:\n${ctx}` : "");
      const text = await chatCompletion({
        ...llmConfig,
        systemPrompt: sys,
        messages: [{ role: "user", content: "Begin this phase." }],
      });
      setConvos(prev => ({ ...prev, [pid]: [{ role: "assistant", content: text }] }));
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  }, [extracted, llmConfig]);

  useEffect(() => {
    if (mode === "live" && !initRef.current[phase]) sendInit(phase);
  }, [mode, phase, sendInit]);

  // ── Live mode: send user message ──
  const handleSend = async () => {
    const txt = input.trim();
    if (!txt || loading || mode !== "live") return;
    setInput("");
    if (inputRef.current) inputRef.current.style.height = "42px";
    setError(null);
    const p = PHASES.find(x => x.id === phase);
    const updated = [...(convos[phase] || []), { role: "user", content: txt }];
    setConvos(prev => ({ ...prev, [phase]: updated }));
    setLoading(true);

    try {
      // Build context from all extracted phases (excluding current)
      const ctx = Object.entries(extracted)
        .filter(([k, v]) => v && Object.keys(v).length > 0 && k !== phase)
        .map(([k, v]) => `[${k}]: ${JSON.stringify(v)}`)
        .join("\n");
      const sys = p.systemContext + (ctx ? `\n\n---\nContext from previous phases:\n${ctx}` : "");

      // Ensure message array starts with user role (API requirement)
      const apiMsgs = updated.map(m => ({ role: m.role, content: m.content }));
      if (apiMsgs[0]?.role === "assistant") {
        apiMsgs.unshift({ role: "user", content: "Begin this phase." });
      }

      const reply = await chatCompletion({ ...llmConfig, systemPrompt: sys, messages: apiMsgs });
      const newConvo = [...updated, { role: "assistant", content: reply }];
      setConvos(prev => ({ ...prev, [phase]: newConvo }));

      // Extract structured data after 2+ user messages
      const userMsgCount = updated.filter(m => m.role === "user").length;
      if (p.extractionKeys.length > 0 && userMsgCount >= 2) {
        try {
          const fullMsgs = [...apiMsgs, { role: "assistant", content: reply }];
          const parsed = await extractData({ ...llmConfig, messages: fullMsgs, fields: p.extractionKeys });

          // Only update if we got meaningful new data
          const nonNullFields = Object.values(parsed).filter(v => v != null).length;
          if (nonNullFields > 0) {
            setExtracted(prev => ({ ...prev, [phase]: { ...(prev[phase] || {}), ...parsed } }));
            // Subtle toast on first extraction for a phase
            if (!extracted[phase]) {
              showToast("Data captured — check the panel on the right.", "success");
            }
          }
        } catch (e) {
          // Extraction failures are non-blocking — log but don't surface to user
          console.warn("Extraction skipped:", e.message);
        }
      }

      // Suggest advancing if phase has substantial data (4+ user messages)
      if (userMsgCount >= 4 && !completed.includes(phase) && p.id !== "roi") {
        // Small nudge — handled by the "ready to advance" indicator in the header
      }
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
    inputRef.current?.focus();
  };

  const advance = () => {
    const idx = PHASES.findIndex(p => p.id === phase);
    if (idx < PHASES.length - 1) {
      setCompleted(prev => [...new Set([...prev, phase])]);
      setPhase(PHASES[idx + 1].id);
    }
  };

  const handleExport = () => {
    const payload = buildExportPayload(extracted, convos);
    setExportJson(JSON.stringify(payload, null, 2));
  };

  // ── How many user messages in the current phase? ──
  const userMsgCount = msgs.filter(m => m.role === "user").length;
  const phaseHasEnoughData = userMsgCount >= 3;

  // ── Landing page ──
  if (!mode) {
    return (
      <LandingPage
        llmConfig={llmConfig}
        setLlmConfig={setLlmConfig}
        onStartDemo={startDemo}
        onStartLive={startLive}
        savedSession={savedSession}
        onResumeSession={resumeSession}
        error={error}
      />
    );
  }

  // ── Main UI ──
  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      <Sidebar
        phases={PHASES}
        currentPhase={phase}
        completedPhases={completed}
        extractedData={extracted}
        onPhaseClick={setPhase}
        onExport={handleExport}
        onReset={resetAll}
        completionPct={pct}
        mode={mode}
      />

      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        {/* Header bar */}
        <div style={{
          padding: "14px 28px",
          borderBottom: "0.5px solid var(--color-border-1)",
          background: "var(--color-bg-1)",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          flexWrap: "wrap", gap: 8,
        }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              {mode === "demo" && (
                <span className="badge badge-warning">Demo — NovaTech</span>
              )}
              {mode === "live" && (
                <span className="badge badge-info">{llmConfig.model}</span>
              )}
              <span style={{ fontSize: 16, color: "var(--accent)" }}>{phaseObj.icon}</span>
              <span style={{ fontSize: 16, fontWeight: 600, fontFamily: "'Fraunces', serif" }}>
                {phaseObj.label}
              </span>
              {mode === "live" && phaseHasEnoughData && !completed.includes(phase) && (
                <span className="badge badge-success">Ready to advance →</span>
              )}
            </div>
            <div style={{ fontSize: 12, color: "var(--color-text-2)", marginTop: 2 }}>
              {phaseObj.description}
            </div>
          </div>

          <div style={{ display: "flex", gap: 8 }}>
            <button
              onClick={() => setShowData(!showData)}
              className="hdr-btn"
              style={{ background: showData ? "var(--accent-bg)" : undefined, color: showData ? "var(--accent)" : undefined }}
            >
              {showData ? "Hide" : "Show"} data
            </button>
            {mode === "live" && (
              <button onClick={advance} className="hdr-btn-primary">
                {phase === "welcome" ? "Begin →" : "Next phase →"}
              </button>
            )}
            <button onClick={resetAll} className="hdr-btn">Reset</button>
          </div>
        </div>

        {/* Chat + Data */}
        <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
          {/* Chat pane */}
          <div style={{ flex: 1, overflowY: "auto", padding: "20px 28px", minWidth: 0 }}>
            {msgs.length === 0 && !loading && mode === "demo" && (
              <div style={{ color: "var(--color-text-3)", fontSize: 13, textAlign: "center", marginTop: 60 }}>
                Demo loading…
              </div>
            )}
            {msgs.map((m, i) => (
              <Bubble key={`${phase}-${i}`} role={m.role} content={m.content} />
            ))}
            {loading && (
              <div style={{ display: "flex", marginBottom: 14 }}>
                <div style={{ padding: "4px 15px", borderRadius: 14, background: "var(--color-bg-2)" }}>
                  <TypingDots />
                </div>
              </div>
            )}
            {error && (
              <div style={{
                padding: "10px 14px", margin: "8px 0", borderRadius: 8,
                background: "var(--color-bg-danger)", color: "var(--color-text-danger)",
                fontSize: 13, lineHeight: 1.5,
                display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8,
              }}>
                <span>{error}</span>
                <button
                  onClick={() => setError(null)}
                  style={{ background: "none", border: "none", color: "var(--color-text-danger)", cursor: "pointer", fontSize: 16, flexShrink: 0, padding: 0, lineHeight: 1 }}
                >
                  ×
                </button>
              </div>
            )}
            <div ref={endRef} />
          </div>

          {/* Data panel */}
          {showData && (
            <div style={{
              width: 300, flexShrink: 0,
              borderLeft: "0.5px solid var(--color-border-1)",
              background: "var(--color-bg-1)",
              overflowY: "auto",
            }}>
              <DataPanel data={extracted} phase={phase} phases={PHASES} />
            </div>
          )}
        </div>

        {/* Input bar (live mode only) */}
        {mode === "live" && (
          <div style={{
            padding: "14px 28px 20px",
            borderTop: "0.5px solid var(--color-border-1)",
            background: "var(--color-bg-1)",
          }}>
            <div style={{ display: "flex", gap: 10, alignItems: "flex-end" }}>
              <textarea
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => {
                  if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
                }}
                placeholder={loading ? "Atlas is thinking…" : "Share your thoughts…"}
                rows={1}
                disabled={loading}
                style={{
                  flex: 1, padding: "10px 14px", borderRadius: 10,
                  border: "0.5px solid var(--color-border-2)",
                  background: "var(--color-bg-1)",
                  color: "var(--color-text-1)",
                  fontSize: 14, lineHeight: 1.5,
                  resize: "none", outline: "none", fontFamily: "inherit",
                  minHeight: 42, maxHeight: 160, overflowY: "auto",
                  transition: "border-color 0.2s",
                  opacity: loading ? 0.6 : 1,
                }}
                onInput={e => {
                  e.target.style.height = "42px";
                  e.target.style.height = Math.min(e.target.scrollHeight, 160) + "px";
                }}
                onFocus={e => { e.target.style.borderColor = "var(--accent)"; }}
                onBlur={e => { e.target.style.borderColor = "var(--color-border-2)"; }}
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || loading}
                style={{
                  width: 42, height: 42, borderRadius: 10, border: "none",
                  background: input.trim() && !loading ? "var(--accent)" : "var(--color-bg-3)",
                  color: input.trim() && !loading ? "#fff" : "var(--color-text-3)",
                  fontSize: 18, cursor: input.trim() && !loading ? "pointer" : "default",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0, transition: "background 0.2s",
                }}
              >
                ↑
              </button>
            </div>
            <div style={{ fontSize: 11, color: "var(--color-text-3)", marginTop: 6, textAlign: "center" }}>
              Enter to send · Shift+Enter for new line · Powered by {llmConfig.model}
            </div>
          </div>
        )}
      </div>

      <ExportModal json={exportJson} onClose={() => setExportJson(null)} />
      <Toast message={toast?.message} type={toast?.type} onDismiss={() => setToast(null)} />

      <style>{`
        .hdr-btn {
          padding: 7px 12px; border-radius: 7px;
          border: 0.5px solid var(--color-border-2);
          background: var(--color-bg-1); color: var(--color-text-2);
          font-size: 12px; font-weight: 600; cursor: pointer;
          transition: background 0.15s;
        }
        .hdr-btn:hover { background: var(--color-bg-2); }
        .hdr-btn-primary {
          padding: 7px 12px; border-radius: 7px; border: none;
          background: var(--accent); color: #fff;
          font-size: 12px; font-weight: 600; cursor: pointer;
          transition: filter 0.15s;
        }
        .hdr-btn-primary:hover { filter: brightness(0.9); }
        .badge {
          font-size: 10px; font-weight: 600; padding: 2px 8px;
          border-radius: 4px; text-transform: uppercase; letter-spacing: 0.05em;
        }
        .badge-warning { background: var(--color-bg-warning); color: var(--color-text-warning); }
        .badge-info    { background: var(--color-bg-info);    color: var(--color-text-info); }
        .badge-success { background: var(--color-bg-info);    color: var(--color-text-info); }
      `}</style>
    </div>
  );
}
