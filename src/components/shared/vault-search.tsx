"use client";

import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

interface VaultSearchProps {
  placeholder?: string;
  baseUrl: string;
  defaultValue?: string;
  categories?: string[];
}

export function VaultSearch({ placeholder = "Search...", baseUrl, defaultValue, categories }: VaultSearchProps) {
  const router = useRouter();

  return (
    <div className="flex items-center gap-3">
      <div className="relative flex-1 max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          defaultValue={defaultValue}
          placeholder={placeholder}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              const value = (e.target as HTMLInputElement).value;
              if (value?.trim()) {
                router.push(`${baseUrl}?q=${encodeURIComponent(value.trim())}`);
              } else {
                router.push(baseUrl);
              }
            }
          }}
          className="flex h-9 w-full rounded-lg border border-border bg-muted pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all"
        />
      </div>
      {categories && categories.length > 0 && (
        <div className="flex gap-1 overflow-x-auto">
          <button
            onClick={() => router.push(baseUrl)}
            className="shrink-0 rounded-md px-2.5 py-1 text-xs font-medium bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => router.push(`${baseUrl}?category=${cat}`)}
              className="shrink-0 rounded-md px-2.5 py-1 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              {cat}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
