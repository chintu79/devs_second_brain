"use client";

import { useState, useCallback } from "react";
import { AnimatePresence } from "framer-motion";
import { useSearchParams, useRouter } from "next/navigation";
import { ChatUI } from "./chat-ui";
import { ChatContextPanel } from "./chat-context-panel";

interface VaultItem {
  id: string;
  title: string;
  tags?: string[];
  category?: string;
  description?: string;
}

interface ChatWorkspaceProps {
  resources?: VaultItem[];
  notes?: VaultItem[];
  prompts?: VaultItem[];
  projects?: VaultItem[];
}

export function ChatWorkspace({ resources, notes, prompts, projects }: ChatWorkspaceProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const contextFrom = searchParams.get("from") || undefined;

  const [activeContext, setActiveContext] = useState<string | undefined>(contextFrom);

  const handleContextChange = useCallback(
    (newContext: string | null) => {
      setActiveContext(newContext || undefined);
      const params = new URLSearchParams(searchParams.toString());
      if (newContext) {
        params.set("from", newContext);
      } else {
        params.delete("from");
      }
      const qs = params.toString();
      const url = qs ? `/chat?${qs}` : "/chat";
      router.replace(url, { scroll: false });
    },
    [router, searchParams]
  );

  const hasItems = (resources?.length ?? 0) + (notes?.length ?? 0) + (prompts?.length ?? 0) + (projects?.length ?? 0) > 0;

  return (
    <div className="flex h-full" data-accent="chat">
      {/* Main chat area */}
      <div className="flex-1 min-w-0 flex flex-col">
        <ChatUI
          contextFrom={activeContext}
          onContextChange={handleContextChange}
        />
      </div>

      {/* Context panel (right sidebar) */}
      <AnimatePresence mode="wait">
        {(activeContext || hasItems) && (
          <ChatContextPanel
            key={activeContext || "default"}
            contextFrom={activeContext}
            resources={resources}
            notes={notes}
            prompts={prompts}
            projects={projects}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
