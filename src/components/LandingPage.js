import React from 'react';
import { LLM_PRESETS } from '../data/phases';

export default function LandingPage({ llmConfig, setLlmConfig, onStartDemo, onStartLive, error }) {
  return (
    <div style={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ maxWidth: 520, width: "100%", padding: "0 20px" }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ width: 56, height: 56, borderRadius: 16, background: "linear-gradient(135deg, var(--accent), var(--accent-light))", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 26, fontWeight: 700, margin: "0 auto 20px" }}>A</div>
          <h1 style={{ fontSize: 28, fontWeight: 700, margin: "0 0 8px", fontFamily: "'Fraunces', serif" }}>Atlas discovery</h1>
          <p style={{ fontSize: 15, color: "var(--color-text-2)", margin: 0, lineHeight: 1.6 }}>Configure your renewal agent through a guided conversation.</p>
        </div>

        {/* LLM Config */}
        <div style={{ background: "var(--color-bg-1)", borderRadius: 12, border: "0.5px solid var(--color-border-1)", padding: 20, marginBottom: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 14 }}>
            LLM configuration <span style={{ fontSize: 11, fontWeight: 400, color: "var(--color-text-3)" }}>— OpenAI-compatible API</span>
          </div>

          <div style={{ display: "flex", gap: 6, marginBottom: 14, flexWrap: "wrap" }}>
            {LLM_PRESETS.map(preset => (
              <button key={preset.label}
                onClick={() => setLlmConfig(prev => ({ ...prev, baseUrl: preset.url, model: preset.model }))}
                style={{
                  padding: "5px 10px", borderRadius: 6,
                  border: "0.5px solid var(--color-border-1)",
                  background: llmConfig.baseUrl === preset.url ? "var(--accent-bg)" : "var(--color-bg-2)",
                  color: llmConfig.baseUrl === preset.url ? "var(--accent)" : "var(--color-text-2)",
                  fontSize: 11, fontWeight: 500, cursor: "pointer",
                }}>{preset.label}</button>
            ))}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <Field label="API base URL" value={llmConfig.baseUrl} onChange={v => setLlmConfig(p => ({ ...p, baseUrl: v }))} placeholder="https://api.openai.com/v1" mono />
            <Field label="API key" value={llmConfig.apiKey} onChange={v => setLlmConfig(p => ({ ...p, apiKey: v }))} placeholder="sk-..." mono password />
            <Field label="Model" value={llmConfig.model} onChange={v => setLlmConfig(p => ({ ...p, model: v }))} placeholder="gpt-4o" mono />
          </div>
        </div>

        {/* Action buttons */}
        <div style={{ display: "flex", gap: 14 }}>
          <button onClick={onStartDemo} style={{
            padding: "16px 24px", borderRadius: 12, border: "0.5px solid var(--color-border-2)",
            background: "var(--color-bg-1)", color: "var(--color-text-1)",
            fontSize: 14, fontWeight: 600, cursor: "pointer", flex: 1, textAlign: "center",
          }}>
            <div style={{ fontSize: 20, marginBottom: 4 }}>▶</div>
            Run demo<br /><span style={{ fontSize: 11, fontWeight: 400, color: "var(--color-text-2)" }}>NovaTech fake session</span>
          </button>
          <button onClick={onStartLive} style={{
            padding: "16px 24px", borderRadius: 12, border: "none",
            background: llmConfig.apiKey ? "var(--accent)" : "var(--color-bg-3)",
            color: llmConfig.apiKey ? "#fff" : "var(--color-text-3)",
            fontSize: 14, fontWeight: 600, cursor: llmConfig.apiKey ? "pointer" : "default",
            flex: 1, textAlign: "center", transition: "all .2s",
          }}>
            <div style={{ fontSize: 20, marginBottom: 4 }}>✦</div>
            Start live session<br />
            <span style={{ fontSize: 11, fontWeight: 400, opacity: 0.8 }}>
              {llmConfig.apiKey ? `${llmConfig.model} ready` : "API key required"}
            </span>
          </button>
        </div>

        {error && (
          <div style={{ marginTop: 12, padding: "9px 14px", borderRadius: 8, background: "var(--color-bg-danger)", color: "var(--color-text-danger)", fontSize: 13, textAlign: "center" }}>{error}</div>
        )}
      </div>
    </div>
  );
}

function Field({ label, value, onChange, placeholder, mono, password }) {
  return (
    <div>
      <label style={{ fontSize: 11, fontWeight: 600, color: "var(--color-text-2)", display: "block", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.04em" }}>{label}</label>
      <input
        type={password ? "password" : "text"}
        value={value} onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          width: "100%", padding: "8px 12px", borderRadius: 8,
          border: "0.5px solid var(--color-border-2)", background: "var(--color-bg-1)",
          color: "var(--color-text-1)", fontSize: 13,
          fontFamily: mono ? "monospace" : "inherit",
          outline: "none", boxSizing: "border-box",
        }} />
    </div>
  );
}
