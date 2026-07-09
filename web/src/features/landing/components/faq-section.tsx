"use client";

import { Plus } from "lucide-react";
import { motion } from "framer-motion";

import { GlassCard } from "@/components/design/glass-card";
import { Section } from "@/components/design/section";

const faqs = [
  {
    question: "Is ViWaah a wedding planning website?",
    answer:
      "No. ViWaah is an AI SaaS product for transforming couple photos into professional wedding portraits.",
  },
  {
    question: "Does the product generate real wedding photos?",
    answer:
      "The interface is designed for AI-created portraits from uploaded couple photos. This frontend does not implement generation or backend workflows.",
  },
  {
    question: "Can couples choose cultural styles?",
    answer:
      "Yes. The design system supports style selection for royal, traditional, temple, beach, reception, palace, South Indian, North Indian, Christian, and Muslim directions.",
  },
  {
    question: "What matters most in the upload?",
    answer:
      "Clear source portraits with visible faces, balanced lighting, and natural expressions create the best foundation for identity-preserving edits.",
  },
];

export function FaqSection() {
  return (
    <Section
      id="faq"
      eyebrow="FAQ"
      title="Built for a focused AI product"
      description="The frontend keeps the promise clear: premium wedding portraits from ordinary couple photos."
    >
      <div className="mx-auto grid max-w-4xl gap-4">
        {faqs.map((faq, index) => (
          <motion.div
            key={faq.question}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.45 }}
            transition={{ delay: index * 0.05, duration: 0.35 }}
          >
            <GlassCard>
              <details className="group">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 p-6 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40">
                  <span className="font-serif text-xl text-foreground">
                    {faq.question}
                  </span>
                  <Plus className="size-5 shrink-0 text-primary transition-transform group-open:rotate-45" />
                </summary>
                <p className="px-6 pb-6 text-sm leading-6 text-muted-foreground">
                  {faq.answer}
                </p>
              </details>
            </GlassCard>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
