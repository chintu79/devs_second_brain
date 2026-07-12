import { useReducedMotion } from "framer-motion";

export function useSafeVariants<T extends Record<string, unknown>>(variants: T): T | undefined {
  const reduced = useReducedMotion();
  return reduced ? undefined : variants;
}
