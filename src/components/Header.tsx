import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, Phone, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CONTACT_PHONE_DISPLAY, buildGirlWhatsAppLink, buildTelLink } from "@/config/contact";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "#catalog", label: "הקטלוג שלנו" },
  { href: "#regions", label: "אזורי שירות" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  function handleAnchorClick(e: React.MouseEvent, href: string) {
    e.preventDefault();
    setOpen(false);
    if (location.pathname !== "/") {
      navigate("/" + href);
      return;
    }
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full border-b transition-all",
        scrolled
          ? "border-border bg-background/90 shadow-lg shadow-black/20 backdrop-blur-md"
          : "border-transparent bg-background/60 backdrop-blur-sm",
      )}
    >
      <div className="container flex h-16 items-center justify-between gap-4 md:h-20">
        <Link to="/" className="group flex shrink-0 items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-accent shadow-[0_0_10px_2px] shadow-accent/60" />
          <span className="bg-gradient-to-l from-primary to-accent bg-clip-text text-2xl font-extrabold tracking-tight text-transparent">
            Serjo Girls
          </span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => handleAnchorClick(e, link.href)}
              className="group relative text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
              <span className="absolute -bottom-1 right-0 h-px w-0 bg-gradient-to-l from-primary to-accent transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <a
            href={buildTelLink()}
            className="flex items-center gap-1.5 text-sm font-semibold text-foreground transition-colors hover:text-primary"
            dir="ltr"
          >
            <Phone className="h-4 w-4 shrink-0 text-primary" />
            {CONTACT_PHONE_DISPLAY}
          </a>
          <Button asChild variant="whatsapp" size="sm">
            <a href={buildGirlWhatsAppLink("")} target="_blank" rel="noopener noreferrer">
              וואטסאפ
            </a>
          </Button>
        </div>

        <button
          className="inline-flex h-10 w-10 items-center justify-center rounded-md text-foreground md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "סגור תפריט" : "פתח תפריט"}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-border bg-background/95 backdrop-blur-md md:hidden">
          <nav className="container flex flex-col gap-1 py-3">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleAnchorClick(e, link.href)}
                className="rounded-md px-2 py-3 text-base font-medium text-foreground hover:bg-secondary"
              >
                {link.label}
              </a>
            ))}
            <div className="mt-2 flex items-center gap-3 border-t border-border px-2 pt-3">
              <a
                href={buildTelLink()}
                className="flex items-center gap-1.5 text-sm font-semibold text-foreground"
                dir="ltr"
              >
                <Phone className="h-4 w-4 shrink-0 text-primary" />
                {CONTACT_PHONE_DISPLAY}
              </a>
              <Button asChild variant="whatsapp" size="sm" className="mr-auto">
                <a href={buildGirlWhatsAppLink("")} target="_blank" rel="noopener noreferrer">
                  וואטסאפ
                </a>
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
