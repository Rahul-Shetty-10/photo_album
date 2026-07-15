"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

import type { Project } from "@/features/projects/api";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <motion.div transition={{ duration: 0.22 }} whileHover={{ y: -6, scale: 1.01 }}>
      <Link
        className="group grid min-h-80 content-between rounded-lg border border-border bg-card p-6 shadow-xl shadow-black/5 backdrop-blur-xl transition hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/45"
        href={`/dashboard/${project.id}`}
      >
        <div>
          <p className="text-sm font-medium text-primary">{project.eventCategory}</p>
          <h3 className="mt-4 font-sans text-4xl leading-none">{project.name}</h3>
        </div>
        <div className="flex items-center justify-between gap-4 text-sm text-muted-foreground">
          <span>Open project</span>
          <span className="grid size-11 place-items-center rounded-full bg-primary text-primary-foreground transition group-hover:translate-x-1">
            <ArrowRight className="size-5" aria-hidden="true" />
          </span>
        </div>
      </Link>
    </motion.div>
  );
}
