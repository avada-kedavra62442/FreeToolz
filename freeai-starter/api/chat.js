const DEFAULT_MODEL = "google/gemma-4-31b-it:free";
const MAX_MESSAGES = 24;
const MAX_CHARS = 12000;

export default async function handler(req, res) {
  if (req.method === "OPTIONS") {
    res.setHeader("Allow", "POST, OPTIONS");
    return res.status(204).end();
  }
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST, OPTIONS");
    return res.status(405).json({ error: "Use POST to send a message." });
  }

  const origin = req.headers.origin;
  const allowed = (process.env.FREEAI_ALLOWED_ORIGINS || "").split(",").map((s) => s.trim()).filter(Boolean);
  if (origin && allowed.length && !allowed.includes(origin)) {
    return res.status(403).json({ error: "This origin is not allowed to use FreeAI." });
  }
  if (origin && (!allowed.length || allowed.includes(origin))) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Vary", "Origin");
  }
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("X-Content-Type-Options", "nosniff");

  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    return res.status(503).json({ error: "FreeAI's model connection is not configured yet. Add OPENROUTER_API_KEY in Vercel project settings." });
  }

  let body = req.body;
  if (typeof body === "string") {
    try { body = JSON.parse(body); } catch { return res.status(400).json({ error: "Invalid request body." }); }
  }
  const input = Array.isArray(body?.messages) ? body.messages : [];
  if (!input.length || input.length > MAX_MESSAGES) {
    return res.status(400).json({ error: "Send between 1 and 24 recent messages." });
  }

  const messages = [];
  let totalChars = 0;
  for (const message of input) {
    if (!message || !["user", "assistant"].includes(message.role) || typeof message.content !== "string") continue;
    const content = message.content.trim();
    if (!content) continue;
    totalChars += content.length;
    if (content.length > MAX_CHARS || totalChars > 30000) {
      return res.status(413).json({ error: "That conversation is too long. Start a new chat or shorten the message." });
    }
    messages.push({ role: message.role, content });
  }
  if (!messages.length || messages[messages.length - 1].role !== "user") {
    return res.status(400).json({ error: "The last message must be from you." });
  }

  try {
    const upstream = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": origin || "https://freeai.vercel.app",
        "X-Title": "FreeAI"
      },
      body: JSON.stringify({
        model: process.env.FREEAI_MODEL || DEFAULT_MODEL,
        messages: [
          { role: "system", content: "You are FreeAI, a helpful, honest, thoughtful assistant. Be clear and useful. Do not claim to be another model or to have tools you do not have. If uncertain, say so." },
          ...messages
        ],
        stream: true,
        temperature: 0.7,
        max_tokens: 1800
      })
    });

    if (!upstream.ok) {
      const detail = await upstream.text().catch(() => "");
      console.error("FreeAI upstream error:", upstream.status, detail.slice(0, 400));
      const status = upstream.status === 429 ? 429 : upstream.status >= 500 ? 502 : 502;
      return res.status(status).json({
        error: upstream.status === 429
          ? "The free model is busy or its rate limit has been reached. Please wait and try again."
          : "The free model could not answer right now. Try again in a little while."
      });
    }
    if (!upstream.body) return res.status(502).json({ error: "The model did not return a response stream." });

    res.status(200);
    res.setHeader("Content-Type", "text/event-stream; charset=utf-8");
    res.setHeader("Connection", "keep-alive");
    res.setHeader("X-Accel-Buffering", "no");
    const reader = upstream.body.getReader();
    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        if (!res.write(Buffer.from(value))) {
          await new Promise((resolve) => res.once("drain", resolve));
        }
      }
    } finally {
      reader.releaseLock();
      res.end();
    }
  } catch (error) {
    console.error("FreeAI request failed:", error);
    if (!res.headersSent) return res.status(502).json({ error: "Could not reach the free AI provider. Please try again." });
    res.end();
  }
}
