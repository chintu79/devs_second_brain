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
  const archived = searchParams.get("archived");
  const limit = Math.min(Number(searchParams.get("limit")) || 20, 100);
  const cursor = searchParams.get("cursor");

  const where: any = { userId: auth.userId };
  if (category) where.category = category;
  if (search) where.title = { contains: search, mode: "insensitive" };
  if (archived !== null) where.archived = archived === "true";

  const notes = await prisma.note.findMany({
    where,
    take: limit + 1,
    ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),
    orderBy: { createdAt: "desc" },
    include: { tags: { include: { tag: true } } },
  });

  const hasMore = notes.length > limit;
  const items = hasMore ? notes.slice(0, limit) : notes;

  return NextResponse.json({
    data: items.map((n) => ({ ...n, tags: n.tags.map((t) => t.tag.name) })),
    nextCursor: hasMore ? items[items.length - 1].id : null,
  });
}

export async function POST(request: NextRequest) {
  const auth = await authenticateRequest(request);
  if (auth instanceof NextResponse) return auth;

  const body = await request.json();
  const { title, content, category, tags } = body;

  if (!title || !content || !category) {
    return NextResponse.json({ error: "title, content, and category are required" }, { status: 400 });
  }

  const tagNames = parseTagNames(tags || "");
  const record = await prisma.note.create({
    data: {
      title, content, category,
      userId: auth.userId,
      tags: buildTagCreate(tagNames, auth.userId),
    },
    include: { tags: { include: { tag: true } } },
  });

  return NextResponse.json({ data: { ...record, tags: record.tags.map((t) => t.tag.name) } }, { status: 201 });
}
