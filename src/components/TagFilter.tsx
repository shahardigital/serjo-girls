import { cn } from "@/lib/utils";
import { REGIONS, TAGS } from "@/data/tags";
import type { Girl } from "@/types";

interface TagFilterProps {
  girls: Girl[];
  selected: string[];
  onToggle: (tagId: string) => void;
  onClear: () => void;
}

export default function TagFilter({ girls, selected, onToggle, onClear }: TagFilterProps) {
  function countFor(tagId: string) {
    return girls.filter((g) => g.tags.includes(tagId)).length;
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={onClear}
          className={cn(
            "rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors",
            selected.length === 0
              ? "border-primary bg-primary text-primary-foreground"
              : "border-border bg-secondary/60 text-foreground hover:border-primary/50",
          )}
        >
          הכל ({girls.length})
        </button>

        {REGIONS.map((region) =>
          TAGS.filter((t) => t.region === region).map((tag) => {
            const count = countFor(tag.id);
            const isActive = selected.includes(tag.id);
            return (
              <button
                key={tag.id}
                id={tag.id}
                onClick={() => onToggle(tag.id)}
                className={cn(
                  "scroll-mt-20 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors",
                  isActive
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-secondary/60 text-foreground hover:border-primary/50",
                )}
              >
                {tag.label}
                <span className="mr-1.5 opacity-70">({count})</span>
              </button>
            );
          }),
        )}
      </div>
    </div>
  );
}
