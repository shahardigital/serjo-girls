import Seo from "@/components/Seo";

export default function Terms() {
  return (
    <div className="container max-w-3xl py-12 sm:py-16">
      <Seo
        title="תקנון אתר"
        description="תקנון השימוש באתר Serjo Girls - תנאי שימוש, גילאי שימוש ומדיניות פרטיות."
        path="/terms"
      />
      <h1 className="mb-8 text-3xl font-extrabold text-foreground">תקנון אתר</h1>

      <div className="space-y-6 text-sm leading-relaxed text-muted-foreground">
        <p>
          תוכן עמוד זה הוא placeholder זמני. יש להחליף בתקנון סופי שיסופק על ידי הלקוח /
          עורך דין לפני עליית האתר לאוויר.
        </p>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-foreground">1. כללי</h2>
          <p>שימוש באתר זה כפוף לתנאים המפורטים בתקנון זה. גלישה או שימוש באתר מהווים הסכמה לתנאים.</p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-foreground">2. גילאי שימוש</h2>
          <p>השירותים המוצגים באתר מיועדים לבגירים מגיל 18 ומעלה בלבד.</p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-foreground">3. דיסקרטיות ופרטיות</h2>
          <p>פרטי הפניות דרך האתר, הטלפון או הוואטסאפ נשמרים בדיסקרטיות מלאה ואינם מועברים לצד שלישי.</p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-foreground">4. יצירת קשר</h2>
          <p>לכל שאלה ניתן לפנות דרך פרטי הקשר המופיעים בתחתית האתר.</p>
        </section>
      </div>
    </div>
  );
}
