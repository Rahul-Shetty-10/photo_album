"use client";

import type { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";

import { GlassCard } from "@/components/design/glass-card";

type FeatureCardProps = {
  icon: LucideIcon;
  title: string;
  description: string;
};

export function FeatureCard({ icon: Icon, title, description }: FeatureCardProps) {
  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.01 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
    >
      <GlassCard className="h-full p-6">
        <div className="flex size-11 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-primary">
          <Icon className="size-5" aria-hidden="true" />
        </div>
        <h3 className="mt-6 font-serif text-2xl text-foreground">{title}</h3>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          {description}
        </p>
      </GlassCard>
    </motion.div>
  );
}
