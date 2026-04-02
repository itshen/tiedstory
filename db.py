import sqlite3
import os
import time
import secrets
from contextlib import contextmanager
from typing import Optional

DB_PATH = os.path.join(os.path.dirname(__file__), "ribbons.db")

DDL = """
CREATE TABLE IF NOT EXISTS ribbons (
    id                  TEXT PRIMARY KEY,
    witness             TEXT NOT NULL,
    color               TEXT NOT NULL DEFAULT 'gray',
    story               TEXT NOT NULL,
    created_at          INTEGER NOT NULL,
    hidden              INTEGER NOT NULL DEFAULT 0,
    virtual_echo_count  INTEGER NOT NULL DEFAULT 0,
    ip                  TEXT NOT NULL DEFAULT ''
);

CREATE TABLE IF NOT EXISTS echoes (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    ribbon_id   TEXT NOT NULL,
    content     TEXT NOT NULL,
    created_at  INTEGER NOT NULL,
    hidden      INTEGER NOT NULL DEFAULT 0,
    ip          TEXT NOT NULL DEFAULT '',
    FOREIGN KEY(ribbon_id) REFERENCES ribbons(id)
);

CREATE TABLE IF NOT EXISTS appends (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    ribbon_id   TEXT NOT NULL,
    content     TEXT NOT NULL,
    created_at  INTEGER NOT NULL,
    FOREIGN KEY(ribbon_id) REFERENCES ribbons(id)
);

CREATE TABLE IF NOT EXISTS banned_ips (
    ip          TEXT PRIMARY KEY,
    reason      TEXT NOT NULL,
    banned_at   INTEGER NOT NULL,
    expire_at   INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS login_attempts (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    ip          TEXT NOT NULL,
    attempted_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS ai_echo_tasks (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    ribbon_id    TEXT NOT NULL,
    scheduled_at INTEGER NOT NULL,
    done         INTEGER NOT NULL DEFAULT 0,
    slot         INTEGER NOT NULL DEFAULT 0,
    is_final     INTEGER NOT NULL DEFAULT 0,
    FOREIGN KEY(ribbon_id) REFERENCES ribbons(id)
);

CREATE TABLE IF NOT EXISTS page_views (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    date        TEXT NOT NULL,
    ip          TEXT NOT NULL DEFAULT '',
    path        TEXT NOT NULL DEFAULT '/',
    visited_at  INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_ribbons_created ON ribbons(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_echoes_ribbon ON echoes(ribbon_id);
CREATE INDEX IF NOT EXISTS idx_appends_ribbon ON appends(ribbon_id);
CREATE INDEX IF NOT EXISTS idx_login_attempts_ip ON login_attempts(ip);
CREATE INDEX IF NOT EXISTS idx_ai_echo_tasks_scheduled ON ai_echo_tasks(scheduled_at);
CREATE INDEX IF NOT EXISTS idx_ai_echo_tasks_ribbon ON ai_echo_tasks(ribbon_id);
CREATE INDEX IF NOT EXISTS idx_page_views_date ON page_views(date);
CREATE INDEX IF NOT EXISTS idx_page_views_ip_date ON page_views(ip, date);
"""


def get_conn():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA journal_mode=WAL")
    conn.execute("PRAGMA foreign_keys=ON")
    return conn


@contextmanager
def db():
    conn = get_conn()
    try:
        yield conn
        conn.commit()
    except Exception:
        conn.rollback()
        raise
    finally:
        conn.close()


def init_db():
    with db() as conn:
        conn.executescript(DDL)
    # 迁移：为已有表添加新列（忽略已存在的列错误）
    _migrate()


