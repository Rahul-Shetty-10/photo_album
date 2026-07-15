import { AuthRedirect } from "@/features/auth/auth-redirect";
import { LandingPage } from "@/features/landing/components/landing-page";

export default function Page() {
  return (
    <AuthRedirect>
      <LandingPage />
    </AuthRedirect>
  );
}
