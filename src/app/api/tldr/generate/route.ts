import { z } from "zod";
import { NextResponse } from "next/server";
import { streamTldr } from "@/lib/openai/tldr";
import { streamText } from "ai";

const Schema = z.object({
  messages: z.array(z.object({ role: z.string(), content: z.string() })).min(1),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = Schema.safeParse(body);
    if (!parsed.success)
      return NextResponse.json({ error: "messages required" }, { status: 400 });

    const { messages } = parsed.data;

    const { textStream } = await streamTldr({ messages });

    const reader = textStream.getReader();
    const decoder = new TextDecoder();

    let summary = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const chunk = typeof value === "string" ? value : decoder.decode(value);
      summary += chunk;
    }

    summary = summary.trim();

    return NextResponse.json({ ok: true, summary });
  } catch (err) {
    console.error("tldr.generate", err);
    return NextResponse.json({ error: "Internal" }, { status: 500 });
  }
}