def _migrate():
    """为已有数据库添加新列，忽略已存在的情况"""
    migrations = [
        "ALTER TABLE ribbons ADD COLUMN hidden INTEGER NOT NULL DEFAULT 0",
        "ALTER TABLE ribbons ADD COLUMN virtual_echo_count INTEGER NOT NULL DEFAULT 0",
        "ALTER TABLE ribbons ADD COLUMN ip TEXT NOT NULL DEFAULT ''",
        "ALTER TABLE echoes ADD COLUMN hidden INTEGER NOT NULL DEFAULT 0",
        "ALTER TABLE echoes ADD COLUMN ip TEXT NOT NULL DEFAULT ''",
        "ALTER TABLE echoes ADD COLUMN likes INTEGER NOT NULL DEFAULT 0",
        "ALTER TABLE echoes ADD COLUMN is_ai INTEGER NOT NULL DEFAULT 0",
        """CREATE TABLE IF NOT EXISTS ai_echo_tasks (
            id          INTEGER PRIMARY KEY AUTOINCREMENT,
            ribbon_id   TEXT NOT NULL,
            scheduled_at INTEGER NOT NULL,
            done        INTEGER NOT NULL DEFAULT 0,
            FOREIGN KEY(ribbon_id) REFERENCES ribbons(id)
        )""",
        "CREATE INDEX IF NOT EXISTS idx_ai_echo_tasks_scheduled ON ai_echo_tasks(scheduled_at)",
        "ALTER TABLE ai_echo_tasks ADD COLUMN slot INTEGER NOT NULL DEFAULT 0",
        "ALTER TABLE ai_echo_tasks ADD COLUMN is_final INTEGER NOT NULL DEFAULT 0",
        "CREATE INDEX IF NOT EXISTS idx_ai_echo_tasks_ribbon ON ai_echo_tasks(ribbon_id)",
        """CREATE TABLE IF NOT EXISTS page_views (
            id          INTEGER PRIMARY KEY AUTOINCREMENT,
            date        TEXT NOT NULL,
            ip          TEXT NOT NULL DEFAULT '',
            path        TEXT NOT NULL DEFAULT '/',
            visited_at  INTEGER NOT NULL
        )""",
        "CREATE INDEX IF NOT EXISTS idx_page_views_date ON page_views(date)",
        "CREATE INDEX IF NOT EXISTS idx_page_views_ip_date ON page_views(ip, date)",
    ]
    conn = get_conn()
    try:
        for sql in migrations:
            try:
                conn.execute(sql)
            except sqlite3.OperationalError:
                pass  # 列已存在
        conn.commit()
    finally:
        conn.close()


def make_ribbon_id() -> str:
    """生成 6 位公开 ID（大写字母+数字，去掉易混淆字符）"""
    chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"
    return "".join(secrets.choice(chars) for _ in range(6))


def make_witness_code() -> str:
    """生成 12 位见证码（更长，私密）"""
    chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789"
    return "".join(secrets.choice(chars) for _ in range(12))


def save_ribbon(color: str, story: str, ip: str = "") -> dict:
    """保存新丝带，返回 id 和 witness code"""
    ribbon_id = make_ribbon_id()
    with db() as conn:
        for _ in range(10):
            existing = conn.execute("SELECT 1 FROM ribbons WHERE id=?", (ribbon_id,)).fetchone()
            if not existing:
                break
            ribbon_id = make_ribbon_id()
        witness = make_witness_code()
        ts = int(time.time())
        conn.execute(
            "INSERT INTO ribbons(id, witness, color, story, created_at, ip) VALUES(?,?,?,?,?,?)",
            (ribbon_id, witness, color, story, ts, ip)
        )
    return {"id": ribbon_id, "witness": witness, "color": color}


def get_ribbon(ribbon_id: str) -> Optional[dict]:
    with db() as conn:
        row = conn.execute("SELECT * FROM ribbons WHERE id=?", (ribbon_id,)).fetchone()
        if not row:
            return None
        echoes = conn.execute(
            "SELECT id, content, created_at, likes, is_ai FROM echoes WHERE ribbon_id=? AND hidden=0 ORDER BY created_at ASC",
            (ribbon_id,)
        ).fetchall()
        appends = conn.execute(
            "SELECT id, content, created_at FROM appends WHERE ribbon_id=? ORDER BY created_at ASC",
            (ribbon_id,)
        ).fetchall()
        return {
            "id": row["id"],
            "color": row["color"],
            "story": row["story"],
            "created_at": row["created_at"],
            "echo_count": len(echoes),
            "echoes": [dict(e) for e in echoes],
            "appends": [dict(a) for a in appends],
        }


def list_ribbons(limit: int = 60, offset: int = 0, color: str = None) -> list[dict]:
    with db() as conn:
        if color and color != "all":
            rows = conn.execute(
                """SELECT r.id, r.color, r.story, r.created_at,
                          (SELECT COUNT(*) FROM echoes WHERE ribbon_id=r.id) AS echo_count
                   FROM ribbons r
                   WHERE r.color = ?
                   ORDER BY r.created_at DESC
                   LIMIT ? OFFSET ?""",
                (color, limit, offset)
            ).fetchall()
        else:
            rows = conn.execute(
                """SELECT r.id, r.color, r.story, r.created_at,
                          (SELECT COUNT(*) FROM echoes WHERE ribbon_id=r.id) AS echo_count
                   FROM ribbons r
                   ORDER BY r.created_at DESC
                   LIMIT ? OFFSET ?""",
                (limit, offset)
            ).fetchall()
        return [dict(r) for r in rows]


