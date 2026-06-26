import { Suspense } from "react";
import { auth } from "@/lib/auth";
import prisma, { safeQuery } from "@/lib/prisma";
import { includeTags, flattenListTags } from "@/lib/tags";
import { GraphView } from "@/components/graph/graph-view";

async function getGraphData(userId: string) {
  const [resources, prompts, notes, projects] = await Promise.all([
    safeQuery("resources", () => prisma.resource.findMany({ where: { userId }, orderBy: { createdAt: "desc" }, take: 300, ...includeTags }), []),
    safeQuery("prompts", () => prisma.prompt.findMany({ where: { userId }, orderBy: { createdAt: "desc" }, take: 300, ...includeTags }), []),
    safeQuery("notes", () => prisma.note.findMany({ where: { userId }, orderBy: { createdAt: "desc" }, take: 300, ...includeTags }), []),
    safeQuery("projects", () => prisma.project.findMany({ where: { userId }, orderBy: { createdAt: "desc" }, take: 300, ...includeTags }), []),
  ]);

  return {
    resources: flattenListTags(resources.map((r) => ({ ...r, url: r.url, category: r.category }))),
    prompts: flattenListTags(prompts.map((p) => ({ ...p, prompt: p.prompt }))),
    notes: flattenListTags(notes).map((n) => ({ ...n, content: n.content, category: n.category })),
    projects: flattenListTags(projects.map((p) => ({ ...p, planMd: p.planMd }))),
  };
}

async function GraphContent({ userId }: { userId: string }) {
  const data = await getGraphData(userId);
  return (
    <GraphView
      resources={data.resources}
      prompts={data.prompts}
      notes={data.notes}
      projects={data.projects}
    />
  );
}

export default async function GraphPage() {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return (
      <div className="flex items-center justify-center h-48" data-accent="graph">
        <p className="text-sm text-muted-foreground">Sign in to view your knowledge graph.</p>
      </div>
    );
  }

  return (
    <div data-accent="graph" className="-m-5 lg:-m-6 h-[calc(100vh-var(--header-height,0px))] flex overflow-hidden">
      <Suspense fallback={
        <div className="flex items-center justify-center w-full h-full">
          <div className="flex flex-col items-center gap-3">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-border border-t-blue-500" />
            <p className="text-sm text-muted-foreground">Loading graph&hellip;</p>
          </div>
        </div>
      }>
        <GraphContent userId={userId} />
      </Suspense>
    </div>
  );
}
