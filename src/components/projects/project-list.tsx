"use client";

import { forwardRef } from "react";
import { motion } from "framer-motion";
import { FolderKanban, Star } from "lucide-react";
import { stagger, fadeInUp } from "@/lib/motion";

interface Project {
  id: string;
  title: string;
  description: string;
  status: string;
  techStack: string[];
  tags: string[];
  planMd: string;
  favorite: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface ProjectListProps {
  projects: Project[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

const statusMeta: Record<string, { label: string; color: string }> = {
  idea: { label: "Idea", color: "text-amber-400" },
  research: { label: "Research", color: "text-blue-400" },
  planning: { label: "Planning", color: "text-purple-400" },
  building: { label: "Building", color: "text-green-400" },
  completed: { label: "Done", color: "text-emerald-400" },
  archived: { label: "Archived", color: "text-muted-foreground" },
};

export const ProjectList = forwardRef<HTMLDivElement, ProjectListProps>(
  function ProjectList({ projects, selectedId, onSelect }, ref) {
    if (projects.length === 0) {
      return (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center px-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted mx-auto mb-3">
              <FolderKanban className="h-5 w-5 text-muted-foreground" />
            </div>
            <p className="text-base text-muted-foreground">No projects match this filter</p>
          </div>
        </div>
      );
    }

    return (
      <motion.div
        ref={ref}
        className="flex-1 overflow-y-auto space-y-1 px-1"
        variants={stagger.container}
        initial="hidden"
        animate="visible"
      >
        {projects.map((project) => {
          const isSelected = selectedId === project.id;
          const meta = statusMeta[project.status] || { label: project.status, color: "text-muted-foreground" };
          const totalMilestones = 4;
          const completedMilestones = project.planMd ? (project.planMd.match(/- \[x\]/gi) || []).length : 0;

          return (
            <motion.div key={project.id} variants={fadeInUp}>
            <button
              onClick={() => onSelect(project.id)}
              className={`w-full text-left rounded-lg p-4 transition-all duration-150 ${
                isSelected ? "bg-primary/10 border border-primary/20 shadow-sm" : "hover:bg-muted/50 border border-transparent"
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-md ${isSelected ? "bg-primary/10" : "bg-muted"}`}>
                  <FolderKanban className={`h-5 w-5 ${isSelected ? "text-primary" : "text-muted-foreground"}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-medium ${meta.color}`}>&#9679;</span>
                    <span className={`text-base font-medium truncate ${isSelected ? "text-foreground" : "text-foreground/90"}`}>
                      {project.title}
                    </span>
                    {project.favorite && <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400 shrink-0" />}
                  </div>
                  {project.description && (
                    <p className="text-sm text-muted-foreground/70 mt-1 line-clamp-1 leading-relaxed">{project.description}</p>
                  )}
                  <div className="flex items-center gap-3 mt-1.5 text-xs text-muted-foreground">
                    <span className="bg-muted/70 px-1.5 py-0.5 rounded text-xs">{meta.label}</span>
                    <span>Updated {formatTimeAgo(project.updatedAt)}</span>
                    {project.planMd && (
                      <span className="text-primary/60">{completedMilestones}/{totalMilestones} phases</span>
                    )}
                  </div>
                </div>
              </div>
            </button>
            </motion.div>
          );
        })}
      </motion.div>
    );
  }
);

function formatTimeAgo(date: Date): string {
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