def total_ribbons(color: str = None) -> int:
    with db() as conn:
        if color and color != "all":
            row = conn.execute("SELECT COUNT(*) AS c FROM ribbons WHERE color = ?", (color,)).fetchone()
        else:
            row = conn.execute("SELECT COUNT(*) AS c FROM ribbons").fetchone()
        return row["c"]


def add_echo(ribbon_id: str, content: str, ip: str = "", is_ai: bool = False) -> Optional[int]:
    """插入回响，返回新记录的 id；ribbon_id 不存在时返回 None"""
    with db() as conn:
        exists = conn.execute("SELECT 1 FROM ribbons WHERE id=?", (ribbon_id,)).fetchone()
        if not exists:
            return None
        ts = int(time.time())
        cur = conn.execute(
            "INSERT INTO echoes(ribbon_id, content, created_at, ip, is_ai) VALUES(?,?,?,?,?)",
            (ribbon_id, content, ts, ip, 1 if is_ai else 0)
        )
        return cur.lastrowid


def like_echo(echo_id: int) -> Optional[int]:
    """给回响点赞，返回更新后的点赞数；echo_id 不存在时返回 None"""
    with db() as conn:
        row = conn.execute("SELECT likes FROM echoes WHERE id=?", (echo_id,)).fetchone()
        if row is None:
            return None
        new_count = row["likes"] + 1
        conn.execute("UPDATE echoes SET likes=? WHERE id=?", (new_count, echo_id))
    return new_count


def verify_witness(ribbon_id: str, witness: str) -> bool:
    with db() as conn:
        row = conn.execute(
            "SELECT 1 FROM ribbons WHERE id=? AND witness=?", (ribbon_id, witness)
        ).fetchone()
        return row is not None


def add_append(ribbon_id: str, witness: str, content: str) -> bool:
    if not verify_witness(ribbon_id, witness):
        return False
    with db() as conn:
        ts = int(time.time())
        conn.execute(
            "INSERT INTO appends(ribbon_id, content, created_at) VALUES(?,?,?)",
            (ribbon_id, content, ts)
        )
    return True


# ==========================================
# Admin: 丝带管理
# ==========================================

def admin_list_ribbons(limit: int = 20, offset: int = 0) -> list[dict]:
    with db() as conn:
        rows = conn.execute(
            """SELECT r.id, r.color, r.story, r.created_at, r.hidden, r.virtual_echo_count, r.ip,
                      (SELECT COUNT(*) FROM echoes WHERE ribbon_id=r.id AND hidden=0) AS echo_count
               FROM ribbons r
               ORDER BY r.created_at DESC
               LIMIT ? OFFSET ?""",
            (limit, offset)
        ).fetchall()
        return [dict(r) for r in rows]


def admin_total_ribbons() -> int:
    with db() as conn:
        row = conn.execute("SELECT COUNT(*) AS c FROM ribbons").fetchone()
        return row["c"]


def admin_get_ribbon(ribbon_id: str) -> Optional[dict]:
    with db() as conn:
        row = conn.execute("SELECT * FROM ribbons WHERE id=?", (ribbon_id,)).fetchone()
        if not row:
            return None
        echoes = conn.execute(
            "SELECT id, content, created_at, hidden FROM echoes WHERE ribbon_id=? ORDER BY created_at ASC",
            (ribbon_id,)
        ).fetchall()
        appends = conn.execute(
            "SELECT id, content, created_at FROM appends WHERE ribbon_id=? ORDER BY created_at ASC",
            (ribbon_id,)
        ).fetchall()
        return {
            "id": row["id"],
            "color": row["color"],
            "story": row["story"],
            "created_at": row["created_at"],
            "hidden": row["hidden"],
            "virtual_echo_count": row["virtual_echo_count"],
            "echoes": [dict(e) for e in echoes],
            "appends": [dict(a) for a in appends],
        }


def admin_delete_ribbon(ribbon_id: str) -> bool:
    with db() as conn:
        conn.execute("DELETE FROM echoes WHERE ribbon_id=?", (ribbon_id,))
        conn.execute("DELETE FROM appends WHERE ribbon_id=?", (ribbon_id,))
        cur = conn.execute("DELETE FROM ribbons WHERE id=?", (ribbon_id,))
        return cur.rowcount > 0


