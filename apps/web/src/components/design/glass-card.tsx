import * as React from "react";

import { cn } from "@/lib/utils";

type GlassCardProps = React.ComponentProps<"div">;

export function GlassCard({ className, ...props }: GlassCardProps) {
  return (
    <div
      className={cn(
        "rounded-[2rem] border border-border/70 bg-card/80 shadow-2xl shadow-black/10 backdrop-blur-2xl",
        className
      )}
      {...props}
    />
  );
}
