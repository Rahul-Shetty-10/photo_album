import { cn } from "@/lib/utils";

type LoadingProps = {
  className?: string;
  label?: string;
};

export function Loading({ className, label = "Preparing preview" }: LoadingProps) {
  return (
    <div
      className={cn("inline-flex items-center gap-3 text-sm text-muted-foreground", className)}
      role="status"
      aria-live="polite"
    >
      <span className="size-4 animate-spin rounded-full border border-primary/25 border-t-primary" />
      <span>{label}</span>
    </div>
  );
}
