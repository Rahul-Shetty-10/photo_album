import * as React from "react";

import { cn } from "@/lib/utils";

function Badge({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="badge"
      className={cn(
        "inline-flex items-center rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-xs font-medium tracking-[0.18em] text-primary uppercase shadow-lg shadow-primary/5",
        className
      )}
      {...props}
    />
  );
}

export { Badge };
