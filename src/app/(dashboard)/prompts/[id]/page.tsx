import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Sparkles, Star, Copy, Calendar, Clock, Hash, Bookmark } from "lucide-react";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { LinkedItems } from "@/components/shared/linked-items";
import { includeTags, flattenItemTags, flattenListTags } from "@/lib/tags";

interface PageProps {
  params: Promise<{ id: string }>;
}

const categoryColors: Record<string, string> = {
  coding: "bg-sky-500/10 text-sky-400",
  debugging: "bg-rose-500/10 text-rose-400",
  architecture: "bg-purple-500/10 text-purple-400",
  testing: "bg-emerald-500/10 text-emerald-400",
  docs: "bg-amber-500/10 text-amber-400",
  writing: "bg-pink-500/10 text-pink-400",
};

export default async function PromptDetailPage({ params }: PageProps) {
  const session = await auth();
  const userId = session?.user?.id;
  const { id } = await params;

  const prompt = await prisma.prompt.findUnique({ where: { id }, ...includeTags });
  if (!prompt || (userId && prompt.userId !== userId)) notFound();

  const item = flattenItemTags(prompt);
  const catColor = categoryColors[item.category] || "bg-muted text-muted-foreground";

  // Find related prompts (same category, excluding current)
  const rawRelated = userId
    ? await prisma.prompt.findMany({
        where: { userId, category: item.category, id: { not: item.id } },
        orderBy: { useCount: "desc" },
        take: 3,
        ...includeTags,
      })
    : [];
  const relatedPrompts = flattenListTags(rawRelated);

  return (
    <div className="max-w-3xl">
      {/* Back */}
      <Link href="/prompts">
        <Button variant="ghost" size="sm" className="h-8 gap-1.5 text-sm text-muted-foreground mb-4 -ml-2">
          <ArrowLeft className="h-4 w-4" />
          Prompt Library
        </Button>
      </Link>

      {/* Title */}
      <div className="flex items-start gap-4 mb-8">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-muted">
          <Sparkles className="h-5 w-5 text-secondary-foreground" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">{item.title}</h1>
            {item.favorite && <Star className="h-5 w-5 text-amber-400 fill-amber-400 shrink-0" />}
          </div>
          <div className="flex items-center gap-3 mt-1.5">
            <span className={`text-xs font-medium px-2 py-0.5 rounded capitalize ${catColor}`}>{item.category}</span>
            {item.useCase && (
              <span className="text-sm text-secondary-foreground">{item.useCase}</span>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-8">
        {/* Usage Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
              <Hash className="h-3.5 w-3.5" />
              Times Used
            </div>
            <p className="text-sm font-medium text-foreground">{item.useCount} time{item.useCount !== 1 ? "s" : ""}</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
              <Clock className="h-3.5 w-3.5" />
              Last Used
            </div>
            <p className="text-sm font-medium text-foreground">
              {item.lastUsedAt ? formatDate(item.lastUsedAt) : "Never used"}
            </p>
          </div>
          <div className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
              <Calendar className="h-3.5 w-3.5" />
              Created
            </div>
            <p className="text-sm font-medium text-foreground">{formatDate(item.createdAt)}</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
              <Bookmark className="h-3.5 w-3.5" />
              Use Case
            </div>
            <p className="text-sm font-medium text-foreground truncate">{item.useCase || "General"}</p>
          </div>
        </div>

        {/* Prompt Content */}
        <div className="rounded-xl border border-border bg-card">
          <div className="flex items-center justify-between px-5 py-3 border-b border-border">
            <h2 className="text-sm font-semibold text-foreground">Prompt</h2>
            <form action={async () => {
              "use server";
              const { recordPromptUsage } = await import("@/actions/prompts");
              await recordPromptUsage(item.id);
            }}>
              <Button type="submit" variant="ghost" size="sm" className="h-7 text-xs gap-1.5 text-muted-foreground hover:text-foreground">
                <Copy className="h-3.5 w-3.5" />
                Copy
              </Button>
            </form>
          </div>
          <div className="p-5">
            <pre className="text-sm text-foreground/90 leading-relaxed whitespace-pre-wrap font-sans">
              {item.prompt}
            </pre>
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
                  href={`/prompts?q=${tag}`}
                  className="px-2.5 py-1 rounded-lg text-xs font-medium bg-muted text-secondary-foreground hover:text-foreground hover:bg-muted/80 hover:scale-[1.03] transition-all duration-150"
                >
                  {tag}
                </Link>
              ))}
            </div>
          </div>
        )}

        <LinkedItems type="prompt" id={item.id} />

        {/* Related Prompts */}
        {relatedPrompts.length > 0 && (
          <div>
            <h2 className="text-xs font-semibold text-section-foreground uppercase tracking-[0.1em] mb-3">Related Prompts</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {relatedPrompts.map((rp) => (
                <Link
                  key={rp.id}
                  href={`/prompts/${rp.id}`}
                  className="group rounded-lg border border-border bg-card p-3 transition-all hover:border-[var(--border-hover)] hover:shadow-[var(--shadow-elevated)]"
                >
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-3.5 w-3.5 shrink-0 text-secondary-foreground group-hover:text-primary transition-colors" />
                    <span className="text-xs font-medium text-foreground truncate">{rp.title}</span>
                  </div>
                  {rp.useCase && (
                    <p className="text-[11px] text-muted-foreground mt-1 truncate">{rp.useCase}</p>
                  )}
                </Link>
              ))}
            </div>
          </div>
        )}
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
