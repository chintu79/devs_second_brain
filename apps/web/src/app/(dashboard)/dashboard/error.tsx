"use client";

import { ErrorCard } from "@devventory/shared";

export default function DashboardError(props: { error: Error & { digest?: string }; reset: () => void }) {
  return <ErrorCard {...props} title="Failed to load dashboard" />;
}
