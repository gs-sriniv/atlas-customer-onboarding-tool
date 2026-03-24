/**
 * Call any OpenAI-compatible chat completions endpoint.
 * Works with: OpenAI, Groq, Together, Fireworks, OpenRouter, Ollama, Azure, etc.
 */
export async function chatCompletion({ baseUrl, apiKey, model, messages, systemPrompt, maxTokens = 1000 }) {
  const url = `${baseUrl.replace(/\/+$/, '')}/chat/completions`;

  const body = {
    model,
    max_tokens: maxTokens,
    messages: [
      { role: "system", content: systemPrompt },
      ...messages,
    ],
  };

  const headers = {
    "Content-Type": "application/json",
  };
  if (apiKey) {
    headers["Authorization"] = `Bearer ${apiKey}`;
  }

  const response = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errText = await response.text().catch(() => "");
    throw new Error(`API ${response.status}: ${errText.slice(0, 300)}`);
  }

  const data = await response.json();
  return (data.choices?.[0]?.message?.content || "").trim();
}

/**
 * Extract structured JSON from a conversation using the LLM.
 */
export async function extractData({ baseUrl, apiKey, model, messages, fields }) {
  const raw = await chatCompletion({
    baseUrl, apiKey, model,
    systemPrompt: "You are a data extraction assistant. Return ONLY valid JSON. No markdown fences. No explanation. No preamble.",
    messages: [
      ...messages,
      { role: "user", content: `Extract structured data as JSON. Fields: ${fields.join(", ")}. Return ONLY valid JSON.` },
    ],
  });

  const cleaned = raw.replace(/```json\s*/g, "").replace(/```/g, "").trim();
  return JSON.parse(cleaned);
}
