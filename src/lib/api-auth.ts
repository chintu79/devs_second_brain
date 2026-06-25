import { NextRequest, NextResponse } from "next/server";
import { verifyApiKey } from "@/actions/api-keys";

export async function authenticateRequest(request: NextRequest): Promise<{ userId: string } | NextResponse> {
  const authHeader = request.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Missing or invalid Authorization header" }, { status: 401 });
  }

  const rawKey = authHeader.slice(7);
  const userId = await verifyApiKey(rawKey);

  if (!userId) {
    return NextResponse.json({ error: "Invalid API key" }, { status: 401 });
  }

  return { userId };
}
