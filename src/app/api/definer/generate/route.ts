import { z } from "zod";
import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";
import { getServerSession } from "next-auth/next";
import type { NextAuthOptions } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { makeDefinerPrompt } from "@/lib/openai/definer";

const Schema = z.object({ term: z.string().min(1) });

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = Schema.safeParse(body);
    if (!parsed.success)
      return new Response(JSON.stringify({ error: "term required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });

    const { term } = parsed.data;

    const { textStream } = await streamText({
      model: openai("gpt-4.1-nano"),
      temperature: 0.2,
      maxTokens: 300,
      messages: [
        { role: "user", content: makeDefinerPrompt(term, { maxLength: 60 }) },
      ],
    });

    const reader = textStream.getReader();
    let finalText = "";

    async function saveActivityIfAuthenticated() {
      try {
        const session = (await getServerSession(
          authOptions as NextAuthOptions,
        )) as unknown as { user?: { id?: string } } | null;
        if (!session?.user?.id) return;
        const userId = session.user.id as string;
        // DB updates (result row + activity) are handled by the corresponding /store route.
      } catch (err) {
        console.error("Failed to save definer activity", err);
      }
    }

    const stream = new ReadableStream({
      async pull(controller) {
        try {
          const { value, done } = await reader.read();
          if (done) {
            controller.close();
            saveActivityIfAuthenticated();
            return;
          }
          const chunk =
            typeof value === "string" ? value : new TextDecoder().decode(value);
          finalText += chunk;
          controller.enqueue(new TextEncoder().encode(chunk));
        } catch (err) {
          console.error("Definer stream error", err);
          controller.error(err);
        }
      },
      cancel(reason) {
        reader.cancel(reason);
      },
    });

    return new Response(stream, {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  } catch (err) {
    console.error("definer.generate", err);
    return new Response(JSON.stringify({ error: "Internal" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
