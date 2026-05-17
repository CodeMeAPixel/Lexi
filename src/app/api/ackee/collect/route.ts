export async function POST() {
  // Legacy compatibility endpoint: integration removed.
  return new Response(null, { status: 204 });
}
