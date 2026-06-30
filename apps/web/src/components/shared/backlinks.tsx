"use client";

import { useState, useEffect } from "react";
import { Link2 } from "lucide-react";
import { getBacklinks, type Backlink } from "@/actions/backlinks";

const typeColors: Record<string, string> = {
  note: "text-green-400",
  resource: "text-teal-400",
  prompt: "text-amber-400",
  project: "text-purple-400",
};

export function Backlinks({ title, excludeId }: { title: string; excludeId: string }) {
  const [items, setItems] = useState<Backlink[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getBacklinks(title, excludeId).then((res) => {
      setItems(res);
      setLoading(false);
    });
  }, [title, excludeId]);

  if (loading) return null;
  if (items.length === 0) return null;

  return (
    <div>
      <p className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1.5">
        <Link2 className="h-3 w-3" />
        Referenced in {items.length} {items.length === 1 ? "item" : "items"}
      </p>
      <div className="flex flex-col gap-1.5">
        {items.map((item) => (
          <a
            key={`${item.type}-${item.id}`}
            href={`/${item.type === "note" ? "notes" : item.type === "resource" ? "resources" : item.type === "prompt" ? "prompts" : "projects"}`}
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-md text-xs bg-muted/40 hover:bg-muted/60 transition-all hover:scale-[1.02]"
          >
            <span className={`shrink-0 font-medium ${typeColors[item.type]}`}>
              {item.type}
            </span>
            <span className="text-foreground/80 truncate">{item.title}</span>
          </a>
        ))}
      </div>
    </div>
  );
}
