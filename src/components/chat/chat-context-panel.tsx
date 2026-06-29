"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link2, StickyNote, MessageSquare, FolderKanban, ArrowRight, Bot, Search, Lightbulb, ChevronDown, ChevronRight } from "lucide-react";
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

const FOLLOW_UPS = [
  "Tell me more about this",
  "Summarize the key points",
  "What should I do next?",
  "Create a note from this",
];

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

        {/* Chat context */}
        <CollapsibleSection icon={Bot} label="Chat Context" defaultOpen={true}>
          {contextFrom ? (
            <div className="px-3 py-2 rounded-lg bg-accent/10 border border-accent/20">
              <p className="text-xs font-medium text-accent capitalize">{contextFrom}</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">Active context for this conversation</p>
            </div>
          ) : (
            <div className="px-3 py-2 rounded-lg bg-muted/40 border border-border/20">
              <p className="text-xs text-muted-foreground">General</p>
              <p className="text-[11px] text-muted-foreground/60 mt-0.5">Searching entire vault</p>
            </div>
          )}
        </CollapsibleSection>

        {/* Knowledge Sources */}
        <CollapsibleSection icon={Search} label="Knowledge Sources" defaultOpen={true}>
          <div className="space-y-1.5">
            <SourceRow label="Resources" count={resources?.length || 0} color="text-teal-500" />
            <SourceRow label="Notes" count={notes?.length || 0} color="text-green-500" />
            <SourceRow label="Prompts" count={prompts?.length || 0} color="text-amber-500" />
            <SourceRow label="Projects" count={projects?.length || 0} color="text-purple-500" />
          </div>
        </CollapsibleSection>

        {/* Recently Referenced */}
        {hasAny && (
          <>
            {resources && resources.length > 0 && (
              <CollapsibleSection icon={Link2} label="Resources" defaultOpen={false}>
                <div className="space-y-1">
                  {resources.slice(0, 5).map((r) => (
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
              </CollapsibleSection>
            )}

            {notes && notes.length > 0 && (
              <CollapsibleSection icon={StickyNote} label="Notes" defaultOpen={false}>
                <div className="space-y-1">
                  {notes.slice(0, 5).map((n) => (
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
              </CollapsibleSection>
            )}

            {prompts && prompts.length > 0 && (
              <CollapsibleSection icon={MessageSquare} label="Prompts" defaultOpen={false}>
                <div className="space-y-1">
                  {prompts.slice(0, 5).map((p) => (
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
              </CollapsibleSection>
            )}

            {projects && projects.length > 0 && (
              <CollapsibleSection icon={FolderKanban} label="Projects" defaultOpen={false}>
                <div className="space-y-1">
                  {projects.slice(0, 5).map((p) => (
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
              </CollapsibleSection>
            )}
          </>
        )}

        {/* Suggested follow-ups */}
        <CollapsibleSection icon={Lightbulb} label="Suggested Questions" defaultOpen={true}>
          <div className="space-y-1">
            {FOLLOW_UPS.map((q) => (
              <button
                key={q}
                className="w-full text-left px-2 py-1.5 rounded-lg text-xs text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all"
              >
                {q}
              </button>
            ))}
          </div>
        </CollapsibleSection>

      </div>
    </motion.aside>
  );
}

function CollapsibleSection({
  icon: Icon, label, children, defaultOpen,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  children: React.ReactNode;
  defaultOpen: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 w-full text-xs text-muted-foreground mb-2 hover:text-foreground transition-colors"
      >
        {open ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
        <Icon className="h-3.5 w-3.5" />
        <span className="font-medium">{label}</span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="overflow-hidden"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function SourceRow({ label, count, color }: { label: string; count: number; color: string }) {
  return (
    <div className="flex items-center justify-between px-2 py-1 rounded-md text-xs">
      <span className="text-muted-foreground">{label}</span>
      <span className={`font-mono text-[11px] ${count > 0 ? color : "text-muted-foreground/40"}`}>
        {count}
      </span>
    </div>
  );
}
