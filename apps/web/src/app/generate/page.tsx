import { GenerateWorkspace } from "@/features/generate/components/generate-workspace";
import { ProtectedRoute } from "@/features/auth/protected-route";

export default function GeneratePage() {
  return (
    <ProtectedRoute>
      <GenerateWorkspace />
    </ProtectedRoute>
  );
}
