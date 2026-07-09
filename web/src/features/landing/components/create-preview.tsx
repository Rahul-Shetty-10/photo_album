import { Loading } from "@/components/design/loading";
import { Section } from "@/components/design/section";
import { UploadDropzone } from "@/components/design/upload-dropzone";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function CreatePreview() {
  return (
    <Section
      id="create"
      eyebrow="Design system"
      title="A reusable product surface for future AI flows"
      description="These controls are frontend-only and ready to connect when product logic exists."
    >
      <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
        <UploadDropzone />
        <form className="rounded-[2rem] border border-white/10 bg-white/[0.055] p-6 shadow-2xl shadow-black/25 backdrop-blur-2xl">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="grid gap-2 text-sm text-muted-foreground">
              Couple name
              <Input placeholder="Aarav and Meera" />
            </label>
            <label className="grid gap-2 text-sm text-muted-foreground">
              Wedding style
              <Input placeholder="Palace reception" />
            </label>
          </div>
          <label className="mt-4 grid gap-2 text-sm text-muted-foreground">
            Creative direction
            <Textarea placeholder="Warm ivory wardrobe, luxury gold ambience, cinematic evening portrait." />
          </label>
          <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <Loading label="Frontend preview state" />
            <Button type="button">Prepare Preview</Button>
          </div>
        </form>
      </div>
    </Section>
  );
}
