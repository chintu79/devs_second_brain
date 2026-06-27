"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Markdown } from "@/components/shared/markdown";
import { Bot, Send, Loader2, User, X, Copy, Check } from "lucide-react";

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

interface ChatUIProps {
  contextFrom?: string;
  onContextChange?: (context: string | null) => void;
}

export function ChatUI({ contextFrom, onContextChange }: ChatUIProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const messagesRef = useRef<Message[]>([]);
  const streamingRef = useRef(false);

  useEffect(() => { messagesRef.current = messages; }, [messages]);
  useEffect(() => { streamingRef.current = streaming; }, [streaming]);

  useEffect(() => {
    return () => abortRef.current?.abort();
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streaming]);

  const sendMessage = useCallback(async () => {
    const q = input.trim();
    if (!q || streamingRef.current) return;
    setInput("");

    const userMsg: Message = { id: nextMsgId++, role: "user", content: q };
    const assistantMsg: Message = { id: nextMsgId++, role: "assistant", content: "" };
    setMessages((prev) => [...prev, userMsg, assistantMsg]);
    setStreaming(true);

    const history = messagesRef.current.map((m) => ({ role: m.role, content: m.content }));
    if (contextFrom && onContextChange) onContextChange(contextFrom);
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: q, history, context: contextFrom }),
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

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    },
    [sendMessage]
  );

function MessageContent({ content }: { content: string }) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const copyCode = useCallback(async (code: string, index: number) => {
    await navigator.clipboard.writeText(code);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  }, []);

  const codeBlocks = useRef<HTMLDivElement>(null);

  return (
    <div className="chat-message-content">
      <Markdown
        components={{
          pre: ({ children }) => <>{children}</>,
          code: ({ className, children, ...props }) => {
            const isInline = !className;
            if (isInline) {
              return (
                <code className="rounded bg-muted px-1.5 py-0.5 text-sm font-mono text-foreground/80 border border-border/30" {...props}>
                  {children}
                </code>
              );
            }
            const match = /language-(\w+)/.exec(className || "");
            const lang = match ? match[1] : "";
            const code = String(children).replace(/\n$/, "");
            return (
              <div className="relative my-4 rounded-xl border border-border/40 bg-card overflow-hidden group/code">
                <div className="flex items-center justify-between px-4 py-2 bg-muted/50 border-b border-border/30">
                  <span className="text-[11px] font-mono text-muted-foreground uppercase tracking-wider">
                    {lang || "code"}
                  </span>
                  <button
                    onClick={() => copyCode(code, code.length)}
                    className="flex items-center gap-1.5 px-2 py-1 rounded-md text-xs text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-all opacity-0 group-hover/code:opacity-100"
                    aria-label={copiedIndex === code.length ? "Copied" : "Copy code"}
                  >
                    {copiedIndex === code.length ? (
                      <Check className="h-3.5 w-3.5 text-green-500" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                    {copiedIndex === code.length ? "Copied" : "Copy"}
                  </button>
                </div>
                <div className="overflow-x-auto p-4 text-sm leading-relaxed">
                  <code className="text-foreground/90 font-mono text-sm" {...props}>
                    {children}
                  </code>
                </div>
              </div>
            );
          },
        }}
      >
        {content}
      </Markdown>
    </div>
  );
}

  const suggestions = contextFrom && CONTEXT_SUGGESTIONS[contextFrom]
    ? CONTEXT_SUGGESTIONS[contextFrom].actions
    : DEFAULT_SUGGESTIONS;

  return (
    <div className="flex flex-col h-full">
      {/* Context bar */}
      {contextFrom && messages.length === 0 && (
        <div className="shrink-0 px-6 pt-4">
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-accent/10 border border-accent/20">
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
          <div className="flex items-center justify-center h-full px-4 py-8">
            <div className="text-center max-w-md">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-muted mx-auto mb-6">
                <Bot className="h-6 w-6 text-foreground" />
              </div>
              <h2 className="text-xl font-semibold text-foreground mb-3">
                {contextFrom ? `Ask about your ${CONTEXT_SUGGESTIONS[contextFrom]?.label.toLowerCase() || "vault"}` : "Chat with your Second Brain"}
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed mb-8">
                {contextFrom
                  ? `Questions will include context from your current ${contextFrom} section.`
                  : "Ask questions about your saved resources, prompts, notes, and projects. The AI searches your vault for relevant context."}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
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
          <div className="px-4 py-6 max-w-3xl mx-auto">
            {messages.map((msg) => (
              <div key={msg.id} className="mb-6 last:mb-0 group">
                <div className="flex items-start gap-3">
                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                      msg.role === "assistant"
                        ? "bg-primary/10 text-primary"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {msg.role === "assistant" ? (
                      <Bot className="h-4 w-4" />
                    ) : (
                      <User className="h-4 w-4" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0 pt-1">
                    {msg.role === "assistant" ? (
                      <div className="max-w-none text-foreground/90 leading-relaxed">
                        <MessageContent content={msg.content} />
                        {streaming && msg.id === messages[messages.length - 1]?.id && !msg.content && (
                          <span className="inline-flex gap-0.5">
                            <span className="h-2 w-2 rounded-full bg-foreground/40 animate-bounce [animation-delay:0ms]" />
                            <span className="h-2 w-2 rounded-full bg-foreground/40 animate-bounce [animation-delay:150ms]" />
                            <span className="h-2 w-2 rounded-full bg-foreground/40 animate-bounce [animation-delay:300ms]" />
                          </span>
                        )}
                      </div>
                    ) : (
                      <p className="text-sm text-foreground whitespace-pre-wrap">{msg.content}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
            <div ref={endRef} />
          </div>
        )}
      </div>

      {/* Input */}
      <div className="shrink-0 px-4 pb-4 pt-2 max-w-3xl mx-auto w-full">
        <div className="relative flex items-end gap-2 rounded-2xl border border-border/50 bg-card px-4 py-3 focus-within:border-primary/30 focus-within:ring-1 focus-within:ring-primary/20 transition-all shadow-sm">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={contextFrom ? `Ask about your ${(CONTEXT_SUGGESTIONS[contextFrom]?.label || "vault").toLowerCase()}...` : "Ask about your vault..."}
            disabled={streaming}
            rows={1}
            className="flex-1 resize-none bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none disabled:opacity-50 leading-relaxed max-h-32"
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim() || streaming}
            aria-label="Send message"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-foreground/10 text-foreground/70 hover:bg-foreground/20 hover:text-foreground transition-all disabled:opacity-20 disabled:hover:bg-foreground/10"
          >
            {streaming ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </button>
        </div>
        <p className="text-[11px] text-muted-foreground/60 text-center mt-2">
          AI may produce inaccurate information. Verify important facts.
        </p>
      </div>
    </div>
  );
}
