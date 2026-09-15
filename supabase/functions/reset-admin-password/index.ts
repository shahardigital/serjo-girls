import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

// קובע סיסמה חדשה וזמנית למנהל קיים (למשל כשהוא שכח את שלו). דורש service_role,
// לכן רץ רק כאן בשרת - לא בדפדפן.

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function randomPassword(): string {
  const bytes = new Uint8Array(18);
  crypto.getRandomValues(bytes);
  return btoa(String.fromCharCode(...bytes)).replace(/[+/=]/g, "").slice(0, 20);
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization") ?? "";
    const jwt = authHeader.replace("Bearer ", "");

    const callerClient = createClient(SUPABASE_URL, ANON_KEY, {
      global: { headers: { Authorization: `Bearer ${jwt}` } },
    });

    const { data: isAdmin, error: isAdminError } = await callerClient.rpc("is_admin");
    if (isAdminError || !isAdmin) {
      return new Response(JSON.stringify({ error: "רק אדמין קיים יכול לאפס סיסמה למנהל אחר" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { user_id } = await req.json();
    if (!user_id || typeof user_id !== "string") {
      return new Response(JSON.stringify({ error: "user_id חסר" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const adminClient = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

    // מוודא שהיעד הוא אכן אדמין ברשימה שלנו - לא ניתן לאפס סיסמה לכל user_id בפרויקט
    const { data: adminRow, error: adminRowError } = await adminClient
      .from("admins")
      .select("user_id")
      .eq("user_id", user_id)
      .maybeSingle();
    if (adminRowError) throw adminRowError;
    if (!adminRow) {
      return new Response(JSON.stringify({ error: "המשתמש הזה אינו ברשימת המנהלים" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const newPassword = randomPassword();
    const { error: updateError } = await adminClient.auth.admin.updateUserById(user_id, {
      password: newPassword,
    });
    if (updateError) throw updateError;

    return new Response(JSON.stringify({ success: true, password: newPassword }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err instanceof Error ? err.message : "שגיאה לא ידועה" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
