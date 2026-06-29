"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Bookmark, Link2, Search, History, GitFork, Hash, Plus, Sparkles, ArrowUp, Radio as RadioIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ease } from "@/lib/motion";

const sectionVariant = {
  hidden: { opacity: 0, y: 48 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: ease.decelerate } },
};

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted/40 px-3 py-1 text-[11px] font-medium text-muted-foreground/80 mb-6">
      {children}
    </span>
  );
}

function Frame({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border bg-card shadow-lg shadow-[var(--shadow-elevated)] overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5">
      <div className="flex items-center gap-3 border-b border-border px-4 py-3 bg-secondary/30">
        <div className="flex items-center gap-1.5">
          <div className="h-2.5 w-2.5 rounded-full bg-[#EF4444]" />
          <div className="h-2.5 w-2.5 rounded-full bg-[#EAB308]" />
          <div className="h-2.5 w-2.5 rounded-full bg-[#22C55E]" />
        </div>
        <div className="flex-1 text-center">
          <span className="text-xs text-muted-foreground/50 font-medium">{title}</span>
        </div>
      </div>
      {children}
    </div>
  );
}

function TagPill({ label, color }: { label: string; color?: string }) {
  return (
    <span className="inline-flex items-center px-2 py-0.5 text-[10px] rounded-full font-medium transition-all duration-150 hover:scale-[1.05]" style={{ backgroundColor: `${color || "#6366F1"}15`, color: color || "#6366F1" }}>
      {label}
    </span>
  );
}

