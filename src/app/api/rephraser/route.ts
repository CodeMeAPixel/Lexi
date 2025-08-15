import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";

export const runtime = "edge";

export async function POST(req: Request) {
  try {
    const { prompt } = (await req.json()) as { prompt?: string };

    if (!prompt) {
      return new Response("No prompt in the request", { status: 400 });
    }

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
    return new Response("Internal Server Error", { status: 500 });
  }
}