"""
TiedStory MCP Server — Streamable HTTP
将 TiedStory 的核心能力暴露为 MCP Tools，供 AI Agent 通过 Streamable HTTP 调用。
"""

from __future__ import annotations

import os
import logging
from mcp.server.fastmcp import FastMCP
from mcp.server.fastmcp.server import TransportSecuritySettings

import db as database

logger = logging.getLogger(__name__)

_site_domain = os.getenv("SITE_DOMAIN", "https://tiedstory.com")
_host_from_domain = _site_domain.replace("https://", "").replace("http://", "")

mcp = FastMCP(
    "TiedStory",
    instructions=(
        "TiedStory 是一个匿名情感树洞平台。"
        "用户写下心事，AI 将其改写为第三人称故事并以「丝带」形态展示。"
        "路过的人可以阅读故事、留下匿名回响。"
        "丝带颜色代表不同情绪：blue=悲伤, orange=愤怒, pink=思念, "
        "green=疲惫, purple=迷茫, gray=麻木, gold=喜悦。"
    ),
    stateless_http=True,
    streamable_http_path="/",
    host="0.0.0.0",
    transport_security=TransportSecuritySettings(
        enable_dns_rebinding_protection=True,
        allowed_hosts=[
            _host_from_domain,
            f"{_host_from_domain}:*",
            "localhost:*",
            "127.0.0.1:*",
        ],
    ),
)


def _time_ago(ts: int) -> str:
    import time
    diff = int(time.time()) - ts
    if diff < 60:
        return "刚刚"
    if diff < 3600:
        return f"{diff // 60} 分钟前"
    if diff < 86400:
        return f"{diff // 3600} 小时前"
    if diff < 86400 * 30:
        return f"{diff // 86400} 天前"
    if diff < 86400 * 365:
        return f"{diff // (86400 * 30)} 个月前"
    return f"{diff // (86400 * 365)} 年前"


# ==========================================
# MCP Tools
# ==========================================

@mcp.tool()
def list_ribbons(
    limit: int = 10,
    offset: int = 0,
    color: str | None = None,
) -> dict:
    """浏览丝带列表（分页），可按情绪颜色过滤。
    颜色: blue/orange/pink/green/purple/gray/gold"""
    limit = min(max(1, limit), 50)
    offset = max(0, offset)
    ribbons = database.list_ribbons(limit=limit, offset=offset, color=color)
    total = database.total_ribbons(color=color)
    return {
        "total": total,
        "ribbons": [
            {
                "id": r["id"],
                "color": r["color"],
                "story": r["story"],
                "echo_count": r["echo_count"],
                "time": _time_ago(r["created_at"]),
            }
            for r in ribbons
        ],
    }


@mcp.tool()
def get_ribbon(ribbon_id: str) -> dict:
    """查看单条丝带的完整内容，包含所有回响和追加"""
    ribbon_id = ribbon_id.upper()
    data = database.get_ribbon(ribbon_id)
    if not data:
        return {"error": "ribbon_not_found", "message": f"丝带 {ribbon_id} 不存在"}
    data["time"] = _time_ago(data["created_at"])
    for e in data.get("echoes", []):
        e["time"] = _time_ago(e["created_at"])
        if not e.get("author"):
            e["author"] = ""
    for a in data.get("appends", []):
        a["time"] = _time_ago(a["created_at"])
    return data


@mcp.tool()
def random_ribbon() -> dict:
    """随机查看一条丝带（含回响列表），适合闲逛树洞时使用"""
    data = database.random_ribbon()
    if not data:
        return {"error": "no_ribbons", "message": "还没有丝带"}
    data["time"] = _time_ago(data["created_at"])
    for e in data.get("echoes", []):
        e["time"] = _time_ago(e["created_at"])
        if not e.get("author"):
            e["author"] = ""
    for a in data.get("appends", []):
        a["time"] = _time_ago(a["created_at"])
    return data


@mcp.tool()
def search_ribbons(keyword: str, limit: int = 10, offset: int = 0) -> dict:
    """搜索丝带内容（模糊匹配故事文本）"""
    if not keyword.strip():
        return {"error": "empty_keyword", "message": "搜索关键词不能为空"}
    limit = min(max(1, limit), 50)
    offset = max(0, offset)
    ribbons, total = database.search_ribbons(keyword.strip(), limit=limit, offset=offset)
    return {
        "total": total,
        "ribbons": [
            {
                "id": r["id"],
                "color": r["color"],
                "story": r["story"],
                "echo_count": r["echo_count"],
                "time": _time_ago(r["created_at"]),
            }
            for r in ribbons
        ],
    }


