export default function Footer() {
  return (
    <footer style={{ background: "#0a1628", borderTop: "2px solid #1e293b" }}>
      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 mb-10">
          <div className="col-span-2 sm:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">⛏️</span>
              <span className="font-mc text-green-400 font-bold tracking-widest uppercase text-sm">CraftStore</span>
            </div>
            <p className="text-slate-500 text-xs leading-relaxed">
              Лучший Minecraft-магазин. Предметы, привилегии, питомцы — всё для игры мечты.
            </p>
          </div>

          <div>
            <h4 className="text-yellow-400 text-xs font-bold uppercase tracking-widest mb-3">Магазин</h4>
            {["Оружие", "Броня", "Привилегии", "Ресурсы", "Питомцы"].map(link => (
              <a key={link} href="#shop" className="block text-slate-500 hover:text-green-400 text-xs mb-1.5 transition-colors duration-150">{link}</a>
            ))}
          </div>

          <div>
            <h4 className="text-yellow-400 text-xs font-bold uppercase tracking-widest mb-3">Поддержка</h4>
            {["Как купить", "Гарантии", "Возврат", "FAQ"].map(link => (
              <a key={link} href="#" className="block text-slate-500 hover:text-green-400 text-xs mb-1.5 transition-colors duration-150">{link}</a>
            ))}
          </div>

          <div>
            <h4 className="text-yellow-400 text-xs font-bold uppercase tracking-widest mb-3">Сервер</h4>
            <div className="mc-panel p-3 mb-3">
              <div className="text-xs text-slate-500 mb-1">IP сервера</div>
              <code className="text-green-400 text-xs font-bold">play.craftstore.ru</code>
            </div>
            <div className="flex gap-2">
              {["💬", "📢", "🎮"].map((icon, i) => (
                <a key={i} href="#" className="w-8 h-8 flex items-center justify-center text-base transition-all duration-150 hover:brightness-125"
                  style={{ background: "#1e293b", border: "1px solid #334155" }}>
                  {icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div style={{ borderTop: "2px solid #1e293b" }} className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="font-mc text-[12vw] sm:text-[8vw] lg:text-[6vw] leading-none text-slate-800 font-black tracking-tighter select-none">
            CRAFTSTORE
          </div>
          <p className="text-slate-600 text-xs">{new Date().getFullYear()} CraftStore · Все права защищены</p>
        </div>
      </div>
    </footer>
  );
}
