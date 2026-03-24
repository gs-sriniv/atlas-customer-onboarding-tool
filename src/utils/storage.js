const SESSION_KEY = "atlas_discovery_session";
const CONFIG_KEY = "atlas_llm_config";

/**
 * Save the current session state to localStorage.
 * Called automatically on key state transitions (phase advance, extraction complete, message sent).
 */
export function saveSession({ mode, phase, completed, convos, extracted, llmConfig }) {
  try {
    const payload = {
      mode,
      phase,
      completed,
      convos,
      extracted,
      savedAt: new Date().toISOString(),
      version: 1,
    };
    localStorage.setItem(SESSION_KEY, JSON.stringify(payload));

    // Save LLM config separately (persists across sessions)
    if (llmConfig) {
      // Never persist the API key — always re-enter for security
      const { apiKey: _omit, ...safeConfig } = llmConfig;
      localStorage.setItem(CONFIG_KEY, JSON.stringify(safeConfig));
    }
  } catch (_e) {
    // localStorage may be full or unavailable — fail silently
  }
}

/**
 * Load a previously saved session from localStorage.
 * Returns null if none exists or if it's corrupt/incompatible.
 */
export function loadSession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    // Basic schema check
    if (!parsed.version || !parsed.mode || !parsed.phase) return null;
    return parsed;
  } catch (_e) {
    return null;
  }
}

/**
 * Load saved LLM configuration (URL + model, not the API key).
 */
export function loadLlmConfig() {
  try {
    const raw = localStorage.getItem(CONFIG_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (_e) {
    return null;
  }
}

/**
 * Clear the saved session (called on explicit reset).
 * Preserves the LLM config so users don't have to re-select their provider.
 */
export function clearSession() {
  try {
    localStorage.removeItem(SESSION_KEY);
  } catch (_e) {
    // fail silently
  }
}

/**
 * Return a human-readable "saved X minutes ago" label from an ISO timestamp.
 */
export function sessionAge(isoTimestamp) {
  if (!isoTimestamp) return null;
  const diff = Date.now() - new Date(isoTimestamp).getTime();
  const mins = Math.floor(diff / 60000);
  const hrs = Math.floor(mins / 60);
  const days = Math.floor(hrs / 24);
  if (days > 0) return `${days}d ago`;
  if (hrs > 0) return `${hrs}h ago`;
  if (mins > 0) return `${mins}m ago`;
  return "just now";
}
