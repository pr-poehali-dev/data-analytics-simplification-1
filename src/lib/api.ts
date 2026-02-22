const BASE = "https://functions.poehali.dev/76c3efb0-74c1-4921-80c5-2492ad97733e";

async function req(action: string, method = "GET", body?: object) {
  const res = await fetch(`${BASE}/?action=${action}`, {
    method,
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
  return res.json();
}

export const api = {
  getStats: () => req("stats"),
  getPromos: () => req("promos"),
  createPromo: (code: string, discount: number) => req("promos", "POST", { code, discount }),
  togglePromo: (id: number, active: boolean) => req("promos", "PUT", { id, active }),
  deletePromo: (id: number) => req("promos", "DELETE", { id }),
  getSettings: () => req("settings"),
  saveSettings: (settings: Record<string, string>) => req("settings", "POST", settings),
  purchase: (data: {
    username: string; item_id: number; item_name: string; item_emoji: string;
    original_price: number; promo_code?: string;
  }) => req("purchase", "POST", data),
  validatePromo: (code: string) => req("validate-promo", "POST", { code }),
};
