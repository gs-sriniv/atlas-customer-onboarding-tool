import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import PHASES from './data/phases';
import { DEMO_CONVERSATIONS, DEMO_EXTRACTED } from './data/demoData';
import { chatCompletion, extractData } from './utils/llm';
import { buildExportPayload } from './utils/export';
import Sidebar from './components/Sidebar';
import LandingPage from './components/LandingPage';
import { Bubble, TypingDots, DataPanel, ExportModal } from './components/ChatComponents';

export default function App() {
  // ── State ──
  const [mode, setMode] = useState(null); // null | "demo" | "live"
  const [llmConfig, setLlmConfig] = useState({ apiKey: "", baseUrl: "https://api.openai.com/v1", model: "gpt-4o" });
  const [phase, setPhase] = useState("welcome");
  const [completed, setCompleted] = useState([]);
  const [convos, setConvos] = useState({});
  const [extracted, setExtracted] = useState({});
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showData, setShowData] = useState(false);
  const [error, setError] = useState(null);
  const [exportJson, setExportJson] = useState(null);
  const initRef = useRef({});
  const endRef = useRef(null);
  const inputRef = useRef(null);
  const demoTimers = useRef([]);

  const msgs = useMemo(() => convos[phase] || [], [convos, phase]);
  const phaseObj = PHASES.find(p => p.id === phase);
  const pct = Math.round((completed.length / (PHASES.length - 1)) * 100);

  // ── Auto-scroll ──
  const scroll = useCallback(() => {
    setTimeout(() => endRef.current?.scrollIntoView({ behavior: "smooth" }), 80);
  }, []);
  useEffect(() => { scroll(); }, [msgs, loading, scroll]);

  // ── Demo engine ──
  const runDemo = useCallback(() => {
    const phaseIds = Object.keys(DEMO_CONVERSATIONS);
    let delay = 0;
    const timers = [];

    phaseIds.forEach((pid, pi) => {
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
    setError(null);
    setMode("live");
  };

  const resetAll = () => {
    demoTimers.current.forEach(clearTimeout);
    setMode(null);
    setConvos({});
    setExtracted({});
    setCompleted([]);
    setPhase("welcome");
    setShowData(false);
    setExportJson(null);
    setError(null);
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
        .map(([k, v]) => `${k}: ${JSON.stringify(v)}`).join("\n");
      const sys = p.systemContext + (ctx ? `\n\nContext from previous phases:\n${ctx}` : "");
      const text = await chatCompletion({
        ...llmConfig,
        systemPrompt: sys,
        messages: [{ role: "user", content: "Begin this phase." }],
      });
      setConvos(prev => ({ ...prev, [pid]: [{ role: "assistant", content: text }] }));
    } catch (err) {
      setError(`Connection failed: ${err.message}`);
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
      const ctx = Object.entries(extracted)
        .filter(([k, v]) => v && Object.keys(v).length > 0 && k !== phase)
        .map(([k, v]) => `${k}: ${JSON.stringify(v)}`).join("\n");
      const sys = p.systemContext + (ctx ? `\n\nContext from previous phases:\n${ctx}` : "");

      const apiMsgs = updated.map(m => ({ role: m.role, content: m.content }));
      if (apiMsgs[0]?.role === "assistant") apiMsgs.unshift({ role: "user", content: "Begin this phase." });

      const reply = await chatCompletion({ ...llmConfig, systemPrompt: sys, messages: apiMsgs });
      setConvos(prev => ({ ...prev, [phase]: [...updated, { role: "assistant", content: reply }] }));

      // Extract structured data after 2+ user messages
      if (p.extractionKeys.length > 0 && updated.filter(m => m.role === "user").length >= 2) {
        try {
          const fullMsgs = [...apiMsgs, { role: "assistant", content: reply }];
          const parsed = await extractData({ ...llmConfig, messages: fullMsgs, fields: p.extractionKeys });
          setExtracted(prev => ({ ...prev, [phase]: { ...(prev[phase] || {}), ...parsed } }));
        } catch (e) {
          console.log("Extraction skipped:", e.message);
        }
      }
    } catch (err) {
      setError(`Error: ${err.message}`);
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

  // ── Landing page ──
  if (!mode) {
    return <LandingPage
      llmConfig={llmConfig}
      setLlmConfig={setLlmConfig}
      onStartDemo={startDemo}
      onStartLive={startLive}
      error={error}
    />;
  }

  // ── Main UI ──
  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      <Sidebar
        phases={PHASES}
        currentPhase={phase}
        completedPhases={completed}
        onPhaseClick={setPhase}
        onExport={handleExport}
        completionPct={pct}
      />

      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        {/* Header bar */}
        <div style={{ padding: "14px 28px", borderBottom: "0.5px solid var(--color-border-1)", background: "var(--color-bg-1)", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              {mode === "demo" && <span style={{ fontSize: 10, fontWeight: 600, padding: "2px 8px", borderRadius: 4, background: "var(--color-bg-warning)", color: "var(--color-text-warning)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Demo — NovaTech</span>}
              {mode === "live" && <span style={{ fontSize: 10, fontWeight: 600, padding: "2px 8px", borderRadius: 4, background: "var(--color-bg-info)", color: "var(--color-text-info)", textTransform: "uppercase", letterSpacing: "0.05em" }}>{llmConfig.model}</span>}
              <span style={{ fontSize: 16, color: "var(--accent)" }}>{phaseObj.icon}</span>
              <span style={{ fontSize: 16, fontWeight: 600, fontFamily: "'Fraunces', serif" }}>{phaseObj.label}</span>
            </div>
            <div style={{ fontSize: 12, color: "var(--color-text-2)", marginTop: 2 }}>{phaseObj.description}</div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => setShowData(!showData)} className="hdr-btn" style={{ background: showData ? "var(--accent-bg)" : undefined, color: showData ? "var(--accent)" : undefined }}>
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
          <div style={{ flex: 1, overflowY: "auto", padding: "20px 28px", minWidth: 0 }}>
            {msgs.map((m, i) => <Bubble key={`${phase}-${i}`} role={m.role} content={m.content} />)}
            {loading && (
              <div style={{ display: "flex", marginBottom: 14 }}>
                <div style={{ padding: "4px 15px", borderRadius: 14, background: "var(--color-bg-2)" }}><TypingDots /></div>
              </div>
            )}
            {error && (
              <div style={{ padding: "9px 14px", margin: "8px 0", borderRadius: 8, background: "var(--color-bg-danger)", color: "var(--color-text-danger)", fontSize: 13 }}>{error}</div>
            )}
            <div ref={endRef} />
          </div>
          {showData && (
            <div style={{ width: 280, flexShrink: 0, borderLeft: "0.5px solid var(--color-border-1)", background: "var(--color-bg-1)", overflowY: "auto" }}>
              <DataPanel data={extracted} phase={phase} />
            </div>
          )}
        </div>

        {/* Input */}
        {mode === "live" && (
          <div style={{ padding: "14px 28px 20px", borderTop: "0.5px solid var(--color-border-1)", background: "var(--color-bg-1)" }}>
            <div style={{ display: "flex", gap: 10, alignItems: "flex-end" }}>
              <textarea
                ref={inputRef} value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                placeholder="Share your thoughts..."
                rows={1}
                style={{
                  flex: 1, padding: "10px 14px", borderRadius: 10,
                  border: "0.5px solid var(--color-border-2)", background: "var(--color-bg-1)",
                  color: "var(--color-text-1)", fontSize: 14, lineHeight: 1.5,
                  resize: "none", outline: "none", fontFamily: "inherit",
                  minHeight: 42, maxHeight: 120, overflowY: "auto",
                }}
                onInput={e => { e.target.style.height = "42px"; e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px"; }}
              />
              <button onClick={handleSend} disabled={!input.trim() || loading}
                style={{
                  width: 42, height: 42, borderRadius: 10, border: "none",
                  background: input.trim() && !loading ? "var(--accent)" : "var(--color-bg-3)",
                  color: input.trim() && !loading ? "#fff" : "var(--color-text-3)",
                  fontSize: 18, cursor: input.trim() && !loading ? "pointer" : "default",
                  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                }}>↑</button>
            </div>
            <div style={{ fontSize: 11, color: "var(--color-text-3)", marginTop: 6, textAlign: "center" }}>
              Enter to send · Shift+Enter for new line · Powered by {llmConfig.model}
            </div>
          </div>
        )}
      </div>

      <ExportModal json={exportJson} onClose={() => setExportJson(null)} />

      <style>{`
        .hdr-btn { padding: 7px 12px; border-radius: 8; border: 0.5px solid var(--color-border-2); background: var(--color-bg-1); color: var(--color-text-2); font-size: 12px; font-weight: 600; cursor: pointer; }
        .hdr-btn:hover { background: var(--color-bg-2); }
        .hdr-btn-primary { padding: 7px 12px; border-radius: 8; border: none; background: var(--accent); color: #fff; font-size: 12px; font-weight: 600; cursor: pointer; }
        .hdr-btn-primary:hover { filter: brightness(0.9); }
      `}</style>
    </div>
  );
}
