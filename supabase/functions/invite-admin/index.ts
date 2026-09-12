import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

// פונקציה זו רצה בצד השרת בלבד ומחזיקה את ה-service_role key - היא לעולם לא נגישה מהדפדפן.
// זו הדרך הבטוחה היחידה להוסיף משתמש אדמין חדש דרך ה-UI בלי לחשוף את המפתח הזה בקוד הלקוח.

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

    // לקוח שפועל "בתור" המשתמש שקורא - בודק שהוא אכן אדמין דרך פונקציית is_admin()
    // שכבר משמשת את מדיניות ה-RLS בטבלאות girls/site_settings.
    const callerClient = createClient(SUPABASE_URL, ANON_KEY, {
      global: { headers: { Authorization: `Bearer ${jwt}` } },
    });

    const { data: isAdmin, error: isAdminError } = await callerClient.rpc("is_admin");
    if (isAdminError || !isAdmin) {
      return new Response(JSON.stringify({ error: "רק אדמין קיים יכול להוסיף אדמין נוסף" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { email } = await req.json();
    if (!email || typeof email !== "string" || !email.includes("@")) {
      return new Response(JSON.stringify({ error: "כתובת אימייל לא תקינה" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // לקוח עם service_role - היחיד שיכול ליצור משתמשים/לגשת ל-auth admin API. לא נחשף ללקוח בשום שלב.
    const adminClient = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

    let userId: string;
    let tempPassword: string | null = null;
    let alreadyExisted = false;

    const password = randomPassword();
    const { data: created, error: createError } = await adminClient.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    if (createError) {
      // המשתמש כבר קיים - נאתר אותו ונוסיף אותו לרשימת האדמינים בלי לגעת בססמה שלו.
      if (createError.message?.toLowerCase().includes("already been registered") || createError.status === 422) {
        const { data: list, error: listError } = await adminClient.auth.admin.listUsers();
        if (listError) throw listError;
        const existing = list.users.find((u) => u.email?.toLowerCase() === email.toLowerCase());
        if (!existing) {
          return new Response(JSON.stringify({ error: "שגיאה באיתור המשתמש הקיים" }), {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        userId = existing.id;
        alreadyExisted = true;
      } else {
        throw createError;
      }
    } else {
      userId = created.user.id;
      tempPassword = password;
    }

    const { error: insertError } = await adminClient
      .from("admins")
      .upsert({ user_id: userId }, { onConflict: "user_id" });
    if (insertError) throw insertError;

    return new Response(
      JSON.stringify({ success: true, email, tempPassword, alreadyExisted }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err) {
    return new Response(JSON.stringify({ error: err instanceof Error ? err.message : "שגיאה לא ידועה" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
