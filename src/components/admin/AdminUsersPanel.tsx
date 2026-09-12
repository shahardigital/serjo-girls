import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Copy, ShieldPlus, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabase";

interface AdminRow {
  user_id: string;
  email: string;
  created_at: string;
}

export default function AdminUsersPanel() {
  const [admins, setAdmins] = useState<AdminRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [inviting, setInviting] = useState(false);
  const [newCredential, setNewCredential] = useState<{ email: string; password: string } | null>(null);

  async function loadAdmins() {
    setLoading(true);
    try {
      const { data, error } = await supabase.rpc("list_admins");
      if (error) throw error;
      setAdmins(data ?? []);
    } catch (err: any) {
      toast.error(err.message ?? "שגיאה בטעינת רשימת המנהלים");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAdmins();
  }, []);

  async function handleInvite(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setInviting(true);
    setNewCredential(null);
    try {
      const { data, error } = await supabase.functions.invoke("invite-admin", {
        body: { email: email.trim() },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      if (data.alreadyExisted) {
        toast.success("המשתמש כבר היה קיים - נוסף כמנהל בלי לשנות את הסיסמה שלו");
      } else {
        toast.success("מנהל חדש נוצר בהצלחה");
        setNewCredential({ email: data.email, password: data.tempPassword });
      }
      setEmail("");
      loadAdmins();
    } catch (err: any) {
      toast.error(err.message ?? "שגיאה בהוספת מנהל");
    } finally {
      setInviting(false);
    }
  }

  function copyPassword() {
    if (!newCredential) return;
    navigator.clipboard.writeText(newCredential.password);
    toast.success("הסיסמה הועתקה");
  }

  return (
    <section className="flex max-w-2xl flex-col gap-4 rounded-xl border border-border bg-card/40 p-5">
      <h2 className="flex items-center gap-2 font-semibold text-foreground">
        <ShieldPlus className="h-4 w-4 text-primary" />
        משתמשי מנהל
      </h2>
      <p className="-mt-2 text-xs text-muted-foreground">
        למי שיש גישה כאן יש שליטה מלאה על הקטלוג וההגדרות - הוסיפו רק אנשים שאתם סומכים עליהם.
      </p>

      {loading ? (
        <p className="text-sm text-muted-foreground">טוען...</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {admins.map((a) => (
            <li
              key={a.user_id}
              className="flex items-center gap-2 rounded-md border border-border bg-secondary/40 px-3 py-2 text-sm"
            >
              <UserRound className="h-4 w-4 shrink-0 text-muted-foreground" />
              <span className="text-foreground" dir="ltr">
                {a.email}
              </span>
            </li>
          ))}
        </ul>
      )}

      <form onSubmit={handleInvite} className="flex flex-col gap-1.5 border-t border-border pt-4">
        <Label htmlFor="newAdminEmail">הוספת מנהל חדש</Label>
        <div className="flex gap-2">
          <Input
            id="newAdminEmail"
            type="email"
            dir="ltr"
            placeholder="admin@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" disabled={inviting || !email.trim()}>
            {inviting ? "מוסיף..." : "הוספה"}
          </Button>
        </div>
      </form>

      {newCredential && (
        <div className="flex flex-col gap-2 rounded-md border border-primary/40 bg-primary/5 p-3 text-sm">
          <p className="font-medium text-foreground">
            נוצר משתמש עבור <span dir="ltr">{newCredential.email}</span> - שמרו את הסיסמה הזו, היא לא תוצג שוב:
          </p>
          <div className="flex items-center gap-2">
            <code dir="ltr" className="flex-1 rounded bg-secondary px-2 py-1.5 text-foreground">
              {newCredential.password}
            </code>
            <Button type="button" variant="outline" size="icon" onClick={copyPassword} aria-label="העתק סיסמה">
              <Copy className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            מומלץ שהמנהל החדש יחליף אותה לסיסמה משלו מיד אחרי ההתחברות הראשונה, בטאב הזה.
          </p>
        </div>
      )}
    </section>
  );
}
