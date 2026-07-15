import { ProtectedRoute } from "@/features/auth/protected-route";
import { ProjectWorkspace } from "@/features/projects/components/project-workspace";

export default async function DashboardProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <ProtectedRoute>
      <ProjectWorkspace projectId={id} />
    </ProtectedRoute>
  );
}
