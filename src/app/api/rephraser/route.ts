import { z } from "zod";
import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";

export const runtime = "edge";

const RephraseSchema = z.object({
  prompt: z.string().min(1, "prompt is required"),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = RephraseSchema.safeParse(body);

    if (!parsed.success) {
      const first = parsed.error.errors[0];
      return new Response(JSON.stringify({ error: first.message }), { status: 400, headers: { "Content-Type": "application/json" } });
    }

    const { prompt } = parsed.data;

    const { textStream } = await streamText({
      model: openai("gpt-3.5-turbo"),
      temperature: 0.7,
      maxTokens: 200,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    return new Response(textStream);
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
}