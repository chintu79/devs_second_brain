"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { PromptList } from "@/components/prompts/prompt-list";
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
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <>
      <div data-accent="prompts" className="flex h-full -m-8">
        <aside className="hidden xl:flex h-[100vh] w-56 mx-2 mt-2 shrink-0 flex-col border-r border-border/50 overflow-hidden">
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
      </div>
      <PromptDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </>
  );
}
