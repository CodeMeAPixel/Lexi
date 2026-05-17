export const config = {
  runtime: "edge",
};

export async function GET(): Promise<Response> {
  const payload = {
    name: "Lexi API",
    version: "1.0.0",
    description: "Base API endpoint for the Lexi AI app.",
    endpoints: [
      { 
        method: "POST", 
        path: "/api/rephraser", 
        description: "Rephrase given prompt using OpenAI (streamed)." 
      }
    ],
  };

  return new Response(JSON.stringify(payload, null, 2), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
