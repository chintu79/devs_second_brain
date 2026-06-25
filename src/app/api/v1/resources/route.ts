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

  const resources = await prisma.resource.findMany({
    where,
    take: limit + 1,
    ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),
    orderBy: { createdAt: "desc" },
    include: { tags: { include: { tag: true } } },
  });

  const hasMore = resources.length > limit;
  const items = hasMore ? resources.slice(0, limit) : resources;

  return NextResponse.json({
    data: items.map((r) => ({ ...r, tags: r.tags.map((t) => t.tag.name) })),
    nextCursor: hasMore ? items[items.length - 1].id : null,
  });
}

export async function POST(request: NextRequest) {
  const auth = await authenticateRequest(request);
  if (auth instanceof NextResponse) return auth;

  const body = await request.json();
  const { title, url, category, notes, reason, tags } = body;

  if (!title || !url || !category) {
    return NextResponse.json({ error: "title, url, and category are required" }, { status: 400 });
  }

  const tagNames = parseTagNames(tags || "");
  const resource = await prisma.resource.create({
    data: {
      title, url, category, notes, reason,
      userId: auth.userId,
      tags: buildTagCreate(tagNames, auth.userId),
    },
    include: { tags: { include: { tag: true } } },
  });

  return NextResponse.json({ data: { ...resource, tags: resource.tags.map((t) => t.tag.name) } }, { status: 201 });
}
