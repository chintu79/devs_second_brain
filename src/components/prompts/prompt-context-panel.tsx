import { Sparkles, Star, Copy } from "lucide-react";
import Link from "next/link";

interface PromptContextPanelProps {
  favorites: Array<{ id: string; title: string }>;
  recentPrompts: Array<{ id: string; title: string }>;
}

export function PromptContextPanel({ favorites, recentPrompts }: PromptContextPanelProps) {
  return (
    <aside className="hidden xl:flex w-[280px] shrink-0 flex-col border-l border-border/50 bg-background overflow-y-auto">
      <div className="p-5 space-y-8">
        {/* Favorites */}
        {favorites.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[10px] font-semibold text-section-foreground uppercase tracking-[0.12em]">Favorites</h3>
            </div>
            <div className="space-y-1">
              {favorites.slice(0, 5).map((p) => (
                <Link
                  key={p.id}
                  href={`/prompts/${p.id}`}
                  className="group flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs text-foreground/80 hover:text-foreground hover:bg-muted/40 hover:scale-[1.02] transition-all duration-150"
                >
                  <Star className="h-3.5 w-3.5 shrink-0 text-amber-400 fill-amber-400" />
                  <span className="truncate">{p.title}</span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Recently Used */}
        {recentPrompts.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[10px] font-semibold text-section-foreground uppercase tracking-[0.12em]">Recently Used</h3>
              <Link href="/prompts" className="text-[10px] font-medium text-section-foreground hover:text-foreground transition-colors">
                All prompts
              </Link>
            </div>
            <div className="space-y-1">
              {recentPrompts.slice(0, 5).map((p) => (
                <Link
                  key={p.id}
                  href={`/prompts/${p.id}`}
                  className="group flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs text-foreground/80 hover:text-foreground hover:bg-muted/40 hover:scale-[1.02] transition-all duration-150"
                >
                  <Sparkles className="h-3.5 w-3.5 shrink-0 text-secondary-foreground group-hover:text-primary transition-colors" />
                  <span className="truncate">{p.title}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
