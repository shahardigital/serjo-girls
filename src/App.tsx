import { BrowserRouter, Route, Routes } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { Toaster } from "sonner";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import StickyWhatsApp from "@/components/StickyWhatsApp";
import ScrollToTop from "@/components/ScrollToTop";
import Home from "@/pages/Home";
import GirlDetail from "@/pages/GirlDetail";
import Terms from "@/pages/Terms";
import Admin from "@/pages/Admin";
import NotFound from "@/pages/NotFound";

function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
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
          <Route path="/admin" element={<Admin />} />
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
    </HelmetProvider>
  );
}
