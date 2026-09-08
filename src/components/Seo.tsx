import { Helmet } from "react-helmet-async";

const SITE_NAME = "Serjo Girls";
// נקבע ב-VITE_SITE_URL (ראה .env) - חובה לעדכן לדומיין האמיתי לפני עלייה לאוויר.
const SITE_URL = import.meta.env.VITE_SITE_URL || "https://example.com";

interface SeoProps {
  title: string;
  description: string;
  path?: string;
  image?: string;
  noindex?: boolean;
}

/** תגיות מטא בסיסיות (title/description/canonical/OG) לכל עמוד בנפרד. */
export default function Seo({ title, description, path = "/", image, noindex }: SeoProps) {
  // encodeURI ולא encodeURIComponent - שומר על "/" אך מקודד תווים לא-ASCII (סלאגים בעברית),
  // כדי שה-canonical/og:url יהיו URI תקניים.
  const canonical = encodeURI(`${SITE_URL}${path}`);
  const fullTitle = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical} />
      <meta name="robots" content={noindex ? "noindex, nofollow" : "index, follow"} />

      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content="he_IL" />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonical} />
      {image && <meta property="og:image" content={image} />}
    </Helmet>
  );
}
