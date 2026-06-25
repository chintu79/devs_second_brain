"use client";

import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface SearchBarProps {
  placeholder?: string;
  baseUrl: string;
  defaultValue?: string;
}

export function SearchBar({ placeholder = "Search...", baseUrl, defaultValue }: SearchBarProps) {
  const router = useRouter();

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const form = e.currentTarget;
        const data = new FormData(form);
        const q = data.get("q") as string;
        if (q?.trim()) {
          router.push(`${baseUrl}?q=${encodeURIComponent(q.trim())}`);
        } else {
          router.push(baseUrl);
        }
      }}
      className="flex gap-2"
    >
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-6 w-4 text-muted-foreground" />
        <Input
          name="q"
          defaultValue={defaultValue}
          placeholder={placeholder}
          className="pl-9"
        />
      </div>
      <Button type="submit" variant="secondary" size="sm">
        Search
      </Button>
    </form>
  );
}
