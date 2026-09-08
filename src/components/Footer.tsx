import { Link } from "react-router-dom";
import { MessageCircle, Phone } from "lucide-react";
import { REGIONS, TAGS } from "@/data/tags";
import { CONTACT_PHONE_DISPLAY, buildGirlWhatsAppLink, buildTelLink } from "@/config/contact";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer id="regions" className="border-t border-border bg-card/40">
      <div className="container flex flex-col gap-8 py-10">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <div>
            <span className="bg-gradient-to-l from-primary to-accent bg-clip-text text-lg font-extrabold text-transparent">
              Serjo Girls
            </span>
            <p className="mt-1 text-sm text-muted-foreground">
              חשפניות להזמנה למסיבות רווקים ואירועים פרטיים - שירות דיסקרטי בכל הארץ
            </p>
          </div>

          <div className="flex items-center gap-4">
            <a
              href={buildTelLink()}
              className="flex items-center gap-1.5 text-sm font-semibold text-foreground transition-colors hover:text-primary"
              dir="ltr"
            >
              <Phone className="h-4 w-4 shrink-0 text-primary" />
              {CONTACT_PHONE_DISPLAY}
            </a>
            <a
              href={buildGirlWhatsAppLink("")}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sm font-semibold text-whatsapp transition-colors hover:text-whatsapp/80"
            >
              <MessageCircle className="h-4 w-4 shrink-0" />
              וואטסאפ
            </a>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 border-t border-border pt-8 sm:grid-cols-4">
          {REGIONS.map((region) => (
            <div key={region}>
              <h3 className="mb-3 text-sm font-semibold text-foreground">{region}</h3>
              <ul className="space-y-2">
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
