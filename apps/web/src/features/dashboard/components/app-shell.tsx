"use client";

import * as React from "react";
import { ChevronDown, LogOut, Settings, User } from "lucide-react";
import Link from "next/link";

import { ThemeToggle } from "@/components/theme-toggle";
import { useAuth } from "@/features/auth/auth-provider";

function GovernmentCrest() {
  return (
    <svg viewBox="0 0 40 40" className="size-9 shrink-0" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="20" cy="20" r="18" strokeWidth="1.5" className="stroke-primary" />
      <circle cx="20" cy="20" r="12" strokeWidth="0.8" className="stroke-primary/60" />
      <circle cx="20" cy="20" r="4" className="fill-primary" />
      {Array.from({ length: 24 }, (_, i) => (
        <line
          key={i}
          x1="20" y1="8" x2="20" y2="12"
          strokeWidth="0.6"
          className="stroke-primary"
          transform={`rotate(${i * 15} 20 20)`}
        />
      ))}
    </svg>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const { logout, user } = useAuth();
  const initials = user?.email.slice(0, 2).toUpperCase() ?? "AL";

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b border-border bg-card shadow-sm">
        <div className="flex h-16 w-full items-center gap-4 px-5 sm:px-8">
          <Link className="flex items-center gap-3" href="/dashboard">
            <GovernmentCrest />
            <div>
              <h1 className="font-sans text-xl leading-tight tracking-tight text-primary">
                ALANKAAR
              </h1>
              <p className="text-[11px] leading-tight text-muted-foreground tracking-wider uppercase">
                Digital Photo Album Platform
              </p>
            </div>
          </Link>
          <div className="ml-auto flex items-center gap-2">
            <ThemeToggle />
            <details className="group relative">
              <summary className="flex cursor-pointer list-none items-center gap-2 rounded-full border border-border bg-card px-2 py-1.5 text-sm shadow-sm outline-none transition hover:border-primary/50 focus-visible:ring-2 focus-visible:ring-ring">
                <span className="grid size-9 place-items-center rounded-full bg-primary text-xs font-semibold uppercase text-primary-foreground shadow-sm">
                  {initials}
                </span>
                <span className="hidden max-w-44 truncate text-sm font-medium lg:inline">
                  {user?.email ?? "Studio user"}
                </span>
                <ChevronDown className="hidden size-4 text-muted-foreground transition group-open:rotate-180 sm:block" aria-hidden="true" />
              </summary>
              <div className="absolute right-0 mt-3 w-72 overflow-hidden rounded-xl border border-border bg-popover text-popover-foreground shadow-2xl shadow-black/15">
                <div className="flex items-center gap-3 border-b border-border px-4 py-4">
                  <span className="grid size-11 place-items-center rounded-full bg-primary text-sm font-semibold uppercase text-primary-foreground">
                    {initials}
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs uppercase tracking-[0.12em] text-primary">Signed in</p>
                    <p className="mt-1 truncate text-sm font-medium">{user?.email ?? "Studio user"}</p>
                  </div>
                </div>
                <div className="p-2">
                  <Link className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground transition hover:bg-muted hover:text-foreground" href="/dashboard/profile">
                    <User className="size-4" aria-hidden="true" />
                    Profile
                  </Link>
                  <Link className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground transition hover:bg-muted hover:text-foreground" href="/dashboard/settings">
                    <Settings className="size-4" aria-hidden="true" />
                    Settings
                  </Link>
                  <button
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm text-muted-foreground transition hover:bg-muted hover:text-foreground"
                    onClick={() => void logout()}
                    type="button"
                  >
                    <LogOut className="size-4" aria-hidden="true" />
                    Logout
                  </button>
                </div>
              </div>
            </details>
          </div>
        </div>
        <div className="h-[3px] bg-gradient-to-r from-primary via-primary/60 to-primary" />
      </header>
      <main className="relative mx-auto w-full max-w-7xl px-5 py-6 sm:px-8">{children}</main>
    </div>
  );
}
