"use client";

import { motion } from "framer-motion";
import { fadeInUp } from "@/lib/motion";

export function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeInUp}
      className="h-full"
    >
      {children}
    </motion.div>
  );
}
