"use client";

import * as React from "react";
import { FolderOpen, Plus, Search, FileText, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createProject, listProjects, type Project, type ProjectStatus } from "@/features/projects/api";
import { ProjectCreateModal } from "@/features/projects/components/project-create-modal";

const statusConfig: Record<ProjectStatus, { label: string; className: string }> = {
  DRAFT: { label: "Draft", className: "bg-slate-500/8 text-slate-600 dark:text-slate-400" },
  IN_PROGRESS: { label: "Active", className: "bg-amber-500/12 text-amber-600 dark:text-amber-400" },
  COMPLETED: { label: "Completed", className: "bg-emerald-500/12 text-emerald-600 dark:text-emerald-400" },
  ARCHIVED: { label: "Archived", className: "bg-slate-500/8 text-slate-500 dark:text-slate-500 line-through" },
};

function StatCard({ icon: Icon, label, value, className, hint }: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number;
  className?: string;
  hint?: string;
}) {
  return (
    <div className="flex items-center gap-4 rounded-lg border border-border bg-card p-5 shadow-sm">
      <div className={`grid size-12 shrink-0 place-items-center rounded-full ${className ?? "bg-primary/12 text-primary"}`}>
        <Icon className="size-5" />
      </div>
      <div className="min-w-0">
        <p className="text-3xl font-extrabold leading-none tracking-tight">{value}</p>
        <p className="mt-0.5 text-sm text-muted-foreground">{label}</p>
        {value === 0 && hint && (
          <p className="mt-0.5 truncate text-xs text-muted-foreground/60">{hint}</p>
        )}
      </div>
    </div>
  );
}

export function DashboardHome() {
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
        if (isMounted) setProjects(result.projects);
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Unable to load projects");
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    void loadProjects();
    return () => { isMounted = false; };
  }, []);

  const filteredProjects = projects.filter((project) => {
    const searchText = `${project.name} ${project.eventCategory} ${project.status}`.toLowerCase();
    return searchText.includes(query.trim().toLowerCase());
  });

  const handleCreate = async (payload: { eventCategory: string; name: string }) => {
    setIsCreating(true);
    try {
      const result = await createProject(payload);
      toast.success("Project registered successfully");
      router.push(`/dashboard/${result.project.id}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to create project");
    } finally {
      setIsCreating(false);
    }
  };

  const stats = {
    total: projects.length,
    active: projects.filter((p) => p.status === "IN_PROGRESS").length,
    completed: projects.filter((p) => p.status === "COMPLETED").length,
    draft: projects.filter((p) => p.status === "DRAFT").length,
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
  };

  return (
    <div className="grid gap-6">
      <div className="rounded-lg border border-border bg-card p-5 sm:p-6">
        <div className="flex flex-col gap-1">
          <h2 className="font-sans text-2xl leading-none sm:text-3xl">Project Dashboard</h2>
          <p className="text-sm text-muted-foreground">
            Welcome to the ALANKAAR project portal. Manage and track your photo album projects.
          </p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={FileText} label="Total Projects" value={stats.total} hint="All registered projects" />
        <StatCard
          icon={Clock}
          label="Active"
          value={stats.active}
          className="bg-amber-500/12 text-amber-600 dark:text-amber-400"
          hint={stats.active === 0 && stats.draft > 0 ? "Activate a draft project" : undefined}
        />
        <StatCard
          icon={CheckCircle}
          label="Completed"
          value={stats.completed}
          className="bg-emerald-500/12 text-emerald-600 dark:text-emerald-400"
          hint={stats.completed === 0 ? "No completed projects yet" : undefined}
        />
        <StatCard
          icon={AlertCircle}
          label="Draft"
          value={stats.draft}
          className="bg-slate-500/8 text-slate-600 dark:text-slate-400"
          hint={stats.draft === 0 ? "No drafts saved" : undefined}
        />
      </div>

      <div className="rounded-lg border border-border bg-card shadow-sm">
        <div className="flex flex-col gap-4 border-b border-border p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <h3 className="font-sans text-lg font-medium">Projects Register</h3>
            {!isLoading && projects.length > 0 && (
              <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                {filteredProjects.length}/{projects.length}
              </span>
            )}
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <label className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                aria-label="Search projects"
                className="h-9 w-full pl-9 sm:w-56"
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search projects..."
                value={query}
              />
            </label>
            <Button onClick={() => setIsModalOpen(true)} size="sm" type="button" variant="cta">
              <Plus aria-hidden="true" />
              New Project
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="grid min-h-56 place-items-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-border border-t-primary" />
          </div>
        ) : filteredProjects.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted">
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    S.No.
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Project Name
                  </th>
                  <th className="hidden px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground sm:table-cell">
                    Category
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Status
                  </th>
                  <th className="hidden px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground md:table-cell">
                    Created
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredProjects.map((project, idx) => (
                  <tr
                    key={project.id}
                    className="cursor-pointer border-b border-border transition last:border-0 hover:bg-muted/40"
                    onClick={() => router.push(`/dashboard/${project.id}`)}
                    onKeyDown={(e) => { if (e.key === "Enter") router.push(`/dashboard/${project.id}`); }}
                    tabIndex={0}
                    role="link"
                  >
                    <td className="px-4 py-3.5 text-muted-foreground">{idx + 1}</td>
                    <td className="px-4 py-3.5">
                      <span className="font-medium text-primary underline-offset-2 hover:underline">
                        {project.name}
                      </span>
                    </td>
                    <td className="hidden px-4 py-3.5 text-muted-foreground sm:table-cell">
                      {project.eventCategory}
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${statusConfig[project.status].className}`}>
                        {statusConfig[project.status].label}
                      </span>
                    </td>
                    <td className="hidden px-4 py-3.5 text-muted-foreground md:table-cell">
                      {formatDate(project.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="grid min-h-64 place-items-center px-6 py-12 text-center">
            <div>
              <FolderOpen className="mx-auto size-10 text-muted-foreground" />
              <h3 className="mt-4 font-sans text-xl font-medium">
                {projects.length === 0 ? "No projects registered" : "No matching entries"}
              </h3>
              <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
                {projects.length === 0
                  ? "Register a new project to begin creating your photo album."
                  : "Try adjusting your search to find what you're looking for."}
              </p>
              {projects.length === 0 && (
                <Button className="mt-5" onClick={() => setIsModalOpen(true)} type="button" variant="cta">
                  <Plus aria-hidden="true" />
                  Register New Project
                </Button>
              )}
            </div>
          </div>
        )}
      </div>

      {isModalOpen && (
        <ProjectCreateModal
          isCreating={isCreating}
          onClose={() => setIsModalOpen(false)}
          onCreate={handleCreate}
        />
      )}
    </div>
  );
}
