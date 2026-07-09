"use client";

import { motion } from "framer-motion";

import { GlassCard } from "@/components/design/glass-card";
import { Section } from "@/components/design/section";

const weddingStyles = [
  "Royal",
  "Traditional",
  "Temple",
  "Beach",
  "Reception",
  "Palace",
  "South Indian",
  "North Indian",
  "Christian",
  "Muslim",
];

export function StylesSection() {
  return (
    <Section
      id="styles"
      eyebrow="Wedding styles"
      title="Cultural range without a costume-box feel"
      description="Each style is presented as a creative direction for portraits, not a generic wedding template."
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {weddingStyles.map((style, index) => (
          <motion.div
            key={style}
            whileHover={{ y: -5 }}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ delay: index * 0.035, duration: 0.35 }}
          >
            <GlassCard className="group relative overflow-hidden p-5">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/15 via-transparent to-accent/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <div className="relative">
                <p className="font-serif text-2xl text-foreground">{style}</p>
                <p className="mt-3 text-xs leading-5 text-muted-foreground">
                  Cinematic portrait direction
                </p>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
