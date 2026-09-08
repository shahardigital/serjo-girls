import { useMemo } from "react";
import { Link } from "react-router-dom";
import {
  AlertTriangle,
  ChevronLeft,
  FileText,
  Gavel,
  Lock,
  MessageCircle,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  UserCheck,
} from "lucide-react";
import Seo from "@/components/Seo";
import { useSiteSettings } from "@/context/SiteSettingsContext";

// אייקונים במחזוריות לפי סדר הסעיפים - לא תלוי בתוכן, רק בשביל גיוון ויזואלי
const ICONS = [FileText, ShieldCheck, UserCheck, Sparkles, Gavel, Lock, AlertTriangle, RefreshCw, MessageCircle];

interface TermsSection {
  title: string;
  body: string;
}

/** מפרק את תוכן התקנון: כל שורה שמתחילה ב-"# " פותחת סעיף חדש. */
function parseTermsSections(content: string): TermsSection[] {
  if (!content.trim()) return [];
  const lines = content.split("\n");
  const sections: TermsSection[] = [];
  let current: TermsSection | null = null;

  for (const line of lines) {
    if (line.startsWith("# ")) {
      if (current) sections.push(current);
      current = { title: line.slice(2).trim(), body: "" };
    } else if (current) {
      current.body += (current.body ? "\n" : "") + line;
    }
  }
  if (current) sections.push(current);

  return sections.map((s) => ({ title: s.title, body: s.body.trim() }));
}

export default function Terms() {
  const { settings, loading } = useSiteSettings();
  const sections = useMemo(() => parseTermsSections(settings.termsContent), [settings.termsContent]);

  return (
    <div className="container max-w-2xl py-12 sm:py-16">
      <Seo
        title="תקנון אתר"
        description="תקנון השימוש באתר Serjo Girls - תנאי שימוש, גילאי שימוש ומדיניות פרטיות."
        path="/terms"
      />

      <nav aria-label="breadcrumb" className="mb-6 flex items-center gap-1.5 text-sm text-muted-foreground">
        <Link to="/" className="transition-colors hover:text-primary">
          בית
        </Link>
        <ChevronLeft className="h-3.5 w-3.5" />
        <span className="text-foreground">תקנון אתר</span>
      </nav>

      <h1 className="mb-2 text-3xl font-extrabold text-foreground sm:text-4xl">תקנון אתר</h1>
      <p className="mb-8 text-sm text-muted-foreground">עודכן לאחרונה: {new Date().toLocaleDateString("he-IL")}</p>

      {loading ? (
        <div className="flex flex-col gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-24 w-full animate-pulse rounded-xl bg-secondary/60" />
          ))}
        </div>
      ) : sections.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-card/40 p-4 text-sm leading-relaxed text-muted-foreground">
          תוכן התקנון עדיין לא הוגדר. ניתן לערוך אותו מאזור הניהול.
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {sections.map(({ title, body }, i) => {
            const Icon = ICONS[i % ICONS.length];
            return (
              <section
                key={title}
                className="flex gap-4 rounded-xl border border-border bg-card/40 p-5 transition-colors hover:border-primary/30"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="mb-1.5 font-semibold text-foreground">{title}</h2>
                  <p className="whitespace-pre-line text-sm leading-relaxed text-muted-foreground">{body}</p>
                </div>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}
