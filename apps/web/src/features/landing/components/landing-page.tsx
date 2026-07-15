"use client";

import * as React from "react";
import {
  Aperture,
  ArrowRight,
  Check,
  ChevronDown,
  Download,
  Fingerprint,
  Images,
  Layers3,
  Palette,
  Sparkles,
  Upload,
  WandSparkles,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/features/auth/auth-provider";

const navItems = [
  { label: "Process", href: "#workflow" },
  { label: "Categories", href: "#categories" },
  { label: "Gallery", href: "#gallery" },
  { label: "Features", href: "#features" },
  { label: "FAQ", href: "#faq" },
];

const heroSlides = [
  {
    label: "Beach Wedding",
    title: "Coastal vows, shaped into cinematic albums.",
    subtitle: "Plan, enhance, sequence, and deliver wedding galleries with a workflow built for careful photographers.",
    image: "/landing/beach-wedding.png",
  },
  {
    label: "North Indian Wedding",
    title: "Palace grandeur with modern album discipline.",
    subtitle: "Bring ceremony, attire, family, and venue context into one polished visual direction.",
    image: "/landing/north-indian-wedding.png",
  },
  {
    label: "South Indian Wedding",
    title: "Silk, garlands, jewellery, and sacred detail.",
    subtitle: "Preserve cultural nuance while building elegant, consistent album stories across every ritual.",
    image: "/landing/south-indian-wedding.png",
  },
  {
    label: "Christian Wedding",
    title: "Aisle light and white florals, composed with restraint.",
    subtitle: "Guide ceremony, vows, portraits, and reception moments into a refined wedding story.",
    image: "/landing/beach-wedding.png",
  },
  {
    label: "Muslim Wedding",
    title: "Nikah elegance, family warmth, and luminous detail.",
    subtitle: "Honor attire, rituals, portraits, and celebration ambience with a calm creative flow.",
    image: "/landing/muslim-wedding.png",
  },
  {
    label: "Reception",
    title: "Reception evenings with polished gallery rhythm.",
    subtitle: "Shape entrances, stage moments, candid laughter, and family portraits into client-ready sets.",
    image: "/alankar-hero-preview.png",
  },
  {
    label: "Haldi",
    title: "Haldi color, joy, and movement with premium control.",
    subtitle: "Keep yellows, skin tones, gestures, and family energy vibrant without losing elegance.",
    image: "/landing/haldi.png",
  },
  {
    label: "Mehendi",
    title: "Mehendi detail and celebration, sequenced beautifully.",
    subtitle: "Balance hands, decor, portraits, rituals, and candid moments in a refined album direction.",
    image: "/landing/mehendi.png",
  },
];

const gallery = [
  { title: "Coastal Vows", label: "Beach", image: heroSlides[0].image },
  { title: "Royal Procession", label: "North", image: heroSlides[1].image },
  { title: "Silk and Garlands", label: "South", image: heroSlides[2].image },
  { title: "Aisle Portrait", label: "Christian", image: heroSlides[3].image },
  { title: "Nikah Detail", label: "Muslim", image: heroSlides[4].image },
  { title: "Reception Glow", label: "Reception", image: heroSlides[5].image },
];

const features = [
  {
    icon: Fingerprint,
    title: "Identity Preservation",
    text: "Keep subjects recognizable while refining light, mood, styling, and atmosphere across a full assignment.",
  },
  {
    icon: Palette,
    title: "Event-aware Direction",
    text: "Tune visual treatment for weddings, portraits, families, conferences, corporate stories, and sport.",
  },
  {
    icon: Images,
    title: "Album Intelligence",
    text: "Organize standout frames, supporting details, and narrative rhythm into polished album-ready flows.",
  },
  {
    icon: Sparkles,
    title: "Premium Enhancement",
    text: "Bring cinematic clarity to ordinary uploads while preserving the photographer's editorial intent.",
  },
  {
    icon: Layers3,
    title: "Template-led Stories",
    text: "Move from image sets to structured spreads with hierarchy, pacing, and client-friendly review.",
  },
  {
    icon: Download,
    title: "Client-ready Export",
    text: "Prepare high-resolution images for albums, review links, social delivery, and studio handoff.",
  },
];

const workflow = [
  {
    icon: Upload,
    title: "Upload Photo Sets",
    text: "Begin with clear event, portrait, family, product, or action photographs from the assignment.",
  },
  {
    icon: Palette,
    title: "Choose Category",
    text: "Select the visual world, mood, cultural context, and album direction for the project.",
  },
  {
    icon: WandSparkles,
    title: "AI Builds Direction",
    text: "ALANKAAR studies subject priority, scene context, lighting, and storytelling needs.",
  },
  {
    icon: Download,
    title: "Review and Export",
    text: "Shape the final gallery or album sequence, then prepare client-ready delivery.",
  },
];

const faqs = [
  {
    question: "Is ALANKAAR only for weddings?",
    answer: "No. The landing page emphasizes wedding styles, while the authenticated studio supports personal, portrait, family, corporate, conference, movie, sports, fashion, and product workflows.",
  },
  {
    question: "Does this change authentication or projects?",
    answer: "No. Login, register, dashboard, authentication, project flows, and backend behavior remain untouched.",
  },
  {
    question: "Who is it for?",
    answer: "Photographers, studios, and creative teams who need a polished workflow around photo selection, direction, enhancement, album planning, and delivery.",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0 },
};

function SectionHeading({
  eyebrow,
  title,
  text,
}: {
  eyebrow: string;
  title: string;
  text: string;
}) {
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.35 }}
      variants={fadeUp}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="mx-auto mb-14 max-w-4xl text-center"
    >
      <p className="text-xs uppercase tracking-[0.12em] text-[#2dd4bf]">{eyebrow}</p>
      <h2 className="mt-5 font-sans text-5xl leading-[0.9] text-[#f8fafc] sm:text-6xl lg:text-7xl">
        {title}
      </h2>
      <p className="mx-auto mt-6 max-w-2xl text-sm leading-7 text-[#cbd5e1]/82 sm:text-base">{text}</p>
    </motion.div>
  );
}

