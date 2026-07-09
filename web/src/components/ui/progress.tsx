import * as React from "react";

import { cn } from "@/lib/utils";

type ProgressProps = React.ComponentProps<"div"> & {
  value?: number;
};

function Progress({ className, value = 0, ...props }: ProgressProps) {
  const safeValue = Math.min(100, Math.max(0, value));

  return (
    <div
      data-slot="progress"
      className={cn(
        "h-2 overflow-hidden rounded-full bg-white/10 shadow-inner shadow-black/20",
        className
      )}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={safeValue}
      {...props}
    >
      <progress
        className="h-full w-full appearance-none overflow-hidden rounded-full [&::-moz-progress-bar]:bg-primary [&::-webkit-progress-bar]:bg-transparent [&::-webkit-progress-value]:rounded-full [&::-webkit-progress-value]:bg-gradient-to-r [&::-webkit-progress-value]:from-primary [&::-webkit-progress-value]:via-accent [&::-webkit-progress-value]:to-primary"
        value={safeValue}
        max={100}
        aria-label="Generation progress"
      />
    </div>
  );
}

export { Progress };
