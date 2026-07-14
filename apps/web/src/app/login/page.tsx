"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { AuthRedirect } from "@/features/auth/auth-redirect";
import { useAuth } from "@/features/auth/auth-provider";
import { AuthCard, AuthCheckbox, Field, PasswordField, SubmitButton } from "@/features/auth/components/auth-card";
import { AuthShell } from "@/features/auth/components/auth-shell";
import { loginSchema, type LoginValues } from "@/features/auth/schemas";

export default function LoginPage() {
  const { login } = useAuth();
  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
  } = useForm<LoginValues>({
    defaultValues: {
      email: "",
      password: "",
      rememberMe: true,
    },
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = handleSubmit(async (values) => {
    try {
      await login(values);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to sign in");
    }
  });

  return (
    <AuthRedirect>
      <AuthShell
        eyebrow="Secure studio access"
        title="Return to the studio."
        text="Restore your private ALANKAAR workspace for composed projects, persistent sessions, and image direction built with care."
      >
        <AuthCard
          title="Sign in"
          subtitle="Enter your studio credentials and continue where the last session left off."
          footer={
            <span>
              New to ALANKAAR?{" "}
              <a className="font-medium text-[#f0c982] transition hover:text-white" href="/register">
                Create an account
              </a>
            </span>
          }
        >
          <form className="grid gap-5" onSubmit={onSubmit}>
            <Field autoComplete="email" error={errors.email} label="Email" placeholder="studio@example.com" registration={register("email")} />
            <PasswordField autoComplete="current-password" error={errors.password} label="Password" placeholder="Enter your password" registration={register("password")} />
            <div className="flex items-center justify-between gap-4 text-sm">
              <AuthCheckbox registration={register("rememberMe")}>
                Remember me
              </AuthCheckbox>
              <a className="text-[#f0c982] transition hover:text-white" href="/forgot-password">
                Forgot password?
              </a>
            </div>
            <SubmitButton isLoading={isSubmitting}>{isSubmitting ? "Signing in..." : "Sign in"}</SubmitButton>
          </form>
        </AuthCard>
      </AuthShell>
    </AuthRedirect>
  );
}
