import * as React from "react";

import { cn } from "@/lib/utils";

type GlassCardProps = React.ComponentProps<"div">;

export function GlassCard({ className, ...props }: GlassCardProps) {
  return (
    <div
      className={cn(
        "rounded-[2rem] border border-white/10 bg-white/[0.055] shadow-2xl shadow-black/30 backdrop-blur-2xl",
        className
      )}
      {...props}
    />
  );
}