function Hero() {
  const { isAuthenticated } = useAuth();
  const [activeIndex, setActiveIndex] = React.useState(0);
  const primaryHref = isAuthenticated ? "/dashboard" : "/login";
  const activeSlide = heroSlides[activeIndex];

  React.useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % heroSlides.length);
    }, 5200);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <section className="relative min-h-[100svh] overflow-hidden border-b border-white/10 bg-[#0b0d12]">
      <AnimatePresence mode="wait">
        <motion.img
          key={activeSlide.image}
          alt={`${activeSlide.label} photography`}
          className="absolute inset-0 h-full w-full object-cover"
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1.12 }}
          exit={{ opacity: 0 }}
          transition={{ opacity: { duration: 1.2, ease: "easeInOut" }, scale: { duration: 6.2, ease: "easeOut" } }}
          src={activeSlide.image}
        />
      </AnimatePresence>
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,9,13,0.24),rgba(7,9,13,0.72)_72%,#0b0d12),linear-gradient(90deg,rgba(7,9,13,0.72),rgba(7,9,13,0.08)_50%,rgba(7,9,13,0.76))]" />
      <div className="absolute inset-x-[14%] top-0 hidden h-full border-x border-white/[0.08] lg:block" />

      <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-7xl flex-col items-center justify-center px-6 pb-16 pt-32 text-center sm:px-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSlide.label}
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -18 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-6xl"
          >
            <p className="text-xs uppercase tracking-[0.14em] text-[#2dd4bf]">{activeSlide.label}</p>
            <h1 className="mx-auto mt-8 max-w-5xl font-sans text-5xl leading-[0.88] text-[#f8fafc] sm:text-6xl lg:text-[5.9rem] xl:text-[6.7rem]">
              {activeSlide.title}
            </h1>
            <p className="mx-auto mt-8 max-w-3xl text-lg leading-8 text-[#e2e8f0]/86 sm:text-2xl">{activeSlide.subtitle}</p>
          </motion.div>
        </AnimatePresence>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Button asChild size="lg" className="bg-primary px-8 text-primary-foreground hover:bg-primary/90">
            <a href={primaryHref}>
              Start in ALANKAAR <ArrowRight aria-hidden="true" />
            </a>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="border-white/25 bg-black/15 px-8 text-white hover:bg-white/10 hover:text-white"
          >
            <a href="#gallery">Explore Gallery</a>
          </Button>
        </div>

        <div className="mt-12 flex max-w-4xl flex-wrap justify-center gap-2">
          {heroSlides.map((slide, index) => (
            <button
              key={slide.label}
              type="button"
              aria-label={`Show ${slide.label}`}
              onClick={() => setActiveIndex(index)}
              className={`h-1.5 rounded-full transition-all ${index === activeIndex ? "w-10 bg-[#2dd4bf]" : "w-5 bg-white/28 hover:bg-white/45"}`}
            />
          ))}
        </div>
      </div>

      <a
        aria-label="Scroll to process"
        className="absolute bottom-7 left-1/2 z-10 grid -translate-x-1/2 place-items-center gap-2 text-xs uppercase tracking-[0.12em] text-white/65 transition hover:text-white"
        href="#workflow"
      >
        Scroll
        <ChevronDown className="size-5" aria-hidden="true" />
      </a>
    </section>
  );
}

