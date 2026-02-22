
CREATE TABLE IF NOT EXISTS purchases (
  id SERIAL PRIMARY KEY,
  username VARCHAR(100) NOT NULL,
  item_id INTEGER NOT NULL,
  item_name VARCHAR(200) NOT NULL,
  item_emoji VARCHAR(10) NOT NULL,
  original_price INTEGER NOT NULL,
  final_price INTEGER NOT NULL,
  promo_code VARCHAR(50),
  discount INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS promo_codes (
  id SERIAL PRIMARY KEY,
  code VARCHAR(50) UNIQUE NOT NULL,
  discount INTEGER NOT NULL CHECK (discount >= 0 AND discount <= 100),
  usages INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS site_settings (
  key VARCHAR(100) PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW()
);

INSERT INTO promo_codes (code, discount, usages, active) VALUES
  ('WELCOME20', 20, 42, true),
  ('VIP50', 50, 8, true),
  ('FREE100', 100, 0, true)
ON CONFLICT (code) DO NOTHING;

INSERT INTO site_settings (key, value) VALUES
  ('serverName', 'CraftStore'),
  ('serverIp', 'play.craftstore.ru'),
  ('welcomeText', 'Добро пожаловать в лучший Minecraft-магазин!'),
  ('primaryColor', '#4ade80')
ON CONFLICT (key) DO NOTHING;
