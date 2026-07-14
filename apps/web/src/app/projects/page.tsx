import { ProtectedRoute } from "@/features/auth/protected-route";
import { ProjectsDashboard } from "@/features/projects/components/projects-dashboard";

export default function ProjectsPage() {
  return (
    <ProtectedRoute>
      <ProjectsDashboard />
    </ProtectedRoute>
  );
}
