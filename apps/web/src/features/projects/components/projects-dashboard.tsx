"use client";

import * as React from "react";
import { Plus, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/features/auth/auth-provider";
import { createProject, listProjects, type Project } from "@/features/projects/api";
import { ProjectCard } from "./project-card";
import { ProjectCreateModal } from "./project-create-modal";

export function ProjectsDashboard() {
  const { logout, user } = useAuth();
  const router = useRouter();
  const [projects, setProjects] = React.useState<Project[]>([]);
  const [query, setQuery] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(true);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [isCreating, setIsCreating] = React.useState(false);

  React.useEffect(() => {
    let isMounted = true;

    const loadProjects = async () => {
      try {
        const result = await listProjects();

        if (isMounted) {
          setProjects(result.projects);
        }
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Unable to load projects");
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void loadProjects();

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredProjects = projects.filter((project) => {
    const searchText = `${project.name} ${project.eventCategory} ${project.status}`.toLowerCase();
    return searchText.includes(query.trim().toLowerCase());
  });

  const handleCreate = async (payload: { eventCategory: string; name: string }) => {
    setIsCreating(true);

    try {
      const result = await createProject(payload);
      toast.success("Project created");
      router.push(`/projects/${result.project.id}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to create project");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <main className="min-h-screen px-6 py-8 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <nav className="flex items-center justify-between gap-4" aria-label="Dashboard navigation">
          <a className="font-serif text-3xl tracking-wide" href="/">
            ALANKAAR
          </a>
          <Button onClick={() => void logout()} size="sm" variant="outline" type="button">
            Logout
          </Button>
        </nav>
        <section className="mt-12 flex flex-col gap-6 border-b border-border pb-10 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-primary">Dashboard</p>
            <h1 className="mt-3 font-serif text-5xl leading-none sm:text-6xl">Welcome back.</h1>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-muted-foreground">
              {user?.email ? `Signed in as ${user.email}.` : "Your project studio is ready."}
            </p>
          </div>
          <Button onClick={() => setIsModalOpen(true)} size="lg" type="button">
            <Plus aria-hidden="true" />
            New Project
          </Button>
        </section>
        <section className="mt-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="font-serif text-3xl">Recent Projects</h2>
            <label className="relative w-full sm:max-w-sm">
              <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                className="pl-11"
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search projects"
                value={query}
              />
            </label>
          </div>
          {isLoading ? (
            <div className="mt-12 grid place-items-center py-16">
              <div className="h-10 w-10 animate-spin rounded-full border border-border border-t-primary" />
            </div>
          ) : filteredProjects.length > 0 ? (
            <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {filteredProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          ) : (
            <div className="mt-6 rounded-[1.5rem] border border-dashed border-border bg-card/60 px-6 py-14 text-center">
              <p className="text-xs uppercase tracking-[0.28em] text-primary">No Projects</p>
              <h3 className="mt-3 font-serif text-4xl">
                {projects.length === 0 ? "Create your first album foundation." : "No matching projects."}
              </h3>
              <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-muted-foreground">
                {projects.length === 0
                  ? "Start with an event category and project name. The workspace opens immediately after creation."
                  : "Adjust the search text to find another project."}
              </p>
            </div>
          )}
        </section>
      </div>
      {isModalOpen ? (
        <ProjectCreateModal
          isCreating={isCreating}
          onClose={() => setIsModalOpen(false)}
          onCreate={handleCreate}
        />
      ) : null}
    </main>
  );
}
