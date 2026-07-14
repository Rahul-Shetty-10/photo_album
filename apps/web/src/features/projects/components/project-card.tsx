"use client";

import Link from "next/link";
import { CalendarDays } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import type { Project } from "@/features/projects/api";

const statusLabels: Record<Project["status"], string> = {
  ARCHIVED: "Archived",
  COMPLETED: "Completed",
  DRAFT: "Draft",
  IN_PROGRESS: "In progress",
};

export function ProjectCard({ project }: { project: Project }) {
  return (
    <Link
      className="group block rounded-[1.25rem] border border-border bg-card/80 p-5 shadow-xl shadow-black/5 backdrop-blur-xl transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/10"
      href={`/projects/${project.id}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-primary">{project.eventCategory}</p>
          <h3 className="mt-3 font-serif text-3xl leading-none">{project.name}</h3>
        </div>
        <Badge>{statusLabels[project.status]}</Badge>
      </div>
      <p className="mt-8 flex items-center gap-2 text-sm text-muted-foreground">
        <CalendarDays className="size-4" aria-hidden="true" />
        Last updated {new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(new Date(project.updatedAt))}
      </p>
    </Link>
  );
}
