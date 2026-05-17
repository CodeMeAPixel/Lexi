export async function GET() {
  // Legacy compatibility endpoint: integration removed.
  // Return an empty JS payload so stale cached pages do not parse HTML as script.
  return new Response("/* ackee integration removed */", {
    status: 200,
    headers: {
      "Content-Type": "application/javascript; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}
