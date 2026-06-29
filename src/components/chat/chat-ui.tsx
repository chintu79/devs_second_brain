"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { Markdown } from "@/components/shared/markdown";
import { Bot, Send, Loader2, X, Copy, Check, ChevronDown, ChevronRight, FileText, StickyNote, MessageSquare, FolderKanban, Sparkles, ArrowUp, Plus, CheckCircle2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { createNote } from "@/actions/notes";
import { createPrompt } from "@/actions/prompts";
import { createResource } from "@/actions/resources";
import { createProject } from "@/actions/projects";

let nextMsgId = 1;

interface Message {
  id: number;
  role: "user" | "assistant";
  content: string;
}

const DEFAULT_SUGGESTIONS = [
  "What have I been learning about React?",
  "Find prompts related to TypeScript",
  "Summarize my notes on system design",
  "What projects am I currently building?",
];

const CONTEXT_SUGGESTIONS: Record<string, { label: string; actions: string[] }> = {
  resources: {
    label: "Resources",
    actions: [
      "Summarize the latest resource I saved",
      "Find resources about this topic",
      "Extract key points from my resources",
      "What categories do my resources cover?",
    ],
  },
  notes: {
    label: "Notes",
    actions: [
      "Summarize my recent notes",
      "Find notes related to this topic",
      "Generate a prompt from my notes",
      "What tags do I use most in notes?",
    ],
  },
  prompts: {
    label: "Prompts",
    actions: [
      "Explain this prompt pattern",
      "Find prompts about this topic",
      "Create a project from this prompt",
      "What prompt categories do I have?",
    ],
  },
  projects: {
    label: "Projects",
    actions: [
      "What's the status of my projects?",
      "Find resources for my active project",
      "Generate tasks from project notes",
      "Summarize project progress",
    ],
  },
  docs: {
    label: "Documentation",
    actions: [
      "Search documentation for this topic",
      "Explain how to use tags",
      "How do I get started?",
      "What features are available?",
    ],
  },
};

function parseSections(content: string): { heading: string; body: string }[] {
  if (!content.includes("## ")) return [{ heading: "", body: content }];
  const parts = content.split(/\n(?=## )/);
  return parts.map((part) => {
    const match = part.match(/^## (.+)/);
    if (match) {
      return { heading: match[1], body: part.replace(/^## .+\n?/, "") };
    }
    return { heading: "", body: part };
  });
}

function SectionBlock({ heading, body, defaultOpen }: { heading: string; body: string; defaultOpen: boolean }) {
  const [open, setOpen] = useState(defaultOpen);

  if (!heading) {
    return (
      <div className="prose prose-sm max-w-none text-foreground/90 leading-relaxed">
        <Markdown>{body || ""}</Markdown>
      </div>
    );
  }

  return (
    <div className="border border-border/20 rounded-xl overflow-hidden bg-card/30">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-3 w-full px-5 py-3 text-left transition-colors hover:bg-muted/20"
      >
        <div className="flex h-6 w-6 items-center justify-center rounded-md bg-muted/50 shrink-0">
          {open ? (
            <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
          ) : (
            <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
          )}
        </div>
        <span className="text-sm font-semibold text-foreground/80 tracking-tight">{heading}</span>
      </button>
      {open && (
        <div className="px-5 pb-4 pt-2 border-t border-border/10">
          <div className="prose prose-sm max-w-none text-foreground/85 leading-relaxed">
            <Markdown>{body || ""}</Markdown>
          </div>
        </div>
      )}
    </div>
  );
}

function ActionButtons({ content }: { content: string }) {
  const [creating, setCreating] = useState<string | null>(null);

  const actions = [
    { id: "note", icon: StickyNote, label: "Create Note" },
    { id: "prompt", icon: MessageSquare, label: "Save as Prompt" },
    { id: "project", icon: FolderKanban, label: "Add to Project" },
    { id: "resource", icon: Sparkles, label: "Create Resource" },
  ];

  const handleCreate = async (id: string) => {
    setCreating(id);
    const title = content.split("\n")[0].replace(/^##\s*/, "").slice(0, 80) || "AI Generated";
    const fd = new FormData();
    fd.set("title", title);
    fd.set("tags", "");

    try {
      let result;
      switch (id) {
        case "note":
          fd.set("content", content);
          fd.set("category", "");
          result = await createNote(fd);
          break;
        case "prompt":
          fd.set("prompt", content);
          fd.set("category", "");
          fd.set("useCase", "");
          result = await createPrompt(fd);
          break;
        case "project":
          fd.set("description", "");
          fd.set("status", "active");
          fd.set("techStack", "");
          fd.set("planMd", content);
          result = await createProject(fd);
          break;
        case "resource":
          fd.set("url", "");
          fd.set("notes", content);
          fd.set("reason", "AI Chat Response");
          fd.set("category", "");
          result = await createResource(fd);
          break;
      }
      if (result?.success) toast.success(`Saved as ${id}`);
      else toast.error(result?.error || "Failed");
    } catch (err: any) {
      toast.error(err.message || "Failed");
    } finally {
      setCreating(null);
    }
  };

  return (
    <div className="flex flex-wrap gap-2 mt-6 pt-5 border-t border-border/10">
      <span className="text-[11px] text-muted-foreground/50 uppercase tracking-wider font-medium w-full mb-1">Actions</span>
      {actions.map((action) => (
        <button
          key={action.label}
          onClick={() => handleCreate(action.id)}
          disabled={creating === action.id}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border/30 text-xs text-muted-foreground hover:text-foreground hover:border-border/60 hover:bg-muted/30 transition-all disabled:opacity-50"
        >
          {creating === action.id ? (
            <Loader2 className="h-3 w-3 animate-spin" />
          ) : (
            <action.icon className="h-3 w-3" />
          )}
          {action.label}
        </button>
      ))}
    </div>
  );
}

function SearchingIndicator() {
  const items = [
    { label: "Notes", color: "text-green-500" },
    { label: "Resources", color: "text-teal-500" },
    { label: "Projects", color: "text-purple-500" },
    { label: "Prompts", color: "text-amber-500" },
  ];

  return (
    <div className="rounded-xl border border-border/20 bg-card/20 px-5 py-4 space-y-3">
      <div className="flex items-center gap-2.5 text-sm text-muted-foreground">
        <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
        Searching your knowledge...
      </div>
      <div className="flex flex-wrap gap-3">
        {items.map((item) => (
          <div key={item.label} className="flex items-center gap-1.5 text-xs text-muted-foreground/60">
            <Check className={`h-3 w-3 ${item.color}`} />
            {item.label}
          </div>
        ))}
      </div>
    </div>
  );
}

interface CreateData {
  type: "note" | "resource" | "prompt" | "project";
  title?: string;
  content?: string;
  category?: string;
  tags?: string[];
  url?: string;
  notes?: string;
  reason?: string;
  prompt?: string;
  useCase?: string;
  description?: string;
  status?: string;
  techStack?: string;
}

const COMMANDS = [
  { id: "note", label: "Create a note", icon: StickyNote, color: "text-green-500" },
  { id: "resource", label: "Save a resource", icon: FileText, color: "text-teal-500" },
  { id: "prompt", label: "Create a prompt", icon: MessageSquare, color: "text-amber-500" },
  { id: "project", label: "Start a project", icon: FolderKanban, color: "text-purple-500" },
];

const TYPE_LABELS: Record<string, string> = {
  note: "Note", resource: "Resource", prompt: "Prompt", project: "Project",
};

const TYPE_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  note: StickyNote, resource: FileText, prompt: MessageSquare, project: FolderKanban,
};

const TYPE_COLORS: Record<string, string> = {
  note: "text-green-500", resource: "text-teal-500", prompt: "text-amber-500", project: "text-purple-500",
};

function parseCreateBlocks(content: string): { display: string; blocks: CreateData[] } {
  const blocks: CreateData[] = [];
  const display = content.replace(/__CREATE__\s*(\{[\s\S]*?\})\s*__END_CREATE__/g, (_, json) => {
    try {
      const data = JSON.parse(json) as CreateData;
      if (data && data.type && ["note", "resource", "prompt", "project"].includes(data.type)) {
        blocks.push(data);
      }
    } catch {}
    return "";
  }).trim();
  return { display, blocks };
}

function CreateCard({ data, onDone }: { data: CreateData; onDone: () => void }) {
  const [status, setStatus] = useState<"idle" | "creating" | "done" | "error">("idle");
  const [error, setError] = useState("");

  const handleCreate = async () => {
    setStatus("creating");
    const fd = new FormData();
    fd.append("title", data.title || "");
    fd.append("category", data.category || "");
    fd.append("tags", (data.tags || []).join(","));

    try {
      let result: { success?: boolean; error?: string; id?: string };
      switch (data.type) {
        case "note":
          fd.append("content", data.content || "");
          result = await createNote(fd);
          break;
        case "resource":
          fd.append("url", data.url || "");
          fd.append("notes", data.notes || "");
          fd.append("reason", data.reason || "");
          result = await createResource(fd);
          break;
        case "prompt":
          fd.append("prompt", data.prompt || "");
          fd.append("useCase", data.useCase || "");
          result = await createPrompt(fd);
          break;
        case "project":
          fd.append("description", data.description || "");
          fd.append("status", data.status || "");
          fd.append("techStack", data.techStack || "");
          result = await createProject(fd);
          break;
      }
      if (result?.success) {
        setStatus("done");
        setTimeout(onDone, 2000);
      } else {
        setError(result?.error || "Failed to create");
        setStatus("error");
      }
    } catch {
      setError("Something went wrong");
      setStatus("error");
    }
  };

  const Icon = TYPE_ICONS[data.type] || StickyNote;

  if (status === "done") {
    return (
      <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-green-500/20 bg-green-500/5 text-sm text-green-600">
        <CheckCircle2 className="h-4 w-4 shrink-0" />
        {TYPE_LABELS[data.type]} created
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-red-500/20 bg-red-500/5 text-sm text-red-600">
        <AlertCircle className="h-4 w-4 shrink-0" />
        {error}
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border/20 bg-card/40 overflow-hidden">
      <div className="flex items-center gap-3 px-4 py-3 border-b border-border/10">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-muted/50">
          <Icon className={`h-4 w-4 ${TYPE_COLORS[data.type]}`} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-foreground/80 truncate">{data.title || "Untitled"}</p>
          <p className="text-[11px] text-muted-foreground">{TYPE_LABELS[data.type]}</p>
        </div>
        <span className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground/40 px-2 py-0.5 rounded-md border border-border/20">
          Preview
        </span>
      </div>
      <div className="px-4 py-2.5 space-y-1">
        {(data.content || data.prompt || data.notes) && (
          <p className="text-xs text-muted-foreground/70 line-clamp-2 leading-relaxed">
            {(data.content || data.prompt || data.notes)}
          </p>
        )}
        {data.tags && data.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 pt-1">
            {data.tags.slice(0, 3).map((t) => (
              <span key={t} className="text-[10px] px-1.5 py-0.5 rounded-md bg-muted/40 text-muted-foreground">{t}</span>
            ))}
          </div>
        )}
      </div>
      <div className="flex gap-2 px-4 py-2.5 border-t border-border/10 bg-muted/10">
        <button
          onClick={handleCreate}
          disabled={status === "creating"}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 transition-all disabled:opacity-50"
        >
          {status === "creating" ? (
            <Loader2 className="h-3 w-3 animate-spin" />
          ) : (
            <Plus className="h-3 w-3" />
          )}
          Create {TYPE_LABELS[data.type]}
        </button>
      </div>
    </div>
  );
}

interface ChatUIProps {
  contextFrom?: string;
  onContextChange?: (context: string | null) => void;
}

export function ChatUI({ contextFrom, onContextChange }: ChatUIProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [isMac, setIsMac] = useState(false);
  const [activeCmd, setActiveCmd] = useState<string | null>(null);
  const cmdRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const messagesRef = useRef<Message[]>([]);
  const streamingRef = useRef(false);

  useEffect(() => { messagesRef.current = messages; }, [messages]);
  useEffect(() => { streamingRef.current = streaming; }, [streaming]);

  useEffect(() => {
    setIsMac(navigator.platform?.includes("Mac") ?? false);
  }, []);

  useEffect(() => {
    return () => abortRef.current?.abort();
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streaming]);

  const autoResize = useCallback(() => {
    const el = inputRef.current;
    if (el) {
      el.style.height = "auto";
      el.style.height = Math.min(el.scrollHeight, 200) + "px";
    }
  }, []);

  useEffect(() => {
    autoResize();
  }, [input, autoResize]);

  const sendMessage = useCallback(async () => {
    let q = input.trim();
    if (!q || streamingRef.current) return;

    let cmd: string | null = null;
    for (const c of COMMANDS) {
      if (q.startsWith(`/${c.id}`)) {
        cmd = c.id;
        q = q.slice(c.id.length + 1).trim();
        break;
      }
    }

    setActiveCmd(null);
    setInput("");

    const userMsg: Message = { id: nextMsgId++, role: "user", content: q };
    const assistantMsg: Message = { id: nextMsgId++, role: "assistant", content: "" };
    setMessages((prev) => [...prev, userMsg, assistantMsg]);
    setStreaming(true);

    const apiMsg = cmd ? `/${cmd}: ${q}` : q;
    const history = messagesRef.current.map((m) => ({ role: m.role, content: m.content }));
    if (contextFrom && onContextChange) onContextChange(contextFrom);
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: apiMsg, history, context: contextFrom }),
        signal: controller.signal,
      });

      if (!res.ok) {
        const text = await res.text();
        setMessages((prev) => {
          const next = [...prev];
          next[next.length - 1] = { ...next[next.length - 1], content: `Error: ${text}` };
          return next;
        });
        setStreaming(false);
        return;
      }

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const text = decoder.decode(value, { stream: true });
          setMessages((prev) => {
            const next = [...prev];
            const last = { ...next[next.length - 1] };
            last.content += text;
            next[next.length - 1] = last;
            return next;
          });
        }
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      if (err.name !== "AbortError") {
        setMessages((prev) => {
          const next = [...prev];
          next[next.length - 1] = { ...next[next.length - 1], content: `Error: ${err.message}` };
          return next;
        });
      }
    } finally {
      setStreaming(false);
      abortRef.current = null;
    }
  }, [input, contextFrom, onContextChange]);

  const clearChat = useCallback(() => {
    if (abortRef.current) abortRef.current.abort();
    setMessages([]);
    setStreaming(false);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "l") {
        e.preventDefault();
        clearChat();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [clearChat]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    },
    [sendMessage]
  );

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setInput(val);

    const match = val.match(/^\/(\w*)$/);
    if (match) {
      setActiveCmd(match[1] || "");
    } else if (!val.startsWith("/")) {
      setActiveCmd(null);
    }
  }, []);

  const handleCmdSelect = useCallback((id: string) => {
    setInput(`/${id} `);
    setActiveCmd(null);
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (cmdRef.current && !cmdRef.current.contains(e.target as Node) && inputRef.current && !inputRef.current.contains(e.target as Node)) {
        setActiveCmd(null);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const filteredCmds = activeCmd !== null
    ? COMMANDS.filter((c) => c.id.startsWith(activeCmd || ""))
    : [];

  const suggestions = contextFrom && CONTEXT_SUGGESTIONS[contextFrom]
    ? CONTEXT_SUGGESTIONS[contextFrom].actions
    : DEFAULT_SUGGESTIONS;

  return (
    <div className="flex flex-col h-full">
      {/* Context bar */}
      {contextFrom && messages.length === 0 && (
        <div className="shrink-0 px-8 pt-5">
          <div className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-accent/10 border border-accent/20">
            <span className="text-xs font-medium text-accent">Context: {CONTEXT_SUGGESTIONS[contextFrom]?.label || contextFrom}</span>
            <button
              onClick={() => onContextChange?.(null)}
              className="ml-auto flex h-5 w-5 items-center justify-center rounded-md hover:bg-accent/20 transition-colors"
              aria-label="Clear context"
            >
              <X className="h-3 w-3 text-accent" />
            </button>
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full px-8 py-8">
            <div className="text-center max-w-lg">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted mx-auto mb-6">
                <Bot className="h-7 w-7 text-foreground/70" />
              </div>
              <h2 className="text-xl font-semibold text-foreground mb-2 tracking-tight">
                Ask anything about your knowledge
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed mb-8 max-w-sm mx-auto">
                Ask questions, create vault items, discover connections across your notes, prompts, resources, and projects.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-w-md mx-auto">
                {suggestions.map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => setInput(suggestion)}
                    className="text-left px-3.5 py-2.5 rounded-xl border border-border/40 text-xs text-muted-foreground hover:text-foreground hover:border-border/70 hover:bg-muted/40 transition-all"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="px-8 py-6 max-w-3xl mx-auto">
            {messages.map((msg, idx) => (
              <div key={msg.id} className="mb-10 last:mb-0">
                {msg.role === "user" ? (
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex h-5 w-5 items-center justify-center rounded-md bg-muted/50">
                        <div className="h-2 w-2 rounded-full bg-foreground/30" />
                      </div>
                      <span className="text-xs font-medium text-muted-foreground/60 tracking-wide">You asked</span>
                    </div>
                    <div className="ml-7">
                      <p className="text-sm text-foreground/70 whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                    </div>
                    <div className="mt-4 h-px bg-border/15" />
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-primary/10">
                        <Bot className="h-3.5 w-3.5 text-primary" />
                      </div>
                      <span className="text-xs font-semibold text-foreground/50 tracking-widest uppercase">Second Brain</span>
                    </div>

                    {streaming && !msg.content && <SearchingIndicator />}

                    {msg.content && (
                      <AIMessageContent content={msg.content} streaming={streaming && idx === messages.length - 1} />
                    )}

                    {streaming && msg.content && idx === messages.length - 1 && (
                      <div className="flex items-center gap-1.5 mt-4 text-xs text-muted-foreground/40">
                        <span className="inline-block h-1 w-1 rounded-full bg-foreground/30 animate-pulse" />
                        <span className="inline-block h-1 w-1 rounded-full bg-foreground/30 animate-pulse delay-100" />
                        <span className="inline-block h-1 w-1 rounded-full bg-foreground/30 animate-pulse delay-200" />
                      </div>
                    )}

                    {!streaming && msg.content && <ActionButtons content={msg.content} />}
                  </div>
                )}
              </div>
            ))}
            <div ref={endRef} />
          </div>
        )}
      </div>

      {/* Input */}
      <div className="shrink-0 border-t border-border/10 bg-gradient-to-t from-background via-background to-transparent pt-2">
        <div className="px-8 pb-4 pt-1 max-w-3xl mx-auto w-full relative">
          {activeCmd !== null && filteredCmds.length > 0 && (
            <div
              ref={cmdRef}
              className="absolute bottom-full left-8 right-8 mb-2 rounded-xl border border-border/30 bg-card shadow-lg overflow-hidden"
            >
              {filteredCmds.map((cmd) => (
                <button
                  key={cmd.id}
                  onClick={() => handleCmdSelect(cmd.id)}
                  className="flex items-center gap-3 w-full px-4 py-2.5 text-left text-sm hover:bg-muted/40 transition-colors"
                >
                  <cmd.icon className={`h-4 w-4 ${cmd.color}`} />
                  <div>
                    <span className="text-foreground/80 font-medium">/{cmd.id}</span>
                    <span className="text-muted-foreground ml-2 text-xs">{cmd.label}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
          <div className="relative flex items-end gap-2 rounded-xl border border-border/40 bg-muted/30 px-4 py-2.5 focus-within:border-primary/30 focus-within:bg-muted/40 transition-all">
            <textarea
              ref={inputRef}
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder={activeCmd !== null ? "Describe what to create..." : "Ask anything... (type / for commands)"}
              disabled={streaming}
              rows={1}
              className="flex-1 resize-none bg-transparent text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none disabled:opacity-40 leading-relaxed py-0.5"
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim() || streaming}
              aria-label="Send message"
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-all disabled:opacity-25 disabled:hover:bg-primary shadow-sm"
            >
              {streaming ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <ArrowUp className="h-4 w-4" />
              )}
            </button>
          </div>
          <div className="flex items-center justify-between mt-2 px-1">
            <p className="text-[11px] text-muted-foreground/40">
              Enter to send · Shift+Enter for new line · {isMac ? "⌘L" : "Ctrl+L"} to clear
            </p>
            <p className="text-[11px] text-muted-foreground/40 font-mono">
              {input.length}/2000
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function AIMessageContent({ content, streaming }: { content: string; streaming: boolean }) {
  const { display, blocks } = useMemo(() => parseCreateBlocks(content), [content]);
  const sections = useMemo(() => parseSections(display), [display]);
  const [doneBlocks, setDoneBlocks] = useState<Set<number>>(new Set());

  return (
    <div className="space-y-2.5">
      {sections.map((section, i) => (
        <SectionBlock
          key={i}
          heading={section.heading}
          body={section.body}
          defaultOpen={streaming || i < 2}
        />
      ))}
      {!streaming && blocks.length > 0 && (
        <div className="space-y-2 pt-2">
          {blocks.map((block, i) => (
            !doneBlocks.has(i) && (
              <CreateCard key={i} data={block} onDone={() => setDoneBlocks(new Set([...doneBlocks, i]))} />
            )
          ))}
        </div>
      )}
    </div>
  );
}
