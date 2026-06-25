import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { authenticateRequest } from "@/lib/api-auth";

export async function GET(request: NextRequest) {
  const auth = await authenticateRequest(request);
  if (auth instanceof NextResponse) return auth;

  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search");

  const where: any = { userId: auth.userId };
  if (search) where.name = { contains: search, mode: "insensitive" };

  const tags = await prisma.tag.findMany({
    where,
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });

  return NextResponse.json({ data: tags });
}
