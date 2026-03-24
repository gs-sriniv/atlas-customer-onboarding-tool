/**
 * Call any OpenAI-compatible chat completions endpoint.
 * Works with: OpenAI, Groq, Together, Fireworks, OpenRouter, Ollama, Azure, etc.
 */
export async function chatCompletion({ baseUrl, apiKey, model, messages, systemPrompt, maxTokens = 1200 }) {
  const url = `${baseUrl.replace(/\/+$/, '')}/chat/completions`;

  const body = {
    model,
    max_tokens: maxTokens,
    messages: [
      { role: "system", content: systemPrompt },
      ...messages,
    ],
  };

  const headers = { "Content-Type": "application/json" };
  if (apiKey) headers["Authorization"] = `Bearer ${apiKey}`;

  const response = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errText = await response.text().catch(() => "");
    // Provide human-readable error messages for common status codes
    const friendlyMsg = {
      401: "Invalid API key. Please check your credentials.",
      403: "Access denied. Your API key may not have permission for this model.",
      404: "Model not found. Please verify the model name and base URL.",
      429: "Rate limit reached. Please wait a moment and try again.",
      500: "The AI provider encountered an error. Please try again.",
      503: "The AI provider is temporarily unavailable. Please try again shortly.",
    }[response.status];
    throw new Error(friendlyMsg || `API error ${response.status}: ${errText.slice(0, 200)}`);
  }

  const data = await response.json();
  return (data.choices?.[0]?.message?.content || "").trim();
}

/**
 * Attempt to extract a valid JSON object from a string that may contain
 * markdown fences, preamble text, or other LLM formatting artifacts.
 */
function repairJson(raw) {
  // Strip markdown code fences
  let cleaned = raw
    .replace(/^```(?:json)?\s*/im, "")
    .replace(/\s*```$/im, "")
    .trim();

  // Find the first { and last } to strip any preamble/postamble
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");
  if (start !== -1 && end !== -1 && end > start) {
    cleaned = cleaned.slice(start, end + 1);
  }

  return cleaned;
}

/**
 * Extract structured JSON from a conversation using the LLM.
 * Retries up to `retries` times on JSON parse failure, with exponential backoff.
 */
export async function extractData({ baseUrl, apiKey, model, messages, fields, retries = 2 }) {
  const fieldList = fields.map(f => `"${f}"`).join(", ");

  const systemPrompt = `You are a structured data extraction engine for Atlas Renewal Agent configuration.

Your job: extract specific fields from the conversation and return them as a clean JSON object.

Rules:
- Return ONLY a valid JSON object. No markdown, no explanation, no preamble.
- Include every requested field. Use null for any field not yet discussed.
- Be concise but complete — capture the actual values shared, not generic descriptions.
- For array fields, return an array of objects with descriptive keys.
- Never wrap the JSON in code fences.`;

  const extractionMsg = {
    role: "user",
    content: `Extract the following fields from this conversation and return as a JSON object: ${fieldList}

Return ONLY the JSON object. No other text.`,
  };

  let lastError;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      if (attempt > 0) {
        // Exponential backoff: 500ms, 1000ms
        await new Promise(r => setTimeout(r, 500 * attempt));
      }

      const raw = await chatCompletion({
        baseUrl,
        apiKey,
        model,
        systemPrompt,
        messages: [...messages, extractionMsg],
        maxTokens: 1500,
      });

      const cleaned = repairJson(raw);
      const parsed = JSON.parse(cleaned);

      // Ensure all requested fields are present (fill missing with null)
      const result = {};
      fields.forEach(f => { result[f] = parsed[f] !== undefined ? parsed[f] : null; });
      return result;
    } catch (err) {
      lastError = err;
    }
  }

  throw lastError;
}
