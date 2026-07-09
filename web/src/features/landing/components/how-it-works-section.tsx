"use client";

import { motion } from "framer-motion";

import { GlassCard } from "@/components/design/glass-card";
import { Section } from "@/components/design/section";

const steps = [
  {
    title: "Upload Photos",
    description: "Add clear couple portraits with visible faces and natural expressions.",
  },
  {
    title: "Choose Style",
    description: "Select a wedding aesthetic, ceremony mood, and portrait direction.",
  },
  {
    title: "Generate",
    description: "Preview cinematic compositions while preserving identity and warmth.",
  },
  {
    title: "Download",
    description: "Export polished portraits ready for announcements, albums, and keepsakes.",
  },
];

export function HowItWorksSection() {
  return (
    <Section
      id="process"
      eyebrow="Workflow"
      title="From everyday photo to wedding portrait"
      description="The product journey stays simple enough for couples and precise enough for serious creative control."
    >
      <div className="grid gap-5 lg:grid-cols-4">
        {steps.map((step, index) => (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ delay: index * 0.08, duration: 0.45 }}
            key={step.title}
          >
            <GlassCard className="relative h-full p-6">
              <div className="mb-8 flex size-12 items-center justify-center rounded-full border border-primary/20 bg-primary/10 font-serif text-2xl text-primary">
                {index + 1}
              </div>
              <h3 className="font-serif text-2xl text-foreground">{step.title}</h3>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                {step.description}
              </p>
            </GlassCard>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
