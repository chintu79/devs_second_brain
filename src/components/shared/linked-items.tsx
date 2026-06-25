import Link from "next/link";
import { Bookmark, FileText, Sparkles, FolderKanban, Link as LinkIcon } from "lucide-react";
import { getReferences, type ItemType } from "@/actions/references";

const typeConfig: Record<string, { icon: React.ElementType; color: string; href: (id: string) => string }> = {
  resource: { icon: Bookmark, color: "#14B8A6", href: (id) => `/resources/${id}` },
  note: { icon: FileText, color: "#22C55E", href: (id) => `/notes?id=${id}` },
  prompt: { icon: Sparkles, color: "#F59E0B", href: (id) => `/prompts/${id}` },
  project: { icon: FolderKanban, color: "#8B5CF6", href: (id) => `/projects/${id}` },
};

interface LinkedItemsProps {
  type: ItemType;
  id: string;
}

export async function LinkedItems({ type, id }: LinkedItemsProps) {
  const groups = await getReferences(type, id);

  if (groups.length === 0) return null;

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <LinkIcon className="h-4 w-4 text-muted-foreground" />
        <h2 className="text-xs font-semibold text-section-foreground uppercase tracking-[0.1em]">Linked Items</h2>
        <span className="text-[11px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
          {groups.reduce((sum, g) => sum + g.items.length, 0)}
        </span>
      </div>

      <div className="space-y-3">
        {groups.map((group) => {
          const cfg = typeConfig[group.type];
          if (!cfg) return null;
          const Icon = cfg.icon;
          return (
            <div key={group.type}>
              <div className="flex items-center gap-1.5 mb-1.5 text-[10px] font-semibold uppercase tracking-[0.1em]" style={{ color: cfg.color }}>
                <Icon className="h-3 w-3" />
                {group.type}s
              </div>
              <div className="space-y-0.5">
                {group.items.map((item) => (
                  <Link
                    key={`${item.type}:${item.id}`}
                    href={cfg.href(item.id)}
                    className="group flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm text-foreground/80 hover:text-foreground hover:bg-muted/40 hover:scale-[1.02] transition-all duration-150"
                  >
                    <Icon className="h-3.5 w-3.5 shrink-0" style={{ color: cfg.color }} />
                    <span className="truncate">{item.title}</span>
                  </Link>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
