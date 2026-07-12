import { authenticateUser } from "../ext/auth";
import { corsResponse, corsHeaders } from "../ext/cors";
import { createCapture } from "@/lib/capture-pipeline";

export async function OPTIONS(request: Request) {
  return new Response(null, { status: 204, headers: corsHeaders(request) });
}

export async function POST(request: Request) {
  const userId = await authenticateUser(request);
  if (!userId) return corsResponse({ error: "Unauthorized" }, 401, request);

  try {
    const body = await request.json();
    const result = await createCapture(userId, {
      source: body.source || "api",
      type: body.type || "reference",
      payload: body.payload || {},
      collectionIds: body.collectionIds || [],
    });
    return corsResponse(result, 201, request);
  } catch (e: unknown) {
    return corsResponse({ error: e instanceof Error ? e.message : "Failed to capture" }, 500, request);
  }
}
