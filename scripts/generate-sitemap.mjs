// מייצר public/sitemap.xml עם כל הפרופילים הפעילים - רץ אוטומטית לפני כל build
// כדי שהמפה תמיד תשקף את הקטלוג העדכני.
import { createClient } from "@supabase/supabase-js";
import { writeFileSync, readFileSync, existsSync } from "fs";
import { fileURLToPath } from "url";
import path from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

// TODO: להחליף בדומיין הסופי לפני עלייה לאוויר (תואם ל-SITE_URL ב-src/components/Seo.tsx)
const SITE_URL = "https://example.com";

function loadEnv() {
  const envPath = path.join(root, ".env");
  const env = {};
  if (existsSync(envPath)) {
    for (const line of readFileSync(envPath, "utf-8").split("\n")) {
      const match = line.match(/^([A-Z_]+)=(.*)$/);
      if (match) env[match[1]] = match[2].trim();
    }
  }
  return env;
}

async function main() {
  const env = loadEnv();
  const url = env.VITE_SUPABASE_URL;
  const key = env.VITE_SUPABASE_ANON_KEY;

  const staticUrls = [
    { loc: "/", changefreq: "daily", priority: "1.0" },
    { loc: "/terms", changefreq: "monthly", priority: "0.3" },
  ];

  let girlUrls = [];
  if (url && key) {
    try {
      const supabase = createClient(url, key);
      const { data, error } = await supabase
        .from("girls")
        .select("slug, updated_at")
        .eq("active", true);
      if (error) throw error;
      girlUrls = (data ?? []).map((g) => ({
        loc: `/girl/${g.slug}`,
        lastmod: g.updated_at?.slice(0, 10),
        changefreq: "weekly",
        priority: "0.8",
      }));
    } catch (err) {
      console.warn("generate-sitemap: could not fetch girls, writing static-only sitemap:", err.message);
    }
  } else {
    console.warn("generate-sitemap: missing Supabase env vars, writing static-only sitemap");
  }

  const allUrls = [...staticUrls, ...girlUrls];
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls
  .map(
    (u) => `  <url>
    <loc>${SITE_URL}${u.loc}</loc>${u.lastmod ? `\n    <lastmod>${u.lastmod}</lastmod>` : ""}
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`,
  )
  .join("\n")}
</urlset>
`;

  writeFileSync(path.join(root, "public", "sitemap.xml"), xml, "utf-8");
  console.log(`generate-sitemap: wrote ${allUrls.length} URLs to public/sitemap.xml`);
}

main();
