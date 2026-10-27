"""
大模型调用配置层测试（米羊 Gateway）
覆盖：配置加载与校验、请求构造（各角色）、API Key 优先级、调用点模型选择、
      以及有真实 Key 时的联网连通性测试（无真实 Key 自动跳过）
"""
import asyncio
import json
import os
import sys

import pytest
from dotenv import dotenv_values

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, ROOT)

import llm  # noqa: E402

QWEN = "aliyun_bailian_shanghai/qwen3.8-flash"
GEMINI = "miyang/gemini-3.8-flash"
MESSAGES = [{"role": "user", "content": "hi"}]


@pytest.fixture(autouse=True)
def _reset_llm_config():
    llm.reload_config()
    yield
    llm.reload_config()


@pytest.fixture
def no_env_key(monkeypatch):
    monkeypatch.delenv("MIYANG_API_KEY", raising=False)


# ==========================================
# 配置加载
# ==========================================

class TestConfig:
    def test_gateway_base_url(self):
        url, _, _ = llm.build_request("moderation", MESSAGES)
        assert url == "https://api.alice.fans/api/v1/chat/completions"

    def test_role_to_model_mapping(self):
        assert llm.get_model_id("moderation") == QWEN
        assert llm.get_model_id("echo") == GEMINI
        assert llm.get_model_id("playground") == QWEN

    def test_timeouts(self):
        assert llm.get_timeout() == 30.0
        assert llm.get_timeout(stream=True) == 60.0

    def test_role_timeout_overrides_gateway_default(self):
        assert llm.get_timeout(role="echo") == 90.0

    def test_role_without_timeout_falls_back_to_gateway(self):
        assert llm.get_timeout(role="moderation") == 30.0
        assert llm.get_timeout(stream=True, role="playground") == 60.0

    def test_api_key_env_name(self):
        assert llm.get_api_key_env_name() == "MIYANG_API_KEY"

    def test_unknown_role_raises(self):
        with pytest.raises(KeyError):
            llm.build_request("nope", MESSAGES)

    def _use_config(self, monkeypatch, tmp_path, text):
        path = tmp_path / "llm.yaml"
        path.write_text(text, encoding="utf-8")
        monkeypatch.setattr(llm, "CONFIG_PATH", str(path))
        llm.reload_config()

    def test_missing_config_file(self, monkeypatch, tmp_path):
        monkeypatch.setattr(llm, "CONFIG_PATH", str(tmp_path / "absent.yaml"))
        llm.reload_config()
        with pytest.raises(llm.LLMConfigError):
            llm.get_model_id("moderation")

    def test_invalid_yaml(self, monkeypatch, tmp_path):
        self._use_config(monkeypatch, tmp_path, "gateway: [unclosed")
        with pytest.raises(llm.LLMConfigError):
            llm.get_model_id("moderation")

    def test_missing_gateway_section(self, monkeypatch, tmp_path):
        self._use_config(monkeypatch, tmp_path, "models:\n  a:\n    id: x\n")
        with pytest.raises(llm.LLMConfigError):
            llm.get_model_id("a")

    def test_missing_base_url(self, monkeypatch, tmp_path):
        self._use_config(
            monkeypatch, tmp_path,
            "gateway:\n  api_key_env: K\nmodels:\n  a:\n    id: x\n",
        )
        with pytest.raises(llm.LLMConfigError):
            llm.get_model_id("a")

    def test_model_without_id(self, monkeypatch, tmp_path):
        self._use_config(
            monkeypatch, tmp_path,
            "gateway:\n  base_url: http://x\n  api_key_env: K\nmodels:\n  a:\n    enable_thinking: false\n",
        )
        with pytest.raises(llm.LLMConfigError):
            llm.get_model_id("a")

    def test_empty_models(self, monkeypatch, tmp_path):
        self._use_config(
            monkeypatch, tmp_path,
            "gateway:\n  base_url: http://x\n  api_key_env: K\nmodels: {}\n",
        )
        with pytest.raises(llm.LLMConfigError):
            llm.get_model_id("a")

    def test_base_url_trailing_slash_and_custom_key_env(self, monkeypatch, tmp_path):
        self._use_config(
            monkeypatch, tmp_path,
            "gateway:\n  base_url: http://x/v1/\n  api_key_env: MY_CUSTOM_KEY\n"
            "models:\n  a:\n    id: m\n",
        )
        monkeypatch.setenv("MY_CUSTOM_KEY", "k123")
        url, headers, payload = llm.build_request("a", MESSAGES)
        assert url == "http://x/v1/chat/completions"
        assert headers["Authorization"] == "Bearer k123"
        assert payload["model"] == "m"