def admin_toggle_ribbon_hidden(ribbon_id: str) -> Optional[bool]:
    with db() as conn:
        row = conn.execute("SELECT hidden FROM ribbons WHERE id=?", (ribbon_id,)).fetchone()
        if not row:
            return None
        new_val = 0 if row["hidden"] else 1
        conn.execute("UPDATE ribbons SET hidden=? WHERE id=?", (new_val, ribbon_id))
        return bool(new_val)


def admin_set_virtual_echo_count(ribbon_id: str, count: int) -> bool:
    with db() as conn:
        cur = conn.execute(
            "UPDATE ribbons SET virtual_echo_count=? WHERE id=?", (max(0, count), ribbon_id)
        )
        return cur.rowcount > 0


# ==========================================
# Admin: 回响管理
# ==========================================

def admin_delete_echo(echo_id: int) -> bool:
    with db() as conn:
        cur = conn.execute("DELETE FROM echoes WHERE id=?", (echo_id,))
        return cur.rowcount > 0


def admin_toggle_echo_hidden(echo_id: int) -> Optional[bool]:
    with db() as conn:
        row = conn.execute("SELECT hidden FROM echoes WHERE id=?", (echo_id,)).fetchone()
        if not row:
            return None
        new_val = 0 if row["hidden"] else 1
        conn.execute("UPDATE echoes SET hidden=? WHERE id=?", (new_val, echo_id))
        return bool(new_val)


# ==========================================
# Admin: IP 封禁
# ==========================================

def ban_ip(ip: str, reason: str, days: int = 30):
    now = int(time.time())
    expire = now + days * 86400
    with db() as conn:
        conn.execute(
            "INSERT OR REPLACE INTO banned_ips(ip, reason, banned_at, expire_at) VALUES(?,?,?,?)",
            (ip, reason, now, expire)
        )


def is_ip_banned(ip: str) -> bool:
    now = int(time.time())
    with db() as conn:
        row = conn.execute(
            "SELECT 1 FROM banned_ips WHERE ip=? AND expire_at > ?", (ip, now)
        ).fetchone()
        return row is not None


def record_login_attempt(ip: str):
    with db() as conn:
        conn.execute(
            "INSERT INTO login_attempts(ip, attempted_at) VALUES(?,?)",
            (ip, int(time.time()))
        )


def count_recent_failures(ip: str, window_seconds: int = 3600) -> int:
    since = int(time.time()) - window_seconds
    with db() as conn:
        row = conn.execute(
            "SELECT COUNT(*) AS c FROM login_attempts WHERE ip=? AND attempted_at > ?",
            (ip, since)
        ).fetchone()
        return row["c"]


def list_banned_ips() -> list[dict]:
    now = int(time.time())
    with db() as conn:
        rows = conn.execute(
            "SELECT ip, reason, banned_at, expire_at FROM banned_ips WHERE expire_at > ? ORDER BY banned_at DESC",
            (now,)
        ).fetchall()
        return [dict(r) for r in rows]


def unban_ip(ip: str) -> bool:
    with db() as conn:
        cur = conn.execute("DELETE FROM banned_ips WHERE ip=?", (ip,))
        return cur.rowcount > 0


def admin_list_echoes(limit: int = 50, offset: int = 0) -> list[dict]:
    with db() as conn:
        rows = conn.execute(
            """SELECT e.id, e.ribbon_id, e.content, e.created_at, e.hidden, e.ip
               FROM echoes e
               ORDER BY e.created_at DESC
               LIMIT ? OFFSET ?""",
            (limit, offset)
        ).fetchall()
        return [dict(r) for r in rows]


def admin_total_echoes() -> int:
    with db() as conn:
        row = conn.execute("SELECT COUNT(*) AS c FROM echoes").fetchone()
        return row["c"]


# ==========================================
# AI 回响任务调度
# ==========================================

