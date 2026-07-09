"use client";

import {
  Aperture,
  Fingerprint,
  Gauge,
  ImageUpscale,
  Palette,
} from "lucide-react";

import { Section } from "@/components/design/section";
import { FeatureCard } from "@/features/landing/components/feature-card";

const features = [
  {
    icon: Aperture,
    title: "AI Image Editing",
    description:
      "Turn casual phone photos into editorial wedding portraits with balanced lighting, attire, and composition.",
  },
  {
    icon: Fingerprint,
    title: "Identity Preservation",
    description:
      "Designed around face consistency, so the final image still feels like the real couple.",
  },
  {
    icon: Palette,
    title: "Multiple Wedding Styles",
    description:
      "Explore refined cultural, venue, and ceremony aesthetics without rebuilding the shoot from scratch.",
  },
  {
    icon: ImageUpscale,
    title: "High Resolution",
    description:
      "Prepare polished portraits for announcements, albums, prints, and social launches.",
  },
  {
    icon: Gauge,
    title: "Fast Generation",
    description:
      "Move from upload to styled preview in minutes, with a workflow built for iteration.",
  },
];

export function FeaturesSection() {
  return (
    <Section
      id="features"
      eyebrow="Capabilities"
      title="A compact studio for impossible wedding shoots"
      description="ViWaah focuses on the product surface: upload, style, preview, refine, and export."
    >
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {features.map((feature) => (
          <FeatureCard key={feature.title} {...feature} />
        ))}
      </div>
    </Section>
  );
}
