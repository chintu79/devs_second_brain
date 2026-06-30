"use client";

import { forwardRef } from "react";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { formatRelative } from "@devventory/utils";
import { PROJECT_STATUS_META } from "@devventory/types";
import { fadeInUp, stagger } from "@devventory/motion";

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
  connectionCounts: Map<string, { notes: number; resources: number; prompts: number }>;
}

export const ProjectList = forwardRef<HTMLDivElement, ProjectListProps>(
  function ProjectList({ projects, selectedId, onSelect, connectionCounts }, ref) {
    if (projects.length === 0) {
      return (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center px-6 max-w-[200px]">
            <p className="text-sm text-muted-foreground">No projects match this filter</p>
            <p className="text-xs text-muted-foreground/60 mt-1">Try a different status, tag, or search term</p>
          </div>
        </div>
      );
    }

    return (
      <motion.div
        ref={ref}
        variants={stagger.container}
        initial="hidden"
        animate="visible"
        className="flex-1 overflow-y-auto px-1 space-y-1"
      >
        {projects.map((project) => {
          const isSelected = selectedId === project.id;
          const meta = PROJECT_STATUS_META[project.status] || { label: project.status, color: "text-muted-foreground" };
          const counts = connectionCounts.get(project.id);
          const totalConnected = counts ? counts.notes + counts.resources + counts.prompts : 0;
          const todoCount = project.planMd ? (project.planMd.match(/- \[ \]/g) || []).length : 0;
          const doneCount = project.planMd ? (project.planMd.match(/- \[x\]/gi) || []).length : 0;
          const totalMilestones = Math.max(1, todoCount + doneCount);
          const progressPct = Math.round((doneCount / totalMilestones) * 100);

          return (
            <motion.div
              key={project.id}
              variants={fadeInUp}
              className={`border-b border-border last:border-b-0 transition-colors ${
                isSelected ? "bg-primary/[0.04]" : "hover:bg-muted/60"
              }`}
            >
              <button
                onClick={() => onSelect(project.id)}
                className={`w-full text-left px-3 py-2.5 rounded-lg transition-all duration-150 hover:scale-[1.02] ${
                  isSelected ? "border-l-2 border-primary" : "border-l-2 border-transparent hover:border-l-2 hover:border-border/30"
                }`}
              >
                <div className="flex items-start gap-2.5">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`h-2 w-2 rounded-full shrink-0 ${meta.color.replace("text-", "bg-")}`} />
                      <span className={`text-sm font-medium truncate flex-1 ${isSelected ? "text-foreground" : "text-foreground/85"}`}>
                        {project.title}
                      </span>
                      <button
                        onClick={(e) => { e.stopPropagation(); }}
                        className={`flex h-7 w-7 items-center justify-center rounded-md transition-colors ${project.favorite ? "text-amber-400" : "text-muted-foreground hover:text-amber-400"}`}
                        aria-label={project.favorite ? "Unfavorite project" : "Favorite project"}
                      >
                        <Star className={`h-3 w-3 ${project.favorite ? "fill-amber-400" : ""}`} />
                      </button>
                    </div>
                    {project.description && (
                      <p className="text-xs text-muted-foreground/60 mt-0.5 truncate">{project.description}</p>
                    )}
                    <div className="flex items-center gap-2 mt-1 text-[11px] text-muted-foreground/50">
                      <span className={`${meta.color} font-medium`}>{meta.label}</span>
                      <span>{formatRelative(project.updatedAt)}</span>
                      {totalConnected > 0 && <span>{totalConnected} connected</span>}
                      {project.techStack.length > 0 && (
                        <span className="truncate max-w-[80px]">{project.techStack.slice(0, 2).join(", ")}</span>
                      )}
                    </div>
                    {project.planMd && (
                      <div className="flex items-center gap-2 mt-1.5">
                        <div className="flex-1 h-1 rounded-full bg-muted overflow-hidden max-w-[120px]">
                          <div className="h-full rounded-full bg-primary/60 transition-all duration-500" style={{ width: `${progressPct}%` }} />
                        </div>
                        <span className="text-[10px] text-muted-foreground/50">{doneCount}/{totalMilestones}</span>
                      </div>
                    )}
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


