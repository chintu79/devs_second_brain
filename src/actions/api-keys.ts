"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import crypto from "crypto";

export async function generateApiKey(name: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  try {
    const rawKey = "dsb_" + crypto.randomBytes(24).toString("hex");
    const hashedKey = await bcrypt.hash(rawKey, 10);

    await prisma.apiKey.create({
      data: { name, key: hashedKey, userId: session.user.id },
    });

    revalidatePath("/settings");
    return { rawKey, maskedKey: rawKey.slice(0, 7) + "..." + rawKey.slice(-4) };
  } catch {
    throw new Error("Failed to generate API key");
  }
}

export async function listApiKeys() {
  const session = await auth();
  if (!session?.user?.id) return [];

  try {
    const keys = await prisma.apiKey.findMany({
      where: { userId: session.user.id },
      select: { id: true, name: true, lastUsedAt: true, createdAt: true },
      orderBy: { createdAt: "desc" },
    });

    return keys;
  } catch {
    return [];
  }
}

export async function revokeApiKey(id: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  try {
    await prisma.apiKey.delete({ where: { id } });
    revalidatePath("/settings");
  } catch {
    throw new Error("Failed to revoke API key");
  }
}


