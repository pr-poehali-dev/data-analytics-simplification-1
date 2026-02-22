import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface PromoCode {
  id: number;
  code: string;
  discount: number;
  usages: number;
  active: boolean;
}

interface ServerSettings {
  serverName: string;
  serverIp: string;
  welcomeText: string;
  primaryColor: string;
}

interface AdminPanelProps {
  onClose: () => void;
  onPromoChange?: (code: string, discount: number) => void;
}

const INIT_PROMOS: PromoCode[] = [
  { id: 1, code: "WELCOME20", discount: 20, usages: 42, active: true },
  { id: 2, code: "VIP50", discount: 50, usages: 8, active: true },
  { id: 3, code: "OLD30", discount: 30, usages: 120, active: false },
];

const INIT_SETTINGS: ServerSettings = {
  serverName: "CraftStore",
  serverIp: "play.craftstore.ru",
  welcomeText: "Добро пожаловать в лучший Minecraft-магазин!",
  primaryColor: "#4ade80",
};

type Tab = "promos" | "settings" | "stats";

export default function AdminPanel({ onClose, onPromoChange }: AdminPanelProps) {
  const [tab, setTab] = useState<Tab>("promos");
  const [promos, setPromos] = useState<PromoCode[]>(INIT_PROMOS);
  const [settings, setSettings] = useState<ServerSettings>(INIT_SETTINGS);
  const [newCode, setNewCode] = useState("");
  const [newDiscount, setNewDiscount] = useState("10");
  const [createError, setCreateError] = useState("");
  const [saved, setSaved] = useState(false);

  const createPromo = () => {
    if (!newCode.trim()) return setCreateError("Введите код");
    if (promos.find(p => p.code === newCode.toUpperCase())) return setCreateError("Такой код уже существует");
    const disc = parseInt(newDiscount);
    if (isNaN(disc) || disc < 1 || disc > 99) return setCreateError("Скидка от 1 до 99%");
    const promo: PromoCode = { id: Date.now(), code: newCode.toUpperCase(), discount: disc, usages: 0, active: true };
    setPromos(p => [...p, promo]);
    setNewCode("");
    setNewDiscount("10");
    setCreateError("");
    onPromoChange?.(promo.code, promo.discount);
  };

  const togglePromo = (id: number) => {
    setPromos(p => p.map(pr => pr.id === id ? { ...pr, active: !pr.active } : pr));
  };

  const deletePromo = (id: number) => {
    setPromos(p => p.filter(pr => pr.id !== id));
  };

  const saveSettings = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const TABS: { id: Tab; label: string; icon: string }[] = [
    { id: "promos", label: "Промокоды", icon: "🎟️" },
    { id: "settings", label: "Настройки", icon: "⚙️" },
    { id: "stats", label: "Статистика", icon: "📊" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-start justify-center px-4 py-6 overflow-y-auto"
      style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(6px)" }}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="w-full max-w-2xl my-auto"
        style={{ background: "#1e293b", border: "2px solid #fbbf24", boxShadow: "0 0 60px rgba(251,191,36,0.2)" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4" style={{ background: "#92400e", borderBottom: "2px solid #78350f" }}>
          <div className="flex items-center gap-3">
            <span className="text-2xl">👑</span>
            <div>
              <div className="font-mc text-white font-bold tracking-widest uppercase text-sm">Панель администратора</div>
              <div className="text-yellow-200 text-xs">Полный контроль над магазином</div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-yellow-200 hover:text-white text-xl transition-colors duration-150 w-8 h-8 flex items-center justify-center"
            style={{ background: "rgba(0,0,0,0.3)" }}
          >
            ✕
          </button>
        </div>

        {/* Tabs */}
        <div className="flex" style={{ borderBottom: "2px solid #334155" }}>
          {TABS.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className="flex-1 py-3 text-xs font-bold uppercase tracking-widest transition-all duration-150 flex items-center justify-center gap-2"
              style={{
                background: tab === t.id ? "#fbbf24" : "#0f172a",
                color: tab === t.id ? "#000" : "#64748b",
                borderBottom: tab === t.id ? "2px solid #f59e0b" : "none",
              }}
            >
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        <div className="p-6">
          <AnimatePresence mode="wait">
            {tab === "promos" && (
              <motion.div key="promos" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}>
                {/* Create promo */}
                <div className="mc-panel p-4 mb-5">
                  <h3 className="text-yellow-400 font-bold text-xs uppercase tracking-widest mb-3">➕ Создать промокод</h3>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      value={newCode}
                      onChange={e => setNewCode(e.target.value.toUpperCase())}
                      placeholder="КОД"
                      className="mc-input px-3 py-2 text-sm flex-1 uppercase tracking-widest"
                    />
                    <div className="flex items-center gap-1 shrink-0">
                      <input
                        type="number"
                        value={newDiscount}
                        onChange={e => setNewDiscount(e.target.value)}
                        min="1"
                        max="99"
                        className="mc-input px-3 py-2 text-sm w-20 text-center"
                      />
                      <span className="text-slate-400 text-sm font-bold">%</span>
                    </div>
                    <button onClick={createPromo} className="mc-btn px-4 py-2 text-xs font-bold uppercase tracking-widest text-black shrink-0" style={{ background: "#fbbf24" }}>
                      Создать
                    </button>
                  </div>
                  {createError && (
                    <p className="text-red-400 text-xs mt-2">⚠️ {createError}</p>
                  )}
                </div>

                {/* Promo list */}
                <h3 className="text-slate-400 font-bold text-xs uppercase tracking-widest mb-3">Активные промокоды</h3>
                <div className="flex flex-col gap-2">
                  {promos.map(p => (
                    <motion.div
                      key={p.id}
                      layout
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-3 px-4 py-3"
                      style={{
                        background: "#0f172a",
                        border: `2px solid ${p.active ? "#334155" : "#1e293b"}`,
                        opacity: p.active ? 1 : 0.5,
                      }}
                    >
                      <span className="text-lg">🎟️</span>
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-white text-sm tracking-widest">{p.code}</div>
                        <div className="text-slate-500 text-xs">Скидка {p.discount}% · Использований: {p.usages}</div>
                      </div>
                      <span
                        className="text-xs font-black px-2 py-0.5"
                        style={{ background: p.active ? "rgba(74,222,128,0.2)" : "rgba(100,116,139,0.1)", color: p.active ? "#4ade80" : "#64748b", border: `1px solid ${p.active ? "#4ade80" : "#334155"}` }}
                      >
                        {p.active ? "АКТИВЕН" : "ВЫКЛ"}
                      </span>
                      <button
                        onClick={() => togglePromo(p.id)}
                        className="text-xs px-2 py-1 font-bold transition-colors duration-150"
                        style={{ background: "#1e293b", color: p.active ? "#fbbf24" : "#4ade80", border: "1px solid #334155" }}
                      >
                        {p.active ? "Выкл" : "Вкл"}
                      </button>
                      <button
                        onClick={() => deletePromo(p.id)}
                        className="text-xs px-2 py-1 font-bold transition-colors duration-150"
                        style={{ background: "rgba(239,68,68,0.1)", color: "#ef4444", border: "1px solid rgba(239,68,68,0.3)" }}
                      >
                        ✕
                      </button>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {tab === "settings" && (
              <motion.div key="settings" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}>
                <div className="flex flex-col gap-4">
                  {[
                    { label: "Название сервера", key: "serverName" as const },
                    { label: "IP сервера", key: "serverIp" as const },
                    { label: "Приветственный текст", key: "welcomeText" as const },
                  ].map(({ label, key }) => (
                    <div key={key}>
                      <label className="block text-xs text-yellow-400 uppercase tracking-widest mb-1">{label}</label>
                      <input
                        value={settings[key]}
                        onChange={e => setSettings(s => ({ ...s, [key]: e.target.value }))}
                        className="mc-input w-full px-3 py-2 text-sm"
                      />
                    </div>
                  ))}

                  <div>
                    <label className="block text-xs text-yellow-400 uppercase tracking-widest mb-1">Основной цвет</label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={settings.primaryColor}
                        onChange={e => setSettings(s => ({ ...s, primaryColor: e.target.value }))}
                        className="w-12 h-10 cursor-pointer"
                        style={{ background: "none", border: "2px solid #334155" }}
                      />
                      <span className="text-slate-400 text-sm font-mono">{settings.primaryColor}</span>
                    </div>
                  </div>

                  <button
                    onClick={saveSettings}
                    className="mc-btn w-full py-3 text-sm font-bold uppercase tracking-widest text-black mt-2"
                    style={{ background: saved ? "#22d3ee" : "#fbbf24" }}
                  >
                    {saved ? "✅ Сохранено!" : "💾 Сохранить настройки"}
                  </button>
                </div>
              </motion.div>
            )}

            {tab === "stats" && (
              <motion.div key="stats" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  {[
                    { icon: "💰", label: "Продаж сегодня", value: "₽47,200", color: "#4ade80" },
                    { icon: "🛒", label: "Заказов сегодня", value: "138", color: "#22d3ee" },
                    { icon: "👥", label: "Уникальных игроков", value: "1,247", color: "#a855f7" },
                    { icon: "🎟️", label: "Промокодов активно", value: `${promos.filter(p => p.active).length}`, color: "#fbbf24" },
                  ].map(({ icon, label, value, color }) => (
                    <div key={label} className="mc-panel p-4 text-center">
                      <div className="text-3xl mb-2">{icon}</div>
                      <div className="font-black text-xl font-mc" style={{ color }}>{value}</div>
                      <div className="text-slate-500 text-xs mt-1">{label}</div>
                    </div>
                  ))}
                </div>

                <div className="mc-panel p-4">
                  <h3 className="text-slate-400 font-bold text-xs uppercase tracking-widest mb-3">Топ продаж</h3>
                  {[
                    { name: "⚔️ Меч Дракона", count: 48, pct: 90 },
                    { name: "💎 Алмазная броня", count: 31, pct: 60 },
                    { name: "🐉 Питомец Дракон", count: 24, pct: 46 },
                    { name: "👑 VIP статус", count: 21, pct: 40 },
                  ].map(({ name, count, pct }) => (
                    <div key={name} className="mb-3">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-slate-300">{name}</span>
                        <span className="text-slate-500">{count} шт.</span>
                      </div>
                      <div style={{ background: "#0f172a", height: 6 }}>
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{ duration: 0.8, ease: "easeOut" }}
                          style={{ background: "#4ade80", height: "100%" }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
}