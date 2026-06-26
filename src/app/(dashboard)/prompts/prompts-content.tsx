"use client";

import { useState, useCallback } from "react";
import { Plus } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import { AnimatePresence } from "framer-motion";
import { PromptList } from "@/components/prompts/prompt-list";
import { PromptContextPanel } from "@/components/prompts/prompt-context-panel";
import { PromptPreviewPanel } from "@/components/prompts/prompt-preview-panel";
import { PromptDialog } from "@/components/vaults/prompt-dialog";

interface Prompt {
  id: string;
  title: string;
  prompt: string;
  category: string;
  tags: string[];
  useCase: string;
  favorite: boolean;
  useCount: number;
  lastUsedAt: Date | null;
  createdAt: Date;
}

interface PromptsContentProps {
  initialItems: Prompt[];
  nextCursor: string | null;
  categories: string[];
}

export function PromptsContent({ initialItems, nextCursor, categories }: PromptsContentProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedId = searchParams.get("id");
  const [dialogOpen, setDialogOpen] = useState(false);

  const selectedPrompt = selectedId ? initialItems.find((p) => p.id === selectedId) || null : null;

  const setSelectedId = useCallback(
    (id: string | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (id) params.set("id", id);
      else params.delete("id");
      router.replace(`/prompts?${params.toString()}`, { scroll: false });
    },
    [router, searchParams]
  );

  return (
    <>
      <div data-accent="prompts" className="-m-5 lg:-m-6 h-[calc(100vh-var(--header-height,0px))] flex overflow-hidden">
        <aside className="hidden xl:flex h-full w-56 shrink-0 flex-col border-r border-border/50">
          <div className="px-3 pt-3 pb-2 flex items-center justify-between border-b border-border/30">
            <span className="text-xs font-semibold text-section-foreground uppercase tracking-[0.1em]">Prompts</span>
            <button
              onClick={() => setDialogOpen(true)}
              className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/10 text-primary hover:bg-primary/20 hover:scale-[1.1] transition-all duration-150"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </aside>
        <div className="flex-1 min-w-0 p-4">
          <PromptList
            initialItems={initialItems}
            nextCursor={nextCursor}
            categories={categories}
          />
        </div>
        {!selectedPrompt && (
          <PromptContextPanel
            favorites={initialItems.filter((p) => p.favorite).map((p) => ({ id: p.id, title: p.title }))}
            recentPrompts={[...initialItems].sort((a, b) => (b.lastUsedAt?.getTime() || 0) - (a.lastUsedAt?.getTime() || 0)).slice(0, 5).map((p) => ({ id: p.id, title: p.title }))}
          />
        )}
        <AnimatePresence>
          {selectedPrompt && (
            <PromptPreviewPanel
              key={selectedPrompt.id}
              prompt={selectedPrompt}
              onClose={() => setSelectedId(null)}
              onUpdate={() => {}}
            />
          )}
        </AnimatePresence>
      </div>
      <PromptDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </>
  );
}
