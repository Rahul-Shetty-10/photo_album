"use client";

import { UserRound } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/features/auth/auth-provider";
import { ProtectedRoute } from "@/features/auth/protected-route";

export default function AccountPage() {
  const { logout, user } = useAuth();

  return (
    <ProtectedRoute>
      <main className="min-h-screen px-6 py-8 sm:px-8">
        <div className="mx-auto max-w-4xl">
          <nav className="flex items-center justify-between" aria-label="Account navigation">
            <a className="font-serif text-3xl tracking-wide" href="/">
              ALANKAAR
            </a>
            <Button onClick={() => void logout()} size="sm" variant="outline" type="button">
              Logout
            </Button>
          </nav>
          <section className="mt-16 rounded-[1.5rem] border border-border bg-card/80 p-7 shadow-2xl shadow-black/10 backdrop-blur-xl">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
              <span className="grid size-16 place-items-center rounded-full bg-primary/12 text-primary">
                <UserRound className="size-7" aria-hidden="true" />
              </span>
              <div>
                <p className="text-xs uppercase tracking-[0.28em] text-primary">Account</p>
                <h1 className="mt-2 font-serif text-4xl">Studio profile</h1>
                <p className="mt-2 text-sm text-muted-foreground">{user?.email}</p>
              </div>
            </div>
          </section>
        </div>
      </main>
    </ProtectedRoute>
  );
}
