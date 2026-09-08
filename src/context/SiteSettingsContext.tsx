import { createContext, useCallback, useContext, useEffect, useState } from "react";
import {
  DEFAULT_SETTINGS,
  fetchSiteSettings,
  fillWhatsAppTemplate,
  type SiteSettings,
} from "@/lib/siteSettings";

interface SiteSettingsContextValue {
  settings: SiteSettings;
  loading: boolean;
  refresh: () => Promise<void>;
  buildTelLink: () => string;
  buildGirlWhatsAppLink: (girlName: string) => string;
}

const SiteSettingsContext = createContext<SiteSettingsContextValue | null>(null);

export function SiteSettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const data = await fetchSiteSettings();
      setSettings(data);
    } catch {
      // נשארים עם ברירת המחדל - האתר ממשיך לעבוד עם טלפון/וואטסאפ תקינים
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  function buildTelLink() {
    return `tel:${settings.phoneTel}`;
  }

  function buildGirlWhatsAppLink(girlName: string) {
    const message = fillWhatsAppTemplate(settings.whatsappTemplate, girlName);
    return `https://wa.me/${settings.phoneIntl}?text=${encodeURIComponent(message)}`;
  }

  return (
    <SiteSettingsContext.Provider value={{ settings, loading, refresh, buildTelLink, buildGirlWhatsAppLink }}>
      {children}
    </SiteSettingsContext.Provider>
  );
}

export function useSiteSettings(): SiteSettingsContextValue {
  const ctx = useContext(SiteSettingsContext);
  if (!ctx) throw new Error("useSiteSettings must be used within SiteSettingsProvider");
  return ctx;
}
