"use client";

import { Search, Plus, Bell, Bookmark, StickyNote, MessageSquare, FolderKanban } from "lucide-react";
import Link from "next/link";

interface CommandBarProps {
  onOpenPalette: () => void;
}

export function CommandBar({ onOpenPalette }: CommandBarProps) {
  return (
    <div className="flex h-14 items-center gap-3 px-5 border-b border-border bg-background">
      <div className="flex-1 max-w-xl">
        <button
          onClick={onOpenPalette}
          className="group relative flex w-full items-center rounded-lg border border-border bg-muted hover:border-muted-foreground/40 hover:bg-muted/80 hover:scale-[1.01] transition-all duration-200"
        >
          <Search className="absolute left-3 h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
          <span className="flex h-9 w-full items-center pl-9 pr-16 text-sm text-muted-foreground group-hover:text-foreground transition-colors text-left">
            Search your second brain...
          </span>
          <div className="absolute right-2 flex items-center gap-1 text-[10px] font-medium text-muted-foreground">
            <kbd className="rounded border border-border bg-background px-1.5 py-0.5">⌘</kbd>
            <kbd className="rounded border border-border bg-background px-1.5 py-0.5">K</kbd>
          </div>
        </button>
      </div>

      <div className="flex items-center gap-0.5">
        <QuickActionBtn icon={Bookmark} label="Save Resource" href="/resources" />
        <QuickActionBtn icon={StickyNote} label="Write Note" href="/notes" />
        <QuickActionBtn icon={MessageSquare} label="Add Prompt" href="/prompts" />
        <QuickActionBtn icon={FolderKanban} label="New Project" href="/projects" />
      </div>

      <div className="w-px h-6 bg-border/50 mx-1" />

      <div className="flex items-center gap-1">
        <button className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/60 hover:scale-[1.1] transition-all duration-150">
          <Bell className="h-4 w-4" />
        </button>
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-muted text-[11px] font-medium text-foreground">
          K
        </div>
      </div>
    </div>
  );
}

function QuickActionBtn({ icon: Icon, label, href }: { icon: React.ElementType; label: string; href: string }) {
  return (
    <Link
      href={href}
      title={label}
      className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/60 hover:scale-[1.1] transition-all duration-150"
    >
      <Icon className="h-4 w-4" />
    </Link>
  );
}
