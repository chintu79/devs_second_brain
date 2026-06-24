"use client";

import { useState } from "react";
import { CommandBar } from "./command-bar";
import { CommandPalette } from "@/components/layout/command-palette";

interface DashboardShellProps {
  children: React.ReactNode;
}

export function DashboardShell({ children }: DashboardShellProps) {
  const [paletteOpen, setPaletteOpen] = useState(false);

  return (
    <>
      <CommandBar onOpenPalette={() => setPaletteOpen(true)} />
      {children}
      <CommandPalette open={paletteOpen} onOpenChange={setPaletteOpen} />
    </>
  );
}
