import { Sparkles } from "lucide-react";
import { useSiteSettings } from "@/context/SiteSettingsContext";

/** באנר הודעה/מבצע בראש האתר - מוצג רק כשמופעל ויש טקסט להצגה, ניתן לניהול מהאדמין. */
export default function PromoBanner() {
  const { settings } = useSiteSettings();

  if (!settings.bannerEnabled || !settings.bannerText.trim()) return null;

  return (
    <div className="relative overflow-hidden bg-gradient-to-l from-primary to-accent py-2 text-center text-sm font-semibold text-primary-foreground">
      <div className="container flex items-center justify-center gap-2">
        <Sparkles className="h-4 w-4 shrink-0" />
        <span>{settings.bannerText}</span>
      </div>
    </div>
  );
}
