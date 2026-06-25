"use client";

import { motion } from "framer-motion";
import { ease } from "@/lib/motion";

interface AnimatedArrowProps {
  className?: string;
}

export function AnimatedArrow({ className = "" }: AnimatedArrowProps) {
  return (
    <motion.div
      className={className}
      animate={{ x: [0, 6, 0], rotate: [0, 6, 0] }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: ease.standard,
      }}
    >
      <svg
        width="36"
        height="36"
        viewBox="0 0 24 24"
        fill="none"
      >
        <path
          d="M5 12h14M13 5l7 7-7 7"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-primary/40"
        />
      </svg>
    </motion.div>
  );
}
