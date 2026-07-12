"use client";

import Image from "next/image";
import {
  ArrowRight,
  Check,
  ChevronDown,
  Crown,
  Download,
  Fingerprint,
  Images,
  Lock,
  Palette,
  Upload,
  WandSparkles,
  Zap,
} from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useState } from "react";

import { Button } from "@/components/ui/button";

const navItems = [
  { label: "Process", href: "#process" },
  { label: "Themes", href: "#themes" },
  { label: "Gallery", href: "#gallery" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
];

const steps = [
  {
    icon: Upload,
    title: "Upload Bride & Groom Photos",
    text: "Begin with clear portraits. ALANKAR studies facial identity, expression, and light before styling the scene.",
  },
  {
    icon: Palette,
    title: "Choose Wedding Theme",
    text: "Select a ceremony mood, wardrobe language, venue atmosphere, and cultural direction.",
  },
  {
    icon: WandSparkles,
    title: "AI Generates Wedding Portraits",
    text: "The studio composes cinematic portraits with refined styling, warm skin tones, and album-ready detail.",
  },
  {
    icon: Download,
    title: "Download Your Album",
    text: "Export polished portraits for invitations, keepsakes, announcements, and your private gallery.",
  },
];

const themes = [
  "Royal Palace",
  "South Indian",
  "North Indian",
  "Beach Wedding",
  "Garden Wedding",
  "Christian Wedding",
  "Muslim Wedding",
  "Reception",
];

const features = [
  { icon: Fingerprint, title: "Identity Preservation", text: "Portraits are guided by the couple's real facial details and natural expression." },
  { icon: Crown, title: "AI Wedding Styling", text: "Attire, jewelry, backdrop, florals, and lighting are composed as one elegant frame." },
  { icon: Images, title: "High Resolution", text: "Designed for premium albums, framed prints, wedding sites, and social announcements." },
  { icon: Zap, title: "Fast Generation", text: "Move from upload to cinematic preview in seconds, then refine the mood instantly." },
  { icon: Palette, title: "Multiple Themes", text: "Explore cultural ceremonies, venue styles, and reception looks without reshoots." },
  { icon: Lock, title: "Secure Uploads", text: "Private photos are handled with a product flow built around trust and discretion." },
];

const gallery = [
  { title: "Sangeet Glow", size: "md:row-span-2" },
  { title: "Palace Vows", size: "" },
  { title: "Coastal Ceremony", size: "md:row-span-2" },
  { title: "Garden Portrait", size: "" },
  { title: "Cathedral Light", size: "" },
  { title: "Reception Night", size: "" },
];

const testimonials = [
  {
    quote:
      "It felt like seeing our wedding mood board become real before the actual shoot. The portraits looked emotional, not artificial.",
    name: "Aarav & Meera",
  },
  {
    quote:
      "The styling had the richness of an editorial campaign while still looking like us. That balance is rare.",
    name: "Nisha R.",
  },
  {
    quote:
      "We used the images for our announcement and everyone thought we had already done a destination pre-wedding shoot.",
    name: "Daniel & Sara",
  },
];

const pricing = [
  { name: "Free", price: "$0", text: "Preview the studio", items: ["3 generations", "Watermarked previews", "Core wedding themes"] },
  { name: "Premium", price: "$29", text: "For couples", items: ["60 generations", "HD downloads", "All wedding themes", "Private gallery"], featured: true },
  { name: "Studio", price: "$99", text: "For creators", items: ["250 generations", "4K exports", "Priority queue", "Commercial usage"] },
];

const faqs = [
  ["Will the portraits still look like us?", "ALANKAR is designed around identity preservation, using your uploaded photos as the visual foundation for every generated portrait."],
  ["Can we choose cultural wedding styles?", "Yes. Themes include Indian regional styles, palace ceremonies, beach weddings, Christian weddings, Muslim weddings, receptions, and more."],
  ["Are the images ready for print?", "Premium and Studio exports are prepared for high-resolution albums, announcements, framed prints, and social sharing."],
  ["Do we need professional source photos?", "Professional photos help, but clear phone portraits with visible faces and balanced lighting are enough to start."],
];

const fadeUp = {
  hidden: { opacity: 0, y: 34 },
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
      transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
      className="mx-auto mb-14 max-w-3xl text-center"
    >
      <p className="text-xs uppercase tracking-[0.38em] text-primary/80">{eyebrow}</p>
      <h2 className="mt-5 font-serif text-5xl leading-[0.98] text-[#fff8e8] sm:text-6xl">
        {title}
      </h2>
      <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-[#d6cbb5]/75 sm:text-lg">
        {text}
      </p>
    </motion.div>
  );
}

function ArtPanel({ label, tall = false }: { label: string; tall?: boolean }) {
  return (
    <div className={`group relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#17130f] ${tall ? "min-h-[520px]" : "min-h-[320px]"}`}>
      <Image
        src="/alankar-hero-preview.png"
        alt={`${label} wedding portrait`}
        fill
        sizes="(max-width: 768px) 100vw, 40vw"
        className="object-cover opacity-80 transition duration-700 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/25 to-transparent" />
      <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between gap-4">
        <p className="font-serif text-3xl text-[#fff8e8]">{label}</p>
        <span className="rounded-full border border-primary/30 bg-black/40 px-4 py-2 text-xs uppercase tracking-[0.2em] text-primary backdrop-blur">
          ALANKAR
        </span>
      </div>
    </div>
  );
}

function ComparisonSlider() {
  const [value, setValue] = useState(52);

  return (
    <div className="relative mx-auto max-w-5xl overflow-hidden rounded-[2rem] border border-white/10 bg-[#15110e] shadow-2xl shadow-black/40">
      <div className="relative aspect-[4/5] sm:aspect-[16/9]">
        <Image src="/alankar-hero-preview.png" alt="Original uploaded couple photo" fill sizes="100vw" className="object-cover grayscale saturate-50 opacity-55" />
        <div className="absolute inset-0 overflow-hidden" style={{ width: `${value}%` }}>
          <Image src="/alankar-hero-preview.png" alt="AI-generated cinematic wedding portrait" fill sizes="100vw" className="object-cover saturate-125" />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/15 to-transparent" />
        </div>
        <div className="absolute inset-y-0 z-10 w-px bg-primary" style={{ left: `${value}%` }} />
        <div className="absolute top-5 left-5 rounded-full bg-black/55 px-4 py-2 text-xs uppercase tracking-[0.22em] text-[#fff8e8] backdrop-blur">Before</div>
        <div className="absolute top-5 right-5 rounded-full bg-primary/90 px-4 py-2 text-xs uppercase tracking-[0.22em] text-black">After</div>
      </div>
      <input
        aria-label="Compare original and AI wedding portrait"
        type="range"
        min="18"
        max="82"
        value={value}
        onChange={(event) => setValue(Number(event.target.value))}
        className="absolute inset-x-6 bottom-6 z-20 accent-primary"
      />
    </div>
  );
}

function Hero() {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 700], [0, 180]);
  const scale = useTransform(scrollY, [0, 700], [1, 1.12]);
  const opacity = useTransform(scrollY, [0, 620], [1, 0.25]);

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 py-28">
      <motion.div style={{ y, scale }} className="absolute inset-0">
        <Image src="/alankar-hero-preview.png" alt="Cinematic AI wedding portrait" fill priority sizes="100vw" className="object-cover" />
      </motion.div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(213,171,93,0.18),transparent_34rem),linear-gradient(180deg,rgba(6,5,4,0.48),rgba(6,5,4,0.9)_72%,#0b0908)]" />
      <motion.div style={{ opacity }} className="relative z-10 mx-auto max-w-6xl text-center">
        <motion.p initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-xs uppercase tracking-[0.46em] text-primary">
          AI wedding portrait studio
        </motion.p>
        <motion.h1 initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12, duration: 0.9 }} className="mt-7 font-serif text-6xl leading-[0.9] text-[#fff8e8] sm:text-7xl lg:text-8xl">
          Timeless Wedding Memories, Reimagined by AI.
        </motion.h1>
        <motion.p initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.24, duration: 0.8 }} className="mx-auto mt-8 max-w-2xl whitespace-pre-line text-lg leading-8 text-[#eee3cf]/85 sm:text-xl">
          {"Upload your photos.\nChoose a wedding style.\nGenerate breathtaking portraits in seconds."}
        </motion.p>
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.36, duration: 0.75 }} className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button asChild size="lg" className="rounded-full px-8">
            <a href="/choose-style">Generate Now <ArrowRight className="size-4" /></a>
          </Button>
          <Button asChild size="lg" variant="outline" className="rounded-full border-white/20 bg-black/25 px-8 backdrop-blur">
            <a href="#gallery">Explore Gallery</a>
          </Button>
        </motion.div>
      </motion.div>
      <motion.a href="#process" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1 }} className="absolute bottom-8 z-10 flex flex-col items-center gap-2 text-xs uppercase tracking-[0.25em] text-[#eee3cf]/70">
        Scroll <ChevronDown className="size-5" />
      </motion.a>
    </section>
  );
}

