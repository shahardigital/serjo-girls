import { supabase } from "@/lib/supabase";

/**
 * מדווח על קליק בכפתור וואטסאפ/חיוג לחשפנית - "ירי ושכח", לא חוסם את הניווט
 * ולא מציג שגיאה למשתמש אם זה נכשל (זה רק סטטיסטיקה לאדמין).
 */
export function trackGirlClick(girlId: string, kind: "whatsapp" | "call") {
  supabase.rpc("increment_girl_click", { p_girl_id: girlId, p_kind: kind }).then(
    () => {},
    () => {},
  );
}
