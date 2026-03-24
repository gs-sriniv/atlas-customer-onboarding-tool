import React from 'react';

export function TypingDots() {
  return (
    <div style={{ display: "flex", gap: 5, padding: "12px 0", alignItems: "center" }}>
      {[0, 1, 2].map(i => <div key={i} style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--color-text-3)", animation: `pulse3 1.2s ease-in-out ${i * 0.2}s infinite` }} />)}
    </div>
  );
}

export function Bubble({ role, content }) {
  const u = role === "user";
  return (
    <div style={{ display: "flex", justifyContent: u ? "flex-end" : "flex-start", marginBottom: 14, animation: "fadeUp .3s ease" }}>
      <div style={{
        maxWidth: "80%", padding: "11px 15px",
        borderRadius: u ? "14px 14px 4px 14px" : "14px 14px 14px 4px",
        background: u ? "var(--accent)" : "var(--color-bg-2)",
        color: u ? "#fff" : "var(--color-text-1)",
        fontSize: 14, lineHeight: 1.6, whiteSpace: "pre-wrap", wordBreak: "break-word",
      }}>{content}</div>
    </div>
  );
}

function DataValue({ value }) {
  if (Array.isArray(value)) {
    return (<div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      {value.map((item, i) => (
        <div key={i} style={{ fontSize: 12, lineHeight: 1.5, padding: "6px 10px", background: "var(--color-bg-2)", borderRadius: 6, border: "0.5px solid var(--color-border-1)" }}>
          {typeof item === "object" && item !== null ? Object.entries(item).map(([k, v]) => (
            <div key={k} style={{ padding: "1px 0" }}>
              <span style={{ color: "var(--color-text-3)", fontSize: 11 }}>{k}:</span>{" "}
              <span style={{ color: "var(--color-text-1)" }}>{String(v)}</span>
            </div>
          )) : String(item)}
        </div>
      ))}
    </div>);
  }
  if (typeof value === "object" && value !== null) {
    return (<div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      {Object.entries(value).map(([k, v]) => (
        <div key={k} style={{ fontSize: 12, padding: "5px 10px", background: "var(--color-bg-2)", borderRadius: 6, border: "0.5px solid var(--color-border-1)" }}>
          <span style={{ color: "var(--color-text-3)", fontSize: 11 }}>{k.replace(/_/g, " ")}:</span>{" "}
          <span style={{ color: "var(--color-text-1)" }}>{typeof v === "object" ? JSON.stringify(v) : String(v)}</span>
        </div>
      ))}
    </div>);
  }
  return <div style={{ fontSize: 13, color: "var(--color-text-1)", lineHeight: 1.5, padding: "6px 10px", background: "var(--color-bg-2)", borderRadius: 6, border: "0.5px solid var(--color-border-1)" }}>{String(value)}</div>;
}

export function DataPanel({ data, phase }) {
  const d = data[phase];
  if (!d || Object.keys(d).length === 0) return (
    <div style={{ padding: 20, color: "var(--color-text-3)", fontSize: 13, textAlign: "center", marginTop: 40 }}>
      Data will appear here as details are shared.
    </div>
  );
  return (
    <div style={{ padding: 14 }}>
      <div style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--color-text-3)", marginBottom: 10 }}>Captured data</div>
      {Object.entries(d).filter(([, v]) => v != null).map(([key, value]) => (
        <div key={key} style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: "var(--color-text-2)", marginBottom: 3, textTransform: "uppercase", letterSpacing: "0.04em" }}>{key.replace(/_/g, " ")}</div>
          <DataValue value={value} />
        </div>
      ))}
    </div>
  );
}

export function ExportModal({ json, onClose }) {
  const [copied, setCopied] = React.useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(json).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); });
  };
  if (!json) return null;
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{ width: "90%", maxWidth: 720, maxHeight: "80vh", background: "var(--color-bg-1)", borderRadius: 16, border: "0.5px solid var(--color-border-1)", display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <div style={{ padding: "16px 20px", borderBottom: "0.5px solid var(--color-border-1)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 15, fontWeight: 600 }}>Discovery export</span>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={handleCopy} style={{ padding: "6px 14px", borderRadius: 8, border: "none", background: "var(--accent)", color: "#fff", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
              {copied ? "✓ Copied!" : "Copy to clipboard"}
            </button>
            <button onClick={onClose} style={{ padding: "6px 14px", borderRadius: 8, border: "0.5px solid var(--color-border-2)", background: "var(--color-bg-1)", color: "var(--color-text-2)", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>Close</button>
          </div>
        </div>
        <pre style={{ flex: 1, overflowY: "auto", margin: 0, padding: 20, fontSize: 12, lineHeight: 1.5, color: "var(--color-text-1)", fontFamily: "'DM Mono', monospace", whiteSpace: "pre-wrap", wordBreak: "break-word" }}>{json}</pre>
      </div>
    </div>
  );
}
