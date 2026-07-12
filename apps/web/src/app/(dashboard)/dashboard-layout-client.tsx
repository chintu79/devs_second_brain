"use client";

import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Sidebar } from "@/components/layout/sidebar";
import dynamic from "next/dynamic";

const CommandPalette = dynamic(
  () => import("@/components/layout/command-palette").then((m) => ({ default: m.CommandPalette })),
  { ssr: false }
);

export function DashboardLayoutClient({ children }: { children: React.ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setPaletteOpen((v) => !v);
      }
      if (e.key === "Escape" && paletteOpen) {
        setPaletteOpen(false);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [paletteOpen]);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        onSearchClick={() => setPaletteOpen(true)}
      />

      <button
        onClick={() => setMobileMenuOpen((v) => !v)}
        className="md:hidden fixed top-3 left-3 z-50 flex h-8 w-8 items-center justify-center rounded-lg bg-background border shadow-sm hover:bg-accent/10 transition-colors"
        aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
      >
        {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
      </button>

      <AnimatePresence>
        {paletteOpen && <CommandPalette onClose={() => setPaletteOpen(false)} />}
      </AnimatePresence>

      <div className="flex flex-1 relative left-0 w-full">
        <main className="flex-1 overflow-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
