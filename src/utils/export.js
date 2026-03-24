import PHASES from '../data/phases';

/**
 * Build the full discovery export payload — structured data + conversation transcripts.
 */
export function buildExportPayload(extracted, convos) {
  const completedPhaseIds = PHASES
    .filter(p => {
      const hasData = extracted[p.id] && Object.keys(extracted[p.id]).length > 0;
      const hasConvo = convos[p.id] && convos[p.id].length > 0;
      return hasData || hasConvo;
    })
    .map(p => p.id);

  const summary = {
    phases_completed: completedPhaseIds.length,
    total_phases: PHASES.length,
    completion_pct: Math.round((completedPhaseIds.length / (PHASES.length - 1)) * 100),
  };

  // Extract top-level fields for a quick-reference summary
  const quickRef = {};
  if (extracted.company) {
    const c = extracted.company;
    if (c.company_description) quickRef.company = c.company_description;
    if (c.total_revenue)       quickRef.arr = c.total_revenue;
    if (c.grr_nrr)             quickRef.retention = c.grr_nrr;
  }
  if (extracted.segments?.segments) {
    quickRef.segments = extracted.segments.segments;
  }
  if (extracted.value?.success_criteria) {
    quickRef.success_criteria = extracted.value.success_criteria;
  }

  const out = {
    exported_at: new Date().toISOString(),
    tool: "Atlas Discovery Tool",
    version: "2.0",
    summary,
    quick_reference: Object.keys(quickRef).length > 0 ? quickRef : undefined,
    phases: {},
  };

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

  // Remove undefined quick_reference
  if (!out.quick_reference) delete out.quick_reference;

  return out;
}

/**
 * Trigger a browser file download for the given JSON string.
 */
export function downloadJson(json, filename) {
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename || `atlas-discovery-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
