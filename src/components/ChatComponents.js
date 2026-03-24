import React from 'react';

// ── Typing indicator ──────────────────────────────────────────────────────────

export function TypingDots() {
  return (
    <div style={{ display: "flex", gap: 5, padding: "12px 0", alignItems: "center" }}>
      {[0, 1, 2].map(i => (
        <div
          key={i}
          style={{
            width: 7, height: 7, borderRadius: "50%",
            background: "var(--color-text-3)",
            animation: `pulse3 1.2s ease-in-out ${i * 0.2}s infinite`,
          }}
        />
      ))}
    </div>
  );
}

// ── Lightweight markdown renderer ─────────────────────────────────────────────
// Handles: **bold**, *italic*, bullet lists (- / * / •), numbered lists, blank lines.
// Safe: no dangerouslySetInnerHTML.

function parseInline(text) {
  // Split on **bold** and *italic* patterns
  const parts = [];
  const regex = /(\*\*(.+?)\*\*|\*(.+?)\*)/g;
  let last = 0;
  let match;
  while ((match = regex.exec(text)) !== null) {
    if (match.index > last) parts.push({ t: "text", v: text.slice(last, match.index) });
    if (match[0].startsWith("**")) {
      parts.push({ t: "bold", v: match[2] });
    } else {
      parts.push({ t: "italic", v: match[3] });
    }
    last = match.index + match[0].length;
  }
  if (last < text.length) parts.push({ t: "text", v: text.slice(last) });
  return parts.map((p, i) => {
    if (p.t === "bold") return <strong key={i}>{p.v}</strong>;
    if (p.t === "italic") return <em key={i}>{p.v}</em>;
    return p.v;
  });
}

function MarkdownContent({ text, isUser }) {
  const lines = text.split("\n");
  const elements = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Unordered list item
    if (/^[-*•]\s+/.test(line)) {
      const items = [];
      while (i < lines.length && /^[-*•]\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^[-*•]\s+/, ""));
        i++;
      }
      elements.push(
        <ul key={`ul-${i}`} style={{ paddingLeft: 18, margin: "4px 0", listStyleType: "disc" }}>
          {items.map((item, j) => (
            <li key={j} style={{ marginBottom: 2 }}>{parseInline(item)}</li>
          ))}
        </ul>
      );
      continue;
    }

    // Numbered list item
    if (/^\d+\.\s+/.test(line)) {
      const items = [];
      while (i < lines.length && /^\d+\.\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^\d+\.\s+/, ""));
        i++;
      }
      elements.push(
        <ol key={`ol-${i}`} style={{ paddingLeft: 20, margin: "4px 0" }}>
          {items.map((item, j) => (
            <li key={j} style={{ marginBottom: 2 }}>{parseInline(item)}</li>
          ))}
        </ol>
      );
      continue;
    }

    // Blank line — small gap
    if (line.trim() === "") {
      elements.push(<div key={`gap-${i}`} style={{ height: 6 }} />);
      i++;
      continue;
    }

    // Regular paragraph line
    elements.push(
      <div key={`line-${i}`} style={{ lineHeight: 1.6 }}>
        {parseInline(line)}
      </div>
    );
    i++;
  }

  return (
    <div style={{ fontSize: 14, color: isUser ? "#fff" : "var(--color-text-1)" }}>
      {elements}
    </div>
  );
}

// ── Chat bubble ───────────────────────────────────────────────────────────────

export function Bubble({ role, content }) {
  const isUser = role === "user";
  return (
    <div
      style={{
        display: "flex",
        justifyContent: isUser ? "flex-end" : "flex-start",
        marginBottom: 14,
        animation: "fadeUp .25s ease",
      }}
    >
      <div
        style={{
          maxWidth: "82%",
          padding: "11px 15px",
          borderRadius: isUser ? "14px 14px 4px 14px" : "14px 14px 14px 4px",
          background: isUser ? "var(--accent)" : "var(--color-bg-2)",
          wordBreak: "break-word",
        }}
      >
        <MarkdownContent text={content} isUser={isUser} />
      </div>
    </div>
  );
}

// ── Data panel — shows all phases, tabbed ─────────────────────────────────────

