import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { authenticateRequest } from "@/lib/api-auth";
import { buildTagCreate, parseTagNames } from "@/lib/tags";

export async function GET(request: NextRequest) {
  const auth = await authenticateRequest(request);
  if (auth instanceof NextResponse) return auth;

  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const search = searchParams.get("search");
  const limit = Math.min(Number(searchParams.get("limit")) || 20, 100);
  const cursor = searchParams.get("cursor");

  const where: any = { userId: auth.userId };
  if (category) where.category = category;
  if (search) where.title = { contains: search, mode: "insensitive" };

  const prompts = await prisma.prompt.findMany({
    where,
    take: limit + 1,
    ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),
    orderBy: { createdAt: "desc" },
    include: { tags: { include: { tag: true } } },
  });

  const hasMore = prompts.length > limit;
  const items = hasMore ? prompts.slice(0, limit) : prompts;

  return NextResponse.json({
    data: items.map((p) => ({ ...p, tags: p.tags.map((t) => t.tag.name) })),
    nextCursor: hasMore ? items[items.length - 1].id : null,
  });
}

export async function POST(request: NextRequest) {
  const auth = await authenticateRequest(request);
  if (auth instanceof NextResponse) return auth;

  const body = await request.json();
  const { title, prompt, category, useCase, tags } = body;

  if (!title || !prompt || !category) {
    return NextResponse.json({ error: "title, prompt, and category are required" }, { status: 400 });
  }

  const tagNames = parseTagNames(tags || "");
  const record = await prisma.prompt.create({
    data: {
      title, prompt, category, useCase: useCase || "",
      userId: auth.userId,
      tags: buildTagCreate(tagNames, auth.userId),
    },
    include: { tags: { include: { tag: true } } },
  });

  return NextResponse.json({ data: { ...record, tags: record.tags.map((t) => t.tag.name) } }, { status: 201 });
}
