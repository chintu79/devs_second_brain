import { Bookmark, Plus, Download } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface ResourceEmptyProps {
  hasSearch: boolean;
  searchQuery?: string;
  onCreate: () => void;
}

export function ResourceEmpty({ hasSearch, searchQuery, onCreate }: ResourceEmptyProps) {
  if (hasSearch) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted mb-5">
          <Bookmark className="h-6 w-6 text-secondary-foreground" />
        </div>
        <h3 className="text-base font-semibold text-foreground mb-1.5">No results found</h3>
        <p className="text-sm text-secondary-foreground max-w-xs">
          No resources match &ldquo;{searchQuery}&rdquo;. Try a different search term.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted mb-5">
        <Bookmark className="h-6 w-6 text-secondary-foreground" />
      </div>
      <h3 className="text-base font-semibold text-foreground mb-1.5">Your knowledge library is empty</h3>
      <p className="text-sm text-secondary-foreground max-w-sm mb-6 leading-relaxed">
        Start building your curated collection of developer resources. Save articles, repos, tools, and everything you want to remember.
      </p>
      <div className="flex items-center gap-3">
        <Button onClick={onCreate} className="gap-1.5 text-sm h-9">
          <Plus className="h-4 w-4" />
          Add Resource
        </Button>
        <Link href="/resources">
          <Button variant="outline" className="gap-1.5 text-sm h-9">
            <Download className="h-4 w-4" />
            Import Resources
          </Button>
        </Link>
      </div>
    </div>
  );
}
