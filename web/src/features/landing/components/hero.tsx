"use client";

import Image from "next/image";
import { ArrowRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

import { AnimatedGradient } from "@/components/design/animated-gradient";
import { GlassCard } from "@/components/design/glass-card";
import { UploadDropzone } from "@/components/design/upload-dropzone";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

export function Hero() {
  return (
    <section
      id="top"
      className="relative isolate flex min-h-screen items-center overflow-hidden px-6 pb-20 pt-32 sm:px-8"
    >
      <AnimatedGradient />
      <div className="mx-auto grid w-full max-w-7xl items-center gap-14 lg:grid-cols-[1fr_0.92fr]">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <Badge>AI wedding portrait studio</Badge>
          <h1 className="mt-7 max-w-4xl font-serif text-6xl leading-[0.95] tracking-tight text-foreground sm:text-7xl lg:text-8xl">
            Create Cinematic Wedding Memories with AI
          </h1>
          <p className="mt-7 max-w-2xl text-lg leading-8 text-muted-foreground sm:text-xl">
            Transform ordinary couple photos into breathtaking wedding portraits in minutes.
          </p>
          <div className="mt-9 flex flex-col gap-4 sm:flex-row">
            <Button asChild size="lg">
              <a href="#create">
                Start Creating
                <ArrowRight aria-hidden="true" />
              </a>
            </Button>
            <Button asChild size="lg" variant="outline">
              <a href="#styles">See Examples</a>
            </Button>
          </div>
          <dl className="mt-12 grid max-w-xl grid-cols-3 gap-4 border-t border-white/10 pt-8">
            {[
              ["4K", "portrait export"],
              ["10+", "wedding styles"],
              ["Minutes", "to preview"],
            ].map(([value, label]) => (
              <div key={label}>
                <dt className="font-serif text-3xl text-primary">{value}</dt>
                <dd className="mt-1 text-xs leading-5 text-muted-foreground">
                  {label}
                </dd>
              </div>
            ))}
          </dl>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 0.12, duration: 0.75, ease: "easeOut" }}
          className="relative"
        >
          <GlassCard className="relative overflow-hidden p-3">
            <div className="absolute inset-x-8 top-8 z-10 flex items-center justify-between rounded-full border border-white/10 bg-background/55 px-4 py-2 backdrop-blur-xl">
              <span className="text-xs text-muted-foreground">ViWaah Studio</span>
              <span className="flex items-center gap-2 text-xs text-primary">
                <Sparkles className="size-3.5" aria-hidden="true" />
                Cinematic
              </span>
            </div>
            <Image
              src="/viwaah-hero-preview.png"
              alt="Cinematic AI-generated wedding portrait preview of a couple"
              width={1536}
              height={1024}
              priority
              className="aspect-[4/5] rounded-[1.5rem] object-cover sm:aspect-[5/4] lg:aspect-[4/5]"
            />
            <div className="absolute inset-x-6 bottom-6">
              <GlassCard className="p-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      Identity preserved
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Wedding look composed from source portraits
                    </p>
                  </div>
                  <span className="rounded-full bg-primary/15 px-3 py-1 text-xs text-primary">
                    92%
                  </span>
                </div>
                <Progress className="mt-4" value={92} />
              </GlassCard>
            </div>
          </GlassCard>
          <div className="absolute -bottom-10 -left-6 hidden w-72 xl:block">
            <UploadDropzone />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
