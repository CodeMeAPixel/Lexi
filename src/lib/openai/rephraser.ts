import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";

export function makeRephraserPrompt(
  prompt: string,
  options?: { tone?: string; length?: string; extraInstructions?: string },
) {
  let extras = "";
  if (options?.tone) extras += ` Use a ${options.tone} tone.`;
  if (options?.length) extras += ` Prefer ${options.length} length.`;
  if (options?.extraInstructions) extras += ` ${options.extraInstructions}`;
  return `${prompt}${extras}`;
}

export async function streamRephrase(opts: {
  prompt: string;
  temperature?: number;
  maxTokens?: number;
}) {
  const { prompt, temperature = 0.7, maxTokens = 200 } = opts;
  const { textStream } = await streamText({
    model: openai("gpt-4.1-nano"),
    temperature,
    maxTokens,
    messages: [{ role: "user", content: prompt }],
  });
  return { textStream };
}
