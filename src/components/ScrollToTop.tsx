import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/** גולל לראש הדף בכל ניווט לנתיב חדש (למשל מכרטיסייה לעמוד פרטים), פרט לניווט עם hash (עוגן פנימי). */
export default function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) return;
    window.scrollTo(0, 0);
  }, [pathname, hash]);

  return null;
}
