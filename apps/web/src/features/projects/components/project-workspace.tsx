"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Aperture,
  Brush,
  Check,
  Circle,
  Contrast,
  Crop,
  Diamond,
  Eraser,
  Eye,
  Film,
  Gem,
  ImageIcon,
  LampDesk,
  Maximize2,
  Pencil,
  Plus,
  ScanFace,
  Sparkles,
  Star,
  Sun,
  Trash2,
  Upload,
  Wand2,
  X,
  Zap,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  personalThemes,
  professionalThemes,
  ThemeCarousel,
  ThemeSelectionScreen,
  buildTemplatePrompt,
  type ParticipantDetails,
  type ThemeCard,
} from "@/features/style-selection/components/style-selection-page";
import { getProject, type Project } from "@/features/projects/api";
import { TemplateGallery, getTemplateById } from "@/features/templates/components/template-selection";
import type { PhotoTemplate } from "@/features/templates/template-library";
import { cn } from "@/lib/utils";

const workflowSteps = ["Style", "Subjects", "Theme", "Template", "Review", "Gallery"] as const;
const albumCreatorSteps = ["AlbumImage", "AlbumTemplate", "AlbumEnhance", "AlbumReview"] as const;
const creationNavSteps = [
  { label: "Style", step: "Style" },
  { label: "Subject", step: "Subjects" },
  { label: "Theme", step: "Theme" },
  { label: "Template", step: "Template" },
  { label: "Review", step: "Review" },
  { label: "Generate", step: "Gallery" },
] as const;
const albumCreatorNavSteps = [
  { label: "Image", step: "AlbumImage" },
  { label: "Template", step: "AlbumTemplate" },
  { label: "Enhance", step: "AlbumEnhance" },
  { label: "Review", step: "AlbumReview" },
] as const;

type WorkflowStep = (typeof workflowSteps)[number];
type AlbumCreatorStep = (typeof albumCreatorSteps)[number];
type WorkspaceStep = WorkflowStep | AlbumCreatorStep | "Dashboard";

const stepParamByStep: Partial<Record<WorkspaceStep, string>> = {
  Gallery: "gallery",
  Review: "review",
  Style: "style",
  Subjects: "subjects",
  Template: "template",
  Theme: "theme",
  AlbumEnhance: "album-enhance",
  AlbumImage: "album-image",
  AlbumReview: "album-review",
  AlbumTemplate: "album-template",
};

const stepByStepParam: Record<string, Exclude<WorkspaceStep, "Dashboard">> = {
  "album-enhance": "AlbumEnhance",
  "album-image": "AlbumImage",
  "album-review": "AlbumReview",
  "album-template": "AlbumTemplate",
  gallery: "Gallery",
  relationships: "Subjects",
  review: "Review",
  style: "Style",
  subjects: "Subjects",
  template: "Template",
  theme: "Theme",
};

type Subject = {
  age: string;
  gender: string;
  id: string;
  image?: string;
  isPrimary: boolean;
  name: string;
};

type Relationship = {
  fromSubjectId: string;
  id: string;
  role: string;
  toSubjectId: string;
};

type GeneratedImage = {
  id: string;
  image: string;
  title: string;
  meta: string;
};

type AlbumSourceImage = {
  id: string;
  image: string;
  meta: string;
  title: string;
  source: "generated" | "upload";
};

type Enhancement = {
  description: string;
  icon: LucideIcon;
  id: string;
  prompt: string;
  title: string;
};

const generatedImages: GeneratedImage[] = [
  {
    id: "g-1",
    image: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=90",
    meta: "Royal Palace / 4:5",
    title: "Hero Portrait",
  },
  {
    id: "g-2",
    image: "https://images.unsplash.com/photo-1533435137002-455932c8538f?auto=format&fit=crop&w=1200&q=90",
    meta: "Editorial / 3:4",
    title: "Ceremony Still",
  },
  {
    id: "g-3",
    image: "https://images.unsplash.com/photo-1515169273894-7e876dcf13da?auto=format&fit=crop&w=1200&q=90",
    meta: "Gallery / 1:1",
    title: "Quiet Detail",
  },
  {
    id: "g-4",
    image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=90",
    meta: "Professional / 16:9",
    title: "Wide Story",
  },
];

const previousImageSlots = Array.from({ length: 32 }, (_, index) => ({
  id: `previous-slot-${index + 1}`,
  label: `Image ${index + 1}`,
}));

const enhancements: Enhancement[] = [
  { description: "Shape soft, dimensional light with controlled highlights.", icon: LampDesk, id: "lighting", prompt: "refine lighting with soft professional direction and natural falloff", title: "Lighting" },
  { description: "Recover highlights and shadows for a balanced file.", icon: Sun, id: "exposure", prompt: "balance exposure, protect highlights, and open important shadow detail", title: "Exposure" },
  { description: "Clean casts and bring the palette into harmony.", icon: Brush, id: "color", prompt: "perform natural color correction with cohesive album-grade color harmony", title: "Color Correction" },
  { description: "Improve local contrast without making the image harsh.", icon: Aperture, id: "clarity", prompt: "add refined clarity and micro-contrast while keeping faces natural", title: "Clarity" },
  { description: "Crisp facial detail, jewellery, and fabric edges.", icon: Zap, id: "sharpness", prompt: "increase perceived sharpness with clean detail and no crunchy artifacts", title: "Sharpness" },
  { description: "Preserve bright garments, skies, lamps, and deep shadows.", icon: Contrast, id: "hdr", prompt: "create tasteful high dynamic range with realistic contrast and no surreal tone mapping", title: "HDR" },
  { description: "Keep identity intact while polishing facial presence.", icon: ScanFace, id: "face", prompt: "enhance faces while preserving identity, age, expression, and natural likeness", title: "Face Enhancement" },
  { description: "Even tone and texture while retaining real skin character.", icon: Sparkles, id: "skin", prompt: "retouch skin subtly with natural texture, no plastic smoothing", title: "Skin Retouch" },
  { description: "Make eyes clean, lively, and naturally sharp.", icon: Eye, id: "eyes", prompt: "enhance eyes with natural catchlights, crisp focus, and realistic color", title: "Eye Enhancement" },
  { description: "Bring ornaments, stones, and metallic detail forward.", icon: Gem, id: "jewellery", prompt: "enhance jewellery sparkle, metal definition, gemstones, and fine ornament details", title: "Jewellery Enhancement" },
  { description: "Reveal embroidery, silk, lace, and textile richness.", icon: Diamond, id: "fabric", prompt: "recover fabric detail, embroidery, weave, drape, and premium wardrobe texture", title: "Fabric Detail" },
  { description: "Quiet the scene behind the subject without changing intent.", icon: Eraser, id: "background", prompt: "clean up background clutter while preserving the original scene and context", title: "Background Cleanup" },
  { description: "Remove visual interruptions that pull attention away.", icon: Wand2, id: "distractions", prompt: "remove distracting objects and visual interruptions cleanly and realistically", title: "Remove Distractions" },
  { description: "Smooth grain and compression while preserving detail.", icon: Circle, id: "noise", prompt: "reduce noise and compression artifacts while retaining true detail", title: "Noise Reduction" },
  { description: "A polished magazine finish with tasteful contrast.", icon: Film, id: "editorial", prompt: "apply a luxury editorial look with refined contrast, depth, and premium tonality", title: "Luxury Editorial Look" },
  { description: "Warm, glowing light suited for romantic albums.", icon: Sun, id: "golden-hour", prompt: "add believable golden hour warmth, glow, and soft rim light where appropriate", title: "Golden Hour Lighting" },
  { description: "Cinematic tones with clean, elegant color separation.", icon: Crop, id: "cinematic", prompt: "apply cinematic color grading with natural skin tones and refined color separation", title: "Cinematic Color Grading" },
  { description: "Protect true complexion and avoid over-processing.", icon: ScanFace, id: "skin-tone", prompt: "preserve natural skin tone, complexion, and realistic facial texture", title: "Natural Skin Tone" },
  { description: "Studio-grade wedding polish for premium delivery.", icon: Star, id: "wedding-finish", prompt: "create a high-end wedding finish with luxurious yet realistic album polish", title: "High-End Wedding Finish" },
  { description: "Optimize detail and tonality for large physical output.", icon: ImageIcon, id: "print", prompt: "enhance for print quality with high resolution feel, clean edges, and controlled sharpening", title: "Print Quality Enhancement" },
];

