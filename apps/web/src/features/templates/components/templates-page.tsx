"use client";

import { TemplateGallery } from "@/features/templates/components/template-selection";

export function TemplatesPage() {
  return (
    <div className="grid gap-8">
      <section className="border-b border-border pb-8">
        <p className="text-xs uppercase tracking-[0.12em] text-primary">Templates</p>
        <h1 className="mt-3 font-sans text-5xl leading-none sm:text-6xl">Choose a Template</h1>
        <p className="mt-4 max-w-2xl text-sm leading-6 text-muted-foreground">
          Browse album layouts for single portraits, story spreads, mosaics, and event galleries.
        </p>
      </section>
      <TemplateGallery />
    </div>
  );
}
