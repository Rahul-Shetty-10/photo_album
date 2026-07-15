import { ProtectedRoute } from "@/features/auth/protected-route";
import { AppShell } from "@/features/dashboard/components/app-shell";

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <AppShell>
        <section className="rounded-lg border border-border bg-card p-8 shadow-xl shadow-black/5">
          <p className="text-xs uppercase tracking-[0.12em] text-primary">Profile</p>
          <h1 className="mt-3 font-sans text-5xl">Studio Profile</h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground">
            Frontend-only profile area for account identity, role, and portfolio-facing details.
          </p>
        </section>
      </AppShell>
    </ProtectedRoute>
  );
}
