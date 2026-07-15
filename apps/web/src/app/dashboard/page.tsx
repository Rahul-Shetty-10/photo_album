import { ProtectedRoute } from "@/features/auth/protected-route";
import { AppShell } from "@/features/dashboard/components/app-shell";
import { DashboardHome } from "@/features/dashboard/components/dashboard-home";

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <AppShell>
        <DashboardHome />
      </AppShell>
    </ProtectedRoute>
  );
}
