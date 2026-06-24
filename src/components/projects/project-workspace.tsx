"use client";

import { useState, useMemo, useCallback, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import {
  Search, Star, Pencil, Trash2, Archive, X, ExternalLink,
  ClipboardList, FileText, Sparkles, Clock, Link2,
  CircleDot, Layers, FlaskConical, Hammer, CheckCircle2,
  ChevronRight, Copy, FolderKanban, Plus,
} from "lucide-react";
import { slideInRight } from "@/lib/motion";
import { ProjectSidebar } from "./project-sidebar";
import { ProjectList } from "./project-list";
import { toggleProjectFavorite, deleteProject, saveProjectPlan, archiveProject } from "@/actions/projects";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ProjectDialog } from "@/components/vaults/project-dialog";

/* ── Types ── */
interface Project {
  id: string; title: string; description: string; status: string;
  techStack: string[]; tags: string[]; planMd: string; favorite: boolean;
  createdAt: Date; updatedAt: Date;
}
interface Resource { id: string; title: string; url: string; tags: string[]; category: string; }
interface PromptItem { id: string; title: string; prompt: string; tags: string[]; category: string; }
interface Note { id: string; title: string; content: string; category: string; tags: string[]; createdAt: Date; }

interface ProjectWorkspaceProps {
  projects: Project[]; resources: Resource[]; prompts: PromptItem[]; notes: Note[];
}

const statusMeta: Record<string, { label: string; color: string; icon: React.ComponentType<{ className?: string }> }> = {
  idea: { label: "Idea", color: "text-amber-400", icon: CircleDot },
  research: { label: "Research", color: "text-blue-400", icon: FlaskConical },
  planning: { label: "Planning", color: "text-purple-400", icon: Layers },
  building: { label: "Building", color: "text-green-400", icon: Hammer },
  completed: { label: "Completed", color: "text-emerald-400", icon: CheckCircle2 },
  archived: { label: "Archived", color: "text-muted-foreground", icon: Archive },
};

