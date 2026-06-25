"use client";

import { useState, useMemo, useCallback } from "react";
import {
  DndContext, DragOverlay, useDraggable, useDroppable,
  PointerSensor, useSensor, useSensors,
  type DragStartEvent, type DragEndEvent,
} from "@dnd-kit/core";
import {
  CircleDot, FlaskConical, Layers, Hammer, CheckCircle2, Archive,
  Star, GripVertical, Loader2,
} from "lucide-react";
import { updateProjectStatus } from "@/actions/projects";

/* ── Types ── */
interface Project {
  id: string; title: string; description: string; status: string;
  techStack: string[]; tags: string[]; planMd: string; favorite: boolean;
  createdAt: Date; updatedAt: Date;
}

interface KanbanBoardProps {
  projects: Project[];
  onSelect: (id: string) => void;
  selectedId: string | null;
}

/* ── Status config ── */
const statuses = ["idea", "research", "planning", "building", "completed", "archived"] as const;
const statusMeta: Record<string, { label: string; color: string; dot: string; icon: React.ComponentType<{ className?: string }> }> = {
  idea: { label: "Idea", color: "text-amber-500", dot: "bg-amber-500", icon: CircleDot },
  research: { label: "Research", color: "text-blue-500", dot: "bg-blue-500", icon: FlaskConical },
  planning: { label: "Planning", color: "text-purple-500", dot: "bg-purple-500", icon: Layers },
  building: { label: "Building", color: "text-green-500", dot: "bg-green-500", icon: Hammer },
  completed: { label: "Completed", color: "text-emerald-500", dot: "bg-emerald-500", icon: CheckCircle2 },
  archived: { label: "Archived", color: "text-muted-foreground", dot: "bg-muted-foreground", icon: Archive },
};
const statusOrder = Object.fromEntries(statuses.map((s, i) => [s, i]));