function DataValue({ value }) {
  if (value === null || value === undefined) {
    return <span style={{ fontSize: 12, color: "var(--color-text-3)", fontStyle: "italic" }}>not captured yet</span>;
  }
  if (Array.isArray(value)) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {value.map((item, i) => (
          <div
            key={i}
            style={{
              fontSize: 12, lineHeight: 1.5, padding: "6px 10px",
              background: "var(--color-bg-1)", borderRadius: 6,
              border: "0.5px solid var(--color-border-1)",
            }}
          >
            {typeof item === "object" && item !== null
              ? Object.entries(item).map(([k, v]) => (
                <div key={k} style={{ padding: "1px 0" }}>
                  <span style={{ color: "var(--color-text-3)", fontSize: 11 }}>{k.replace(/_/g, " ")}:</span>{" "}
                  <span style={{ color: "var(--color-text-1)" }}>
                    {typeof v === "object" ? JSON.stringify(v) : String(v)}
                  </span>
                </div>
              ))
              : String(item)}
          </div>
        ))}
      </div>
    );
  }
  if (typeof value === "object") {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        {Object.entries(value).map(([k, v]) => (
          <div
            key={k}
            style={{
              fontSize: 12, padding: "5px 10px",
              background: "var(--color-bg-1)", borderRadius: 6,
              border: "0.5px solid var(--color-border-1)",
            }}
          >
            <span style={{ color: "var(--color-text-3)", fontSize: 11 }}>{k.replace(/_/g, " ")}:</span>{" "}
            <span style={{ color: "var(--color-text-1)" }}>
              {typeof v === "object" ? JSON.stringify(v) : String(v)}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return (
    <div
      style={{
        fontSize: 13, color: "var(--color-text-1)", lineHeight: 1.5,
        padding: "6px 10px", background: "var(--color-bg-1)", borderRadius: 6,
        border: "0.5px solid var(--color-border-1)",
      }}
    >
      {String(value)}
    </div>
  );
}

export function DataPanel({ data, phase, phases }) {
  const [activeTab, setActiveTab] = React.useState(phase);

  // Sync tab to active phase when it changes
  React.useEffect(() => { setActiveTab(phase); }, [phase]);

  // Only show phases that have data or are the current phase
  const visiblePhases = phases
    ? phases.filter(p => p.extractionKeys.length > 0 && (data[p.id] || p.id === phase))
    : [];

  const currentData = data[activeTab];
  const hasData = currentData && Object.keys(currentData).filter(k => currentData[k] != null).length > 0;

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Phase tabs */}
      {visiblePhases.length > 1 && (
        <div
          style={{
            display: "flex", flexWrap: "wrap", gap: 4, padding: "10px 10px 0",
            borderBottom: "0.5px solid var(--color-border-1)",
          }}
        >
          {visiblePhases.map(p => {
            const hasPhaseData = data[p.id] && Object.values(data[p.id]).some(v => v != null);
            return (
              <button
                key={p.id}
                onClick={() => setActiveTab(p.id)}
                style={{
                  padding: "4px 8px", borderRadius: 6, fontSize: 10, fontWeight: 600,
                  border: "0.5px solid var(--color-border-1)",
                  background: activeTab === p.id ? "var(--accent-bg)" : "transparent",
                  color: activeTab === p.id ? "var(--accent)" : "var(--color-text-3)",
                  cursor: "pointer", whiteSpace: "nowrap",
                  display: "flex", alignItems: "center", gap: 4,
                }}
              >
                {p.icon} {p.label.split(" ")[0]}
                {hasPhaseData && (
                  <span style={{
                    width: 6, height: 6, borderRadius: "50%",
                    background: "var(--accent)", display: "inline-block", flexShrink: 0,
                  }} />
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* Data content */}
      <div style={{ flex: 1, overflowY: "auto", padding: 14 }}>
        <div style={{
          fontSize: 11, fontWeight: 600, textTransform: "uppercase",
          letterSpacing: "0.05em", color: "var(--color-text-3)", marginBottom: 10,
        }}>
          Captured data
        </div>

        {!hasData ? (
          <div style={{
            color: "var(--color-text-3)", fontSize: 12,
            textAlign: "center", marginTop: 32, lineHeight: 1.6,
          }}>
            Data will appear here as details are shared in this phase.
          </div>
        ) : (
          Object.entries(currentData)
            .filter(([, v]) => v != null)
            .map(([key, value]) => (
              <div key={key} style={{ marginBottom: 14 }}>
                <div style={{
                  fontSize: 11, fontWeight: 600, color: "var(--color-text-2)",
                  marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.04em",
                }}>
                  {key.replace(/_/g, " ")}
                </div>
                <DataValue value={value} />
              </div>
            ))
        )}
      </div>
    </div>
  );
}

// ── Export modal ──────────────────────────────────────────────────────────────

export function ExportModal({ json, onClose }) {
  const [copied, setCopied] = React.useState(false);

  if (!json) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(json).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleDownload = () => {
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `atlas-discovery-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div
      style={{
        position: "fixed", inset: 0,
        background: "rgba(0,0,0,0.5)",
        display: "flex", alignItems: "center", justifyContent: "center",
        zIndex: 100, backdropFilter: "blur(2px)",
      }}
      onClick={onClose}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: "90%", maxWidth: 760, maxHeight: "82vh",
          background: "var(--color-bg-1)", borderRadius: 16,
          border: "0.5px solid var(--color-border-1)",
          display: "flex", flexDirection: "column", overflow: "hidden",
          boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "16px 20px",
            borderBottom: "0.5px solid var(--color-border-1)",
            display: "flex", justifyContent: "space-between", alignItems: "center",
          }}
        >
          <div>
            <div style={{ fontSize: 15, fontWeight: 600 }}>Discovery export</div>
            <div style={{ fontSize: 11, color: "var(--color-text-3)", marginTop: 2 }}>
              Complete configuration spec — ready for Atlas implementation
            </div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button
              onClick={handleDownload}
              style={{
                padding: "7px 14px", borderRadius: 8,
                border: "0.5px solid var(--color-border-2)",
                background: "var(--color-bg-2)", color: "var(--color-text-1)",
                fontSize: 12, fontWeight: 600, cursor: "pointer",
              }}
            >
              ↓ Download .json
            </button>
            <button
              onClick={handleCopy}
              style={{
                padding: "7px 14px", borderRadius: 8, border: "none",
                background: "var(--accent)", color: "#fff",
                fontSize: 12, fontWeight: 600, cursor: "pointer",
                minWidth: 120,
              }}
            >
              {copied ? "✓ Copied!" : "Copy to clipboard"}
            </button>
            <button
              onClick={onClose}
              style={{
                padding: "7px 14px", borderRadius: 8,
                border: "0.5px solid var(--color-border-2)",
                background: "var(--color-bg-1)", color: "var(--color-text-2)",
                fontSize: 12, fontWeight: 600, cursor: "pointer",
              }}
            >
              Close
            </button>
          </div>
        </div>

        {/* JSON body */}
        <pre
          style={{
            flex: 1, overflowY: "auto", margin: 0, padding: 20,
            fontSize: 12, lineHeight: 1.6,
            color: "var(--color-text-1)",
            fontFamily: "'DM Mono', 'Fira Mono', 'Courier New', monospace",
            whiteSpace: "pre-wrap", wordBreak: "break-word",
            background: "var(--color-bg-2)",
          }}
        >
          {json}
        </pre>
      </div>
    </div>
  );
}

// ── Toast notification ────────────────────────────────────────────────────────

export function Toast({ message, type = "success", onDismiss }) {
  React.useEffect(() => {
    if (!message) return;
    const t = setTimeout(onDismiss, 3000);
    return () => clearTimeout(t);
  }, [message, onDismiss]);

  if (!message) return null;

  const colors = {
    success: { bg: "var(--color-bg-info)", text: "var(--color-text-info)", border: "rgba(24,95,165,0.2)" },
    warning: { bg: "var(--color-bg-warning)", text: "var(--color-text-warning)", border: "rgba(133,79,11,0.2)" },
    error:   { bg: "var(--color-bg-danger)",  text: "var(--color-text-danger)",  border: "rgba(163,45,45,0.2)" },
  };
  const c = colors[type] || colors.success;

  return (
    <div
      style={{
        position: "fixed", bottom: 24, right: 24, zIndex: 200,
        padding: "10px 16px", borderRadius: 10,
        background: c.bg, color: c.text,
        border: `0.5px solid ${c.border}`,
        fontSize: 13, fontWeight: 500,
        boxShadow: "0 4px 20px rgba(0,0,0,0.12)",
        animation: "fadeUp .25s ease",
        maxWidth: 320,
      }}
    >
      {message}
    </div>
  );
}
