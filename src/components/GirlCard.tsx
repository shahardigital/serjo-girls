import { MessageCircle, Phone } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getTagById } from "@/data/tags";
import { buildGirlWhatsAppLink, buildTelLink } from "@/config/contact";
import type { Girl } from "@/types";

interface GirlCardProps {
  girl: Girl;
}

export default function GirlCard({ girl }: GirlCardProps) {
  const image = girl.images[0];

  return (
    <article className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-colors hover:border-primary/50">
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-secondary">
        {image ? (
          <img
            src={image}
            alt={girl.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">
            אין תמונה
          </div>
        )}
        <Badge variant="success" className="absolute top-3 right-3 shadow">
          פנויה
        </Badge>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <h3 className="text-lg font-bold text-foreground">{girl.name}</h3>

        {girl.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {girl.tags.map((tagId) => {
              const tag = getTagById(tagId);
              if (!tag) return null;
              return (
                <Badge key={tagId} variant="outline">
                  {tag.label}
                </Badge>
              );
            })}
          </div>
        )}

        <div className="mt-auto flex gap-2 pt-2">
          <Button asChild variant="outline" size="sm" className="flex-1">
            <a href={buildTelLink()} aria-label={`התקשר בנוגע ל${girl.name}`}>
              <Phone className="h-4 w-4" />
              חיוג
            </a>
          </Button>
          <Button asChild variant="whatsapp" size="sm" className="flex-1">
            <a
              href={buildGirlWhatsAppLink(girl.name)}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`שלח וואטסאפ בנוגע ל${girl.name}`}
            >
              <MessageCircle className="h-4 w-4" />
              וואטסאפ
            </a>
          </Button>
        </div>
      </div>
    </article>
  );
}
