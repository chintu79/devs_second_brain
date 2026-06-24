import Link from "next/link";
import { Bookmark, Sparkles, StickyNote, FolderKanban, Radio, History, GitFork, ArrowRight, Search, Layers, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FadeIn } from "@/components/landing/fade-in";
import { HeroEntrance } from "@/components/landing/hero-entrance";
import { AnimatedArrow } from "@/components/landing/animated-arrow";
import { ThemeToggle } from "@/components/theme/theme-toggle";

const features = [
  { icon: Bookmark, title: "Resource Vault", desc: "Save useful links, articles, and dev tools. Extract key insights and tag them for later uses." },
  { icon: Sparkles, title: "Prompt Vault", desc: "Store reusable AI prompts. Organize by use case — code review, debugging, documentation, and more." },
  { icon: StickyNote, title: "Notes Vault", desc: "Write rich markdown notes with automatic tagging. Full-text search across every word you write." },
  { icon: FolderKanban, title: "Project Vault", desc: "Track ideas from concept to completion. Each project gets its own PLAN.md and resource board." },
  { icon: Radio, title: "Open Source Radar", desc: "Discover trending repos, AI projects, and good first issues. Never miss what matters in your stack." },
  { icon: History, title: "Forgotten Gems", desc: "Surface old saved items before you lose them. Intelligent rediscovery based on age and relevance." },
];

