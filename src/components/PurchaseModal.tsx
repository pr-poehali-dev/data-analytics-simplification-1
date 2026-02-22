import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "@/lib/api";

interface Item {
  id: number;
  emoji: string;
  name: string;
  price: number;
  rarity: string;
}

interface PurchaseModalProps {
  item: Item;
  username: string;
  onClose: () => void;
  onSuccess: () => void;
}

const RARITY_COLORS: Record<string, string> = {
  common: "#94a3b8",
  rare: "#3b82f6",
  epic: "#a855f7",
  legendary: "#fbbf24",
};
const RARITY_LABELS: Record<string, string> = {
  common: "Обычный", rare: "Редкий", epic: "Эпический", legendary: "Легендарный",
};

export default function PurchaseModal({ item, username, onClose, onSuccess }: PurchaseModalProps) {
  const [promo, setPromo] = useState("");
  const [discount, setDiscount] = useState(0);
  const [promoStatus, setPromoStatus] = useState<"idle" | "ok" | "error">("idle");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const finalPrice = discount > 0 ? Math.max(0, Math.round(item.price * (1 - discount / 100))) : item.price;
  const isFree = finalPrice === 0;

  const checkPromo = async () => {
    if (!promo.trim()) return;
    const res = await api.validatePromo(promo);
    if (res.valid) {
      setDiscount(res.discount);
      setPromoStatus("ok");
    } else {
      setDiscount(0);
      setPromoStatus("error");
    }
  };

  const handleBuy = async () => {
    setLoading(true);
    setError("");
    const res = await api.purchase({
      username,
      item_id: item.id,
      item_name: item.name,
      item_emoji: item.emoji,
      original_price: item.price,
      promo_code: promoStatus === "ok" ? promo : undefined,
    });
    setLoading(false);
    if (res.purchase_id) {
      setSuccess(true);
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 2200);
    } else {
      setError(res.error || "Ошибка при покупке");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(6px)" }}
      onClick={e => e.target === e.currentTarget && !success && onClose()}
    >
      <motion.div
        initial={{ scale: 0.88, opacity: 0, y: 24 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.88, opacity: 0 }}
        transition={{ type: "spring", stiffness: 280, damping: 24 }}
        className="w-full max-w-sm"
        style={{
          background: "#1e293b",
          border: `2px solid ${RARITY_COLORS[item.rarity]}`,
          boxShadow: `0 0 60px ${RARITY_COLORS[item.rarity]}30`,
        }}
      >
        <AnimatePresence mode="wait">
          {success ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center py-14 px-6 text-center"
            >
              <motion.div
                animate={{ rotate: [0, -10, 10, -10, 10, 0], scale: [1, 1.2, 1] }}
                transition={{ duration: 0.6 }}
                className="text-6xl mb-4"
              >
                {item.emoji}
              </motion.div>
              <div className="text-green-400 font-black text-2xl font-mc mb-2">КУПЛЕНО!</div>
              <div className="text-slate-400 text-sm">
                <span className="text-green-400 font-bold">{item.name}</span> появится в инвентаре в течение 5 секунд
              </div>
              {isFree && (
                <div className="mt-3 text-xs px-3 py-1 font-bold" style={{ background: "rgba(74,222,128,0.1)", color: "#4ade80", border: "1px solid #4ade80" }}>
                  🎁 Получено БЕСПЛАТНО!
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4" style={{ background: "#0f172a", borderBottom: `2px solid ${RARITY_COLORS[item.rarity]}` }}>
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{item.emoji}</span>
                  <div>
                    <div className="text-white font-bold text-sm">{item.name}</div>
                    <div className="text-xs font-bold" style={{ color: RARITY_COLORS[item.rarity] }}>{RARITY_LABELS[item.rarity]}</div>
                  </div>
                </div>
                <button onClick={onClose} className="text-slate-500 hover:text-white w-7 h-7 flex items-center justify-center text-lg transition-colors">✕</button>
              </div>

              <div className="p-5 flex flex-col gap-4">
                {/* Player */}
                <div className="flex items-center gap-2 px-3 py-2 text-xs" style={{ background: "#0f172a", border: "1px solid #334155" }}>
                  <span className="text-green-400">▶</span>
                  <span className="text-slate-400">Покупатель:</span>
                  <span className="text-white font-bold">{username}</span>
                </div>

                {/* Promo */}
                <div>
                  <label className="block text-xs text-yellow-400 uppercase tracking-widest mb-1.5">🎟️ Промокод (необязательно)</label>
                  <div className="flex gap-2">
                    <input
                      value={promo}
                      onChange={e => { setPromo(e.target.value.toUpperCase()); setPromoStatus("idle"); setDiscount(0); }}
                      placeholder="ВВЕДИТЕ КОД"
                      className="mc-input flex-1 px-3 py-2 text-sm uppercase tracking-widest"
                    />
                    <button
                      onClick={checkPromo}
                      className="mc-btn px-3 py-2 text-xs font-bold text-black shrink-0"
                      style={{ background: "#fbbf24" }}
                    >
                      OK
                    </button>
                  </div>
                  {promoStatus === "ok" && (
                    <p className="text-green-400 text-xs mt-1 font-bold">✅ Скидка {discount}% применена!</p>
                  )}
                  {promoStatus === "error" && (
                    <p className="text-red-400 text-xs mt-1">❌ Промокод не найден</p>
                  )}
                </div>

                {/* Price */}
                <div className="mc-panel p-4 flex items-center justify-between">
                  <div>
                    <div className="text-slate-500 text-xs uppercase tracking-widest mb-1">Итого к оплате</div>
                    <div className="flex items-baseline gap-2">
                      <span className="font-black text-3xl font-mc" style={{ color: isFree ? "#4ade80" : "white" }}>
                        {isFree ? "БЕСПЛАТНО" : `${finalPrice} ₽`}
                      </span>
                      {discount > 0 && !isFree && (
                        <span className="text-slate-600 text-base line-through">{item.price} ₽</span>
                      )}
                    </div>
                  </div>
                  {discount > 0 && (
                    <div className="text-black text-sm font-black px-3 py-1" style={{ background: "#4ade80" }}>
                      -{discount}%
                    </div>
                  )}
                </div>

                {error && (
                  <div className="text-red-400 text-xs px-3 py-2" style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)" }}>
                    ⚠️ {error}
                  </div>
                )}

                {/* Buy button */}
                <button
                  onClick={handleBuy}
                  disabled={loading}
                  className="mc-btn w-full py-4 text-base font-black uppercase tracking-widest text-black transition-all duration-200"
                  style={{ background: loading ? "#334155" : isFree ? "#4ade80" : "#fbbf24" }}
                >
                  {loading ? "⏳ Обработка..." : isFree ? "🎁 Получить бесплатно!" : `⚔️ Купить за ${finalPrice} ₽`}
                </button>

                <p className="text-center text-slate-600 text-xs">
                  Предмет поступит в инвентарь через 5 секунд после оплаты
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
