"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ease, cardHover } from "@devventory/motion";
import {
  Zap,
  Search,
  FolderTree,
  Tags,
  Link,
  BookOpenText,
} from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "One-click capture",
    desc: "Browser extension saves any URL with metadata. Under 5 seconds — never lose a thought again.",
  },
  {
    icon: Search,
    title: "Instant search",
    desc: "Full-text search across every resource, highlight, and note. Results as you type.",
  },
  {
    icon: FolderTree,
    title: "Folders & collections",
    desc: "Nested folders for structure. Unlimited tags for cross-cutting organization.",
  },
  {
    icon: Tags,
    title: "Auto-tagging",
    desc: "AI suggests tags from content. Keep what works, change what doesn't.",
  },
  {
    icon: Link,
    title: "Everything connects",
    desc: "Related items link automatically. See what context a resource belongs to.",
  },
  {
    icon: BookOpenText,
    title: "Reader mode",
    desc: "Clean reading view across articles, PDFs, and docs. Highlight and search forever.",
  },
];

export function Features() {
  const reduced = useReducedMotion();

  return (
    <section className="relative py-32 md:py-40 bg-secondary/20 border-y border-border/40">
      <div className="mx-auto max-w-6xl px-6">
        <motion.div
          initial={reduced ? undefined : { opacity: 0 }}
          whileInView={reduced ? undefined : { opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.3, ease: ease.decelerate }}
          className="text-center mb-20"
        >
          <span className="inline-flex items-center rounded-full border border-border/60 bg-muted/30 px-3.5 py-1 text-xs font-medium text-muted-foreground/70 mb-6">
            Everything you need
          </span>
          <h2 className="text-[2rem] font-bold tracking-[-0.02em] leading-[1.1] mb-4 max-w-3xl mx-auto">
            One place for <span className="text-muted-foreground/50">everything</span> you save
          </h2>
          <p className="text-base text-muted-foreground/80 max-w-xl mx-auto leading-relaxed">
            No more switching between bookmark managers, note apps, and read-later tools.
          </p>
        </motion.div>

        {/* Feature grid — 3 columns, single row then wrap */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={reduced ? undefined : { opacity: 0, y: 20 }}
                whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.4, ease: ease.decelerate, delay: i * 0.06 }}
                whileHover={reduced ? undefined : cardHover}
                className="group rounded-xl border border-border/60 bg-card p-6 hover:border-border/30 transition-all duration-150 cursor-default"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#6366F1]/10 to-[#6366F1]/10 border border-[#6366F1]/15 mb-4 group-hover:from-[#6366F1]/20 group-hover:to-[#6366F1]/20 group-hover:border-[#6366F1]/30 transition-all duration-150">
                  <Icon className="h-5 w-5 text-[#6366F1] group-hover:text-[#6366F1] group-hover:scale-110 group-hover:rotate-3 transition-all duration-150" />
                </div>
                <h3 className="text-sm font-semibold mb-2">{feature.title}</h3>
                <p className="text-xs text-muted-foreground/70 leading-relaxed">{feature.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
