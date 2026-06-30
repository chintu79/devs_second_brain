import { Suspense } from "react";
import { auth } from "@/lib/auth";
import prisma, { safeQuery } from "@/lib/prisma";
import { getTagsWithCounts } from "@/actions/tags";
import { KnowledgeWorkspace } from "@/components/knowledge/knowledge-workspace";
import { includeTags, flattenListTags } from "@/lib/tags";

export default async function KnowledgePage() {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return (
      <div className="flex items-center justify-center h-48">
        <p className="text-sm text-muted-foreground">Sign in to explore your knowledge.</p>
      </div>
    );
  }

  const [tags, resources, prompts, notes, projects] = await Promise.all([
    getTagsWithCounts(),
    safeQuery("knowledge.resources", () => prisma.resource.findMany({ where: { userId }, orderBy: { createdAt: "desc" }, take: 200, ...includeTags }), []),
    safeQuery("knowledge.prompts", () => prisma.prompt.findMany({ where: { userId }, orderBy: { createdAt: "desc" }, take: 200, ...includeTags }), []),
    safeQuery("knowledge.notes", () => prisma.note.findMany({ where: { userId }, orderBy: { createdAt: "desc" }, take: 200, ...includeTags }), []),
    safeQuery("knowledge.projects", () => prisma.project.findMany({ where: { userId }, orderBy: { createdAt: "desc" }, take: 200, ...includeTags }), []),
  ]);

  return (
    <div data-accent="knowledge" className="absolute inset-0 flex overflow-hidden">
      <Suspense fallback={<div className="flex-1" />}>
        <KnowledgeWorkspace
          tags={tags}
          resources={flattenListTags(resources.map((r) => ({ ...r, url: r.url, category: r.category })))}
          prompts={flattenListTags(prompts.map((p) => ({ ...p, prompt: p.prompt })))}
          notes={flattenListTags(notes.map((n) => ({ ...n, content: n.content })))}
          projects={flattenListTags(projects.map((p) => ({ ...p, description: p.description, status: p.status, techStack: p.techStack, planMd: p.planMd })))}
        />
      </Suspense>
    </div>
  );
}
