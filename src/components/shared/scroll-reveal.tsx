"use client";

import { useRef, type ReactNode } from "react";
import { motion, useInView } from "framer-motion";
import { ease } from "@/lib/motion";

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export function ScrollReveal({ children, className = "", delay = 0 }: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
      animate={
        inView
          ? { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.55, delay: delay / 1000, ease: ease.decelerate } }
          : { opacity: 0, y: 24, filter: "blur(8px)", transition: { duration: 0.3 } }
      }
    >
      {children}
    </motion.div>
  );
}
