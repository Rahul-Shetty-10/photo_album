"use client";

import {
  Aperture,
  ArrowRight,
  Building2,
  Check,
  ChevronDown,
  Download,
  Images,
  Layers3,
  Palette,
  Sparkles,
  Users,
} from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/features/auth/auth-provider";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Features", href: "#features" },
  { label: "Workflow", href: "#workflow" },
];

const heroImage =
  "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=2200&q=90";

const categoryImages = [
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1504609813442-a8924e83f76e?auto=format&fit=crop&w=900&q=85",
];

const categories = [
  { title: "Weddings", type: "Personal", image: categoryImages[2] },
  { title: "Portraits", type: "Personal", image: categoryImages[0] },
  { title: "Couple Shoots", type: "Personal", image: categoryImages[1] },
  { title: "Family Events", type: "Personal", image: categoryImages[3] },
  { title: "Parties", type: "Personal", image: categoryImages[4] },
  { title: "Conferences", type: "Professional", image: categoryImages[5] },
  { title: "Seminars", type: "Professional", image: categoryImages[6] },
  { title: "Corporate Events", type: "Professional", image: categoryImages[7] },
  { title: "Sports", type: "Professional", image: categoryImages[8] },
  { title: "Cultural Events", type: "Professional", image: categoryImages[9] },
];

const features = [
  {
    icon: Sparkles,
    title: "AI-assisted Photo Enhancement",
    text: "Refine light, mood, styling, and image clarity while keeping the photographer's intent at the center.",
  },
  {
    icon: Images,
    title: "Intelligent Album Creation",
    text: "Shape event stories into polished album directions with clear visual hierarchy and export-ready structure.",
  },
  {
    icon: Palette,
    title: "Theme-aware Editing",
    text: "Adapt color, atmosphere, wardrobe cues, and scene treatment to each event category.",
  },
  {
    icon: Users,
    title: "Relationship-aware Prompting",
    text: "Preserve subject priority, relationships, and group context for personal and professional events.",
  },
  {
    icon: Building2,
    title: "Professional Workflows",
    text: "Support studios documenting conferences, seminars, expert visits, corporate events, culture, and sports.",
  },
  {
    icon: Download,
    title: "High-resolution Export",
    text: "Prepare final imagery for client review, premium albums, social delivery, and print-focused handoff.",
  },
];

const workflow = [
  "Create Project",
  "Choose Event",
  "Add Subjects",
  "Define Relationships",
  "Choose Theme",
  "Choose Template",
  "Generate",
  "Review",
  "Export",
];

const reasons = [
  "Built for photographers, studios, and creative teams.",
  "Photography-first presentation with restrained AI language.",
  "Supports personal milestones and professional event coverage.",
  "Designed as a workflow platform ready for authentication in Phase 2.",
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
      <p className="text-xs uppercase tracking-[0.36em] text-primary/80">{eyebrow}</p>
      <h2 className="mt-5 font-serif text-5xl leading-[0.95] text-foreground sm:text-6xl lg:text-7xl">
        {title}
      </h2>
      <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
        {text}
      </p>
    </motion.div>
  );
}

function Hero() {
  const { isAuthenticated } = useAuth();
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 700], [0, 150]);
  const scale = useTransform(scrollY, [0, 700], [1, 1.08]);
  const primaryHref = isAuthenticated ? "/projects" : "/login";

  return (
    <section className="relative min-h-[100svh] overflow-hidden">
      <motion.img
        alt="Editorial professional photography workspace"
        className="absolute inset-0 h-full w-full object-cover"
        src={heroImage}
        style={{ y, scale }}
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(12,12,11,0.34),rgba(12,12,11,0.76)_72%,rgb(247,246,242)),linear-gradient(90deg,rgba(12,12,11,0.72),rgba(12,12,11,0.16)_62%)]" />
      <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-7xl flex-col justify-end px-6 pb-20 pt-32 sm:px-8 lg:pb-24">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-5xl"
        >
          <p className="text-xs uppercase tracking-[0.44em] text-white/75">
            Photography workflow platform
          </p>
          <h1 className="mt-7 max-w-5xl font-serif text-6xl leading-[0.86] text-white sm:text-7xl lg:text-9xl">
            Photography, elevated by intelligence.
          </h1>
          <p className="mt-8 max-w-2xl text-lg leading-8 text-white/82 sm:text-xl">
            ALANKAAR gives photographers and studios a modern workspace for creative direction, event-aware editing, album planning, and client-ready exports.
          </p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" className="px-7">
              <a href={primaryHref}>
                Explore Workflows <ArrowRight aria-hidden="true" />
              </a>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white/25 bg-white/8 px-7 text-white hover:bg-white/14 hover:text-white"
            >
              <a href="#categories">View Categories</a>
            </Button>
          </div>
        </motion.div>
      </div>
      <a
        aria-label="Scroll to categories"
        className="absolute bottom-7 left-1/2 z-10 grid -translate-x-1/2 place-items-center text-white/70 transition hover:text-white"
        href="#categories"
      >
        <ChevronDown className="size-6" aria-hidden="true" />
      </a>
    </section>
  );
}