function BeforeAfterSlider() {
  const [position, setPosition] = React.useState(54);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const image = heroSlides[6].image;

  const updatePosition = React.useCallback((clientX: number) => {
    const bounds = containerRef.current?.getBoundingClientRect();

    if (!bounds) {
      return;
    }

    const nextPosition = ((clientX - bounds.left) / bounds.width) * 100;
    setPosition(Math.min(92, Math.max(8, nextPosition)));
  }, []);

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.buttons !== 1) {
      return;
    }

    updatePosition(event.clientX);
  };

  return (
    <div
      ref={containerRef}
      className="relative mx-auto max-w-5xl overflow-hidden rounded-lg border border-white/12 bg-white/[0.055] shadow-xl shadow-black/20"
      onPointerDown={(event) => {
        event.currentTarget.setPointerCapture(event.pointerId);
        updatePosition(event.clientX);
      }}
      onPointerMove={handlePointerMove}
    >
      <div className="relative aspect-[16/9] min-h-[360px] select-none overflow-hidden">
        <img
          className="absolute inset-0 h-full w-full object-cover saturate-[0.62] contrast-90 brightness-90"
          src={image}
          alt="Original Haldi ceremony photograph before enhancement"
          draggable={false}
        />
        <div
          className="absolute inset-y-0 left-0 overflow-hidden"
          style={{ width: `${position}%` }}
        >
          <img
            className="h-full w-[min(80rem,calc(100vw-3rem))] max-w-none object-cover brightness-110 contrast-110 saturate-125"
            src={image}
            alt="Enhanced Haldi ceremony photograph after ALANKAAR processing"
            draggable={false}
          />
        </div>

        <span className="absolute left-5 top-5 z-10 rounded-lg bg-black/60 px-4 py-2 text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-white">
          After
        </span>
        <span className="absolute right-5 top-5 z-10 rounded-lg bg-black/60 px-4 py-2 text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-white">
          Before
        </span>

        <div
          className="absolute inset-y-0 z-20 w-px bg-white"
          style={{ left: `${position}%` }}
        >
          <div className="absolute left-1/2 top-1/2 grid size-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-white/50 bg-[#0b0d12]/80 text-white shadow-xl shadow-black/30 backdrop-blur">
            <span className="h-5 w-px bg-white/80" />
          </div>
        </div>

        <input
          aria-label="Compare before and after image"
          className="absolute inset-x-6 bottom-6 z-30 h-2 cursor-ew-resize appearance-none rounded-full bg-white/24 accent-primary"
          max={92}
          min={8}
          onChange={(event) => setPosition(Number(event.target.value))}
          type="range"
          value={position}
        />
      </div>
    </div>
  );
}

