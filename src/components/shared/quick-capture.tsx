"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Zap, Bookmark, FileText, Sparkles, X, Link, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createResource } from "@/actions/resources";
import { createNote } from "@/actions/notes";
import { createPrompt } from "@/actions/prompts";
import { batchCreateReferences, type LinkItem } from "@/actions/references";
import { LinkPicker } from "./link-picker";

type CaptureTab = "link" | "note" | "prompt";

const tabs: { id: CaptureTab; label: string; icon: React.ElementType; color: string }[] = [
  { id: "link", label: "Link", icon: Bookmark, color: "#14B8A6" },
  { id: "note", label: "Note", icon: FileText, color: "#22C55E" },
  { id: "prompt", label: "Prompt", icon: Sparkles, color: "#F59E0B" },
];

export function QuickCapture() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<CaptureTab>("link");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [links, setLinks] = useState<LinkItem[]>([]);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "c" && (e.metaKey || e.ctrlKey) && e.shiftKey) {
        e.preventDefault();
        setOpen((v) => !v);
      }
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, []);

  function reset() {
    setLinks([]);
    setError(null);
  }

  async function handleLink(formData: FormData) {
    setLoading(true);
    setError(null);
    const result = await createResource(formData);
    setLoading(false);
    if (result?.error) { setError(result.error); return; }
    const newId = result?.id;
    if (newId && links.length > 0) {
      await batchCreateReferences("resource", newId, links);
    }
    router.refresh();
    setOpen(false);
    reset();
  }

  async function handleNote(formData: FormData) {
    setLoading(true);
    setError(null);
    const result = await createNote(formData);
    setLoading(false);
    if (result?.error) { setError(result.error); return; }
    const newId = "id" in result ? result.id : null;
    if (newId && links.length > 0) {
      await batchCreateReferences("note", newId, links);
    }
    router.refresh();
    setOpen(false);
    reset();
  }

  async function handlePrompt(formData: FormData) {
    setLoading(true);
    setError(null);
    const result = await createPrompt(formData);
    setLoading(false);
    if (result?.error) { setError(result.error); return; }
    const newId = "id" in result ? result.id : null;
    if (newId && links.length > 0) {
      await batchCreateReferences("prompt", newId, links);
    }
    router.refresh();
    setOpen(false);
    reset();
  }

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 left-6 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-200"
        title="Quick Capture (⌘⇧C)"
      >
        {open ? <X className="h-5 w-5" /> : <Zap className="h-5 w-5" />}
      </button>

      {open && (
        <div className="fixed inset-0 z-30 bg-black/20 backdrop-blur-sm" onClick={() => setOpen(false)} />
      )}

      <div
        className={`fixed bottom-24 left-6 z-40 w-[400px] rounded-xl border border-border bg-card shadow-2xl transition-all duration-250 origin-bottom-left ${
          open ? "scale-100 opacity-100" : "scale-95 opacity-0 pointer-events-none"
        }`}
      >
        <div className="flex items-center border-b border-border/50">
          {tabs.map((t) => {
            const Icon = t.icon;
            const active = tab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => { setTab(t.id); setError(null); }}
                className={`flex-1 flex items-center justify-center gap-2 py-3 text-xs font-medium transition-all duration-150 ${
                  active
                    ? "accent-text border-b-2"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                style={active ? { '--accent-c': t.color, borderBottomColor: 'var(--accent-c)' } as React.CSSProperties : {}}
              >
                <Icon className="h-3.5 w-3.5" />
                {t.label}
              </button>
            );
          })}
        </div>

        <div className="p-4 space-y-3">
          {error && (
            <div className="rounded-md bg-destructive/10 p-2.5 text-xs text-destructive">{error}</div>
          )}

          {tab === "link" && (
            <form action={handleLink} className="space-y-3">
              <div>
                <Label htmlFor="qc-title" className="text-xs">Title</Label>
                <Input id="qc-title" name="title" placeholder="Article: Server Actions" required className="h-9 text-sm mt-1" />
              </div>
              <div>
                <Label htmlFor="qc-url" className="text-xs">URL</Label>
                <Input id="qc-url" name="url" type="url" placeholder="https://..." required className="h-9 text-sm mt-1" />
              </div>
              <div>
                <Label htmlFor="qc-category" className="text-xs">Category</Label>
                <Select name="category" defaultValue="other">
                  <SelectTrigger className="h-9 text-sm mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="frontend">Frontend</SelectItem>
                    <SelectItem value="backend">Backend</SelectItem>
                    <SelectItem value="devops">DevOps</SelectItem>
                    <SelectItem value="database">Database</SelectItem>
                    <SelectItem value="ai">AI</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="pt-1 border-t border-border/30">
                <LinkPicker selected={links} onChange={setLinks} placeholder="Link to project, note..." />
              </div>
              <Button type="submit" disabled={loading} className="w-full h-9 text-sm gap-1.5">
                {loading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                Save Link
              </Button>
            </form>
          )}

          {tab === "note" && (
            <form action={handleNote} className="space-y-3">
              <div>
                <Label htmlFor="qc-note-title" className="text-xs">Title</Label>
                <Input id="qc-note-title" name="title" placeholder="Thought on..." required className="h-9 text-sm mt-1" />
              </div>
              <div>
                <Label htmlFor="qc-note-content" className="text-xs">Note</Label>
                <Textarea id="qc-note-content" name="content" placeholder="Write your thought..." rows={4} required className="text-sm mt-1" />
              </div>
              <div>
                <Label htmlFor="qc-note-category" className="text-xs">Category</Label>
                <Select name="category" defaultValue="idea">
                  <SelectTrigger className="h-9 text-sm mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="idea">Idea</SelectItem>
                    <SelectItem value="technical">Technical</SelectItem>
                    <SelectItem value="learning">Learning</SelectItem>
                    <SelectItem value="meeting">Meeting</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="pt-1 border-t border-border/30">
                <LinkPicker selected={links} onChange={setLinks} placeholder="Link to project, resource..." />
              </div>
              <Button type="submit" disabled={loading} className="w-full h-9 text-sm gap-1.5">
                {loading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                Save Note
              </Button>
            </form>
          )}

          {tab === "prompt" && (
            <form action={handlePrompt} className="space-y-3">
              <div>
                <Label htmlFor="qc-prompt-title" className="text-xs">Title</Label>
                <Input id="qc-prompt-title" name="title" placeholder="Code Review Prompt" required className="h-9 text-sm mt-1" />
              </div>
              <div>
                <Label htmlFor="qc-prompt-text" className="text-xs">Prompt</Label>
                <Textarea id="qc-prompt-text" name="prompt" placeholder="Write your prompt..." rows={4} required className="text-sm mt-1" />
              </div>
              <div>
                <Label htmlFor="qc-prompt-category" className="text-xs">Category</Label>
                <Select name="category" defaultValue="coding">
                  <SelectTrigger className="h-9 text-sm mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="coding">Coding</SelectItem>
                    <SelectItem value="debugging">Debugging</SelectItem>
                    <SelectItem value="architecture">Architecture</SelectItem>
                    <SelectItem value="testing">Testing</SelectItem>
                    <SelectItem value="docs">Documentation</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="pt-1 border-t border-border/30">
                <LinkPicker selected={links} onChange={setLinks} placeholder="Link to project, resource..." />
              </div>
              <Button type="submit" disabled={loading} className="w-full h-9 text-sm gap-1.5">
                {loading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                Save Prompt
              </Button>
            </form>
          )}
        </div>
      </div>
    </>
  );
}
