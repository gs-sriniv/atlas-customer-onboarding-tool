import React from 'react';

export default function Sidebar({ phases, currentPhase, completedPhases, onPhaseClick, onExport, completionPct }) {
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <div className="logo-row">
          <div className="logo-mark">A</div>
          <div><div className="logo-title">Atlas</div><div className="logo-sub">Discovery session</div></div>
        </div>
        <div className="progress-row">
          <span>Progress</span><span>{completionPct}%</span>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${completionPct}%` }} />
        </div>
      </div>

      <div className="phase-list">
        {phases.map((p, i) => {
          const active = p.id === currentPhase;
          const done = completedPhases.includes(p.id);
          const ok = done || active || (i > 0 && completedPhases.includes(phases[i - 1].id));
          return (
            <div key={p.id}
              className={`phase-item ${active ? 'active' : ''} ${!ok ? 'disabled' : ''}`}
              onClick={() => ok && onPhaseClick(p.id)}>
              <div className={`phase-icon ${done ? 'done' : ''}`}>{done ? "✓" : p.icon}</div>
              <span className="phase-label">{p.label}</span>
            </div>
          );
        })}
      </div>

      <div className="sidebar-footer">
        <button onClick={onExport} className="btn-outline full-width">Export discovery data</button>
      </div>

      <style>{`
        .sidebar { width: 256px; flex-shrink: 0; background: var(--color-bg-1); border-right: 0.5px solid var(--color-border-1); display: flex; flex-direction: column; }
        .sidebar-header { padding: 20px 18px 14px; }
        .logo-row { display: flex; align-items: center; gap: 10px; margin-bottom: 18px; }
        .logo-mark { width: 32px; height: 32px; border-radius: 8px; background: linear-gradient(135deg, var(--accent), var(--accent-light)); display: flex; align-items: center; justify-content: center; color: #fff; font-size: 15px; font-weight: 700; }
        .logo-title { font-size: 15px; font-weight: 700; color: var(--color-text-1); }
        .logo-sub { font-size: 11px; color: var(--color-text-3); font-weight: 500; }
        .progress-row { display: flex; justify-content: space-between; font-size: 11px; font-weight: 600; color: var(--color-text-3); margin-bottom: 5px; text-transform: uppercase; letter-spacing: 0.05em; }
        .progress-bar { height: 4px; background: var(--color-bg-3); border-radius: 2px; overflow: hidden; }
        .progress-fill { height: 100%; background: linear-gradient(90deg, var(--accent), var(--accent-light)); border-radius: 2px; transition: width 0.5s; }
        .phase-list { flex: 1; overflow-y: auto; padding: 0 6px; }
        .phase-item { display: flex; align-items: center; gap: 10px; padding: 8px 12px; border-radius: 8px; cursor: pointer; border-left: 3px solid transparent; transition: all 0.2s; }
        .phase-item.active { background: var(--accent-bg); border-left-color: var(--accent); }
        .phase-item.disabled { opacity: 0.35; cursor: default; }
        .phase-icon { width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 600; flex-shrink: 0; background: var(--color-bg-3); color: var(--color-text-3); transition: all 0.3s; }
        .phase-item.active .phase-icon { background: var(--accent-bg2); color: var(--accent); }
        .phase-icon.done { background: var(--accent); color: #fff; }
        .phase-label { font-size: 13px; font-weight: 400; color: var(--color-text-1); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .phase-item.active .phase-label { font-weight: 600; color: var(--accent); }
        .sidebar-footer { padding: 10px 14px; border-top: 0.5px solid var(--color-border-1); }
        .btn-outline { padding: 9px 0; border-radius: 8px; border: 0.5px solid var(--color-border-2); background: var(--color-bg-1); color: var(--color-text-1); font-size: 12px; font-weight: 600; cursor: pointer; }
        .btn-outline:hover { background: var(--color-bg-2); }
        .full-width { width: 100%; }
      `}</style>
    </div>
  );
}
