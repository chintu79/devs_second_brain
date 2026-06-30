"use client";

import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Markdown } from "@devventory/shared";
import {
  Search, Star, Pencil, Lock, Unlock, Trash2, Archive, X, ExternalLink,
  ClipboardList, FileText, Sparkles, Clock, Link2,
  CircleDot, Layers, FlaskConical, Hammer, CheckCircle2,
  ChevronRight, ChevronDown, Copy, FolderKanban, Plus, Loader2,
  Columns3, List,
} from "lucide-react";
import { slideInRight } from "@devventory/motion";
import { formatRelative } from "@devventory/utils";
import { ProjectSidebar } from "./project-sidebar";
import { ProjectList } from "./project-list";
import { KanbanBoard } from "./kanban-board";
import { toggleProjectFavorite, deleteProject, saveProjectPlan, archiveProject, editProject, createProject } from "@/actions/projects";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@devventory/ui";
import { InlineEditor } from "@/components/shared/inline-editor";
import { TagInput } from "@/components/shared/tag-input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@devventory/ui";
import { useAutosave } from "@/hooks/use-autosave";
import { PROJECT_STATUS_META } from "@devventory/types";

const PROJECT_TEMPLATE = "## Vision\n\nWhat are you trying to build?\n\n## Current Focus\n\nWhat are you working on today?\n\n## Roadmap\n\n\n## Tasks\n\n- [ ]\n\n\n## Decisions\n\n";

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

/* ── Main Component ── */
export function ProjectWorkspace({ projects, resources, prompts, notes }: ProjectWorkspaceProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedId = searchParams.get("id");

  const [searchQuery, setSearchQuery] = useState("");
  const [activeSection, setActiveSection] = useState("all");
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [viewMode, setViewMode] = useState<"list" | "kanban">("list");
  const PAGE_SIZE = 20;
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
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

  const displayedProjects = useMemo(() => filtered.slice(0, visibleCount), [filtered, visibleCount]);
  const hasMore = visibleCount < filtered.length;
  const flatList = displayedProjects.map((p) => p.id);
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

  const connectionCounts = useMemo(() => {
    const map = new Map<string, { notes: number; resources: number; prompts: number }>();
    for (const p of projects) {
      const tags = p.tags;
      map.set(p.id, {
        notes: notes.filter((n) => n.tags.some((t) => tags.includes(t))).length,
        resources: resources.filter((r) => r.tags.some((t) => tags.includes(t))).length,
        prompts: prompts.filter((p_) => p_.tags.some((t) => tags.includes(t))).length,
      });
    }
    return map;
  }, [projects, notes, resources, prompts]);

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

  const tabs = useMemo(() => [
    { id: "overview", label: "Overview" },
    { id: "plan.md", label: "PLAN.md" },
    { id: "resources", label: `Resources (${connected.resources.length})` },
    { id: "notes", label: `Notes (${connected.notes.length})` },
    { id: "prompts", label: `Prompts (${connected.prompts.length})` },
    { id: "timeline", label: "Timeline" },
  ], [connected]);

  return (
    <div className="flex h-full" onKeyDown={handleKeyDown}>
      {/* ── Left Sidebar ── */}
      <ProjectSidebar
        total={counts.total} activeCount={counts.active} planningCount={counts.planning}
        researchCount={counts.research} buildingCount={counts.building}
        completedCount={counts.completed} archivedCount={counts.archived} favCount={counts.fav}
        allTags={allTags} activeSection={activeSection} onSectionChange={setActiveSection}
        activeTag={activeTag} onTagChange={setActiveTag} onCreate={async () => {
          const formData = new FormData();
          formData.set("title", "");
          formData.set("description", "");
          formData.set("status", "idea");
          formData.set("techStack", "");
          formData.set("tags", "");
          formData.set("planMd", PROJECT_TEMPLATE);
          const result = await createProject(formData);
          if (result.success && result.id) {
            window.location.href = `/projects?id=${result.id}&new=true`;
          }
        }}
      />

      {/* ── List / Kanban column ── */}
      <div className={`w-[474px] shrink-0 border-r border-border/50 flex flex-col ${viewMode === "kanban" ? "px-0" : "px-2"}`}>
        <div className="px-4 pt-3 pb-2 pr-8 border-b border-border/30 flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input ref={searchRef} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search projects..."
              className="flex h-10 w-full rounded-lg border border-border bg-card pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/40 focus:ring-1 focus:ring-primary/20 transition-all"
            />
          </div>
          <div className="flex items-center rounded-lg border border-border/40 p-0.5 bg-card shrink-0">
            <button
              onClick={() => setViewMode("list")}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-all ${
                viewMode === "list"
                  ? "bg-primary/10 text-primary shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              title="List view"
            >
              <List className="h-3.5 w-3.5" />
              <span>List</span>
            </button>
            <button
              onClick={() => setViewMode("kanban")}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-all ${
                viewMode === "kanban"
                  ? "bg-primary/10 text-primary shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              title="Kanban board"
            >
              <Columns3 className="h-3.5 w-3.5" />
              <span>Board</span>
            </button>
          </div>
        </div>
        {viewMode === "list" ? (
          <>
            <div className="px-3 py-2 border-b border-border/20 space-y-1.5">
              <span className="text-[10px] text-muted-foreground">{filtered.length} project{filtered.length !== 1 ? "s" : ""}</span>
              {activeTag && (
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
                    #{activeTag}
                    <button onClick={() => setActiveTag(null)} className="hover:text-primary/70" aria-label="Clear tag filter">&times;</button>
                  </span>
                </div>
              )}
            </div>
            <ProjectList projects={displayedProjects} selectedId={selectedId} onSelect={select} connectionCounts={connectionCounts} />
            {hasMore && (
              <motion.button
                onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
                className="flex items-center justify-center gap-2 w-full py-3 text-xs text-muted-foreground hover:text-foreground transition-colors border-t border-border/20 mt-1"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
              >
                <ChevronDown className="h-3.5 w-3.5" />
                Load {Math.min(PAGE_SIZE, filtered.length - visibleCount)} more
              </motion.button>
            )}
          </>
        ) : (
          <KanbanBoard
            projects={projects}
            selectedId={selectedId}
            onSelect={select}
          />
        )}
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
            autoEdit={searchParams.get("new") === "true"}
          />
        )}
      </AnimatePresence>

    </div>
  );
}