export function LandingPage() {
  const { isAuthenticated, logout, user } = useAuth();
  const initials = user?.email.slice(0, 2).toUpperCase() ?? "AL";
  const primaryHref = isAuthenticated ? "/dashboard" : "/login";

  return (
    <div className="min-h-screen bg-[#0b0d12] text-[#f8fafc]">
      <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-[#0f1218]/82 text-white backdrop-blur-2xl">
        <nav className="mx-auto flex h-18 max-w-7xl items-center justify-between px-6 sm:h-20 sm:px-8">
          <a href="/" className="font-sans text-3xl tracking-tight">
            ALANKAAR
          </a>
          <div className="hidden items-center gap-8 lg:flex">
            {navItems.map((item) => (
              <a key={item.href} href={item.href} className="text-sm text-white/62 transition hover:text-white">
                {item.label}
              </a>
            ))}
          </div>
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <Button asChild size="sm" variant="outline" className="hidden border-white/20 bg-white/8 text-white hover:text-white sm:inline-flex">
                <a href="/dashboard">Dashboard</a>
              </Button>
              <details className="group relative">
                <summary className="flex cursor-pointer list-none items-center gap-2 rounded-full border border-white/20 bg-white/8 px-2 py-1.5 text-sm text-white outline-none transition hover:bg-white/14 focus-visible:ring-2 focus-visible:ring-white/35">
                  <span className="grid size-8 place-items-center rounded-full bg-white text-xs font-semibold text-[#171614]">{initials}</span>
                  <span className="hidden max-w-32 truncate md:inline">{user?.email}</span>
                </summary>
                <div className="absolute right-0 mt-3 w-64 rounded-2xl border border-white/10 bg-[#111827] p-2 text-[#f8fafc] shadow-2xl shadow-black/40">
                  <div className="px-3 py-3">
                    <p className="text-xs uppercase tracking-[0.12em] text-[#2dd4bf]">Signed in</p>
                    <p className="mt-2 truncate text-sm text-white/62">{user?.email}</p>
                  </div>
                  <a className="block rounded-xl px-3 py-2 text-sm hover:bg-white/8" href="/dashboard/profile">
                    Profile
                  </a>
                  <button className="w-full rounded-xl px-3 py-2 text-left text-sm text-white/60 hover:bg-white/8 hover:text-white" onClick={() => void logout()} type="button">
                    Logout
                  </button>
                </div>
              </details>
            </div>
          ) : (
            <Button asChild size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
              <a href="/login">Login</a>
            </Button>
          )}
        </nav>
      </header>

      <main>
        <Hero />

        <section id="workflow" className="px-6 py-24 sm:px-8 lg:py-32">
          <SectionHeading
            eyebrow="How ALANKAAR Works"
            title="A calm, cinematic path from brief to delivery."
            text="The experience feels like entering a private production studio: organized, precise, and tuned for photographers."
          />
          <div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-2 lg:grid-cols-4">
            {workflow.map((step, index) => {
              const Icon = step.icon;

              return (
                <motion.article
                  key={step.title}
                  className="rounded-lg border border-white/12 bg-white/[0.055] p-7 shadow-xl shadow-black/10"
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, amount: 0.25 }}
                  variants={fadeUp}
                  transition={{ delay: index * 0.06, duration: 0.55 }}
                >
                  <p className="font-sans text-5xl font-semibold text-[#64748b]/75">{String(index + 1).padStart(2, "0")}</p>
                  <Icon className="mt-8 size-6 text-[#2dd4bf]" aria-hidden="true" />
                  <h3 className="mt-5 font-sans text-3xl leading-tight">{step.title}</h3>
                  <p className="mt-4 text-sm leading-6 text-[#cbd5e1]/72">{step.text}</p>
                </motion.article>
              );
            })}
          </div>
        </section>

        <section id="categories" className="px-6 pb-24 sm:px-8 lg:pb-32">
          <SectionHeading
            eyebrow="Photography Categories"
            title="Every assignment imagined with restraint and reverence."
            text="Choose a visual direction that honors the mood, people, pace, and purpose of the shoot."
          />
          <div className="mx-auto grid max-w-7xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {heroSlides.slice(0, 9).map((category, index) => (
              <motion.article
                key={category.label}
                className="group relative min-h-[270px] overflow-hidden rounded-lg border border-white/12 bg-white/[0.055]"
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.25 }}
                variants={fadeUp}
                transition={{ delay: index * 0.035, duration: 0.55 }}
                whileHover={{ y: -5 }}
              >
                <img className="absolute inset-0 h-full w-full object-cover opacity-82 transition duration-700 group-hover:scale-105" src={category.image} alt={`${category.label} category`} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/88 via-black/18 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6">
                  <h3 className="font-sans text-3xl leading-none">{category.label}</h3>
                  <p className="mt-3 max-w-md text-sm leading-6 text-white/68">{category.subtitle}</p>
                </div>
              </motion.article>
            ))}
          </div>
        </section>

        <section className="px-6 py-10 sm:px-8">
          <BeforeAfterSlider />
        </section>

        <section id="gallery" className="px-6 py-24 sm:px-8 lg:py-32">
          <SectionHeading
            eyebrow="Gallery"
            title="Photographs with the stillness of heirlooms."
            text="A masonry-inspired gallery for personal milestones, editorial portraits, and professional event stories."
          />
          <div className="mx-auto grid max-w-7xl gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {gallery.map((item, index) => (
              <motion.article
                key={item.title}
                className={`group relative overflow-hidden rounded-lg border border-white/12 bg-white/[0.055] ${index === 1 || index === 4 ? "lg:translate-y-10" : ""}`}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.25 }}
                variants={fadeUp}
                transition={{ delay: index * 0.06, duration: 0.55 }}
              >
                <div className="border-b border-white/12 bg-white/[0.05] px-5 py-3 text-xs uppercase tracking-[0.12em] text-white/46">{item.label}</div>
                <div className="relative aspect-[4/5] overflow-hidden">
                  <img className="h-full w-full object-cover transition duration-700 group-hover:scale-105" src={item.image} alt={`${item.title} photography`} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/84 via-transparent to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 flex items-center justify-between p-5">
                    <h3 className="font-sans text-3xl">{item.title}</h3>
                    <span className="rounded-lg border border-primary/45 px-3 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.12em] text-primary">ALANKAAR</span>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </section>

        <section id="features" className="px-6 py-24 sm:px-8 lg:py-32">
          <SectionHeading
            eyebrow="Features"
            title="Built for photographs, tuned for precision."
            text="Every detail supports a luxury creative flow: speed, privacy, consistency, high resolution, and identity-aware direction."
          />
          <div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => {
              const Icon = feature.icon;

              return (
                <motion.article
                  key={feature.title}
                  className="rounded-lg border border-white/12 bg-white/[0.055] p-7"
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, amount: 0.25 }}
                  variants={fadeUp}
                  transition={{ delay: index * 0.05, duration: 0.55 }}
                >
                  <Icon className="size-7 text-[#2dd4bf]" aria-hidden="true" />
                  <h3 className="mt-8 font-sans text-3xl leading-tight">{feature.title}</h3>
                  <p className="mt-4 text-sm leading-6 text-[#cbd5e1]/72">{feature.text}</p>
                </motion.article>
              );
            })}
          </div>
        </section>

        <section id="faq" className="px-6 py-24 sm:px-8 lg:py-32">
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <p className="text-xs uppercase tracking-[0.12em] text-[#2dd4bf]">FAQ</p>
              <h2 className="mt-5 font-sans text-5xl leading-[0.9] text-[#f8fafc] sm:text-6xl">A broader platform, same premium promise.</h2>
            </div>
            <div className="grid gap-4">
              {faqs.map((faq) => (
                <details key={faq.question} className="rounded-lg border border-white/12 bg-white/[0.055] p-6">
                  <summary className="cursor-pointer list-none font-sans text-2xl">{faq.question}</summary>
                  <p className="mt-4 text-sm leading-7 text-[#cbd5e1]/74">{faq.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="px-6 pb-24 sm:px-8 lg:pb-32">
          <div className="mx-auto grid max-w-7xl gap-8 border-y border-white/12 py-16 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <p className="text-xs uppercase tracking-[0.12em] text-[#2dd4bf]">Begin with direction</p>
              <h2 className="mt-5 max-w-4xl font-sans text-5xl leading-[0.92] text-[#f8fafc] sm:text-6xl">
                Open a workspace designed for photographers, not generic generation.
              </h2>
            </div>
            <Button asChild size="lg" className="w-fit bg-primary px-8 text-primary-foreground hover:bg-primary/90">
              <a href={primaryHref}>
                Start in ALANKAAR <ArrowRight aria-hidden="true" />
              </a>
            </Button>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/10 px-6 py-10 sm:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 text-sm text-[#cbd5e1]/66 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-sans text-3xl text-[#f8fafc]">ALANKAAR</p>
            <p className="mt-2">AI-powered photography workflows for modern studios.</p>
          </div>
          <div className="flex items-center gap-4">
            <Aperture className="size-4" aria-hidden="true" />
            <Check className="size-4" aria-hidden="true" />
            <span>Personal and professional photography</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
