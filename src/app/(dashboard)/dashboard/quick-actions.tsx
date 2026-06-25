"use client";

import { useState } from "react";
import { Plus, Link2, MessageSquare, StickyNote, FolderKanban } from "lucide-react";
import { ResourceDialog } from "@/components/vaults/resource-dialog";
import { PromptDialog } from "@/components/vaults/prompt-dialog";
import { NoteDialog } from "@/components/vaults/note-dialog";
import { ProjectDialog } from "@/components/vaults/project-dialog";

const actions = [
  { key: "resource", label: "New Resource", icon: Link2, accent: "#14b8a6" },
  { key: "prompt", label: "New Prompt", icon: MessageSquare, accent: "#f59e0b" },
  { key: "note", label: "New Note", icon: StickyNote, accent: "#22c55e" },
  { key: "project", label: "New Project", icon: FolderKanban, accent: "#8b5cf6" },
] as const;

export function DashboardQuickActions() {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <>
      <div className="flex items-center gap-2 mb-6">
        {actions.map((action) => (
          <button
            key={action.key}
            onClick={() => setOpen(action.key)}
            className="flex items-center gap-2 rounded-lg border border-border/60 bg-card px-4 py-2.5 text-sm font-medium text-foreground hover:bg-muted hover:border-border transition-all duration-150"
          >
            <div className="flex h-6 w-6 items-center justify-center rounded-md" style={{ backgroundColor: `${action.accent}15` }}>
              <action.icon className="h-3.5 w-3.5" style={{ color: action.accent }} />
            </div>
            {action.label}
            <Plus className="h-3.5 w-3.5 text-muted-foreground" />
          </button>
        ))}
      </div>

      <ResourceDialog open={open === "resource"} onOpenChange={(v) => setOpen(v ? "resource" : null)} />
      <PromptDialog open={open === "prompt"} onOpenChange={(v) => setOpen(v ? "prompt" : null)} />
      <NoteDialog open={open === "note"} onOpenChange={(v) => setOpen(v ? "note" : null)} />
      <ProjectDialog open={open === "project"} onOpenChange={(v) => setOpen(v ? "project" : null)} />
    </>
  );
}
