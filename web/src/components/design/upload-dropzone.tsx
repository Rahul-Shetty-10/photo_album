import { ImagePlus, UploadCloud } from "lucide-react";

import { GlassCard } from "@/components/design/glass-card";
import { Button } from "@/components/ui/button";

export function UploadDropzone() {
  return (
    <GlassCard className="p-5">
      <div className="rounded-[1.5rem] border border-dashed border-primary/30 bg-black/15 p-6 text-center">
        <div className="mx-auto flex size-12 items-center justify-center rounded-full border border-primary/25 bg-primary/10 text-primary">
          <UploadCloud className="size-5" aria-hidden="true" />
        </div>
        <h3 className="mt-5 font-serif text-2xl text-foreground">
          Upload couple photos
        </h3>
        <p className="mx-auto mt-2 max-w-xs text-sm leading-6 text-muted-foreground">
          Add clear portraits and let ViWaah preserve faces while composing a cinematic wedding frame.
        </p>
        <Button className="mt-5" size="sm" type="button">
          <ImagePlus aria-hidden="true" />
          Select photos
        </Button>
      </div>
    </GlassCard>
  );
}
