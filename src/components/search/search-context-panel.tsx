"use client";

import { Clock, Search, TrendingUp, FolderKanban } from "lucide-react";

interface SearchContextPanelProps {
  recentSearches: string[];
  recentlyViewed: { id: string; title: string; type: string }[];
  onSearchClick: (query: string) => void;
}

export function SearchContextPanel({ recentSearches, recentlyViewed, onSearchClick }: SearchContextPanelProps) {
  return (
    <div className="w-64 shrink-0 border-l border-border/30 bg-muted/20 overflow-y-auto px-4 py-5 space-y-6">
      {/* Recent Searches */}
      {recentSearches.length > 0 && (
        <ContextSection icon={Clock} label="Recent Searches">
          <div className="space-y-0.5">
            {recentSearches.map((q, i) => (
              <button
                key={i}
                onClick={() => onSearchClick(q)}
                className="w-full rounded-md px-2 py-1.5 text-sm text-foreground/80 hover:bg-muted/60 hover:scale-[1.02] transition-all duration-150 text-left truncate"
              >
                {q}
              </button>
            ))}
          </div>
        </ContextSection>
      )}

      {/* Recently Viewed */}
      {recentlyViewed.length > 0 && (
        <ContextSection icon={Search} label="Recently Viewed">
          <div className="space-y-1">
            {recentlyViewed.slice(0, 5).map((item) => (
              <div key={item.id} className="rounded-md px-2 py-1.5 hover:bg-muted/60 hover:scale-[1.02] transition-all duration-150 cursor-pointer">
                <p className="text-sm font-medium text-foreground/90 truncate">{item.title}</p>
                <p className="text-xs text-muted-foreground capitalize">{item.type}</p>
              </div>
            ))}
          </div>
        </ContextSection>
      )}

      {/* Suggested */}
      <ContextSection icon={TrendingUp} label="Suggested">
        <div className="space-y-1">
          {suggested.map((s) => (
            <button
              key={s}
              onClick={() => onSearchClick(s)}
              className="w-full rounded-md px-2 py-1.5 text-sm text-foreground/80 hover:bg-muted/60 hover:scale-[1.02] transition-all duration-150 text-left truncate"
            >
              {s}
            </button>
          ))}
        </div>
      </ContextSection>

      {/* Continue Working */}
      <ContextSection icon={FolderKanban} label="Continue Working">
        <div className="rounded-lg border border-border/40 bg-card p-3 text-center">
          <p className="text-xs text-muted-foreground">
            Your recent projects and notes will appear here as you work
          </p>
        </div>
      </ContextSection>
    </div>
  );
}

const suggested = [
  "AI tools for development",
  "React component libraries",
  "Database ORM comparisons",
  "Testing frameworks",
  "CLI tools",
];

function ContextSection({
  icon: Icon, label, children,
}: {
  icon: React.ComponentType<{ className?: string }>; label: string; children: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-2">
        <Icon className="h-3.5 w-3.5" />
        <span>{label}</span>
      </div>
      {children}
    </div>
  );
}
