"use client";

import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion, LayoutGroup } from "framer-motion";
import { ease, stagger, fadeInUp } from "@devventory/motion";
import {
  Download,
  Bookmark,
  BookOpenText,
  Search,
  Link,
  Tag,
  FolderTree,
  Brain,
} from "lucide-react";
import { KnowledgeTile } from "./knowledge-tile";
import { ReaderOverlay } from "./reader-overlay";

type Step = "extension" | "capture" | "organize" | "read" | "search";

const steps: { id: Step; icon: typeof Download; label: string; desc: string }[] = [
  { id: "extension", icon: Download, label: "Browser Extension", desc: "Save any URL in one click" },
  { id: "capture", icon: Bookmark, label: "Capture", desc: "Auto-extract title, description, tags" },
  { id: "organize", icon: FolderTree, label: "Organize", desc: "Folders, tags, collections" },
  { id: "read", icon: BookOpenText, label: "Reader", desc: "Clean reading view, highlights" },
  { id: "search", icon: Search, label: "Search", desc: "Full-text search across everything" },
];

const content: Record<Step, { title: string; lines: string[]; meta: { icon: typeof Link; label: string }[] }> = {
  extension: {
    title: "Cmd+Shift+S → Save",
    lines: [
      "Never leave your flow. The browser extension captures URLs with auto-extracted metadata — title, description, Open Graph image, and suggested tags.",
      "Add optional context notes. Tag it. File it. Done in under 5 seconds.",
    ],
    meta: [
      { icon: Tag, label: "Auto-tagged: React, Next.js" },
      { icon: Link, label: "devventory.app/capture" },
    ],
  },
  capture: {
    title: "Everything in one place",
    lines: [
      "Links, PDFs, videos, documents — all saved to a unified knowledge base. No more bookmark folders in three different browsers.",
      "Full-text indexing means you can find anything by searching for a phrase you remember.",
    ],
    meta: [
      { icon: Brain, label: "AI-suggested tags" },
      { icon: Tag, label: "4 items captured today" },
    ],
  },
  organize: {
    title: "Folders, tags, collections",
    lines: [
      "Organize your knowledge the way you think. Nested folders for structure, tags for cross-cutting concerns, collections for temporary groupings.",
      "A resource can live in one folder and carry unlimited tags — no silos.",
    ],
    meta: [
      { icon: FolderTree, label: "12 folders · 48 tags" },
      { icon: Tag, label: "Frontend, System Design, AI" },
    ],
  },
  read: {
    title: "Distraction-free reading",
    lines: [
      "Every saved article opens in a clean reader view. No ads, no popups, no clutter. Highlight key passages and they're searchable forever.",
      "Reader mode works on PDFs, documentation, and blog posts alike.",
    ],
    meta: [
      { icon: BookOpenText, label: "Reader mode" },
      { icon: Tag, label: "3 highlights on this page" },
    ],
  },
  search: {
    title: "Search across everything",
    lines: [
      "Full-text search across every saved resource, note, highlight, and document. Filter by type, tag, folder, or date range.",
      "Results appear as you type — no page load, no waiting.",
    ],
    meta: [
      { icon: Search, label: "Instant full-text search" },
      { icon: Tag, label: "Filter by: type · tag · folder · date" },
    ],
  },
};

const tileItems = [
  {
    id: "1",
    title: "How QR Phishing Attacks Target Developers",
    url: "blog.security.com",
    category: "Security",
    summary: "QR phishing — or 'quishing' — is on the rise. Attackers embed malicious QR codes in emails and PDFs to bypass email filters.",
  },
  {
    id: "2",
    title: "React 19: Everything You Need To Know",
    url: "react.dev",
    category: "Frontend",
    summary: "React 19 introduces Server Components, Actions, and the new compiler. Manual memoization is now optional.",
  },
  {
    id: "3",
    title: "System Design — Rate Limiting",
    url: "medium.com",
    category: "Backend",
    summary: "Token Bucket, Leaky Bucket, Fixed Window, and Sliding Window Log. Each has tradeoffs between memory and accuracy.",
  },
];

