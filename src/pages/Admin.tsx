import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import Seo from "@/components/Seo";
import AdminLogin from "@/components/admin/AdminLogin";
import AdminDashboard from "@/components/admin/AdminDashboard";

export default function Admin() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="container flex min-h-[70vh] items-center justify-center">
        <Seo title="ניהול" description="אזור ניהול" path="/admin" noindex />
        <p className="text-muted-foreground">טוען...</p>
      </div>
    );
  }

  return (
    <>
      <Seo title="ניהול" description="אזור ניהול" path="/admin" noindex />
      {session ? <AdminDashboard /> : <AdminLogin />}
    </>
  );
}
