import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ExternalLink, Bookmark, Calendar, Heart } from "lucide-react";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { Button } from "@devventory/ui";
import { LinkedItems } from "@/components/shared/linked-items";
import { includeTags, flattenItemTags } from "@/lib/tags";
import { RESOURCE_CATEGORY_COLORS } from "@devventory/types";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ResourceDetailPage({ params }: PageProps) {
  const session = await auth();
  const userId = session?.user?.id;
  const { id } = await params;

  const resource = await prisma.resource.findUnique({ where: { id }, ...includeTags });
  if (!resource || (userId && resource.userId !== userId)) notFound();

  const item = flattenItemTags(resource);
  const catColor = RESOURCE_CATEGORY_COLORS[item.category] || "bg-muted text-muted-foreground";

  let domain = item.url;
  try {
    domain = new URL(item.url).hostname.replace("www.", "");
  } catch {}

  return (
    <div className="max-w-3xl min-h-full">
      {/* Back */}
      <Link href="/resources">
        <Button variant="ghost" size="sm" className="h-8 gap-1.5 text-sm text-muted-foreground mb-4 -ml-2">
          <ArrowLeft className="h-4 w-4" />
          Resources
        </Button>
      </Link>

      {/* Title */}
      <div className="flex items-start gap-4 mb-6">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-muted">
          <Bookmark className="h-5 w-5 text-secondary-foreground" />
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">{item.title}</h1>
          <div className="flex items-center gap-3 mt-2">
            <span className={`text-xs font-medium px-2 py-0.5 rounded capitalize ${catColor}`}>{item.category}</span>
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground hover:text-foreground hover:scale-[1.02] transition-all duration-150 inline-flex items-center gap-1.5"
            >
              {domain}
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      </div>

      <div className="space-y-8">
        {/* Reason / Context */}
        {item.reason && (
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-start gap-3">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <Heart className="h-3.5 w-3.5 text-primary" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-foreground mb-1">Why I saved this</h2>
                <p className="text-sm text-foreground/80 leading-relaxed">{item.reason}</p>
              </div>
            </div>
          </div>
        )}

        {/* Notes */}
        {item.notes && (
          <div className="rounded-xl border border-border bg-card p-5">
            <h2 className="text-sm font-semibold text-foreground mb-3">Notes</h2>
            <p className="text-sm text-foreground/80 leading-relaxed whitespace-pre-wrap">{item.notes}</p>
          </div>
        )}

        {/* Metadata Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
              <Calendar className="h-3.5 w-3.5" />
              Saved
            </div>
            <p className="text-sm font-medium text-foreground">{formatDate(item.createdAt)}</p>
          </div>

          {item.favorite && (
            <div className="rounded-xl border border-border bg-card p-4">
              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                <Heart className="h-3.5 w-3.5" />
                Status
              </div>
              <p className="text-sm font-medium text-red-400">Favorited</p>
            </div>
          )}

          <div className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
              <Bookmark className="h-3.5 w-3.5" />
              Source
            </div>
            <p className="text-sm font-medium text-foreground truncate">{domain}</p>
          </div>
        </div>

        {/* Tags */}
        {item.tags.length > 0 && (
          <div>
            <h2 className="text-xs font-semibold text-section-foreground uppercase tracking-[0.1em] mb-3">Tags</h2>
            <div className="flex flex-wrap gap-1.5">
              {item.tags.map((tag) => (
                <Link
                  key={tag}
                  href={`/resources?q=${tag}`}
                  className="px-2.5 py-1 rounded-lg text-xs font-medium bg-muted text-secondary-foreground hover:text-foreground hover:bg-muted/80 hover:scale-[1.03] transition-all duration-150"
                >
                  {tag}
                </Link>
              ))}
            </div>
          </div>
        )}

        <LinkedItems type="resource" id={item.id} />

        {/* Actions */}
        <div className="flex items-center gap-3 pt-4 border-t border-border">
          <a href={item.url} target="_blank" rel="noopener noreferrer">
            <Button variant="default" size="sm" className="h-8 text-xs gap-1.5">
              <ExternalLink className="h-3.5 w-3.5" />
              Open resource
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
}

function formatDate(date: Date): string {
  const now = Date.now();
  const diff = now - date.getTime();
  const days = Math.floor(diff / 86400000);

  if (days < 1) return "Today";
  if (days < 2) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
  if (days < 365) return `${Math.floor(days / 30)} months ago`;
  return date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}
