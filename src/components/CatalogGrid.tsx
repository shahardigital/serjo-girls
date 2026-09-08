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
      <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border py-16 text-center">
        <p className="text-lg font-medium text-foreground">לא נמצאו פרופילים באזור זה</p>
        <p className="text-sm text-muted-foreground">נסו לבחור עיר אחרת או צרו קשר לבדיקת זמינות</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {girls.map((girl) => (
        <GirlCard key={girl.id} girl={girl} />
      ))}
    </div>
  );
}