export function LandingSections() {
  return (
    <div className="space-y-32 md:space-y-48">
      {/* ── Act 2: Capture ── */}
      <motion.section
        id="features"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={sectionVariant}
      >
        <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-center">
          <div>
            <Badge>ACT 1 · CAPTURE</Badge>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-5 leading-tight">
              Add to your brain<br />
              <span className="text-[var(--accent,#6366F1)]">in one click.</span>
            </h2>
            <p className="text-muted-foreground/80 text-base leading-relaxed mb-6">
              Save a resource, write a note, archive a prompt, or start a project — all from the same place. Every vault supports rich metadata, tags, categories, and markdown.
            </p>
            <ul className="space-y-3">
              {["One-click saving with auto-tagging", "Inline editing with live preview", "Cross-vault links and backreferences"].map((item) => (
                <li key={item} className="flex items-center gap-3 text-sm text-muted-foreground/80">
                  <span className="h-1 w-1 rounded-full bg-[var(--accent,#6366F1)]" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <Frame title="DevCache — New Resource">
            <div className="p-5 space-y-4">
              <div className="flex items-center gap-2.5 border-b border-border pb-3.5">
                <div className="flex h-7 w-7 items-center justify-center rounded-md bg-[#6366F1]/10 text-[#6366F1]">
                  <Bookmark className="h-3.5 w-3.5" />
                </div>
                <div>
                  <span className="text-sm font-medium text-foreground">Add Resource</span>
                  <span className="text-[10px] text-muted-foreground/50 ml-2">to your vault</span>
                </div>
              </div>
              <div>
                <p className="text-[11px] font-medium text-muted-foreground/60 mb-1.5">Title</p>
                <div className="flex h-9 w-full rounded-lg border border-border bg-muted/30 px-3 items-center text-sm text-foreground/80">
                  Building a Design System with Tailwind
                </div>
              </div>
              <div>
                <p className="text-[11px] font-medium text-muted-foreground/60 mb-1.5">URL</p>
                <div className="flex h-9 w-full rounded-lg border border-border bg-muted/30 px-3 items-center text-sm text-muted-foreground/60">
                  https://example.com/design-system-tailwind
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-[11px] font-medium text-muted-foreground/60 mb-1.5">Category</p>
                  <div className="flex h-9 w-full rounded-lg border border-border bg-muted/30 px-3 items-center text-sm text-[#14B8A6] capitalize">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c1.1 0 2 .9 2 2z" /></svg>
                    design
                  </div>
                </div>
                <div>
                  <p className="text-[11px] font-medium text-muted-foreground/60 mb-1.5">Tags</p>
                  <div className="flex h-9 w-full rounded-lg border border-border bg-muted/30 px-3 items-center gap-1.5">
                    <TagPill label="css" color="#0C6C99" />
                    <TagPill label="design" color="#C97514" />
                    <span className="text-[10px] text-muted-foreground/40 ml-auto">+1</span>
                  </div>
                </div>
              </div>
              <div>
                <p className="text-[11px] font-medium text-muted-foreground/60 mb-1.5">Why save this?</p>
                <div className="flex h-[52px] w-full rounded-lg border border-border bg-muted/30 p-3 text-sm text-muted-foreground/50">
                  Reference for component architecture and design tokens...
                </div>
              </div>
              <div className="flex items-center gap-2 pt-1">
                <div className="flex h-8 items-center justify-center rounded-lg bg-primary px-4 text-[11px] font-medium text-primary-foreground gap-1.5 transition-all duration-150 hover:scale-[1.03] cursor-pointer">
                  <Plus className="h-3 w-3" />
                  Save to Vault
                </div>
                <div className="flex h-8 items-center rounded-lg border border-border px-3 text-[11px] text-muted-foreground/60 cursor-pointer transition-all duration-150 hover:scale-[1.03]">
                  Cancel
                </div>
              </div>
            </div>
          </Frame>
        </div>
      </motion.section>

      {/* ── Act 3: Connect ── */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={sectionVariant}
      >
        <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-center">
          <div className="md:order-2">
            <Badge>ACT 2 · CONNECT</Badge>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-5 leading-tight">
              Your knowledge<br />
              <span className="text-[#22C55E]">connects itself.</span>
            </h2>
            <p className="text-muted-foreground/80 text-base leading-relaxed mb-6">
              Every item you save automatically links to related content. Tags, backlinks, and cross-vault references weave your knowledge into a web — not a list.
            </p>
            <ul className="space-y-3">
              {["Auto-detected backlinks via title mentions", "Related items by shared tags and categories", "Project-binding: resources, notes, and prompts together"].map((item) => (
                <li key={item} className="flex items-center gap-3 text-sm text-muted-foreground/80">
                  <span className="h-1 w-1 rounded-full bg-[#22C55E]" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="md:order-1">
            <Frame title="DevCache — Knowledge Inspector">
              <div className="flex h-[380px]">
                <div className="w-52 border-r border-border bg-muted/10 p-3.5 flex flex-col gap-1">
                  <div className="text-[10px] font-semibold text-muted-foreground/40 uppercase tracking-[0.12em] mb-1.5 px-1.5">Related Notes</div>
                  {[
                    { title: "Design token strategy", tags: "css, design-tokens" },
                    { title: "Component API patterns", tags: "react, architecture" },
                    { title: "Tailwind theming guide", tags: "css, tailwind" },
                  ].map((n) => (
                    <div key={n.title} className="group flex flex-col rounded-md px-2.5 py-2 text-xs hover:bg-muted/60 transition-all duration-150 hover:scale-[1.02] cursor-pointer border-l-2 border-transparent hover:border-[#22C55E]">
                      <span className="text-foreground/80 group-hover:text-foreground transition-colors">{n.title}</span>
                      <span className="text-[10px] text-muted-foreground/50 mt-0.5">{n.tags}</span>
                    </div>
                  ))}
                  <div className="mt-3 border-t border-border pt-3">
                    <div className="text-[10px] font-semibold text-muted-foreground/40 uppercase tracking-[0.12em] mb-1.5 px-1.5">Backlinks</div>
                    {[
                      { title: "Design system planning", type: "project", color: "#8B5CF6" },
                      { title: "CSS architecture notes", type: "note", color: "#22C55E" },
                    ].map((b) => (
                      <div key={b.title} className="group flex items-center gap-2 rounded-md px-2.5 py-2 text-xs hover:bg-muted/60 transition-all duration-150 hover:scale-[1.02] cursor-pointer">
                        <svg width="6" height="6" viewBox="0 0 6 6"><circle cx="3" cy="3" r="3" fill={b.color} /></svg>
                        <span className="text-muted-foreground/70 group-hover:text-foreground transition-colors">{b.title}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex-1 p-4 space-y-3 overflow-auto">
                  <div className="flex items-center gap-2">
                    <Hash className="h-3.5 w-3.5 text-muted-foreground/40" />
                    <span className="text-sm font-medium text-foreground">Building a Design System with Tailwind</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    <TagPill label="css" color="#0C6C99" />
                    <TagPill label="design" color="#C97514" />
                    <TagPill label="tailwind" color="#6C49B5" />
                  </div>
                  <div className="rounded-lg border border-border bg-muted/20 p-3">
                    <p className="text-xs text-muted-foreground/70 leading-relaxed">
                      This resource covers the fundamentals of building a design system using Tailwind CSS, including design tokens, component APIs, and theming strategies...
                    </p>
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 mb-2">
                      <Link2 className="h-3 w-3 text-muted-foreground/40" />
                      <span className="text-[10px] font-semibold text-muted-foreground/50 uppercase tracking-wider">Connected Items</span>
                    </div>
                    <div className="space-y-1">
                      {[
                        { icon: Bookmark, label: "Tailwind v4 migration guide", color: "#6366F1" },
                        { icon: Sparkles, label: "Generate design token snippets", color: "#F59E0B" },
                        { icon: History, label: "Design system planning", color: "#8B5CF6" },
                      ].map((c) => {
                        const Icon = c.icon;
                        return (
                          <div key={c.label} className="group flex items-center gap-2.5 rounded-md px-2.5 py-1.5 text-xs text-muted-foreground/70 hover:bg-muted/50 transition-all duration-150 hover:scale-[1.02] cursor-pointer">
                            <Icon className="h-3 w-3 shrink-0" style={{ color: c.color }} />
                            <span className="group-hover:text-foreground transition-colors">{c.label}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </Frame>
          </div>
        </div>
      </motion.section>

      {/* ── Act 4: Retrieve ── */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={sectionVariant}
      >
        <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-center">
          <div>
            <Badge>ACT 3 · RETRIEVE</Badge>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-5 leading-tight">
              Find anything,<br />
              <span className="text-[#F59E0B]">instantly.</span>
            </h2>
            <p className="text-muted-foreground/80 text-base leading-relaxed mb-6">
              Press <kbd className="rounded border border-border px-1.5 py-0.5 text-sm font-mono text-foreground/60 mx-1">⌘K</kbd> from anywhere and search across every vault. Fuzzy matching, type filters, and keyboard-first navigation — never touch your mouse.
            </p>
            <ul className="space-y-3">
              {["Global search across all vaults", "Filter by type, tag, or category", "Keyboard nav with arrow keys + enter"].map((item) => (
                <li key={item} className="flex items-center gap-3 text-sm text-muted-foreground/80">
                  <span className="h-1 w-1 rounded-full bg-[#F59E0B]" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <Frame title="DevCache — Search">
            <div className="p-0">
              <div className="flex items-center gap-3 border-b border-border px-4 py-3">
                <Search className="h-4 w-4 text-muted-foreground/40 shrink-0" />
                <input
                  readOnly
                  value="server actions"
                  className="flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground/40"
                />
                <div className="flex items-center gap-1">
                  <kbd className="rounded border border-border/60 px-1.5 py-0.5 text-[10px] text-muted-foreground/50">⌘K</kbd>
                </div>
              </div>
              <div className="p-3 space-y-3">
                <div>
                  <div className="flex items-center gap-2 px-1.5 mb-1.5">
                    <span className="text-[10px] font-semibold text-muted-foreground/50 uppercase tracking-wider">Resources</span>
                    <span className="text-[10px] text-muted-foreground/30">(3)</span>
                  </div>
                  <div className="space-y-0.5">
                    {[
                      { label: "Next.js Server Actions guide", desc: "nextjs.org/docs — Tagged: react, server-actions", color: "#6366F1" },
                      { label: "Server Actions vs API Routes", desc: "Tagged: architecture, comparison", color: "#6366F1" },
                    ].map((r) => (
                      <div key={r.label} className="group flex items-center gap-3 rounded-lg px-2.5 py-2 text-sm hover:bg-muted/60 transition-all duration-150 hover:scale-[1.01] cursor-pointer border-l-2 border-transparent hover:border-[#6366F1]">
                        <Bookmark className="h-3.5 w-3.5 shrink-0" style={{ color: r.color }} />
                        <div className="min-w-0">
                          <div className="text-foreground/80 group-hover:text-foreground transition-colors text-[13px]">{r.label}</div>
                          <div className="text-[10px] text-muted-foreground/50 truncate">{r.desc}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2 px-1.5 mb-1.5">
                    <span className="text-[10px] font-semibold text-muted-foreground/50 uppercase tracking-wider">Prompts</span>
                    <span className="text-[10px] text-muted-foreground/30">(2)</span>
                  </div>
                  <div className="space-y-0.5">
                    {[
                      { label: "Review server action error handling", desc: "Use case: Code review", color: "#F59E0B" },
                      { label: "Generate route handler patterns", desc: "Use case: Scaffolding", color: "#F59E0B" },
                    ].map((p) => (
                      <div key={p.label} className="group flex items-center gap-3 rounded-lg px-2.5 py-2 text-sm hover:bg-muted/60 transition-all duration-150 hover:scale-[1.01] cursor-pointer border-l-2 border-transparent hover:border-[#F59E0B]">
                        <Sparkles className="h-3.5 w-3.5 shrink-0" style={{ color: p.color }} />
                        <div className="min-w-0">
                          <div className="text-foreground/80 group-hover:text-foreground transition-colors text-[13px]">{p.label}</div>
                          <div className="text-[10px] text-muted-foreground/50 truncate">{p.desc}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2 px-1.5 mb-1.5">
                    <span className="text-[10px] font-semibold text-muted-foreground/50 uppercase tracking-wider">Notes</span>
                    <span className="text-[10px] text-muted-foreground/30">(1)</span>
                  </div>
                  <div className="space-y-0.5">
                    <div className="group flex items-center gap-3 rounded-lg px-2.5 py-2 text-sm hover:bg-muted/60 transition-all duration-150 hover:scale-[1.01] cursor-pointer border-l-2 border-transparent hover:border-[#22C55E]">
                      <Bookmark className="h-3.5 w-3.5 shrink-0 text-[#22C55E]" />
                      <div className="min-w-0">
                        <div className="text-foreground/80 group-hover:text-foreground transition-colors text-[13px]">Server Actions architecture notes</div>
                        <div className="text-[10px] text-muted-foreground/50 truncate">react/advanced — 2 tags — Updated yesterday</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Frame>
        </div>
      </motion.section>

      {/* ── Act 5: Rediscover ── */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={sectionVariant}
      >
        <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-center">
          <div className="md:order-2">
            <Badge>ACT 4 · REDISCOVER</Badge>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-5 leading-tight">
              Nothing you save<br />
              <span className="text-[#14B8A6]">stays buried.</span>
            </h2>
            <p className="text-muted-foreground/80 text-base leading-relaxed mb-6">
              DevCache surfaces old items before they fade from memory. A radar discovers fresh open-source repos. Rediscovered brings back forgotten gems. Your knowledge stays alive.
            </p>
            <ul className="space-y-3">
              {["Automatic surfacing of aging items", "Trending repos matched to your stack", "Weekly digests of forgotten knowledge"].map((item) => (
                <li key={item} className="flex items-center gap-3 text-sm text-muted-foreground/80">
                  <span className="h-1 w-1 rounded-full bg-[#14B8A6]" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="md:order-1">
            <Frame title="DevCache — Radar & Rediscovery">
              <div className="p-0">
                <div className="flex items-center gap-2 border-b border-border px-4 py-2.5 bg-muted/10">
                  <RadioIcon className="h-3.5 w-3.5 text-[#14B8A6]" />
                  <span className="text-xs font-medium text-foreground/80">Discovery Feed</span>
                  <span className="text-[10px] text-muted-foreground/40 ml-auto">Updated 2h ago</span>
                </div>
                <div className="space-y-0.5 p-2">
                  {[
                    { title: "shadcn/ui component library", desc: "React component library with Tailwind", tags: ["react", "tailwind", "ui"], saved: "new" },
                    { title: "Rust lifetimes explained simply", desc: "A clear guide to Rust ownership and borrowing", tags: ["rust", "tutorial"], saved: "6mo ago" },
                    { title: "System design interview prep", desc: "Architecture patterns and whiteboard strategies", tags: ["architecture", "career"], saved: "5mo ago" },
                    { title: "Refactor monolith to microservices", desc: "Step-by-step migration strategy", tags: ["architecture", "backend"], saved: "4mo ago" },
                    { title: "Rediscovered: CSS Grid visual guide", desc: "Interactive CSS Grid learning tool", tags: ["css", "layout"], saved: "3mo ago" },
                  ].map((item) => (
                    <div key={item.title} className="group flex items-start gap-3 rounded-lg px-3 py-2.5 hover:bg-muted/40 transition-all duration-150 hover:scale-[1.01] cursor-pointer">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-foreground/80 group-hover:text-foreground transition-colors">{item.title}</span>
                          {item.saved === "new" && (
                            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-semibold uppercase tracking-wider bg-[#14B8A6]/15 text-[#14B8A6] animate-pulse">
                              NEW
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-muted-foreground/60 mt-0.5">{item.desc}</p>
                        <div className="flex items-center gap-1.5 mt-1.5">
                          {item.tags.map((t) => (
                            <span key={t} className="text-[9px] text-muted-foreground/50 bg-muted/60 px-1.5 py-0.5 rounded transition-all duration-150 hover:scale-[1.05]">{t}</span>
                          ))}
                        </div>
                      </div>
                      <div className="shrink-0 text-[10px] text-muted-foreground/40 flex items-center gap-1">
                        {item.saved !== "new" && (
                          <>
                            <History className="h-3 w-3" />
                            {item.saved}
                          </>
                        )}
                        {item.saved === "new" && (
                          <>
                            <ArrowUp className="h-3 w-3 text-[#14B8A6]" />
                            <span className="text-[#14B8A6]">+24</span>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Frame>
          </div>
        </div>
      </motion.section>

      {/* ── Act 6: Trust ── */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={sectionVariant}
      >
        <div className="text-center max-w-3xl mx-auto px-6">
          <Badge>ACT 5 · TRUST</Badge>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-5 leading-tight">
            Built in the open.<br />
            <span className="text-[var(--accent,#6366F1)]">Yours forever.</span>
          </h2>
          <p className="text-muted-foreground/80 text-base leading-relaxed mb-10 max-w-lg mx-auto">
            Fully open source and self-hostable. No vendor lock-in. Your data stays yours, whether you use our cloud or your own server.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link href="/register">
              <Button size="lg" className="h-12 px-7 text-sm gap-2 bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-200 hover:scale-[1.03]">
                Start Building
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="https://github.com/chintu79/devs_second_brain">
              <Button variant="outline" size="lg" className="h-12 px-7 text-sm gap-2 border-border/60 text-muted-foreground/80 hover:text-foreground hover:border-border transition-all duration-200 hover:scale-[1.03]">
                <GitFork className="h-4 w-4" />
                View on GitHub
              </Button>
            </Link>
          </div>
        </div>
      </motion.section>
    </div>
  );
}
