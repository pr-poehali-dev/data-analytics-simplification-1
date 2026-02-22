import { useRef } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Shop from "@/components/Shop";
import Featured from "@/components/Featured";
import Promo from "@/components/Promo";
import Footer from "@/components/Footer";

interface IndexProps {
  username?: string;
  isAdmin?: boolean;
  onAdminClick?: () => void;
  promoCode?: string;
  promoDiscount?: number;
}

export default function Index({ username, isAdmin, onAdminClick, promoCode, promoDiscount }: IndexProps) {
  const shopRef = useRef<HTMLDivElement>(null);

  const scrollToShop = () => {
    shopRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <main className="min-h-screen" style={{ background: "#0f172a" }}>
      <Header username={username} isAdmin={isAdmin} onAdminClick={onAdminClick} />
      <Hero username={username} onShopClick={scrollToShop} />
      <div ref={shopRef}>
        <Shop promoCode={promoCode} promoDiscount={promoDiscount} />
      </div>
      <Featured />
      <Promo />
      <Footer />
    </main>
  );
}
