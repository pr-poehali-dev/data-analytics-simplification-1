import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface AuthModalProps {
  onClose: (user?: { username: string; isAdmin: boolean }) => void;
}

const ADMIN_PASSWORD = "admin123";

export default function AuthModal({ onClose }: AuthModalProps) {
  const [mode, setMode] = useState<"login" | "register">("register");
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [shakeKey, setShakeKey] = useState(0);

  const triggerError = (msg: string) => {
    setError(msg);
    setShakeKey(k => k + 1);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return triggerError("Введите ваше имя");
    if (username.length < 3) return triggerError("Ник минимум 3 символа");
    if (password.length < 6) return triggerError("Пароль минимум 6 символов");
    if (password !== confirm) return triggerError("Пароли не совпадают");
    setError("");
    onClose({ username, isAdmin: password === ADMIN_PASSWORD });
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return triggerError("Введите ник");
    if (!password.trim()) return triggerError("Введите пароль");
    setError("");
    onClose({ username, isAdmin: password === ADMIN_PASSWORD });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ background: "rgba(0,0,0,0.9)", backdropFilter: "blur(6px)" }}
    >
      {/* Bg particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {["⛏️","💎","🗡️","🛡️","🪄","⚔️"].map((emoji, i) => (
          <motion.div
            key={i}
            className="absolute text-2xl opacity-10"
            style={{ left: `${10 + i * 16}%`, top: `${20 + (i % 3) * 25}%` }}
            animate={{ y: [-10, 10, -10], rotate: [-5, 5, -5] }}
            transition={{ duration: 3 + i * 0.5, repeat: Infinity, ease: "easeInOut" }}
          >
            {emoji}
          </motion.div>
        ))}
      </div>

      <motion.div
        key={shakeKey}
        initial={{ scale: 0.9, opacity: 0, y: 30 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 22 }}
        className="w-full max-w-sm relative"
        style={{
          background: "#1e293b",
          border: "2px solid #4ade80",
          boxShadow: "0 0 60px rgba(74,222,128,0.25), inset -2px -4px 0 rgba(0,0,0,0.5), inset 2px 2px 0 rgba(255,255,255,0.05)"
        }}
      >
        {/* Header */}
        <div className="px-6 py-4 flex items-center gap-3" style={{ background: "#16a34a", borderBottom: "2px solid #15803d" }}>
          <span className="text-3xl">⛏️</span>
          <div>
            <div className="font-mc text-white font-bold tracking-widest uppercase text-base">CraftStore</div>
            <div className="text-green-200 text-xs tracking-wide">Minecraft Item Shop</div>
          </div>
          <div className="ml-auto flex items-center gap-1">
            {[0, 0.3, 0.6].map((delay, i) => (
              <motion.div
                key={i}
                className="w-2 h-2 rounded-full bg-green-200"
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 1.5, repeat: Infinity, delay }}
              />
            ))}
          </div>
        </div>

        <div className="p-6">
          {/* Tab switcher */}
          <div className="flex mb-5" style={{ border: "2px solid #334155" }}>
            {(["register", "login"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => { setMode(tab); setError(""); }}
                className="flex-1 py-2.5 text-xs font-bold uppercase tracking-widest transition-all duration-150"
                style={{
                  background: mode === tab ? "#4ade80" : "#0f172a",
                  color: mode === tab ? "#000" : "#64748b",
                }}
              >
                {tab === "register" ? "📝 Регистрация" : "🔑 Войти"}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {mode === "register" && (
              <motion.form
                key="register"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.15 }}
                onSubmit={handleRegister}
                className="flex flex-col gap-3"
              >
                {[
                  { label: "Ваше имя", value: name, set: setName, placeholder: "Иван", type: "text" },
                  { label: "Ник на сервере", value: username, set: setUsername, placeholder: "Steve123", type: "text" },
                  { label: "Пароль", value: password, set: setPassword, placeholder: "••••••••", type: "password" },
                  { label: "Повторите пароль", value: confirm, set: setConfirm, placeholder: "••••••••", type: "password" },
                ].map(({ label, value, set, placeholder, type }) => (
                  <div key={label}>
                    <label className="block text-xs text-green-400 uppercase tracking-widest mb-1">{label}</label>
                    <input
                      type={type}
                      value={value}
                      onChange={e => set(e.target.value)}
                      placeholder={placeholder}
                      className="mc-input w-full px-3 py-2 text-sm"
                    />
                  </div>
                ))}

                {error && <ErrorBox msg={error} />}

                <button type="submit" className="mc-btn w-full py-3 text-sm font-bold uppercase tracking-widest text-black mt-1" style={{ background: "#4ade80" }}>
                  ⛏️ Создать аккаунт
                </button>

                <p className="text-center text-xs" style={{ color: "#475569" }}>
                  Пароль <span className="text-yellow-400 font-bold">admin123</span> = вход в админку
                </p>
              </motion.form>
            )}

            {mode === "login" && (
              <motion.form
                key="login"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.15 }}
                onSubmit={handleLogin}
                className="flex flex-col gap-3"
              >
                {[
                  { label: "Ник на сервере", value: username, set: setUsername, placeholder: "Steve123", type: "text" },
                  { label: "Пароль", value: password, set: setPassword, placeholder: "••••••••", type: "password" },
                ].map(({ label, value, set, placeholder, type }) => (
                  <div key={label}>
                    <label className="block text-xs text-green-400 uppercase tracking-widest mb-1">{label}</label>
                    <input
                      type={type}
                      value={value}
                      onChange={e => set(e.target.value)}
                      placeholder={placeholder}
                      className="mc-input w-full px-3 py-2 text-sm"
                    />
                  </div>
                ))}

                {error && <ErrorBox msg={error} />}

                <button type="submit" className="mc-btn w-full py-3 text-sm font-bold uppercase tracking-widest text-black mt-1" style={{ background: "#4ade80" }}>
                  🔑 Войти на сервер
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
}

function ErrorBox({ msg }: { msg: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-xs text-red-400 px-3 py-2"
      style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)" }}
    >
      ⚠️ {msg}
    </motion.div>
  );
}
