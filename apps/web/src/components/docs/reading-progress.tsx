"use client";

import { useEffect, useState } from "react";
import { motion, useScroll, useSpring } from "framer-motion";

export function ReadingProgress() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  const { scrollYProgress } = useScroll();
  const scaleY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  if (!mounted) return null;

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-0.5 z-50 origin-left"
      style={{
        scaleX: scaleY,
        background: "linear-gradient(90deg, var(--accent, #6366f1), color-mix(in srgb, var(--accent, #6366f1) 60%, transparent))",
      }}
    />
  );
}
