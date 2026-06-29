import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { HeroEntrance } from "@/components/landing/hero-entrance";
import { LandingSections } from "@/components/landing/landing-sections";
import { Navbar } from "@/components/landing/navbar";

export default async function LandingPage() {
  const session = await auth();
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground selection:bg-primary/30">
      <Navbar session={session} />

      <main>
        {/* ── Hero ── */}
        <section className="relative pt-24 pb-20 md:pt-36 md:pb-28 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-gradient-to-b from-primary/3 via-transparent to-transparent pointer-events-none" />
          <HeroEntrance />
        </section>

        {/* ── Story Sections (Capture → Connect → Retrieve → Rediscover → Trust) ── */}
        <section className="pb-24 md:pb-32">
          <div className="mx-auto max-w-6xl px-6">
            <LandingSections />
          </div>
        </section>
      </main>

      {/* ── Footer ── */}
      <footer className="border-t border-border/50 py-12">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2.5">
              <div className="flex h-6 w-6 items-center justify-center rounded bg-primary/90">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" className="stroke-white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M12 3a6 6 0 0 0-6 6v2.5c0 3.5 2 6.5 6 8.5 4-2 6-5 6-8.5V9a6 6 0 0 0-6-6z" />
                </svg>
              </div>
              <span className="text-xs text-muted-foreground/60">DevCache</span>
            </div>
            <div className="flex items-center gap-6 text-xs text-muted-foreground/60">
              <Link href="/setup" className="hover:text-foreground/80 hover:scale-[1.02] transition-all duration-150">Setup</Link>
              <Link href="https://github.com/chintu79/devs_second_brain" className="hover:text-foreground/80 hover:scale-[1.02] transition-all duration-150">GitHub</Link>
              <span className="text-muted-foreground/60 select-none">Privacy</span>
              <span className="text-muted-foreground/60 select-none">Terms</span>
            </div>
          </div>
          <div className="mt-8 text-center text-[11px] text-muted-foreground/40">
            &copy; {new Date().getFullYear()} DevCache. Built by <Link href="https://github.com/chintu79" className="hover:text-foreground/80 hover:scale-[1.02] transition-all duration-150 underline underline-offset-2">chintu79</Link>. Open source. Self-hostable.
          </div>
        </div>
      </footer>
    </div>
  );
}
