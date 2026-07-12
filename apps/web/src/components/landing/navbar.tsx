"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@devventory/ui";
import { ThemeToggle } from "@/components/theme/theme-toggle";

export function Navbar({ session }: { session: { user?: { name?: string | null; email?: string | null } } | null }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (mobileOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 border-b border-border/40 transition-all duration-200 ${
        scrolled ? "bg-background/90 backdrop-blur-lg h-12" : "bg-background/60 backdrop-blur-sm h-14"
      }`}
    >
      <div className="mx-auto max-w-6xl px-6 h-full flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <div className={`flex items-center justify-center rounded-lg bg-gradient-to-br from-[#6366F1] to-[#6366F1] transition-all duration-200 ${
            scrolled ? "h-6 w-6" : "h-7 w-7"
          }`}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" className="stroke-white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M12 3a6 6 0 0 0-6 6v2.5c0 3.5 2 6.5 6 8.5 4-2 6-5 6-8.5V9a6 6 0 0 0-6-6z" />
            </svg>
          </div>
          <span className="font-bold tracking-tight text-sm">
            Devventory
          </span>
        </Link>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-4 mr-2">
            <Link href="https://github.com/chintu79/devs_second_brain" className="text-xs text-muted-foreground/60 hover:text-foreground/80 transition-all duration-150">
              GitHub
            </Link>
            <Link href="/docs" className="text-xs text-muted-foreground/60 hover:text-foreground/80 transition-all duration-150">
              Docs
            </Link>
          </div>
          <div className="hidden md:flex items-center gap-2">
            <ThemeToggle />
            {session ? (
              <Link href="/knowledge">
                <Button className="text-xs font-semibold h-8 px-4 rounded-lg bg-gradient-to-r from-[#6366F1] to-[#6366F1] text-white shadow-lg shadow-[#6366F1]/25 hover:shadow-[#6366F1]/50 transition-all">
                  Open App
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" className="text-xs font-medium h-8 px-3 rounded-lg">
                    Sign in
                  </Button>
                </Link>
                <Link href="/register">
                  <Button className="text-xs font-semibold h-8 px-4 rounded-lg bg-gradient-to-r from-[#6366F1] to-[#6366F1] text-white shadow-lg shadow-[#6366F1]/25 hover:shadow-[#6366F1]/50 transition-all">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>
          <div className="flex md:hidden items-center gap-2">
            <ThemeToggle />
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="flex h-11 w-11 items-center justify-center rounded-md hover:bg-muted/30 transition-colors"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-foreground/70">
                {mobileOpen ? (
                  <>
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </>
                ) : (
                  <>
                    <line x1="3" y1="6" x2="21" y2="6" />
                    <line x1="3" y1="12" x2="21" y2="12" />
                    <line x1="3" y1="18" x2="21" y2="18" />
                  </>
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border/40 bg-background/95 backdrop-blur-lg">
          <div className="px-6 py-4 space-y-3">
            <Link
              href="https://github.com/chintu79/devs_second_brain"
              onClick={() => setMobileOpen(false)}
              className="block text-sm text-muted-foreground/70 hover:text-foreground transition-colors"
            >
              GitHub
            </Link>
            <Link
              href="/docs"
              onClick={() => setMobileOpen(false)}
              className="block text-sm text-muted-foreground/70 hover:text-foreground transition-colors"
            >
              Docs
            </Link>
            <div className="pt-2 border-t border-border/40 flex flex-col gap-2">
              {session ? (
                <Link href="/knowledge" onClick={() => setMobileOpen(false)}>
                  <Button className="w-full text-xs font-semibold h-9 bg-gradient-to-r from-[#6366F1] to-[#6366F1] text-white shadow-lg shadow-[#6366F1]/25">
                    Open App
                  </Button>
                </Link>
              ) : (
                <>
                  <Link href="/login" onClick={() => setMobileOpen(false)}>
                    <Button variant="outline" className="w-full text-xs font-medium h-9">
                      Sign in
                    </Button>
                  </Link>
                  <Link href="/register" onClick={() => setMobileOpen(false)}>
                    <Button className="w-full text-xs font-semibold h-9 bg-gradient-to-r from-[#6366F1] to-[#6366F1] text-white shadow-lg shadow-[#6366F1]/25">
                      Get Started
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
