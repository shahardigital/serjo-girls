import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useSiteSettings } from "@/context/SiteSettingsContext";
import { updateSiteSettings } from "@/lib/siteSettings";

export default function SiteSettingsPanel() {
  const { settings, loading, refresh } = useSiteSettings();

  const [phoneDisplay, setPhoneDisplay] = useState("");
  const [phoneTel, setPhoneTel] = useState("");
  const [phoneIntl, setPhoneIntl] = useState("");
  const [whatsappTemplate, setWhatsappTemplate] = useState("");
  const [bannerEnabled, setBannerEnabled] = useState(false);
  const [bannerText, setBannerText] = useState("");
  const [termsContent, setTermsContent] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (loading) return;
    setPhoneDisplay(settings.phoneDisplay);
    setPhoneTel(settings.phoneTel);
    setPhoneIntl(settings.phoneIntl);
    setWhatsappTemplate(settings.whatsappTemplate);
    setBannerEnabled(settings.bannerEnabled);
    setBannerText(settings.bannerText);
    setTermsContent(settings.termsContent);
  }, [loading, settings]);

  async function handleSave() {
    setSaving(true);
    try {
      await updateSiteSettings({
        phoneDisplay,
        phoneTel,
        phoneIntl,
        whatsappTemplate,
        bannerEnabled,
        bannerText,
        termsContent,
      });
      await refresh();
      toast.success("ההגדרות נשמרו בהצלחה");
    } catch (err: any) {
      toast.error(err.message ?? "שגיאה בשמירת ההגדרות");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <p className="text-muted-foreground">טוען הגדרות...</p>;
  }

  return (
    <div className="flex max-w-2xl flex-col gap-8">
      <section className="flex flex-col gap-4 rounded-xl border border-border bg-card/40 p-5">
        <h2 className="font-semibold text-foreground">יצירת קשר גלובלית</h2>
        <p className="-mt-2 text-xs text-muted-foreground">
          המספר הזה מופיע בכל הכפתורים באתר (הדר, פוטר, כל הכרטיסיות, הירו) - שינוי כאן משנה את כולם בבת אחת.
        </p>

        <div className="grid gap-4 sm:grid-cols-3">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="phoneDisplay">טלפון לתצוגה</Label>
            <Input id="phoneDisplay" value={phoneDisplay} onChange={(e) => setPhoneDisplay(e.target.value)} dir="ltr" />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="phoneTel">טלפון לחיוג (ספרות בלבד)</Label>
            <Input id="phoneTel" value={phoneTel} onChange={(e) => setPhoneTel(e.target.value)} dir="ltr" />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="phoneIntl">טלפון בינלאומי (לוואטסאפ)</Label>
            <Input id="phoneIntl" value={phoneIntl} onChange={(e) => setPhoneIntl(e.target.value)} dir="ltr" />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="whatsappTemplate">תבנית הודעת וואטסאפ</Label>
          <Input
            id="whatsappTemplate"
            value={whatsappTemplate}
            onChange={(e) => setWhatsappTemplate(e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            השתמשו ב-<code className="rounded bg-secondary px-1">{"{שם}"}</code> - הוא יוחלף אוטומטית בשם החשפנית.
          </p>
        </div>
      </section>

      <section className="flex flex-col gap-4 rounded-xl border border-border bg-card/40 p-5">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-foreground">באנר הודעה בראש האתר</h2>
          <div className="flex items-center gap-2">
            <Switch id="bannerEnabled" checked={bannerEnabled} onCheckedChange={setBannerEnabled} />
            <Label htmlFor="bannerEnabled">מוצג</Label>
          </div>
        </div>
        <Input
          value={bannerText}
          onChange={(e) => setBannerText(e.target.value)}
          placeholder="לדוגמה: מבצע לזמן מוגבל - הזמינו עכשיו!"
        />
      </section>

      <section className="flex flex-col gap-4 rounded-xl border border-border bg-card/40 p-5">
        <h2 className="font-semibold text-foreground">תקנון אתר</h2>
        <p className="-mt-2 text-xs text-muted-foreground">
          כל שורה שמתחילה ב-<code className="rounded bg-secondary px-1">{"# "}</code> פותחת סעיף חדש עם כותרת.
          שאר הטקסט הוא גוף הסעיף.
        </p>
        <Textarea
          value={termsContent}
          onChange={(e) => setTermsContent(e.target.value)}
          rows={16}
          className="font-mono text-xs"
        />
      </section>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving}>
          <Save className="h-4 w-4" />
          {saving ? "שומר..." : "שמירת הגדרות"}
        </Button>
      </div>
    </div>
  );
}
