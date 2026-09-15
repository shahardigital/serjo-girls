import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

// מסיר משתמש מרשימת האדמינים (ומוחק את חשבון ה-auth שלו לגמרי - אין לו כל שימוש
// אחר במערכת הזו). דורש service_role, לכן רץ רק כאן בשרת, לעולם לא בדפדפן.

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

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
      return new Response(JSON.stringify({ error: "רק אדמין קיים יכול להסיר אדמין" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const {
      data: { user: caller },
    } = await callerClient.auth.getUser();

    const { user_id } = await req.json();
    if (!user_id || typeof user_id !== "string") {
      return new Response(JSON.stringify({ error: "user_id חסר" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (caller && user_id === caller.id) {
      return new Response(JSON.stringify({ error: "אי אפשר להסיר את עצמך - בקש ממנהל אחר לעשות זאת" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const adminClient = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

    const { error: deleteAdminRowError } = await adminClient
      .from("admins")
      .delete()
      .eq("user_id", user_id);
    if (deleteAdminRowError) throw deleteAdminRowError;

    const { error: deleteUserError } = await adminClient.auth.admin.deleteUser(user_id);
    if (deleteUserError) throw deleteUserError;

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err instanceof Error ? err.message : "שגיאה לא ידועה" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
