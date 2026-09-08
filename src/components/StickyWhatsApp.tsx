import { MessageCircle } from "lucide-react";
import { buildGirlWhatsAppLink } from "@/config/contact";

/** כפתור וואטסאפ צף, קבוע בתחתית המסך - נגיש מכל מקום באתר, לא רק מתוך הכרטיסיות. מוצג רק במובייל. */
export default function StickyWhatsApp() {
  return (
    <a
      href={buildGirlWhatsAppLink("")}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="שלח הודעה בוואטסאפ"
      className="fixed bottom-5 left-5 z-50 flex h-14 w-14 animate-pulse-ring items-center justify-center rounded-full bg-whatsapp text-white shadow-lg transition-transform hover:scale-105 md:hidden"
    >
      <MessageCircle className="h-7 w-7" fill="currentColor" />
    </a>
  );
}
