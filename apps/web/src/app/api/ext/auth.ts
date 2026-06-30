import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function authenticateUser(request: Request): Promise<string | null> {
  const session = await auth();
  if (session?.user?.id) return session.user.id;

  const apiKey = request.headers.get("x-api-key");
  if (!apiKey) return null;

  try {
    const keys = await prisma.apiKey.findMany({ select: { id: true, key: true, userId: true } });
    for (const k of keys) {
      if (await bcrypt.compare(apiKey, k.key)) {
        await prisma.apiKey.update({ where: { id: k.id }, data: { lastUsedAt: new Date() } });
        return k.userId;
      }
    }
  } catch {}
  return null;
}
