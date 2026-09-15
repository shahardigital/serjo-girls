import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Copy, KeyRound, ShieldPlus, Trash2, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ConfirmDialog from "@/components/ConfirmDialog";
import { supabase } from "@/lib/supabase";

interface AdminRow {
  user_id: string;
  email: string;
  created_at: string;
}

export default function AdminUsersPanel() {
  const [admins, setAdmins] = useState<AdminRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [inviting, setInviting] = useState(false);
  const [resettingId, setResettingId] = useState<string | null>(null);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [pendingRemove, setPendingRemove] = useState<AdminRow | null>(null);
  const [newCredential, setNewCredential] = useState<{ email: string; password: string } | null>(null);

  async function loadAdmins() {
    setLoading(true);
    try {
      const [{ data, error }, { data: userData }] = await Promise.all([
        supabase.rpc("list_admins"),
        supabase.auth.getUser(),
      ]);
      if (error) throw error;
      setAdmins(data ?? []);
      setCurrentUserId(userData.user?.id ?? null);
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

  async function handleResetPassword(admin: AdminRow) {
    setResettingId(admin.user_id);
    setNewCredential(null);
    try {
      const { data, error } = await supabase.functions.invoke("reset-admin-password", {
        body: { user_id: admin.user_id },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      toast.success("סיסמה חדשה נוצרה בהצלחה");
      setNewCredential({ email: admin.email, password: data.password });
    } catch (err: any) {
      toast.error(err.message ?? "שגיאה באיפוס הסיסמה");
    } finally {
      setResettingId(null);
    }
  }

  async function handleRemoveConfirmed() {
    if (!pendingRemove) return;
    const target = pendingRemove;
    setPendingRemove(null);
    setRemovingId(target.user_id);
    try {
      const { data, error } = await supabase.functions.invoke("remove-admin", {
        body: { user_id: target.user_id },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      toast.success("המנהל הוסר בהצלחה");
      loadAdmins();
    } catch (err: any) {
      toast.error(err.message ?? "שגיאה בהסרת המנהל");
    } finally {
      setRemovingId(null);
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
          {admins.map((a) => {
            const isSelf = a.user_id === currentUserId;
            return (
              <li
                key={a.user_id}
                className="flex items-center gap-2 rounded-md border border-border bg-secondary/40 px-3 py-2 text-sm"
              >
                <UserRound className="h-4 w-4 shrink-0 text-muted-foreground" />
                <span className="flex-1 text-foreground" dir="ltr">
                  {a.email}
                </span>
                {isSelf && <span className="text-xs text-muted-foreground">(אתה)</span>}
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => handleResetPassword(a)}
                  disabled={resettingId === a.user_id}
                  aria-label={`איפוס סיסמה ל${a.email}`}
                  title="איפוס סיסמה"
                >
                  <KeyRound className="h-4 w-4" />
                </Button>
                {!isSelf && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => setPendingRemove(a)}
                    disabled={removingId === a.user_id}
                    aria-label={`הסרת ${a.email}`}
                    title="הסרת מנהל"
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                )}
              </li>
            );
          })}
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
            סיסמה עבור <span dir="ltr">{newCredential.email}</span> - שמרו אותה, היא לא תוצג שוב:
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
            מומלץ שהמנהל יחליף אותה לסיסמה משלו מיד אחרי ההתחברות, בטאב הזה.
          </p>
        </div>
      )}

      <ConfirmDialog
        open={pendingRemove !== null}
        title="הסרת מנהל"
        description={pendingRemove ? `להסיר לצמיתות את הגישה של "${pendingRemove.email}"? הפעולה תמחק את המשתמש לחלוטין.` : ""}
        confirmLabel="הסרה"
        onConfirm={handleRemoveConfirmed}
        onCancel={() => setPendingRemove(null)}
      />
    </section>
  );
}