/* ── Workspace Panel ── */
function WorkspacePanel({
  project: initialProject, connected, allNotes, allResources, allPrompts, allProjects, tabs,
  activeTab, onTabChange, onClose, onUpdate, autoEdit = false,
}: {
  project: Project; connected: { notes: Note[]; resources: Resource[]; prompts: PromptItem[] };
  allNotes: Note[]; allResources: Resource[]; allPrompts: PromptItem[]; allProjects: Project[];
  tabs: { id: string; label: string }[]; activeTab: string; onTabChange: (t: string) => void; onClose: () => void; onUpdate: () => void; autoEdit?: boolean;
}) {
  const router = useRouter();
  const [project, setProject] = useState(initialProject);
  const [planEditing, setPlanEditing] = useState(false);
  const [planContent, setPlanContent] = useState(initialProject.planMd);
  const [planSaving, setPlanSaving] = useState(false);
  const [isFav, setIsFav] = useState(initialProject.favorite);
  const [favPending, setFavPending] = useState(false);
  const [locked, setLocked] = useState(!autoEdit);
  const [editTitle, setEditTitle] = useState(initialProject.title);
  const [editDesc, setEditDesc] = useState(initialProject.description);
  const [editStatus, setEditStatus] = useState(initialProject.status);
  const [editStack, setEditStack] = useState(initialProject.techStack.join(", "));
  const [editTags, setEditTags] = useState(initialProject.tags.slice(0, 3).join(", "));

  useEffect(() => {
    setProject(initialProject);
    setPlanContent(initialProject.planMd);
    setIsFav(initialProject.favorite);
    setEditTitle(initialProject.title);
    setEditDesc(initialProject.description);
    setEditStatus(initialProject.status);
    setEditStack(initialProject.techStack.join(", "));
    setEditTags(initialProject.tags.slice(0, 3).join(", "));
  }, [initialProject]);

  const { status: saveStatus, saveNow } = useAutosave({
    data: { title: editTitle, description: editDesc, status: editStatus, techStack: editStack, tags: editTags },
    onSave: async (data) => {
      const formData = new FormData();
      formData.set("title", data.title);
      formData.set("description", data.description);
      formData.set("status", data.status);
      formData.set("techStack", data.techStack);
      formData.set("tags", data.tags);
      const result = await editProject(project.id, formData);
      if (result?.success) {
        setProject((prev) => ({ ...prev, title: data.title, description: data.description, status: data.status }));
        onUpdate();
      }
    },
    delay: 2000,
    enabled: !locked,
  });

  const meta = PROJECT_STATUS_META[project.status] || PROJECT_STATUS_META.idea;
  const StatusIcon = meta.icon;

  async function handleFavorite() {
    if (favPending) return;
    setFavPending(true);
    setIsFav(!isFav);
    await toggleProjectFavorite(project.id);
    setFavPending(false);
  }

  async function handleDelete() {
    if (confirm("Delete this project?")) {
      await deleteProject(project.id);
      onClose();
    }
  }

  const [archiving, setArchiving] = useState(false);

  async function handleArchive() {
    if (archiving) return;
    setArchiving(true);
    await archiveProject(project.id);
    setArchiving(false);
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
      className="panel-detail outline-none"
      tabIndex={-1}
    >
      {/* ── Header ── */}
      <div className={`shrink-0 border-b border-border/40 transition-opacity duration-150 ${!locked ? "opacity-50" : ""}`}>
        <div className="px-5 py-4">
          <div className="flex items-start gap-4">
            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${isFav ? "bg-amber-500/10" : "bg-muted"}`}>
              <FolderKanban className={`h-5 w-5 ${isFav ? "text-amber-400" : "text-secondary-foreground"}`} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    {locked ? (
                      <h1 className="text-xl font-semibold text-foreground">{project.title}</h1>
                    ) : (
                      <input className="w-full bg-transparent text-xl font-semibold text-foreground outline-none border-b border-border/30 pb-0.5 focus:border-primary/40 transition-colors" value={editTitle} onChange={e => setEditTitle(e.target.value)} placeholder="Untitled project" />
                    )}
                    {locked ? (
                      <span className={`flex items-center gap-1 text-xs font-medium px-2.5 py-0.5 rounded-full ${meta.color} bg-current/5`}>
                        <StatusIcon className="h-3.5 w-3.5" />
                        {meta.label}
                      </span>
                    ) : (
                      <Select value={editStatus} onValueChange={v => v && setEditStatus(v)}>
                        <SelectTrigger className="h-6 text-xs font-medium px-1.5 py-0.5 rounded-full border-border/40">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(PROJECT_STATUS_META).map(([k, v]) => (
                            <SelectItem key={k} value={k}>{v.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  </div>
                  {locked ? (
                    project.description && <p className="text-base text-secondary-foreground mt-1.5">{project.description}</p>
                  ) : (
                    <textarea className="w-full bg-transparent text-base text-secondary-foreground mt-1.5 outline-none border-b border-border/30 focus:border-primary/40 transition-colors resize-none" value={editDesc} onChange={e => setEditDesc(e.target.value)} rows={2} placeholder="Describe this project..." />
                  )}
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button onClick={async () => {
                    if (!locked) await saveNow();
                    setLocked(!locked);
                  }} aria-label={locked ? "Unlock project" : "Lock project"} className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-all">
                    {locked ? <Lock className="h-3.5 w-3.5" /> : <Unlock className="h-3.5 w-3.5" />}
                  </button>
                  {locked && (
                    <>
                      <button onClick={handleDelete} aria-label="Delete project" className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:text-destructive transition-all">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                      <button onClick={handleArchive} disabled={archiving} aria-label={archiving ? "Archiving..." : "Archive project"} className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:text-foreground transition-all">
                        <Archive className="h-3.5 w-3.5" />
                      </button>
                    </>
                  )}
                  {saveStatus === "saving" && <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />}
                  {saveStatus === "saved" && <span className="text-[10px] text-emerald-400">Saved</span>}
                  <button onClick={handleFavorite} disabled={favPending} aria-label={isFav ? "Unfavorite project" : "Favorite project"} className={`flex h-7 w-7 items-center justify-center rounded-md transition-colors ${isFav ? "text-amber-400" : "text-muted-foreground hover:text-amber-400"}`}>
                    <Star className={`h-3.5 w-3.5 ${isFav ? "fill-amber-400" : ""}`} />
                  </button>
                  <button onClick={onClose} aria-label="Close panel" className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-all">
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Meta row */}
              <div className="flex items-center gap-3 mt-2.5 text-xs text-muted-foreground flex-wrap">
                <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> Updated {formatRelative(project.updatedAt)}</span>
                {project.planMd && <span>{project.planMd.split(/\s+/).filter(Boolean).length}w</span>}
                {connected.notes.length + connected.resources.length + connected.prompts.length > 0 && (
                  <span className="flex items-center gap-1">
                    <Link2 className="h-3 w-3" /> {connected.notes.length + connected.resources.length + connected.prompts.length} connected
                  </span>
                )}
                {locked ? (
                  <>
                    <span>{project.techStack.slice(0, 3).join(", ")}{project.techStack.length > 3 ? ` +${project.techStack.length - 3}` : ""}</span>
                    <span>{project.tags.slice(0, 3).join(", ")}{project.tags.length > 3 ? ` +${project.tags.length - 3}` : ""}</span>
                  </>
                ) : (
                  <>
                    <input className="bg-transparent text-xs text-muted-foreground outline-none border-b border-border/30 focus:border-primary/40 transition-colors" value={editStack} onChange={e => setEditStack(e.target.value)} placeholder="React, Node, Python..." />
                    <TagInput value={editTags} onChange={setEditTags} placeholder="Add tags..." />
                  </>
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
        {locked && (
          <div className={`flex gap-0 px-4 transition-opacity duration-150 ${!locked ? "opacity-50" : ""}`}>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`px-4 py-2.5 text-xs font-medium border-b-2 transition-all duration-150 ${activeTab === tab.id
                  ? "border-primary text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:scale-[1.02]"
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── Content ── */}
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
          <div className={`w-56 shrink-0 border-l border-border/30 bg-muted/20 overflow-y-auto px-4 py-5 space-y-5 transition-opacity duration-150 ${!locked ? "opacity-50" : ""}`}>
            <h3 className="text-[10px] font-semibold text-section-foreground uppercase tracking-[0.12em]">Context</h3>

            <ContextSection icon={Clock} label="Recent">
              {timeline.slice(0, 3).map((e) => (
                <p key={e.label} className="text-[10px] text-muted-foreground leading-relaxed">{e.label}</p>
              ))}
            </ContextSection>

            {allProjects.filter((p) => p.id !== project.id && p.tags.some((t) => project.tags.includes(t))).length > 0 && (
              <ContextSection icon={FolderKanban} label="Related Projects">
                {allProjects.filter((p) => p.id !== project.id && p.tags.some((t) => project.tags.includes(t))).slice(0, 3).map((p) => (
                  <button key={p.id} onClick={() => router.push(`/projects?id=${p.id}`)} className="w-full text-left text-[10px] text-muted-foreground hover:text-foreground truncate transition-colors">{p.title}</button>
                ))}
              </ContextSection>
            )}

            {connected.notes.length > 0 && (
              <ContextSection icon={FileText} label={`Notes (${connected.notes.length})`}>
                {connected.notes.slice(0, 3).map((n) => (
                  <button key={n.id} onClick={() => router.push(`/notes?id=${n.id}`)} className="w-full text-left text-[10px] text-muted-foreground hover:text-foreground truncate transition-colors">{n.title}</button>
                ))}
              </ContextSection>
            )}

            {connected.resources.length > 0 && (
              <ContextSection icon={Link2} label={`Resources (${connected.resources.length})`}>
                {connected.resources.slice(0, 3).map((r) => (
                  <button key={r.id} onClick={() => router.push(`/resources?id=${r.id}`)} className="w-full text-left text-[10px] text-muted-foreground hover:text-foreground truncate transition-colors">{r.title}</button>
                ))}
              </ContextSection>
            )}

            {connected.prompts.length > 0 && (
              <ContextSection icon={Sparkles} label={`Prompts (${connected.prompts.length})`}>
                {connected.prompts.slice(0, 3).map((p) => (
                  <button key={p.id} onClick={() => router.push(`/prompts?id=${p.id}`)} className="w-full text-left text-[10px] text-muted-foreground hover:text-foreground truncate transition-colors">{p.title}</button>
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function OverviewTab({ project, connected, timeline }: { project: Project; connected: any; timeline: any[] }) {
  const tasks = useMemo(() => {
    if (!project.planMd) return { todo: [], done: [], total: 0, doneCount: 0, pct: 0 };
    const lines = project.planMd.split("\n");
    const todo: string[] = [];
    const done: string[] = [];
    for (const l of lines) {
      const m = l.match(/^- \[(\s|x)\] (.+)/i);
      if (m) {
        if (m[1].toLowerCase() === "x") done.push(m[2]);
        else todo.push(m[2]);
      }
    }
    const total = Math.max(1, todo.length + done.length);
    return { todo, done, total, doneCount: done.length, pct: Math.round((done.length / total) * 100) };
  }, [project.planMd]);

  return (
    <div className="px-10 py-8 space-y-6 max-w-5xl">
      {/* 1. Current Focus (from plan tasks) */}
      <div className="rounded-xl border border-border/60 bg-card p-6">
        <h2 className="text-sm font-semibold text-section-foreground uppercase tracking-[0.1em] mb-3">Current Focus</h2>
        {project.planMd && project.description && (
          <p className="text-sm text-foreground/80 mb-4 leading-relaxed">{project.description}</p>
        )}
        {tasks.todo.length > 0 ? (
          <div className="space-y-2">
            {tasks.todo.slice(0, 4).map((task, i) => (
              <div key={i} className="flex items-center gap-2.5 text-sm text-muted-foreground">
                <div className="w-1.5 h-1.5 rounded-full border border-muted-foreground/40 shrink-0" />
                <span>{task}</span>
              </div>
            ))}
            {tasks.todo.length > 4 && (
              <p className="text-xs text-muted-foreground/60 ml-4">+{tasks.todo.length - 4} more tasks</p>
            )}
          </div>
        ) : (
          <div className="rounded-lg bg-muted/40 p-4 border border-border/40">
            <p className="text-sm text-muted-foreground">
              {!project.planMd
                ? "Write a PLAN.md to define your milestones and tasks."
                : "All tasks complete. Add new tasks to keep going."}
            </p>
          </div>
        )}
        {tasks.total > 0 && (
          <div className="mt-4">
            <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5">
              <span>Progress</span>
              <span>{tasks.doneCount}/{tasks.total} tasks</span>
            </div>
            <div className="h-1.5 rounded-full bg-muted overflow-hidden">
              <div className="h-full rounded-full bg-primary transition-all duration-500" style={{ width: `${tasks.pct}%` }} />
            </div>
          </div>
        )}
      </div>

      {/* 2. Connected Knowledge */}
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-xl border border-border/60 bg-card p-5 hover:border-primary/30 transition-colors">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <FileText className="h-4 w-4" /> Notes
          </div>
          <p className="text-2xl font-semibold text-foreground">{connected.notes.length}</p>
          <p className="text-xs text-muted-foreground/60 mt-1">Connected by tags</p>
        </div>
        <div className="rounded-xl border border-border/60 bg-card p-5 hover:border-primary/30 transition-colors">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <Link2 className="h-4 w-4" /> Resources
          </div>
          <p className="text-2xl font-semibold text-foreground">{connected.resources.length}</p>
          <p className="text-xs text-muted-foreground/60 mt-1">Connected by tags</p>
        </div>
        <div className="rounded-xl border border-border/60 bg-card p-5 hover:border-primary/30 transition-colors">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <Sparkles className="h-4 w-4" /> Prompts
          </div>
          <p className="text-2xl font-semibold text-foreground">{connected.prompts.length}</p>
          <p className="text-xs text-muted-foreground/60 mt-1">Connected by tags</p>
        </div>
      </div>

      {/* 3. Tech stack + Stats */}
      <div className="grid grid-cols-2 gap-4">
        {project.techStack.length > 0 && (
          <div className="rounded-xl border border-border/60 bg-card p-5">
            <h3 className="text-xs font-semibold text-section-foreground uppercase tracking-[0.1em] mb-2">Tech Stack</h3>
            <div className="flex flex-wrap gap-1.5">
              {project.techStack.map((t) => (
                <span key={t} className="px-2 py-0.5 rounded text-xs font-medium bg-muted text-secondary-foreground">{t}</span>
              ))}
            </div>
          </div>
        )}
        {project.planMd && (
          <div className="rounded-xl border border-border/60 bg-card p-5">
            <h3 className="text-xs font-semibold text-section-foreground uppercase tracking-[0.1em] mb-2">Documentation</h3>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <span>{project.planMd.split(/\s+/).filter(Boolean).length} words</span>
              <span>{tasks.pct}% complete</span>
            </div>
          </div>
        )}
      </div>

      {/* 4. Recent activity */}
      {timeline.length > 0 && (
        <div className="rounded-xl border border-border/60 bg-card p-6">
          <h2 className="text-sm font-semibold text-section-foreground uppercase tracking-[0.1em] mb-3">Activity</h2>
          <div className="space-y-3">
            {timeline.slice(0, 5).map((e) => (
              <div key={e.label} className="flex items-start gap-3 text-sm">
                <div className="w-1.5 h-1.5 rounded-full bg-primary/40 mt-2 shrink-0" />
                <span className="text-muted-foreground">{e.label}</span>
                <span className="text-muted-foreground/50 ml-auto shrink-0">{formatRelative(e.date)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
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
          <InlineEditor content={content} onChange={onChange} editable placeholder="Start your project plan..." />
          <div className="flex gap-2">
            <Button onClick={onSave} disabled={saving} size="sm" className="h-9 text-sm">{saving ? "Saving..." : "Save"}</Button>
            <Button onClick={onCancel} variant="outline" size="sm" className="h-9 text-sm">Cancel</Button>
          </div>
        </div>
      ) : (
        <div className="note-prose">
          {content ? (
            <Markdown>{content}</Markdown>
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
  if (resources.length === 0) return <EmptyTab icon={Link2} title="No resources yet" desc="Add resources that relate to this project" hint="Tag a resource with the same tag as this project to connect it here" />;
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
  if (notes.length === 0) return <EmptyTab icon={FileText} title="No notes yet" desc="Write notes that relate to this project" hint="Tag a note with the same tag as this project to connect it here" />;
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
              <p className="text-xs text-muted-foreground mt-0.5">{n.category} &middot; Created {formatRelative(n.createdAt)}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function PromptsTab({ prompts }: { prompts: PromptItem[] }) {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  if (prompts.length === 0) return <EmptyTab icon={Sparkles} title="No prompts yet" desc="Create prompts that relate to this project" hint="Tag a prompt with the same tag as this project to connect it here" />;
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
              aria-label="Copy prompt"
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
  if (events.length === 0) return <EmptyTab icon={Clock} title="No activity yet" desc="Changes to this project will appear here" hint="Edit this project's plan or update its status to start tracking activity" />;
  return (
    <div className="px-10 py-8 max-w-5xl">
      <div className="relative pl-8 border-l-2 border-border/50 space-y-6">
        {events.map((e) => (
          <div key={e.label} className="relative">
            <div className="absolute -left-[33px] top-1 w-3.5 h-3.5 rounded-full bg-primary/20 border-[3px] border-primary/60" />
            <p className="text-sm text-foreground/90">{e.label}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{formatRelative(e.date)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function EmptyTab({ icon: Icon, title, desc, hint }: { icon: React.ComponentType<{ className?: string }>; title: string; desc: string; hint?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted mb-3">
        <Icon className="h-5 w-5 text-muted-foreground" />
      </div>
      <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
      <p className="text-[11px] text-muted-foreground/60 max-w-[200px]">{desc}</p>
      {hint && <p className="text-[10px] text-muted-foreground/40 max-w-[220px] mt-3 leading-relaxed">{hint}</p>}
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