# ==========================================
# 请求构造
# ==========================================

class TestBuildRequest:
    def test_moderation_payload(self):
        _, headers, payload = llm.build_request("moderation", MESSAGES)
        assert payload["model"] == QWEN
        assert payload["messages"] == MESSAGES
        assert payload["stream"] is False
        assert payload["enable_thinking"] is False
        assert "max_tokens" not in payload
        assert headers["Content-Type"] == "application/json"

    def test_playground_payload(self):
        _, _, payload = llm.build_request("playground", MESSAGES, stream=True)
        assert payload["model"] == QWEN
        assert payload["stream"] is True
        assert payload["enable_thinking"] is False

    def test_echo_payload_has_no_thinking_flag(self):
        _, _, payload = llm.build_request("echo", MESSAGES)
        assert payload["model"] == GEMINI
        assert "enable_thinking" not in payload

    def test_echo_default_max_tokens_leaves_room_for_thinking(self):
        """回归：max_tokens=60 时 Gemini 思考 token 会耗尽额度，返回空内容"""
        _, _, payload = llm.build_request("echo", MESSAGES)
        assert payload["max_tokens"] >= 256

    def test_explicit_max_tokens_overrides_config(self):
        _, _, payload = llm.build_request("echo", MESSAGES, max_tokens=99)
        assert payload["max_tokens"] == 99

    def test_roles_without_configured_max_tokens_omit_it(self):
        _, _, payload = llm.build_request("moderation", MESSAGES)
        assert "max_tokens" not in payload

    def test_payload_is_json_serialisable(self):
        _, _, payload = llm.build_request("echo", MESSAGES)
        json.dumps(payload)

    def test_explicit_key_beats_env(self, monkeypatch):
        monkeypatch.setenv("MIYANG_API_KEY", "from-env")
        _, headers, _ = llm.build_request("moderation", MESSAGES, api_key="explicit")
        assert headers["Authorization"] == "Bearer explicit"

    def test_env_key_used_by_default(self, monkeypatch):
        monkeypatch.setenv("MIYANG_API_KEY", "from-env")
        _, headers, _ = llm.build_request("moderation", MESSAGES)
        assert headers["Authorization"] == "Bearer from-env"

    def test_no_key_gives_empty_bearer(self, no_env_key):
        _, headers, _ = llm.build_request("moderation", MESSAGES)
        assert headers["Authorization"] == "Bearer "
        assert llm.get_api_key() is None

    def test_empty_env_key_treated_as_missing(self, monkeypatch):
        monkeypatch.setenv("MIYANG_API_KEY", "")
        assert llm.get_api_key() is None


# ==========================================
# 调用点：自动回响应使用 Gemini
# ==========================================

class _FakeResponse:
    def __init__(self, content):
        self._content = content

    def raise_for_status(self):
        pass

    def json(self):
        return {"choices": [{"message": {"content": self._content}}]}


def _install_fake_httpx(monkeypatch, behaviours):
    """behaviours：单个值或列表。每个元素是响应内容（str / None），或要抛出的异常实例。
    列表按调用顺序依次消费，用完后重复最后一个。"""
    import httpx
    seq = list(behaviours) if isinstance(behaviours, (list, tuple)) else [behaviours]
    captured = {"calls": 0}

    class FakeClient:
        def __init__(self, *args, **kwargs):
            captured["timeout"] = kwargs.get("timeout")

        async def __aenter__(self):
            return self

        async def __aexit__(self, *exc):
            return False

        async def post(self, url, headers=None, json=None):
            captured["url"] = url
            captured["headers"] = headers
            captured["payload"] = json
            item = seq[min(captured["calls"], len(seq) - 1)]
            captured["calls"] += 1
            if isinstance(item, Exception):
                raise item
            return _FakeResponse(item)

    monkeypatch.setattr(httpx, "AsyncClient", FakeClient)
    return captured


