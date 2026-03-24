import React from 'react';
import { LLM_PRESETS } from '../data/phases';
import { sessionAge } from '../utils/storage';

export default function LandingPage({ llmConfig, setLlmConfig, onStartDemo, onStartLive, savedSession, onResumeSession, error }) {
  const phasesCompleted = savedSession ? (savedSession.completed || []).length : 0;
  const totalPhases = 11;
  const pct = savedSession ? Math.round((phasesCompleted / (totalPhases - 1)) * 100) : 0;

  return (
    <div style={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", overflowY: "auto", padding: "40px 20px" }}>
      <div style={{ maxWidth: 540, width: "100%" }}>
        {/* Logo + headline */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{
            width: 56, height: 56, borderRadius: 16,
            background: "linear-gradient(135deg, var(--accent), var(--accent-light))",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "#fff", fontSize: 26, fontWeight: 700,
            margin: "0 auto 20px",
            boxShadow: "0 4px 20px rgba(83,74,183,0.25)",
          }}>A</div>
          <h1 style={{ fontSize: 28, fontWeight: 700, margin: "0 0 8px", fontFamily: "'Fraunces', serif" }}>
            Atlas discovery
          </h1>
          <p style={{ fontSize: 15, color: "var(--color-text-2)", margin: 0, lineHeight: 1.6 }}>
            Configure your renewal agent through a guided conversation.
          </p>
        </div>

        {/* Resume session banner */}
        {savedSession && (
          <div style={{
            background: "var(--color-bg-info)",
            border: "0.5px solid rgba(24,95,165,0.25)",
            borderRadius: 12, padding: "14px 18px", marginBottom: 20,
            display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12,
          }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "var(--color-text-info)", marginBottom: 3 }}>
                Session in progress — {pct}% complete
              </div>
              <div style={{ fontSize: 12, color: "var(--color-text-2)", lineHeight: 1.5 }}>
                {phasesCompleted} of {totalPhases - 1} phases completed
                {savedSession.savedAt && ` · saved ${sessionAge(savedSession.savedAt)}`}
              </div>
              {/* Mini progress bar */}
              <div style={{ height: 3, background: "rgba(24,95,165,0.15)", borderRadius: 2, marginTop: 8, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${pct}%`, background: "var(--color-text-info)", borderRadius: 2, transition: "width 0.5s" }} />
              </div>
            </div>
            <button
              onClick={() => onResumeSession(savedSession)}
              style={{
                padding: "9px 16px", borderRadius: 8, border: "none",
                background: "var(--color-text-info)", color: "#fff",
                fontSize: 13, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0,
              }}
            >
              Resume →
            </button>
          </div>
        )}

        {/* LLM config card */}
        <div style={{
          background: "var(--color-bg-1)", borderRadius: 12,
          border: "0.5px solid var(--color-border-1)", padding: 20, marginBottom: 20,
        }}>
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 14 }}>
            LLM configuration{" "}
            <span style={{ fontSize: 11, fontWeight: 400, color: "var(--color-text-3)" }}>
              — OpenAI-compatible API
            </span>
          </div>

          {/* Provider presets */}
          <div style={{ display: "flex", gap: 6, marginBottom: 14, flexWrap: "wrap" }}>
            {LLM_PRESETS.map(preset => {
              const active = llmConfig.baseUrl === preset.url;
              return (
                <button
                  key={preset.label}
                  onClick={() => setLlmConfig(prev => ({ ...prev, baseUrl: preset.url, model: preset.model }))}
                  style={{
                    padding: "5px 10px", borderRadius: 6,
                    border: "0.5px solid var(--color-border-1)",
                    background: active ? "var(--accent-bg)" : "var(--color-bg-2)",
                    color: active ? "var(--accent)" : "var(--color-text-2)",
                    fontSize: 11, fontWeight: 500, cursor: "pointer",
                    transition: "background 0.15s, color 0.15s",
                  }}
                >
                  {preset.label}
                </button>
              );
            })}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <Field
              label="API base URL"
              value={llmConfig.baseUrl}
              onChange={v => setLlmConfig(p => ({ ...p, baseUrl: v }))}
              placeholder="https://api.openai.com/v1"
              mono
            />
            <Field
              label="API key"
              value={llmConfig.apiKey}
              onChange={v => setLlmConfig(p => ({ ...p, apiKey: v }))}
              placeholder="sk-… (never stored or logged)"
              mono
              password
            />
            <Field
              label="Model"
              value={llmConfig.model}
              onChange={v => setLlmConfig(p => ({ ...p, model: v }))}
              placeholder="gpt-4o"
              mono
            />
          </div>
        </div>

        {/* Action buttons */}
        <div style={{ display: "flex", gap: 14 }}>
          <button
            onClick={onStartDemo}
            style={{
              padding: "16px 24px", borderRadius: 12,
              border: "0.5px solid var(--color-border-2)",
              background: "var(--color-bg-1)", color: "var(--color-text-1)",
              fontSize: 14, fontWeight: 600, cursor: "pointer", flex: 1, textAlign: "center",
              transition: "background 0.15s",
            }}
            onMouseEnter={e => e.currentTarget.style.background = "var(--color-bg-2)"}
            onMouseLeave={e => e.currentTarget.style.background = "var(--color-bg-1)"}
          >
            <div style={{ fontSize: 20, marginBottom: 4 }}>▶</div>
            Run demo
            <br />
            <span style={{ fontSize: 11, fontWeight: 400, color: "var(--color-text-2)" }}>
              NovaTech · workforce SaaS
            </span>
          </button>

          <button
            onClick={onStartLive}
            disabled={!llmConfig.apiKey}
            style={{
              padding: "16px 24px", borderRadius: 12, border: "none",
              background: llmConfig.apiKey ? "var(--accent)" : "var(--color-bg-3)",
              color: llmConfig.apiKey ? "#fff" : "var(--color-text-3)",
              fontSize: 14, fontWeight: 600,
              cursor: llmConfig.apiKey ? "pointer" : "default",
              flex: 1, textAlign: "center",
              transition: "filter 0.15s",
            }}
            onMouseEnter={e => { if (llmConfig.apiKey) e.currentTarget.style.filter = "brightness(0.92)"; }}
            onMouseLeave={e => { e.currentTarget.style.filter = "none"; }}
          >
            <div style={{ fontSize: 20, marginBottom: 4 }}>✦</div>
            Start live session
            <br />
            <span style={{ fontSize: 11, fontWeight: 400, opacity: 0.85 }}>
              {llmConfig.apiKey ? `${llmConfig.model} · ready` : "API key required"}
            </span>
          </button>
        </div>

        {/* Error message */}
        {error && (
          <div style={{
            marginTop: 12, padding: "9px 14px", borderRadius: 8,
            background: "var(--color-bg-danger)", color: "var(--color-text-danger)",
            fontSize: 13, textAlign: "center",
          }}>
            {error}
          </div>
        )}

        {/* Footer note */}
        <div style={{ marginTop: 20, fontSize: 11, color: "var(--color-text-3)", textAlign: "center", lineHeight: 1.6 }}>
          API keys are never stored or transmitted to Atlas — they're used only to connect to your chosen LLM provider.
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, placeholder, mono, password }) {
  const [focused, setFocused] = React.useState(false);
  return (
    <div>
      <label style={{
        fontSize: 11, fontWeight: 600, color: "var(--color-text-2)",
        display: "block", marginBottom: 4,
        textTransform: "uppercase", letterSpacing: "0.04em",
      }}>
        {label}
      </label>
      <input
        type={password ? "password" : "text"}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        autoComplete={password ? "current-password" : "off"}
        style={{
          width: "100%", padding: "8px 12px", borderRadius: 8,
          border: `0.5px solid ${focused ? "var(--accent)" : "var(--color-border-2)"}`,
          background: "var(--color-bg-1)",
          color: "var(--color-text-1)", fontSize: 13,
          fontFamily: mono ? "'DM Mono', 'Fira Mono', monospace" : "inherit",
          outline: "none", boxSizing: "border-box",
          transition: "border-color 0.15s",
        }}
      />
    </div>
  );
}
