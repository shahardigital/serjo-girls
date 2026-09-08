import { SearchX } from "lucide-react";
import GirlCard from "@/components/GirlCard";
import type { Girl } from "@/types";

interface CatalogGridProps {
  girls: Girl[];
  loading?: boolean;
}

export default function CatalogGrid({ girls, loading }: CatalogGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="aspect-[3/4] animate-pulse rounded-xl bg-secondary/60" />
        ))}
      </div>
    );
  }

  if (girls.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border py-16 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary text-muted-foreground">
          <SearchX className="h-6 w-6" />
        </div>
        <p className="text-lg font-medium text-foreground">לא נמצאו פרופילים באזור זה</p>
        <p className="text-sm text-muted-foreground">נסו לבחור עיר אחרת או צרו קשר לבדיקת זמינות</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 items-start gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {girls.map((girl, i) => (
        <div key={girl.id} className="animate-fade-in" style={{ animationDelay: `${Math.min(i, 8) * 40}ms` }}>
          <GirlCard girl={girl} />
        </div>
      ))}
    </div>
  );
}
