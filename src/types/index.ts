export interface Girl {
  id: string;
  name: string;
  slug: string;
  description: string;
  images: string[];
  tags: string[];
  active: boolean;
  order: number;
  whatsappClicks: number;
  callClicks: number;
}

export interface Tag {
  id: string;
  label: string;
  region?: string;
}

// slug נגזר אוטומטית מהשם ע"י טריגר ב-DB - לא נדרש (ואפשר לדרוס במפורש אם צריך)
// whatsappClicks/callClicks מתחילים מ-0 אוטומטית ב-DB - לא נדרשים ביצירה
export type GirlInsert = Omit<Girl, "id" | "slug" | "whatsappClicks" | "callClicks"> & { slug?: string };
export type GirlUpdate = Partial<GirlInsert>;
