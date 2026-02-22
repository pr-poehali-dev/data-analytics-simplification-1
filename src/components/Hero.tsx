import { motion } from "framer-motion";

interface HeroProps {
  username?: string;
  onShopClick?: () => void;
  welcomeText?: string;
  serverName?: string;
  primaryColor?: string;
}

const STATS = [
  { icon: "👥", label: "Игроков онлайн", value: "1,247" },
  { icon: "💎", label: "Предметов в магазине", value: "84" },
  { icon: "🛡️", label: "Довольных покупок", value: "32K+" },
];

export default function Hero({ username, onShopClick, welcomeText, serverName, primaryColor = "#4ade80" }: HeroProps) {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center pt-14 overflow-hidden">
      {/* Animated background grid */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: "linear-gradient(#4ade80 1px, transparent 1px), linear-gradient(90deg, #4ade80 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Floating blocks */}
      {["🧱", "💎", "🪵", "🪨", "⚙️", "🌿"].map((emoji, i) => (
        <motion.div
          key={i}
          className="absolute text-3xl md:text-4xl opacity-20 select-none pointer-events-none"
          style={{
            left: `${8 + i * 15}%`,
            top: `${15 + (i % 3) * 22}%`,
          }}
          animate={{
            y: [0, -20, 0],
            rotate: [0, i % 2 === 0 ? 10 : -10, 0],
          }}
          transition={{
            duration: 4 + i * 0.7,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.4,
          }}
        >
          {emoji}
        </motion.div>
      ))}

      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 text-xs font-bold uppercase tracking-widest"
            style={{ background: "rgba(74,222,128,0.1)", border: "1px solid rgba(74,222,128,0.3)", color: "#4ade80" }}
          >
            <motion.span animate={{ opacity: [1, 0, 1] }} transition={{ duration: 1.5, repeat: Infinity }}>●</motion.span>
            Сервер онлайн
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="font-mc text-5xl md:text-7xl lg:text-8xl font-black mb-4 leading-none"
          style={{
            background: "linear-gradient(135deg, #4ade80 0%, #22d3ee 50%, #a855f7 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            textShadow: "none",
          }}
        >
          CRAFT
          <br />
          STORE
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-slate-400 text-lg md:text-xl mb-8 max-w-lg mx-auto"
        >
          {username ? (
            <>Привет, <span className="font-bold" style={{ color: primaryColor }}>{username}</span>! Выбери себе предмет 👇</>
          ) : (
            welcomeText || "Лучший магазин предметов для Minecraft-сервера. Мечи, броня, привилегии и многое другое."
          )}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-3 justify-center mb-16"
        >
          <button
            onClick={onShopClick}
            className="mc-btn px-8 py-4 text-base font-bold uppercase tracking-widest text-black"
            style={{ background: primaryColor }}
          >
            🛒 Открыть магазин
          </button>
          <button
            className="mc-btn px-8 py-4 text-base font-bold uppercase tracking-widest text-green-400"
            style={{ background: "#1e293b", border: "2px solid #4ade80" }}
          >
            📖 Как играть
          </button>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="grid grid-cols-3 gap-4 max-w-lg mx-auto"
        >
          {STATS.map(({ icon, label, value }) => (
            <div key={label} className="mc-panel p-3 text-center">
              <div className="text-2xl mb-1">{icon}</div>
              <div className="text-green-400 font-bold text-lg font-mc">{value}</div>
              <div className="text-slate-500 text-xs">{label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}