const maleRelationshipRoles = ["Father", "Son", "Brother", "Grandfather", "Grandson", "Uncle", "Nephew", "Husband"];
const femaleRelationshipRoles = ["Mother", "Daughter", "Sister", "Grandmother", "Granddaughter", "Aunt", "Niece", "Wife"];
const neutralRelationshipRoles = ["Friend", "Relative", "Guardian", "Cousin"];
const genderByRelationshipRole: Record<string, Subject["gender"]> = {
  Brother: "Male",
  Daughter: "Female",
  Father: "Male",
  Husband: "Male",
  Mother: "Female",
  Sister: "Female",
  Son: "Male",
  Wife: "Female",
};

const createBlankSubject = (index: number): Subject => ({
  age: "",
  gender: "",
  id: crypto.randomUUID(),
  isPrimary: index === 0,
  name: "",
});

const getDefaultSubjectsForStyle = () => [createBlankSubject(0)];

const getInverseRelationshipRole = (role: string, relatedPersonGender: Subject["gender"]) => {
  const genderedRole = (maleRole: string, femaleRole: string) =>
    relatedPersonGender === "Male" ? maleRole : relatedPersonGender === "Female" ? femaleRole : "Relative";

  const inverseRoles: Record<string, string> = {
    Aunt: genderedRole("Nephew", "Niece"),
    Brother: genderedRole("Brother", "Sister"),
    Cousin: "Cousin",
    Daughter: genderedRole("Father", "Mother"),
    Father: genderedRole("Son", "Daughter"),
    Friend: "Friend",
    Granddaughter: genderedRole("Grandfather", "Grandmother"),
    Grandfather: genderedRole("Grandson", "Granddaughter"),
    Grandmother: genderedRole("Grandson", "Granddaughter"),
    Grandson: genderedRole("Grandfather", "Grandmother"),
    Guardian: "Relative",
    Husband: "Wife",
    Mother: genderedRole("Son", "Daughter"),
    Nephew: genderedRole("Uncle", "Aunt"),
    Niece: genderedRole("Uncle", "Aunt"),
    Relative: "Relative",
    Sister: genderedRole("Brother", "Sister"),
    Son: genderedRole("Father", "Mother"),
    Uncle: genderedRole("Nephew", "Niece"),
    Wife: "Husband",
  };

  return inverseRoles[role] ?? role;
};

const mockProject = (id: string): Project => ({
  createdAt: new Date("2026-07-11").toISOString(),
  currentStep: "EVENT",
  eventCategory: "Wedding",
  id,
  name: "Aarav and Meera",
  status: "IN_PROGRESS",
  updatedAt: new Date("2026-07-14").toISOString(),
  userId: "mock-user",
});

