import { useEffect, useMemo, useState } from "react";
import { Clock, MessageCircle, Phone, ShieldCheck, Sparkles } from "lucide-react";
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
        {/* תמונה אווירתית מלאה, עם דירוג צבעוני כבד שהופך אותה לחלק מהעיצוב ולא לתצלום סטוק מודבק */}
        {heroImage && (
          <div className="absolute inset-0">
            <img
              src={heroImage}
              alt=""
              aria-hidden="true"
              className="h-full w-full object-cover object-[50%_8%]"
            />
            {/* דירוג: טון סגול-מגנטה כהה על כל התמונה */}
            <div className="absolute inset-0 bg-[#1a0b2e]/60 mix-blend-multiply" />
            <div className="absolute inset-0 bg-gradient-to-b from-[#2a0f3d]/70 via-accent/20 to-primary/15 mix-blend-color" />
            {/* וינייטה: כהה בהיקף כדי שהטקסט המרכזי יהיה קריא, שקופה במרכז-עליון איפה שהפנים */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_55%_at_50%_28%,transparent_0%,rgba(11,9,16,0.55)_70%,rgba(11,9,16,0.92)_100%)]" />
            <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-background to-transparent" />
            <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-background/70 to-transparent" />
          </div>
        )}

        <div className="container relative flex flex-col items-center justify-center gap-6 py-28 text-center sm:py-36 lg:min-h-[760px]">
          <p className="text-sm font-medium tracking-[0.15em] text-accent drop-shadow-[0_1px_8px_rgba(0,0,0,0.8)]">
            חשפניות להזמנה במרכז, בשרון ובדרום
          </p>
          <h1 className="text-balance text-5xl font-extrabold leading-[1.05] text-foreground drop-shadow-[0_4px_30px_rgba(0,0,0,0.85)] sm:text-6xl md:text-7xl">
            חשפניות{" "}
            <span className="bg-gradient-to-l from-primary to-accent bg-clip-text text-transparent">
              להזמנה
            </span>
          </h1>
          <p className="max-w-xl text-balance text-base leading-relaxed text-foreground/90 drop-shadow-[0_1px_10px_rgba(0,0,0,0.85)] sm:text-lg">
            כאן תוכלו למצוא את מיטב החשפניות בישראל להזמנה למסיבות רווקים ואירועים פרטיים
            בכל רחבי הארץ - שירות VIP דיסקרטי, זמין 24 שעות ביממה.
          </p>

          <div className="mt-2 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            {TRUST_BADGES.map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-1.5 text-sm text-foreground/85 drop-shadow-[0_1px_8px_rgba(0,0,0,0.8)]"
              >
                <Icon className="h-4 w-4 shrink-0 text-primary" />
                {label}
              </div>
            ))}
          </div>

          <div className="mt-4 flex flex-col items-center gap-3 sm:flex-row">
            <a
              href={buildGirlWhatsAppLink("")}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-full bg-gradient-to-l from-accent to-primary px-8 py-4 text-base font-bold text-accent-foreground shadow-lg shadow-accent/30 transition-transform hover:scale-105"
            >
              <MessageCircle className="h-5 w-5" />
              הזמנה מהירה בוואטסאפ
            </a>
            <a
              href={buildTelLink()}
              className="flex items-center gap-2 rounded-full border border-foreground/25 bg-background/40 px-8 py-4 text-base font-bold text-foreground backdrop-blur-sm transition-colors hover:border-foreground/50"
              dir="ltr"
            >
              <Phone className="h-5 w-5 shrink-0" />
              {CONTACT_PHONE_DISPLAY}
            </a>
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
