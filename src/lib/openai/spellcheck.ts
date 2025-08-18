import { openai } from "@ai-sdk/openai";

export async function makeSpellcheckPrompt(text: string) {
  return `Please correct the spelling, grammar, and minor style issues in the following text. Return ONLY the corrected text without commentary:\n\n${text}`;
}

export async function callSpellcheck(text: string) {
  const prompt = await makeSpellcheckPrompt(text);
  const resp = await openai.call("GPT-4.1 nano", {
    messages: [{ role: "user", content: prompt }],
    temperature: 0.0,
    max_tokens: 800,
  } as any);

  // openai.call may return different shapes; prefer text or content
  if (!resp) return null;
  const r: any = resp;

  if (typeof r === "string") return r.trim();

  // Newer wrapper shapes
  if (r.output) {
    if (typeof r.output === "string") return r.output.trim();
    if (Array.isArray(r.output) && r.output.length) {
      const first = r.output[0];
      if (typeof first === "string") return first.trim();
      if (first.content) {
        if (typeof first.content === "string") return first.content.trim();
        if (Array.isArray(first.content) && first.content[0]) {
          const c0 = first.content[0];
          if (typeof c0 === "string" && c0.trim()) return c0.trim();
          if (c0.text) return String(c0.text).trim();
        }
      }
      if (first.data && first.data.text) return String(first.data.text).trim();
    }
  }

  // Classic OpenAI v1 shape
  if (r.choices && r.choices[0]) {
    const ch = r.choices[0];
    if (ch.message && ch.message.content)
      return String(ch.message.content).trim();
    if (ch.text) return String(ch.text).trim();
  }

  // Fallbacks
  if (r.output_text) return String(r.output_text).trim();
  if (r.text) return String(r.text).trim();
  if (r.result && r.result.output_text)
    return String(r.result.output_text).trim();

  try {
    return JSON.stringify(r);
  } catch (e) {
    return String(r);
  }
}
