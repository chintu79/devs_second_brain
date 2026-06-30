"use client";

import { ErrorCard } from "@devventory/shared";

export default function ProjectError(props: { error: Error & { digest?: string }; reset: () => void }) {
  return <ErrorCard {...props} title="Failed to load project" />;
}
