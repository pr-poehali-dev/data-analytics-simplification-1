import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Icon from "@/components/ui/icon";

interface AuthModalProps {
  onClose: () => void;
}

export default function AuthModal({ onClose }: AuthModalProps) {
  const [mode, setMode] = useState<"choose" | "login" | "register">("choose");
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4"
    >
      <motion.div
        initial={{ scale: 0.92, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.92, opacity: 0, y: 20 }}
        transition={{ type: "spring", stiffness: 300, damping: 28 }}
        className="bg-white w-full max-w-md relative overflow-hidden"
      >
        <div className="bg-neutral-900 px-8 py-6 flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
            <Icon name="Send" size={16} className="text-white" />
          </div>
          <div>
            <div className="text-white font-bold tracking-wide uppercase text-sm">TelegramBot</div>
            <div className="text-neutral-400 text-xs">Официальный сервис</div>
          </div>
        </div>

        <div className="px-8 py-8">
          <AnimatePresence mode="wait">
            {mode === "choose" && (
              <motion.div
                key="choose"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                <h2 className="text-2xl font-bold text-neutral-900 mb-2 tracking-tight">
                  Добро пожаловать
                </h2>
                <p className="text-neutral-500 text-sm mb-8">
                  Войдите или создайте аккаунт, чтобы продолжить
                </p>
                <div className="flex flex-col gap-3">
                  <button
                    onClick={() => setMode("login")}
                    className="w-full bg-neutral-900 text-white py-3 px-6 uppercase text-sm tracking-wide font-medium transition-all duration-300 hover:bg-neutral-700 flex items-center justify-between group"
                  >
                    <span>Войти</span>
                    <Icon name="ArrowRight" size={16} className="group-hover:translate-x-1 transition-transform duration-200" />
                  </button>
                  <button
                    onClick={() => setMode("register")}
                    className="w-full bg-white text-neutral-900 py-3 px-6 uppercase text-sm tracking-wide font-medium border border-neutral-200 transition-all duration-300 hover:border-neutral-900 flex items-center justify-between group"
                  >
                    <span>Регистрация</span>
                    <Icon name="UserPlus" size={16} className="group-hover:translate-x-1 transition-transform duration-200" />
                  </button>
                </div>
              </motion.div>
            )}

            {mode === "login" && (
              <motion.div
                key="login"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                <button
                  onClick={() => setMode("choose")}
                  className="flex items-center gap-2 text-neutral-400 text-xs uppercase tracking-wide mb-6 hover:text-neutral-900 transition-colors duration-200"
                >
                  <Icon name="ArrowLeft" size={14} />
                  Назад
                </button>
                <h2 className="text-2xl font-bold text-neutral-900 mb-2 tracking-tight">Вход</h2>
                <p className="text-neutral-500 text-sm mb-8">Рады снова вас видеть</p>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  <div>
                    <label className="text-xs uppercase tracking-wide text-neutral-500 block mb-1.5">
                      Имя пользователя
                    </label>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="@username"
                      className="w-full border border-neutral-200 px-4 py-3 text-sm outline-none focus:border-neutral-900 transition-colors duration-200 bg-neutral-50"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs uppercase tracking-wide text-neutral-500 block mb-1.5">
                      Пароль
                    </label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full border border-neutral-200 px-4 py-3 text-sm outline-none focus:border-neutral-900 transition-colors duration-200 bg-neutral-50"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-neutral-900 text-white py-3 px-6 uppercase text-sm tracking-wide font-medium transition-all duration-300 hover:bg-neutral-700 mt-2"
                  >
                    Войти
                  </button>
                </form>
                <p className="text-center text-xs text-neutral-400 mt-4">
                  Нет аккаунта?{" "}
                  <button onClick={() => setMode("register")} className="text-neutral-900 underline hover:no-underline">
                    Зарегистрироваться
                  </button>
                </p>
              </motion.div>
            )}

            {mode === "register" && (
              <motion.div
                key="register"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                <button
                  onClick={() => setMode("choose")}
                  className="flex items-center gap-2 text-neutral-400 text-xs uppercase tracking-wide mb-6 hover:text-neutral-900 transition-colors duration-200"
                >
                  <Icon name="ArrowLeft" size={14} />
                  Назад
                </button>
                <h2 className="text-2xl font-bold text-neutral-900 mb-2 tracking-tight">Регистрация</h2>
                <p className="text-neutral-500 text-sm mb-8">Создайте аккаунт за 30 секунд</p>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  <div>
                    <label className="text-xs uppercase tracking-wide text-neutral-500 block mb-1.5">
                      Ваше имя
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Иван Иванов"
                      className="w-full border border-neutral-200 px-4 py-3 text-sm outline-none focus:border-neutral-900 transition-colors duration-200 bg-neutral-50"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs uppercase tracking-wide text-neutral-500 block mb-1.5">
                      Telegram username
                    </label>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="@username"
                      className="w-full border border-neutral-200 px-4 py-3 text-sm outline-none focus:border-neutral-900 transition-colors duration-200 bg-neutral-50"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs uppercase tracking-wide text-neutral-500 block mb-1.5">
                      Пароль
                    </label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full border border-neutral-200 px-4 py-3 text-sm outline-none focus:border-neutral-900 transition-colors duration-200 bg-neutral-50"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-neutral-900 text-white py-3 px-6 uppercase text-sm tracking-wide font-medium transition-all duration-300 hover:bg-neutral-700 mt-2"
                  >
                    Создать аккаунт
                  </button>
                </form>
                <p className="text-center text-xs text-neutral-400 mt-4">
                  Уже есть аккаунт?{" "}
                  <button onClick={() => setMode("login")} className="text-neutral-900 underline hover:no-underline">
                    Войти
                  </button>
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
}
