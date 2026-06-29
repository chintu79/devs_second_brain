import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  icon: React.ComponentType<{ className?: string }>;
  hasSearch: boolean;
  searchQuery?: string;
  searchLabel?: string;
  emptyTitle: string;
  emptyDescription: string;
  searchTitle?: string;
  searchDescription?: string;
  actionLabel: string;
  onCreate: () => void;
}

export function EmptyState({
  icon: Icon,
  hasSearch,
  searchQuery,
  searchLabel,
  emptyTitle,
  emptyDescription,
  searchTitle = "No results found",
  searchDescription,
  actionLabel,
  onCreate,
}: EmptyStateProps) {
  if (hasSearch) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted mb-5">
          <Icon className="h-6 w-6 text-secondary-foreground" />
        </div>
        <h3 className="text-base font-semibold text-foreground mb-1.5">{searchTitle}</h3>
        <p className="text-sm text-secondary-foreground max-w-xs">
          {searchDescription || `No ${searchLabel || "items"} match "${searchQuery}". Try a different search term.`}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted mb-5">
        <Icon className="h-6 w-6 text-secondary-foreground" />
      </div>
      <h3 className="text-base font-semibold text-foreground mb-1.5">{emptyTitle}</h3>
      <p className="text-sm text-secondary-foreground max-w-sm mb-6 leading-relaxed">
        {emptyDescription}
      </p>
      <Button onClick={onCreate} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 hover:scale-[1.03] transition-all">
        <Plus className="h-4 w-4" />
        {actionLabel}
      </Button>
    </div>
  );
}
