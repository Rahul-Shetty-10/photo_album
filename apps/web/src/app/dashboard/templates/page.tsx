import { ProtectedRoute } from "@/features/auth/protected-route";
import { AppShell } from "@/features/dashboard/components/app-shell";
import { TemplatesPage } from "@/features/templates/components/templates-page";

export default function DashboardTemplatesPage() {
  return (
    <ProtectedRoute>
      <AppShell>
        <TemplatesPage />
      </AppShell>
    </ProtectedRoute>
  );
}
