"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import crypto from "crypto";

function generateRawKey(): string {
  return "dsb_" + crypto.randomBytes(24).toString("hex");
}

function maskKey(key: string): string {
  return key.slice(0, 7) + "..." + key.slice(-4);
}

export async function generateApiKey(name: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const rawKey = generateRawKey();
  const hashedKey = await bcrypt.hash(rawKey, 10);

  await prisma.apiKey.create({
    data: { name, key: hashedKey, userId: session.user.id },
  });

  revalidatePath("/settings");
  return { rawKey, maskedKey: maskKey(rawKey) };
}

export async function listApiKeys() {
  const session = await auth();
  if (!session?.user?.id) return [];

  const keys = await prisma.apiKey.findMany({
    where: { userId: session.user.id },
    select: { id: true, name: true, lastUsedAt: true, createdAt: true },
    orderBy: { createdAt: "desc" },
  });

  return keys;
}

export async function revokeApiKey(id: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  await prisma.apiKey.delete({ where: { id } });
  revalidatePath("/settings");
}

export async function verifyApiKey(rawKey: string) {
  const keys = await prisma.apiKey.findMany();
  for (const apiKey of keys) {
    const match = await bcrypt.compare(rawKey, apiKey.key);
    if (match) {
      await prisma.apiKey.update({
        where: { id: apiKey.id },
        data: { lastUsedAt: new Date() },
      });
      return apiKey.userId;
    }
  }
  return null;
}