export function LandingPage() {
  const { isAuthenticated, logout, user } = useAuth();
  const initials = user?.email.slice(0, 2).toUpperCase() ?? "AL";
  const primaryHref = isAuthenticated ? "/projects" : "/login";

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-[#11100e]/70 text-white backdrop-blur-2xl">
        <nav className="mx-auto flex h-18 max-w-7xl items-center justify-between px-6 sm:h-20 sm:px-8">
          <a href="/" className="font-serif text-3xl tracking-wide">
            ALANKAAR
          </a>
          <div className="hidden items-center gap-8 lg:flex">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-sm text-white/68 transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/35"
              >
                {item.label}
              </a>
            ))}
          </div>
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <Button asChild size="sm" variant="outline" className="hidden border-white/20 bg-white/8 text-white hover:text-white sm:inline-flex">
                <a href="/projects">Projects</a>
              </Button>
              <details className="group relative">
                <summary className="flex cursor-pointer list-none items-center gap-2 rounded-full border border-white/20 bg-white/8 px-2 py-1.5 text-sm text-white outline-none transition hover:bg-white/14 focus-visible:ring-2 focus-visible:ring-white/35">
                  <span className="grid size-8 place-items-center rounded-full bg-white text-xs font-semibold text-[#171614]">
                    {initials}
                  </span>
                  <span className="hidden max-w-32 truncate md:inline">{user?.email}</span>
                </summary>
                <div className="absolute right-0 mt-3 w-64 rounded-2xl border border-border bg-card p-2 text-foreground shadow-2xl shadow-black/20">
                  <div className="px-3 py-3">
                    <p className="text-xs uppercase tracking-[0.22em] text-primary">Signed in</p>
                    <p className="mt-2 truncate text-sm text-muted-foreground">{user?.email}</p>
                  </div>
                  <a className="block rounded-xl px-3 py-2 text-sm hover:bg-muted" href="/account">
                    Account
                  </a>
                  <button className="w-full rounded-xl px-3 py-2 text-left text-sm text-muted-foreground hover:bg-muted hover:text-foreground" onClick={() => void logout()} type="button">
                    Logout
                  </button>
                </div>
              </details>
            </div>
          ) : (
            <Button asChild size="sm" variant="outline" className="border-white/20 bg-white/8 text-white hover:text-white">
              <a href="/login">Sign In</a>
            </Button>
          )}
        </nav>
      </header>

      <main>
        <Hero />

        <section id="categories" className="px-6 py-24 sm:px-8 lg:py-32">
          <SectionHeading
            eyebrow="Supported photography"
            title="Personal stories and professional assignments, handled with the same care."
            text="ALANKAAR supports intimate portrait work, family celebrations, cultural documentation, corporate coverage, and sports-event storytelling."
          />
          <div className="mx-auto grid max-w-7xl gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {categories.map((category, index) => (
              <motion.article
                className="group relative min-h-[320px] overflow-hidden rounded-[1.25rem] border border-border bg-card text-white shadow-sm"
                initial="hidden"
                key={category.title}
                transition={{ delay: index * 0.035, duration: 0.55 }}
                variants={fadeUp}
                viewport={{ once: true, amount: 0.25 }}
                whileHover={{ y: -5 }}
                whileInView="show"
              >
                <img
                  alt={`${category.title} photography`}
                  className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
                  src={category.image}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/22 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-5">
                  <p className="text-xs uppercase tracking-[0.24em] text-white/62">{category.type}</p>
                  <h3 className="mt-3 font-serif text-3xl leading-none">{category.title}</h3>
                </div>
              </motion.article>
            ))}
          </div>
        </section>

        <section id="features" className="border-y border-border bg-[#fdfcf8] px-6 py-24 sm:px-8 lg:py-32">
          <SectionHeading
            eyebrow="Platform features"
            title="A complete creative workflow, not a prompt box."
            text="The product surface is designed around photography operations: selection, context, subject relationships, theme direction, templates, review, and delivery."
          />
          <div className="mx-auto grid max-w-7xl gap-4 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => {
              const Icon = feature.icon;

              return (
                <motion.article
                  className="rounded-[1.25rem] border border-border bg-card p-7 shadow-sm transition hover:-translate-y-1 hover:border-primary/45 hover:shadow-xl hover:shadow-black/5"
                  initial="hidden"
                  key={feature.title}
                  transition={{ delay: index * 0.05, duration: 0.55 }}
                  variants={fadeUp}
                  viewport={{ once: true, amount: 0.25 }}
                  whileInView="show"
                >
                  <Icon className="size-7 text-primary" aria-hidden="true" />
                  <h3 className="mt-8 font-serif text-3xl leading-tight">{feature.title}</h3>
                  <p className="mt-4 text-sm leading-6 text-muted-foreground">{feature.text}</p>
                </motion.article>
              );
            })}
          </div>
        </section>

        <section id="workflow" className="px-6 py-24 sm:px-8 lg:py-32">
          <SectionHeading
            eyebrow="Future workflow"
            title="From client brief to finished album direction."
            text="This visual map shows the intended product journey for Phase 2 and beyond. It is presentation only in this phase."
          />
          <div className="mx-auto max-w-6xl rounded-[1.5rem] border border-border bg-card p-5 shadow-xl shadow-black/5 sm:p-8">
            <div className="grid gap-3 md:grid-cols-3">
              {workflow.map((step, index) => (
                <motion.div
                  className="relative min-h-28 rounded-2xl border border-border bg-background p-5"
                  initial="hidden"
                  key={step}
                  transition={{ delay: index * 0.045, duration: 0.5 }}
                  variants={fadeUp}
                  viewport={{ once: true, amount: 0.25 }}
                  whileInView="show"
                >
                  <p className="text-xs uppercase tracking-[0.24em] text-primary/75">
                    {String(index + 1).padStart(2, "0")}
                  </p>
                  <h3 className="mt-5 font-serif text-3xl leading-none">{step}</h3>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section id="why" className="overflow-hidden bg-[#171614] px-6 py-24 text-white sm:px-8 lg:py-32">
          <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
            <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.35 }} variants={fadeUp}>
              <p className="text-xs uppercase tracking-[0.36em] text-white/54">Why ALANKAAR</p>
              <h2 className="mt-5 font-serif text-5xl leading-[0.95] sm:text-6xl lg:text-7xl">
                Built for the quiet discipline behind memorable photographs.
              </h2>
            </motion.div>
            <div className="grid gap-4 sm:grid-cols-2">
              {reasons.map((reason, index) => (
                <motion.div
                  className="rounded-[1.25rem] border border-white/10 bg-white/[0.04] p-6"
                  initial="hidden"
                  key={reason}
                  transition={{ delay: index * 0.06, duration: 0.55 }}
                  variants={fadeUp}
                  viewport={{ once: true, amount: 0.25 }}
                  whileInView="show"
                >
                  <Check className="size-5 text-primary" aria-hidden="true" />
                  <p className="mt-5 text-base leading-7 text-white/78">{reason}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-6 py-24 sm:px-8 lg:py-32">
          <div className="mx-auto grid max-w-7xl gap-8 border-y border-border py-16 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <p className="text-xs uppercase tracking-[0.36em] text-primary/80">Begin with direction</p>
              <h2 className="mt-5 max-w-4xl font-serif text-5xl leading-[0.95] sm:text-6xl">
                Open a workspace designed for photographers, not generic generation.
              </h2>
            </div>
            <Button asChild size="lg" className="w-fit px-8">
              <a href={primaryHref}>
                Start in ALANKAAR <ArrowRight aria-hidden="true" />
              </a>
            </Button>
          </div>
        </section>
      </main>

      <footer className="border-t border-border px-6 py-10 sm:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-serif text-3xl text-foreground">ALANKAAR</p>
            <p className="mt-2">AI-powered photography workflows for modern studios.</p>
          </div>
          <div className="flex items-center gap-4">
            <Aperture className="size-4" aria-hidden="true" />
            <Layers3 className="size-4" aria-hidden="true" />
            <span>Personal and professional photography</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
