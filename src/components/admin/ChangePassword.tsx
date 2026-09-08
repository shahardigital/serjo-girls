import { useState } from "react";
import { toast } from "sonner";
import { KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabase";

export default function ChangePassword() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password.length < 8) {
      toast.error("הסיסמה חייבת להכיל לפחות 8 תווים");
      return;
    }
    if (password !== confirm) {
      toast.error("הסיסמאות אינן תואמות");
      return;
    }

    setSaving(true);
    const { error } = await supabase.auth.updateUser({ password });
    setSaving(false);

    if (error) {
      toast.error(error.message ?? "שגיאה בעדכון הסיסמה");
      return;
    }
    toast.success("הסיסמה עודכנה בהצלחה");
    setPassword("");
    setConfirm("");
  }

  return (
    <section className="flex max-w-2xl flex-col gap-4 rounded-xl border border-border bg-card/40 p-5">
      <h2 className="flex items-center gap-2 font-semibold text-foreground">
        <KeyRound className="h-4 w-4 text-primary" />
        החלפת סיסמת מנהל
      </h2>
      <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="newPassword">סיסמה חדשה</Label>
          <Input
            id="newPassword"
            type="password"
            dir="ltr"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="confirmPassword">אימות סיסמה</Label>
          <Input
            id="confirmPassword"
            type="password"
            dir="ltr"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            autoComplete="new-password"
          />
        </div>
        <div className="sm:col-span-2">
          <Button type="submit" disabled={saving}>
            {saving ? "מעדכן..." : "עדכון סיסמה"}
          </Button>
        </div>
      </form>
    </section>
  );
}
