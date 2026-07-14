"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { AuthRedirect } from "@/features/auth/auth-redirect";
import { useAuth } from "@/features/auth/auth-provider";
import { AuthCard, AuthCheckbox, Field, PasswordField, SubmitButton } from "@/features/auth/components/auth-card";
import { AuthShell } from "@/features/auth/components/auth-shell";
import { registerSchema, type RegisterValues } from "@/features/auth/schemas";

export default function RegisterPage() {
  const { register: createAccount } = useAuth();
  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
  } = useForm<RegisterValues>({
    defaultValues: {
      confirmPassword: "",
      email: "",
      password: "",
      rememberMe: true,
    },
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = handleSubmit(async ({ confirmPassword: _confirmPassword, ...values }) => {
    try {
      await createAccount(values);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to create account");
    }
  });

  return (
    <AuthRedirect>
      <AuthShell
        eyebrow="New studio account"
        title="Start with a secure foundation."
        text="Create a private entry into ALANKAAR, ready for future projects, client spaces, and user-owned generation history."
      >
        <AuthCard
          title="Create account"
          subtitle="Build a secure studio identity before the first project is framed."
          footer={
            <span>
              Already have an account?{" "}
              <a className="font-medium text-[#f0c982] transition hover:text-white" href="/login">
                Sign in
              </a>
            </span>
          }
        >
          <form className="grid gap-5" onSubmit={onSubmit}>
            <Field autoComplete="email" error={errors.email} label="Email" placeholder="studio@example.com" registration={register("email")} />
            <PasswordField autoComplete="new-password" error={errors.password} label="Password" placeholder="Create a strong password" registration={register("password")} />
            <PasswordField autoComplete="new-password" error={errors.confirmPassword} label="Confirm password" placeholder="Confirm your password" registration={register("confirmPassword")} />
            <AuthCheckbox registration={register("rememberMe")}>
              Keep me signed in on this device
            </AuthCheckbox>
            <SubmitButton isLoading={isSubmitting}>{isSubmitting ? "Creating account..." : "Create account"}</SubmitButton>
          </form>
        </AuthCard>
      </AuthShell>
    </AuthRedirect>
  );
}
