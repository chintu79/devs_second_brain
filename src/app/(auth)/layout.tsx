import { Brain } from "lucide-react";
import Link from "next/link";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <Link href="/" className="flex items-center gap-2 mb-8">
        <Brain className="h-6 w-6" />
        <span className="text-xl font-bold">Dev Second Brain</span>
      </Link>
      {children}
    </div>
  );
}
