"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ImageIcon,
  Maximize2,
  Plus,
  Search,
  Star,
  Trash2,
  Upload,
  Users,
  X,
} from "lucide-react";
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

const workflowSteps = ["Style", "Subjects", "Relationships", "Theme", "Template", "Review", "Gallery"] as const;
const creationNavSteps = [
  { label: "Style", step: "Style" },
  { label: "Subject", step: "Subjects" },
  { label: "Relation", step: "Relationships" },
  { label: "Theme", step: "Theme" },
  { label: "Template", step: "Template" },
  { label: "Review", step: "Review" },
  { label: "Generate", step: "Gallery" },
] as const;

type WorkflowStep = (typeof workflowSteps)[number];
type WorkspaceStep = WorkflowStep | "Dashboard";

const stepParamByStep: Partial<Record<WorkspaceStep, string>> = {
  Gallery: "gallery",
  Relationships: "relationships",
  Review: "review",
  Style: "style",
  Subjects: "subjects",
  Template: "template",
  Theme: "theme",
};

const stepByStepParam: Record<string, WorkflowStep> = {
  gallery: "Gallery",
  relationships: "Relationships",
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

const relationshipRolesByStyle: Record<string, string[]> = {
  Wedding: ["Bride", "Groom", "Husband", "Wife", "Mother", "Father", "Brother", "Sister", "Friend"],
  Portrait: ["Self", "Friend", "Family"],
  Personal: ["Self", "Friend", "Family"],
  Professional: ["Manager", "CEO", "Employee", "Team"],
  Corporate: ["Manager", "CEO", "Employee", "Team"],
  Conferences: ["Speaker", "Host", "Panelist", "Guest", "Team"],
  "Movie Shoot": ["Director", "Actor", "Producer", "Crew", "Lead"],
};

const singleSubjectStyles = new Set(["Personal", "Portrait", "Professional", "Fashion", "Product", "Sports"]);



const createBlankSubject = (index: number): Subject => ({
  age: "",
  gender: "",
  id: crypto.randomUUID(),
  isPrimary: index === 0,
  name: "",
});

const getDefaultSubjectsForStyle = (styleName: string) => {
  const subjectCount = singleSubjectStyles.has(styleName) ? 1 : 2;
  return Array.from({ length: subjectCount }, (_, index) => createBlankSubject(index));
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

  const activeIndex = activeStep === "Dashboard" ? -1 : workflowSteps.indexOf(activeStep);
  const selectedTemplate = getTemplateById(selectedTemplateId);
  const relationshipRoles = selectedStyle ? relationshipRolesByStyle[selectedStyle.name] ?? relationshipRolesByStyle.Wedding : relationshipRolesByStyle.Wedding;
  const canNavigateStep = (step: WorkflowStep) => {
    return step !== "Gallery" || activeStep === "Gallery";
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

  const addRelationship = () => {
    const firstSubject = subjects[0]?.id ?? "";
    const secondSubject = subjects[1]?.id ?? firstSubject;
    setRelationships((current) => [
      ...current,
      { fromSubjectId: firstSubject, id: crypto.randomUUID(), role: relationshipRoles[0] ?? "", toSubjectId: secondSubject },
    ]);
  };

  const startWorkflow = () => {
    setSelectedStyle(null);
    setSelectedThemeName(undefined);
    setSelectedTemplateId(undefined);
    pushWorkspaceStep("Style");
  };

  const goBack = () => {
    if (activeStep === "Dashboard") {
      return;
    }

    pushWorkspaceStep(workflowSteps[activeIndex - 1] ?? "Dashboard");
  };

  const goForward = () => {
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
            <CreationNav
              activeStep={activeStep}
              canNavigateStep={canNavigateStep}
              onNavigate={navigateCreationStep}
            />
          ) : (
            <span />
          )}
          <ThemeToggle />
        </div>

        <AnimatePresence mode="wait">
          {activeStep === "Dashboard" ? (
            <ProjectDashboardView key="dashboard" onCreateNewImage={startWorkflow} project={project} />
          ) : activeStep === "Style" ? (
            <StyleStep
              key="style"
              onSelectStyle={(style) => {
                setSelectedStyle(style);
                setSelectedThemeName(undefined);
                setSubjects(getDefaultSubjectsForStyle(style.name));
                setRelationships([]);
                pushWorkspaceStep("Subjects");
              }}
            />
          ) : activeStep === "Subjects" ? (
            <SubjectsStep
              key="subjects"
              onAddSubject={addSubject}
              onChange={updateSubject}
              onDeleteSubject={deleteSubject}
              subjects={subjects}
            />
          ) : activeStep === "Relationships" ? (
            <RelationshipsStep
              key="relationships"
              onAdd={addRelationship}
              onChange={(id, patch) =>
                setRelationships((current) => current.map((item) => (item.id === id ? { ...item, ...patch } : item)))
              }
              relationships={relationships}
              roles={relationshipRoles}
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
          ) : (
            <GalleryStep key="gallery" onPreview={setPreviewImage} />
          )}
        </AnimatePresence>

        {activeStep !== "Dashboard" && activeStep !== "Gallery" ? (
          <footer className="mt-auto flex items-center justify-end gap-3 border-t border-border py-5">
            {activeStep !== "Style" ? (
              <Button disabled={(activeStep === "Theme" && !selectedThemeName) || (activeStep === "Template" && !selectedTemplate)} onClick={goForward} type="button">
                {activeStep === "Review" ? "Generate Images" : "Continue"}
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

function ProjectDashboardView({
  onCreateNewImage,
  project,
}: {
  onCreateNewImage: () => void;
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

      <section className="grid min-h-0 gap-3">
        <div className="flex items-center justify-between gap-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Previous images</p>
          <p className="text-xs text-muted-foreground">{previousImageSlots.length} empty slots</p>
        </div>
        <div className="max-h-[58vh] overflow-y-auto rounded-xl border border-border bg-card/40 p-3 shadow-inner shadow-black/5">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        <button
              className="group col-span-2 flex aspect-[2/1] items-center gap-5 rounded-xl border-2 border-primary/40 bg-gradient-to-br from-primary/8 to-primary/3 p-6 text-left shadow-lg shadow-primary/5 transition hover:-translate-y-0.5 hover:border-primary hover:shadow-xl hover:shadow-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/45"
          onClick={onCreateNewImage}
          type="button"
        >
          <span className="grid size-14 shrink-0 place-items-center rounded-full bg-amber-500 text-white shadow-lg shadow-amber-500/25">
            <Plus className="size-7" aria-hidden="true" />
          </span>
          <span className="grid gap-1">
            <span className="block font-sans text-2xl leading-none sm:text-3xl">Create New Image</span>
            <span className="block text-sm text-muted-foreground">Choose a style, subjects, template, and generate.</span>
          </span>
        </button>

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
  onAddSubject,
  onChange,
  onDeleteSubject,
  subjects,
}: {
  onAddSubject: () => void;
  onChange: (id: string, patch: Partial<Subject>) => void;
  onDeleteSubject: (id: string) => void;
  subjects: Subject[];
}) {
  return (
    <WorkflowScreen title="Who's in the photo?">
      <div className="mx-auto grid w-full max-w-5xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <button
          className="grid min-h-64 place-items-center rounded-lg border border-dashed border-primary/45 bg-primary/8 p-6 text-center transition hover:-translate-y-1 hover:bg-primary/12 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/45"
          onClick={onAddSubject}
          type="button"
        >
          <span>
            <span className="mx-auto grid size-12 place-items-center rounded-full bg-primary text-primary-foreground">
              <Plus className="size-6" aria-hidden="true" />
            </span>
            <span className="mt-5 block font-sans text-3xl">Add Subject</span>
          </span>
        </button>
        {subjects.map((subject) => (
          <SubjectCard key={subject.id} onChange={onChange} onDelete={onDeleteSubject} subject={subject} />
        ))}
      </div>
    </WorkflowScreen>
  );
}

function RelationshipsStep({
  onAdd,
  onChange,
  relationships,
  roles,
  subjects,
}: {
  onAdd: () => void;
  onChange: (id: string, patch: Partial<Relationship>) => void;
  relationships: Relationship[];
  roles: string[];
  subjects: Subject[];
}) {
  return (
    <WorkflowScreen title="How are they related?">
      <div className="grid gap-5">
        {relationships.length > 0 ? (
          <>
            {relationships.map((relationship) => (
              <RelationshipCard
                key={relationship.id}
                onChange={onChange}
                relationship={relationship}
                roles={roles}
                subjects={subjects}
              />
            ))}
            <Button className="mx-auto" disabled={subjects.length < 2} onClick={onAdd} size="lg" type="button" variant="outline">
              <Plus aria-hidden="true" />
              Add Relationship
            </Button>
          </>
        ) : (
          <div className="grid min-h-96 place-items-center rounded-lg border border-dashed border-primary/35 bg-primary/8 p-10 text-center">
            <div>
              <Users className="mx-auto size-12 text-primary" aria-hidden="true" />
              <h2 className="mt-5 font-sans text-4xl">Connect two people</h2>
              <Button className="mt-7" disabled={subjects.length < 2} onClick={onAdd} size="lg" type="button">
                <Plus aria-hidden="true" />
                Add Relationship
              </Button>
            </div>
          </div>
        )}
      </div>
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
  onChange,
  onDelete,
  subject,
}: {
  onChange: (id: string, patch: Partial<Subject>) => void;
  onDelete: (id: string) => void;
  subject: Subject;
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
    <article className="rounded-lg border border-border bg-card p-5 shadow-xl shadow-black/5">
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-primary">Person</p>
          <h2 className="mt-1 font-sans text-3xl">{subject.name || "Unnamed"}</h2>
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
      <div className="grid gap-4">
        <label
          className="group grid aspect-[4/3] cursor-pointer place-items-center overflow-hidden rounded-lg border border-dashed border-border bg-secondary text-center transition hover:border-primary/50 hover:bg-primary/10"
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
    </article>
  );
}

function RelationshipCard({
  onChange,
  relationship,
  roles,
  subjects,
}: {
  onChange: (id: string, patch: Partial<Relationship>) => void;
  relationship: Relationship;
  roles: string[];
  subjects: Subject[];
}) {
  const subjectOptions = subjects.map((subject, index) => ({
    label: subject.name || `Subject ${index + 1}`,
    value: subject.id,
  }));

  return (
    <article className="mx-auto w-full max-w-3xl rounded-lg border border-border bg-card p-6 shadow-xl shadow-black/5">
      <div className="grid gap-5">
        <Combobox
          icon={Users}
          label="First person"
          onChange={(value) => onChange(relationship.id, { fromSubjectId: value })}
          options={subjectOptions}
          value={relationship.fromSubjectId}
        />
        <ArrowRight className="mx-auto size-6 rotate-90 text-primary" aria-hidden="true" />
        <Combobox
          icon={Search}
          label="Relationship"
          onChange={(value) => onChange(relationship.id, { role: value })}
          options={roles.map((role) => ({ label: role, value: role }))}
          placeholder="Choose relationship"
          value={relationship.role}
        />
        <ArrowRight className="mx-auto size-6 rotate-90 text-primary" aria-hidden="true" />
        <Combobox
          icon={Users}
          label="Second person"
          onChange={(value) => onChange(relationship.id, { toSubjectId: value })}
          options={subjectOptions}
          value={relationship.toSubjectId}
        />
      </div>
    </article>
  );
}

function Combobox({
  icon: Icon,
  label,
  onChange,
  options,
  placeholder = "Search",
  value,
}: {
  icon: React.ElementType;
  label: string;
  onChange: (value: string) => void;
  options: { label: string; value: string }[];
  placeholder?: string;
  value: string;
}) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const selected = options.find((option) => option.value === value);
  const visibleOptions = options.filter((option) => option.label.toLowerCase().includes(query.trim().toLowerCase()));

  return (
    <div className="relative min-w-0">
      <label className="grid gap-2 text-sm font-medium">
        {label}
        <div className="relative">
          <Icon className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
          <Input
            className="pl-11"
            onBlur={() => window.setTimeout(() => setIsOpen(false), 120)}
            onChange={(event) => {
              setQuery(event.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            placeholder={placeholder}
            value={isOpen ? query : selected?.label ?? value}
          />
        </div>
      </label>
      {isOpen ? (
        <div className="absolute z-20 mt-2 max-h-56 w-full overflow-auto rounded-lg border border-border bg-popover p-2 shadow-2xl shadow-black/15">
          {visibleOptions.length > 0 ? (
            visibleOptions.map((option) => (
              <button
                className="flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm hover:bg-secondary"
                key={option.value}
                onMouseDown={(event) => {
                  event.preventDefault();
                  onChange(option.value);
                  setQuery("");
                  setIsOpen(false);
                }}
                type="button"
              >
                {option.label}
                {option.value === value ? <Check className="size-4 text-primary" aria-hidden="true" /> : null}
              </button>
            ))
          ) : (
            <div className="px-3 py-4 text-sm text-muted-foreground">No matches</div>
          )}
        </div>
      ) : null}
    </div>
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
