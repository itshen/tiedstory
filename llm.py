"""
大模型调用配置层（米羊 Gateway，OpenAI 兼容）

业务代码只按「角色」取用，端点 / 模型 / 超时 / 思考开关统一由 config/llm.yaml 管理。
详见 PRD_llm_gateway.md。
"""

from __future__ import annotations

import os
from functools import lru_cache
from typing import Optional

import yaml

CONFIG_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "config", "llm.yaml")


class LLMConfigError(RuntimeError):
    """llm.yaml 缺失或格式不合法"""


@lru_cache(maxsize=1)
def _load_config() -> dict:
    try:
        with open(CONFIG_PATH, "r", encoding="utf-8") as f:
            cfg = yaml.safe_load(f)
    except FileNotFoundError as e:
        raise LLMConfigError(f"LLM 配置文件不存在: {CONFIG_PATH}") from e
    except yaml.YAMLError as e:
        raise LLMConfigError(f"LLM 配置文件解析失败: {e}") from e

    if not isinstance(cfg, dict):
        raise LLMConfigError("LLM 配置文件顶层必须是映射")

    gateway = cfg.get("gateway")
    if not isinstance(gateway, dict):
        raise LLMConfigError("缺少 gateway 配置")
    for key in ("base_url", "api_key_env"):
        if not gateway.get(key):
            raise LLMConfigError(f"gateway.{key} 未配置")

    models = cfg.get("models")
    if not isinstance(models, dict) or not models:
        raise LLMConfigError("缺少 models 配置")
    for role, spec in models.items():
        if not isinstance(spec, dict) or not spec.get("id"):
            raise LLMConfigError(f"models.{role}.id 未配置")

    return cfg


def reload_config() -> None:
    """清除缓存（测试或热更新配置时使用）"""
    _load_config.cache_clear()


def _model_spec(role: str) -> dict:
    models = _load_config()["models"]
    if role not in models:
        raise KeyError(f"未知的模型角色: {role}（可用: {', '.join(models)}）")
    return models[role]


def get_api_key() -> Optional[str]:
    """读取 API Key；未配置返回 None"""
    env_name = _load_config()["gateway"]["api_key_env"]
    return os.getenv(env_name) or None


def get_api_key_env_name() -> str:
    """API Key 对应的环境变量名（用于错误提示）"""
    return _load_config()["gateway"]["api_key_env"]


def get_model_id(role: str) -> str:
    return _model_spec(role)["id"]


def get_timeout(stream: bool = False, role: Optional[str] = None) -> float:
    """请求超时（秒）。角色在配置里单独设置了 timeout 时优先使用，否则用网关默认值。"""
    if role is not None:
        role_timeout = _model_spec(role).get("timeout")
        if role_timeout is not None:
            return float(role_timeout)
    gateway = _load_config()["gateway"]
    if stream:
        return float(gateway.get("stream_timeout", 60))
    return float(gateway.get("timeout", 30))


def build_request(
    role: str,
    messages: list[dict],
    *,
    stream: bool = False,
    max_tokens: Optional[int] = None,
    api_key: Optional[str] = None,
) -> tuple[str, dict, dict]:
    """
    构造 chat/completions 请求，返回 (url, headers, payload)。

    api_key 缺省读取环境变量；两者都没有时 Authorization 里为空 Key，
    由上游返回 401，调用方沿用原有异常处理。
    """
    cfg = _load_config()
    spec = _model_spec(role)

    url = cfg["gateway"]["base_url"].rstrip("/") + "/chat/completions"
    key = api_key or get_api_key() or ""
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {key}",
    }

    payload: dict = {
        "model": spec["id"],
        "messages": messages,
        "stream": stream,
    }
    if "enable_thinking" in spec:
        payload["enable_thinking"] = bool(spec["enable_thinking"])
    # 显式传入优先，其次用角色在配置里的默认值
    if max_tokens is None:
        max_tokens = spec.get("max_tokens")
    if max_tokens is not None:
        payload["max_tokens"] = int(max_tokens)

    return url, headers, payload
