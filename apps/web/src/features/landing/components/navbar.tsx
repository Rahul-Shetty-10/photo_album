"use client";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/features/auth/auth-provider";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Features", href: "#features" },
  { label: "Workflow", href: "#workflow" },
];

export function Navbar() {
  const { isAuthenticated, logout, user } = useAuth();
  const initials = user?.email.slice(0, 2).toUpperCase() ?? "AL";

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-background/65 backdrop-blur-2xl">
      <nav
        className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 sm:px-8"
        aria-label="Main navigation"
      >
        <a className="font-serif text-2xl tracking-wide text-foreground" href="/">
          ALANKAR
        </a>
        <div className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => (
            <a
              className="text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:text-foreground focus-visible:outline-none"
              href={item.href}
              key={item.href}
            >
              {item.label}
            </a>
          ))}
        </div>
        {isAuthenticated ? (
          <div className="flex items-center gap-3">
            <Button asChild size="sm" variant="outline">
              <a href="/projects">Projects</a>
            </Button>
            <details className="group relative">
              <summary className="flex cursor-pointer list-none items-center gap-2 rounded-full border border-border bg-card px-2 py-1.5 text-sm outline-none">
                <span className="grid size-8 place-items-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                  {initials}
                </span>
              </summary>
              <div className="absolute right-0 mt-3 w-64 rounded-2xl border border-border bg-card p-2 shadow-2xl shadow-black/20">
                <div className="px-3 py-3">
                  <p className="text-xs uppercase tracking-[0.22em] text-primary">Signed in</p>
                  <p className="mt-2 truncate text-sm text-muted-foreground">{user?.email}</p>
                </div>
                <a className="block rounded-xl px-3 py-2 text-sm hover:bg-muted" href="/account">
                  Account
                </a>
                <button className="w-full rounded-xl px-3 py-2 text-left text-sm text-muted-foreground hover:bg-muted hover:text-foreground" onClick={() => void logout()} type="button">
                  Logout
                </button>
              </div>
            </details>
          </div>
        ) : (
          <Button asChild size="sm">
            <a href="/login">Sign In</a>
          </Button>
        )}
      </nav>
    </header>
  );
}
