"use client";

import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { pageTransition } from "@/lib/motion";

export function PageTransitionProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <motion.div
      key={pathname}
      initial="initial"
      animate="animate"
      variants={pageTransition}
      className="h-full w-full"
    >
      {children}
    </motion.div>
  );
}
