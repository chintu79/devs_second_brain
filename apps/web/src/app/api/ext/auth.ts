import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import crypto from "crypto";

export async function authenticateUser(request: Request): Promise<string | null> {
  const session = await auth();
  if (session?.user?.id) return session.user.id;

  const apiKey = request.headers.get("x-api-key");
  if (!apiKey) return null;

  try {
    const keyRaw = Buffer.from(apiKey, "utf-8");
    const hashHex = crypto.createHash("sha256").update(keyRaw).digest("hex");
    const prefix = hashHex.slice(0, 16);

    const candidates = await prisma.apiKey.findMany({
      where: { keyPrefix: prefix },
      select: { id: true, key: true, userId: true },
    });

    for (const k of candidates) {
      if (await bcrypt.compare(apiKey, k.key)) {
        await prisma.apiKey.update({ where: { id: k.id }, data: { lastUsedAt: new Date() } });
        return k.userId;
      }
    }

    // Fallback: scan legacy keys without a prefix
    if (candidates.length === 0) {
      const legacyKeys = await prisma.apiKey.findMany({
        where: { keyPrefix: null },
        select: { id: true, key: true, userId: true },
      });
      for (const k of legacyKeys) {
        if (await bcrypt.compare(apiKey, k.key)) {
          await prisma.apiKey.update({ where: { id: k.id }, data: { lastUsedAt: new Date() } });
          return k.userId;
        }
      }
    }
  } catch {}
  return null;
}
