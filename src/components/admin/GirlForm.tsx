import { useState } from "react";
import { Loader2, Trash2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { REGIONS, TAGS } from "@/data/tags";
import { createGirl, deleteGirlImage, updateGirl, uploadGirlImage } from "@/lib/girls";
import { cn } from "@/lib/utils";
import type { Girl } from "@/types";

interface GirlFormProps {
  girl?: Girl;
  onSaved: (girl: Girl) => void;
  onCancel: () => void;
}

export default function GirlForm({ girl, onSaved, onCancel }: GirlFormProps) {
  const [name, setName] = useState(girl?.name ?? "");
  const [description, setDescription] = useState(girl?.description ?? "");
  const [tags, setTags] = useState<string[]>(girl?.tags ?? []);
  const [images, setImages] = useState<string[]>(girl?.images ?? []);
  const [active, setActive] = useState(girl?.active ?? true);
  const [order, setOrder] = useState(girl?.order ?? 0);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // מזהה יציב לשימוש בנתיב ה-Storage, גם לפני שהרשומה נוצרת ב-DB.
  const [pendingId] = useState(() => girl?.id ?? crypto.randomUUID());

  function toggleTag(tagId: string) {
    setTags((prev) => (prev.includes(tagId) ? prev.filter((t) => t !== tagId) : [...prev, tagId]));
  }

  async function handleImageSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploading(true);
    setError(null);
    try {
      const uploaded: string[] = [];
      for (const file of Array.from(files)) {
        const url = await uploadGirlImage(file, pendingId);
        uploaded.push(url);
      }
      setImages((prev) => [...prev, ...uploaded]);
    } catch (err: any) {
      setError(err.message ?? "שגיאה בהעלאת תמונה");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  async function handleRemoveImage(url: string) {
    setImages((prev) => prev.filter((u) => u !== url));
    deleteGirlImage(url).catch(() => {});
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      setError("שם הוא שדה חובה");
      return;
    }
    setSaving(true);
    setError(null);

    const payload = { name: name.trim(), description, tags, images, active, order: Number(order) };

    try {
      const saved = girl
        ? await updateGirl(girl.id, payload)
        : await createGirl({ id: pendingId, ...payload } as any);
      onSaved(saved);
    } catch (err: any) {
      setError(err.message ?? "שגיאה בשמירה");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="name">שם</Label>
        <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="description">תיאור</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={10}
          placeholder={"תגית קצרה\n\nפסקה ראשונה...\n\nפסקה שנייה...\n\nפסקת סיום..."}
        />
        <p className="text-xs text-muted-foreground">
          שורה ראשונה מוצגת כתגית קצרה מתחת לשם. הפרידו בין פסקאות בשורה ריקה.
        </p>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label>תמונות</Label>
        <div className="flex flex-wrap gap-3">
          {images.map((url) => (
            <div key={url} className="group relative h-24 w-20 overflow-hidden rounded-md border border-border">
              <img src={url} alt="" className="h-full w-full object-cover" />
              <button
                type="button"
                onClick={() => handleRemoveImage(url)}
                className="absolute inset-0 flex items-center justify-center bg-background/70 opacity-0 transition-opacity group-hover:opacity-100"
                aria-label="הסר תמונה"
              >
                <Trash2 className="h-5 w-5 text-destructive" />
              </button>
            </div>
          ))}

          <label
            className={cn(
              "flex h-24 w-20 cursor-pointer flex-col items-center justify-center gap-1 rounded-md border border-dashed border-border text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary",
              uploading && "pointer-events-none opacity-50",
            )}
          >
            {uploading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Upload className="h-5 w-5" />}
            <span className="text-[11px]">העלה</span>
            <input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleImageSelect}
              disabled={uploading}
            />
          </label>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label>תגיות עיר/אזור</Label>
        <div className="flex flex-col gap-3 rounded-md border border-border p-3">
          {REGIONS.map((region) => (
            <div key={region}>
              <p className="mb-1.5 text-xs font-semibold text-muted-foreground">{region}</p>
              <div className="flex flex-wrap gap-1.5">
                {TAGS.filter((t) => t.region === region).map((tag) => {
                  const isActive = tags.includes(tag.id);
                  return (
                    <button
                      type="button"
                      key={tag.id}
                      onClick={() => toggleTag(tag.id)}
                      className={cn(
                        "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                        isActive
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border bg-secondary/60 text-foreground hover:border-primary/50",
                      )}
                    >
                      {tag.label}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <Switch id="active" checked={active} onCheckedChange={setActive} />
          <Label htmlFor="active">מוצג בקטלוג</Label>
        </div>

        <div className="flex flex-1 flex-col gap-1.5">
          <Label htmlFor="order">סדר תצוגה</Label>
          <Input
            id="order"
            type="number"
            value={order}
            onChange={(e) => setOrder(Number(e.target.value))}
          />
        </div>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="flex justify-end gap-2 border-t border-border pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          ביטול
        </Button>
        <Button type="submit" disabled={saving || uploading}>
          {saving ? "שומר..." : "שמירה"}
        </Button>
      </div>
    </form>
  );
}
