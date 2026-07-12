"use server";

import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/action-utils";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import crypto from "crypto";

export async function generateApiKey(name: string) {
  const userId = await requireAuth();
  if (!userId) throw new Error("Unauthorized");

  try {
    const rawKey = "dsb_" + crypto.randomBytes(24).toString("hex");
    const hashedKey = await bcrypt.hash(rawKey, 10);

    const keyRaw = Buffer.from(rawKey, "utf-8");
    const hashHex = crypto.createHash("sha256").update(keyRaw).digest("hex");
    const keyPrefix = hashHex.slice(0, 16);

    await prisma.apiKey.create({
      data: { name, key: hashedKey, keyPrefix, userId },
    });

    revalidatePath("/settings");
    return { rawKey, maskedKey: rawKey.slice(0, 7) + "..." + rawKey.slice(-4) };
  } catch {
    throw new Error("Failed to generate API key");
  }
}

export async function listApiKeys() {
  const userId = await requireAuth();
  if (!userId) return [];

  try {
    const keys = await prisma.apiKey.findMany({
      where: { userId },
      select: { id: true, name: true, lastUsedAt: true, createdAt: true },
      orderBy: { createdAt: "desc" },
    });

    return keys;
  } catch {
    return [];
  }
}

export async function revokeApiKey(id: string) {
  const userId = await requireAuth();
  if (!userId) throw new Error("Unauthorized");

  try {
    await prisma.apiKey.delete({ where: { id } });
    revalidatePath("/settings");
  } catch {
    throw new Error("Failed to revoke API key");
  }
}


