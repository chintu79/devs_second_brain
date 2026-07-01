"use client";

import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Search, Command } from "lucide-react";
import { Button } from "@devventory/ui";
import { ease } from "@devventory/motion";

function Mockup() {
  return (
    <div className="relative mx-auto max-w-5xl">
      <div className="absolute -inset-8 bg-gradient-to-b from-[#6366F1]/5 via-transparent to-transparent blur-3xl pointer-events-none" />
      <div className="relative rounded-xl border border-border bg-card shadow-2xl shadow-[var(--shadow-elevated)] overflow-hidden">
        <div className="flex items-center gap-3 border-b border-border px-4 py-3.5 bg-secondary/30">
          <div className="flex items-center gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-[#EF4444]" />
            <div className="h-2.5 w-2.5 rounded-full bg-[#EAB308]" />
            <div className="h-2.5 w-2.5 rounded-full bg-[#22C55E]" />
          </div>
          <div className="flex-1 text-center">
            <span className="text-xs text-muted-foreground/50 font-medium tracking-tight">DevCache — workspace</span>
          </div>
        </div>
        <div className="flex h-[520px]">
          <div className="flex w-11 flex-col items-center gap-3 border-r border-border bg-secondary/50 py-3">
            {["bookmark", "sparkles", "sticky-note", "folder-kanban", "radio"].map((icon, i) => {
              const icons: Record<string, React.ReactNode> = {
                "bookmark": <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" /></svg>,
                "sparkles": <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3l1.5 5.5L19 10l-5.5 1.5L12 17l-1.5-5.5L5 10l5.5-1.5z" /><path d="M18 14l1 2.5 2.5 1-2.5 1L18 21l-1-2.5L14.5 17l2.5-1z" /></svg>,
                "sticky-note": <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /></svg>,
                "folder-kanban": <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c1.1 0 2 .9 2 2z" /></svg>,
                "radio": <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="2" /><path d="M16.24 7.76a6 6 0 0 1 0 8.49m-8.48-.01a6 6 0 0 1 0-8.49m11.31-2.82a10 10 0 0 1 0 14.14m-14.14 0a10 10 0 0 1 0-14.14" /></svg>,
              };
              return (
                <div key={icon} className={`flex h-7 w-7 items-center justify-center rounded-lg transition-colors hover:bg-muted cursor-pointer ${i === 0 ? "text-primary" : "text-muted-foreground"}`}>
                  {icons[icon]}
                </div>
              );
            })}
          </div>
          <div className="w-56 border-r border-border bg-muted/20 p-3.5 flex flex-col gap-px">
            <div className="text-[10px] font-semibold text-muted-foreground/40 uppercase tracking-[0.12em] mb-2 px-1.5">Vaults</div>
            {[
              { name: "Resources", count: 24, active: false },
              { name: "Prompts", count: 18, active: false },
              { name: "Notes", count: 31, active: true },
              { name: "Projects", count: 7, active: false },
            ].map((v) => (
              <div key={v.name} className={`flex items-center justify-between rounded-md px-2 py-[7px] text-xs transition-colors ${v.active ? "bg-[#6366F1]/8 text-primary font-medium" : "text-muted-foreground hover:text-foreground hover:bg-muted"}`}>
                <span>{v.name}</span>
                <span className="text-[10px] text-muted-foreground/40">{v.count}</span>
              </div>
            ))}
            <div className="mt-4 border-t border-border pt-3.5">
              <div className="text-[10px] font-semibold text-muted-foreground/40 uppercase tracking-[0.12em] mb-2.5 px-1.5">Recent</div>
              {[
                { name: "useEffect deep dive", type: "note" },
                { name: "API prompt collection", type: "prompt" },
                { name: "Server actions guide", type: "resource" },
              ].map((f) => (
                <div key={f.name} className="flex items-center gap-2.5 rounded-md px-2 py-[7px] text-xs text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer">
                  <svg width="6" height="6" viewBox="0 0 6 6" className={`shrink-0 ${f.type === "note" ? "fill-primary" : f.type === "prompt" ? "fill-[#22C55E]" : "fill-[#F59E0B]"}`}><circle cx="3" cy="3" r="3" /></svg>
                  <span className="truncate">{f.name}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="flex items-center gap-2.5 border-b border-border px-4 py-2.5 bg-muted/10">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground/40 shrink-0"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
              <span className="text-sm text-foreground/80">useEffect</span>
              <div className="ml-auto flex items-center gap-1">
                <kbd className="rounded border border-border px-1.5 py-0.5 text-[10px] text-muted-foreground/50">⌘K</kbd>
              </div>
            </div>
            <div className="flex-1 overflow-auto p-4 space-y-5">
              {[{ title: "Resources", count: 3, icon: "link" }, { title: "Prompts", count: 2, icon: "message" }, { title: "Notes", count: 1, icon: "doc" }].map((g) => (
                <div key={g.title}>
                  <div className="flex items-center gap-2 mb-2.5 px-0.5">
                    <span className="text-[11px] font-semibold text-muted-foreground/70">{g.title}</span>
                    <span className="text-[10px] text-muted-foreground/30">({g.count})</span>
                  </div>
                  <div className="space-y-px">
                    {g.title === "Resources" && <>
                      <div className="group flex items-center gap-3 rounded-lg px-3 py-2 text-sm hover:bg-muted/60 transition-all cursor-pointer"><div className="shrink-0 text-muted-foreground/40"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /></svg></div><div className="min-w-0"><div className="text-foreground/80 group-hover:text-foreground transition-colors text-[13px]">Using useEffect in React</div><div className="text-[11px] text-muted-foreground/50 mt-px truncate">react.dev — Tagged: react, hooks, effects</div></div></div>
                      <div className="group flex items-center gap-3 rounded-lg px-3 py-2 text-sm hover:bg-muted/60 transition-all cursor-pointer"><div className="shrink-0 text-muted-foreground/40"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /></svg></div><div className="min-w-0"><div className="text-foreground/80 group-hover:text-foreground transition-colors text-[13px]">React hooks cheatsheet</div><div className="text-[11px] text-muted-foreground/50 mt-px truncate">dev.to — Tagged: react, cheatsheet</div></div></div>
                      <div className="group flex items-center gap-3 rounded-lg px-3 py-2 text-sm hover:bg-muted/60 transition-all cursor-pointer"><div className="shrink-0 text-muted-foreground/40"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /></svg></div><div className="min-w-0"><div className="text-foreground/80 group-hover:text-foreground transition-colors text-[13px]">Effect cleanup patterns</div><div className="text-[11px] text-muted-foreground/50 mt-px truncate">overreacted.io — Tagged: react, patterns</div></div></div>
                    </>}
                    {g.title === "Prompts" && <>
                      <div className="group flex items-center gap-3 rounded-lg px-3 py-2 text-sm hover:bg-muted/60 transition-all cursor-pointer"><div className="shrink-0 text-muted-foreground/40"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg></div><div className="min-w-0"><div className="text-foreground/80 group-hover:text-foreground transition-colors text-[13px]">Refactor useEffect to custom hook</div><div className="text-[11px] text-muted-foreground/50 mt-px truncate">Use case: Code review — 2 days ago</div></div></div>
                      <div className="group flex items-center gap-3 rounded-lg px-3 py-2 text-sm hover:bg-muted/60 transition-all cursor-pointer"><div className="shrink-0 text-muted-foreground/40"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg></div><div className="min-w-0"><div className="text-foreground/80 group-hover:text-foreground transition-colors text-[13px]">Generate JSDoc for useEffect</div><div className="text-[11px] text-muted-foreground/50 mt-px truncate">Use case: Documentation — 1 week ago</div></div></div>
                    </>}
                    {g.title === "Notes" && <>
                      <div className="group flex items-center gap-3 rounded-lg px-3 py-2 text-sm hover:bg-muted/60 transition-all cursor-pointer"><div className="shrink-0 text-muted-foreground/40"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" /></svg></div><div className="min-w-0"><div className="text-foreground/80 group-hover:text-foreground transition-colors text-[13px]">useEffect deep dive notes</div><div className="text-[11px] text-muted-foreground/50 mt-px truncate">react/advanced — 3 tags — Updated yesterday</div></div></div>
                    </>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const CHAR_STAGGER = 0.1;
const CHAR_DURATION = 0.7;
const LETTER_START_DELAY = 0.3;
const HEADING_TEXT = "Don't lose anything.";
const HEADING_END = LETTER_START_DELAY + (HEADING_TEXT.length - 1) * CHAR_STAGGER + CHAR_DURATION;
const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as [number, number, number, number];

function LetterReveal({ text }: { text: string }) {
  const prefersReduced = useReducedMotion();
  if (prefersReduced) return <>{text}</>;
  return (
    <>
      {text.split("").map((char, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 14, filter: "blur(4px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: CHAR_DURATION, delay: LETTER_START_DELAY + i * CHAR_STAGGER, ease: EASE_OUT_EXPO }}
          className="inline-block"
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </>
  );
}

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.15 } },
};

const childVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1, y: 0,
    transition: { duration: 0.5, ease: ease.decelerate },
  },
};

const mockupVariants = {
  hidden: { opacity: 0, y: 32, scale: 0.98 },
  visible: {
    opacity: 1, y: 0, scale: 1,
    transition: { duration: 0.6, delay: 0.5, ease: ease.decelerate },
  },
};

export function HeroEntrance() {
  return (
    <motion.div
      className="mx-auto max-w-6xl px-6 text-center"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={childVariants}>
        <div className="inline-flex items-center rounded-full border border-border bg-muted/40 px-4 py-1.5 text-xs font-medium text-muted-foreground/80 mb-10">
          Your developer knowledge cache.
        </div>
      </motion.div>

      <motion.div>
        <h1 className="text-[clamp(2.8rem,7vw,5.5rem)] font-bold tracking-[-0.03em] leading-[1.04] mb-4 max-w-4xl mx-auto">
          <LetterReveal text={HEADING_TEXT} />
        </h1>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: HEADING_END + 0.5, ease: EASE_OUT_EXPO }}
      >
        <p className="text-[clamp(1.5rem,3.5vw,2.8rem)] font-bold tracking-[-0.02em] leading-[1.1] bg-gradient-to-r from-primary via-[#8B5CF6] to-[#06B6D4] bg-clip-text text-transparent animate-text-gradient">
          Store your important resources forever.
        </p>
      </motion.div>

      <motion.div variants={childVariants}>
        <p className="text-muted-foreground/80 text-[17px] md:text-lg max-w-2xl mx-auto mb-8 leading-relaxed">
          Save DSA questions, coding notes, interview experiences, prompts, useful resources, project ideas, and bookmarks in one secure place. Find everything instantly whenever you need it.
        </p>
      </motion.div>

      <motion.div variants={childVariants}>
        <div className="inline-flex items-center gap-2.5 rounded-full border border-[#6366F1]/20 bg-[#6366F1]/5 px-4 py-2 text-sm text-muted-foreground/80 shadow-[0_0_20px_-8px_rgba(99,102,241,0.3)] backdrop-blur-sm mb-10 transition-all duration-300 hover:border-[#6366F1]/30 hover:shadow-[0_0_24px_-8px_rgba(99,102,241,0.4)]">
          <Search className="h-3.5 w-3.5 text-[#6366F1]" />
          <span>Press</span>
          <kbd className="flex items-center gap-0.5 rounded-md border border-white/10 bg-white/5 px-1.5 py-0.5 text-[12px] font-medium text-foreground/80">
            <Command className="h-3 w-3" />
          </kbd>
          <span className="text-muted-foreground/50">+</span>
          <kbd className="rounded-md border border-white/10 bg-white/5 px-1.5 py-0.5 text-[12px] font-medium text-foreground/80">K</kbd>
          <span className="hidden sm:inline">to search everything instantly</span>
          <span className="sm:hidden">to search</span>
        </div>
      </motion.div>

      <motion.div variants={childVariants}>
        <div className="flex items-center justify-center gap-4">
          <Link href="/register">
            <Button size="lg" className="h-12 px-7 text-sm gap-2 bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white shadow-lg shadow-[#6366F1]/25 hover:shadow-[#6366F1]/50 hover:shadow-xl transition-all duration-300 hover:scale-[1.03]">
              Get Started
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link href="#features">
            <Button variant="outline" size="lg" className="h-12 px-7 text-sm border-border/60 text-muted-foreground/80 hover:text-foreground hover:border-border transition-all duration-300 hover:scale-[1.03] hover:shadow-lg">
              See how it works
            </Button>
          </Link>
        </div>
      </motion.div>

      <motion.div variants={mockupVariants} className="mt-16 md:mt-20">
        <div className="mx-auto max-w-6xl px-6">
          <Mockup />
        </div>
      </motion.div>
    </motion.div>
  );
}
