"use client";

import { Check } from "lucide-react";

import { photoTemplates, type PhotoTemplate } from "@/features/templates/template-library";
import { cn } from "@/lib/utils";

type TemplateGalleryProps = {
  onSelectTemplate?: (template: PhotoTemplate) => void;
  selectedTemplateId?: string | null;
};

const hashTemplateId = (value: string) =>
  [...value].reduce((hash, character) => (hash * 31 + character.charCodeAt(0)) >>> 0, 7);

export function TemplatePreview({ template }: { template: PhotoTemplate }) {
  const templateHash = hashTemplateId(template.id);

  return (
    <div className="relative aspect-[4/3] overflow-hidden rounded-t-lg bg-[#0c0907] p-3">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_12%,rgba(45,212,191,0.18),transparent_34%),radial-gradient(circle_at_82%_18%,rgba(255,255,255,0.08),transparent_24%),linear-gradient(145deg,rgba(255,248,232,0.04),transparent_45%)]" />
      <div className="relative h-full w-full">
        {template.slots.map((slot, index) => {
          const accent = (templateHash + index * 17) % 4;
          const skeletonTone =
            accent === 0
              ? "rgba(45,212,191,0.34)"
              : accent === 1
                ? "rgba(20,184,166,0.31)"
                : accent === 2
                  ? "rgba(245,232,202,0.25)"
                  : "rgba(13,148,136,0.35)";

          return (
            <div
              className="absolute overflow-hidden rounded-md border border-white/15 bg-[#1b1510] shadow-lg shadow-black/30"
              key={`${template.id}-${index}`}
              style={{
                height: `${(slot.h / 12) * 100}%`,
                left: `${(slot.x / 12) * 100}%`,
                top: `${(slot.y / 12) * 100}%`,
                width: `${(slot.w / 12) * 100}%`,
              }}
            >
              <div
                aria-hidden="true"
                className="absolute inset-0 transition duration-500 group-hover:scale-105"
                style={{
                  background: `radial-gradient(circle at 35% 22%, ${skeletonTone}, transparent 36%), linear-gradient(135deg, rgba(255,248,232,0.12), rgba(12,9,7,0.94))`,
                }}
              />
              <div className="absolute left-[13%] top-[16%] h-[18%] w-[38%] rounded-full bg-white/18" />
              <div className="absolute bottom-[15%] left-[13%] h-[8%] w-[58%] rounded-full bg-white/12" />
              <div className="absolute bottom-[28%] left-[13%] h-[7%] w-[36%] rounded-full bg-white/10" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/28 via-transparent to-white/5" />
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function TemplateCard({ onSelectTemplate, selectedTemplateId, template }: TemplateGalleryProps & { template: PhotoTemplate }) {
  const isSelected = selectedTemplateId === template.id;

  return (
    <button
      className={cn(
        "group relative overflow-hidden rounded-lg border bg-card text-left shadow-xl shadow-black/8 outline-none transition duration-300 hover:-translate-y-1 hover:border-primary/45 hover:shadow-primary/10 focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/45",
        isSelected ? "border-primary/80 ring-2 ring-primary/25" : "border-border",
      )}
      onClick={() => onSelectTemplate?.(template)}
      type="button"
    >
      <TemplatePreview template={template} />
      {isSelected ? (
        <span className="absolute right-3 top-3 grid size-8 place-items-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/25">
          <Check className="size-4" aria-hidden="true" />
        </span>
      ) : null}
      <div className="px-4 py-3">
        <h2 className="font-sans text-xl leading-tight text-foreground">{template.name}</h2>
        <p className="mt-1 text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-primary/80">
          {template.imageCount} image{template.imageCount === 1 ? "" : "s"}
        </p>
      </div>
    </button>
  );
}

export function TemplateGallery({ onSelectTemplate, selectedTemplateId }: TemplateGalleryProps) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {photoTemplates.map((template) => (
        <TemplateCard
          key={template.id}
          onSelectTemplate={onSelectTemplate}
          selectedTemplateId={selectedTemplateId}
          template={template}
        />
      ))}
    </div>
  );
}

export function getTemplateById(templateId?: string | null) {
  return photoTemplates.find((template) => template.id === templateId);
}
