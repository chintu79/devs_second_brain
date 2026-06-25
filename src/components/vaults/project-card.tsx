"use client";

import { useState } from "react";
import { Pencil, Trash2, ExternalLink, FolderKanban } from "lucide-react";
import { deleteProject } from "@/actions/projects";
import { ProjectDialog } from "./project-dialog";
import Link from "next/link";

interface Project {
  id: string;
  title: string;
  description: string;
  status: string;
  techStack: string[];
  tags: string[];
  createdAt: Date;
}

interface ProjectCardProps {
  project: Project;
}

const statusMeta: Record<string, { label: string; color: string }> = {
  idea: { label: "Idea", color: "text-amber-400" },
  research: { label: "Research", color: "text-blue-400" },
  planning: { label: "Planning", color: "text-purple-400" },
  building: { label: "Building", color: "text-green-400" },
  completed: { label: "Done", color: "text-emerald-400" },
  archived: { label: "Archived", color: "text-muted-foreground" },
};

export function ProjectCard({ project }: ProjectCardProps) {
  const [open, setOpen] = useState(false);

  async function handleDelete() {
    if (confirm("Delete this project?")) {
      await deleteProject(project.id);
    }
  }

  const meta = statusMeta[project.status] || { label: project.status, color: "text-muted-foreground" };

  return (
    <>
      <div className="group rounded-lg border border-border bg-card p-3.5 transition-all duration-150 hover:-translate-y-0.5 hover:border-[var(--border-hover)] hover:shadow-[var(--shadow-elevated)] hover:scale-[1.01]">
        <div className="flex items-start gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-muted">
            <FolderKanban className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <Link href={`/projects/${project.id}`} className="min-w-0 group/link">
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-medium ${meta.color}`}>●</span>
                  <span className="text-sm font-medium group-hover/link:text-primary transition-colors truncate">{project.title}</span>
                  <ExternalLink className="h-3 w-3 text-muted-foreground/50 opacity-0 group-hover/link:opacity-100 transition-opacity shrink-0" />
                </div>
                <span className="text-[10px] text-muted-foreground">{meta.label}</span>
              </Link>
              <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                <button className="flex h-7 w-7 items-center justify-center rounded text-muted-foreground hover:text-foreground hover:bg-muted transition-all duration-150 hover:scale-[1.1]" onClick={() => setOpen(true)}>
                  <Pencil className="h-3 w-3" />
                </button>
                <button className="flex h-7 w-7 items-center justify-center rounded text-muted-foreground hover:text-red-400 hover:bg-muted transition-all duration-150 hover:scale-[1.1]" onClick={handleDelete}>
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            </div>
            {project.description && (
              <p className="text-xs text-muted-foreground/70 mt-1.5 line-clamp-1 leading-relaxed">{project.description}</p>
            )}
            {project.techStack.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {project.techStack.slice(0, 3).map((tech) => (
                  <span key={tech} className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded">{tech}</span>
                ))}
                {project.techStack.length > 3 && <span className="text-[10px] text-muted-foreground">+{project.techStack.length - 3}</span>}
              </div>
            )}
          </div>
        </div>
      </div>
      <ProjectDialog project={project} open={open} onOpenChange={setOpen} />
    </>
  );
}