def schedule_ai_echo_slots(ribbon_id: str, delays: list[int], final_delay: int):
    """
    为指定丝带安排 6 个随机时间节点 + 1 个兜底节点。
    delays: 6个时间节点距离当前的秒数列表（已排序，相互间隔 >= 30分钟）
    final_delay: 兜底节点距离当前的秒数（在所有节点之后）
    """
    now = int(time.time())
    with db() as conn:
        for i, d in enumerate(delays):
            conn.execute(
                "INSERT INTO ai_echo_tasks(ribbon_id, scheduled_at, done, slot, is_final) VALUES(?,?,0,?,0)",
                (ribbon_id, now + d, i)
            )
        # 兜底节点
        conn.execute(
            "INSERT INTO ai_echo_tasks(ribbon_id, scheduled_at, done, slot, is_final) VALUES(?,?,0,6,1)",
            (ribbon_id, now + final_delay)
        )


def get_pending_ai_tasks(now: int = None) -> list[dict]:
    """获取当前时间已到期但未执行的 AI 任务"""
    if now is None:
        now = int(time.time())
    with db() as conn:
        rows = conn.execute(
            "SELECT id, ribbon_id, slot, is_final FROM ai_echo_tasks WHERE done=0 AND scheduled_at <= ?",
            (now,)
        ).fetchall()
        return [dict(r) for r in rows]


def mark_ai_task_done(task_id: int):
    with db() as conn:
        conn.execute("UPDATE ai_echo_tasks SET done=1 WHERE id=?", (task_id,))


def count_ribbon_ai_echoes(ribbon_id: str) -> int:
    """统计该丝带已生成的 AI 回响数量"""
    with db() as conn:
        row = conn.execute(
            "SELECT COUNT(*) AS c FROM echoes WHERE ribbon_id=? AND is_ai=1",
            (ribbon_id,)
        ).fetchone()
        return row["c"]


def get_ribbon_ai_echo_contents(ribbon_id: str) -> list[str]:
    """获取该丝带所有 AI 回响的文本（用于去重参考）"""
    with db() as conn:
        rows = conn.execute(
            "SELECT content FROM echoes WHERE ribbon_id=? AND is_ai=1 ORDER BY created_at ASC",
            (ribbon_id,)
        ).fetchall()
        return [r["content"] for r in rows]


def cancel_remaining_ai_tasks(ribbon_id: str):
    """将该丝带剩余未执行的所有 AI 任务标记为完成（用于兜底后清理）"""
    with db() as conn:
        conn.execute(
            "UPDATE ai_echo_tasks SET done=1 WHERE ribbon_id=? AND done=0",
            (ribbon_id,)
        )


# ==========================================
# 用户访问统计 (PV / UV)
# ==========================================

def record_page_view(ip: str, path: str):
    """记录一次页面访问（PV），同时用于 UV 去重统计"""
    import datetime
    date_str = datetime.date.today().isoformat()
    with db() as conn:
        conn.execute(
            "INSERT INTO page_views(date, ip, path, visited_at) VALUES(?,?,?,?)",
            (date_str, ip, path, int(time.time()))
        )


def get_daily_stats(days: int = 14) -> list[dict]:
    """返回最近 N 天的每日 PV 和 UV 统计"""
    import datetime
    today = datetime.date.today()
    dates = [(today - datetime.timedelta(days=i)).isoformat() for i in range(days - 1, -1, -1)]
    with db() as conn:
        rows = conn.execute(
            """SELECT date,
                      COUNT(*) AS pv,
                      COUNT(DISTINCT ip) AS uv
               FROM page_views
               WHERE date >= ?
               GROUP BY date""",
            (dates[0],)
        ).fetchall()
    stat_map = {r["date"]: {"pv": r["pv"], "uv": r["uv"]} for r in rows}
    return [
        {"date": d, "pv": stat_map.get(d, {}).get("pv", 0), "uv": stat_map.get(d, {}).get("uv", 0)}
        for d in dates
    ]


def get_today_stats() -> dict:
    """返回今日 PV 和 UV"""
    import datetime
    date_str = datetime.date.today().isoformat()
    with db() as conn:
        row = conn.execute(
            "SELECT COUNT(*) AS pv, COUNT(DISTINCT ip) AS uv FROM page_views WHERE date=?",
            (date_str,)
        ).fetchone()
    return {"pv": row["pv"], "uv": row["uv"]} if row else {"pv": 0, "uv": 0}


def get_total_stats() -> dict:
    """返回累计总 PV 和去重总 UV"""
    with db() as conn:
        row = conn.execute(
            "SELECT COUNT(*) AS pv, COUNT(DISTINCT ip) AS uv FROM page_views"
        ).fetchone()
    return {"pv": row["pv"], "uv": row["uv"]} if row else {"pv": 0, "uv": 0}
