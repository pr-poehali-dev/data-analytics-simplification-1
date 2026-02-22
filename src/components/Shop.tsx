import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PurchaseModal from "@/components/PurchaseModal";

const CATEGORIES = ["Все", "Оружие", "Броня", "Привилегии", "Ресурсы", "Питомцы"];

const ITEMS = [
  { id: 1, emoji: "⚔️", name: "Меч Дракона", category: "Оружие", price: 299, oldPrice: 499, rarity: "legendary", desc: "Урон +500%, поджигает врагов", tag: "ХИТ" },
  { id: 2, emoji: "🛡️", name: "Щит Нефрита", category: "Броня", price: 199, oldPrice: null, rarity: "epic", desc: "Блокирует 80% урона", tag: null },
  { id: 3, emoji: "💎", name: "Алмазная броня", category: "Броня", price: 399, oldPrice: 599, rarity: "legendary", desc: "Полный сет + зачарования", tag: "СКИДКА" },
  { id: 4, emoji: "👑", name: "VIP статус", category: "Привилегии", price: 149, oldPrice: null, rarity: "rare", desc: "30 дней особых прав на сервере", tag: null },
  { id: 5, emoji: "🪄", name: "Жезл молний", category: "Оружие", price: 249, oldPrice: 349, rarity: "epic", desc: "Призывает молнию в точку удара", tag: "НОВИНКА" },
  { id: 6, emoji: "🐉", name: "Питомец Дракон", category: "Питомцы", price: 599, oldPrice: null, rarity: "legendary", desc: "Летающий дракон сопровождает тебя", tag: "РЕДКИЙ" },
  { id: 7, emoji: "🪨", name: "Запас алмазов", category: "Ресурсы", price: 89, oldPrice: null, rarity: "common", desc: "64 алмаза в инвентарь сразу", tag: null },
  { id: 8, emoji: "🏹", name: "Лук снайпера", category: "Оружие", price: 179, oldPrice: 220, rarity: "rare", desc: "+300% дальность, без разброса", tag: null },
  { id: 9, emoji: "🐺", name: "Питомец Волк", category: "Питомцы", price: 199, oldPrice: null, rarity: "rare", desc: "Защищает хозяина в бою", tag: null },
];

const RARITY_COLORS: Record<string, string> = {
  common: "#94a3b8", rare: "#3b82f6", epic: "#a855f7", legendary: "#fbbf24",
};
const RARITY_LABELS: Record<string, string> = {
  common: "Обычный", rare: "Редкий", epic: "Эпический", legendary: "Легендарный",
};

interface ShopProps {
  username?: string;
}

export default function Shop({ username = "Гость" }: ShopProps) {
  const [category, setCategory] = useState("Все");
  const [selectedItem, setSelectedItem] = useState<typeof ITEMS[0] | null>(null);
  const [purchasedIds, setPurchasedIds] = useState<number[]>([]);

  const filtered = ITEMS.filter(i => category === "Все" || i.category === category);

  const handleSuccess = () => {
    if (selectedItem) setPurchasedIds(ids => [...ids, selectedItem.id]);
  };

  return (
    <div id="shop" className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="font-mc text-3xl md:text-5xl font-black text-white mb-2">🛒 МАГАЗИН</h2>
          <p className="text-slate-500 text-sm">Выбери предмет и улучши своего персонажа</p>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-2 mb-8">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className="px-4 py-2 text-xs font-bold uppercase tracking-widest transition-all duration-150"
              style={{
                background: category === cat ? "#4ade80" : "#1e293b",
                color: category === cat ? "#000" : "#64748b",
                border: `2px solid ${category === cat ? "#4ade80" : "#334155"}`,
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Items grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence mode="popLayout">
            {filtered.map((item, i) => {
              const bought = purchasedIds.includes(item.id);
              return (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: i * 0.04 }}
                  className="mc-panel p-4 flex flex-col gap-3 transition-all duration-200"
                  style={{ borderColor: RARITY_COLORS[item.rarity] }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-4xl">{item.emoji}</div>
                      <div>
                        <div className="font-bold text-white text-sm leading-tight">{item.name}</div>
                        <div className="text-xs font-bold mt-0.5" style={{ color: RARITY_COLORS[item.rarity] }}>
                          {RARITY_LABELS[item.rarity]}
                        </div>
                      </div>
                    </div>
                    {item.tag && (
                      <span className="text-xs font-black px-2 py-0.5 text-black shrink-0"
                        style={{ background: item.tag === "РЕДКИЙ" ? "#fbbf24" : item.tag === "НОВИНКА" ? "#22d3ee" : "#4ade80" }}
                      >
                        {item.tag}
                      </span>
                    )}
                  </div>

                  <p className="text-slate-500 text-xs leading-relaxed">{item.desc}</p>

                  <div className="flex items-center justify-between mt-auto">
                    <div>
                      {item.oldPrice && (
                        <div className="text-slate-600 text-xs line-through">{item.oldPrice} ₽</div>
                      )}
                      <div className="text-white font-black text-lg">{item.price} ₽</div>
                    </div>
                    <button
                      onClick={() => !bought && setSelectedItem(item)}
                      className="mc-btn px-4 py-2 text-xs font-bold uppercase tracking-widest text-black"
                      style={{ background: bought ? "#334155" : "#4ade80", color: bought ? "#64748b" : "#000" }}
                    >
                      {bought ? "✅ Куплено" : "Купить"}
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      {/* Purchase modal */}
      <AnimatePresence>
        {selectedItem && (
          <PurchaseModal
            item={selectedItem}
            username={username}
            onClose={() => setSelectedItem(null)}
            onSuccess={handleSuccess}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
