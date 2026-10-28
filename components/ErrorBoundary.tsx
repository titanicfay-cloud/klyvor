"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Page crashed:", error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center animate-in fade-in">
      <div className="w-20 h-20 bg-[#EF4444]/10 border border-[#EF4444]/20 rounded-full flex items-center justify-center mb-6">
        <AlertTriangle className="w-10 h-10 text-[#EF4444]" />
      </div>
      <h2 className="text-2xl font-bold text-white mb-2">Something went wrong.</h2>
      <p className="text-[#C7D0E0] mb-8 max-w-md">
        This specific tool encountered an error, but the rest of your workspace is completely safe. 
      </p>
      <Button onClick={() => reset()} className="bg-klyvor-gradient text-white">
        Try Again
      </Button>
    </div>
  );
}