class TestAiEchoCallSite:
    def test_echo_uses_gemini_and_trims(self, monkeypatch):
        monkeypatch.setenv("MIYANG_API_KEY", "k")
        import main
        captured = _install_fake_httpx(monkeypatch, "  " + "好" * 40 + "  ")

        result = asyncio.run(main._generate_ai_echo("有一个人很难过", existing_echoes=["我懂"]))

        assert result == "好" * 30
        assert captured["url"] == "https://api.alice.fans/api/v1/chat/completions"
        assert captured["payload"]["model"] == GEMINI
        assert captured["payload"]["max_tokens"] >= 256
        assert "enable_thinking" not in captured["payload"]
        assert captured["headers"]["Authorization"] == "Bearer k"
        assert captured["timeout"] == 90.0
        assert captured["calls"] == 1
        user_msg = captured["payload"]["messages"][1]["content"]
        assert "有一个人很难过" in user_msg and "我懂" in user_msg

    def test_echo_returns_none_without_key(self, no_env_key):
        import main
        assert asyncio.run(main._generate_ai_echo("x")) is None

    def test_echo_empty_content_returns_none_after_retry(self, monkeypatch):
        """模型一直返回空内容（如思考耗尽额度）时返回 None，而不是空串"""
        monkeypatch.setenv("MIYANG_API_KEY", "k")
        import main
        captured = _install_fake_httpx(monkeypatch, "   ")
        assert asyncio.run(main._generate_ai_echo("有一个人很难过")) is None
        assert captured["calls"] == main._AI_ECHO_MAX_ATTEMPTS

    def test_echo_null_content_returns_none(self, monkeypatch):
        monkeypatch.setenv("MIYANG_API_KEY", "k")
        import main
        _install_fake_httpx(monkeypatch, None)
        assert asyncio.run(main._generate_ai_echo("有一个人很难过")) is None

    def test_echo_retries_after_empty_then_succeeds(self, monkeypatch):
        monkeypatch.setenv("MIYANG_API_KEY", "k")
        import main
        captured = _install_fake_httpx(monkeypatch, ["", "我在这里。"])
        assert asyncio.run(main._generate_ai_echo("有一个人很难过")) == "我在这里。"
        assert captured["calls"] == 2

    def test_echo_retries_after_timeout_then_succeeds(self, monkeypatch):
        import httpx
        monkeypatch.setenv("MIYANG_API_KEY", "k")
        import main
        captured = _install_fake_httpx(monkeypatch, [httpx.ReadTimeout(""), "辛苦了。"])
        assert asyncio.run(main._generate_ai_echo("有一个人很难过")) == "辛苦了。"
        assert captured["calls"] == 2

    def test_echo_gives_up_after_max_attempts(self, monkeypatch):
        import httpx
        monkeypatch.setenv("MIYANG_API_KEY", "k")
        import main
        captured = _install_fake_httpx(monkeypatch, httpx.ReadTimeout(""))
        assert asyncio.run(main._generate_ai_echo("有一个人很难过")) is None
        assert captured["calls"] == main._AI_ECHO_MAX_ATTEMPTS


# ==========================================
# 联网连通性（需要真实 Key，否则跳过）
# ==========================================

def _real_key():
    key = dotenv_values(os.path.join(ROOT, ".env")).get("MIYANG_API_KEY") or os.environ.get("MIYANG_API_KEY")
    return key if key and key.startswith("miyang-") else None


live = pytest.mark.skipif(_real_key() is None, reason="未配置真实 MIYANG_API_KEY")


@pytest.fixture
def live_key(monkeypatch):
    monkeypatch.setenv("MIYANG_API_KEY", _real_key())
    return _real_key()


