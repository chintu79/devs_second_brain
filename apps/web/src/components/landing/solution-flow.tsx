"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ease } from "@devventory/motion";
import { Download, Brain, Search, RefreshCw } from "lucide-react";

const steps = [
  { icon: Download, label: "Capture", desc: "Save from anywhere" },
  { icon: Brain, label: "Understand", desc: "Context, auto-tagged" },
  { icon: Search, label: "Retrieve", desc: "Search everything" },
  { icon: RefreshCw, label: "Reconnect", desc: "Related items linked" },
];

const arrowPath = "M0,0 L40,0";

export function SolutionFlow() {
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
            How it works
          </span>
          <h2 className="text-[2rem] font-bold tracking-[-0.02em] leading-[1.1] mb-4 max-w-3xl mx-auto">
            From scattered fragments to <span className="text-[#6366F1]">connected knowledge</span>
          </h2>
        </motion.div>

        {/* Flow diagram */}
        <div className="relative flex flex-col md:flex-row items-center justify-center gap-8 md:gap-0">
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <div key={step.label} className="flex items-center">
                <motion.div
                  initial={reduced ? undefined : { opacity: 0, y: 24 }}
                  whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.4, ease: ease.decelerate, delay: i * 0.2 }}
                  className="flex flex-col items-center text-center px-6"
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#6366F1]/10 to-[#6366F1]/10 border border-[#6366F1]/20 mb-4">
                    <Icon className="h-6 w-6 text-[#6366F1]" />
                  </div>
                  <span className="text-sm font-semibold mb-1">{step.label}</span>
                  <span className="text-xs text-muted-foreground/60">{step.desc}</span>
                </motion.div>

                {/* Animated SVG arrow */}
                {i < steps.length - 1 && (
                  <div className="hidden md:block mx-4">
                    <svg width="40" height="16" viewBox="0 0 40 16" fill="none" className="text-muted-foreground/30">
                      <motion.path
                        d={arrowPath}
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        initial={reduced ? undefined : { pathLength: 0 }}
                        whileInView={reduced ? undefined : { pathLength: 1 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ duration: 0.6, ease: "linear", delay: i * 0.2 + 0.3 }}
                      />
                      <motion.polygon
                        points="38,8 32,4 32,12"
                        fill="currentColor"
                        initial={reduced ? undefined : { opacity: 0 }}
                        whileInView={reduced ? undefined : { opacity: 1 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ duration: 0.2, delay: i * 0.2 + 0.8 }}
                      />
                    </svg>
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
