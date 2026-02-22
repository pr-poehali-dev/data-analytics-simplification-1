import { useState, useEffect } from "react";
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
import { api } from "./lib/api";

const queryClient = new QueryClient();

interface User { username: string; isAdmin: boolean; }
interface SiteSettings {
  serverName: string;
  serverIp: string;
  welcomeText: string;
  primaryColor: string;
}

const DEFAULT_SETTINGS: SiteSettings = {
  serverName: "CraftStore",
  serverIp: "play.craftstore.ru",
  welcomeText: "Добро пожаловать в лучший Minecraft-магазин!",
  primaryColor: "#4ade80",
};

const App = () => {
  const [user, setUser] = useState<User | null>(null);
  const [showAdmin, setShowAdmin] = useState(false);
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);

  useEffect(() => {
    api.getSettings().then(res => {
      if (res.serverName) setSettings(res as SiteSettings);
    });
  }, []);

  const handleAuth = (u?: User) => {
    setUser(u ?? { username: "Гость", isAdmin: false });
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
              onSettingsChange={s => setSettings(s)}
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
                  settings={settings}
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
