"use client";

import { motion } from "framer-motion";
import { ease } from "@/lib/motion";

interface AnimatedArrowProps {
  className?: string;
  mobile?: boolean;
}

export function AnimatedArrow({ className = "", mobile = false }: AnimatedArrowProps) {
  return (
    <motion.div
      className={className}
      animate={
        mobile
          ? { y: [0, 4, 0], rotate: [0, 3, 0] }
          : { x: [0, 6, 0], rotate: [0, 3, 0] }
      }
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: ease.standard,
      }}
    >
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        className={mobile ? "rotate-90" : ""}
      >
        <path
          d="M5 12h14M13 5l7 7-7 7"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-primary/30"
        />
      </svg>
    </motion.div>
  );
}