const workflowSteps = [
  { icon: Eye, label: "Discover" },
  { icon: Bookmark, label: "Save" },
  { icon: Layers, label: "Organize" },
  { icon: Search, label: "Search" },
  { icon: History, label: "Rediscover" },
];

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground selection:bg-primary/30">
      {/* ── Navigation ── */}
      <nav className="sticky top-0 z-50 border-b border-border/50 bg-background/70 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary transition-transform duration-200 group-hover:scale-105">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 3a6 6 0 0 0-6 6v2.5c0 3.5 2 6.5 6 8.5 4-2 6-5 6-8.5V9a6 6 0 0 0-6-6z" />
              </svg>
            </div>
            <span className="text-sm font-semibold tracking-tight">Dev Second Brain</span>
          </Link>
          <div className="hidden md:flex items-center gap-1">
            {["Features", "Open Source", "Pricing", "Docs"].map((link) => (
              <Link
                key={link}
                href="#"
                className="relative px-3 py-1.5 text-sm text-muted-foreground/80 hover:text-foreground transition-all duration-200 rounded-md hover:bg-muted/60 hover:scale-[1.03]"
              >
                {link}
              </Link>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link href="/login">
              <Button variant="ghost" className="text-sm text-muted-foreground/80 hover:text-foreground h-9 transition-all duration-200 hover:bg-muted/60 hover:scale-[1.03]">
                Sign in
              </Button>
            </Link>
            <Link href="/register">
              <Button className="text-sm h-9 px-4 bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_0_0_1px_rgba(99,102,241,0.3)] hover:shadow-[0_0_0_2px_rgba(99,102,241,0.4)] transition-all duration-200">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <main>
        {/* ── Hero ── */}
        <section className="relative pt-24 pb-20 md:pt-36 md:pb-28 overflow-hidden">
          {/* Subtle ambient gradient */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-gradient-to-b from-primary/3 via-transparent to-transparent pointer-events-none" />
          <HeroEntrance />
        </section>

        {/* ── Features ── */}
        <section id="features" className="py-24 md:py-32">
          <div className="mx-auto max-w-6xl px-6">
            <FadeIn>
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Everything a developer needs</h2>
                <p className="text-muted-foreground/70 text-base max-w-sm mx-auto leading-relaxed">Six vaults working together as one unified memory system.</p>
              </div>
            </FadeIn>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {features.map((f, i) => {
                const Icon = f.icon;
                return (
                  <FadeIn key={f.title} delay={i * 60}>
                    <div className="group rounded-xl border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-0.5 hover:scale-[1.02] hover:border-[var(--border-hover)] hover:shadow-[var(--shadow-elevated)]">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted group-hover:bg-primary/10 transition-all duration-300 mb-4 animate-icon-glow">
                        <Icon className="h-[18px] w-[18px] text-muted-foreground/60 group-hover:text-primary transition-colors duration-300" />
                      </div>
                      <h3 className="text-sm font-semibold mb-2">{f.title}</h3>
                      <p className="text-sm text-muted-foreground/70 leading-relaxed">{f.desc}</p>
                    </div>
                  </FadeIn>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── Product Showcase ── */}
        <section className="pb-24 md:pb-32">
          <div className="mx-auto max-w-6xl px-6 space-y-24 md:space-y-32">
            {/* Capture Everything */}
            <FadeIn>
              <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-center">
                <div>
                  <h2 className="text-2xl md:text-4xl font-bold tracking-tight mb-5">Capture everything</h2>
                  <p className="text-muted-foreground/70 text-base leading-relaxed mb-6">
                    Save resources, prompts, notes, and project ideas from anywhere. Every vault supports rich metadata — tags, categories, markdown, and links.
                  </p>
                  <ul className="space-y-3">
                    {["One-click saving with auto-tagging", "Inline markdown editing with preview", "Categorize and cross-link across vaults"].map((item) => (
                      <li key={item} className="flex items-center gap-3 text-sm text-muted-foreground/80">
                        <span className="h-1 w-1 rounded-full bg-primary" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-xl border border-border bg-card p-5 shadow-[var(--shadow-elevated)]">
                  <div className="flex items-center gap-2.5 border-b border-border pb-3.5 mb-3.5">
                    <div className="flex gap-1">
                      <div className="h-2 w-2 rounded-full bg-destructive/80" />
                      <div className="h-2 w-2 rounded-full bg-warning/80" />
                      <div className="h-2 w-2 rounded-full bg-success/80" />
                    </div>
                    <span className="text-xs text-muted-foreground/50 ml-2">New Resource — Vite docs</span>
                  </div>
                  <div className="space-y-3">
                    <div className="h-[10px] w-3/4 rounded bg-muted/60" />
                    <div className="h-[10px] w-1/2 rounded bg-muted/60" />
                    <div className="h-[6px] w-full rounded bg-muted/30" />
                    <div className="h-[6px] w-5/6 rounded bg-muted/30" />
                    <div className="flex gap-2 pt-2">
                      <span className="px-3 py-1 text-[11px] rounded-full bg-muted/50 text-muted-foreground/60">react</span>
                      <span className="px-3 py-1 text-[11px] rounded-full bg-muted/50 text-muted-foreground/60">vite</span>
                      <span className="px-3 py-1 text-[11px] rounded-full bg-muted/50 text-muted-foreground/60">tooling</span>
                    </div>
                  </div>
                </div>
              </div>
            </FadeIn>

            {/* Find Anything */}
            <FadeIn>
              <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-center">
                <div className="md:order-2">
                  <h2 className="text-2xl md:text-4xl font-bold tracking-tight mb-5">Find anything, instantly</h2>
                  <p className="text-muted-foreground/70 text-base leading-relaxed mb-6">
                    Global search across every vault with keyboard-first navigation. Press CMD+K from anywhere and jump to any saved item in seconds.
                  </p>
                  <ul className="space-y-3">
                    {["Full-text search with fuzzy matching", "Filter by vault, tag, or category", "Keyboard-first: never touch your mouse"].map((item) => (
                      <li key={item} className="flex items-center gap-3 text-sm text-muted-foreground/80">
                        <span className="h-1 w-1 rounded-full bg-primary" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="md:order-1 rounded-xl border border-border bg-card p-5 shadow-[var(--shadow-elevated)]">
                  <div className="flex items-center gap-3 border-b border-border pb-3.5 mb-3.5">
                    <div className="flex h-7 w-7 items-center justify-center rounded-md bg-muted">
                      <Search className="h-3.5 w-3.5 text-muted-foreground/60" />
                    </div>
                    <span className="text-sm text-muted-foreground/70">
                      Searching for <span className="text-foreground font-medium">server actions</span>
                    </span>
                    <div className="ml-auto flex gap-1">
                      <kbd className="rounded border border-border/60 px-1.5 py-[2px] text-[10px] text-muted-foreground/50">⌘K</kbd>
                    </div>
                  </div>
                  <div className="space-y-px">
                    {[
                      { icon: Bookmark, label: "Next.js Server Actions guide" },
                      { icon: Bookmark, label: "Server Actions vs API Routes" },
                      { icon: Bookmark, label: "Form handling with Server Actions" },
                    ].map((item) => {
                      const Icon = item.icon;
                      return (
                        <div key={item.label} className="flex items-center gap-3 rounded-md px-2.5 py-2 text-sm text-muted-foreground/70 hover:bg-muted/40 transition-colors cursor-pointer">
                          <Icon className="h-3.5 w-3.5 shrink-0" />
                          {item.label}
                        </div>
                      );
                    })}
                    <div className="flex items-center gap-3 rounded-md px-2.5 py-2 text-sm text-muted-foreground/70 hover:bg-muted/40 transition-colors cursor-pointer">
                      <Sparkles className="h-3.5 w-3.5 shrink-0" />
                      Debug server action errors — prompt
                    </div>
                    <div className="flex items-center gap-3 rounded-md px-2.5 py-2 text-sm text-muted-foreground/70 hover:bg-muted/40 transition-colors cursor-pointer">
                      <StickyNote className="h-3.5 w-3.5 shrink-0" />
                      Server Actions architecture notes
                    </div>
                  </div>
                </div>
              </div>
            </FadeIn>

            {/* Rediscover Knowledge */}
            <FadeIn>
              <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-center">
                <div>
                  <h2 className="text-2xl md:text-4xl font-bold tracking-tight mb-5">Rediscover what matters</h2>
                  <p className="text-muted-foreground/70 text-base leading-relaxed mb-6">
                    Forgotten Gems surfaces old saved items before they disappear from your memory. Intelligent algorithms resurface content based on how long it has been since you last viewed it.
                  </p>
                  <ul className="space-y-3">
                    {["Automatic rediscovery of aging items", "Smart prioritization by relevance", "Weekly digests of forgotten knowledge"].map((item) => (
                      <li key={item} className="flex items-center gap-3 text-sm text-muted-foreground/80">
                        <span className="h-1 w-1 rounded-full bg-primary" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-xl border border-border bg-card p-5 shadow-[var(--shadow-elevated)]">
                  <div className="flex items-center gap-2.5 border-b border-border pb-3.5 mb-3.5">
                    <History className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">Forgotten Gems</span>
                    <span className="text-[10px] text-muted-foreground/50 ml-auto">3 items surfacing today</span>
                  </div>
                  <div className="space-y-1">
                    {[
                      { title: "Rust lifetimes explained", age: "6 months ago" },
                      { title: "Refactor monolith to microservices — prompt", age: "4 months ago" },
                      { title: "System design interview notes", age: "5 months ago" },
                    ].map((item) => (
                      <div key={item.title} className="group flex items-center justify-between rounded-lg px-3 py-2 hover:bg-muted/40 transition-all cursor-pointer">
                        <div className="text-sm text-foreground/70 group-hover:text-foreground transition-colors">{item.title}</div>
                        <div className="text-[10px] text-muted-foreground/40 shrink-0 ml-3">{item.age}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>
        </section>

        {/* ── Developer Workflow ── */}
        <section className="border-t border-border/50 py-24 md:py-32">
          <div className="mx-auto max-w-5xl px-6 text-center">
            <FadeIn>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">How it works</h2>
              <p className="text-muted-foreground/70 text-base mb-16 max-w-sm mx-auto leading-relaxed">A continuous loop for your developer knowledge.</p>
            </FadeIn>
            <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-0">
              {workflowSteps.map((step, i) => {
                const Icon = step.icon;
                return (
                  <FadeIn key={step.label} delay={i * 80} className="flex items-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:scale-[1.05] hover:border-[var(--border-hover)] hover:shadow-[var(--shadow-elevated)] hover:bg-primary/[0.03]">
                        <Icon className="h-6 w-6 text-muted-foreground/60" />
                      </div>
                      <span className="text-sm font-semibold text-muted-foreground/80">{step.label}</span>
                    </div>
                    {i < workflowSteps.length - 1 && (
                      <>
                        <div className="hidden md:flex items-center px-8">
                          <AnimatedArrow />
                        </div>
                        <div className="flex md:hidden py-2">
                          <AnimatedArrow mobile />
                        </div>
                      </>
                    )}
                  </FadeIn>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── Open Source ── */}
        <section className="py-24 md:py-32">
          <div className="mx-auto max-w-3xl px-6 text-center">
            <FadeIn>
              <div className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted/40 px-4 py-1.5 text-xs font-medium text-muted-foreground/80 mb-6">
                <GitFork className="h-3 w-3" />
                Open Source
              </div>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Built in the open</h2>
              <p className="text-muted-foreground/70 text-base max-w-lg mx-auto leading-relaxed">
                Fully open source and self-hostable. No vendor lock-in. Your data stays yours. Contributions and feedback are welcome.
              </p>
              <div className="flex items-center justify-center gap-3 mt-10">
                <Link href="https://github.com">
                  <Button variant="outline" className="h-10 px-5 text-sm gap-2 border-border/60 text-muted-foreground/80 hover:text-foreground hover:border-border transition-all duration-200">
                    <GitFork className="h-4 w-4" />
                    View on GitHub
                  </Button>
                </Link>
                <Link href="/docs">
                  <Button variant="ghost" className="h-10 px-5 text-sm text-muted-foreground/70 hover:text-foreground transition-all duration-200">
                    Read the docs
                  </Button>
                </Link>
              </div>
            </FadeIn>
          </div>
        </section>

        {/* ── Final CTA ── */}
        <section className="border-t border-border/50 py-24 md:py-32">
          <div className="mx-auto max-w-3xl px-6 text-center">
            <FadeIn>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-5">Stop losing valuable developer knowledge.</h2>
              <p className="text-muted-foreground/70 text-base mb-10 max-w-sm mx-auto leading-relaxed">Build your personal memory system today. It&apos;s free for solo developers.</p>
              <div className="flex items-center justify-center gap-4">
                <Link href="/register">
                  <Button size="lg" className="h-12 px-7 text-sm gap-2 bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-200">
                    Get Started
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="https://github.com">
                  <Button variant="outline" size="lg" className="h-12 px-7 text-sm gap-2 border-border/60 text-muted-foreground/80 hover:text-foreground hover:border-border transition-all duration-200">
                    <GitFork className="h-4 w-4" />
                    View GitHub
                  </Button>
                </Link>
              </div>
            </FadeIn>
          </div>
        </section>
      </main>

      {/* ── Footer ── */}
      <footer className="border-t border-border/50 py-12">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2.5">
              <div className="flex h-6 w-6 items-center justify-center rounded bg-primary/90">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 3a6 6 0 0 0-6 6v2.5c0 3.5 2 6.5 6 8.5 4-2 6-5 6-8.5V9a6 6 0 0 0-6-6z" />
                </svg>
              </div>
              <span className="text-xs text-muted-foreground/60">Dev Second Brain</span>
            </div>
            <div className="flex items-center gap-6 text-xs text-muted-foreground/60">
              <Link href="#" className="hover:text-foreground/80 transition-colors duration-200">Documentation</Link>
              <Link href="https://github.com" className="hover:text-foreground/80 transition-colors duration-200">GitHub</Link>
              <Link href="#" className="hover:text-foreground/80 transition-colors duration-200">Privacy</Link>
              <Link href="#" className="hover:text-foreground/80 transition-colors duration-200">Terms</Link>
              <Link href="#" className="hover:text-foreground/80 transition-colors duration-200">Contact</Link>
            </div>
          </div>
          <div className="mt-8 text-center text-[11px] text-muted-foreground/40">
            &copy; {new Date().getFullYear()} Dev Second Brain. Open source. Self-hostable. Built for developers.
          </div>
        </div>
      </footer>
    </div>
  );
}
