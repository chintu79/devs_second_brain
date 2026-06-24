import { Brain } from "lucide-react";
import Link from "next/link";

export default function AuthLoading() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <Link href="/" className="flex items-center gap-2 mb-8">
        <Brain className="h-6 w-6" />
        <span className="text-xl font-bold">Dev Second Brain</span>
      </Link>
      <div className="w-full max-w-sm rounded-lg border border-border bg-card p-6">
        <div className="text-center mb-6">
          <div className="skeleton h-5 w-36 rounded mx-auto mb-2" />
          <div className="skeleton h-3 w-48 rounded mx-auto" />
        </div>
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="skeleton h-3 w-12 rounded" />
            <div className="skeleton h-10 w-full rounded-md" />
          </div>
          <div className="space-y-2">
            <div className="skeleton h-3 w-16 rounded" />
            <div className="skeleton h-10 w-full rounded-md" />
          </div>
          <div className="skeleton h-10 w-full rounded-md" />
        </div>
      </div>
    </div>
  );
}
