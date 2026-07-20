"use client";

import * as React from "react";
import { Calendar, FolderOpen, Plus, Search, FileText, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { createProject, listProjects, type Project, type ProjectStatus } from "@/features/projects/api";
import { ProjectCreateModal } from "@/features/projects/components/project-create-modal";

const statusConfig: Record<ProjectStatus, { label: string; className: string }> = {
  DRAFT: { label: "Draft", className: "border-slate-400/30 bg-slate-400/10 text-slate-600 dark:text-slate-400" },
  IN_PROGRESS: { label: "Active", className: "border-amber-400/30 bg-amber-400/12 text-amber-600 dark:text-amber-400" },
  COMPLETED: { label: "Completed", className: "border-emerald-400/30 bg-emerald-400/12 text-emerald-600 dark:text-emerald-400" },
  ARCHIVED: { label: "Archived", className: "border-slate-400/30 bg-slate-400/8 text-slate-500 dark:text-slate-500 line-through" },
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
          <div className="grid gap-4 p-4 sm:grid-cols-2 xl:grid-cols-3">
            {filteredProjects.map((project, idx) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: idx * 0.04 }}
              >
                <Card
                  className="group cursor-pointer transition hover:border-primary/30 hover:shadow-md hover:shadow-primary/5"
                  onClick={() => router.push(`/dashboard/${project.id}`)}
                  onKeyDown={(e) => { if (e.key === "Enter") router.push(`/dashboard/${project.id}`); }}
                  tabIndex={0}
                  role="link"
                >
                  <CardHeader className="gap-3 p-5 pb-0">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="flex-1 truncate font-sans text-lg font-semibold leading-tight text-foreground group-hover:text-primary">
                        {project.name}
                      </h3>
                      <Badge className={`shrink-0 text-[10px] tracking-wide ${statusConfig[project.status].className}`}>
                        {statusConfig[project.status].label}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="p-5 pt-3">
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                      <span className="inline-flex items-center gap-1.5 rounded-md bg-muted/50 px-2 py-1 font-medium capitalize">
                        {project.eventCategory}
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <Calendar className="size-3" />
                        {formatDate(project.createdAt)}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
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
