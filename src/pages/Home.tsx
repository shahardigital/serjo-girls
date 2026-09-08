import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Clock, ShieldCheck, Sparkles } from "lucide-react";
import Seo from "@/components/Seo";
import TagFilter from "@/components/TagFilter";
import CatalogGrid from "@/components/CatalogGrid";
import { fetchActiveGirls } from "@/lib/girls";
import { buildGirlWhatsAppLink, buildTelLink, CONTACT_PHONE_DISPLAY } from "@/config/contact";
import type { Girl } from "@/types";

const TRUST_BADGES = [
  { icon: ShieldCheck, label: "דיסקרטיות מלאה" },
  { icon: Clock, label: "זמינות 24/7" },
  { icon: Sparkles, label: "שירות VIP" },
];

export default function Home() {
  const [girls, setGirls] = useState<Girl[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  useEffect(() => {
    fetchActiveGirls()
      .then(setGirls)
      .catch((e) => setError(e.message ?? "שגיאה בטעינת הקטלוג"))
      .finally(() => setLoading(false));
  }, []);

  const filteredGirls = useMemo(() => {
    if (selectedTags.length === 0) return girls;
    return girls.filter((g) => g.tags.some((t) => selectedTags.includes(t)));
  }, [girls, selectedTags]);

  function toggleTag(tagId: string) {
    setSelectedTags((prev) =>
      prev.includes(tagId) ? prev.filter((t) => t !== tagId) : [...prev, tagId],
    );
  }

  // תמונת רקע להירו - תמונה נבחרת בקפידה (לא תלוית סדר תצוגה בקטלוג), עם נפילה
  // חזרה לפרופיל הראשון הזמין אם התמונה הנבחרת לא קיימת מסיבה כלשהי.
  const heroGirl = girls.find((g) => g.name === "הנסיכה הסינית") ?? girls[0];
  const heroImage = heroGirl?.images[0];

  return (
    <>
      <Seo
        title="חשפניות להזמנה למסיבות רווקים ואירועים | Serjo Girls"
        description="חשפניות להזמנה למסיבות רווקים ואירועים פרטיים בכל רחבי הארץ - מרכז, שרון, דרום וירושלים. שירות VIP דיסקרטי, זמינות 24/7, הזמנה מהירה בטלפון או בוואטסאפ."
        path="/"
      />

      <section className="relative overflow-hidden border-b border-border bg-background">
        {/* תמונה מלאה על פני כל הסקשיין, עם דירוג כהה/שחור (לא צבעוני) שממזג אותה עם הרקע */}
        {heroImage && (
          <div className="absolute inset-0">
            <img
              src={heroImage}
              alt=""
              aria-hidden="true"
              className="h-full w-full scale-110 object-cover object-[25%_8%] grayscale-[15%] sm:object-[35%_5%] lg:scale-100 lg:object-[22%_5%]"
            />
            {/* דירוג כהה אחיד - שכבה שחורה שטוחה, בלי גוון צבעוני */}
            <div className="absolute inset-0 bg-black/50" />
            <div className="absolute inset-0 bg-gradient-to-t from-background/85 via-transparent to-background/35" />
            {/* וינייטה אסימטרית: כהה ואטומה מתחת לטקסט, נעלמת לגמרי איפה שהתמונה צריכה לנשום */}
            <div className="absolute inset-0 bg-gradient-to-l from-background via-background/78 to-transparent sm:via-background/60" />
            <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-background to-transparent" />
          </div>
        )}

        <div className="container relative flex flex-col justify-center gap-8 py-24 sm:py-32 lg:min-h-[680px]">
          <div className="max-w-xl">
            <p className="mb-3 text-sm font-medium tracking-wide text-accent">
              חשפניות להזמנה במרכז, בשרון ובדרום
            </p>
            <h1 className="text-balance text-5xl font-extrabold leading-[1.05] text-foreground drop-shadow-[0_2px_20px_rgba(0,0,0,0.6)] sm:text-6xl md:text-7xl">
              חשפניות
              <br />
              <span className="bg-gradient-to-l from-primary to-accent bg-clip-text text-transparent">
                להזמנה
              </span>
            </h1>
            <p className="mt-6 max-w-md text-balance text-base leading-relaxed text-foreground/90 drop-shadow-[0_1px_8px_rgba(0,0,0,0.7)]">
              כאן תוכלו למצוא את מיטב החשפניות בישראל להזמנה למסיבות רווקים ואירועים פרטיים
              בכל רחבי הארץ - שירות VIP דיסקרטי, זמין 24 שעות ביממה.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-5">
              <a
                href={buildGirlWhatsAppLink("")}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-4"
              >
                <span className="flex h-16 w-16 shrink-0 animate-pulse-ring items-center justify-center rounded-full bg-gradient-to-br from-accent to-primary text-accent-foreground shadow-lg shadow-accent/30 transition-transform group-hover:scale-110">
                  <ArrowLeft className="h-6 w-6" />
                </span>
                <span className="text-base font-bold text-foreground drop-shadow-[0_1px_6px_rgba(0,0,0,0.8)]">
                  לשיחה עם חשפניות
                </span>
              </a>

              <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
                {TRUST_BADGES.map(({ icon: Icon, label }) => (
                  <div
                    key={label}
                    className="flex items-center gap-1.5 text-sm text-foreground/80 drop-shadow-[0_1px_6px_rgba(0,0,0,0.7)]"
                  >
                    <Icon className="h-4 w-4 shrink-0 text-primary" />
                    {label}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* פס מידע תחתון */}
        <div className="relative z-10 border-t border-border/60 bg-background/70 backdrop-blur-sm">
          <div className="container flex flex-wrap items-center justify-center gap-x-8 gap-y-2 py-4 text-sm text-muted-foreground sm:justify-between">
            <span>
              חייגו עכשיו:{" "}
              <a href={buildTelLink()} className="font-semibold text-primary" dir="ltr">
                {CONTACT_PHONE_DISPLAY}
              </a>
            </span>
            <span>זמינים גם בוואטסאפ</span>
            <a href="#catalog" className="font-medium text-foreground transition-colors hover:text-primary">
              בחר לך חשפנית ←
            </a>
          </div>
        </div>
      </section>

      <section id="catalog" className="container scroll-mt-20 py-16 sm:py-20">
        <div className="mb-10 flex flex-col items-center gap-3 text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">הקטלוג המלא</span>
          <h2 className="text-3xl font-extrabold text-foreground sm:text-4xl">
            החשפניות שלנו
          </h2>
          <p className="max-w-md text-muted-foreground">בחרו עיר או אזור כדי לסנן את הפרופילים הזמינים</p>
          <span className="mt-1 h-1 w-14 rounded-full bg-gradient-to-l from-primary to-accent" />
        </div>

        <div className="mb-8">
          <TagFilter
            girls={girls}
            selected={selectedTags}
            onToggle={toggleTag}
            onClear={() => setSelectedTags([])}
          />
        </div>

        {error ? (
          <p className="rounded-lg border border-destructive/40 bg-destructive/10 p-4 text-center text-destructive">
            {error}
          </p>
        ) : (
          <CatalogGrid girls={filteredGirls} loading={loading} />
        )}
      </section>
    </>
  );
}