export function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0b0908] text-[#fff8e8]">
      <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-black/35 backdrop-blur-2xl">
        <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 sm:px-8">
          <a href="/" className="font-serif text-3xl tracking-wide">ALANKAR</a>
          <div className="hidden items-center gap-8 lg:flex">
            {navItems.map((item) => (
              <a key={item.href} href={item.href} className="text-sm text-[#eee3cf]/70 transition hover:text-primary">{item.label}</a>
            ))}
          </div>
          <Button asChild size="sm" className="rounded-full">
            <a href="/choose-style">Generate Now</a>
          </Button>
        </nav>
      </header>

      <main>
        <Hero />

        <section id="process" className="px-6 py-28 sm:px-8">
          <SectionHeading eyebrow="How ALANKAR Works" title="A calm, cinematic path from portrait to keepsake." text="The experience feels more like entering a private creative studio than filling out a form." />
          <div className="mx-auto grid max-w-7xl gap-5 lg:grid-cols-4">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.article key={step.title} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }} variants={fadeUp} transition={{ delay: index * 0.08, duration: 0.7 }} className="relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/[0.045] p-6 shadow-2xl shadow-black/20 backdrop-blur">
                  <span className="font-serif text-6xl text-primary/30">0{index + 1}</span>
                  <Icon className="mt-9 size-7 text-primary" />
                  <h3 className="mt-6 font-serif text-3xl leading-tight">{step.title}</h3>
                  <p className="mt-4 text-sm leading-6 text-[#d6cbb5]/70">{step.text}</p>
                </motion.article>
              );
            })}
          </div>
        </section>

        <section id="themes" className="px-6 py-28 sm:px-8">
          <SectionHeading eyebrow="Wedding Themes" title="Every ceremony imagined with restraint and reverence." text="Choose a visual direction that honors the mood, culture, and atmosphere of your celebration." />
          <div className="mx-auto grid max-w-7xl gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {themes.map((theme, index) => (
              <motion.div key={theme} initial={{ opacity: 0, y: 28, scale: 0.96 }} whileInView={{ opacity: 1, y: 0, scale: 1 }} whileHover={{ y: -8 }} viewport={{ once: true, amount: 0.25 }} transition={{ delay: index * 0.045, duration: 0.55 }} className="group relative min-h-[310px] overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#15110e] p-6">
                <Image src="/alankar-hero-preview.png" alt={`${theme} theme`} fill sizes="(max-width: 768px) 100vw, 25vw" className="object-cover opacity-45 transition duration-700 group-hover:scale-110 group-hover:opacity-65" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                <div className="relative flex h-full flex-col justify-end">
                  <p className="font-serif text-3xl">{theme}</p>
                  <p className="mt-3 text-sm text-[#d6cbb5]/70">Cinematic wedding direction</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="px-6 py-28 sm:px-8">
          <SectionHeading eyebrow="Before / After" title="Slide between source and story." text="Compare the quiet simplicity of an uploaded portrait with the finished cinematic wedding frame." />
          <ComparisonSlider />
        </section>

        <section id="gallery" className="px-6 py-28 sm:px-8">
          <SectionHeading eyebrow="Gallery" title="Portraits with the stillness of heirlooms." text="A masonry-inspired gallery for romantic, editorial, and ceremony-led wedding transformations." />
          <div className="mx-auto grid max-w-7xl auto-rows-[260px] gap-5 md:grid-cols-3">
            {gallery.map((item, index) => (
              <motion.div key={item.title} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} variants={fadeUp} transition={{ delay: index * 0.06, duration: 0.65 }} className={item.size}>
                <ArtPanel label={item.title} tall={item.size.includes("row-span")} />
              </motion.div>
            ))}
          </div>
        </section>

        <section id="features" className="px-6 py-28 sm:px-8">
          <SectionHeading eyebrow="Features" title="Built for romance, tuned for precision." text="Every detail supports a luxury creative flow: speed, privacy, high resolution, and identity-aware generation." />
          <div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.article key={feature.title} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.25 }} variants={fadeUp} transition={{ delay: index * 0.06, duration: 0.6 }} className="rounded-[1.5rem] border border-white/10 bg-white/[0.045] p-7 backdrop-blur transition hover:border-primary/35 hover:bg-white/[0.07]">
                  <Icon className="size-7 text-primary" />
                  <h3 className="mt-8 font-serif text-3xl">{feature.title}</h3>
                  <p className="mt-4 text-sm leading-6 text-[#d6cbb5]/70">{feature.text}</p>
                </motion.article>
              );
            })}
          </div>
        </section>

        <section className="px-6 py-28 sm:px-8">
          <SectionHeading eyebrow="Testimonials" title="Couples remember the feeling first." text="A refined AI studio for people who want their first wedding visuals to feel personal, intimate, and cinematic." />
          <div className="mx-auto grid max-w-7xl gap-5 lg:grid-cols-3">
            {testimonials.map((item, index) => (
              <motion.figure key={item.name} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }} variants={fadeUp} transition={{ delay: index * 0.08, duration: 0.65 }} className="rounded-[1.75rem] border border-white/10 bg-[#15110e] p-8">
                <blockquote className="font-serif text-2xl leading-9 text-[#fff8e8]">"{item.quote}"</blockquote>
                <figcaption className="mt-8 text-sm uppercase tracking-[0.25em] text-primary">{item.name}</figcaption>
              </motion.figure>
            ))}
          </div>
        </section>

        <section id="pricing" className="px-6 py-28 sm:px-8">
          <SectionHeading eyebrow="Pricing" title="Choose the album your story deserves." text="Start small, create a full wedding portrait collection, or scale ALANKAR for studio workflows." />
          <div className="mx-auto grid max-w-6xl gap-5 lg:grid-cols-3">
            {pricing.map((tier) => (
              <motion.article key={tier.name} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.25 }} variants={fadeUp} className={`rounded-[1.75rem] border p-8 ${tier.featured ? "border-primary/50 bg-primary/10 shadow-2xl shadow-primary/10" : "border-white/10 bg-white/[0.045]"}`}>
                <p className="font-serif text-4xl">{tier.name}</p>
                <p className="mt-5 font-serif text-6xl text-primary">{tier.price}</p>
                <p className="mt-3 text-sm text-[#d6cbb5]/70">{tier.text}</p>
                <div className="mt-8 space-y-4">
                  {tier.items.map((item) => (
                    <p key={item} className="flex items-center gap-3 text-sm text-[#eee3cf]/85"><Check className="size-4 text-primary" />{item}</p>
                  ))}
                </div>
                <Button asChild className="mt-9 w-full rounded-full" variant={tier.featured ? "default" : "outline"}>
                  <a href="/choose-style">Select {tier.name}</a>
                </Button>
              </motion.article>
            ))}
          </div>
        </section>

        <section id="faq" className="px-6 py-28 sm:px-8">
          <SectionHeading eyebrow="FAQ" title="Quiet answers before you begin." text="The essentials for creating wedding portraits from your own couple photos." />
          <div className="mx-auto max-w-4xl space-y-4">
            {faqs.map(([question, answer], index) => (
              <motion.details key={question} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.35 }} variants={fadeUp} transition={{ delay: index * 0.05 }} className="group rounded-[1.25rem] border border-white/10 bg-white/[0.045] p-6">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-5 font-serif text-2xl">
                  {question}
                  <ChevronDown className="size-5 shrink-0 text-primary transition group-open:rotate-180" />
                </summary>
                <p className="mt-5 text-sm leading-6 text-[#d6cbb5]/75">{answer}</p>
              </motion.details>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-white/10 px-6 py-12 sm:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 text-sm text-[#d6cbb5]/70 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-serif text-3xl text-[#fff8e8]">ALANKAR</p>
          <p>AI wedding portraits for modern love stories.</p>
        </div>
      </footer>
    </div>
  );
}
