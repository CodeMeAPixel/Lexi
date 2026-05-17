import { z } from "zod";
import { streamRephrase } from "@/lib/openai/rephraser";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import type { NextAuthOptions } from "next-auth";
import { authOptions } from "@/lib/auth";

const RephraseSchema = z.object({
  prompt: z.string().min(1, "prompt is required"),
  original: z.string().min(1, "original text is required").optional(),
  tone: z.string().optional(),
  length: z.string().optional(),
  preserveEntities: z.boolean().optional(),
  preservePunctuation: z.boolean().optional(),
  extraInstructions: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = RephraseSchema.safeParse(body);

    if (!parsed.success) {
      const first = parsed.error.errors[0];
      return new Response(JSON.stringify({ error: first.message }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const {
      prompt,
      original,
      tone,
      length,
      preserveEntities,
      preservePunctuation,
      extraInstructions,
    } = parsed.data;

    const { textStream } = await streamRephrase({
      prompt,
      temperature: 0.7,
      maxTokens: 200,
    });

    // Proxy the AI text stream while accumulating the final text to save to DB after completion
    const reader = textStream.getReader();

    let finalText = "";

    // Helper to save history once finalText is complete
    async function saveHistoryIfAuthenticated() {
      try {
        const session = await getServerSession(authOptions as NextAuthOptions);
        if (
          !session ||
          typeof (session.user as { id?: unknown }).id !== "string"
        )
          return;
        const userId = (session.user as { id: string }).id;

        // Map tone/length to enums if present
        const toneEnum = tone ? tone.toString().toUpperCase() : undefined;
        const lengthEnum = length ? length.toString().toUpperCase() : undefined;

        // DB updates (result row + activity) are handled by the corresponding /store route.
      } catch (err) {
        console.error("Failed to save rephrase history", err);
      }
    }

    const stream = new ReadableStream({
      async pull(controller) {
        try {
          const { value, done } = await reader.read();
          if (done) {
            // stream finished, close controller then save history in background
            controller.close();
            // fire-and-forget saving the accumulated text
            saveHistoryIfAuthenticated();
            return;
          }
          if (value) {
            // value is Uint8Array or string depending on the source
            const chunk =
              typeof value === "string"
                ? value
                : new TextDecoder().decode(value);
            finalText += chunk;
            controller.enqueue(new TextEncoder().encode(chunk));
          }
        } catch (err) {
          console.error("Stream proxy error", err);
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
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