export function Showcase() {
  const [active, setActive] = useState<Step>("extension");
  const [readerId, setReaderId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const reduced = useReducedMotion();

  const filteredTiles = tileItems.filter(
    (t) =>
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.category.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <LayoutGroup>
      <section className="relative py-32 md:py-40 overflow-hidden">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center mb-16">
            <span className="inline-flex items-center rounded-full border border-border/60 bg-muted/30 px-3.5 py-1 text-xs font-medium text-muted-foreground/70 mb-6">
              Product demo
            </span>
            <h2 className="text-[2rem] font-bold tracking-[-0.02em] leading-[1.1] mb-4 max-w-3xl mx-auto">
              See it <span className="text-[#6366F1]">in action</span>
            </h2>
            <p className="text-base text-muted-foreground/80 max-w-xl mx-auto leading-relaxed">
              Click through the tabs to see how Devventory works — then try the tiles below.
            </p>
          </div>

          {/* Tab bar */}
          <div role="tablist" className="relative flex items-center justify-center gap-1 p-1 rounded-xl bg-muted/30 border border-border/60 max-w-2xl mx-auto mb-12">
            {steps.map((step) => {
              const Icon = step.icon;
              const isActive = active === step.id;
              return (
                <button
                  key={step.id}
                  id={`tab-${step.id}`}
                  role="tab"
                  aria-selected={isActive}
                  aria-controls={`tabpanel-${step.id}`}
                  onClick={() => setActive(step.id)}
                  className={`relative flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium transition-colors duration-150 ${
                    isActive ? "text-foreground" : "text-muted-foreground/60 hover:text-foreground/80"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="active-tab"
                      className="absolute inset-0 rounded-lg bg-card shadow-sm border border-border/60"
                      transition={{ duration: 0.25, ease: ease.decelerate }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-2">
                    <Icon className="h-3.5 w-3.5" />
                    <span className={`${isActive ? "inline" : "hidden"} md:inline`}>{step.label}</span>
                  </span>
                </button>
              );
            })}
          </div>

          {/* Tab content */}
          <div className="relative max-w-4xl mx-auto mb-20">
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                id={`tabpanel-${active}`}
                role="tabpanel"
                aria-labelledby={`tab-${active}`}
                initial={reduced ? undefined : { opacity: 0, y: 12 }}
                animate={reduced ? undefined : { opacity: 1, y: 0 }}
                exit={reduced ? undefined : { opacity: 0, y: -12 }}
                transition={{ duration: 0.25, ease: ease.decelerate }}
              >
                <div className="rounded-xl border border-border/60 bg-card shadow-sm overflow-hidden">
                  <div className="flex items-center gap-2 border-b border-border/60 px-4 py-2.5 bg-secondary/20">
                    <div className="flex items-center gap-1">
                      <div className="h-2 w-2 rounded-full bg-destructive" />
                      <div className="h-2 w-2 rounded-full bg-warning" />
                      <div className="h-2 w-2 rounded-full bg-success" />
                    </div>
                    <div className="flex-1 text-center">
                      <span className="text-[11px] text-muted-foreground/40 font-medium">
                        {content[active].title}
                      </span>
                    </div>
                  </div>

                  <div className="p-6 md:p-8">
                    {active === "search" ? (
                      <div>
                        <div className="flex items-center gap-2 rounded-lg border border-border/60 bg-muted/20 px-3 py-2 mb-4 focus-within:border-[#6366F1]/50 focus-within:ring-1 focus-within:ring-[#6366F1]/20 transition-all">
                          <Search className="h-4 w-4 text-muted-foreground/40 shrink-0" />
                          <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search knowledge..."
                            className="flex-1 bg-transparent text-sm text-foreground/90 placeholder:text-muted-foreground/40 outline-none"
                            autoFocus
                          />
                          {searchQuery && (
                            <button
                              onClick={() => setSearchQuery("")}
                              className="text-xs text-muted-foreground/40 hover:text-foreground/60 transition-colors"
                              aria-label="Clear search"
                            >
                              Clear
                            </button>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground/50">
                          {filteredTiles.length === 0
                            ? "No results found. Try a different term."
                            : `${filteredTiles.length} result${filteredTiles.length === 1 ? "" : "s"} — matches update as you type.`}
                        </p>
                      </div>
                    ) : (
                      <>
                        {content[active].lines.map((line, i) => (
                          <p key={i} className="text-sm text-muted-foreground/80 leading-relaxed mb-3 last:mb-0">
                            {line}
                          </p>
                        ))}
                        <div className="flex flex-wrap gap-2 mt-6 pt-6 border-t border-border/40">
                          {content[active].meta.map((m) => {
                            const MetaIcon = m.icon;
                            return (
                              <span
                                key={m.label}
                                className="inline-flex items-center gap-1.5 rounded-lg bg-muted/30 border border-border/40 px-2.5 py-1 text-[11px] font-medium text-muted-foreground/70"
                              >
                                <MetaIcon className="h-3 w-3" />
                                {m.label}
                              </span>
                            );
                          })}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-4 mb-12">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-border/30 to-transparent" />
            <span className="text-[11px] font-medium text-muted-foreground/40 tracking-wider uppercase">Try it</span>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-border/30 to-transparent" />
          </div>

          {/* Knowledge Tiles — filtered by search */}
          <motion.div
            variants={reduced ? undefined : stagger.container}
            initial={reduced ? undefined : "hidden"}
            whileInView={reduced ? undefined : "visible"}
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto"
          >
            {filteredTiles.map((item) => (
              <motion.div key={item.id} variants={reduced ? undefined : fadeInUp}>
                <KnowledgeTile
                  {...item}
                  onSelect={setReaderId}
                />
              </motion.div>
            ))}
          </motion.div>

          {filteredTiles.length > 0 && searchQuery && (
            <p className="text-center text-xs text-muted-foreground/40 mt-4">
              Click a tile to open the Reader
            </p>
          )}

          {/* Progress dots */}
          <div className="flex items-center justify-center gap-2 mt-12">
            {steps.map((s, i) => (
              <button
                key={s.id}
                onClick={() => setActive(s.id)}
                className={`h-1.5 rounded-full transition-all duration-300 ${active === s.id ? "w-8 bg-[#6366F1]" : "w-1.5 bg-muted-foreground/20 hover:bg-muted-foreground/40"
                  }`}
                aria-label={`Show ${s.label}`}
              />
            ))}
          </div>
        </div>

        {/* Reader Overlay — shared layout morphs from tile */}
        <ReaderOverlay id={readerId} onClose={() => setReaderId(null)} />
      </section>
    </LayoutGroup>
  );
}
