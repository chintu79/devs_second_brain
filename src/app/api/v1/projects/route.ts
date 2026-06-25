import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { authenticateRequest } from "@/lib/api-auth";
import { buildTagCreate, parseTagNames } from "@/lib/tags";

export async function GET(request: NextRequest) {
  const auth = await authenticateRequest(request);
  if (auth instanceof NextResponse) return auth;

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const search = searchParams.get("search");
  const limit = Math.min(Number(searchParams.get("limit")) || 20, 100);
  const cursor = searchParams.get("cursor");

  const where: any = { userId: auth.userId };
  if (status) where.status = status;
  if (search) where.title = { contains: search, mode: "insensitive" };

  const projects = await prisma.project.findMany({
    where,
    take: limit + 1,
    ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),
    orderBy: { createdAt: "desc" },
    include: { tags: { include: { tag: true } } },
  });

  const hasMore = projects.length > limit;
  const items = hasMore ? projects.slice(0, limit) : projects;

  return NextResponse.json({
    data: items.map((p) => ({ ...p, tags: p.tags.map((t) => t.tag.name) })),
    nextCursor: hasMore ? items[items.length - 1].id : null,
  });
}

export async function POST(request: NextRequest) {
  const auth = await authenticateRequest(request);
  if (auth instanceof NextResponse) return auth;

  const body = await request.json();
  const { title, description, status, techStack, tags } = body;

  if (!title) {
    return NextResponse.json({ error: "title is required" }, { status: 400 });
  }

  const tagNames = parseTagNames(tags || "");
  const record = await prisma.project.create({
    data: {
      title,
      description: description || "",
      status: status || "idea",
      techStack: techStack || [],
      userId: auth.userId,
      tags: buildTagCreate(tagNames, auth.userId),
    },
    include: { tags: { include: { tag: true } } },
  });

  return NextResponse.json({ data: { ...record, tags: record.tags.map((t) => t.tag.name) } }, { status: 201 });
}
