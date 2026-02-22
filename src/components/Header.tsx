interface HeaderProps {
  username?: string;
  isAdmin?: boolean;
  onAdminClick?: () => void;
  cartCount?: number;
}

export default function Header({ username, isAdmin, onAdminClick, cartCount = 0 }: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-40" style={{ background: "#0f172a", borderBottom: "2px solid #334155" }}>
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl">⛏️</span>
          <span className="font-mc text-green-400 font-bold tracking-widest uppercase text-sm">CraftStore</span>
          <span className="text-xs text-slate-500 ml-1 hidden sm:block">• Minecraft Shop</span>
        </div>

        <nav className="flex items-center gap-3">
          {isAdmin && (
            <button
              onClick={onAdminClick}
              className="mc-btn px-3 py-1.5 text-xs font-bold uppercase tracking-widest text-black"
              style={{ background: "#fbbf24" }}
            >
              👑 Админка
            </button>
          )}
          {cartCount > 0 && (
            <div className="relative">
              <div className="mc-btn px-3 py-1.5 text-xs font-bold uppercase tracking-widest text-black" style={{ background: "#4ade80" }}>
                🛒 {cartCount}
              </div>
            </div>
          )}
          {username && (
            <div className="flex items-center gap-2 px-3 py-1.5 text-xs" style={{ background: "#1e293b", border: "1px solid #334155" }}>
              <span className="text-green-400">▶</span>
              <span className="text-slate-300 font-bold">{username}</span>
              {isAdmin && <span className="text-yellow-400">👑</span>}
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
