import { authenticateUser } from "../auth";
import { corsResponse, corsHeaders } from "../cors";

export async function OPTIONS(request: Request) {
  return new Response(null, { status: 204, headers: corsHeaders(request) });
}

export async function POST(request: Request) {
  const userId = await authenticateUser(request);
  if (!userId) return corsResponse({ error: "Unauthorized" }, 401, request);
  return corsResponse({ valid: true }, 200, request);
}
