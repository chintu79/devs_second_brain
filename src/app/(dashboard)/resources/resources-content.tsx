"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { ResourceList } from "@/components/resources/resource-list";
import { ResourceContextPanel } from "@/components/resources/resource-context-panel";
import { ResourceDialog } from "@/components/vaults/resource-dialog";

interface Resource {
  id: string;
  title: string;
  url: string;
  category: string;
  tags: string[];
  notes: string | null;
  reason: string | null;
  favorite: boolean;
  createdAt: Date;
}

interface ResourcesContentProps {
  initialItems: Resource[];
  nextCursor: string | null;
  allCategories: string[];
  allTags: string[];
  recentNotes: { id: string; title: string }[];
  projects: { id: string; title: string }[];
}

export function ResourcesContent({ initialItems, nextCursor, allCategories, allTags, recentNotes, projects }: ResourcesContentProps) {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <>
      <div data-accent="resources" className="flex h-full -m-8">
        <aside className="hidden xl:flex h-[100vh] w-56 px-2 pt-2 shrink-0 flex-col border-r border-border/50">
          <div className="px-3 pt-3 pb-2 flex items-center justify-between border-b border-border/30">
            <span className="text-xs font-semibold text-section-foreground uppercase tracking-[0.1em]">Resources</span>
            <button
              onClick={() => setDialogOpen(true)}
              className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/10 text-primary hover:bg-primary/20 hover:scale-[1.1] transition-all duration-150"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </aside>
        <div className="flex-1 min-w-0 p-4">
          <ResourceList
            initialItems={initialItems}
            nextCursor={nextCursor}
            allCategories={allCategories}
            allTags={allTags}
          />
        </div>
        <ResourceContextPanel
          topResources={initialItems}
          recentNotes={recentNotes}
          projects={projects}
        />
      </div>
      <ResourceDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </>
  );
}
