import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ChevronLeft, Clock, MessageCircle, Phone, SearchX, ShieldCheck } from "lucide-react";
import Seo from "@/components/Seo";
import GirlCard from "@/components/GirlCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { fetchActiveGirls, fetchGirlBySlug } from "@/lib/girls";
import { getTagById } from "@/data/tags";
import { useSiteSettings } from "@/context/SiteSettingsContext";
import { trackGirlClick } from "@/lib/clickTracking";
import type { Girl } from "@/types";

export default function GirlDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { buildTelLink, buildGirlWhatsAppLink } = useSiteSettings();

  const [girl, setGirl] = useState<Girl | null>(null);
  const [others, setOthers] = useState<Girl[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    setNotFound(false);
    setActiveImage(0);

    Promise.all([fetchGirlBySlug(slug), fetchActiveGirls()])
      .then(([found, all]) => {
        if (!found) {
          setNotFound(true);
          return;
        }
        setGirl(found);
        setOthers(all.filter((g) => g.id !== found.id));
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [slug]);

  const relatedGirls = useMemo(() => {
    if (!girl) return [];
    const sameTag = others.filter((g) => g.tags.some((t) => girl.tags.includes(t)));
    const rest = others.filter((g) => !sameTag.includes(g));
    return [...sameTag, ...rest].slice(0, 4);
  }, [girl, others]);

  if (loading) {
    return (
      <div className="container py-8 sm:py-12">
        <div className="mb-6 h-4 w-40 animate-pulse rounded bg-secondary" />
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-12">
          <div className="aspect-[3/4] w-full animate-pulse rounded-2xl bg-secondary" />
          <div className="flex flex-col gap-4">
            <div className="h-9 w-2/3 animate-pulse rounded bg-secondary" />
            <div className="h-5 w-1/3 animate-pulse rounded bg-secondary" />
            <div className="h-24 w-full animate-pulse rounded bg-secondary" />
            <div className="h-12 w-full animate-pulse rounded-full bg-secondary" />
          </div>
        </div>
      </div>
    );
  }

  if (notFound || !girl) {
    return (
      <div className="container flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
        <Seo title="פרופיל לא נמצא" description="הפרופיל המבוקש לא נמצא או שאינו זמין יותר." noindex />
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-secondary text-muted-foreground">
          <SearchX className="h-7 w-7" />
        </div>
        <h1 className="text-2xl font-bold text-foreground">הפרופיל לא נמצא</h1>
        <p className="text-muted-foreground">ייתכן שהוא הוסר או שהקישור שגוי.</p>
        <Button onClick={() => navigate("/")}>חזרה למבחר</Button>
      </div>
    );
  }

  const images = girl.images.length > 0 ? girl.images : [undefined];

  // התיאור מאוחסן כפסקאות מופרדות ב-\n\n: הראשונה היא תגית-משנה קצרה, השאר גוף הטקסט
  const [tagline, ...paragraphs] = girl.description
    ? girl.description.split(/\n\n+/)
    : [""];

  const seoDescription = paragraphs[0]
    ? `${paragraphs[0]} הזמנה מהירה בטלפון או בוואטסאפ - שירות דיסקרטי בכל הארץ.`
    : `הזמינו את ${girl.name} למסיבת רווקים או אירוע פרטי - שירות VIP דיסקרטי, זמין 24/7.`;

  return (
    <div className="container py-8 sm:py-12">
      <Seo
        title={`${girl.name} - חשפנית להזמנה`}
        description={seoDescription}
        path={`/girl/${girl.slug}`}
        image={girl.images[0]}
      />

      {/* breadcrumb */}
      <nav aria-label="breadcrumb" className="mb-6 flex items-center gap-1.5 text-sm text-muted-foreground">
        <Link to="/" className="transition-colors hover:text-primary">
          בית
        </Link>
        <ChevronLeft className="h-3.5 w-3.5" />
        <Link to="/#catalog" className="transition-colors hover:text-primary">
          המבחר שלנו
        </Link>
        <ChevronLeft className="h-3.5 w-3.5" />
        <span className="text-foreground">{girl.name}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-12">
        {/* גלריית תמונות */}
        <div className="flex flex-col gap-3">
          <div className="relative w-full overflow-hidden rounded-2xl border border-border bg-secondary">
            {images[activeImage] ? (
              <img
                src={images[activeImage]}
                alt={`${girl.name} - תמונה ${activeImage + 1}`}
                className="block h-auto w-full"
              />
            ) : (
              <div className="flex aspect-[3/4] w-full items-center justify-center text-muted-foreground">
                אין תמונה
              </div>
            )}
            <Badge variant="success" className="absolute top-4 right-4 shadow">
              פנויה
            </Badge>
          </div>

          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {images.map((src, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  aria-label={`תמונה ${i + 1}`}
                  aria-current={i === activeImage}
                  className={`flex h-20 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg border-2 bg-secondary transition-colors ${
                    i === activeImage ? "border-primary" : "border-transparent opacity-70 hover:opacity-100"
                  }`}
                >
                  {src && <img src={src} alt="" className="h-full w-full object-contain" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* פרטים */}
        <div className="flex flex-col gap-6">
          <div>
            <h1 className="text-3xl font-extrabold text-foreground sm:text-4xl">{girl.name}</h1>
            {tagline && (
              <p className="mt-1.5 text-lg font-medium text-accent">{tagline}</p>
            )}

            {girl.tags.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {girl.tags.map((tagId) => {
                  const tag = getTagById(tagId);
                  if (!tag) return null;
                  return (
                    <Link key={tagId} to={`/#${tag.id}`}>
                      <Badge variant="outline" className="transition-colors hover:border-primary hover:text-primary">
                        {tag.label}
                      </Badge>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {paragraphs.length > 0 && (
            <div className="flex flex-col gap-4">
              {paragraphs.map((p, i) => (
                <p key={i} className="text-balance leading-relaxed text-muted-foreground">
                  {p}
                </p>
              ))}
            </div>
          )}

          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 border-y border-border py-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 shrink-0 text-primary" />
              דיסקרטיות מלאה
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="h-4 w-4 shrink-0 text-primary" />
              זמינות 24/7
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild variant="whatsapp" size="lg" className="w-full sm:flex-1">
              <a
                href={buildGirlWhatsAppLink(girl.name)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackGirlClick(girl.id, "whatsapp")}
                aria-label={`שלח וואטסאפ בנוגע ל${girl.name}`}
              >
                <MessageCircle className="h-5 w-5" />
                הזמנה בוואטסאפ
              </a>
            </Button>
            <Button asChild variant="outline" size="lg" className="w-full sm:flex-1">
              <a
                href={buildTelLink()}
                onClick={() => trackGirlClick(girl.id, "call")}
                aria-label={`התקשר בנוגע ל${girl.name}`}
              >
                <Phone className="h-5 w-5" />
                חיוג ישיר
              </a>
            </Button>
          </div>
        </div>
      </div>

      {relatedGirls.length > 0 && (
        <section className="mt-16 border-t border-border pt-10">
          <div className="mb-6 flex flex-col gap-1.5">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">עוד לגלות</span>
            <h2 className="text-xl font-bold text-foreground sm:text-2xl">עוד חשפניות שיעניינו אותך</h2>
          </div>
          <div className="grid grid-cols-1 items-start gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {relatedGirls.map((g) => (
              <GirlCard key={g.id} girl={g} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
