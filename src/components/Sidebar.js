import React from 'react';

export default function Sidebar({ phases, currentPhase, completedPhases, extractedData, onPhaseClick, onExport, onReset, completionPct, mode }) {
  return (
    <div className="sidebar">
      {/* Header */}
      <div className="sidebar-header">
        <div className="logo-row">
          <div className="logo-mark">A</div>
          <div>
            <div className="logo-title">Atlas</div>
            <div className="logo-sub">
              {mode === "demo" ? "Demo session" : mode === "live" ? "Live session" : "Discovery session"}
            </div>
          </div>
        </div>
        <div className="progress-row">
          <span>Progress</span>
          <span>{completionPct}%</span>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${completionPct}%` }} />
        </div>
      </div>

      {/* Phase list */}
      <div className="phase-list">
        {phases.map((p, i) => {
          const active = p.id === currentPhase;
          const done = completedPhases.includes(p.id);
          const accessible = done || active || (i > 0 && completedPhases.includes(phases[i - 1].id));

          // Count non-null extracted fields for this phase
          const phaseData = extractedData?.[p.id];
          const capturedCount = phaseData
            ? Object.values(phaseData).filter(v => v != null).length
            : 0;
          const totalFields = p.extractionKeys.length;

          return (
            <div
              key={p.id}
              className={`phase-item ${active ? "active" : ""} ${!accessible ? "disabled" : ""}`}
              onClick={() => accessible && onPhaseClick(p.id)}
              title={accessible ? p.description : "Complete previous phases to unlock"}
            >
              <div className={`phase-icon ${done ? "done" : ""}`}>
                {done ? "✓" : p.icon}
              </div>
              <div className="phase-label-group">
                <span className="phase-label">{p.label}</span>
                {totalFields > 0 && capturedCount > 0 && (
                  <span className="phase-capture-badge" title={`${capturedCount} of ${totalFields} fields captured`}>
                    {capturedCount}/{totalFields}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="sidebar-footer">
        <button onClick={onExport} className="btn-outline full-width" style={{ marginBottom: 8 }}>
          Export discovery data
        </button>
        <button onClick={onReset} className="btn-ghost full-width">
          ← New session
        </button>
      </div>

      <style>{`
        .sidebar {
          width: 260px; flex-shrink: 0;
          background: var(--color-bg-1);
          border-right: 0.5px solid var(--color-border-1);
          display: flex; flex-direction: column;
        }
        .sidebar-header { padding: 20px 18px 14px; }
        .logo-row {
          display: flex; align-items: center; gap: 10px; margin-bottom: 18px;
        }
        .logo-mark {
          width: 32px; height: 32px; border-radius: 8px;
          background: linear-gradient(135deg, var(--accent), var(--accent-light));
          display: flex; align-items: center; justify-content: center;
          color: #fff; font-size: 15px; font-weight: 700;
          box-shadow: 0 2px 8px rgba(83,74,183,0.25);
        }
        .logo-title { font-size: 15px; font-weight: 700; color: var(--color-text-1); }
        .logo-sub   { font-size: 11px; color: var(--color-text-3); font-weight: 500; }
        .progress-row {
          display: flex; justify-content: space-between;
          font-size: 11px; font-weight: 600; color: var(--color-text-3);
          margin-bottom: 5px; text-transform: uppercase; letter-spacing: 0.05em;
        }
        .progress-bar {
          height: 4px; background: var(--color-bg-3);
          border-radius: 2px; overflow: hidden;
        }
        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, var(--accent), var(--accent-light));
          border-radius: 2px; transition: width 0.5s ease;
        }

        .phase-list { flex: 1; overflow-y: auto; padding: 4px 6px 8px; }
        .phase-item {
          display: flex; align-items: center; gap: 10px;
          padding: 7px 10px; border-radius: 8px; cursor: pointer;
          border-left: 3px solid transparent;
          transition: background 0.15s;
          min-height: 38px;
        }
        .phase-item:not(.disabled):hover { background: var(--color-bg-2); }
        .phase-item.active {
          background: var(--accent-bg);
          border-left-color: var(--accent);
        }
        .phase-item.disabled { opacity: 0.35; cursor: default; }

        .phase-icon {
          width: 24px; height: 24px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 11px; font-weight: 600; flex-shrink: 0;
          background: var(--color-bg-3); color: var(--color-text-3);
          transition: background 0.2s, color 0.2s;
        }
        .phase-item.active .phase-icon { background: var(--accent-bg2); color: var(--accent); }
        .phase-icon.done { background: var(--accent); color: #fff; }

        .phase-label-group {
          flex: 1; display: flex; align-items: center;
          justify-content: space-between; gap: 6; min-width: 0;
        }
        .phase-label {
          font-size: 13px; font-weight: 400; color: var(--color-text-1);
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        .phase-item.active .phase-label { font-weight: 600; color: var(--accent); }
        .phase-capture-badge {
          font-size: 10px; font-weight: 600; color: var(--accent);
          background: var(--accent-bg); padding: 1px 5px; border-radius: 4px;
          flex-shrink: 0; letter-spacing: 0.02em;
        }

        .sidebar-footer {
          padding: 10px 12px 14px;
          border-top: 0.5px solid var(--color-border-1);
        }
        .btn-outline {
          padding: 9px 0; border-radius: 8px;
          border: 0.5px solid var(--color-border-2);
          background: var(--color-bg-1); color: var(--color-text-1);
          font-size: 12px; font-weight: 600; cursor: pointer;
          transition: background 0.15s;
        }
        .btn-outline:hover { background: var(--color-bg-2); }
        .btn-ghost {
          padding: 7px 0; border-radius: 8px;
          border: none; background: transparent;
          color: var(--color-text-3);
          font-size: 11px; font-weight: 500; cursor: pointer;
          transition: color 0.15s;
        }
        .btn-ghost:hover { color: var(--color-text-1); }
        .full-width { width: 100%; }
      `}</style>
    </div>
  );
}
