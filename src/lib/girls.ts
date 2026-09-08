import { supabase } from "@/lib/supabase";
import type { Girl, GirlInsert, GirlUpdate } from "@/types";

const TABLE = "girls";
const BUCKET = "girls-images";

function fromRow(row: any): Girl {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description ?? "",
    images: row.images ?? [],
    tags: row.tags ?? [],
    active: row.active,
    order: row.order ?? 0,
    whatsappClicks: row.whatsapp_clicks ?? 0,
    callClicks: row.call_clicks ?? 0,
  };
}

/** קטלוג ציבורי - רק פרופילים פעילים, ממוינים לפי order. RLS דואג להגבלה בפועל. */
export async function fetchActiveGirls(): Promise<Girl[]> {
  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .eq("active", true)
    .order("order", { ascending: true });

  if (error) throw error;
  return (data ?? []).map(fromRow);
}

/** פרופיל בודד לפי slug - לעמוד הפרטים הציבורי. RLS מגביל ל-active=true. */
export async function fetchGirlBySlug(slug: string): Promise<Girl | null> {
  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .eq("slug", slug)
    .eq("active", true)
    .maybeSingle();

  if (error) throw error;
  return data ? fromRow(data) : null;
}

/** כל הפרופילים (פעילים ומוסתרים) - לשימוש האדמין בלבד, דורש session מאומת. */
export async function fetchAllGirls(): Promise<Girl[]> {
  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .order("order", { ascending: true });

  if (error) throw error;
  return (data ?? []).map(fromRow);
}

export async function createGirl(girl: GirlInsert): Promise<Girl> {
  const { data, error } = await supabase.from(TABLE).insert(girl).select().single();
  if (error) throw error;
  return fromRow(data);
}

export async function updateGirl(id: string, patch: GirlUpdate): Promise<Girl> {
  const { data, error } = await supabase
    .from(TABLE)
    .update(patch)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return fromRow(data);
}

export async function deleteGirl(id: string): Promise<void> {
  // מנקה קודם את כל קבצי התמונות שלה מה-Storage, כדי לא להשאיר אותם יתומים
  const { data: files } = await supabase.storage.from(BUCKET).list(id);
  if (files && files.length > 0) {
    await supabase.storage.from(BUCKET).remove(files.map((f) => `${id}/${f.name}`));
  }

  const { error } = await supabase.from(TABLE).delete().eq("id", id);
  if (error) throw error;
}

/** מעלה תמונה ל-Storage ומחזיר URL ציבורי. */
export async function uploadGirlImage(file: File, girlId: string): Promise<string> {
  const ext = file.name.split(".").pop();
  const path = `${girlId}/${crypto.randomUUID()}.${ext}`;

  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    cacheControl: "3600",
    upsert: false,
  });
  if (error) throw error;

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

export async function deleteGirlImage(url: string): Promise<void> {
  const marker = `/object/public/${BUCKET}/`;
  const idx = url.indexOf(marker);
  if (idx === -1) return;
  const path = url.slice(idx + marker.length);
  await supabase.storage.from(BUCKET).remove([path]);
}
