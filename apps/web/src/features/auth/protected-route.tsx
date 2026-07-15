"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "./auth-provider";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isRestoring } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (!isRestoring && !isAuthenticated) {
      const returnTo = `${window.location.pathname}${window.location.search}`;
      router.replace(`/login?returnTo=${encodeURIComponent(returnTo)}`);
    }
  }, [isAuthenticated, isRestoring, router]);

  if (isRestoring || !isAuthenticated) {
    return (
      <main className="grid min-h-screen place-items-center px-6">
        <div className="h-10 w-10 animate-spin rounded-full border border-border border-t-primary" />
      </main>
    );
  }

  return children;
}
