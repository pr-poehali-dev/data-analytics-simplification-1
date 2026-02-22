"""
CraftStore API — управление покупками, промокодами, настройками и статистикой
"""
import json
import os
import psycopg2

CORS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
}

def get_conn():
    return psycopg2.connect(os.environ["DATABASE_URL"])

def resp(status, body):
    return {"statusCode": status, "headers": {**CORS, "Content-Type": "application/json"}, "body": json.dumps(body, ensure_ascii=False, default=str)}

def handler(event: dict, context) -> dict:
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS, "body": ""}

    method = event.get("httpMethod", "GET")
    params = event.get("queryStringParameters") or {}
    action = params.get("action", "stats")
    body = {}
    if event.get("body"):
        try:
            body = json.loads(event["body"])
        except Exception:
            pass

    conn = get_conn()
    cur = conn.cursor()

    try:
        # ─── GET stats ────────────────────────────────────────────────────
        if method == "GET" and action == "stats":
            cur.execute("SELECT COUNT(*), COALESCE(SUM(final_price), 0) FROM purchases WHERE DATE(created_at) = CURRENT_DATE")
            today_count, today_revenue = cur.fetchone()

            cur.execute("SELECT COUNT(*), COALESCE(SUM(final_price), 0) FROM purchases")
            total_count, total_revenue = cur.fetchone()

            cur.execute("SELECT COUNT(DISTINCT username) FROM purchases")
            unique_players = cur.fetchone()[0]

            cur.execute("SELECT COUNT(*) FROM promo_codes WHERE active = true")
            active_promos = cur.fetchone()[0]

            cur.execute("""
                SELECT item_id, item_name, item_emoji, COUNT(*) as cnt
                FROM purchases
                GROUP BY item_id, item_name, item_emoji
                ORDER BY cnt DESC LIMIT 5
            """)
            top_items = [{"id": r[0], "name": r[1], "emoji": r[2], "count": r[3]} for r in cur.fetchall()]

            cur.execute("""
                SELECT DATE(created_at) as day, COUNT(*), COALESCE(SUM(final_price), 0)
                FROM purchases
                WHERE created_at >= NOW() - INTERVAL '7 days'
                GROUP BY day ORDER BY day
            """)
            daily = [{"day": str(r[0]), "count": r[1], "revenue": int(r[2])} for r in cur.fetchall()]

            return resp(200, {
                "today": {"count": int(today_count), "revenue": int(today_revenue)},
                "total": {"count": int(total_count), "revenue": int(total_revenue)},
                "unique_players": int(unique_players),
                "active_promos": int(active_promos),
                "top_items": top_items,
                "daily": daily,
            })

        # ─── GET promos ───────────────────────────────────────────────────
        elif method == "GET" and action == "promos":
            cur.execute("SELECT id, code, discount, usages, active FROM promo_codes ORDER BY created_at DESC")
            promos = [{"id": r[0], "code": r[1], "discount": r[2], "usages": r[3], "active": r[4]} for r in cur.fetchall()]
            return resp(200, {"promos": promos})

        # ─── POST promos (create) ─────────────────────────────────────────
        elif method == "POST" and action == "promos":
            code = body.get("code", "").upper().strip()
            discount = int(body.get("discount", 0))
            if not code:
                return resp(400, {"error": "Введите код"})
            if discount < 0 or discount > 100:
                return resp(400, {"error": "Скидка от 0 до 100%"})
            cur.execute("INSERT INTO promo_codes (code, discount) VALUES (%s, %s) RETURNING id", (code, discount))
            new_id = cur.fetchone()[0]
            conn.commit()
            return resp(200, {"id": new_id, "code": code, "discount": discount, "usages": 0, "active": True})

        # ─── PUT promos (toggle) ──────────────────────────────────────────
        elif method == "PUT" and action == "promos":
            cur.execute("UPDATE promo_codes SET active = %s WHERE id = %s", (body.get("active"), body.get("id")))
            conn.commit()
            return resp(200, {"ok": True})

        # ─── DELETE promos ────────────────────────────────────────────────
        elif method == "DELETE" and action == "promos":
            cur.execute("DELETE FROM promo_codes WHERE id = %s", (body.get("id"),))
            conn.commit()
            return resp(200, {"ok": True})

        # ─── GET settings ─────────────────────────────────────────────────
        elif method == "GET" and action == "settings":
            cur.execute("SELECT key, value FROM site_settings")
            settings = {r[0]: r[1] for r in cur.fetchall()}
            return resp(200, settings)

        # ─── POST settings ────────────────────────────────────────────────
        elif method == "POST" and action == "settings":
            for key, value in body.items():
                cur.execute(
                    "INSERT INTO site_settings (key, value, updated_at) VALUES (%s, %s, NOW()) ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW()",
                    (key, str(value))
                )
            conn.commit()
            return resp(200, {"ok": True})

        # ─── POST purchase ────────────────────────────────────────────────
        elif method == "POST" and action == "purchase":
            username = body.get("username", "Гость")
            item_id = int(body.get("item_id", 0))
            item_name = body.get("item_name", "")
            item_emoji = body.get("item_emoji", "")
            original_price = int(body.get("original_price", 0))
            promo_code = body.get("promo_code", "").upper().strip()
            discount = 0
            final_price = original_price

            if promo_code:
                cur.execute("SELECT discount FROM promo_codes WHERE code = %s AND active = true", (promo_code,))
                row = cur.fetchone()
                if row:
                    discount = row[0]
                    final_price = max(0, round(original_price * (1 - discount / 100)))
                    cur.execute("UPDATE promo_codes SET usages = usages + 1 WHERE code = %s", (promo_code,))
                else:
                    return resp(400, {"error": "Промокод не найден или неактивен"})

            cur.execute(
                "INSERT INTO purchases (username, item_id, item_name, item_emoji, original_price, final_price, promo_code, discount) VALUES (%s, %s, %s, %s, %s, %s, %s, %s) RETURNING id",
                (username, item_id, item_name, item_emoji, original_price, final_price, promo_code or None, discount)
            )
            purchase_id = cur.fetchone()[0]
            conn.commit()
            return resp(200, {"purchase_id": purchase_id, "final_price": final_price, "discount": discount})

        # ─── POST validate-promo ──────────────────────────────────────────
        elif method == "POST" and action == "validate-promo":
            code = body.get("code", "").upper().strip()
            cur.execute("SELECT discount FROM promo_codes WHERE code = %s AND active = true", (code,))
            row = cur.fetchone()
            if row:
                return resp(200, {"valid": True, "discount": row[0]})
            return resp(200, {"valid": False, "discount": 0})

        return resp(404, {"error": "Not found"})

    finally:
        cur.close()
        conn.close()
