"use client";

import { Search, Plus, Bookmark, StickyNote, MessageSquare, FolderKanban, Zap } from "lucide-react";
import Link from "next/link";

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
