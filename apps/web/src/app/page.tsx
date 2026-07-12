import Link from "next/link";
import { auth } from "@/lib/auth";
import { Navbar } from "@/components/landing/navbar";
import { HeroEntrance } from "@/components/landing/hero-entrance";
import { ProblemSection } from "@/components/landing/problem-section";
import { SolutionFlow } from "@/components/landing/solution-flow";
import { Showcase } from "@/components/landing/showcase";
import { Features } from "@/components/landing/features";
import { WhySection } from "@/components/landing/why-section";
import { CTASection } from "@/components/landing/cta-section";
import { ScrollProgress } from "@/components/landing/scroll-progress";

export default async function LandingPage() {
  const session = await auth();

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground selection:bg-primary/30">
      <ScrollProgress />
      <Navbar session={session} />

      {/* Skip to content */}
      <a href="#problem-section" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-card focus:text-foreground focus:border focus:border-border focus:rounded-lg focus:text-sm focus:font-medium">
        Skip to content
      </a>

      <main className="flex-1">
        <section className="relative min-h-[calc(100vh-3.5rem)] flex items-center justify-center overflow-hidden">
          <HeroEntrance />
        </section>
        <ProblemSection />
        <SolutionFlow />
        <Showcase />
        <Features />
        <WhySection />
        <CTASection />
      </main>

      <footer className="border-t border-border/40 py-8">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded bg-gradient-to-br from-[#6366F1] to-[#6366F1]">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" className="stroke-white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M12 3a6 6 0 0 0-6 6v2.5c0 3.5 2 6.5 6 8.5 4-2 6-5 6-8.5V9a6 6 0 0 0-6-6z" />
                </svg>
              </div>
              <span className="text-xs text-muted-foreground/50">Devventory</span>
            </Link>
            <div className="flex items-center gap-6 text-xs text-muted-foreground/50">
              <a href="https://github.com/chintu79/devs_second_brain" target="_blank" rel="noopener noreferrer" className="hover:text-foreground/80 transition-all duration-150">GitHub</a>
            </div>
          </div>
          <div className="mt-6 text-center text-[11px] text-muted-foreground/40">
            &copy; {new Date().getFullYear()} Devventory. Open source.
          </div>
        </div>
      </footer>
    </div>
  );
}
