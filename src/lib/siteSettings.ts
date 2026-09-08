import { supabase } from "@/lib/supabase";

export interface SiteSettings {
  id: string;
  phoneDisplay: string;
  phoneTel: string;
  phoneIntl: string;
  whatsappTemplate: string;
  bannerEnabled: boolean;
  bannerText: string;
  termsContent: string;
}

const TABLE = "site_settings";

// ברירת מחדל למקרה שהטעינה נכשלת - כדי שהאתר לעולם לא יישבר בלי טלפון/וואטסאפ
export const DEFAULT_SETTINGS: SiteSettings = {
  id: "default",
  phoneDisplay: "054-914-0720",
  phoneTel: "0549140720",
  phoneIntl: "972549140720",
  whatsappTemplate: "מעוניין ב{שם}",
  bannerEnabled: false,
  bannerText: "",
  termsContent: "",
};

function fromRow(row: any): SiteSettings {
  return {
    id: row.id,
    phoneDisplay: row.phone_display,
    phoneTel: row.phone_tel,
    phoneIntl: row.phone_intl,
    whatsappTemplate: row.whatsapp_template,
    bannerEnabled: row.banner_enabled,
    bannerText: row.banner_text ?? "",
    termsContent: row.terms_content ?? "",
  };
}

export async function fetchSiteSettings(): Promise<SiteSettings> {
  const { data, error } = await supabase.from(TABLE).select("*").eq("id", "default").maybeSingle();
  if (error) throw error;
  return data ? fromRow(data) : DEFAULT_SETTINGS;
}

export async function updateSiteSettings(patch: Partial<Omit<SiteSettings, "id">>): Promise<SiteSettings> {
  const dbPatch: Record<string, unknown> = {};
  if (patch.phoneDisplay !== undefined) dbPatch.phone_display = patch.phoneDisplay;
  if (patch.phoneTel !== undefined) dbPatch.phone_tel = patch.phoneTel;
  if (patch.phoneIntl !== undefined) dbPatch.phone_intl = patch.phoneIntl;
  if (patch.whatsappTemplate !== undefined) dbPatch.whatsapp_template = patch.whatsappTemplate;
  if (patch.bannerEnabled !== undefined) dbPatch.banner_enabled = patch.bannerEnabled;
  if (patch.bannerText !== undefined) dbPatch.banner_text = patch.bannerText;
  if (patch.termsContent !== undefined) dbPatch.terms_content = patch.termsContent;

  const { data, error } = await supabase
    .from(TABLE)
    .update(dbPatch)
    .eq("id", "default")
    .select()
    .single();
  if (error) throw error;
  return fromRow(data);
}

/** בונה הודעת וואטסאפ מהתבנית הגלובלית, מחליף {שם} בשם החשפנית (או מסיר את הביטוי אם אין שם). */
export function fillWhatsAppTemplate(template: string, girlName: string): string {
  if (!girlName) return template.replace("{שם}", "").replace(/\s+/g, " ").trim();
  return template.replace("{שם}", girlName);
}
