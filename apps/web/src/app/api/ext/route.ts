import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    version: "0.2.0",
    endpoints: [
      "POST /api/capture        (unified capture — current)",
      "POST /api/ext/verify-key (auth)",
    ],
  });
}
