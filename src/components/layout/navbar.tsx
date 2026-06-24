"use client";

import { useState } from "react";
import { Search, Plus, Bell, User } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NavbarProps {
  onOpenQuickAdd?: () => void;
  onOpenPalette?: () => void;
}

export function Navbar({ onOpenQuickAdd, onOpenPalette }: NavbarProps) {
  const [searchFocused, setSearchFocused] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/90 backdrop-blur-lg">
      <div className="flex h-14 items-center gap-4 px-5">
        {/* CMD+K Search */}
        <button onClick={onOpenPalette} className="flex-1 max-w-lg">
          <div
            className={`relative flex items-center rounded-lg border bg-muted transition-all duration-150 w-full ${
              searchFocused ? "border-primary ring-1 ring-primary/30" : "border-border hover:border-muted-foreground/30"
            }`}
          >
            <Search className="absolute left-3 h-4 w-4 text-muted-foreground pointer-events-none" />
            <input
              name="q"
              placeholder="Search your second brain..."
              className="flex h-9 w-full bg-transparent pl-9 pr-16 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none cursor-pointer"
              onFocus={(e) => {
                setSearchFocused(true);
                e.target.blur();
                onOpenPalette?.();
              }}
              readOnly
            />
            <div className="absolute right-2 flex items-center gap-1 text-[10px] font-medium text-muted-foreground pointer-events-none">
              <kbd className="rounded border border-border bg-background px-1.5 py-0.5">⌘</kbd>
              <kbd className="rounded border border-border bg-background px-1.5 py-0.5">K</kbd>
            </div>
          </div>
        </button>

        <div className="flex items-center gap-1.5">
          {/* Quick add */}
          <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-foreground" onClick={onOpenQuickAdd}>
            <Plus className="h-4 w-4" />
          </Button>

          {/* Notifications */}
          <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-foreground">
            <Bell className="h-4 w-4" />
          </Button>

          {/* Profile */}
          <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-foreground">
            <User className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}