@live
class TestLiveGateway:
    def _post(self, role, messages, **kw):
        import httpx
        url, headers, payload = llm.build_request(role, messages, **kw)
        return httpx.post(url, headers=headers, json=payload, timeout=llm.get_timeout())

    def test_moderation_model_reachable(self, live_key):
        r = self._post("moderation", [{"role": "user", "content": "回复OK"}])
        assert r.status_code == 200, r.text
        assert r.json()["choices"][0]["message"]["content"].strip()

    def test_echo_model_never_returns_empty(self, live_key):
        """回归：旧配置 max_tokens=60 约 8% 概率空内容（思考 token 耗尽额度）。
        这里连续调用多次，必须每次都有正文。"""
        from main import _AI_ECHO_PROMPT
        stories = [
            "有一个人今天被老板骂了，很委屈。",
            "有一个人很久没有笑过了。",
            "有一个人想念一个联系不到的人。",
            "有一个人觉得自己什么都做不好。",
            "有一个人今天考试没考好，不敢告诉家人。",
            "有一个人睡不着，脑子停不下来。",
        ]
        for story in stories:
            r = self._post(
                "echo",
                [
                    {"role": "system", "content": _AI_ECHO_PROMPT},
                    {"role": "user", "content": story},
                ],
            )
            assert r.status_code == 200, r.text
            choice = r.json()["choices"][0]
            assert choice["message"]["content"].strip(), (
                f"空内容 finish_reason={choice.get('finish_reason')} usage={r.json().get('usage')}"
            )

    def test_playground_stream_ends_with_done(self, live_key):
        import httpx
        url, headers, payload = llm.build_request(
            "playground", [{"role": "user", "content": "用一句话介绍树洞"}], stream=True
        )
        text, done = [], False
        with httpx.stream("POST", url, headers=headers, json=payload, timeout=llm.get_timeout(True)) as r:
            assert r.status_code == 200
            for line in r.iter_lines():
                if not line.startswith("data: "):
                    continue
                data = line[6:].strip()
                if data == "[DONE]":
                    done = True
                    break
                chunk = json.loads(data)
                if chunk.get("choices"):
                    text.append(chunk["choices"][0].get("delta", {}).get("content") or "")
        assert done
        assert "".join(text).strip()

    def test_invalid_key_is_rejected(self):
        import httpx
        url, headers, payload = llm.build_request(
            "moderation", MESSAGES, api_key="miyang-invalid-key-for-test"
        )
        r = httpx.post(url, headers=headers, json=payload, timeout=30)
        assert r.status_code in (401, 403)


@live
class TestLiveEndToEnd:
    """通过 FastAPI 接口走完整的 审核+改写 链路（只调 /api/ribbon/process，不写库）"""

    @pytest.fixture
    def client(self, tmp_path, live_key):
        import db as database
        from fastapi.testclient import TestClient
        original = database.DB_PATH
        database.DB_PATH = str(tmp_path / "live.db")
        database.init_db()
        from main import app
        with TestClient(app) as c:
            yield c
        database.DB_PATH = original

    def test_normal_text_is_allowed_and_rewritten(self, client):
        r = client.post("/api/ribbon/process", json={"text": "今天被老板骂了，很委屈，真的做不下去了。"})
        assert r.status_code == 200
        body = r.json()
        assert body["allow_publish"] is True
        assert body["color"] in {"blue", "orange", "pink", "green", "purple", "grey", "gray", "gold"}
        assert body["content"]

    def test_contact_info_is_blocked(self, client):
        r = client.post("/api/ribbon/process", json={"text": "想找人聊天加我微信 abc123456，私信我"})
        assert r.status_code == 200
        assert r.json()["allow_publish"] is False

    def test_crisis_text_is_blocked_with_hotline(self, client):
        r = client.post("/api/ribbon/process", json={"text": "我不想活了，真的撑不下去了"})
        assert r.status_code == 200
        body = r.json()
        assert body["allow_publish"] is False
        assert "400-161-9995" in body["content"]
