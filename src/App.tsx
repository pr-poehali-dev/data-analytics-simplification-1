import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AuthModal from "./components/AuthModal";
import AdminPanel from "./components/AdminPanel";

const queryClient = new QueryClient();

interface User {
  username: string;
  isAdmin: boolean;
}

const App = () => {
  const [user, setUser] = useState<User | null>(null);
  const [showAdmin, setShowAdmin] = useState(false);
  const [activePromo, setActivePromo] = useState({ code: "VIP50", discount: 50 });

  const handleAuth = (u?: User) => {
    if (u) setUser(u);
    else setUser({ username: "Гость", isAdmin: false });
  };

  const handlePromoChange = (code: string, discount: number) => {
    setActivePromo({ code, discount });
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AnimatePresence>
          {!user && <AuthModal onClose={handleAuth} />}
        </AnimatePresence>
        <AnimatePresence>
          {showAdmin && user?.isAdmin && (
            <AdminPanel
              onClose={() => setShowAdmin(false)}
              onPromoChange={handlePromoChange}
            />
          )}
        </AnimatePresence>
        <BrowserRouter>
          <Routes>
            <Route
              path="/"
              element={
                <Index
                  username={user?.username}
                  isAdmin={user?.isAdmin}
                  onAdminClick={() => setShowAdmin(true)}
                  promoCode={activePromo.code}
                  promoDiscount={activePromo.discount}
                />
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