/* ── Draggable Card ── */
function KanbanCard({
  project,
  isSelected,
  onSelect,
}: {
  project: Project;
  isSelected: boolean;
  onSelect: (id: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: project.id,
    data: { project, fromStatus: project.status },
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={() => onSelect(project.id)}
      className={`group cursor-pointer rounded-lg border p-3 transition-all duration-150 ${isDragging ? "opacity-30 shadow-lg border-primary/30 bg-primary/5" : "border-border/40 hover:border-border bg-card hover:shadow-sm"
        } ${isSelected ? "ring-1 ring-primary/40 border-primary/30" : ""}`}
    >
      <div className="flex items-start gap-2">
        <button
          {...attributes}
          {...listeners}
          onClick={(e) => e.stopPropagation()}
          className="mt-0.5 shrink-0 opacity-0 group-hover:opacity-60 hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing"
        >
          <GripVertical className="h-3.5 w-3.5 text-muted-foreground" />
        </button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-1">
            {project.favorite && <Star className="h-3 w-3 fill-amber-400 text-amber-400 shrink-0" />}
            <span className="text-sm font-medium text-foreground truncate">{project.title}</span>
          </div>
          {project.description && (
            <p className="text-xs text-muted-foreground line-clamp-2 mb-2">{project.description}</p>
          )}
          {project.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {project.tags.slice(0, 3).map((tag) => (
                <span key={tag} className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-muted text-muted-foreground">
                  {tag}
                </span>
              ))}
              {project.tags.length > 3 && (
                <span className="text-[10px] text-muted-foreground">+{project.tags.length - 3}</span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Drag Overlay Card ── */
function DragCard({ project }: { project: Project }) {
  return (
    <div className="rounded-lg border border-primary/30 bg-card p-3 shadow-xl shadow-black/10">
      <div className="flex items-start gap-2">
        <GripVertical className="mt-0.5 h-3.5 w-3.5 text-muted-foreground shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-1">
            {project.favorite && <Star className="h-3 w-3 fill-amber-400 text-amber-400 shrink-0" />}
            <span className="text-sm font-medium text-foreground truncate">{project.title}</span>
          </div>
          {project.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {project.tags.slice(0, 3).map((tag) => (
                <span key={tag} className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-muted text-muted-foreground">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Droppable Column ── */
function KanbanColumn({
  status,
  projects,
  selectedId,
  onSelect,
}: {
  status: string;
  projects: Project[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: `column-${status}` });
  const meta = statusMeta[status];
  const Icon = meta.icon;

  return (
    <div
      ref={setNodeRef}
      className={`flex shrink-0 w-70 flex-col rounded-xl border transition-all duration-150 ${isOver ? "border-primary/30 bg-primary/[0.02]" : "border-border/40"
        }`}
    >
      {/* Column header */}
      <div className="flex items-center gap-2 px-3 py-2.5 border-b border-border/30">
        <div className={`h-2 w-2 rounded-full ${meta.dot}`} />
        <span className={`text-xs font-semibold uppercase tracking-wider ${meta.color}`}>{meta.label}</span>
        <span className="ml-auto text-[11px] text-muted-foreground font-medium tabular-nums">{projects.length}</span>
      </div>

      {/* Column body */}
      <div className="flex-1 overflow-y-auto p-2 space-y-2 min-h-[120px]">
        {projects.length === 0 ? (
          <div className="flex items-center justify-center h-24">
            <p className="text-xs text-muted-foreground">Drop here</p>
          </div>
        ) : (
          projects.map((project) => (
            <KanbanCard
              key={project.id}
              project={project}
              isSelected={selectedId === project.id}
              onSelect={onSelect}
            />
          ))
        )}
      </div>
    </div>
  );
}

/* ── Main Board ── */
export function KanbanBoard({ projects: initialProjects, onSelect, selectedId }: KanbanBoardProps) {
  const [localProjects, setLocalProjects] = useState(initialProjects);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [movingIds, setMovingIds] = useState<Set<string>>(new Set());

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const columns = useMemo(() => {
    const groups: Record<string, Project[]> = {};
    for (const s of statuses) groups[s] = [];
    for (const p of localProjects) {
      if (groups[p.status]) groups[p.status].push(p);
    }
    for (const s of statuses) {
      groups[s].sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
    }
    return groups;
  }, [localProjects]);

  const activeProject = useMemo(
    () => (activeId ? localProjects.find((p) => p.id === activeId) : null),
    [activeId, localProjects]
  );

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  }, []);

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      setActiveId(null);
      const { active, over } = event;
      if (!over) return;

      const projectId = active.id as string;
      const fromStatus = active.data.current?.fromStatus as string;
      const overId = over.id as string;

      let toStatus: string | null = null;
      if (overId.startsWith("column-")) {
        toStatus = overId.replace("column-", "");
      } else {
        const overProject = localProjects.find((p) => p.id === overId);
        if (overProject) toStatus = overProject.status;
      }

      if (!toStatus || toStatus === fromStatus) return;

      setLocalProjects((prev) =>
        prev.map((p) => (p.id === projectId ? { ...p, status: toStatus! } : p))
      );

      setMovingIds((prev) => new Set(prev).add(projectId));
      updateProjectStatus(projectId, toStatus)
        .catch(() => {
          setLocalProjects((prev) =>
            prev.map((p) => (p.id === projectId ? { ...p, status: fromStatus } : p))
          );
        })
        .finally(() => {
          setMovingIds((prev) => {
            const next = new Set(prev);
            next.delete(projectId);
            return next;
          });
        });
    },
    [localProjects]
  );

  const handleDragCancel = useCallback(() => {
    setActiveId(null);
  }, []);

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <div className="flex-1 w-[76vw] overflow-x-auto overflow-y-hidden">
        <div className="flex gap-2 p-2 h-full min-w-max">
          {statuses.map((status) => (
            <KanbanColumn
              key={status}
              status={status}
              projects={columns[status]}
              selectedId={selectedId}
              onSelect={onSelect}
            />
          ))}
        </div>
      </div>
      <DragOverlay>
        {activeProject ? <DragCard project={activeProject} /> : null}
      </DragOverlay>
    </DndContext>
  );
}
