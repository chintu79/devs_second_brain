"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@devventory/ui";
import { toast } from "sonner";
import { createNote } from "@/actions/notes";
import {
  LayoutDashboard,
  Bookmark,
  Sparkles,
  StickyNote,
  FolderKanban,
  Radio,
  Search,
  FileText,
  Link2,
  Loader2,
  Zap,
  Calendar,
} from "lucide-react";
import { globalSearch } from "@/actions/search";

const navItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
  { id: "resources", label: "Resources", icon: Bookmark, href: "/resources" },
  { id: "prompts", label: "Prompts", icon: Sparkles, href: "/prompts" },
  { id: "notes", label: "Notes", icon: StickyNote, href: "/notes" },
  { id: "projects", label: "Projects", icon: FolderKanban, href: "/projects" },
  { id: "log", label: "Daily Log", icon: Calendar, href: "/log" },
  { id: "radar", label: "Open Source Radar", icon: Radio, href: "/radar" },
  { id: "search", label: "Search Everything", icon: Search, href: "/search" },
];

const typeConfig = {
  resources: { icon: Link2, label: "Resources", href: (id: string) => `/resources?id=${id}` },
  prompts: { icon: Sparkles, label: "Prompts", href: (id: string) => `/prompts?id=${id}` },
  notes: { icon: FileText, label: "Notes", href: (id: string) => `/notes?id=${id}` },
  projects: { icon: FolderKanban, label: "Projects", href: (id: string) => `/projects?id=${id}` },
} as const;

interface CommandPaletteProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function CommandPalette({ open: controlledOpen, onOpenChange }: CommandPaletteProps) {
  const router = useRouter();
  const [internalOpen, setInternalOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [capturing, setCapturing] = useState(false);
  const [captureText, setCaptureText] = useState("");
  const captureRef = useRef<HTMLTextAreaElement>(null);
  const [results, setResults] = useState<{
    resources: any[]; prompts: any[]; notes: any[]; projects: any[]; // eslint-disable-line @typescript-eslint/no-explicit-any
  }>({ resources: [], prompts: [], notes: [], projects: [] });
  const [searching, setSearching] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;

  const setOpen = useCallback(
    (value: boolean) => {
      if (isControlled) {
        onOpenChange?.(value);
      } else {
        setInternalOpen(value);
      }
    },
    [isControlled, onOpenChange]
  );

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen(!open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [open, setOpen]);

  useEffect(() => {
    if (!open) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setQuery("");
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCapturing(false);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCaptureText("");
      setResults({ resources: [], prompts: [], notes: [], projects: [] });
    }
  }, [open]);

  useEffect(() => {
    if (!query.trim()) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setResults({ resources: [], prompts: [], notes: [], projects: [] });
      setSearching(false);
      return;
    }

    let cancelled = false;
    setSearching(true);
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(async () => {
      const res = await globalSearch(query);
      if (cancelled) return;
      setResults(res);
      setSearching(false);
    }, 200);

    return () => {
      cancelled = true;
      clearTimeout(timerRef.current);
    };
  }, [query]);

  const handleNavSelect = useCallback(
    (href: string) => {
      setOpen(false);
      setQuery("");
      router.push(href);
    },
    [router, setOpen]
  );

  const handleResultSelect = useCallback(
    (type: keyof typeof typeConfig, id: string) => {
      setOpen(false);
      setQuery("");
      const href = typeConfig[type].href(id);
      router.push(href);
    },
    [router, setOpen]
  );

  const hasResults = results.resources.length > 0 || results.prompts.length > 0 ||
    results.notes.length > 0 || results.projects.length > 0;

  const handleQuickCapture = useCallback(async () => {
    if (!captureText.trim()) return;
    const title = captureText.split('\n')[0].slice(0, 80) || `Quick note ${new Date().toLocaleDateString()}`;
    const fd = new FormData();
    fd.set("title", title);
    fd.set("content", captureText);
    fd.set("category", "personal");
    fd.set("tags", "quick-capture");
    const result = await createNote(fd);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Captured!");
      setCaptureText("");
      setCapturing(false);
      setOpen(false);
    }
  }, [captureText, setOpen]);

  useEffect(() => {
    if (capturing && captureRef.current) {
      captureRef.current.focus();
    }
  }, [capturing]);

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput
        placeholder="Search or jump to..."
        value={query}
        onValueChange={setQuery}
      />
      <CommandList>
        {capturing ? (
          <div className="p-4 space-y-3">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Quick Capture</p>
            <textarea
              ref={captureRef}
              value={captureText}
              onChange={(e) => setCaptureText(e.target.value)}
              placeholder="What's on your mind?"
              className="w-full min-h-[100px] rounded-lg border border-border bg-muted p-3 text-sm text-foreground placeholder:text-muted-foreground/60 resize-none outline-none focus:border-primary/40"
              onKeyDown={(e) => { if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') { e.preventDefault(); handleQuickCapture(); } }}
            />
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-muted-foreground">⌘+Enter to save</span>
              <div className="flex gap-2">
                <button onClick={() => { setCapturing(false); setCaptureText(""); }} className="px-3 py-1.5 text-xs rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">Cancel</button>
                <button onClick={handleQuickCapture} disabled={!captureText.trim()} className="px-3 py-1.5 text-xs rounded-md bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-40 transition-all">Save</button>
              </div>
            </div>
          </div>
        ) : !query.trim() ? (
          <>
            <CommandGroup heading="Navigation">
              <CommandItem onSelect={() => setCapturing(true)}>
                <Zap className="mr-2 h-4 w-4" />
                <span>Quick Capture</span>
              </CommandItem>
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <CommandItem key={item.id} onSelect={() => handleNavSelect(item.href)}>
                    <Icon className="mr-2 h-4 w-4" />
                    <span>{item.label}</span>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </>
        ) : searching ? (
          <div className="flex items-center justify-center py-6">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        ) : !hasResults ? (
          <CommandEmpty>No results found.</CommandEmpty>
        ) : (
          <>
            {(Object.keys(typeConfig) as Array<keyof typeof typeConfig>).map((type) => {
              const items = results[type];
              if (items.length === 0) return null;
              const Icon = typeConfig[type].icon;
              return (
                <CommandGroup key={type} heading={typeConfig[type].label}>
                  {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                  {items.map((item: any) => (
                    <CommandItem
                      key={`${type}-${item.id}`}
                      onSelect={() => handleResultSelect(type, item.id)}
                    >
                      <Icon className="mr-2 h-4 w-4" />
                      <div className="flex-1 min-w-0">
                        <span className="truncate">{item.title}</span>
                        {item.category && (
                          <span className="ml-2 text-[10px] text-muted-foreground uppercase">
                            {item.category}
                          </span>
                        )}
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              );
            })}
          </>
        )}
      </CommandList>
    </CommandDialog>
  );
}
