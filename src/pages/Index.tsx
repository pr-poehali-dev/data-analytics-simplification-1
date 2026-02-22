import { useRef } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Shop from "@/components/Shop";
import Featured from "@/components/Featured";
import Promo from "@/components/Promo";
import Footer from "@/components/Footer";

interface SiteSettings {
  serverName: string;
  serverIp: string;
  welcomeText: string;
  primaryColor: string;
}

interface IndexProps {
  username?: string;
  isAdmin?: boolean;
  onAdminClick?: () => void;
  settings?: SiteSettings;
}

export default function Index({ username, isAdmin, onAdminClick, settings }: IndexProps) {
  const shopRef = useRef<HTMLDivElement>(null);

  const scrollToShop = () => {
    shopRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const primaryColor = settings?.primaryColor || "#4ade80";

  return (
    <main className="min-h-screen" style={{ background: "#0f172a", "--mc-green": primaryColor } as React.CSSProperties}>
      <Header username={username} isAdmin={isAdmin} onAdminClick={onAdminClick} serverName={settings?.serverName} primaryColor={primaryColor} />
      <Hero username={username} onShopClick={scrollToShop} welcomeText={settings?.welcomeText} serverName={settings?.serverName} primaryColor={primaryColor} />
      <div ref={shopRef}>
        <Shop username={username} />
      </div>
      <Featured serverIp={settings?.serverIp} primaryColor={primaryColor} />
      <Promo />
      <Footer serverName={settings?.serverName} serverIp={settings?.serverIp} />
    </main>
  );
}
