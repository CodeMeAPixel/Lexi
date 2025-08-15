import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";

export type ChatGPTAgent = "user" | "system" | "assistant";

export interface ChatGPTMessage {
  role: ChatGPTAgent;
  content: string;
}

export interface OpenAIStreamPayload {
  model: string;
  messages: ChatGPTMessage[];
  temperature: number;
  top_p: number;
  frequency_penalty: number;
  presence_penalty: number;
  max_tokens: number;
  stream: boolean;
  n: number;
}

export async function OpenAIStream(payload: OpenAIStreamPayload) {
  const { textStream } = await streamText({
    model: openai(payload.model),
    temperature: payload.temperature,
    maxTokens: payload.max_tokens,
    messages: payload.messages.map((m) => ({
      role: m.role,
      content: m.content,
    })),
  });

  return textStream;
}