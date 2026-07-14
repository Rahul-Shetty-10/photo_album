"use client";

import { Mail } from "lucide-react";

import { AuthRedirect } from "@/features/auth/auth-redirect";
import { AuthCard } from "@/features/auth/components/auth-card";
import { AuthShell } from "@/features/auth/components/auth-shell";

export default function ForgotPasswordPage() {
  return (
    <AuthRedirect>
      <AuthShell
        eyebrow="Account recovery"
        title="Reset with care."
        text="Account recovery should feel as considered as the workspace itself. Email delivery can be enabled when transactional mail is configured."
      >
        <AuthCard
          title="Forgot password"
          subtitle="Email delivery is not configured yet, so ALANKAAR avoids presenting a fake recovery flow."
          footer={
            <a className="font-medium text-[#f0c982] transition hover:text-white" href="/login">
              Back to sign in
            </a>
          }
        >
          <div className="rounded-3xl border border-white/12 bg-white/[0.055] p-5">
            <Mail className="size-6 text-[#f0c982]" aria-hidden="true" />
            <p className="mt-4 text-sm leading-6 text-white/62">
              Ask an administrator to configure transactional email before enabling password reset links.
            </p>
          </div>
        </AuthCard>
      </AuthShell>
    </AuthRedirect>
  );
}
