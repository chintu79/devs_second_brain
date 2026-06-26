import { Suspense } from "react";
import { auth } from "@/lib/auth";
import prisma, { safeQuery } from "@/lib/prisma";
import { ChatWorkspace } from "@/components/chat/chat-workspace";

interface VaultItem {
  id: string;
  title: string;
  category?: string;
}

async function getChatData(userId: string) {
  const [resources, notes, prompts, projects] = await Promise.all([
    safeQuery("chat.resources", () => prisma.resource.findMany({
      where: { userId },
      select: { id: true, title: true, category: true },
      take: 20,
      orderBy: { createdAt: "desc" },
    }), []),
    safeQuery("chat.notes", () => prisma.note.findMany({
      where: { userId, archived: false },
      select: { id: true, title: true, category: true },
      take: 20,
      orderBy: { createdAt: "desc" },
    }), []),
    safeQuery("chat.prompts", () => prisma.prompt.findMany({
      where: { userId },
      select: { id: true, title: true, category: true },
      take: 20,
      orderBy: { createdAt: "desc" },
    }), []),
    safeQuery("chat.projects", () => prisma.project.findMany({
      where: { userId, status: { not: "archived" } },
      select: { id: true, title: true },
      take: 20,
      orderBy: { createdAt: "desc" },
    }), []),
  ]);

  return { resources, notes, prompts, projects };
}

async function ChatContent({ userId }: { userId: string }) {
  const data = await getChatData(userId);
  return (
    <ChatWorkspace
      resources={data.resources as VaultItem[]}
      notes={data.notes as VaultItem[]}
      prompts={data.prompts as VaultItem[]}
      projects={data.projects as VaultItem[]}
    />
  );
}

export default async function ChatPage() {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return (
      <div data-accent="chat" className="h-full flex items-center justify-center">
        <p className="text-muted-foreground text-sm">Sign in to use the AI assistant.</p>
      </div>
    );
  }

  return (
    <Suspense fallback={
      <div className="h-full flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-border border-t-amber-500" />
          <p className="text-sm text-muted-foreground">Loading workspace&hellip;</p>
        </div>
      </div>
    }>
      <ChatContent userId={userId} />
    </Suspense>
  );
}
