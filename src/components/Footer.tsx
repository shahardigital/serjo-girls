import { Link } from "react-router-dom";
import { MessageCircle, Phone } from "lucide-react";
import { REGIONS, TAGS } from "@/data/tags";
import { useSiteSettings } from "@/context/SiteSettingsContext";

export default function Footer() {
  const year = new Date().getFullYear();
  const { settings, buildTelLink, buildGirlWhatsAppLink } = useSiteSettings();

  return (
    <footer id="regions" className="relative border-t border-border bg-card/40">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-l from-transparent via-primary/50 to-transparent" />

      <div className="container flex flex-col gap-8 py-12">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <div>
            <span className="bg-gradient-to-l from-primary to-accent bg-clip-text text-xl font-extrabold text-transparent">
              Serjo Girls
            </span>
            <p className="mt-1.5 text-sm text-muted-foreground">
              חשפניות להזמנה למסיבות רווקים ואירועים פרטיים - שירות דיסקרטי בכל הארץ
            </p>
          </div>

          <div className="flex items-center gap-3">
            <a
              href={buildTelLink()}
              className="flex items-center gap-1.5 rounded-full border border-border bg-secondary/40 px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:border-primary/50 hover:text-primary"
              dir="ltr"
            >
              <Phone className="h-4 w-4 shrink-0 text-primary" />
              {settings.phoneDisplay}
            </a>
            <a
              href={buildGirlWhatsAppLink("")}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 rounded-full border border-whatsapp/30 bg-whatsapp/10 px-4 py-2 text-sm font-semibold text-whatsapp transition-colors hover:bg-whatsapp/20"
            >
              <MessageCircle className="h-4 w-4 shrink-0" />
              וואטסאפ
            </a>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 border-t border-border pt-10 sm:grid-cols-4">
          {REGIONS.map((region) => (
            <div key={region}>
              <h3 className="mb-3 flex items-center gap-1.5 text-sm font-semibold text-foreground">
                <span className="h-1 w-1 rounded-full bg-primary" />
                {region}
              </h3>
              <ul className="space-y-2.5">
                {TAGS.filter((t) => t.region === region).map((tag) => (
                  <li key={tag.id}>
                    <a
                      href={`/#${tag.id}`}
                      className="text-sm text-muted-foreground transition-colors hover:text-primary"
                    >
                      {tag.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col items-center justify-between gap-3 border-t border-border pt-6 text-sm text-muted-foreground sm:flex-row">
          <p>© {year} Serjo Girls. כל הזכויות שמורות.</p>
          <Link to="/terms" className="transition-colors hover:text-primary">
            תקנון אתר
          </Link>
        </div>
      </div>
    </footer>
  );
}
