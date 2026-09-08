import type { Tag } from "@/types";

// רשימת תגיות עיר/אזור קבועה - לא מנוהלת דרך האדמין.
export const REGIONS = ["מרכז", "שרון/חיפה", "דרום", "ירושלים והסביבה"] as const;

export const TAGS: Tag[] = [
  // מרכז
  { id: "ramat-gan", label: "רמת גן", region: "מרכז" },
  { id: "rishon-lezion", label: "ראשון לציון", region: "מרכז" },
  { id: "tel-aviv", label: "תל אביב", region: "מרכז" },
  { id: "holon", label: "חולון", region: "מרכז" },

  // שרון/חיפה
  { id: "netanya", label: "נתניה", region: "שרון/חיפה" },
  { id: "hadera", label: "חדרה", region: "שרון/חיפה" },
  { id: "or-akiva", label: "אור עקיבא", region: "שרון/חיפה" },
  { id: "harish", label: "חריש", region: "שרון/חיפה" },

  // דרום
  { id: "ashdod", label: "אשדוד", region: "דרום" },
  { id: "yavne", label: "יבנה", region: "דרום" },
  { id: "ashkelon", label: "אשקלון", region: "דרום" },
  { id: "eilat", label: "אילת", region: "דרום" },
  { id: "sdot-micha", label: "שדות מיכה", region: "דרום" },

  // ירושלים והסביבה
  { id: "jerusalem", label: "ירושלים", region: "ירושלים והסביבה" },
  { id: "modiin", label: "מודיעין", region: "ירושלים והסביבה" },
];

export function getTagById(id: string): Tag | undefined {
  return TAGS.find((t) => t.id === id);
}

export function getTagsByRegion(region: string): Tag[] {
  return TAGS.filter((t) => t.region === region);
}
