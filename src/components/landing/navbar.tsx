"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme/theme-toggle";

export function Navbar({ session }: { session: { user?: { name?: string | null; email?: string | null } } | null }) {
  const [hidden, setHidden] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      if (currentY > lastScrollY.current && currentY > 80) {
        setHidden(true);
      } else {
        setHidden(false);
      }
      lastScrollY.current = currentY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 border border-border/50 bg-background/70 backdrop-blur-xl rounded-xl transition-all duration-300 ${hidden ? "-translate-y-24 opacity-0" : "translate-y-0 opacity-100"
        }`}
    >
      <div className="flex h-16 items-center gap-12 px-8 py-4">
        <Link href="/" className="flex items-center gap-3 group mr-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary shadow-sm shadow-primary/25 transition-transform duration-200 group-hover:scale-105">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="stroke-white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M12 3a6 6 0 0 0-6 6v2.5c0 3.5 2 6.5 6 8.5 4-2 6-5 6-8.5V9a6 6 0 0 0-6-6z" />
            </svg>
          </div>
          <span className="text-sm font-bold tracking-tight text-foreground">DevCache</span>
        </Link>
        <div className="hidden md:flex items-center gap-1.5">
          {[
            { label: "Features", href: "#features" },
            { label: "Docs", href: "/setup" },
            ...(session ? [{ label: "Dashboard", href: "/dashboard" }] : []),
          ].map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="relative px-3 py-1.5 text-sm text-muted-foreground/80 hover:text-foreground transition-all duration-200 rounded-md hover:bg-muted/60 hover:scale-[1.03]"
            >
              {link.label}
            </Link>
          ))}
        </div>
        <div className="flex items-center gap-3 ml-4">
          <ThemeToggle />
          {session ? (
            <Link href="/dashboard">
              <Button className="text-sm h-8 px-4 bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-200 hover:scale-[1.03]">
                Dashboard
              </Button>
            </Link>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" className="text-sm text-muted-foreground/80 hover:text-foreground h-8 px-3 transition-all duration-200 hover:bg-muted/60 hover:scale-[1.03]">
                  Sign in
                </Button>
              </Link>
              <Link href="/register">
                <Button className="text-sm h-8 px-4 bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_0_0_1px_rgba(99,102,241,0.3)] hover:shadow-[0_0_0_2px_rgba(99,102,241,0.4)] transition-all duration-200 hover:scale-[1.03]">
                  Get Started
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
