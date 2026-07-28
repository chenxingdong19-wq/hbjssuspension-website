import Link from "next/link";
import { FileQuestion, Home } from "lucide-react";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#020617] px-4">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center mx-auto mb-6">
          <FileQuestion size={28} className="text-accent" />
        </div>
        <h1 className="text-2xl font-bold text-text-primary mb-2">
          Page Not Found
        </h1>
        <p className="text-sm text-text-secondary/70 mb-8">
          The page you are looking for doesn&apos;t exist or has been moved.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent text-white text-sm font-medium rounded-md hover:bg-accent-hover transition-colors"
        >
          <Home size={16} />
          Go Home
        </Link>
      </div>
    </div>
  );
}
