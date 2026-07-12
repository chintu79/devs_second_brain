import prisma from "@/lib/prisma";
import { authenticateUser } from "../../ext/auth";
import { corsResponse, corsHeaders } from "../../ext/cors";
import { enrichCapture } from "@/lib/capture-pipeline";

export async function OPTIONS(request: Request) {
  return new Response(null, { status: 204, headers: corsHeaders(request) });
}

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const userId = await authenticateUser(request);
  if (!userId) return corsResponse({ error: "Unauthorized" }, 401, request);

  const { id } = await params;

  const capture = await prisma.capture.findUnique({ where: { id } });
  if (!capture) return corsResponse({ error: "Capture not found" }, 404, request);
  if (capture.userId !== userId) return corsResponse({ error: "Unauthorized" }, 401, request);

  let steps: { name: string; status: string }[] = [];
  try { steps = typeof capture.steps === "string" ? JSON.parse(capture.steps) : []; } catch {}

  return corsResponse({
    captureId: capture.id,
    status: capture.status,
    knowledgeItemId: capture.knowledgeItemId,
    steps,
    error: capture.error,
  }, 200, request);
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const userId = await authenticateUser(request);
  if (!userId) return corsResponse({ error: "Unauthorized" }, 401, request);

  const { id } = await params;

  const capture = await prisma.capture.findUnique({ where: { id } });
  if (!capture) return corsResponse({ error: "Capture not found" }, 404, request);
  if (capture.userId !== userId) return corsResponse({ error: "Unauthorized" }, 401, request);
  if (capture.status === "ready") return corsResponse({ error: "Capture already complete" }, 400, request);

  const payload = capture.payload as Record<string, unknown>;
  const input = typeof payload === "string" ? JSON.parse(payload) : payload;

  const title = input?.payload?.title || input?.payload?.url || "Untitled";
  const content = [input?.payload?.title, input?.payload?.selectedText, input?.payload?.description].filter(Boolean).join("\n\n");
  const userNote = input?.payload?.note;

  if (!capture.knowledgeItemId) {
    return corsResponse({ error: "No knowledge item to enrich" }, 400, request);
  }

  await prisma.capture.update({
    where: { id },
    data: { status: "processing", error: null, retries: { increment: 1 } },
  });

  enrichCapture(capture.knowledgeItemId, title, content, userId, userNote);

  return corsResponse({ captureId: id, status: "processing" }, 200, request);
}