/* ── Main Component ── */
export function ProjectWorkspace({ projects, resources, prompts, notes }: ProjectWorkspaceProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedId = searchParams.get("id");

  const [searchQuery, setSearchQuery] = useState("");
  const [activeSection, setActiveSection] = useState("all");
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [editDialog, setEditDialog] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  /* ── Sidebar data ── */
  const allTags = useMemo(() => {
    const m = new Map<string, number>();
    projects.forEach((p) => p.tags.forEach((t) => m.set(t, (m.get(t) || 0) + 1)));
    return Array.from(m.entries()).map(([n, c]) => ({ name: n, count: c })).sort((a, b) => b.count - a.count);
  }, [projects]);

  /* ── Filter projects ── */
  const filtered = useMemo(() => {
    let r = [...projects];
    if (activeSection === "favorites") r = r.filter((p) => p.favorite);
    else if (activeSection === "active") r = r.filter((p) => p.status === "building" || p.status === "active");
    else if (activeSection === "archived") r = r.filter((p) => p.status === "archived");
    else if (activeSection === "completed") r = r.filter((p) => p.status === "completed");
    else if (activeSection === "planning") r = r.filter((p) => p.status === "planning");
    else if (activeSection === "research") r = r.filter((p) => p.status === "research");
    else if (activeSection === "building") r = r.filter((p) => p.status === "building");
    else if (activeSection === "all") r = r.filter((p) => p.status !== "archived");

    if (activeTag) r = r.filter((p) => p.tags.includes(activeTag));
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      r = r.filter((p) => p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q) || p.tags.some((t) => t.includes(q)));
    }
    return r.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
  }, [projects, activeSection, activeTag, searchQuery]);

  const flatList = filtered.map((p) => p.id);
  const selectedProject = selectedId ? projects.find((p) => p.id === selectedId) || null : null;

  const setSelectedId = useCallback((id: string | null) => {
    const p = new URLSearchParams(searchParams.toString());
    if (id) p.set("id", id); else p.delete("id");
    router.replace(`/projects${p.toString() ? `?${p}` : ""}`, { scroll: false });
  }, [router, searchParams]);

  function select(id: string) { setSelectedId(id === selectedId ? null : id); }
  function close() { setSelectedId(null); }

  /* ── Keyboard nav ── */
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    const ci = selectedId ? flatList.indexOf(selectedId) : -1;
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      const dir = e.key === "ArrowDown" ? 1 : -1;
      let ni = ci + dir;
      if (ni < 0) ni = flatList.length - 1;
      if (ni >= flatList.length) ni = 0;
      setSelectedId(flatList[ni]);
    }
    if (e.key === "Escape" && selectedId) { e.preventDefault(); close(); }
    if ((e.key === "f" || e.key === "k") && (e.metaKey || e.ctrlKey)) { e.preventDefault(); searchRef.current?.focus(); }
  }, [selectedId, flatList]);

  /* ── Connected data ── */
  const connected = useMemo(() => {
    if (!selectedProject) return { notes: [], resources: [], prompts: [] };
    const tags = selectedProject.tags;
    return {
      notes: notes.filter((n) => n.tags.some((t) => tags.includes(t))),
      resources: resources.filter((r) => r.tags.some((t) => tags.includes(t))),
      prompts: prompts.filter((p) => p.tags.some((t) => tags.includes(t))),
    };
  }, [selectedProject, notes, resources, prompts]);

  /* ── Counts ── */
  const counts = useMemo(() => ({
    total: projects.length,
    active: projects.filter((p) => !["completed", "archived", "idea"].includes(p.status)).length,
    planning: projects.filter((p) => p.status === "planning").length,
    research: projects.filter((p) => p.status === "research").length,
    building: projects.filter((p) => p.status === "building").length,
    completed: projects.filter((p) => p.status === "completed").length,
    archived: projects.filter((p) => p.status === "archived").length,
    fav: projects.filter((p) => p.favorite).length,
  }), [projects]);

  const tabs = ["overview", "PLAN.md", "Resources", "Notes", "Prompts", "Timeline"];

  return (
    <div className="flex h-full" onKeyDown={handleKeyDown}>
      {/* ── Left Sidebar ── */}
      <ProjectSidebar
        total={counts.total} activeCount={counts.active} planningCount={counts.planning}
        researchCount={counts.research} buildingCount={counts.building}
        completedCount={counts.completed} archivedCount={counts.archived} favCount={counts.fav}
        allTags={allTags} activeSection={activeSection} onSectionChange={setActiveSection}
        activeTag={activeTag} onTagChange={setActiveTag} onCreate={() => setEditDialog(true)}
      />

      {/* ── List column ── */}
      <div className={`${selectedId ? "w-80" : "flex-1"} shrink-0 border-r border-border/50 flex flex-col`}>
        <div className="px-3 pt-3 pb-2 border-b border-border/30">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <input ref={searchRef} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search projects..."
              className="flex h-8 w-full rounded-md border border-border bg-card pl-8 pr-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/40 focus:ring-1 focus:ring-primary/20 transition-all"
            />
          </div>
        </div>
        <div className="px-3 py-2 border-b border-border/20">
          <span className="text-[10px] text-muted-foreground">{filtered.length} project{filtered.length !== 1 ? "s" : ""}</span>
        </div>
        <ProjectList projects={filtered} selectedId={selectedId} onSelect={select} />
      </div>

      {/* ── Workspace ── */}
      <AnimatePresence mode="wait">
        {selectedProject && (
          <WorkspacePanel
            key={selectedProject.id}
            project={selectedProject}
            connected={connected}
            allNotes={notes}
            allResources={resources}
            allPrompts={prompts}
            allProjects={projects}
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            onClose={close}
            onUpdate={() => router.refresh()}
            onEdit={() => setEditDialog(true)}
          />
        )}
      </AnimatePresence>

      <ProjectDialog project={selectedProject || undefined} open={editDialog} onOpenChange={setEditDialog} />
    </div>
  );
}

