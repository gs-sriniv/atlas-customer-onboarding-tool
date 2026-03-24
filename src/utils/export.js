import PHASES from '../data/phases';

export function buildExportPayload(extracted, convos) {
  const out = { exported_at: new Date().toISOString(), tool: "Atlas Discovery Tool", phases: {} };
  PHASES.forEach(p => {
    const hasData = extracted[p.id] && Object.keys(extracted[p.id]).length > 0;
    const hasConvo = convos[p.id] && convos[p.id].length > 0;
    if (hasData || hasConvo) {
      out.phases[p.id] = {
        label: p.label,
        data: extracted[p.id] || {},
        conversation: (convos[p.id] || []).map(m =>
          `${m.role === "user" ? "Customer" : "Atlas"}: ${m.content}`
        ),
      };
    }
  });
  return out;
}
