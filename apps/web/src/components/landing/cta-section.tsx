"use client";

import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@devventory/ui";
import { ease } from "@devventory/motion";

export function CTASection() {
  const reduced = useReducedMotion();

  return (
    <section className="relative py-32 md:py-40 bg-secondary/20 border-y border-border/40">
      <div className="mx-auto max-w-6xl px-6 text-center">
        <motion.div
          initial={reduced ? undefined : { opacity: 0, scale: 0.98 }}
          whileInView={reduced ? undefined : { opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.4, ease: ease.decelerate }}
        >
          <span className="inline-flex items-center rounded-full border border-border/60 bg-muted/30 px-3.5 py-1 text-xs font-medium text-muted-foreground/70 mb-6">
            Get started
          </span>
          <h2 className="text-[2rem] font-bold tracking-[-0.02em] leading-[1.1] mb-4 max-w-2xl mx-auto">
            Start saving what matters
          </h2>
          <p className="text-base text-muted-foreground/80 max-w-xl mx-auto mb-10 leading-relaxed">
            Free for individual use. Open source. Your data never leaves your control.
          </p>
          <div className="flex items-center justify-center gap-3">
            <Link href="/register">
              <Button
                size="lg"
                className="h-11 px-6 text-sm gap-2 bg-gradient-to-r from-[#6366F1] to-[#6366F1] text-white shadow-lg shadow-[#6366F1]/25 hover:shadow-[#6366F1]/50 hover:scale-[1.02] transition-all"
              >
                Get Started
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
            <Link href="/login">
              <Button
                variant="outline"
                size="lg"
                className="h-11 px-6 text-sm border-border/60 text-muted-foreground/70 hover:text-foreground hover:border-border transition-all hover:scale-[1.02]"
              >
                Sign in
              </Button>
            </Link>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
