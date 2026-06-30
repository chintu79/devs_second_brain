import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    version: "0.1.0",
    endpoints: [
      "POST /api/ext/verify-key",
      "POST /api/ext/save-resource",
      "POST /api/ext/save-note",
      "POST /api/ext/save-prompt",
      "POST /api/ext/ai-enrich",
    ],
  });
}