/* ── Workspace Panel ── */
function WorkspacePanel({
  project, connected, allNotes, allResources, allPrompts, allProjects, tabs,
  activeTab, onTabChange, onClose, onUpdate, onEdit,
}: {
  project: Project; connected: { notes: Note[]; resources: Resource[]; prompts: PromptItem[] };
  allNotes: Note[]; allResources: Resource[]; allPrompts: PromptItem[]; allProjects: Project[];
  tabs: string[]; activeTab: string; onTabChange: (t: string) => void; onClose: () => void; onUpdate: () => void; onEdit: () => void;
}) {
  const [planEditing, setPlanEditing] = useState(false);
  const [planContent, setPlanContent] = useState(project.planMd);
  const [planSaving, setPlanSaving] = useState(false);
  const [isFav, setIsFav] = useState(project.favorite);

  const meta = statusMeta[project.status] || statusMeta.idea;
  const StatusIcon = meta.icon;

  async function handleFavorite() {
    setIsFav(!isFav);
    await toggleProjectFavorite(project.id);
  }

  async function handleDelete() {
    if (confirm("Delete this project?")) {
      await deleteProject(project.id);
      onClose();
    }
  }

  async function handleArchive() {
    await archiveProject(project.id);
    onUpdate();
  }

  async function handleSavePlan() {
    setPlanSaving(true);
    await saveProjectPlan(project.id, planContent);
    setPlanSaving(false);
    setPlanEditing(false);
    onUpdate();
  }

  /* ── Timeline ── */
  const timeline = useMemo(() => {
    const events: { date: Date; label: string; icon: string }[] = [{ date: project.createdAt, label: `Created project "${project.title}"`, icon: "create" }];
    connected.notes.forEach((n) => events.push({ date: n.createdAt, label: `Added note "${n.title}"`, icon: "note" }));
    connected.resources.forEach((r) => events.push({ date: new Date(project.updatedAt), label: `Resource "${r.title}" connected`, icon: "resource" }));
    connected.prompts.forEach((p) => events.push({ date: new Date(project.updatedAt), label: `Prompt "${p.title}" connected`, icon: "prompt" }));
    return events.sort((a, b) => b.date.getTime() - a.date.getTime()).slice(0, 20);
  }, [project, connected]);

  const todoCount = project.planMd ? (project.planMd.match(/- \[ \]/g) || []).length : 0;
  const doneCount = project.planMd ? (project.planMd.match(/- \[x\]/gi) || []).length : 0;
  const totalMilestones = Math.max(1, todoCount + doneCount);
  const progressPct = Math.round((doneCount / totalMilestones) * 100);

  return (
    <motion.div
      variants={slideInRight}
      initial="initial"
      animate="animate"
      exit="exit"
      className="flex-1 min-w-0 border-l border-border/50 bg-background overflow-hidden flex flex-col outline-none"
      tabIndex={-1}
    >
      {/* ── Header ── */}
      <div className="shrink-0 border-b border-border/40">
        <div className="px-5 py-4">
          <div className="flex items-start gap-4">
            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${isFav ? "bg-amber-500/10" : "bg-muted"}`}>
              <FolderKanban className={`h-5 w-5 ${isFav ? "text-amber-400" : "text-secondary-foreground"}`} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-xl font-semibold text-foreground">{project.title}</h1>
                    <span className={`flex items-center gap-1 text-xs font-medium px-2.5 py-0.5 rounded-full ${meta.color} bg-current/5`}>
                      <StatusIcon className="h-3.5 w-3.5" />
                      {meta.label}
                    </span>
                  </div>
                  {project.description && (
                    <p className="text-base text-secondary-foreground mt-1.5">{project.description}</p>
                  )}
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button onClick={handleFavorite} className={`flex h-7 w-7 items-center justify-center rounded-md transition-colors ${isFav ? "text-amber-400" : "text-muted-foreground hover:text-amber-400"}`}>
                    <Star className={`h-3.5 w-3.5 ${isFav ? "fill-amber-400" : ""}`} />
                  </button>
                  <button onClick={onEdit} className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:text-foreground transition-colors">
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                  <button onClick={handleArchive} className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:text-foreground transition-colors">
                    <Archive className="h-3.5 w-3.5" />
                  </button>
                  <div className="w-px h-4 bg-border/50 mx-1" />
                  <button onClick={onClose} className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:text-foreground transition-colors">
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Meta row */}
              <div className="flex items-center gap-3 mt-2.5 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> Updated {formatRel(project.updatedAt)}</span>
                <span>{project.techStack.slice(0, 3).join(", ")}{project.techStack.length > 3 ? ` +${project.techStack.length - 3}` : ""}</span>
                {project.tags.length > 0 && (
                  <span className="flex items-center gap-1"><Link2 className="h-3 w-3" /> {project.tags.join(", ")}</span>
                )}
              </div>

              {/* Progress */}
              <div className="mt-3 flex items-center gap-3">
                <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                  <div className="h-full rounded-full bg-primary transition-all duration-500" style={{ width: `${progressPct}%` }} />
                </div>
                <span className="text-xs text-muted-foreground shrink-0">{doneCount}/{totalMilestones} tasks</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Tabs ── */}
        <div className="flex gap-0 px-4">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => onTabChange(tab.toLowerCase())}
              className={`px-4 py-2.5 text-xs font-medium border-b-2 transition-all duration-150 ${
                activeTab === tab.toLowerCase()
                  ? "border-primary text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:scale-[1.02]"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* ── Tab Content ── */}
      <div className="flex-1 overflow-y-auto">
        <div className="flex h-full">
          <div className="flex-1 min-w-0">
            {activeTab === "overview" && <OverviewTab project={project} connected={connected} timeline={timeline} />}
            {activeTab === "plan.md" && (
              <PlanTab
                content={planContent} editing={planEditing} saving={planSaving}
                onEdit={() => setPlanEditing(true)}
                onCancel={() => { setPlanEditing(false); setPlanContent(project.planMd); }}
                onSave={handleSavePlan}
                onChange={setPlanContent}
              />
            )}
            {activeTab === "resources" && <ResourcesTab resources={connected.resources} />}
            {activeTab === "notes" && <NotesTab notes={connected.notes} />}
            {activeTab === "prompts" && <PromptsTab prompts={connected.prompts} />}
            {activeTab === "timeline" && <TimelineTab events={timeline} />}
          </div>

          {/* ── Context Panel ── */}
          <div className="w-56 shrink-0 border-l border-border/30 bg-muted/20 overflow-y-auto px-4 py-5 space-y-5">
            <h3 className="text-[10px] font-semibold text-section-foreground uppercase tracking-[0.12em]">Context</h3>

            <ContextSection icon={Clock} label="Recent">
              {timeline.slice(0, 3).map((e, i) => (
                <p key={i} className="text-[10px] text-muted-foreground leading-relaxed">{e.label}</p>
              ))}
            </ContextSection>

            {allProjects.filter((p) => p.id !== project.id && p.tags.some((t) => project.tags.includes(t))).slice(0, 3).length > 0 && (
              <ContextSection icon={FolderKanban} label="Related Projects">
                {allProjects.filter((p) => p.id !== project.id && p.tags.some((t) => project.tags.includes(t))).slice(0, 3).map((p) => (
                  <div key={p.id} className="text-[10px] text-muted-foreground leading-relaxed">{p.title}</div>
                ))}
              </ContextSection>
            )}

            {connected.notes.length > 0 && (
              <ContextSection icon={FileText} label="Notes ({connected.notes.length})">
                {connected.notes.slice(0, 3).map((n) => (
                  <div key={n.id} className="text-[10px] text-muted-foreground truncate">{n.title}</div>
                ))}
              </ContextSection>
            )}

            {connected.resources.length > 0 && (
              <ContextSection icon={Link2} label="Resources ({connected.resources.length})">
                {connected.resources.slice(0, 3).map((r) => (
                  <div key={r.id} className="text-[10px] text-muted-foreground truncate">{r.title}</div>
                ))}
              </ContextSection>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ── Tab Components ── */

function OverviewTab({ project, connected, timeline }: { project: Project; connected: any; timeline: any[] }) {
  return (
    <div className="px-10 py-8 space-y-6 max-w-5xl">
      {/* Status + next action */}
      <div className="rounded-xl border border-border/60 bg-card p-6">
        <h2 className="text-sm font-semibold text-section-foreground uppercase tracking-[0.1em] mb-3">Project Health</h2>
        <div className="flex items-center gap-3 mb-4">
          <span className={`text-base font-semibold capitalize ${statusMeta[project.status]?.color || ""}`}>
            {statusMeta[project.status]?.label || project.status}
          </span>
          <span className="text-sm text-muted-foreground">&middot; Updated {formatRel(project.updatedAt)}</span>
        </div>
        <div className="rounded-lg bg-muted/50 p-4 border border-border/40">
          <p className="text-xs text-muted-foreground uppercase tracking-wide font-semibold mb-1">Next Step</p>
          <p className="text-base text-foreground">
            {project.planMd ? "Continue working on your plan" : "Write a PLAN.md to define milestones"}
          </p>
        </div>
      </div>

      {/* Recent activity */}
      {timeline.length > 0 && (
        <div className="rounded-xl border border-border/60 bg-card p-6">
          <h2 className="text-sm font-semibold text-section-foreground uppercase tracking-[0.1em] mb-3">Recent Activity</h2>
          <div className="space-y-3">
            {timeline.slice(0, 5).map((e, i) => (
              <div key={i} className="flex items-start gap-3 text-sm">
                <div className="w-1.5 h-1.5 rounded-full bg-primary/40 mt-2 shrink-0" />
                <span className="text-muted-foreground">{e.label}</span>
                <span className="text-muted-foreground/50 ml-auto shrink-0">{formatRel(e.date)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Connected items grid */}
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-xl border border-border/60 bg-card p-5">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <FileText className="h-4 w-4" /> Notes
          </div>
          <p className="text-2xl font-semibold text-foreground">{connected.notes.length}</p>
        </div>
        <div className="rounded-xl border border-border/60 bg-card p-5">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <Link2 className="h-4 w-4" /> Resources
          </div>
          <p className="text-2xl font-semibold text-foreground">{connected.resources.length}</p>
        </div>
        <div className="rounded-xl border border-border/60 bg-card p-5">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <Sparkles className="h-4 w-4" /> Prompts
          </div>
          <p className="text-2xl font-semibold text-foreground">{connected.prompts.length}</p>
        </div>
      </div>
    </div>
  );
}

function PlanTab({ content, editing, saving, onEdit, onCancel, onSave, onChange }: {
  content: string; editing: boolean; saving: boolean;
  onEdit: () => void; onCancel: () => void; onSave: () => Promise<void>; onChange: (v: string) => void;
}) {
  return (
    <div className="px-10 py-8 max-w-5xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <ClipboardList className="h-5 w-5 text-primary" />
          <h2 className="text-base font-semibold text-foreground">PLAN.md</h2>
        </div>
        {!editing && (
          <Button onClick={onEdit} variant="outline" size="sm" className="h-8 text-xs gap-1">
            <Pencil className="h-3.5 w-3.5" /> Edit
          </Button>
        )}
      </div>

      {editing ? (
        <div className="space-y-3">
          <Textarea value={content} onChange={(e) => onChange(e.target.value)} rows={24} className="text-base font-mono leading-relaxed" />
          <div className="flex gap-2">
            <Button onClick={onSave} disabled={saving} size="sm" className="h-9 text-sm">{saving ? "Saving..." : "Save"}</Button>
            <Button onClick={onCancel} variant="outline" size="sm" className="h-9 text-sm">Cancel</Button>
          </div>
        </div>
      ) : (
        <div className="note-prose">
          {content ? (
            <ReactMarkdown
              components={{
                code: ({ className, children, ...props }) => {
                  const m = /language-(\w+)/.exec(className || "");
                  if (!className || !m) return <code className="inline-code" {...props}>{children}</code>;
                  return (
                    <div className="code-block-wrapper">
                      <div className="code-block-header"><span className="code-block-lang">{m[1]}</span></div>
                      <pre className="code-block has-header"><code className={className} {...props}>{children}</code></pre>
                    </div>
                  );
                },
                blockquote: ({ children, ...props }) => <blockquote className="note-blockquote" {...props}>{children}</blockquote>,
                a: ({ children, href, ...props }) => <a className="note-link" href={href} target="_blank" rel="noopener noreferrer" {...props}>{children}</a>,
                ul: ({ children, ...props }) => <ul className="note-list" {...props}>{children}</ul>,
                ol: ({ children, ...props }) => <ol className="note-list" {...props}>{children}</ol>,
                table: ({ children, ...props }) => <div className="note-table-wrapper"><table className="note-table" {...props}>{children}</table></div>,
              }}
            >
              {content}
            </ReactMarkdown>
          ) : (
            <div className="text-center py-20 text-muted-foreground">
              <ClipboardList className="h-10 w-10 mx-auto mb-4" />
              <p className="text-base mb-1">No plan yet</p>
              <p className="text-sm mb-5">Define milestones, tasks, and architecture</p>
              <Button onClick={onEdit} variant="outline" size="sm" className="h-9 text-sm gap-1">
                <Plus className="h-4 w-4" /> Create PLAN.md
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function ResourcesTab({ resources }: { resources: Resource[] }) {
  if (resources.length === 0) return <EmptyTab icon={Link2} title="No resources yet" desc="Add resources that relate to this project" />;
  return (
    <div className="px-10 py-8 space-y-3 max-w-5xl">
      {resources.map((r) => (
        <a key={r.id} href={r.url} target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-4 rounded-lg border border-border/60 bg-card p-4 hover:border-primary/30 transition-colors group"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-muted">
            <ExternalLink className="h-5 w-5 text-muted-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-base font-medium text-foreground truncate">{r.title}</p>
            <p className="text-xs text-muted-foreground mt-0.5 truncate">{r.url}</p>
          </div>
          <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
        </a>
      ))}
    </div>
  );
}

function NotesTab({ notes }: { notes: Note[] }) {
  if (notes.length === 0) return <EmptyTab icon={FileText} title="No notes yet" desc="Write notes that relate to this project" />;
  return (
    <div className="px-10 py-8 space-y-3 max-w-5xl">
      {notes.map((n) => (
        <div key={n.id} className="rounded-lg border border-border/60 bg-card p-4 hover:border-primary/30 transition-colors cursor-pointer">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-muted">
              <FileText className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-base font-medium text-foreground">{n.title}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{n.category} &middot; Created {formatRel(n.createdAt)}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function PromptsTab({ prompts }: { prompts: PromptItem[] }) {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  if (prompts.length === 0) return <EmptyTab icon={Sparkles} title="No prompts yet" desc="Create prompts that relate to this project" />;
  return (
    <div className="px-10 py-8 space-y-3 max-w-5xl">
      {prompts.map((p) => (
        <div key={p.id} className="rounded-lg border border-border/60 bg-card p-4 hover:border-primary/30 transition-colors">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-muted">
              <Sparkles className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-base font-medium text-foreground">{p.title}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{p.category}</p>
            </div>
            <button
              onClick={async () => { await navigator.clipboard.writeText(p.prompt); setCopiedId(p.id); setTimeout(() => setCopiedId(null), 1500); }}
              className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:text-foreground transition-colors"
            >
              <Copy className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

function TimelineTab({ events }: { events: { date: Date; label: string; icon: string }[] }) {
  if (events.length === 0) return <EmptyTab icon={Clock} title="No activity yet" desc="Changes to this project will appear here" />;
  return (
    <div className="px-10 py-8 max-w-5xl">
      <div className="relative pl-8 border-l-2 border-border/50 space-y-6">
        {events.map((e, i) => (
          <div key={i} className="relative">
            <div className="absolute -left-[33px] top-1 w-3.5 h-3.5 rounded-full bg-primary/20 border-[3px] border-primary/60" />
            <p className="text-sm text-foreground/90">{e.label}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{formatRel(e.date)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function EmptyTab({ icon: Icon, title, desc }: { icon: React.ComponentType<{ className?: string }>; title: string; desc: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted mb-3">
        <Icon className="h-5 w-5 text-muted-foreground" />
      </div>
      <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
      <p className="text-[11px] text-muted-foreground/60 max-w-[200px]">{desc}</p>
    </div>
  );
}

function ContextSection({ icon: Icon, label, children }: { icon: React.ComponentType<{ className?: string }>; label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground mb-2">
        <Icon className="h-3 w-3" />
        <span>{label}</span>
      </div>
      <div className="space-y-1.5">{children}</div>
    </div>
  );
}

/* ── Helpers ── */
function formatRel(date: Date): string {
  const diff = Date.now() - date.getTime();
  const mins = Math.floor(diff / 60000);
  const hrs = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (mins < 1) return "now";
  if (mins < 60) return `${mins}m ago`;
  if (hrs < 24) return `${hrs}h ago`;
  if (days < 7) return `${days}d ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}
