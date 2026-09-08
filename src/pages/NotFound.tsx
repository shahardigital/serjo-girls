import { Link } from "react-router-dom";
import Seo from "@/components/Seo";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="container flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
      <Seo title="הדף לא נמצא" description="הדף המבוקש לא נמצא." noindex />
      <h1 className="text-3xl font-extrabold text-foreground">404</h1>
      <p className="text-muted-foreground">הדף שחיפשת לא קיים.</p>
      <Button asChild>
        <Link to="/">חזרה לדף הבית</Link>
      </Button>
    </div>
  );
}
