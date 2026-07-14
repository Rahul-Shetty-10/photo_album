"use client";

import * as React from "react";
import { ArrowRight, Check, Eye, EyeOff, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { type FieldError, type UseFormRegisterReturn } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export function AuthCard({
  children,
  footer,
  subtitle,
  title,
}: {
  children: React.ReactNode;
  footer: React.ReactNode;
  subtitle: string;
  title: string;
}) {
  return (
    <section className="relative w-full overflow-hidden rounded-[2rem] border border-white/14 bg-[#11100e]/72 p-6 text-white shadow-2xl shadow-black/40 backdrop-blur-3xl sm:p-8 lg:p-10">
      <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-[#f0c982]/70 to-transparent" />
      <div className="pointer-events-none absolute -right-20 -top-24 h-56 w-56 rounded-full bg-[#e7bd72]/12 blur-3xl" />
      <div>
        <h2 className="font-serif text-4xl leading-none text-white sm:text-5xl">{title}</h2>
        <p className="mt-4 text-sm leading-6 text-white/58">{subtitle}</p>
      </div>
      <div className="mt-8">{children}</div>
      <div className="mt-8 border-t border-white/10 pt-6 text-sm text-white/58">{footer}</div>
    </section>
  );
}

export function Field({
  error,
  label,
  registration,
  type = "text",
  ...props
}: React.ComponentProps<typeof Input> & {
  error?: FieldError;
  label: string;
  registration: UseFormRegisterReturn;
}) {
  return (
    <motion.label className="grid gap-2 text-sm text-white/74" layout>
      <span className="font-medium text-white/86">{label}</span>
      <Input
        aria-invalid={Boolean(error)}
        className={cn(
          "h-14 rounded-2xl border-white/12 bg-white/[0.055] px-5 text-base text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] placeholder:text-white/32 hover:border-white/22 focus-visible:border-[#e7bd72]/70 focus-visible:ring-[#e7bd72]/20",
          error && "border-destructive/70 focus-visible:border-destructive/70 focus-visible:ring-destructive/20"
        )}
        type={type}
        {...registration}
        {...props}
      />
      {error && (
        <motion.span animate={{ opacity: 1, y: 0 }} className="text-xs text-[#ffb4a8]" initial={{ opacity: 0, y: -4 }}>
          {error.message}
        </motion.span>
      )}
    </motion.label>
  );
}

export function PasswordField({
  error,
  label,
  registration,
  ...props
}: React.ComponentProps<typeof Input> & {
  error?: FieldError;
  label: string;
  registration: UseFormRegisterReturn;
}) {
  const [isVisible, setIsVisible] = React.useState(false);

  return (
    <motion.label className="grid gap-2 text-sm text-white/74" layout>
      <span className="font-medium text-white/86">{label}</span>
      <span className="relative">
        <Input
          aria-invalid={Boolean(error)}
          className={cn(
            "h-14 rounded-2xl border-white/12 bg-white/[0.055] px-5 pr-14 text-base text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] placeholder:text-white/32 hover:border-white/22 focus-visible:border-[#e7bd72]/70 focus-visible:ring-[#e7bd72]/20",
            error && "border-destructive/70 focus-visible:border-destructive/70 focus-visible:ring-destructive/20"
          )}
          type={isVisible ? "text" : "password"}
          {...registration}
          {...props}
        />
        <button
          aria-label={isVisible ? "Hide password" : "Show password"}
          className="absolute right-3 top-1/2 grid size-9 -translate-y-1/2 place-items-center rounded-full text-white/50 transition hover:bg-white/10 hover:text-[#f3d99f] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e7bd72]/35"
          onClick={() => setIsVisible((value) => !value)}
          type="button"
        >
          {isVisible ? <EyeOff className="size-4" aria-hidden="true" /> : <Eye className="size-4" aria-hidden="true" />}
        </button>
      </span>
      {error && (
        <motion.span animate={{ opacity: 1, y: 0 }} className="text-xs text-[#ffb4a8]" initial={{ opacity: 0, y: -4 }}>
          {error.message}
        </motion.span>
      )}
    </motion.label>
  );
}

export function SubmitButton({ children, isLoading }: { children: React.ReactNode; isLoading: boolean }) {
  return (
    <Button
      className="group mt-1 h-14 w-full rounded-full bg-[#e8bd72] text-base text-[#120f0a] shadow-[0_18px_55px_rgba(232,189,114,0.22)] hover:bg-[#f0cc86] hover:shadow-[0_22px_65px_rgba(232,189,114,0.3)]"
      disabled={isLoading}
      size="lg"
      type="submit"
    >
      {isLoading && <Loader2 className="animate-spin" aria-hidden="true" />}
      {children}
      {!isLoading && <ArrowRight className="ml-auto transition-transform group-hover:translate-x-1" aria-hidden="true" />}
    </Button>
  );
}

export function AuthCheckbox({
  children,
  registration,
}: {
  children: React.ReactNode;
  registration: UseFormRegisterReturn;
}) {
  return (
    <label className="group flex cursor-pointer items-center gap-3 text-sm text-white/66">
      <span className="relative grid size-5 place-items-center">
        <input className="peer absolute inset-0 size-5 cursor-pointer appearance-none rounded-md border border-white/18 bg-white/[0.06] transition checked:border-[#e7bd72] checked:bg-[#e7bd72] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e7bd72]/35" type="checkbox" {...registration} />
        <Check className="pointer-events-none size-3.5 text-[#120f0a] opacity-0 transition peer-checked:opacity-100" aria-hidden="true" />
      </span>
      <span>{children}</span>
    </label>
  );
}
