import { Button } from "@/components/ui/button";

const navItems = [
  { label: "Features", href: "#features" },
  { label: "Process", href: "#process" },
  { label: "Styles", href: "#styles" },
  { label: "FAQ", href: "#faq" },
];

export function Navbar() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-background/65 backdrop-blur-2xl">
      <nav
        className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 sm:px-8"
        aria-label="Main navigation"
      >
        <a className="font-serif text-2xl tracking-wide text-foreground" href="#top">
          ViWaah
        </a>
        <div className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => (
            <a
              className="text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:text-foreground focus-visible:outline-none"
              href={item.href}
              key={item.href}
            >
              {item.label}
            </a>
          ))}
        </div>
        <Button asChild size="sm">
          <a href="#create">Start Creating</a>
        </Button>
      </nav>
    </header>
  );
}
