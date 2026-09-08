import { Link } from "react-router-dom";
import { ChevronLeft, FileText, Lock, MessageCircle, ShieldCheck } from "lucide-react";
import Seo from "@/components/Seo";

const SECTIONS = [
  {
    icon: FileText,
    title: "1. כללי",
    body: "שימוש באתר זה כפוף לתנאים המפורטים בתקנון זה. גלישה או שימוש באתר מהווים הסכמה לתנאים.",
  },
  {
    icon: ShieldCheck,
    title: "2. גילאי שימוש",
    body: "השירותים המוצגים באתר מיועדים לבגירים מגיל 18 ומעלה בלבד.",
  },
  {
    icon: Lock,
    title: "3. דיסקרטיות ופרטיות",
    body: "פרטי הפניות דרך האתר, הטלפון או הוואטסאפ נשמרים בדיסקרטיות מלאה ואינם מועברים לצד שלישי.",
  },
  {
    icon: MessageCircle,
    title: "4. יצירת קשר",
    body: "לכל שאלה ניתן לפנות דרך פרטי הקשר המופיעים בתחתית האתר.",
  },
];

export default function Terms() {
  return (
    <div className="container max-w-2xl py-12 sm:py-16">
      <Seo
        title="תקנון אתר"
        description="תקנון השימוש באתר Serjo Girls - תנאי שימוש, גילאי שימוש ומדיניות פרטיות."
        path="/terms"
      />

      <nav aria-label="breadcrumb" className="mb-6 flex items-center gap-1.5 text-sm text-muted-foreground">
        <Link to="/" className="transition-colors hover:text-primary">
          בית
        </Link>
        <ChevronLeft className="h-3.5 w-3.5" />
        <span className="text-foreground">תקנון אתר</span>
      </nav>

      <h1 className="mb-2 text-3xl font-extrabold text-foreground sm:text-4xl">תקנון אתר</h1>
      <p className="mb-8 text-sm text-muted-foreground">עודכן לאחרונה: {new Date().toLocaleDateString("he-IL")}</p>

      <div className="mb-8 rounded-xl border border-dashed border-border bg-card/40 p-4 text-sm leading-relaxed text-muted-foreground">
        תוכן עמוד זה הוא placeholder זמני. יש להחליף בתקנון סופי שיסופק על ידי הלקוח / עורך דין
        לפני עליית האתר לאוויר.
      </div>

      <div className="flex flex-col gap-4">
        {SECTIONS.map(({ icon: Icon, title, body }) => (
          <section
            key={title}
            className="flex gap-4 rounded-xl border border-border bg-card/40 p-5 transition-colors hover:border-primary/30"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <h2 className="mb-1.5 font-semibold text-foreground">{title}</h2>
              <p className="text-sm leading-relaxed text-muted-foreground">{body}</p>
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
