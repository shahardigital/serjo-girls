export interface Girl {
  id: string;
  name: string;
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

export type GirlInsert = Omit<Girl, "id">;
export type GirlUpdate = Partial<GirlInsert>;
