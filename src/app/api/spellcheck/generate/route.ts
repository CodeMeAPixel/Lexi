import { z } from "zod";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import type { NextAuthOptions } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";

const Schema = z.object({ text: z.string().min(1) });

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = Schema.safeParse(body);
    if (!parsed.success)
      return NextResponse.json({ error: "text required" }, { status: 400 });

    const { text } = parsed.data;

    // Call OpenAI streaming helper to get corrected text (accumulate)
    const prompt = `Please correct the spelling, grammar, and minor style issues in the following text. Return ONLY the corrected text without commentary:\n\n${text}`;
    const { textStream } = await streamText({
      model: openai("gpt-4.1-nano"),
      temperature: 0.0,
      maxTokens: 800,
      messages: [{ role: "user", content: prompt }],
    });

    const reader = textStream.getReader();
    let correctedText = "";
    const decoder = new TextDecoder();
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const chunk = typeof value === "string" ? value : decoder.decode(value);
      correctedText += chunk;
    }
    correctedText = correctedText.trim();

    // Count simple issues (naive: count differences by words)
    const issuesCount = Math.max(
      0,
      text.split(/\s+/).length - correctedText.split(/\s+/).length,
    );

    // DB updates (result row + activity) are handled by the corresponding /store route.

    return NextResponse.json({
      ok: true,
      corrected: correctedText,
      issuesCount,
    });
  } catch (err) {
    console.error("spellcheck.generate", err);
    return NextResponse.json({ error: "Internal" }, { status: 500 });
  }
}
