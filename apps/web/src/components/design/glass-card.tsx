import * as React from "react";

import { cn } from "@/lib/utils";

type GlassCardProps = React.ComponentProps<"div">;

export function GlassCard({ className, ...props }: GlassCardProps) {
  return (
    <div
      className={cn(
        "rounded-lg border border-border/70 bg-card/90 shadow-sm shadow-black/5 backdrop-blur-xl",
        className
      )}
      {...props}
    />
  );
}
