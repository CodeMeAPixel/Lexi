import { NextResponse } from "next/server";

const TRACKER_URL = "https://ackee.bytebrush.dev/tracker.js";

export async function GET() {
  try {
    const res = await fetch(TRACKER_URL);
    const js = await res.text();
    return new Response(js, {
      status: 200,
      headers: {
        "Content-Type": "application/javascript",
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Unable to fetch Ackee tracker" },
      { status: 500 },
    );
  }
}
