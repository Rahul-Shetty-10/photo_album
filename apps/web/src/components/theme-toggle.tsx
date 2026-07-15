"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

export function ThemeToggle({ className }: { className?: string }) {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setTheme(document.documentElement.classList.contains("dark") ? "dark" : "light");
    setMounted(true);
  }, []);

  const isDark = mounted && theme === "dark";
  const nextTheme = isDark ? "light" : "dark";

  const changeTheme = () => {
    document.documentElement.classList.toggle("dark", nextTheme === "dark");
    window.localStorage.setItem("alankar-theme", nextTheme);
    setTheme(nextTheme);
  };

  return (
    <button
      aria-label={mounted ? `Switch to ${nextTheme} theme` : "Change color theme"}
      className={cn(
        "grid size-10 place-items-center rounded-full border border-border bg-card text-foreground shadow-xl shadow-black/10 backdrop-blur-xl transition hover:-translate-y-0.5 hover:border-primary/60 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        className,
      )}
      onClick={changeTheme}
      title={mounted ? `Switch to ${nextTheme} theme` : "Change color theme"}
      type="button"
    >
      {isDark ? <Sun aria-hidden="true" className="size-5" /> : <Moon aria-hidden="true" className="size-5" />}
    </button>
  );
}
