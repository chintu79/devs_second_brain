"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function getConfigValue(key: string): Promise<string | null> {
  const row = await prisma.appConfig.findUnique({ where: { key } });
  return row?.value ?? null;
}

export async function setConfig(key: string, value: string) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");
  await prisma.appConfig.upsert({
    where: { key },
    update: { value },
    create: { key, value },
  });
}

export async function getEnvStatus() {
  const session = await auth();
  if (!session?.user) return null;
  const aiKey = await getConfigValue("OPENROUTER_API_KEY");
  return {
    DATABASE_URL: !!process.env.DATABASE_URL,
    NEXTAUTH_SECRET: !!process.env.NEXTAUTH_SECRET,
    NEXTAUTH_URL: !!process.env.NEXTAUTH_URL,
    OPENROUTER_API_KEY: !!(process.env.OPENROUTER_API_KEY || aiKey),
  };
}
