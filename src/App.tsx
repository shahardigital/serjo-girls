import { Suspense, lazy } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { Toaster } from "sonner";
import { SiteSettingsProvider } from "@/context/SiteSettingsContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import StickyWhatsApp from "@/components/StickyWhatsApp";
import PromoBanner from "@/components/PromoBanner";
import ScrollToTop from "@/components/ScrollToTop";
import Home from "@/pages/Home";
import GirlDetail from "@/pages/GirlDetail";
import Terms from "@/pages/Terms";
import NotFound from "@/pages/NotFound";

// טעינה עצלה - קוד האדמין (טופס, דשבורד, הגדרות) נכנס ל-chunk נפרד ונטען רק
// כשמישהו בפועל נכנס ל-/admin, כדי שמבקרים רגילים לא יורידו אותו בלי צורך.
const Admin = lazy(() => import("@/pages/Admin"));

function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <PromoBanner />
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <StickyWhatsApp />
    </div>
  );
}

export default function App() {
  return (
    <HelmetProvider>
      <SiteSettingsProvider>
        <BrowserRouter>
          <ScrollToTop />
          <Toaster position="top-center" richColors dir="rtl" />
          <Routes>
            <Route
              path="/"
              element={
                <SiteLayout>
                  <Home />
                </SiteLayout>
              }
            />
            <Route
              path="/girl/:slug"
              element={
                <SiteLayout>
                  <GirlDetail />
                </SiteLayout>
              }
            />
            <Route
              path="/terms"
              element={
                <SiteLayout>
                  <Terms />
                </SiteLayout>
              }
            />
            <Route
              path="/admin"
              element={
                <Suspense fallback={null}>
                  <Admin />
                </Suspense>
              }
            />
            <Route
              path="*"
              element={
                <SiteLayout>
                  <NotFound />
                </SiteLayout>
              }
            />
          </Routes>
        </BrowserRouter>
      </SiteSettingsProvider>
    </HelmetProvider>
  );
}
