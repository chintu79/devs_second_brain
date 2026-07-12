"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ease, cardHover } from "@devventory/motion";
import {
  Bookmark,
  MessageSquare,
  FileText,
  Video,
  Globe,
  Code2,
  StickyNote,
  Mail,
} from "lucide-react";

const tools = [
  { icon: Bookmark, label: "Bookmarks" },
  { icon: MessageSquare, label: "WhatsApp" },
  { icon: FileText, label: "PDFs" },
  { icon: Video, label: "Videos" },
  { icon: Globe, label: "Chrome" },
  { icon: Code2, label: "GitHub" },
  { icon: StickyNote, label: "Notes" },
  { icon: Mail, label: "Email" },
];

// random-ish offsets for scatter entrance
const scatter = [
  { x: -80, y: -60 }, { x: 90, y: -50 }, { x: 120, y: -70 },
  { x: -90, y: 40 },  { x: 70, y: 50 },  { x: 130, y: 30 },
  { x: -60, y: 80 },  { x: 100, y: 90 },
];

export function ProblemSection() {
  const reduced = useReducedMotion();

  return (
    <section id="problem-section" className="relative py-32 md:py-40 overflow-hidden">
      <div className="mx-auto max-w-6xl px-6">
        {/* Headline */}
        <motion.div
          initial={reduced ? undefined : { opacity: 0, y: 20 }}
          whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5, ease: ease.decelerate }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center rounded-full border border-border/60 bg-muted/30 px-3.5 py-1 text-xs font-medium text-muted-foreground/70 mb-6">
            The challenge
          </span>
          <h2 className="text-[2rem] font-bold tracking-[-0.02em] leading-[1.1] mb-4 max-w-3xl mx-auto">
            Your knowledge lives <span className="text-muted-foreground/50">everywhere</span>
          </h2>
          <p className="text-base text-muted-foreground/80 max-w-xl mx-auto leading-relaxed">
            Bookmarks. PDFs. Notes. Screenshots. Videos. GitHub issues. Every tool
            saves to a different place — but context lives nowhere.
          </p>
        </motion.div>

        {/* Tools grid — flex wrap, natural flow */}
        <div className="flex flex-wrap justify-center gap-3 max-w-2xl mx-auto">
          {tools.map((tool, i) => {
            const Icon = tool.icon;
            return (
              <motion.div
                key={tool.label}
                initial={reduced ? undefined : { opacity: 0, x: scatter[i].x, y: scatter[i].y }}
                whileInView={reduced ? undefined : { opacity: 1, x: 0, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, ease: ease.decelerate, delay: i * 0.07 }}
                whileHover={reduced ? undefined : cardHover}
                className="flex items-center gap-2.5 rounded-xl border border-border/60 bg-card px-4 py-3 transition-shadow duration-150 hover:shadow-md hover:border-border/40 cursor-default"
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors duration-150">
                  <Icon className="h-3.5 w-3.5 text-muted-foreground/70 hover:text-foreground/90 transition-colors duration-150" />
                </div>
                <span className="text-sm font-medium text-foreground/80">{tool.label}</span>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
