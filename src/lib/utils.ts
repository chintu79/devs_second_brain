import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(dateStr?: string | Date): string {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

export function formatRelative(dateStr?: string | Date): string {
  if (!dateStr) return "";
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "now";
  if (mins < 60) return rtf.format(-mins, "minute");
  const hrs = Math.floor(diff / 3600000);
  if (hrs < 24) return rtf.format(-hrs, "hour");
  const days = Math.floor(diff / 86400000);
  if (days < 30) return rtf.format(-days, "day");
  return formatDate(dateStr);
}