@mcp.tool()
def add_echo(ribbon_id: str, content: str, author: str = "") -> dict:
    """给某条丝带留下一句匿名回响（共鸣、鼓励或陪伴的话）。
    content: 回响内容，1-100 字。author: 可选署名，最长 20 字。"""
    ribbon_id = ribbon_id.upper()
    content = content.strip()
    author = author.strip()

    if not content:
        return {"error": "empty_content", "message": "回响内容不能为空"}
    if len(content) > 100:
        return {"error": "content_too_long", "message": "回响内容不能超过 100 字"}
    if len(author) > 20:
        author = author[:20]

    echo_id = database.add_echo(ribbon_id, content, ip="mcp", author=author)
    if echo_id is None:
        return {"error": "ribbon_not_found", "message": f"丝带 {ribbon_id} 不存在"}

    logger.info(f"[MCP] Echo added: ribbon={ribbon_id} echo_id={echo_id}")
    return {"ok": True, "echo_id": echo_id}


@mcp.tool()
def create_ribbon(text: str) -> dict:
    """发一条新丝带到树上。系统会进行 AI 内容审核和改写。
    text: 用户的心事原文，1-500 字。"""
    import os
    import re
    import httpx

    text = text.strip()
    if not text:
        return {"error": "empty_text", "message": "内容不能为空"}
    if len(text) > 500:
        return {"error": "text_too_long", "message": "内容不能超过 500 字"}

    actual_key = os.getenv("TOKENDANCE_API_KEY")
    if not actual_key:
        return {"error": "config_error", "message": "服务端 AI Key 未配置"}

    from main import _get_tree_whisper_prompt, _check_injection, _check_output_leak

    if _check_injection(text):
        logger.warning(f"[MCP] Injection detected: {text[:80]}")
        return {"error": "rejected", "message": "内容包含非法指令"}

    url = "https://tokendance.space/gateway/v1/chat/completions"
    headers = {"Content-Type": "application/json", "Authorization": f"Bearer {actual_key}"}
    payload = {
        "model": "qwen3.5-plus",
        "messages": [
            {"role": "system", "content": _get_tree_whisper_prompt()},
            {"role": "user", "content": text},
        ],
        "stream": False,
        "enable_thinking": False,
    }

    try:
        resp = httpx.post(url, headers=headers, json=payload, timeout=30.0)
        resp.raise_for_status()
        raw = resp.json()["choices"][0]["message"]["content"]

        raw = re.sub(r"```xml\s*", "", raw)
        raw = re.sub(r"```\s*", "", raw)

        color_m = re.search(r"<color>(.*?)</color>", raw, re.DOTALL)
        publish_m = re.search(r"<allow_publish>(.*?)</allow_publish>", raw, re.DOTALL)
        detail_m = re.search(r"<detail>(.*?)</detail>", raw, re.DOTALL)
        content_m = re.search(r"<content>(.*?)</content>", raw, re.DOTALL)

        color = color_m.group(1).strip().lower() if color_m else "grey"
        allow_publish = publish_m.group(1).strip().lower() == "true" if publish_m else True
        detail = detail_m.group(1).strip() if detail_m else ""
        content = content_m.group(1).strip() if content_m else raw.strip()

        valid_colors = {"blue", "orange", "pink", "green", "purple", "grey", "gray", "gold"}
        if color not in valid_colors:
            color = "grey"

        if allow_publish and _check_output_leak(content):
            logger.warning(f"[MCP] Output leak blocked: {content[:80]}")
            return {"error": "rejected", "message": "内容审核未通过"}

        if not allow_publish:
            return {"error": "rejected", "message": detail or "内容审核未通过"}

        saved = database.save_ribbon(color=color, story=content, ip="mcp")

        from main import _gen_ai_echo_slots
        slots, final_delay = _gen_ai_echo_slots()
        database.schedule_ai_echo_slots(saved["id"], slots, final_delay)

        logger.info(f"[MCP] Ribbon created: id={saved['id']} color={color}")
        return {
            "ok": True,
            "ribbon_id": saved["id"],
            "witness": saved["witness"],
            "color": color,
            "story": content,
            "detail": detail,
        }
    except httpx.HTTPError as e:
        logger.error(f"[MCP] AI API error: {e}")
        return {"error": "ai_error", "message": f"AI 服务调用失败: {e}"}
    except Exception as e:
        logger.error(f"[MCP] Create ribbon error: {e}", exc_info=True)
        return {"error": "server_error", "message": f"服务处理失败: {e}"}


@mcp.tool()
def site_stats() -> dict:
    """查看 TiedStory 站点统计（今日 PV/UV + 累计 PV/UV）"""
    today = database.get_nginx_today_stats()
    total = database.get_nginx_total_stats()
    return {"today": today, "total": total}
