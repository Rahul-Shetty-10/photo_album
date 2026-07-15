"use client";

import * as React from "react";
import { Aperture, Camera, ShieldCheck, Sparkles } from "lucide-react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

const sceneImages = [
  "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=2400&q=88",
  "https://images.unsplash.com/photo-1452587925148-ce544e77e70d?auto=format&fit=crop&w=2400&q=88",
  "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=2400&q=88",
];

const dustParticles = Array.from({ length: 18 }, (_, index) => ({
  delay: `${index * 0.72}s`,
  left: `${8 + ((index * 23) % 84)}%`,
  size: `${2 + (index % 4)}px`,
  top: `${12 + ((index * 31) % 74)}%`,
}));

export function AuthShell({
  children,
  eyebrow,
  title,
  text,
}: {
  children: React.ReactNode;
  eyebrow: string;
  title: string;
  text: string;
}) {
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const smoothX = useSpring(pointerX, { damping: 35, stiffness: 90 });
  const smoothY = useSpring(pointerY, { damping: 35, stiffness: 90 });
  const sceneX = useTransform(smoothX, [-0.5, 0.5], [-18, 18]);
  const sceneY = useTransform(smoothY, [-0.5, 0.5], [-12, 12]);
  const lightX = useTransform(smoothX, [-0.5, 0.5], ["18%", "82%"]);
  const lightY = useTransform(smoothY, [-0.5, 0.5], ["14%", "58%"]);

  const handlePointerMove = (event: React.PointerEvent<HTMLElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    pointerX.set((event.clientX - rect.left) / rect.width - 0.5);
    pointerY.set((event.clientY - rect.top) / rect.height - 0.5);
  };

  return (
    <main
      className="relative isolate min-h-screen overflow-hidden bg-[#0b0d12] px-5 py-5 text-white sm:px-8 sm:py-7"
      onPointerMove={handlePointerMove}
    >
      <div className="absolute inset-0 -z-30 bg-[#0b0d12]" />
      <motion.div className="absolute inset-[-4%] -z-20" style={{ x: sceneX, y: sceneY }}>
        {sceneImages.map((image, index) => (
          <div
            aria-hidden="true"
            className="auth-scene-frame absolute inset-0 bg-cover bg-center"
            key={image}
            style={{
              animationDelay: `${index * 7}s`,
              backgroundImage: `url(${image})`,
            }}
          />
        ))}
      </motion.div>
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(7,9,13,0.72),rgba(7,9,13,0.32)_42%,rgba(7,9,13,0.82)_72%,rgba(7,9,13,0.96)),linear-gradient(180deg,rgba(7,9,13,0.34),rgba(7,9,13,0.88))]" />
      <motion.div
        aria-hidden="true"
        className="absolute -z-10 h-80 w-80 rounded-full bg-primary/10 blur-3xl"
        style={{ left: lightX, top: lightY }}
      />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        {dustParticles.map((particle, index) => (
          <span
            className="auth-dust absolute rounded-full bg-white/30"
            key={index}
            style={{
              animationDelay: particle.delay,
              height: particle.size,
              left: particle.left,
              top: particle.top,
              width: particle.size,
            }}
          />
        ))}
      </div>

      <nav className="mx-auto flex max-w-[92rem] items-center justify-between" aria-label="Authentication navigation">
        <a className="flex items-center gap-3 text-2xl font-semibold tracking-tight text-white sm:text-3xl" href="/">
          <Aperture className="size-6 text-primary" aria-hidden="true" />
          ALANKAAR
        </a>
        <a className="rounded-lg border border-white/12 bg-white/[0.06] px-4 py-2 text-sm text-white/72 backdrop-blur-xl transition hover:border-primary/45 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/45" href="/">
          Home
        </a>
      </nav>

      <section className="mx-auto grid min-h-[calc(100vh-5.75rem)] max-w-[92rem] gap-9 py-10 lg:grid-cols-[minmax(0,1fr)_minmax(26rem,38rem)] lg:items-center lg:py-12">
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl pt-10 lg:pt-0"
          initial={{ opacity: 0, y: 22 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="inline-flex items-center gap-2 rounded-lg border border-white/14 bg-black/22 px-3 py-1.5 text-xs uppercase tracking-[0.12em] text-primary backdrop-blur-xl">
            <Sparkles className="size-3.5" aria-hidden="true" />
            {eyebrow}
          </div>
          <h1 className="mt-7 max-w-4xl text-6xl font-semibold leading-[0.88] tracking-tight text-white text-balance sm:text-7xl lg:text-8xl xl:text-9xl">
            {title}
          </h1>
          <p className="mt-7 max-w-xl text-base leading-7 text-white/78 sm:text-lg">{text}</p>
          <div className="mt-10 grid max-w-xl gap-3 sm:grid-cols-2">
            <div className="rounded-lg border border-white/12 bg-black/24 p-4 backdrop-blur-xl">
              <Camera className="size-5 text-primary" aria-hidden="true" />
              <p className="mt-4 text-sm leading-6 text-white/74">A private studio entry for photographers, projects, and crafted image direction.</p>
            </div>
            <div className="rounded-lg border border-white/12 bg-black/24 p-4 backdrop-blur-xl">
              <ShieldCheck className="size-5 text-primary" aria-hidden="true" />
              <p className="mt-4 text-sm leading-6 text-white/74">Secure session restoration with a quiet interface that stays out of the work.</p>
            </div>
          </div>
          <div className="mt-10 flex items-center gap-3 text-xs uppercase tracking-[0.12em] text-white/48">
            <span className="h-px w-12 bg-primary/70" />
            Editorial workspace
            <span className="size-1 rounded-full bg-white/35" />
            ALANKAAR
          </div>
        </motion.div>
        <motion.div
          animate={{ opacity: 1, x: 0, scale: 1 }}
          initial={{ opacity: 0, x: 22, scale: 0.98 }}
          transition={{ delay: 0.12, duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
        >
          {children}
        </motion.div>
      </section>
    </main>
  );
}
