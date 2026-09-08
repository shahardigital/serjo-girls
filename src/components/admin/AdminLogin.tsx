import { useState } from "react";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabase";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) setError("אימייל או סיסמה שגויים");
  }

  return (
    <div className="container flex min-h-[70vh] max-w-sm flex-col justify-center py-12">
      <div className="mb-6 flex flex-col items-center gap-2 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/15 text-primary">
          <Lock className="h-6 w-6" />
        </div>
        <h1 className="text-xl font-bold text-foreground">כניסת מנהל</h1>
        <p className="text-sm text-muted-foreground">התחברות לניהול הקטלוג</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="email">אימייל</Label>
          <Input
            id="email"
            type="email"
            dir="ltr"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="username"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="password">סיסמה</Label>
          <Input
            id="password"
            type="password"
            dir="ltr"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <Button type="submit" disabled={loading} className="mt-2">
          {loading ? "מתחבר..." : "התחברות"}
        </Button>
      </form>
    </div>
  );
}
