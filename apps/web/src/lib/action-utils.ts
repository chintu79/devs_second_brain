import { auth } from "@/lib/auth";

export type ActionResult<T = void> =
  | { data: T; error?: never }
  | { data?: never; error: string };

export async function withAuth<T>(
  fn: (userId: string) => Promise<T>
): Promise<ActionResult<T>> {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };
  try {
    const data = await fn(session.user.id);
    return { data };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Unknown error" };
  }
}

/** Lightweight helper — returns userId or null (preserves existing return patterns). */
export async function requireAuth(): Promise<string | null> {
  const session = await auth();
  return session?.user?.id ?? null;
}
