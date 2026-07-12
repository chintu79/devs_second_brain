"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ease } from "@devventory/motion";
import { Database, Search, RefreshCw } from "lucide-react";

const outcomes = [
  {
    icon: Database,
    stat: "One place",
    desc: "Stop juggling 6 different apps for bookmarks, notes, PDFs, and reading lists.",
  },
  {
    icon: Search,
    stat: "Find anything",
    desc: "Full-text search across every saved item. If you saved it, you can find it.",
  },
  {
    icon: RefreshCw,
    stat: "Never lose context",
    desc: "Related resources link automatically. See the full picture, not just a fragment.",
  },
];

export function WhySection() {
  const reduced = useReducedMotion();

  return (
    <section className="relative py-32 md:py-40 overflow-hidden">
      <div className="mx-auto max-w-6xl px-6">
        <motion.div
          initial={reduced ? undefined : { opacity: 0, y: 12 }}
          whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.3, ease: ease.decelerate }}
          className="text-center mb-20"
        >
          <span className="inline-flex items-center rounded-full border border-border/60 bg-muted/30 px-3.5 py-1 text-xs font-medium text-muted-foreground/70 mb-6">
            Why Devventory
          </span>
          <h2 className="text-[2rem] font-bold tracking-[-0.02em] leading-[1.1] mb-4 max-w-3xl mx-auto">
            A knowledge OS, not <span className="text-muted-foreground/50">another tool</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {outcomes.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.stat}
                initial={reduced ? undefined : { opacity: 0, y: 20 }}
                whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.4, ease: ease.decelerate, delay: i * 0.1 }}
                className="text-center"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#6366F1]/10 to-[#6366F1]/10 border border-[#6366F1]/15 mx-auto mb-4">
                  <Icon className="h-5 w-5 text-[#6366F1]" />
                </div>
                <h3 className="text-lg font-bold tracking-tight mb-2">{item.stat}</h3>
                <p className="text-sm text-muted-foreground/70 leading-relaxed max-w-xs mx-auto">{item.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
