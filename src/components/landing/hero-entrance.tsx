"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Mockup } from "./mockup";
import { TypewriterText } from "./typewriter-text";
import { ease } from "@/lib/motion";

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.15 } },
};

const childVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1, y: 0,
    transition: { duration: 0.5, ease: ease.decelerate },
  },
};

const mockupVariants = {
  hidden: { opacity: 0, y: 32, scale: 0.98 },
  visible: {
    opacity: 1, y: 0, scale: 1,
    transition: { duration: 0.6, delay: 0.5, ease: ease.decelerate },
  },
};

export function HeroEntrance() {
  return (
    <motion.div
      className="mx-auto max-w-6xl px-6 text-center"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={childVariants}>
        <div className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted/40 px-4 py-1.5 text-xs font-medium text-muted-foreground/80 mb-10">
          <Sparkles className="h-3 w-3 text-primary animate-glow-pulse" />
          Your second brain for development.
        </div>
      </motion.div>

      <motion.div variants={childVariants}>
        <h1 className="text-[clamp(2.8rem,7vw,5.5rem)] font-bold tracking-[-0.03em] leading-[1.04] mb-6 max-w-4xl mx-auto">
          Never lose another<br />
          <TypewriterText />
        </h1>
      </motion.div>

      <motion.div variants={childVariants}>
        <p className="text-muted-foreground/80 text-[17px] md:text-lg max-w-lg mx-auto mb-10 leading-relaxed">
          Save resources, prompts, notes, repositories, and project plans in one place. Search everything instantly. Rediscover what matters when you need it.
        </p>
      </motion.div>

      <motion.div variants={childVariants}>
        <div className="flex items-center justify-center gap-4">
          <Link href="/register">
            <Button size="lg" className="h-12 px-7 text-sm gap-2 bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-200">
              Get Started
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link href="#features">
            <Button variant="outline" size="lg" className="h-12 px-7 text-sm border-border/60 text-muted-foreground/80 hover:text-foreground hover:border-border transition-all duration-200">
              View Demo
            </Button>
          </Link>
        </div>
      </motion.div>

      {/* Mockup */}
      <motion.div variants={mockupVariants} className="mt-16 md:mt-20">
        <div className="animate-float mx-auto max-w-6xl px-6">
          <Mockup />
        </div>
      </motion.div>
    </motion.div>
  );
}
