"use client";

import { motion } from "framer-motion";
import { stagger, fadeInUp } from "@/lib/motion";

export function DashboardContent({ children }: { children: React.ReactNode }) {
  return (
    <motion.div variants={stagger.container} initial="hidden" animate="visible">
      {children}
    </motion.div>
  );
}

export function DashboardSection({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div variants={fadeInUp} className={className}>
      {children}
    </motion.div>
  );
}
