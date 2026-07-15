"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/features/auth/auth-provider";

export default function ChooseStylePage() {
  const { isAuthenticated, isRestoring } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (isRestoring) {
      return;
    }

    router.replace(isAuthenticated ? "/dashboard" : "/login");
  }, [isAuthenticated, isRestoring, router]);

  return (
    <main className="grid min-h-screen place-items-center px-6">
      <div className="h-10 w-10 animate-spin rounded-full border border-border border-t-primary" />
    </main>
  );
}
