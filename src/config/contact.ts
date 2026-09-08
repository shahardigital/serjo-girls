// פרטי יצירת קשר גלובליים - זהים לכל האתר, לא per-girl.
// זהה לשני האתרים הקיימים של הלקוח.
export const CONTACT_PHONE_DISPLAY = "054-914-0720";
export const CONTACT_PHONE_TEL = "0549140720";
export const CONTACT_PHONE_INTL = "972549140720";

export function buildWhatsAppLink(message: string): string {
  return `https://wa.me/${CONTACT_PHONE_INTL}?text=${encodeURIComponent(message)}`;
}

export function buildGirlWhatsAppLink(girlName: string): string {
  return buildWhatsAppLink(`מעוניין ב${girlName}`);
}

export function buildTelLink(): string {
  return `tel:${CONTACT_PHONE_TEL}`;
}
