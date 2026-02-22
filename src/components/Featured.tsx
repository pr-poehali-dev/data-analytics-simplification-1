import { motion } from "framer-motion";

const FEATURES = [
  { icon: "⚡", title: "Моментальная выдача", desc: "Предмет поступает в инвентарь через 5 секунд после оплаты" },
  { icon: "🔒", title: "Безопасная оплата", desc: "Защищённые платежи через проверенные системы" },
  { icon: "🎮", title: "Поддержка 24/7", desc: "Помогаем с любыми вопросами в Discord и Telegram" },
  { icon: "♻️", title: "Гарантия возврата", desc: "Вернём деньги, если предмет не был выдан в течение часа" },
];

export default function Featured() {
  return (
    <div className="py-20 px-4" style={{ background: "#0f172a", borderTop: "2px solid #1e293b", borderBottom: "2px solid #1e293b" }}>
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="font-mc text-3xl md:text-4xl font-black text-white mb-3">⚙️ ПОЧЕМУ МЫ</h2>
          <p className="text-slate-500 text-sm max-w-md mx-auto">Тысячи игроков доверяют нам свои покупки каждый день</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {FEATURES.map(({ icon, title, desc }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="mc-panel p-5 flex items-start gap-4 hover:brightness-110 transition-all duration-200"
            >
              <div className="text-3xl shrink-0">{icon}</div>
              <div>
                <div className="text-green-400 font-bold text-sm mb-1 uppercase tracking-wide">{title}</div>
                <div className="text-slate-500 text-xs leading-relaxed">{desc}</div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-10 p-6 text-center"
          style={{ background: "linear-gradient(135deg, rgba(74,222,128,0.1) 0%, rgba(34,211,238,0.1) 100%)", border: "2px solid rgba(74,222,128,0.3)" }}
        >
          <div className="text-2xl mb-2">🎮</div>
          <p className="text-white font-bold text-lg mb-1 font-mc">Готов к игре?</p>
          <p className="text-slate-400 text-sm mb-4">Заходи на сервер и прокачай своего персонажа прямо сейчас</p>
          <code className="text-green-400 font-bold text-lg tracking-widest px-4 py-2 inline-block" style={{ background: "#0f172a", border: "2px solid #4ade80" }}>
            play.craftstore.ru
          </code>
        </motion.div>
      </div>
    </div>
  );
}
