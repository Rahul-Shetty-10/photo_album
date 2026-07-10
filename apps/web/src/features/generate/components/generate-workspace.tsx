"use client";

import * as React from "react";
import { ArrowLeft, Check, ChevronDown, SlidersHorizontal, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

import { AnimatedGradient } from "@/components/design/animated-gradient";
import { UploadDropzone } from "@/components/design/upload-dropzone";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

const weddingStyles = [
  "Royal",
  "Traditional",
  "Temple",
  "Palace",
  "Beach",
  "Reception",
  "South Indian",
  "North Indian",
  "Christian",
  "Muslim",
  "Custom",
];

const aspectRatios = ["1:1", "2:3", "3:4", "4:3", "16:9"];
const qualities = ["Standard", "High", "Ultra"];
const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000/api/v1";

type UploadResponse = {
  secureUrl: string;
  uploadId: string;
};

type GenerationResponse = {
  jobId: string;
  status: string;
};

type GenerationStatus = {
  errorMessage?: string | null;
  generatedImageUrls: string[];
  id: string;
  progress: number;
  status: string;
};

const lastGenerationJobKey = "viwaah:last-generation-job-id";

const getErrorMessage = async (response: Response, fallback: string) => {
  try {
    const body = (await response.json()) as { message?: string; requestId?: string };
    return body.message ? `${body.message}${body.requestId ? ` (${body.requestId})` : ""}` : fallback;
  } catch {
    return fallback;
  }
};

const uploadImage = async (file: File) => {
  const formData = new FormData();
  formData.append("image", file);

  const response = await fetch(`${apiBaseUrl}/upload`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error(await getErrorMessage(response, `Upload failed with status ${response.status}`));
  }

  return response.json() as Promise<UploadResponse>;
};

const createGeneration = async (payload: {
  aspectRatio: string;
  brideUploadId: string;
  customPrompt?: string;
  groomUploadId: string;
  numberOfImages: number;
  style: string;
  theme: string;
}) => {
  const response = await fetch(`${apiBaseUrl}/generate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(await getErrorMessage(response, `Generation request failed with status ${response.status}`));
  }

  return response.json() as Promise<GenerationResponse>;
};

const getGenerationStatus = async (jobId: string) => {
  const response = await fetch(`${apiBaseUrl}/generate/${jobId}/status`);

  if (!response.ok) {
    throw new Error(await getErrorMessage(response, `Status request failed with status ${response.status}`));
  }

  return response.json() as Promise<GenerationStatus>;
};

export function GenerateWorkspace() {
  const [bridePhoto, setBridePhoto] = React.useState<File | null>(null);
  const [groomPhoto, setGroomPhoto] = React.useState<File | null>(null);
  const [brideUpload, setBrideUpload] = React.useState<UploadResponse | null>(null);
  const [groomUpload, setGroomUpload] = React.useState<UploadResponse | null>(null);
  const [selectedStyle, setSelectedStyle] = React.useState("Royal");
  const [aspectRatio, setAspectRatio] = React.useState("3:4");
  const [quality, setQuality] = React.useState("High");
  const [customPrompt, setCustomPrompt] = React.useState("");
  const [generationStatus, setGenerationStatus] = React.useState<GenerationStatus | null>(null);
  const [activeJobId, setActiveJobId] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [isGenerating, setIsGenerating] = React.useState(false);
  const canGenerate = Boolean(bridePhoto && groomPhoto) && !isGenerating;

  React.useEffect(() => {
    const lastJobId = window.localStorage.getItem(lastGenerationJobKey);

    if (!lastJobId) {
      return;
    }

    let isMounted = true;

    const restoreLastGeneration = async () => {
      try {
        const status = await getGenerationStatus(lastJobId);

        if (!isMounted) {
          return;
        }

        setActiveJobId(lastJobId);
        setGenerationStatus(status);

        if (!["Completed", "Failed"].includes(status.status)) {
          setIsGenerating(true);
        }
      } catch {
        window.localStorage.removeItem(lastGenerationJobKey);
      }
    };

    void restoreLastGeneration();

    return () => {
      isMounted = false;
    };
  }, []);

  React.useEffect(() => {
    if (!activeJobId || !isGenerating) {
      return;
    }

    let isCancelled = false;

    const poll = async () => {
      try {
        const status = await getGenerationStatus(activeJobId);

        if (isCancelled) {
          return;
        }

        setGenerationStatus(status);

        if (status.status === "Completed") {
          setIsGenerating(false);
          return;
        }

        if (status.status === "Failed") {
          setError(status.errorMessage ?? "Generation failed");
          setIsGenerating(false);
          return;
        }

        window.setTimeout(poll, 2500);
      } catch (caughtError) {
        if (!isCancelled) {
          const message = caughtError instanceof Error ? caughtError.message : "Unable to check generation status";
          setError(message);
          setIsGenerating(false);
        }
      }
    };

    const timeoutId = window.setTimeout(poll, 500);

    return () => {
      isCancelled = true;
      window.clearTimeout(timeoutId);
    };
  }, [activeJobId, isGenerating]);

  const handleBridePhotoChange = (file: File | null) => {
    setBridePhoto(file);
    setBrideUpload(null);
  };

  const handleGroomPhotoChange = (file: File | null) => {
    setGroomPhoto(file);
    setGroomUpload(null);
  };

  const handleGenerate = async () => {
    console.log("Generate clicked", {
      bridePhoto,
      groomPhoto,
      brideUpload,
      groomUpload,
    });

    setError(null);
    setGenerationStatus(null);
    setActiveJobId(null);

    if (!bridePhoto || !groomPhoto) {
      setError("Please upload both bride and groom photos before generating.");
      return;
    }

    console.log("Validation passed");
    setIsGenerating(true);

    try {
      const [nextBrideUpload, nextGroomUpload] = await Promise.all([
        brideUpload ?? uploadImage(bridePhoto),
        groomUpload ?? uploadImage(groomPhoto),
      ]);

      setBrideUpload(nextBrideUpload);
      setGroomUpload(nextGroomUpload);

      const payload = {
        aspectRatio,
        brideUploadId: nextBrideUpload.uploadId,
        customPrompt: customPrompt.trim() || undefined,
        groomUploadId: nextGroomUpload.uploadId,
        numberOfImages: quality === "Ultra" ? 6 : 4,
        style: selectedStyle,
        theme: selectedStyle,
      };

      console.log("Preparing payload", payload);
      console.log("Calling API", `${apiBaseUrl}/generate`);

      const generation = await createGeneration(payload);
      console.log("API response", generation);

      window.localStorage.setItem(lastGenerationJobKey, generation.jobId);
      setActiveJobId(generation.jobId);
      setGenerationStatus({
        generatedImageUrls: [],
        id: generation.jobId,
        progress: 0,
        status: generation.status,
      });
    } catch (caughtError) {
      const message = caughtError instanceof Error ? caughtError.message : "Generation failed";
      setError(message);
      setIsGenerating(false);
      console.error("Generate failed", caughtError);
    }
  };

  return (
    <main className="relative isolate min-h-screen overflow-hidden px-6 py-8 sm:px-8">
      <AnimatedGradient />
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">
        <nav className="flex items-center justify-between" aria-label="Workspace navigation">
          <a className="font-serif text-2xl tracking-wide text-foreground" href="/">
            ViWaah
          </a>
          <Button asChild variant="outline" size="sm">
            <a href="/">
              <ArrowLeft aria-hidden="true" />
              Back to home
            </a>
          </Button>
        </nav>

        <motion.header
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className="grid gap-4 pt-8 lg:grid-cols-[1fr_auto] lg:items-end"
        >
          <div>
            <Badge>AI workspace</Badge>
            <h1 className="mt-5 max-w-4xl font-serif text-5xl leading-tight text-foreground sm:text-6xl">
              Generate a cinematic wedding portrait
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
              Upload both portraits, choose a wedding style, and prepare the generation inputs in one focused studio.
            </p>
          </div>
          <Button size="lg" type="button" disabled={!canGenerate} onClick={handleGenerate}>
            <Sparkles aria-hidden="true" />
            {isGenerating ? "Generating..." : "Generate Portrait"}
          </Button>
        </motion.header>

        <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08, duration: 0.55, ease: "easeOut" }}
            className="grid gap-5 lg:grid-cols-2"
          >
            <UploadDropzone
              id="bride-photo"
              title="Bride Photo"
              description="Upload a clear bride portrait with good lighting and an unobstructed face."
              value={bridePhoto}
              onChange={handleBridePhotoChange}
            />
            <UploadDropzone
              id="groom-photo"
              title="Groom Photo"
              description="Upload a clear groom portrait with good lighting and an unobstructed face."
              value={groomPhoto}
              onChange={handleGroomPhotoChange}
            />
          </motion.div>

          <motion.aside
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.16, duration: 0.55, ease: "easeOut" }}
            className="space-y-5"
          >
            <Card>
              <CardHeader>
                <CardTitle>Wedding Style</CardTitle>
                <CardDescription>
                  Select the visual direction for the final portrait.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-2">
                  {weddingStyles.map((style) => {
                    const isSelected = selectedStyle === style;

                    return (
                      <button
                        key={style}
                        type="button"
                        aria-pressed={isSelected}
                        onClick={() => setSelectedStyle(style)}
                        className={cn(
                          "group relative min-h-24 rounded-2xl border border-border/70 bg-white/[0.04] p-4 text-left transition-all hover:border-primary/50 hover:bg-primary/10 focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/35 focus-visible:outline-none",
                          isSelected && "border-primary/70 bg-primary/15 shadow-lg shadow-primary/10"
                        )}
                      >
                        <span className="absolute inset-x-3 top-3 h-10 rounded-xl bg-gradient-to-br from-primary/20 via-accent/10 to-transparent" />
                        <span className="relative flex items-start justify-between gap-3">
                          <span className="font-medium text-foreground">{style}</span>
                          {isSelected && (
                            <span className="flex size-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
                              <Check className="size-3.5" aria-hidden="true" />
                            </span>
                          )}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <details className="group rounded-3xl border border-border/70 bg-card text-card-foreground shadow-2xl shadow-black/20">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-6 focus-visible:ring-2 focus-visible:ring-primary/35 focus-visible:outline-none">
                <span className="flex items-center gap-3">
                  <span className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <SlidersHorizontal className="size-4" aria-hidden="true" />
                  </span>
                  <span>
                    <span className="block font-serif text-2xl text-foreground">
                      Advanced Options
                    </span>
                    <span className="mt-1 block text-sm text-muted-foreground">
                      Optional prompt, framing, and output quality.
                    </span>
                  </span>
                </span>
                <ChevronDown className="size-5 text-muted-foreground transition-transform group-open:rotate-180" aria-hidden="true" />
              </summary>
              <div className="grid gap-5 px-6 pb-6">
                <label className="grid gap-2 text-sm text-muted-foreground">
                  Additional prompt (optional)
                  <Textarea
                    placeholder="Add wardrobe, location, lighting, or cultural details."
                    value={customPrompt}
                    onChange={(event) => setCustomPrompt(event.target.value)}
                  />
                </label>
                <div className="grid gap-5 sm:grid-cols-2">
                  <fieldset className="grid gap-2">
                    <legend className="text-sm text-muted-foreground">Aspect ratio</legend>
                    <div className="flex flex-wrap gap-2">
                      {aspectRatios.map((ratio) => (
                        <button
                          key={ratio}
                          type="button"
                          aria-pressed={aspectRatio === ratio}
                          onClick={() => setAspectRatio(ratio)}
                          className={cn(
                            "rounded-full border border-border/70 bg-white/[0.04] px-4 py-2 text-sm text-foreground transition-colors hover:border-primary/50 hover:bg-primary/10 focus-visible:ring-2 focus-visible:ring-primary/35 focus-visible:outline-none",
                            aspectRatio === ratio && "border-primary/70 bg-primary/15 text-primary"
                          )}
                        >
                          {ratio}
                        </button>
                      ))}
                    </div>
                  </fieldset>
                  <fieldset className="grid gap-2">
                    <legend className="text-sm text-muted-foreground">Quality</legend>
                    <div className="flex flex-wrap gap-2">
                      {qualities.map((item) => (
                        <button
                          key={item}
                          type="button"
                          aria-pressed={quality === item}
                          onClick={() => setQuality(item)}
                          className={cn(
                            "rounded-full border border-border/70 bg-white/[0.04] px-4 py-2 text-sm text-foreground transition-colors hover:border-primary/50 hover:bg-primary/10 focus-visible:ring-2 focus-visible:ring-primary/35 focus-visible:outline-none",
                            quality === item && "border-primary/70 bg-primary/15 text-primary"
                          )}
                        >
                          {item}
                        </button>
                      ))}
                    </div>
                  </fieldset>
                </div>
              </div>
            </details>

            {(error || generationStatus) && (
              <Card>
                <CardHeader>
                  <CardTitle>Generation Status</CardTitle>
                  <CardDescription>
                    {error ?? `${generationStatus?.status ?? "Preparing"} - ${generationStatus?.progress ?? 0}%`}
                  </CardDescription>
                </CardHeader>
                {generationStatus && (
                  <CardContent className="grid gap-4">
                    <Progress value={generationStatus.progress} />
                    {generationStatus.generatedImageUrls.length > 0 && (
                      <div className="grid grid-cols-2 gap-3">
                        {generationStatus.generatedImageUrls.map((url) => (
                          <img
                            key={url}
                            src={url}
                            alt="Generated wedding portrait"
                            className="aspect-[4/5] rounded-2xl object-cover"
                          />
                        ))}
                      </div>
                    )}
                  </CardContent>
                )}
              </Card>
            )}
          </motion.aside>
        </section>
      </div>
    </main>
  );
}
