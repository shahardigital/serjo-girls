import { useEffect, useMemo, useState } from "react";
import { Clock, MessageCircle, ShieldCheck, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import TagFilter from "@/components/TagFilter";
import CatalogGrid from "@/components/CatalogGrid";
import { fetchActiveGirls } from "@/lib/girls";
import { buildGirlWhatsAppLink } from "@/config/contact";
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

  return (
    <>
      <section className="relative overflow-hidden border-b border-border">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-primary/10 via-transparent to-transparent" />
        <div className="container relative flex flex-col items-center gap-6 py-16 text-center sm:py-24">
          <h1 className="text-balance text-3xl font-extrabold leading-tight text-foreground sm:text-4xl md:text-5xl">
            חשפניות להזמנה{" "}
            <span className="bg-gradient-to-l from-primary to-accent bg-clip-text text-transparent">
              למסיבות רווקים
            </span>{" "}
            ואירועים פרטיים
          </h1>
          <p className="max-w-2xl text-balance text-base text-muted-foreground sm:text-lg">
            שירות ליווי VIP דיסקרטי בכל רחבי הארץ - הזמנה מהירה ופשוטה בטלפון או בוואטסאפ
          </p>

          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            {TRUST_BADGES.map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Icon className="h-4 w-4 shrink-0 text-primary" />
                {label}
              </div>
            ))}
          </div>

          <Button asChild variant="whatsapp" size="lg" className="mt-2">
            <a href={buildGirlWhatsAppLink("")} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="h-5 w-5" />
              הזמנה מהירה בוואטסאפ
            </a>
          </Button>
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
