"use client";

import { motion } from "framer-motion";
import { Link2, StickyNote, MessageSquare, FolderKanban, ArrowRight, Bot } from "lucide-react";
import Link from "next/link";
import { slideInRight } from "@/lib/motion";

interface VaultItem {
  id: string;
  title: string;
  tags?: string[];
  category?: string;
  description?: string;
}

interface ChatContextPanelProps {
  contextFrom?: string;
  resources?: VaultItem[];
  notes?: VaultItem[];
  prompts?: VaultItem[];
  projects?: VaultItem[];
}

export function ChatContextPanel({ contextFrom, resources, notes, prompts, projects }: ChatContextPanelProps) {
  const hasAny = (resources?.length || 0) > 0 || (notes?.length || 0) > 0 || (prompts?.length || 0) > 0 || (projects?.length || 0) > 0;

  return (
    <motion.aside
      variants={slideInRight}
      initial="initial"
      animate="animate"
      exit="exit"
      className="w-72 shrink-0 border-l border-border/30 bg-muted/20 overflow-y-auto"
    >
      <div className="p-5 space-y-6">

        {contextFrom && (
          <div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-3">
              <Bot className="h-3.5 w-3.5" />
              <span>Context</span>
            </div>
            <div className="px-3 py-2 rounded-lg bg-accent/10 border border-accent/20">
              <p className="text-xs font-medium text-accent capitalize">{contextFrom}</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">Chat includes context from this section</p>
            </div>
          </div>
        )}

        {!hasAny && !contextFrom && (
          <div className="text-center py-8">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted mx-auto mb-3">
              <Bot className="h-5 w-5 text-muted-foreground" />
            </div>
            <p className="text-xs text-muted-foreground">Ask a question to see related vault items here</p>
          </div>
        )}

        {resources && resources.length > 0 && (
          <ContextSection icon={Link2} label="Resources">
            <div className="space-y-1">
              {resources.slice(0, 4).map((r) => (
                <Link
                  key={r.id}
                  href={`/resources/${r.id}`}
                  className="group flex items-center gap-2 rounded-lg px-2 py-1.5 text-xs text-foreground/80 hover:text-foreground hover:bg-muted/60 hover:scale-[1.02] transition-all duration-150"
                >
                  <Link2 className="h-3 w-3 shrink-0 text-teal-500" />
                  <span className="truncate">{r.title}</span>
                </Link>
              ))}
            </div>
            <Link href="/resources" className="flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground mt-2 transition-colors">
              All resources <ArrowRight className="h-3 w-3" />
            </Link>
          </ContextSection>
        )}

        {notes && notes.length > 0 && (
          <ContextSection icon={StickyNote} label="Notes">
            <div className="space-y-1">
              {notes.slice(0, 4).map((n) => (
                <Link
                  key={n.id}
                  href={`/notes?id=${n.id}`}
                  className="group flex items-center gap-2 rounded-lg px-2 py-1.5 text-xs text-foreground/80 hover:text-foreground hover:bg-muted/60 hover:scale-[1.02] transition-all duration-150"
                >
                  <StickyNote className="h-3 w-3 shrink-0 text-green-500" />
                  <span className="truncate">{n.title}</span>
                </Link>
              ))}
            </div>
            <Link href="/notes" className="flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground mt-2 transition-colors">
              All notes <ArrowRight className="h-3 w-3" />
            </Link>
          </ContextSection>
        )}

        {prompts && prompts.length > 0 && (
          <ContextSection icon={MessageSquare} label="Prompts">
            <div className="space-y-1">
              {prompts.slice(0, 4).map((p) => (
                <Link
                  key={p.id}
                  href={`/prompts/${p.id}`}
                  className="group flex items-center gap-2 rounded-lg px-2 py-1.5 text-xs text-foreground/80 hover:text-foreground hover:bg-muted/60 hover:scale-[1.02] transition-all duration-150"
                >
                  <MessageSquare className="h-3 w-3 shrink-0 text-amber-500" />
                  <span className="truncate">{p.title}</span>
                </Link>
              ))}
            </div>
            <Link href="/prompts" className="flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground mt-2 transition-colors">
              All prompts <ArrowRight className="h-3 w-3" />
            </Link>
          </ContextSection>
        )}

        {projects && projects.length > 0 && (
          <ContextSection icon={FolderKanban} label="Projects">
            <div className="space-y-1">
              {projects.slice(0, 4).map((p) => (
                <Link
                  key={p.id}
                  href={`/projects/${p.id}`}
                  className="group flex items-center gap-2 rounded-lg px-2 py-1.5 text-xs text-foreground/80 hover:text-foreground hover:bg-muted/60 hover:scale-[1.02] transition-all duration-150"
                >
                  <FolderKanban className="h-3 w-3 shrink-0 text-purple-500" />
                  <span className="truncate">{p.title}</span>
                </Link>
              ))}
            </div>
            <Link href="/projects" className="flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground mt-2 transition-colors">
              All projects <ArrowRight className="h-3 w-3" />
            </Link>
          </ContextSection>
        )}
      </div>
    </motion.aside>
  );
}

function ContextSection({
  icon: Icon, label, children,
}: {
  icon: React.ComponentType<{ className?: string }>; label: string; children: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-2">
        <Icon className="h-3.5 w-3.5" />
        <span className="font-medium">{label}</span>
      </div>
      {children}
    </div>
  );
}
