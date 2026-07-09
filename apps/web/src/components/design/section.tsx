import * as React from "react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type SectionProps = React.ComponentProps<"section"> & {
  eyebrow?: string;
  title?: string;
  description?: string;
};

export function Section({
  eyebrow,
  title,
  description,
  className,
  children,
  ...props
}: SectionProps) {
  return (
    <section
      className={cn("mx-auto w-full max-w-7xl px-6 py-24 sm:px-8", className)}
      {...props}
    >
      {(eyebrow || title || description) && (
        <div className="mx-auto mb-12 max-w-3xl text-center">
          {eyebrow && <Badge>{eyebrow}</Badge>}
          {title && (
            <h2 className="mt-5 font-serif text-4xl leading-tight text-foreground sm:text-5xl">
              {title}
            </h2>
          )}
          {description && (
            <p className="mt-4 text-base leading-7 text-muted-foreground sm:text-lg">
              {description}
            </p>
          )}
        </div>
      )}
      {children}
    </section>
  );
}
