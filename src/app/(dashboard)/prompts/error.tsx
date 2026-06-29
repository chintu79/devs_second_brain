"use client";

import { ErrorCard } from "@/components/shared/error-card";

export default function PromptsError(props: { error: Error & { digest?: string }; reset: () => void }) {
  return <ErrorCard {...props} title="Failed to load prompts" />;
}