export function ProjectWorkspace({ projectId }: { projectId: string }) {
  const [project, setProject] = React.useState<Project | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [activeStep, setActiveStep] = React.useState<WorkspaceStep>("Dashboard");
  const [selectedStyle, setSelectedStyle] = React.useState<ThemeCard | null>(null);
  const [selectedThemeName, setSelectedThemeName] = React.useState<string>();
  const [selectedTemplateId, setSelectedTemplateId] = React.useState<string>();
  const [subjects, setSubjects] = React.useState<Subject[]>([]);
  const [relationships, setRelationships] = React.useState<Relationship[]>([]);
  const [previewImage, setPreviewImage] = React.useState<GeneratedImage | null>(null);
  const [albumImage, setAlbumImage] = React.useState<AlbumSourceImage | null>(null);
  const [albumTemplateId, setAlbumTemplateId] = React.useState<string>();
  const [selectedEnhancements, setSelectedEnhancements] = React.useState<string[]>([]);
  const [albumInstructions, setAlbumInstructions] = React.useState("");

  React.useEffect(() => {
    let isMounted = true;

    const loadProject = async () => {
      try {
        const result = await getProject(projectId);
        if (isMounted) {
          setProject(result.project);
        }
      } catch (error) {
        if (projectId.startsWith("demo")) {
          setProject(mockProject(projectId));
        } else {
          toast.error(error instanceof Error ? error.message : "Unable to load project");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void loadProject();

    return () => {
      isMounted = false;
    };
  }, [projectId]);

  React.useEffect(() => {
    const syncStepFromUrl = () => {
      const stepParam = new URLSearchParams(window.location.search).get("step");
      const nextStep = stepParam ? stepByStepParam[stepParam] : undefined;
      setActiveStep(nextStep ?? "Dashboard");
    };

    syncStepFromUrl();
    window.addEventListener("popstate", syncStepFromUrl);

    return () => window.removeEventListener("popstate", syncStepFromUrl);
  }, []);

  const activeIndex = workflowSteps.includes(activeStep as WorkflowStep)
    ? workflowSteps.indexOf(activeStep as WorkflowStep)
    : -1;
  const selectedTemplate = getTemplateById(selectedTemplateId);
  const albumActiveIndex = albumCreatorSteps.indexOf(activeStep as AlbumCreatorStep);
  const selectedAlbumTemplate = getTemplateById(albumTemplateId);
  const isAlbumCreatorStep = (step: WorkspaceStep): step is AlbumCreatorStep =>
    albumCreatorSteps.includes(step as AlbumCreatorStep);
  const canNavigateStep = (step: WorkflowStep) => {
    return step !== "Gallery" || activeStep === "Gallery";
  };
  const canNavigateAlbumStep = (step: AlbumCreatorStep) => {
    if (step === "AlbumImage") {
      return true;
    }

    if (!albumImage) {
      return false;
    }

    if (step === "AlbumEnhance" || step === "AlbumReview") {
      return Boolean(selectedAlbumTemplate);
    }

    return true;
  };
  const pushWorkspaceStep = (step: WorkspaceStep) => {
    const nextUrl = new URL(window.location.href);
    const stepParam = stepParamByStep[step];

    if (stepParam) {
      nextUrl.searchParams.set("step", stepParam);
    } else {
      nextUrl.searchParams.delete("step");
    }

    window.history.pushState({ step }, "", nextUrl);
    setActiveStep(step);
  };
  const updateSubject = (id: string, patch: Partial<Subject>) => {
    setSubjects((current) =>
      current.map((subject) => {
        if (subject.id !== id) {
          return patch.isPrimary ? { ...subject, isPrimary: false } : subject;
        }

        return { ...subject, ...patch };
      }),
    );
  };

  const addSubject = () => {
    setSubjects((current) => [
      ...current,
      {
        age: "",
        gender: "",
        id: crypto.randomUUID(),
        isPrimary: current.length === 0,
        name: "",
      },
    ]);
  };

  const deleteSubject = (id: string) => {
    setSubjects((current) => {
      const nextSubjects = current.filter((subject) => subject.id !== id);

      if (nextSubjects.length === 0 || nextSubjects.some((subject) => subject.isPrimary)) {
        return nextSubjects;
      }

      return nextSubjects.map((subject, index) => ({ ...subject, isPrimary: index === 0 }));
    });
    setRelationships((current) =>
      current.filter((relationship) => relationship.fromSubjectId !== id && relationship.toSubjectId !== id),
    );
  };

  const addRelationship = (
    currentSubjectId: string,
    relatedPerson: Pick<Subject, "age" | "gender" | "image" | "name">,
    role: string,
  ) => {
    const relatedSubject: Subject = {
      ...relatedPerson,
      id: crypto.randomUUID(),
      isPrimary: false,
    };

    setSubjects((current) => [...current, relatedSubject]);
    setRelationships((current) => [
      ...current,
      {
        fromSubjectId: currentSubjectId,
        id: crypto.randomUUID(),
        role,
        toSubjectId: relatedSubject.id,
      },
    ]);
  };

  const editRelationship = (
    relationshipId: string,
    currentSubjectId: string,
    relatedSubjectId: string,
    relatedPerson: Pick<Subject, "age" | "gender" | "image" | "name">,
    role: string,
  ) => {
    updateSubject(relatedSubjectId, relatedPerson);
    setRelationships((current) =>
      current.map((relationship) =>
        relationship.id === relationshipId
          ? { ...relationship, fromSubjectId: currentSubjectId, role, toSubjectId: relatedSubjectId }
          : relationship,
      ),
    );
  };

  const deleteRelationship = (relationshipId: string) => {
    setRelationships((current) => current.filter((relationship) => relationship.id !== relationshipId));
  };

  const startWorkflow = () => {
    setSelectedStyle(null);
    setSelectedThemeName(undefined);
    setSelectedTemplateId(undefined);
    pushWorkspaceStep("Style");
  };

  const startAlbumCreator = () => {
    setAlbumImage(null);
    setAlbumTemplateId(undefined);
    setSelectedEnhancements([]);
    setAlbumInstructions("");
    pushWorkspaceStep("AlbumImage");
  };

  const goBack = () => {
    if (activeStep === "Dashboard") {
      return;
    }

    if (isAlbumCreatorStep(activeStep)) {
      pushWorkspaceStep(albumCreatorSteps[albumActiveIndex - 1] ?? "Dashboard");
      return;
    }

    pushWorkspaceStep(workflowSteps[activeIndex - 1] ?? "Dashboard");
  };

  const goForward = () => {
    if (activeStep === "AlbumImage" && !albumImage) {
      return;
    }

    if (activeStep === "AlbumTemplate" && !selectedAlbumTemplate) {
      return;
    }

    if (activeStep === "AlbumReview") {
      toast.success("Album-quality enhancement started");
      pushWorkspaceStep("Gallery");
      return;
    }

    if (isAlbumCreatorStep(activeStep)) {
      pushWorkspaceStep(albumCreatorSteps[albumActiveIndex + 1] ?? "AlbumReview");
      return;
    }

    if (activeStep === "Style" && !selectedStyle) {
      return;
    }

    if (activeStep === "Theme" && !selectedThemeName) {
      return;
    }

    if (activeStep === "Template" && !selectedTemplate) {
      return;
    }

    if (activeStep === "Review") {
      toast.success("Generation complete");
      pushWorkspaceStep("Gallery");
      return;
    }

    pushWorkspaceStep(workflowSteps[activeIndex + 1] ?? "Gallery");
  };

  const navigateCreationStep = (step: (typeof creationNavSteps)[number]["step"]) => {
    if (!canNavigateStep(step)) {
      return;
    }

    pushWorkspaceStep(step);
  };
  const navigateAlbumCreatorStep = (step: (typeof albumCreatorNavSteps)[number]["step"]) => {
    if (!canNavigateAlbumStep(step)) {
      return;
    }

    pushWorkspaceStep(step);
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!project) {
    return (
      <main className="grid min-h-screen place-items-center px-6">
        <section className="max-w-lg text-center">
          <h1 className="font-sans text-4xl">Project unavailable</h1>
          <Button asChild className="mt-6" variant="outline">
            <Link href="/dashboard">Back to dashboard</Link>
          </Button>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen overflow-hidden bg-background text-foreground">
      <div className="relative mx-auto flex min-h-screen w-full max-w-7xl flex-col px-5 py-5 sm:px-8">
        <div className="grid gap-3 sm:grid-cols-[auto_1fr_auto] sm:items-center">
          {activeStep === "Dashboard" ? (
            <Button asChild type="button" variant="outline">
              <Link href="/dashboard">
                <ArrowLeft aria-hidden="true" />
                Back
              </Link>
            </Button>
          ) : (
            <Button onClick={goBack} type="button" variant="outline">
              <ArrowLeft aria-hidden="true" />
              Back
            </Button>
          )}
          {activeStep !== "Dashboard" ? (
            isAlbumCreatorStep(activeStep) ? (
              <AlbumCreatorNav
                activeStep={activeStep}
                canNavigateStep={canNavigateAlbumStep}
                onNavigate={navigateAlbumCreatorStep}
              />
            ) : (
              <CreationNav
                activeStep={activeStep}
                canNavigateStep={canNavigateStep}
                onNavigate={navigateCreationStep}
              />
            )
          ) : (
            <span />
          )}
          <ThemeToggle />
        </div>

        <AnimatePresence mode="wait">
          {activeStep === "Dashboard" ? (
            <ProjectDashboardView
              key="dashboard"
              onCreateNewImage={startWorkflow}
              onOpenAlbumCreator={startAlbumCreator}
              project={project}
            />
          ) : activeStep === "Style" ? (
            <StyleStep
              key="style"
              onSelectStyle={(style) => {
                setSelectedStyle(style);
                setSelectedThemeName(undefined);
                setSubjects(getDefaultSubjectsForStyle());
                setRelationships([]);
                pushWorkspaceStep("Subjects");
              }}
            />
          ) : activeStep === "Subjects" ? (
            <SubjectsStep
              key="subjects"
              onAddRelationship={addRelationship}
              onAddSubject={addSubject}
              onChange={updateSubject}
              onDeleteRelationship={deleteRelationship}
              onDeleteSubject={deleteSubject}
              onEditRelationship={editRelationship}
              relationships={relationships}
              subjects={subjects}
            />
          ) : activeStep === "Theme" ? (
            <ThemeStep
              key="theme"
              onSelectTheme={setSelectedThemeName}
              selectedStyle={selectedStyle}
              selectedThemeName={selectedThemeName}
            />
          ) : activeStep === "Template" ? (
            <TemplateStep
              key="template"
              onSelectTemplate={setSelectedTemplateId}
              selectedTemplateId={selectedTemplateId}
            />
          ) : activeStep === "Review" ? (
            <ReviewStep
              key="review"
              relationships={relationships}
              selectedStyle={selectedStyle}
              selectedTemplate={selectedTemplate}
              selectedThemeName={selectedThemeName}
              subjects={subjects}
            />
          ) : activeStep === "AlbumImage" ? (
            <AlbumImageStep
              key="album-image"
              onSelectImage={setAlbumImage}
              selectedImage={albumImage}
            />
          ) : activeStep === "AlbumTemplate" ? (
            <AlbumTemplateStep
              key="album-template"
              onSelectTemplate={setAlbumTemplateId}
              selectedTemplateId={albumTemplateId}
            />
          ) : activeStep === "AlbumEnhance" ? (
            <AlbumEnhanceStep
              key="album-enhance"
              additionalInstructions={albumInstructions}
              onChangeAdditionalInstructions={setAlbumInstructions}
              onToggleEnhancement={(enhancementId) =>
                setSelectedEnhancements((current) =>
                  current.includes(enhancementId)
                    ? current.filter((item) => item !== enhancementId)
                    : [...current, enhancementId],
                )
              }
              selectedEnhancements={selectedEnhancements}
            />
          ) : activeStep === "AlbumReview" ? (
            <AlbumReviewStep
              key="album-review"
              additionalInstructions={albumInstructions}
              project={project}
              selectedEnhancementIds={selectedEnhancements}
              selectedImage={albumImage}
              selectedTemplate={selectedAlbumTemplate}
            />
          ) : (
            <GalleryStep key="gallery" onPreview={setPreviewImage} />
          )}
        </AnimatePresence>

        {activeStep !== "Dashboard" && activeStep !== "Gallery" ? (
          <footer className="mt-auto flex items-center justify-end gap-3 border-t border-border py-5">
            {activeStep !== "Style" ? (
              <Button
                disabled={
                  (activeStep === "Theme" && !selectedThemeName) ||
                  (activeStep === "Template" && !selectedTemplate) ||
                  (activeStep === "AlbumImage" && !albumImage) ||
                  (activeStep === "AlbumTemplate" && !selectedAlbumTemplate)
                }
                onClick={goForward}
                type="button"
              >
                {activeStep === "Review" ? "Generate Images" : activeStep === "AlbumReview" ? "Enhance Image" : "Continue"}
                <ArrowRight aria-hidden="true" />
              </Button>
            ) : null}
          </footer>
        ) : null}
      </div>

      {activeStep === "Dashboard" && (
        <button
          onClick={startWorkflow}
          type="button"
          className="fixed bottom-6 right-6 z-40 grid size-14 place-items-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/30 transition hover:scale-105 hover:shadow-xl hover:shadow-primary/40 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 sm:hidden"
          aria-label="Create New Image"
        >
          <Plus className="size-7" />
        </button>
      )}

      <AnimatePresence>
        {previewImage ? <ImagePreview image={previewImage} onClose={() => setPreviewImage(null)} /> : null}
      </AnimatePresence>
    </main>
  );
}

function LoadingScreen() {
  return (
    <main className="grid min-h-screen place-items-center px-6">
      <div className="h-10 w-10 animate-spin rounded-full border border-border border-t-primary" />
    </main>
  );
}

function CreationNav({
  activeStep,
  canNavigateStep,
  onNavigate,
}: {
  activeStep: WorkflowStep | "Dashboard";
  canNavigateStep: (step: WorkflowStep) => boolean;
  onNavigate: (step: (typeof creationNavSteps)[number]["step"]) => void;
}) {
  return (
    <nav
      aria-label="Create image steps"
      className="flex w-full items-center gap-1 overflow-x-auto rounded-full border border-border bg-card/75 p-1 shadow-lg shadow-black/5 sm:mx-auto sm:w-fit"
    >
      {creationNavSteps.map((item) => {
        const isActive = activeStep === item.step;
        const isDisabled = !canNavigateStep(item.step);

        return (
          <button
            aria-current={isActive ? "step" : undefined}
            className={cn(
              "h-10 rounded-full px-4 text-sm font-medium text-muted-foreground transition hover:bg-secondary hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/35 disabled:pointer-events-none disabled:opacity-40",
              isActive && "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
            )}
            disabled={isDisabled}
            key={item.step}
            onClick={() => onNavigate(item.step)}
            type="button"
          >
            {item.label}
          </button>
        );
      })}
    </nav>
  );
}

function AlbumCreatorNav({
  activeStep,
  canNavigateStep,
  onNavigate,
}: {
  activeStep: AlbumCreatorStep;
  canNavigateStep: (step: AlbumCreatorStep) => boolean;
  onNavigate: (step: (typeof albumCreatorNavSteps)[number]["step"]) => void;
}) {
  return (
    <nav
      aria-label="Album Creator steps"
      className="flex w-full items-center gap-1 overflow-x-auto rounded-full border border-border bg-card/75 p-1 shadow-lg shadow-black/5 sm:mx-auto sm:w-fit"
    >
      {albumCreatorNavSteps.map((item) => {
        const isActive = activeStep === item.step;
        const isDisabled = !canNavigateStep(item.step);

        return (
          <button
            aria-current={isActive ? "step" : undefined}
            className={cn(
              "h-10 rounded-full px-4 text-sm font-medium text-muted-foreground transition hover:bg-secondary hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/35 disabled:pointer-events-none disabled:opacity-40",
              isActive && "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
            )}
            disabled={isDisabled}
            key={item.step}
            onClick={() => onNavigate(item.step)}
            type="button"
          >
            {item.label}
          </button>
        );
      })}
    </nav>
  );
}

function ProjectDashboardView({
  onCreateNewImage,
  onOpenAlbumCreator,
  project,
}: {
  onCreateNewImage: () => void;
  onOpenAlbumCreator: () => void;
  project: Project;
}) {
  return (
    <motion.section
      animate={{ opacity: 1, y: 0 }}
      className="grid gap-5 py-4"
      exit={{ opacity: 0, y: -12 }}
      initial={{ opacity: 0, y: 12 }}
      transition={{ duration: 0.24 }}
    >
      <div className="grid gap-1">
        <p className="text-sm font-medium text-primary">Project</p>
        <h2 className="font-sans text-4xl leading-none sm:text-5xl">{project.name}</h2>
        <p className="text-base text-muted-foreground">{project.eventCategory}</p>
      </div>

      <section className="grid gap-4 md:grid-cols-2">
        <ProjectActionCard
          description="Choose a style, subjects, template, and generate a new image."
          icon={Plus}
          onClick={onCreateNewImage}
          title="Create New Image"
        />
        <ProjectActionCard
          description="Enhance an existing photograph into polished album-quality output."
          icon={Wand2}
          onClick={onOpenAlbumCreator}
          title="Album Creator"
        />
      </section>

      <section className="grid min-h-0 gap-3">
        <div className="flex items-center justify-between gap-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Previous images</p>
          <p className="text-xs text-muted-foreground">{previousImageSlots.length} empty slots</p>
        </div>
        <div className="max-h-[58vh] overflow-y-auto rounded-xl border border-border bg-card/40 p-3 shadow-inner shadow-black/5">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {previousImageSlots.map((slot) => (
              <button
                aria-label={slot.label}
                className="group grid aspect-[4/3] overflow-hidden rounded-lg border border-dashed border-border bg-secondary/70 transition hover:border-primary/45 hover:bg-primary/8 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/35"
                key={slot.id}
                type="button"
              >
                <span className="grid h-full place-items-center bg-gradient-to-br from-muted/25 to-background/20">
                  <span className="grid justify-items-center gap-2 text-muted-foreground/55 transition group-hover:text-primary">
                    <ImageIcon className="size-5" aria-hidden="true" />
                    <span className="text-xs font-medium">{slot.label}</span>
                  </span>
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>
    </motion.section>
  );
}

function ProjectActionCard({
  description,
  icon: Icon,
  onClick,
  title,
}: {
  description: string;
  icon: LucideIcon;
  onClick: () => void;
  title: string;
}) {
  return (
    <motion.button
      className="group relative flex min-h-40 items-center gap-5 overflow-hidden rounded-lg border border-border bg-card p-6 text-left shadow-xl shadow-black/5 outline-none transition hover:-translate-y-1 hover:border-primary/50 hover:shadow-primary/10 focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/40"
      onClick={onClick}
      type="button"
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
    >
      <span className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(45,212,191,0.16),transparent_30%),linear-gradient(135deg,rgba(255,255,255,0.04),transparent_48%)] opacity-80 transition group-hover:opacity-100" />
      <span className="relative grid size-14 shrink-0 place-items-center rounded-lg bg-primary text-primary-foreground shadow-lg shadow-primary/25">
        <Icon className="size-7" aria-hidden="true" />
      </span>
      <span className="relative grid gap-2">
        <span className="block font-sans text-3xl leading-none sm:text-4xl">{title}</span>
        <span className="block max-w-md text-sm leading-6 text-muted-foreground">{description}</span>
      </span>
    </motion.button>
  );
}

function AlbumImageStep({
  onSelectImage,
  selectedImage,
}: {
  onSelectImage: (image: AlbumSourceImage) => void;
  selectedImage: AlbumSourceImage | null;
}) {
  const uploadInputId = React.useId();

  const handleUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        onSelectImage({
          id: crypto.randomUUID(),
          image: reader.result,
          meta: file.type || "Uploaded photograph",
          source: "upload",
          title: file.name.replace(/\.[^.]+$/, "") || "Uploaded photograph",
        });
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <WorkflowScreen title="Select an image">
      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <section className="overflow-hidden rounded-lg border border-border bg-card shadow-2xl shadow-black/10">
          <div className="grid min-h-[440px] place-items-center bg-[#090b10]">
            {selectedImage ? (
              <motion.img
                alt={selectedImage.title}
                className="max-h-[68vh] w-full object-contain"
                key={selectedImage.id}
                src={selectedImage.image}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.24 }}
              />
            ) : (
              <div className="grid justify-items-center gap-4 p-10 text-center text-muted-foreground">
                <span className="grid size-16 place-items-center rounded-lg border border-white/10 bg-white/5 text-primary">
                  <ImageIcon className="size-8" aria-hidden="true" />
                </span>
                <p className="max-w-sm text-sm leading-6">Choose a generated image or upload a photograph to begin enhancement.</p>
              </div>
            )}
          </div>
          {selectedImage ? (
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border px-5 py-4">
              <div>
                <h2 className="font-sans text-2xl">{selectedImage.title}</h2>
                <p className="text-sm text-muted-foreground">{selectedImage.meta}</p>
              </div>
              <span className="rounded-full border border-primary/25 px-3 py-1 text-xs font-medium text-primary">
                {selectedImage.source === "upload" ? "Uploaded photograph" : "Project image"}
              </span>
            </div>
          ) : null}
        </section>

        <aside className="grid gap-5 content-start">
          <section className="rounded-lg border border-border bg-card p-5 shadow-xl shadow-black/5">
            <h2 className="font-sans text-3xl">Project images</h2>
            <div className="mt-4 grid grid-cols-2 gap-3">
              {generatedImages.map((image) => {
                const isSelected = selectedImage?.id === image.id;

                return (
                  <button
                    className={cn(
                      "group relative overflow-hidden rounded-lg border bg-background text-left outline-none transition hover:-translate-y-0.5 hover:border-primary/50 focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/35",
                      isSelected ? "border-primary ring-2 ring-primary/25" : "border-border",
                    )}
                    key={image.id}
                    onClick={() => onSelectImage({ ...image, source: "generated" })}
                    type="button"
                  >
                    <img alt={image.title} className="aspect-[4/5] w-full object-cover transition duration-500 group-hover:scale-105" src={image.image} />
                    {isSelected ? (
                      <span className="absolute right-2 top-2 grid size-7 place-items-center rounded-full bg-primary text-primary-foreground">
                        <Check className="size-4" aria-hidden="true" />
                      </span>
                    ) : null}
                    <span className="block p-3 text-sm font-medium">{image.title}</span>
                  </button>
                );
              })}
            </div>
          </section>

          <section className="rounded-lg border border-border bg-card p-5 shadow-xl shadow-black/5">
            <h2 className="font-sans text-3xl">Upload photograph</h2>
            <label
              className="mt-4 flex min-h-36 cursor-pointer flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-primary/40 bg-primary/8 p-6 text-center transition hover:bg-primary/12"
              htmlFor={uploadInputId}
            >
              <Upload className="size-7 text-primary" aria-hidden="true" />
              <span className="text-sm font-medium">Choose from your device</span>
              <span className="text-xs text-muted-foreground">JPG, PNG, or WebP photograph</span>
            </label>
            <input accept="image/*" className="sr-only" id={uploadInputId} onChange={handleUpload} type="file" />
          </section>
        </aside>
      </div>
    </WorkflowScreen>
  );
}

function AlbumTemplateStep({
  onSelectTemplate,
  selectedTemplateId,
}: {
  onSelectTemplate: (templateId: string) => void;
  selectedTemplateId?: string | null;
}) {
  return (
    <WorkflowScreen title="Choose an output template">
      <TemplateGallery
        onSelectTemplate={(template) => onSelectTemplate(template.id)}
        selectedTemplateId={selectedTemplateId}
      />
    </WorkflowScreen>
  );
}

function AlbumEnhanceStep({
  additionalInstructions,
  onChangeAdditionalInstructions,
  onToggleEnhancement,
  selectedEnhancements,
}: {
  additionalInstructions: string;
  onChangeAdditionalInstructions: (value: string) => void;
  onToggleEnhancement: (enhancementId: string) => void;
  selectedEnhancements: string[];
}) {
  return (
    <WorkflowScreen title="What would you like to improve?">
      <div className="grid gap-7">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {enhancements.map((enhancement) => {
            const isSelected = selectedEnhancements.includes(enhancement.id);
            const Icon = enhancement.icon;

            return (
              <motion.button
                aria-pressed={isSelected}
                className={cn(
                  "group relative min-h-36 overflow-hidden rounded-lg border bg-card p-5 text-left shadow-xl shadow-black/5 outline-none transition hover:-translate-y-1 hover:border-primary/45 focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/35",
                  isSelected ? "border-primary/80 bg-primary/10 shadow-primary/10" : "border-border",
                )}
                key={enhancement.id}
                onClick={() => onToggleEnhancement(enhancement.id)}
                type="button"
                whileTap={{ scale: 0.98 }}
              >
                <motion.span
                  className="absolute inset-0 bg-[radial-gradient(circle_at_20%_12%,rgba(45,212,191,0.18),transparent_34%)]"
                  animate={{ opacity: isSelected ? 1 : 0 }}
                  transition={{ duration: 0.2 }}
                />
                <span className="relative flex items-start justify-between gap-4">
                  <span className="grid size-11 place-items-center rounded-lg bg-secondary text-primary transition group-hover:bg-primary group-hover:text-primary-foreground">
                    <Icon className="size-5" aria-hidden="true" />
                  </span>
                  <motion.span
                    className="grid size-7 place-items-center rounded-full bg-primary text-primary-foreground"
                    animate={{ opacity: isSelected ? 1 : 0, scale: isSelected ? 1 : 0.7 }}
                    transition={{ type: "spring", stiffness: 420, damping: 26 }}
                  >
                    <Check className="size-4" aria-hidden="true" />
                  </motion.span>
                </span>
                <span className="relative mt-5 block font-sans text-2xl leading-none">{enhancement.title}</span>
                <span className="relative mt-2 block text-sm leading-6 text-muted-foreground">{enhancement.description}</span>
              </motion.button>
            );
          })}
        </div>

        <label className="grid gap-3 rounded-lg border border-border bg-card p-5 shadow-xl shadow-black/5">
          <span className="font-sans text-3xl">Additional Instructions</span>
          <textarea
            className="min-h-32 resize-y rounded-lg border border-input bg-background px-4 py-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30"
            onChange={(event) => onChangeAdditionalInstructions(event.target.value)}
            placeholder="Anything specific you'd like the AI to improve?"
            value={additionalInstructions}
          />
        </label>
      </div>
    </WorkflowScreen>
  );
}

function AlbumReviewStep({
  additionalInstructions,
  project,
  selectedEnhancementIds,
  selectedImage,
  selectedTemplate,
}: {
  additionalInstructions: string;
  project: Project;
  selectedEnhancementIds: string[];
  selectedImage: AlbumSourceImage | null;
  selectedTemplate?: PhotoTemplate;
}) {
  const selectedEnhancementItems = enhancements.filter((enhancement) => selectedEnhancementIds.includes(enhancement.id));
  const prompt = selectedImage && selectedTemplate
    ? buildAlbumCreatorPrompt({
        additionalInstructions,
        project,
        selectedEnhancements: selectedEnhancementItems,
        selectedImage,
        selectedTemplate,
      })
    : "";

  return (
    <WorkflowScreen title="Ready for album finish">
      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <section className="overflow-hidden rounded-lg border border-border bg-card shadow-2xl shadow-black/10">
          {selectedImage ? (
            <img alt={selectedImage.title} className="max-h-[68vh] w-full bg-[#090b10] object-contain" src={selectedImage.image} />
          ) : (
            <div className="grid min-h-96 place-items-center bg-secondary text-muted-foreground">No image selected</div>
          )}
        </section>
        <section className="rounded-lg border border-border bg-card p-6 shadow-xl shadow-black/5">
          <h2 className="font-sans text-4xl">Enhancement summary</h2>
          <dl className="mt-6 grid gap-4">
            <div>
              <dt className="text-sm text-muted-foreground">Project</dt>
              <dd className="mt-1 text-xl">{project.name}</dd>
            </div>
            <div>
              <dt className="text-sm text-muted-foreground">Template</dt>
              <dd className="mt-1 text-xl">{selectedTemplate?.name ?? "Not selected"}</dd>
            </div>
            <div>
              <dt className="text-sm text-muted-foreground">Improvements</dt>
              <dd className="mt-2 flex flex-wrap gap-2">
                {selectedEnhancementItems.length > 0 ? (
                  selectedEnhancementItems.map((item) => (
                    <span className="rounded-full border border-primary/25 bg-primary/8 px-3 py-1 text-sm text-primary" key={item.id}>
                      {item.title}
                    </span>
                  ))
                ) : (
                  <span className="text-xl">Professional album polish</span>
                )}
              </dd>
            </div>
            {additionalInstructions.trim() ? (
              <div>
                <dt className="text-sm text-muted-foreground">Notes</dt>
                <dd className="mt-1 text-base leading-7">{additionalInstructions.trim()}</dd>
              </div>
            ) : null}
          </dl>
        </section>
        <section className="sr-only" aria-label="Internal generated prompt">
          {prompt}
        </section>
      </div>
    </WorkflowScreen>
  );
}

const buildAlbumCreatorPrompt = ({
  additionalInstructions,
  project,
  selectedEnhancements,
  selectedImage,
  selectedTemplate,
}: {
  additionalInstructions: string;
  project: Project;
  selectedEnhancements: Enhancement[];
  selectedImage: AlbumSourceImage;
  selectedTemplate: PhotoTemplate;
}) => {
  const enhancementPrompt = selectedEnhancements.length
    ? selectedEnhancements.map((enhancement) => enhancement.prompt).join("; ")
    : "apply professional album-quality correction, tasteful detail recovery, natural skin tone protection, and print-ready polish";

  return [
    "Enhance the supplied photograph for premium album-quality delivery. Do not create a new album page or collage.",
    `Project metadata: project name "${project.name}", event category "${project.eventCategory}", project status "${project.status}". Reuse this context internally and do not ask for theme or category again.`,
    `Source image context: "${selectedImage.title}" from ${selectedImage.source === "upload" ? "uploaded photograph" : "previously generated project image"}; metadata "${selectedImage.meta}". Preserve the original subject identity, pose, composition intent, clothing, jewellery, event context, and emotional tone.`,
    `Output template: "${selectedTemplate.name}" with ${selectedTemplate.imageCount} image frame behavior, category ${selectedTemplate.category}, orientation ${selectedTemplate.orientation}. Adapt crop, finish, sharpness, and detail for this output format without adding text, borders, logos, or extra people.`,
    `Enhancement direction: ${enhancementPrompt}.`,
    additionalInstructions.trim() ? `Studio notes: ${additionalInstructions.trim()}.` : "Studio notes: none.",
    "Quality requirements: professional Lightroom or Capture One style finishing, photorealistic, natural skin texture, clean faces and eyes, controlled highlights, rich but believable color, detailed fabric and jewellery where visible, no artifacts, no watermarks, no prompt text, no layout page generation.",
  ].join("\n\n");
};

function StyleStep({ onSelectStyle }: { onSelectStyle: (style: ThemeCard) => void }) {
  return (
    <WorkflowScreen title="What style do you want?">
      <div className="relative -mx-5 sm:-mx-8">
        <div className="space-y-16 sm:space-y-20">
          <ThemeCarousel direction="left" onSelectTheme={onSelectStyle} themes={personalThemes} title="Personal" />
          <ThemeCarousel direction="right" onSelectTheme={onSelectStyle} themes={professionalThemes} title="Professional" />
        </div>
      </div>
    </WorkflowScreen>
  );
}

function SubjectsStep({
  onAddRelationship,
  onAddSubject,
  onChange,
  onDeleteRelationship,
  onDeleteSubject,
  onEditRelationship,
  relationships,
  subjects,
}: {
  onAddRelationship: (
    currentSubjectId: string,
    relatedPerson: Pick<Subject, "age" | "gender" | "image" | "name">,
    role: string,
  ) => void;
  onAddSubject: () => void;
  onChange: (id: string, patch: Partial<Subject>) => void;
  onDeleteRelationship: (relationshipId: string) => void;
  onDeleteSubject: (id: string) => void;
  onEditRelationship: (
    relationshipId: string,
    currentSubjectId: string,
    relatedSubjectId: string,
    relatedPerson: Pick<Subject, "age" | "gender" | "image" | "name">,
    role: string,
  ) => void;
  relationships: Relationship[];
  subjects: Subject[];
}) {
  const [relationshipEditor, setRelationshipEditor] = React.useState<{
    currentSubject: Subject;
    relationship?: Relationship;
    relatedSubject?: Subject;
  } | null>(null);

  return (
    <WorkflowScreen title="Subject profiles">
      <div className="mx-auto grid w-full max-w-5xl gap-5">
        <button
          className="flex min-h-28 items-center justify-center gap-4 rounded-lg border border-dashed border-primary/45 bg-primary/8 p-6 text-center transition hover:bg-primary/12 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/45"
          onClick={onAddSubject}
          type="button"
        >
          <span className="grid size-11 place-items-center rounded-full bg-primary text-primary-foreground">
            <Plus className="size-5" aria-hidden="true" />
          </span>
          <span className="font-sans text-3xl">Add Subject</span>
        </button>
        {subjects.map((subject) => {
          const subjectRelationships = relationships.filter(
            (relationship) => relationship.fromSubjectId === subject.id || relationship.toSubjectId === subject.id,
          );

          return (
            <SubjectCard
              key={subject.id}
              onAddRelationship={() => setRelationshipEditor({ currentSubject: subject })}
              onChange={onChange}
              onDelete={onDeleteSubject}
              onDeleteRelationship={onDeleteRelationship}
              onEditRelationship={(relationship, relatedSubject, displayRole) =>
                setRelationshipEditor({
                  currentSubject: subject,
                  relatedSubject,
                  relationship: { ...relationship, role: displayRole },
                })
              }
              relationships={subjectRelationships}
              subject={subject}
              subjects={subjects}
            />
          );
        })}
      </div>
      <AnimatePresence>
        {relationshipEditor ? (
          <RelationshipModal
            currentSubject={relationshipEditor.currentSubject}
            onClose={() => setRelationshipEditor(null)}
            onSave={(relatedPerson, role) => {
              if (relationshipEditor.relationship && relationshipEditor.relatedSubject) {
                onEditRelationship(
                  relationshipEditor.relationship.id,
                  relationshipEditor.currentSubject.id,
                  relationshipEditor.relatedSubject.id,
                  relatedPerson,
                  role,
                );
              } else {
                onAddRelationship(relationshipEditor.currentSubject.id, relatedPerson, role);
              }
              setRelationshipEditor(null);
            }}
            relationship={relationshipEditor.relationship}
            relatedSubject={relationshipEditor.relatedSubject}
          />
        ) : null}
      </AnimatePresence>
    </WorkflowScreen>
  );
}

function ThemeStep({
  onSelectTheme,
  selectedStyle,
  selectedThemeName,
}: {
  onSelectTheme: (themeName: string) => void;
  selectedStyle: ThemeCard | null;
  selectedThemeName?: string;
}) {
  return (
    <WorkflowScreen title="Where should this happen?">
      {selectedStyle ? (
        <ThemeSelectionScreen
          onBack={() => undefined}
          onSelectTheme={onSelectTheme}
          selectedStyle={selectedStyle}
          selectedThemeName={selectedThemeName}
          showBack={false}
        />
      ) : (
        <div className="rounded-lg border border-border bg-card p-8 text-center">Choose a style first.</div>
      )}
    </WorkflowScreen>
  );
}

function TemplateStep({
  onSelectTemplate,
  selectedTemplateId,
}: {
  onSelectTemplate: (templateId: string) => void;
  selectedTemplateId?: string | null;
}) {
  return (
    <WorkflowScreen title="Choose a Template">
      <TemplateGallery
        onSelectTemplate={(template) => onSelectTemplate(template.id)}
        selectedTemplateId={selectedTemplateId}
      />
    </WorkflowScreen>
  );
}

function ReviewStep({
  relationships,
  selectedStyle,
  selectedTemplate,
  selectedThemeName,
  subjects,
}: {
  relationships: Relationship[];
  selectedStyle: ThemeCard | null;
  selectedTemplate?: PhotoTemplate;
  selectedThemeName?: string;
  subjects: Subject[];
}) {
  const participantDetails = getParticipantDetails(subjects, relationships);
  const prompt = selectedTemplate
    ? buildTemplatePrompt({
        participantDetails,
        selectedStyle,
        selectedThemeName,
        template: selectedTemplate,
      })
    : "";

  return (
    <WorkflowScreen title="Does everything look correct?">
      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {subjects.map((subject) => (
            <figure className="overflow-hidden rounded-lg border border-border bg-card" key={subject.id}>
              {subject.image ? (
                <img alt={subject.name || "Uploaded subject"} className="aspect-[4/5] w-full object-cover" src={subject.image} />
              ) : (
                <div className="grid aspect-[4/5] w-full place-items-center bg-secondary text-muted-foreground">
                  No photo
                </div>
              )}
              <figcaption className="p-4 text-lg font-medium">{subject.name || "Unnamed"}</figcaption>
            </figure>
          ))}
        </div>
        <section className="rounded-lg border border-border bg-card p-6 shadow-xl shadow-black/5">
          <h2 className="font-sans text-4xl">Ready to generate</h2>
          <dl className="mt-6 grid gap-4 text-base">
            <div>
              <dt className="text-muted-foreground">Style</dt>
              <dd className="mt-1 text-xl">{selectedStyle?.name ?? "Not selected"}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Setting</dt>
              <dd className="mt-1 text-xl">{selectedThemeName ?? "Not selected"}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Template</dt>
              <dd className="mt-1 text-xl">{selectedTemplate?.name ?? "Not selected"}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">People</dt>
              <dd className="mt-1 text-xl">{subjects.map((subject) => subject.name || "Unnamed").join(", ")}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Relationships</dt>
              <dd className="mt-1 text-xl">{relationships.length > 0 ? relationships.length : "None added"}</dd>
            </div>
          </dl>
        </section>
        <section className="xl:col-span-2 rounded-lg border border-border bg-card p-6 shadow-xl shadow-black/5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.12em] text-primary">AI Prompt</p>
              <h2 className="mt-2 font-sans text-4xl">Generated prompt</h2>
            </div>
            {selectedTemplate ? (
              <span className="rounded-full border border-primary/30 px-3 py-1 text-xs font-medium text-primary">
                {selectedTemplate.imageCount} image{selectedTemplate.imageCount === 1 ? "" : "s"}
              </span>
            ) : null}
          </div>
          <pre className="mt-5 max-h-[46vh] overflow-auto whitespace-pre-wrap rounded-lg border border-border bg-background/70 p-5 text-sm leading-7 text-foreground">
            {prompt || "Choose a template to generate the full AI prompt."}
          </pre>
        </section>
      </div>
    </WorkflowScreen>
  );
}

const getParticipantDetails = (subjects: Subject[], relationships: Relationship[]): ParticipantDetails => {
  if (subjects.length <= 1) {
    return {
      personName: subjects[0]?.name.trim() || undefined,
    };
  }

  if (subjects.length === 2) {
    return {
      coupleRelationship: relationships[0]?.role || undefined,
    };
  }

  return {
    groupPeople: subjects.map((subject, index) => ({
      priority: subject.isPrimary ? "1" : String(index + 1),
      relationship: relationships.find(
        (relationship) => relationship.fromSubjectId === subject.id || relationship.toSubjectId === subject.id,
      )?.role ?? (subject.name.trim() || `Person ${index + 1}`),
    })),
    peopleCount: subjects.length,
  };
};

function GalleryStep({ onPreview }: { onPreview: (image: GeneratedImage) => void }) {
  return (
    <WorkflowScreen title="Your images are ready">
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {generatedImages.map((image) => (
          <GeneratedImageCard image={image} key={image.id} onPreview={onPreview} />
        ))}
      </div>
    </WorkflowScreen>
  );
}

function WorkflowScreen({ children, title }: { children: React.ReactNode; title: string }) {
  return (
    <motion.section
      animate={{ opacity: 1, x: 0 }}
      className="py-8"
      exit={{ opacity: 0, x: -18 }}
      initial={{ opacity: 0, x: 18 }}
      transition={{ duration: 0.24 }}
    >
      <h1 className="mx-auto max-w-4xl text-center font-sans text-5xl leading-none sm:text-6xl lg:text-7xl">{title}</h1>
      <div className="mt-10">{children}</div>
    </motion.section>
  );
}

function SubjectCard({
  onAddRelationship,
  onChange,
  onDelete,
  onDeleteRelationship,
  onEditRelationship,
  relationships,
  subject,
  subjects,
}: {
  onAddRelationship: () => void;
  onChange: (id: string, patch: Partial<Subject>) => void;
  onDelete: (id: string) => void;
  onDeleteRelationship: (relationshipId: string) => void;
  onEditRelationship: (relationship: Relationship, relatedSubject: Subject, displayRole: string) => void;
  relationships: Relationship[];
  subject: Subject;
  subjects: Subject[];
}) {
  const inputId = `subject-photo-${subject.id}`;

  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        onChange(subject.id, { image: reader.result });
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <article className="overflow-hidden rounded-xl border border-border bg-card shadow-xl shadow-black/5">
      <div className="flex items-center justify-between gap-4 border-b border-border px-6 py-5">
        <div>
          <p className="text-sm font-medium text-primary">{subject.isPrimary ? "Primary Subject" : "Subject"}</p>
          <h2 className="mt-1 font-sans text-4xl">{subject.name || "Unnamed"}</h2>
        </div>
        <div className="flex items-center gap-2">
          {subject.isPrimary ? (
            <span className="grid size-9 place-items-center rounded-full bg-primary text-primary-foreground">
              <Star className="size-4" aria-hidden="true" />
            </span>
          ) : null}
          <button
            aria-label="Delete subject"
            className="grid size-9 place-items-center rounded-full border border-border bg-secondary text-muted-foreground transition hover:border-destructive/40 hover:bg-destructive/10 hover:text-destructive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-destructive/25"
            onClick={() => onDelete(subject.id)}
            type="button"
          >
            <Trash2 className="size-4" aria-hidden="true" />
          </button>
        </div>
      </div>
      <div className="grid gap-6 p-6 lg:grid-cols-[minmax(0,0.75fr)_minmax(0,1.25fr)]">
        <section>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Photos</h3>
          <label
            className="group mt-3 grid aspect-[4/3] cursor-pointer place-items-center overflow-hidden rounded-lg border border-dashed border-border bg-secondary text-center transition hover:border-primary/50 hover:bg-primary/10"
            htmlFor={inputId}
          >
            {subject.image ? (
              <img alt={subject.name || "Subject photo"} className="h-full w-full object-cover" src={subject.image} />
            ) : (
              <span className="grid justify-items-center gap-2 text-sm text-muted-foreground">
                <Upload className="size-5 text-primary" aria-hidden="true" />
                Upload photo
              </span>
            )}
          </label>
          <input accept="image/*" className="sr-only" id={inputId} onChange={handlePhotoChange} type="file" />
        </section>

        <section>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Subject Details</h3>
          <div className="mt-3 grid gap-4">
            <Input onChange={(event) => onChange(subject.id, { name: event.target.value })} placeholder="Name" value={subject.name} />
            <div className="grid grid-cols-2 gap-3">
              <Input inputMode="numeric" onChange={(event) => onChange(subject.id, { age: event.target.value })} placeholder="Age" value={subject.age} />
              <select
                value={subject.gender}
                onChange={(event) => onChange(subject.id, { gender: event.target.value })}
                className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground transition focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 focus-visible:outline-none"
              >
                <option value="" disabled>Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
            <button
              className={cn(
                "flex h-11 items-center justify-between rounded-md border px-4 text-sm font-medium transition",
                subject.isPrimary ? "border-primary bg-primary/12 text-primary" : "border-border bg-secondary",
              )}
              onClick={() => onChange(subject.id, { isPrimary: true })}
              type="button"
            >
              <span className="inline-flex items-center gap-2">
                <Star className="size-4" aria-hidden="true" />
                Primary Subject
              </span>
              {subject.isPrimary ? <Check className="size-4" aria-hidden="true" /> : null}
            </button>
          </div>
        </section>
      </div>

      <section className="border-t border-border px-6 py-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Relationships</h3>
            <p className="mt-1 text-sm text-muted-foreground">People connected to {subject.name || "this subject"}.</p>
          </div>
          <Button onClick={onAddRelationship} type="button" variant="outline">
            <Plus aria-hidden="true" />
            Add Relationship
          </Button>
        </div>
        {relationships.length > 0 ? (
          <div className="mt-4 overflow-hidden rounded-lg border border-border">
            <div className="grid grid-cols-[minmax(0,0.8fr)_minmax(0,1fr)_auto] gap-3 bg-secondary/70 px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <span>Relationship Type</span>
              <span>Person</span>
              <span className="sr-only">Actions</span>
            </div>
            {relationships.map((relationship) => {
              const isOutgoing = relationship.fromSubjectId === subject.id;
              const relatedSubject = subjects.find((item) =>
                item.id === (isOutgoing ? relationship.toSubjectId : relationship.fromSubjectId),
              );
              const displayRole = isOutgoing
                ? relationship.role
                : getInverseRelationshipRole(relationship.role, relatedSubject?.gender ?? "");

              return (
                <div
                  className="grid grid-cols-[minmax(0,0.8fr)_minmax(0,1fr)_auto] items-center gap-3 border-t border-border px-4 py-3"
                  key={relationship.id}
                >
                  <span className="font-medium">{displayRole}</span>
                  <span>{relatedSubject?.name || "Unnamed"}</span>
                  <span className="flex items-center gap-1">
                    <button
                      aria-label={`Edit ${displayRole} relationship`}
                      className="grid size-9 place-items-center rounded-full text-muted-foreground transition hover:bg-secondary hover:text-foreground"
                      onClick={() => relatedSubject && onEditRelationship(relationship, relatedSubject, displayRole)}
                      type="button"
                    >
                      <Pencil className="size-4" aria-hidden="true" />
                    </button>
                    <button
                      aria-label={`Delete ${displayRole} relationship`}
                      className="grid size-9 place-items-center rounded-full text-muted-foreground transition hover:bg-destructive/10 hover:text-destructive"
                      onClick={() => onDeleteRelationship(relationship.id)}
                      type="button"
                    >
                      <Trash2 className="size-4" aria-hidden="true" />
                    </button>
                  </span>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="mt-4 rounded-lg border border-dashed border-border bg-secondary/35 px-5 py-8 text-center text-sm text-muted-foreground">
            No relationships added yet.
          </div>
        )}
      </section>
    </article>
  );
}

function RelationshipModal({
  currentSubject,
  onClose,
  onSave,
  relationship,
  relatedSubject,
}: {
  currentSubject: Subject;
  onClose: () => void;
  onSave: (relatedPerson: Pick<Subject, "age" | "gender" | "image" | "name">, role: string) => void;
  relationship?: Relationship;
  relatedSubject?: Subject;
}) {
  const [name, setName] = React.useState(relatedSubject?.name ?? "");
  const [gender, setGender] = React.useState(relatedSubject?.gender ?? "");
  const [role, setRole] = React.useState(relationship?.role ?? "");
  const [age, setAge] = React.useState(relatedSubject?.age ?? "");
  const [image, setImage] = React.useState(relatedSubject?.image);
  const photoInputId = React.useId();
  const roles = [
    ...(gender === "Male" ? maleRelationshipRoles : gender === "Female" ? femaleRelationshipRoles : []),
    ...neutralRelationshipRoles,
  ];
  const canSave = name.trim().length > 0 && gender.length > 0 && role.length > 0;

  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setImage(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <motion.div
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 grid place-items-center bg-black/65 p-4 backdrop-blur-sm"
      exit={{ opacity: 0 }}
      initial={{ opacity: 0 }}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <motion.form
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="max-h-[92vh] w-full max-w-xl overflow-y-auto rounded-xl border border-border bg-card p-6 shadow-2xl"
        exit={{ opacity: 0, scale: 0.98 }}
        initial={{ opacity: 0, scale: 0.97, y: 12 }}
        onSubmit={(event) => {
          event.preventDefault();
          if (canSave) {
            onSave({ age, gender, image, name: name.trim() }, role);
          }
        }}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-primary">Related Person</p>
            <h2 className="mt-1 font-sans text-4xl">{relationship ? "Edit Relationship" : "Add Relationship"}</h2>
          </div>
          <button
            aria-label="Close relationship modal"
            className="grid size-10 place-items-center rounded-full bg-secondary text-muted-foreground transition hover:text-foreground"
            onClick={onClose}
            type="button"
          >
            <X className="size-5" aria-hidden="true" />
          </button>
        </div>

        <div className="mt-6 grid gap-4">
          <label className="grid gap-2 text-sm font-medium" htmlFor={photoInputId}>
            Photo
            <span
              className="grid min-h-36 cursor-pointer place-items-center overflow-hidden rounded-lg border border-dashed border-border bg-secondary"
            >
              {image ? (
                <img alt={name || "Related person"} className="max-h-56 w-full object-cover" src={image} />
              ) : (
                <span className="grid justify-items-center gap-2 text-muted-foreground">
                  <Upload className="size-5 text-primary" aria-hidden="true" />
                  Upload photo
                </span>
              )}
            </span>
          </label>
          <input accept="image/*" className="sr-only" id={photoInputId} onChange={handlePhotoChange} type="file" />
          <label className="grid gap-2 text-sm font-medium">
            Name
            <Input autoFocus onChange={(event) => setName(event.target.value)} placeholder="Name" value={name} />
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label className="grid gap-2 text-sm font-medium">
              Gender
              <select
                className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground transition focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 focus-visible:outline-none"
                onChange={(event) => {
                  const nextGender = event.target.value;
                  setGender(nextGender);
                  if (
                    (nextGender === "Male" && femaleRelationshipRoles.includes(role)) ||
                    (nextGender === "Female" && maleRelationshipRoles.includes(role))
                  ) {
                    setRole("");
                  }
                }}
                value={gender}
              >
                <option value="" disabled>Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </label>
            <label className="grid gap-2 text-sm font-medium">
              Age
              <Input inputMode="numeric" onChange={(event) => setAge(event.target.value)} placeholder="Optional" value={age} />
            </label>
          </div>
          <label className="grid gap-2 text-sm font-medium">
            Relationship to {currentSubject.name || "Current Subject"}
            <select
              className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground transition focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 focus-visible:outline-none"
              disabled={!gender}
              onChange={(event) => {
                const nextRole = event.target.value;
                setRole(nextRole);
                const assistedGender = genderByRelationshipRole[nextRole];
                if (assistedGender) {
                  setGender(assistedGender);
                }
              }}
              value={role}
            >
              <option value="" disabled>{gender ? "Choose relationship" : "Select gender first"}</option>
              {roles.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </label>
        </div>

        <div className="mt-7 flex justify-end gap-3">
          <Button onClick={onClose} type="button" variant="outline">Cancel</Button>
          <Button disabled={!canSave} type="submit">{relationship ? "Save Changes" : "Add Relationship"}</Button>
        </div>
      </motion.form>
    </motion.div>
  );
}

function GeneratedImageCard({ image, onPreview }: { image: GeneratedImage; onPreview: (image: GeneratedImage) => void }) {
  return (
    <motion.button
      className="group overflow-hidden rounded-lg border border-border bg-card text-left shadow-xl shadow-black/5"
      onClick={() => onPreview(image)}
      type="button"
      transition={{ duration: 0.22 }}
      whileHover={{ y: -6, scale: 1.015 }}
    >
      <div className="relative aspect-[4/5] overflow-hidden">
        <img alt={image.title} className="h-full w-full object-cover transition duration-700 group-hover:scale-105" src={image.image} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 transition group-hover:opacity-100" />
        <span className="absolute bottom-4 right-4 grid size-10 place-items-center rounded-full bg-white/90 text-[#151515] opacity-0 transition group-hover:opacity-100">
          <Maximize2 className="size-4" aria-hidden="true" />
        </span>
      </div>
      <div className="p-4">
        <h3 className="font-sans text-2xl">{image.title}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{image.meta}</p>
      </div>
    </motion.button>
  );
}

function ImagePreview({ image, onClose }: { image: GeneratedImage; onClose: () => void }) {
  return (
    <motion.div
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 grid place-items-center bg-black/88 p-5 backdrop-blur-xl"
      exit={{ opacity: 0 }}
      initial={{ opacity: 0 }}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <motion.div
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative max-h-[88vh] w-full max-w-5xl overflow-hidden rounded-lg border border-white/12 bg-[#111]"
        exit={{ opacity: 0, scale: 0.98 }}
        initial={{ opacity: 0, scale: 0.96, y: 12 }}
      >
        <button
          aria-label="Close preview"
          className="absolute right-4 top-4 z-10 grid size-10 place-items-center rounded-full bg-black/60 text-white backdrop-blur transition hover:bg-black/80"
          onClick={onClose}
          type="button"
        >
          <X className="size-5" aria-hidden="true" />
        </button>
        <img alt={image.title} className="max-h-[88vh] w-full object-contain" src={image.image} />
      </motion.div>
    </motion.div>
  );
}
