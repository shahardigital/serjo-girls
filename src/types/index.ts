export interface Girl {
  id: string;
  name: string;
  slug: string;
  description: string;
  images: string[];
  tags: string[];
  active: boolean;
  order: number;
}

export interface Tag {
  id: string;
  label: string;
  region?: string;
}

// slug נגזר אוטומטית מהשם ע"י טריגר ב-DB - לא נדרש (ואפשר לדרוס במפורש אם צריך)
export type GirlInsert = Omit<Girl, "id" | "slug"> & { slug?: string };
export type GirlUpdate = Partial<GirlInsert>;
