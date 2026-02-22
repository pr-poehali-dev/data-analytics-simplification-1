import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "@/lib/api";

interface PromoCode {
  id: number;
  code: string;
  discount: number;
  usages: number;
  active: boolean;
}

interface Stats {
  today: { count: number; revenue: number };
  total: { count: number; revenue: number };
  unique_players: number;
  active_promos: number;
  top_items: { id: number; name: string; emoji: string; count: number }[];
  daily: { day: string; count: number; revenue: number }[];
}

interface SiteSettings {
  serverName: string;
  serverIp: string;
  welcomeText: string;
  primaryColor: string;
}

interface AdminPanelProps {
  onClose: () => void;
  onSettingsChange?: (s: SiteSettings) => void;
}

type Tab = "promos" | "settings" | "stats";

export default function AdminPanel({ onClose, onSettingsChange }: AdminPanelProps) {
  const [tab, setTab] = useState<Tab>("promos");
  const [promos, setPromos] = useState<PromoCode[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [settings, setSettings] = useState<SiteSettings>({
    serverName: "CraftStore",
    serverIp: "play.craftstore.ru",
    welcomeText: "Добро пожаловать в лучший Minecraft-магазин!",
    primaryColor: "#4ade80",
  });
  const [newCode, setNewCode] = useState("");
  const [newDiscount, setNewDiscount] = useState("10");
  const [createError, setCreateError] = useState("");
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    setLoading(true);
    const [promosRes, statsRes, settingsRes] = await Promise.all([
      api.getPromos(),
      api.getStats(),
      api.getSettings(),
    ]);
    if (promosRes.promos) setPromos(promosRes.promos);
    if (statsRes.today) setStats(statsRes);
    if (settingsRes.serverName) {
      const s = {
        serverName: settingsRes.serverName,
        serverIp: settingsRes.serverIp,
        welcomeText: settingsRes.welcomeText,
        primaryColor: settingsRes.primaryColor,
      };
      setSettings(s);
    }
    setLoading(false);
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const createPromo = async () => {
    if (!newCode.trim()) return setCreateError("Введите код");
    const disc = parseInt(newDiscount);
    if (isNaN(disc) || disc < 0 || disc > 100) return setCreateError("Скидка от 0 до 100%");
    setCreateError("");
    const res = await api.createPromo(newCode, disc);
    if (res.id) {
      setPromos(p => [res, ...p]);
      setNewCode("");
      setNewDiscount("10");
    } else {
      setCreateError(res.error || "Ошибка");
    }
  };

  const togglePromo = async (id: number, active: boolean) => {
    await api.togglePromo(id, !active);
    setPromos(p => p.map(pr => pr.id === id ? { ...pr, active: !active } : pr));
  };

  const deletePromo = async (id: number) => {
    await api.deletePromo(id);
    setPromos(p => p.filter(pr => pr.id !== id));
  };

  const saveSettings = async () => {
    await api.saveSettings(settings as unknown as Record<string, string>);
    setSaved(true);
    onSettingsChange?.(settings);
    setTimeout(() => setSaved(false), 2000);
  };

  const maxTopCount = stats?.top_items?.[0]?.count || 1;

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
          <button onClick={onClose} className="text-yellow-200 hover:text-white text-xl w-8 h-8 flex items-center justify-center transition-colors" style={{ background: "rgba(0,0,0,0.3)" }}>✕</button>
        </div>

        {/* Tabs */}
        <div className="flex" style={{ borderBottom: "2px solid #334155" }}>
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className="flex-1 py-3 text-xs font-bold uppercase tracking-widest transition-all duration-150 flex items-center justify-center gap-1"
              style={{ background: tab === t.id ? "#fbbf24" : "#0f172a", color: tab === t.id ? "#000" : "#64748b" }}
            >
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        <div className="p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="text-3xl">⚙️</motion.div>
              <span className="text-slate-400 text-sm ml-3">Загружаю данные...</span>
            </div>
          ) : (
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
                        placeholder="КОД (напр. FREE100)"
                        className="mc-input px-3 py-2 text-sm flex-1 uppercase tracking-widest"
                      />
                      <div className="flex items-center gap-1 shrink-0">
                        <input
                          type="number"
                          value={newDiscount}
                          onChange={e => setNewDiscount(e.target.value)}
                          min="0" max="100"
                          className="mc-input px-3 py-2 text-sm w-20 text-center"
                        />
                        <span className="text-slate-400 text-sm font-bold">%</span>
                      </div>
                      <button onClick={createPromo} className="mc-btn px-4 py-2 text-xs font-bold uppercase tracking-widest text-black shrink-0" style={{ background: "#fbbf24" }}>
                        Создать
                      </button>
                    </div>
                    <p className="text-slate-500 text-xs mt-2">💡 Скидка 100% = бесплатный предмет</p>
                    {createError && <p className="text-red-400 text-xs mt-1">⚠️ {createError}</p>}
                  </div>

                  {/* Promo list */}
                  <h3 className="text-slate-400 font-bold text-xs uppercase tracking-widest mb-3">Промокоды ({promos.length})</h3>
                  <div className="flex flex-col gap-2 max-h-72 overflow-y-auto pr-1">
                    {promos.length === 0 && <p className="text-slate-600 text-sm text-center py-4">Промокодов пока нет</p>}
                    {promos.map(p => (
                      <motion.div key={p.id} layout initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-3 px-4 py-3"
                        style={{ background: "#0f172a", border: `2px solid ${p.active ? "#334155" : "#1e1e2e"}`, opacity: p.active ? 1 : 0.55 }}
                      >
                        <span className="text-lg">🎟️</span>
                        <div className="flex-1 min-w-0">
                          <div className="font-bold text-white text-sm tracking-widest">{p.code}</div>
                          <div className="text-slate-500 text-xs">
                            Скидка <span className="text-green-400 font-bold">{p.discount}%</span>
                            {p.discount === 100 && <span className="text-yellow-400 ml-1">🎁 бесплатно</span>}
                            · Использований: {p.usages}
                          </div>
                        </div>
                        <span className="text-xs font-black px-2 py-0.5"
                          style={{ background: p.active ? "rgba(74,222,128,0.15)" : "rgba(100,116,139,0.1)", color: p.active ? "#4ade80" : "#64748b", border: `1px solid ${p.active ? "#4ade80" : "#334155"}` }}
                        >
                          {p.active ? "ВКЛ" : "ВЫКЛ"}
                        </span>
                        <button onClick={() => togglePromo(p.id, p.active)} className="text-xs px-2 py-1 font-bold transition-colors duration-150" style={{ background: "#1e293b", color: p.active ? "#fbbf24" : "#4ade80", border: "1px solid #334155" }}>
                          {p.active ? "Выкл" : "Вкл"}
                        </button>
                        <button onClick={() => deletePromo(p.id)} className="text-xs px-2 py-1 font-bold" style={{ background: "rgba(239,68,68,0.1)", color: "#ef4444", border: "1px solid rgba(239,68,68,0.3)" }}>
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
                    {([
                      { label: "Название магазина", key: "serverName" },
                      { label: "IP сервера", key: "serverIp" },
                      { label: "Приветственный текст", key: "welcomeText" },
                    ] as { label: string; key: keyof SiteSettings }[]).map(({ label, key }) => (
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
                        <input type="color" value={settings.primaryColor}
                          onChange={e => setSettings(s => ({ ...s, primaryColor: e.target.value }))}
                          className="w-12 h-10 cursor-pointer" style={{ background: "none", border: "2px solid #334155" }}
                        />
                        <span className="text-slate-400 text-sm font-mono">{settings.primaryColor}</span>
                        <div className="w-8 h-8 rounded-sm" style={{ background: settings.primaryColor }} />
                      </div>
                    </div>
                    <button onClick={saveSettings} className="mc-btn w-full py-3 text-sm font-bold uppercase tracking-widest text-black mt-2"
                      style={{ background: saved ? "#22d3ee" : "#fbbf24" }}
                    >
                      {saved ? "✅ Сохранено и применено!" : "💾 Сохранить и применить"}
                    </button>
                  </div>
                </motion.div>
              )}

              {tab === "stats" && (
                <motion.div key="stats" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}>
                  {stats ? (
                    <>
                      <div className="grid grid-cols-2 gap-3 mb-5">
                        {[
                          { icon: "💰", label: "Выручка сегодня", value: `₽${stats.today.revenue.toLocaleString("ru")}`, color: "#4ade80" },
                          { icon: "🛒", label: "Заказов сегодня", value: stats.today.count.toString(), color: "#22d3ee" },
                          { icon: "💵", label: "Выручка всего", value: `₽${stats.total.revenue.toLocaleString("ru")}`, color: "#a855f7" },
                          { icon: "📦", label: "Заказов всего", value: stats.total.count.toString(), color: "#f97316" },
                          { icon: "👥", label: "Уникальных игроков", value: stats.unique_players.toString(), color: "#fbbf24" },
                          { icon: "🎟️", label: "Активных промокодов", value: stats.active_promos.toString(), color: "#4ade80" },
                        ].map(({ icon, label, value, color }) => (
                          <div key={label} className="mc-panel p-3 text-center">
                            <div className="text-2xl mb-1">{icon}</div>
                            <div className="font-black text-xl font-mc" style={{ color }}>{value}</div>
                            <div className="text-slate-500 text-xs mt-0.5">{label}</div>
                          </div>
                        ))}
                      </div>

                      {stats.top_items.length > 0 && (
                        <div className="mc-panel p-4">
                          <h3 className="text-slate-400 font-bold text-xs uppercase tracking-widest mb-3">🏆 Топ продаж</h3>
                          {stats.top_items.map(({ name, emoji, count }) => (
                            <div key={name} className="mb-3">
                              <div className="flex justify-between text-xs mb-1">
                                <span className="text-slate-300">{emoji} {name}</span>
                                <span className="text-slate-500">{count} шт.</span>
                              </div>
                              <div style={{ background: "#0f172a", height: 6 }}>
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: `${(count / maxTopCount) * 100}%` }}
                                  transition={{ duration: 0.8, ease: "easeOut" }}
                                  style={{ background: "#4ade80", height: "100%" }}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {stats.top_items.length === 0 && (
                        <div className="mc-panel p-8 text-center">
                          <div className="text-4xl mb-3">📊</div>
                          <p className="text-slate-500 text-sm">Продаж пока нет.<br />Статистика появится после первых покупок.</p>
                        </div>
                      )}
                    </>
                  ) : (
                    <p className="text-slate-500 text-sm text-center py-8">Не удалось загрузить статистику</p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
