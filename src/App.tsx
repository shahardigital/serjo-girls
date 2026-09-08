import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster } from "sonner";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import StickyWhatsApp from "@/components/StickyWhatsApp";
import Home from "@/pages/Home";
import Terms from "@/pages/Terms";
import Admin from "@/pages/Admin";

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
    <BrowserRouter>
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
          path="/terms"
          element={
            <SiteLayout>
              <Terms />
            </SiteLayout>
          }
        />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </BrowserRouter>
  );
}
