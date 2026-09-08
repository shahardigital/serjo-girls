import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

if (!isSupabaseConfigured) {
  console.error(
    "חסרים משתני סביבה VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY. ראה קובץ .env.example.",
  );
}

// כתובת placeholder תקינה כדי ש-createClient לא יזרוק חריגה כשעדיין אין חיבור אמיתי
// (למשל בזמן פיתוח מקומי לפני הקמת פרויקט Supabase). הקריאות בפועל ייכשלו בשקט
// ויוצגו כשגיאת טעינה רגילה במסך, במקום להפיל את כל האפליקציה.
export const supabase = createClient(
  supabaseUrl || "https://placeholder.supabase.co",
  supabaseAnonKey || "placeholder-anon-key",
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  },
);
