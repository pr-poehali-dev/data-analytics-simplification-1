import { motion } from "framer-motion";

const ITEMS_PREVIEW = [
  { emoji: "⚔️", name: "Меч Дракона", rarity: "legendary", color: "#fbbf24" },
  { emoji: "💎", name: "Алмазная броня", rarity: "legendary", color: "#fbbf24" },
  { emoji: "🐉", name: "Питомец Дракон", rarity: "legendary", color: "#fbbf24" },
  { emoji: "🪄", name: "Жезл молний", rarity: "epic", color: "#a855f7" },
  { emoji: "🛡️", name: "Щит Нефрита", rarity: "epic", color: "#a855f7" },
  { emoji: "🏹", name: "Лук снайпера", rarity: "rare", color: "#3b82f6" },
];

export default function Promo() {
  return (
    <div className="py-20 px-4" style={{ background: "#0a1628" }}>
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="font-mc text-3xl md:text-4xl font-black text-white mb-3">✨ ЛУЧШИЕ ПРЕДМЕТЫ</h2>
          <p className="text-slate-500 text-sm">Легендарное снаряжение для настоящих героев сервера</p>
        </motion.div>

        {/* Items showcase */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-12">
          {ITEMS_PREVIEW.map(({ emoji, name, rarity, color }, i) => (
            <motion.div
              key={name}
              initial={{ opacity: 0, scale: 0.85 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ scale: 1.05, y: -4 }}
              className="mc-panel p-4 text-center cursor-pointer"
              style={{ borderColor: color, boxShadow: `0 0 20px ${color}30` }}
            >
              <div className="text-5xl mb-3">{emoji}</div>
              <div className="text-white font-bold text-xs mb-1">{name}</div>
              <div className="text-xs font-bold uppercase tracking-widest" style={{ color }}>
                {rarity === "legendary" ? "★ Легендарный" : rarity === "epic" ? "◆ Эпический" : "● Редкий"}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Promo banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative overflow-hidden p-8 text-center"
          style={{ background: "#1e293b", border: "2px solid #fbbf24", boxShadow: "0 0 40px rgba(251,191,36,0.15)" }}
        >
          {/* Animated bg dots */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-10">
            {Array.from({ length: 12 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full"
                style={{
                  width: 4,
                  height: 4,
                  background: "#fbbf24",
                  left: `${8 + i * 8}%`,
                  top: `${20 + (i % 4) * 20}%`,
                }}
                animate={{ opacity: [0.2, 1, 0.2], scale: [1, 1.5, 1] }}
                transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
              />
            ))}
          </div>

          <div className="relative z-10">
            <div className="text-4xl mb-3">🎟️</div>
            <h3 className="font-mc text-2xl md:text-3xl font-black text-white mb-2">СКИДКА ДО 50%</h3>
            <p className="text-yellow-200 text-sm mb-4">Используй промокод <span className="font-black text-yellow-400 bg-black/30 px-2 py-0.5">VIP50</span> при покупке</p>
            <div className="flex flex-col sm:flex-row gap-2 justify-center items-center">
              <div className="text-slate-400 text-xs">Успей воспользоваться предложением!</div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
