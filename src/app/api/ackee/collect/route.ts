import { NextResponse } from "next/server";

const COLLECT_URL = "https://ackee.bytebrush.dev/api";

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const res = await fetch(COLLECT_URL, {
      method: "POST",
      headers: {
        "Content-Type": req.headers.get("Content-Type") || "application/json",
      },
      body,
    });
    const data = await res.text();
    return new Response(data, {
      status: res.status,
      headers: {
        "Content-Type": res.headers.get("Content-Type") || "application/json",
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Unable to proxy Ackee collect" },
      { status: 500 },
    );
  }
}
