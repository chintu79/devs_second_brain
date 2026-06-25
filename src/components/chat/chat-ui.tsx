"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Bot, Send, Trash2, Loader2, User } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export function ChatUI() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streaming]);

  const sendMessage = useCallback(async () => {
    const q = input.trim();
    if (!q || streaming) return;
    setInput("");

    const userMsg: Message = { role: "user", content: q };
    const assistantMsg: Message = { role: "assistant", content: "" };
    setMessages((prev) => [...prev, userMsg, assistantMsg]);
    setStreaming(true);

    const history = messages.map((m) => ({ role: m.role, content: m.content }));
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: q, history }),
        signal: controller.signal,
      });

      if (!res.ok) {
        const text = await res.text();
        setMessages((prev) => {
          const next = [...prev];
          next[next.length - 1] = { role: "assistant", content: `Error: ${text}` };
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
    } catch (err: any) {
      if (err.name !== "AbortError") {
        setMessages((prev) => {
          const next = [...prev];
          next[next.length - 1] = { role: "assistant", content: `Error: ${err.message}` };
          return next;
        });
      }
    } finally {
      setStreaming(false);
      abortRef.current = null;
    }
  }, [input, messages, streaming]);

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

  return (
    <div className="flex flex-col h-full" data-accent="chat">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full px-4">
            <div className="text-center max-w-md">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-muted mx-auto mb-6">
                <Bot className="h-6 w-6 text-foreground" />
              </div>
              <h2 className="text-xl font-semibold text-foreground mb-3">Chat with your Second Brain</h2>
              <p className="text-sm text-muted-foreground leading-relaxed mb-8">
                Ask questions about your saved resources, prompts, notes, and projects. The AI searches your vault for relevant context.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {[
                  "What have I been learning about React?",
                  "Find prompts related to TypeScript",
                  "Summarize my notes on system design",
                  "What projects am I currently building?",
                ].map((suggestion) => (
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
            {messages.map((msg, i) => (
              <div key={i} className="mb-6 last:mb-0">
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
                      <div className="prose prose-sm dark:prose-invert max-w-none text-foreground/90 leading-relaxed">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {msg.content || (streaming && i === messages.length - 1 ? "" : "")}
                        </ReactMarkdown>
                        {streaming && i === messages.length - 1 && !msg.content && (
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
            placeholder="Ask about your vault..."
            disabled={streaming}
            rows={1}
            className="flex-1 resize-none bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none disabled:opacity-50 leading-relaxed max-h-32"
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim() || streaming}
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
