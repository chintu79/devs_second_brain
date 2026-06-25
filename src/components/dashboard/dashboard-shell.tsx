"use client";

import { useState, useEffect } from "react";
import { CommandBar } from "./command-bar";
import { CommandPalette } from "@/components/layout/command-palette";
import { PageTransitionProvider } from "@/components/layout/page-transition-provider";
import { QuickCaptureDialog } from "@/components/chat/quick-capture-dialog";

interface DashboardShellProps {
  children: React.ReactNode;
}

export function DashboardShell({ children }: DashboardShellProps) {
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [captureOpen, setCaptureOpen] = useState(false);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "K" && e.shiftKey && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setCaptureOpen((prev) => !prev);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <>
      <CommandBar onOpenPalette={() => setPaletteOpen(true)} onOpenCapture={() => setCaptureOpen(true)} />
      <PageTransitionProvider>{children}</PageTransitionProvider>
      <CommandPalette open={paletteOpen} onOpenChange={setPaletteOpen} />
      <QuickCaptureDialog open={captureOpen} onOpenChange={setCaptureOpen} />
    </>
  );
}
