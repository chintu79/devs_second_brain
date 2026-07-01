"use client";

import { useRef, useState, useCallback } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@devventory/ui";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { Menu, X, Search, ArrowRight, Command, Settings, LogOut, FileText } from "lucide-react";
import { motion, LayoutGroup, AnimatePresence } from "framer-motion";
import { logout } from "@/actions/auth";

const navLinks = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Resources", href: "/resources" },
  { label: "Prompts", href: "/prompts" },
  { label: "Notes", href: "/notes" },
  { label: "Projects", href: "/projects" },
  { label: "Daily Updates", href: "/radar" },
  { label: "Docs", href: "/docs" },
  { label: "Settings", href: "/settings" },
];

const paletteSections = [
  {
    label: "Navigate to",
    links: [
      { label: "Dashboard", href: "/dashboard" },
      { label: "Resources", href: "/resources" },
      { label: "Prompts", href: "/prompts" },
      { label: "Notes", href: "/notes" },
      { label: "Projects", href: "/projects" },
      { label: "Daily Updates", href: "/radar" },
    ],
  },
  {
    label: "Support",
    links: [
      { label: "Docs", href: "/docs" },
      { label: "Settings", href: "/settings" },
    ],
  },
];

export function DashboardNavbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const paletteInputRef = useRef<HTMLInputElement>(null);
  const paletteRef = useRef<HTMLDivElement>(null);

  const openPalette = useCallback(() => {
    setPaletteOpen(true);
    setTimeout(() => paletteInputRef.current?.focus(), 50);
  }, []);

  const closePalette = useCallback(() => {
    setPaletteOpen(false);
  }, []);

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");

  return (
    <>
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[94%] max-w-[1400px] h-[72px] rounded-[20px] border border-white/10 bg-background/70 backdrop-blur-2xl shadow-[0_8px_32px_-12px_rgba(0,0,0,0.4),0_0_24px_-8px_rgba(99,102,241,0.12)]"
      >
        <div className="flex h-full items-center px-5 md:px-8">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center gap-3 group mr-6 shrink-0">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] shadow-lg shadow-[#6366F1]/20 transition-all duration-300 group-hover:scale-105 group-hover:shadow-[#6366F1]/30">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="stroke-white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M12 3a6 6 0 0 0-6 6v2.5c0 3.5 2 6.5 6 8.5 4-2 6-5 6-8.5V9a6 6 0 0 0-6-6z" />
              </svg>
            </div>
            <span className="text-base font-bold tracking-tight text-foreground hidden sm:inline">DevCache</span>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden lg:flex items-center gap-0.5">
            <LayoutGroup>
              {navLinks.map((link) => {
                const active = isActive(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`relative px-3 py-1.5 text-sm font-medium rounded-lg transition-all duration-200 whitespace-nowrap ${
                      active
                        ? "text-[#6366F1]"
                        : "text-muted-foreground/70 hover:text-[#6366F1] hover:-translate-y-[0.5px]"
                    }`}
                  >
                    {active && (
                      <motion.span
                        layoutId="nav-active-pill"
                        className="absolute inset-0 rounded-lg bg-[#6366F1]/10 border border-[#6366F1]/15 shadow-[0_0_12px_-4px_rgba(99,102,241,0.2)]"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                      />
                    )}
                    <span className="relative z-10">{link.label}</span>
                  </Link>
                );
              })}
            </LayoutGroup>
          </div>

          {/* Right section */}
          <div className="flex items-center gap-2 ml-auto shrink-0">
            <button
              onClick={openPalette}
              className="flex items-center justify-center h-9 w-9 rounded-xl text-muted-foreground hover:text-[#6366F1] hover:bg-white/5 transition-all duration-200 hover:scale-[1.05]"
              aria-label="Search (Ctrl+K)"
            >
              <Search className="h-[18px] w-[18px]" />
            </button>

            <ThemeToggle className="h-9 w-9" />

            <Link href="/settings">
              <Button variant="ghost" className="h-9 w-9 p-0 rounded-xl text-muted-foreground hover:text-[#6366F1] hover:bg-white/5 transition-all duration-200 hover:scale-[1.05]" aria-label="Settings">
                <Settings className="h-[18px] w-[18px]" />
              </Button>
            </Link>

            <form action={logout}>
              <button type="submit" className="flex items-center justify-center h-9 w-9 rounded-xl text-muted-foreground hover:text-[#6366F1] hover:bg-white/5 transition-all duration-200 hover:scale-[1.05]" aria-label="Sign out">
                <LogOut className="h-[18px] w-[18px]" />
              </button>
            </form>

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden flex items-center justify-center h-9 w-9 rounded-xl hover:bg-white/5 transition-all duration-200"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
            >
              {mobileOpen ? <X className="h-[18px] w-[18px]" /> : <Menu className="h-[18px] w-[18px]" />}
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
            style={{ paddingTop: "calc(72px + 32px)" }}
          >
            <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
            <motion.div
              ref={paletteRef}
              initial={{ opacity: 0, y: -12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.98 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="relative w-[680px] max-w-[92vw] max-h-[480px] bg-background/95 backdrop-blur-2xl border border-white/10 rounded-[20px] shadow-[0_16px_48px_-16px_rgba(0,0,0,0.6),0_0_32px_-12px_rgba(99,102,241,0.2)] overflow-hidden flex flex-col"
            >
              <div className="flex items-center gap-3 px-5 h-14 border-b border-white/5 shrink-0">
                <Search className="h-4 w-4 text-muted-foreground/50 shrink-0" />
                <input
                  ref={paletteInputRef}
                  type="text"
                  placeholder="Search your DevCache..."
                  className="flex-1 bg-transparent border-none outline-none text-sm text-foreground placeholder:text-muted-foreground/40 font-medium"
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
                    <span className="text-[10px] font-semibold uppercase tracking-[0.1em] px-2 pb-1.5 block text-muted-foreground/50">
                      {section.label}
                    </span>
                    <div className="flex flex-col gap-0.5">
                      {section.links.map((link) => (
                        <a
                          key={link.href}
                          href={link.href}
                          onClick={() => closePalette()}
                          className="group flex items-center justify-between px-3 py-2.5 text-sm font-medium rounded-xl text-muted-foreground/80 hover:text-foreground hover:bg-white/5 transition-all duration-200 cursor-pointer"
                        >
                          <span>{link.label}</span>
                          <ArrowRight className="h-3.5 w-3.5 text-muted-foreground/30 group-hover:text-[#6366F1] transition-all duration-200 group-hover:translate-x-0.5" />
                        </a>
                      ))}
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
            className="absolute top-[100px] left-4 right-4 bg-background/90 backdrop-blur-2xl border border-white/10 rounded-2xl p-5 shadow-2xl max-h-[65vh] overflow-y-auto"
          >
            <div className="flex flex-col gap-0.5">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`px-3 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 ${
                    isActive(link.href)
                      ? "text-[#6366F1] bg-[#6366F1]/10"
                      : "text-muted-foreground/80 hover:text-foreground hover:bg-white/5"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
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
            <form action={logout}>
              <button type="submit" className="w-full flex items-center gap-2 px-3 py-2.5 text-sm font-medium rounded-xl text-muted-foreground/80 hover:text-foreground hover:bg-white/5 transition-all duration-200 mt-3">
                <LogOut className="h-4 w-4" />
                Sign out
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </>
  );
}
