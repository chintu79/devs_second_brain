"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@devventory/ui";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { Menu, X, Search, ArrowRight, Command } from "lucide-react";
import { motion, LayoutGroup, AnimatePresence } from "framer-motion";

const navLinks = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Resources", href: "/resources" },
  { label: "Prompts", href: "/prompts" },
  { label: "Notes", href: "/notes" },
  { label: "Projects", href: "/projects" },
  { label: "Daily Updates", href: "/radar" },
];

const paletteSections = [
  {
    label: "Recent",
    links: [
      { label: "Resources", href: "/resources" },
      { label: "Prompts", href: "/prompts" },
      { label: "Notes", href: "/notes" },
    ],
  },
  {
    label: "Navigate to",
    links: [
      { label: "Dashboard", href: "/dashboard" },
      { label: "Projects", href: "/projects" },
      { label: "Daily Updates", href: "/radar" },
    ],
  },
  {
    label: "Feature Search",
    links: [
      { label: "Resources", href: "/resources" },
      { label: "Prompts", href: "/prompts" },
      { label: "Notes", href: "/notes" },
      { label: "Projects", href: "/projects" },
    ],
  },
];

export function Navbar({ session }: { session: { user?: { name?: string | null; email?: string | null } } | null }) {
  const pathname = usePathname();
  const router = useRouter();
  const [hidden, setHidden] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const paletteInputRef = useRef<HTMLInputElement>(null);
  const paletteRef = useRef<HTMLDivElement>(null);
  const lastScrollY = useRef(0);

  const openPalette = useCallback(() => {
    setPaletteOpen(true);
    setTimeout(() => paletteInputRef.current?.focus(), 50);
  }, []);

  const closePalette = useCallback(() => {
    setPaletteOpen(false);
  }, []);

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

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        if (paletteOpen) {
          closePalette();
        } else {
          openPalette();
        }
      }
      if (e.key === "Escape" && paletteOpen) {
        closePalette();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [paletteOpen, openPalette, closePalette]);

  useEffect(() => {
    if (!paletteOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (paletteRef.current && !paletteRef.current.contains(e.target as Node)) {
        closePalette();
      }
    };
    setTimeout(() => window.addEventListener("mousedown", handleClickOutside), 0);
    return () => window.removeEventListener("mousedown", handleClickOutside);
  }, [paletteOpen, closePalette]);

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");

  const handleNavClick = (e: React.MouseEvent, href: string) => {
    if (!session) {
      e.preventDefault();
      router.push(`/login?callbackUrl=${encodeURIComponent(href)}`);
    }
  };

  return (
    <>
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[96%] max-w-[1400px] h-[84px] rounded-[20px] border border-white/10 bg-background/60 backdrop-blur-2xl shadow-[0_8px_32px_-12px_rgba(0,0,0,0.4),0_0_24px_-8px_rgba(99,102,241,0.15)] transition-all duration-300 ${
          hidden ? "-translate-y-28 opacity-0 pointer-events-none" : "translate-y-0 opacity-100 pointer-events-auto"
        }`}
      >
        <div className="flex h-full items-center px-6 md:px-8 lg:px-10">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group mr-8 shrink-0">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] shadow-lg shadow-[#6366F1]/20 transition-all duration-300 group-hover:scale-105 group-hover:shadow-[#6366F1]/30">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="stroke-white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M12 3a6 6 0 0 0-6 6v2.5c0 3.5 2 6.5 6 8.5 4-2 6-5 6-8.5V9a6 6 0 0 0-6-6z" />
              </svg>
            </div>
            <span className="text-lg font-bold tracking-tight text-foreground hidden sm:inline">DevCache</span>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden lg:flex items-center gap-1">
            <LayoutGroup>
              {navLinks.map((link) => {
                const active = isActive(link.href);
                return (
                  <a
                    key={link.href}
                    href={session ? link.href : undefined}
                    onClick={(e) => handleNavClick(e, link.href)}
                    className={`relative px-3.5 py-2 text-[17px] font-medium rounded-lg transition-all duration-300 whitespace-nowrap cursor-pointer ${
                      active
                        ? "text-[#6366F1]"
                        : "text-muted-foreground/80 hover:text-[#6366F1] hover:-translate-y-[1px]"
                    }`}
                  >
                    {active && (
                      <motion.span
                        layoutId="nav-active-pill"
                        className="absolute inset-0 rounded-lg bg-[#6366F1]/10 border border-[#6366F1]/20 shadow-[0_0_12px_-4px_rgba(99,102,241,0.3)]"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                      />
                    )}
                    <span className="relative z-10">{link.label}</span>
                  </a>
                );
              })}
            </LayoutGroup>
          </div>

          {/* Right section */}
          <div className="flex items-center gap-3 ml-auto shrink-0">
            <button
              onClick={openPalette}
              className="flex items-center justify-center h-10 w-10 rounded-xl text-muted-foreground hover:text-[#6366F1] hover:bg-white/5 transition-all duration-300 hover:scale-[1.05]"
              aria-label="Search (Ctrl+K)"
            >
              <Search className="h-5 w-5" />
            </button>

            <ThemeToggle className="h-10 w-10" />

            {session ? (
              <Link href="/dashboard">
                <Button className="text-sm font-semibold h-10 px-6 rounded-xl bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white shadow-lg shadow-[#6366F1]/25 hover:shadow-[#6366F1]/50 hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
                  Dashboard
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/login" className="hidden sm:inline">
                  <Button variant="ghost" className="text-sm font-medium text-muted-foreground/80 hover:text-foreground h-10 px-4 rounded-xl transition-all duration-300 hover:bg-white/5">
                    Sign in
                  </Button>
                </Link>
                <Link href="/register">
                  <Button className="text-sm font-semibold h-10 px-6 rounded-xl bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white shadow-lg shadow-[#6366F1]/25 hover:shadow-[#6366F1]/50 hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden flex items-center justify-center h-10 w-10 rounded-xl hover:bg-white/5 transition-all duration-300"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Command Palette */}
      <AnimatePresence>
        {paletteOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-40 flex justify-center"
            style={{ paddingTop: "calc(84px + 48px)" }}
          >
            <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
            <motion.div
              ref={paletteRef}
              initial={{ opacity: 0, y: -12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.98 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="relative w-[740px] max-w-[92vw] max-h-[520px] bg-background/95 backdrop-blur-2xl border border-white/10 rounded-[20px] shadow-[0_16px_48px_-16px_rgba(0,0,0,0.6),0_0_32px_-12px_rgba(99,102,241,0.2)] overflow-hidden flex flex-col"
            >
              <div className="flex items-center gap-3 px-5 h-16 border-b border-white/5 shrink-0">
                <Search className="h-5 w-5 text-muted-foreground/50 shrink-0" />
                <input
                  ref={paletteInputRef}
                  type="text"
                  placeholder="Search your DevCache..."
                  className="flex-1 bg-transparent border-none outline-none text-base text-foreground placeholder:text-muted-foreground/40 font-medium"
                  autoComplete="off"
                  spellCheck={false}
                />
                <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground/40 font-medium">
                  <kbd className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-white/5 border border-white/10">
                    <Command className="h-3 w-3" />
                  </kbd>
                  <span className="text-muted-foreground/30">+</span>
                  <kbd className="px-1.5 py-0.5 rounded-md bg-white/5 border border-white/10">K</kbd>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3">
                {paletteSections.map((section) => (
                  <div key={section.label}>
                    <span className="text-[11px] font-semibold uppercase tracking-[0.1em] px-2 pb-1.5 block text-muted-foreground/50">
                      {section.label}
                    </span>
                    <div className="flex flex-col gap-0.5">
                      {section.links.map((link) => {
                        const callbackHref = session ? link.href : undefined;
                        return (
                          <a
                            key={`${section.label}-${link.href}`}
                            href={callbackHref}
                            onClick={(e) => {
                              closePalette();
                              if (!session) {
                                e.preventDefault();
                                router.push(`/login?callbackUrl=${encodeURIComponent(link.href)}`);
                              }
                            }}
                            className="group flex items-center justify-between px-3 py-2.5 text-sm font-medium rounded-xl text-muted-foreground/80 hover:text-foreground hover:bg-white/5 transition-all duration-200 cursor-pointer"
                          >
                            <span>{link.label}</span>
                            <ArrowRight className="h-3.5 w-3.5 text-muted-foreground/30 group-hover:text-[#6366F1] transition-all duration-200 group-hover:translate-x-0.5" />
                          </a>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile menu overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute top-24 left-4 right-4 bg-background/90 backdrop-blur-2xl border border-white/10 rounded-2xl p-5 shadow-2xl max-h-[65vh] overflow-y-auto"
          >
            <div className="flex flex-col gap-0.5">
              {navLinks.map((link) => {
                const active = isActive(link.href);
                return (
                  <a
                    key={link.href}
                    href={session ? link.href : undefined}
                    onClick={(e) => {
                      setMobileOpen(false);
                      handleNavClick(e, link.href);
                    }}
                    className={`px-3 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 cursor-pointer ${
                      active
                        ? "text-[#6366F1] bg-[#6366F1]/10"
                        : "text-muted-foreground/80 hover:text-foreground hover:bg-white/5"
                    }`}
                  >
                    {link.label}
                  </a>
                );
              })}
            </div>
            <div className="h-px bg-white/10 my-3" />
            <div className="flex items-center gap-3 px-1">
              <ThemeToggle className="h-9 w-9" />
              <button
                onClick={() => { openPalette(); setMobileOpen(false); }}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-xl text-muted-foreground/80 hover:text-foreground hover:bg-white/5 transition-all duration-200"
              >
                <Search className="h-4 w-4" />
                Search
              </button>
            </div>
            {!session && (
              <div className="flex gap-2 mt-4 px-1">
                <Link href="/login" onClick={() => setMobileOpen(false)} className="flex-1">
                  <Button variant="ghost" className="w-full text-sm h-10 rounded-xl">Sign in</Button>
                </Link>
                <Link href="/register" onClick={() => setMobileOpen(false)} className="flex-1">
                  <Button className="w-full text-sm h-10 rounded-xl bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white shadow-lg shadow-[#6366F1]/25">Get Started</Button>
                </Link>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </>
  );
}
