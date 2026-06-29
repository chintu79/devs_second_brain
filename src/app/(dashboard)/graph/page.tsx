import { Suspense } from "react";
import { auth } from "@/lib/auth";
import prisma, { safeQuery } from "@/lib/prisma";
import { includeTags, flattenListTags } from "@/lib/tags";
import { GraphView } from "@/components/graph/graph-view";

const DOMAIN_RULES: [string, string[]][] = [
  ["AI/ML", ["ai", "machine", "llm", "rag", "agent", "embedding", "langchain", "vector", "nlp", "model", "training", "inference", "prompt", "openai", "gpt", "neural"]],
  ["Frontend", ["react", "nextjs", "vue", "css", "html", "javascript", "typescript", "tailwind", "frontend", "ui", "web"]],
  ["Backend", ["api", "rest", "graphql", "backend", "server", "node", "express", "django", "go", "rust", "python"]],
  ["Database", ["sql", "postgres", "mysql", "mongodb", "redis", "database", "prisma", "orm", "nosql", "query"]],
  ["DevOps", ["docker", "kubernetes", "ci/cd", "devops", "deploy", "aws", "cloud", "terraform", "linux", "bash"]],
  ["Testing", ["test", "jest", "vitest", "cypress", "playwright", "testing", "unit", "integration", "e2e"]],
  ["Security", ["security", "auth", "oauth", "jwt", "encrypt", "vulnerability"]],
  ["Design", ["design", "figma", "a11y", "accessibility", "typography", "ux"]],
  ["Tools", ["git", "vscode", "cli", "npm", "eslint", "prettier"]],
  ["Architecture", ["architecture", "microservice", "solid", "ddd", "design pattern", "event driven"]],
];

function assignDomain(name: string): string {
  const lower = name.toLowerCase();
  for (const [domain, keywords] of DOMAIN_RULES) {
    if (keywords.some((k) => lower.includes(k))) return domain;
  }
  return "Other";
}

interface GraphInsights {
  totalItems: number;
  totalTags: number;
  distinctTags: number;
  connectedItems: number;
  isolatedItems: number;
  domainCounts: { domain: string; count: number }[];
  topTags: { tag: string; count: number }[];
  orphanTags: { tag: string; items: string[] }[];
}

function computeInsights(data: {
  resources: any[]; prompts: any[]; notes: any[]; projects: any[];
}): GraphInsights {
  const allItems = [
    ...data.resources.map((r) => ({ id: r.id, title: r.title, type: "resource", tags: r.tags || [], createdAt: r.createdAt })),
    ...data.prompts.map((p) => ({ id: p.id, title: p.title, type: "prompt", tags: p.tags || [], createdAt: p.createdAt })),
    ...data.notes.map((n) => ({ id: n.id, title: n.title, type: "note", tags: n.tags || [], createdAt: n.createdAt })),
    ...data.projects.map((p) => ({ id: p.id, title: p.title, type: "project", tags: p.tags || [], createdAt: p.createdAt })),
  ];

  const tagItems = new Map<string, string[]>();
  for (const item of allItems) {
    for (const tag of item.tags) {
      const arr = tagItems.get(tag) || [];
      arr.push(item.id);
      tagItems.set(tag, arr);
    }
  }

  const distinctTags = tagItems.size;
  const connected = new Set<string>();
  for (const [, ids] of tagItems) {
    if (ids.length > 1) for (const id of ids) connected.add(id);
  }

  const isolatedItems = allItems.filter((i) => i.tags.length === 0 || !connected.has(i.id));
  const itemTags = allItems.flatMap((i) => i.tags);
  const tagFreq = new Map<string, number>();
  for (const t of itemTags) tagFreq.set(t, (tagFreq.get(t) || 0) + 1);

  const domainMap = new Map<string, number>();
  for (const t of tagFreq.keys()) {
    const d = assignDomain(t);
    domainMap.set(d, (domainMap.get(d) || 0) + 1);
  }

  const orphanTags = new Map<string, string[]>();
  for (const [tag, ids] of tagItems) {
    if (ids.length === 1) {
      const item = allItems.find((i) => i.id === ids[0]);
      if (item) orphanTags.set(tag, [...(orphanTags.get(tag) || []), item.title]);
    }
  }

  return {
    totalItems: allItems.length,
    totalTags: itemTags.length,
    distinctTags,
    connectedItems: connected.size,
    isolatedItems: isolatedItems.length,
    domainCounts: Array.from(domainMap.entries()).map(([domain, count]) => ({ domain, count })).sort((a, b) => b.count - a.count),
    topTags: Array.from(tagFreq.entries()).map(([tag, count]) => ({ tag, count })).sort((a, b) => b.count - a.count).slice(0, 8),
    orphanTags: Array.from(orphanTags.entries()).map(([tag, items]) => ({ tag, items })).filter((o) => o.items.length === 1).slice(0, 5),
  };
}

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
  const insights = computeInsights(data);
  return (
    <GraphView
      resources={data.resources}
      prompts={data.prompts}
      notes={data.notes}
      projects={data.projects}
      insights={insights}
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
    <div data-accent="graph" className="absolute inset-0 flex overflow-hidden">
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
