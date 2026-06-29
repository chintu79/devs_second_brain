"use client";

import { ErrorCard } from "@/components/shared/error-card";

export default function ResourcesError(props: { error: Error & { digest?: string }; reset: () => void }) {
  return <ErrorCard {...props} title="Failed to load resources" />;
}
