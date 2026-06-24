import { Sparkles, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PromptEmptyProps {
  hasSearch: boolean;
  searchQuery?: string;
  onCreate: () => void;
}

export function PromptEmpty({ hasSearch, searchQuery, onCreate }: PromptEmptyProps) {
  if (hasSearch) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted mb-5">
          <Sparkles className="h-6 w-6 text-secondary-foreground" />
        </div>
        <h3 className="text-base font-semibold text-foreground mb-1.5">No prompts found</h3>
        <p className="text-sm text-secondary-foreground max-w-xs">
          No prompts match &ldquo;{searchQuery}&rdquo;. Try a different search term.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted mb-5">
        <Sparkles className="h-6 w-6 text-secondary-foreground" />
      </div>
      <h3 className="text-base font-semibold text-foreground mb-1.5">Your prompt library is empty</h3>
      <p className="text-sm text-secondary-foreground max-w-sm mb-6 leading-relaxed">
        Build your personal toolkit of reusable AI prompts. Save workflows, templates, system instructions, and agent prompts you use every day.
      </p>
      <Button onClick={onCreate} className="gap-1.5 text-sm h-9">
        <Plus className="h-4 w-4" />
        Create your first prompt
      </Button>
    </div>
  );
}
