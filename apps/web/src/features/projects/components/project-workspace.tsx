"use client";

import * as React from "react";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getProject, type Project } from "@/features/projects/api";

const workflow = ["Event", "Subjects", "Relationships", "Theme", "Template", "Review", "Generate"];

export function ProjectWorkspace({ projectId }: { projectId: string }) {
  const [project, setProject] = React.useState<Project | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    let isMounted = true;

    const loadProject = async () => {
      try {
        const result = await getProject(projectId);

        if (isMounted) {
          setProject(result.project);
        }
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Unable to load project");
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

  if (isLoading) {
    return (
      <main className="grid min-h-screen place-items-center px-6">
        <div className="h-10 w-10 animate-spin rounded-full border border-border border-t-primary" />
      </main>
    );
  }

  if (!project) {
    return (
      <main className="grid min-h-screen place-items-center px-6">
        <section className="max-w-lg text-center">
          <h1 className="font-serif text-4xl">Project unavailable</h1>
          <Button asChild className="mt-6" variant="outline">
            <Link href="/projects">Back to dashboard</Link>
          </Button>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen px-6 py-8 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <nav className="flex items-center justify-between gap-4" aria-label="Project navigation">
          <Button asChild size="sm" variant="ghost">
            <Link href="/projects">
              <ArrowLeft aria-hidden="true" />
              Dashboard
            </Link>
          </Button>
          <Badge>{project.status.replace("_", " ")}</Badge>
        </nav>
        <section className="mt-10 border-b border-border pb-8">
          <p className="text-xs uppercase tracking-[0.28em] text-primary">{project.eventCategory}</p>
          <h1 className="mt-3 font-serif text-5xl leading-none sm:text-6xl">{project.name}</h1>
          <p className="mt-4 text-sm text-muted-foreground">
            Last updated {new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(new Date(project.updatedAt))}
          </p>
        </section>
        <div className="mt-8 grid gap-8 lg:grid-cols-[17rem_1fr]">
          <aside aria-label="Workflow">
            <ol className="grid gap-2">
              {workflow.map((step, index) => {
                const isActive = index === 0;

                return (
                  <li key={step}>
                    <button
                      className="flex h-12 w-full items-center gap-3 rounded-2xl border border-border/70 bg-card/70 px-4 text-left text-sm font-medium disabled:cursor-not-allowed disabled:opacity-45"
                      disabled={!isActive}
                      type="button"
                    >
                      <span className="grid size-6 place-items-center rounded-full bg-primary/12 text-xs text-primary">
                        {index + 1}
                      </span>
                      {step}
                    </button>
                  </li>
                );
              })}
            </ol>
          </aside>
          <section className="rounded-[1.5rem] border border-border bg-card/80 p-6 shadow-2xl shadow-black/10 backdrop-blur-xl">
            <div className="flex items-start gap-4">
              <span className="grid size-12 place-items-center rounded-full bg-primary/12 text-primary">
                <CheckCircle2 className="size-6" aria-hidden="true" />
              </span>
              <div>
                <p className="text-xs uppercase tracking-[0.28em] text-primary">Step 1</p>
                <h2 className="mt-2 font-serif text-4xl leading-none">Event Selection</h2>
                <p className="mt-4 max-w-2xl text-sm leading-6 text-muted-foreground">
                  This project is set for a {project.eventCategory.toLowerCase()} album. The next workflow stages are
                  visible for orientation and remain locked for this phase.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
