import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";

export function makeTldrPrompt(messages: { role: string; content: string }[]) {
  // Flatten messages into a single prompt that asks for a concise summary
  const joined = messages
    .map((m) => `${m.role.toUpperCase()}: ${m.content}`)
    .join("\n\n");
  return `Summarize the conversation/messages below in a short, clear TL;DR (one paragraph). Keep it concise and capture the main points and any action items. Return ONLY the summary text without extra commentary.\n\n${joined}`;
}

export async function streamTldr(opts: {
  messages: { role: string; content: string }[];
  temperature?: number;
  maxTokens?: number;
}) {
  const { messages, temperature = 0.2, maxTokens = 200 } = opts;
  const prompt = makeTldrPrompt(messages);
  const { textStream } = await streamText({
    model: openai("gpt-4.1-nano"),
    temperature,
    maxTokens,
    messages: [{ role: "user", content: prompt }],
  });
  return { textStream };
}
