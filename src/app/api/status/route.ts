import { NextResponse } from "next/server";

const STATUS_API_URL = "https://status.lexiapp.space/api/monitor";
const STATUS_API_TOKEN = process.env.STATUS_API_TOKEN;

export async function GET() {
  try {
    const res = await fetch(STATUS_API_URL, {
      headers: STATUS_API_TOKEN
        ? { Authorization: `Bearer ${STATUS_API_TOKEN}` }
        : {},
      next: { revalidate: 30 }, // cache for 30s
    });
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Unable to fetch status" },
      { status: 500 },
    );
  }
}
