import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Clock, ShieldCheck, Sparkles } from "lucide-react";
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

  // תמונת רקע להירו - הפרופיל הראשון בקטלוג (פעיל, לפי סדר תצוגה). ללא תלות בפרופיל
  // ספציפי מקובע: אם הפרופיל הראשון משתנה באדמין, ההירו מתעדכן אוטומטית.
  const heroImage = girls[0]?.images[0];

  return (
    <>
      <section className="relative overflow-hidden border-b border-border">
        {/* רקע: תמונה + שכבות גרדיאנט לקריאוּת טקסט */}
        <div className="absolute inset-0">
          {heroImage && (
            <img
              src={heroImage}
              alt=""
              aria-hidden="true"
              className="h-full w-full scale-105 object-cover object-top opacity-45"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-l from-background via-background/85 to-background/50 md:to-background/20" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/10 to-background/40" />
        </div>

        {/* ניווט מספרים דקורטיבי - דסקטופ בלבד */}
        <div className="absolute inset-y-0 right-6 z-10 hidden flex-col items-end justify-center gap-7 lg:flex">
          {["01", "02", "03", "04"].map((n, i) => (
            <div
              key={n}
              className={
                i === 0
                  ? "flex items-center gap-2 text-sm font-bold text-primary"
                  : "flex items-center gap-2 text-sm text-muted-foreground/60"
              }
            >
              {i === 0 && <span className="h-px w-6 bg-primary" />}
              {n}
            </div>
          ))}
        </div>

        <div className="container relative flex flex-col justify-center gap-8 py-20 sm:py-28 lg:pl-28 lg:min-h-[620px]">
          <div className="max-w-xl">
            <p className="mb-3 text-sm font-medium tracking-wide text-muted-foreground">
              חשפניות להזמנה במרכז, בשרון ובדרום
            </p>
            <h1 className="text-balance text-5xl font-extrabold leading-[1.05] text-foreground sm:text-6xl md:text-7xl">
              חשפניות
              <br />
              <span className="bg-gradient-to-l from-primary to-accent bg-clip-text text-transparent">
                להזמנה
              </span>
            </h1>
            <p className="mt-6 max-w-md text-balance text-base leading-relaxed text-muted-foreground">
              כאן תוכלו למצוא את מיטב החשפניות בישראל להזמנה למסיבות רווקים ואירועים פרטיים
              בכל רחבי הארץ - שירות VIP דיסקרטי, זמין 24 שעות ביממה.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
              <a
                href={buildGirlWhatsAppLink("")}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-4"
              >
                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-accent text-accent transition-all group-hover:scale-110 group-hover:bg-accent group-hover:text-accent-foreground">
                  <ArrowLeft className="h-5 w-5" />
                </span>
                <span className="text-sm font-semibold text-foreground">לשיחה עם חשפניות</span>
              </a>

              <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
                {TRUST_BADGES.map(({ icon: Icon, label }) => (
                  <div key={label} className="flex items-center gap-1.5 text-sm text-muted-foreground">
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

      <section id="catalog" className="container scroll-mt-20 py-12 sm:py-16">
        <div className="mb-8 flex flex-col gap-2 text-center">
          <h2 className="text-2xl font-bold text-foreground sm:text-3xl">הקטלוג שלנו</h2>
          <p className="text-muted-foreground">בחרו עיר או אזור כדי לסנן את הפרופילים הזמינים</p>
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
