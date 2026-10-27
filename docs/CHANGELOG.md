# TiedStory Changelog

## 2026-10-28

### 变更：大模型调用切换至米羊 Gateway，按用途分配模型

**内容**：所有大模型调用从词元跳动（TokenDance）切换到米羊 Gateway（`https://api.alice.fans/api/v1`），并把端点 / 模型 / 超时 / 思考开关收敛到 `config/llm.yaml`，业务代码只通过 `llm.build_request(role, ...)` 取用，不再硬编码。

| 角色 | 模型 | 用途 |
|---|---|---|
| `moderation` | `aliyun_bailian_shanghai/qwen3.8-flash` | 树语：审核 + 改写（保持一次调用） |
| `echo` | `miyang/gemini-3.8-flash` | AI 自动回响 |
| `playground` | `aliyun_bailian_shanghai/qwen3.8-flash` | Playground 对话 |

- 环境变量：`TOKENDANCE_API_KEY` → `MIYANG_API_KEY`
- 共 8 处调用点改造（`main.py` 7 处、`mcp_server.py` 1 处）；提示词、注入检测、泄漏检测不变
- 审核与改写仍是一次调用（树语提示词同时输出颜色、是否发布、摘要、改写内容）；曾讨论拆成两次，最终决定保持一步，审核与改写统一用 qwen3.8-flash

**新增文件**：`llm.py`、`config/llm.yaml`、`PRD_llm_gateway.md`、`tests/test_llm.py`、`tests/test_mcp.py`
**修改文件**：`main.py`、`mcp_server.py`、`templates/playground/ai.html`、`tests/test_open_api.py`
**验证**：全部 94 个测试通过（含联网测试）；用临时库端到端验证了 analyze / process / rewrite（流式）/ save（含二次审核）/ Open API / MCP create_ribbon / Playground 流式 / AI 回响
**状态**：✅ 已完成

### BUG-002：Gemini 自动回响约 8% 返回空内容

**现象**：联网测试中 `miyang/gemini-3.8-flash` 在 `max_tokens=60` 下偶发返回空字符串；25 次里有 2 次，`finish_reason=length`、`completion_tokens=0`。
**根因**：Gemini 的隐藏思考 token 也计入 `max_tokens`，思考消耗约 56 个 token 即耗尽 60 的额度，正文一个字都没输出。线上会表现为 AI 回响静默丢失。
**修复**：`echo.max_tokens` 放宽到 512（字数仍由提示词约束并在代码里截断到 30 字）；空内容时记录带 `finish_reason` 的警告日志并返回 `None`，不再返回空串。修复后 40/40 正常。
**修复文件**：`config/llm.yaml`、`llm.py`、`main.py`
**状态**：✅ 已修复

### BUG-003：Gemini 偶发超时导致 AI 回响永久丢失

**现象**：联网测试中出现一次 `ReadTimeout`（>30 秒），此前样本最慢 11 秒。
**根因**：上游长尾延迟；而调度器在生成**之前**就把任务标记完成，一次失败就让这条回响永久丢失，兜底（必定生成）节点也不例外。
**修复**：`echo.timeout` 放宽到 90 秒（后台任务无人等待）；`_generate_ai_echo` 对超时 / 5xx / 空内容最多尝试 2 次；异常日志改为 `类型: 信息`，避免 `ReadTimeout` 的 `str(e)` 为空导致日志无信息。
**修复文件**：`config/llm.yaml`、`llm.py`（`get_timeout(role=...)`）、`main.py`
**状态**：✅ 已修复

### BUG-004：MCP 接入后应用只能启动一次，原有 25 个 Open API 测试全部失败

**现象**：上一版接入 MCP 后，进程内第二次启动应用（如 `TestClient`）报 `RuntimeError: StreamableHTTPSessionManager .run() can only be called once per instance`，`tests/test_open_api.py` 全部报错。线上进程只启动一次所以未暴露；上一版仅做了手动冒烟，没有跑原有测试套件。
**根因**：MCP session manager 是模块级单例，而 `run()` 每个实例只能调用一次。
**修复**：新增 `MCPGateway`，每次 lifespan 启动都重新构建 MCP server 与 session manager，关闭后置空，未就绪时返回 503；Tool 改为普通函数 + `server.add_tool()` 注册。
**修复文件**：`mcp_server.py`、`main.py`
**状态**：✅ 已修复

### BUG-005：`/mcp` 返回 307 重定向到 `/mcp/`

**现象**：`POST https://tiedstory.com/mcp` 返回 307，需带末尾斜杠才能访问；多数 MCP 客户端配置的是不带斜杠的地址，对 POST 重定向支持参差不齐。
**根因**：用 `app.mount("/mcp", ...)` 挂载子应用，Starlette 对挂载点做了斜杠重定向。
**修复**：改为直接注册 `/mcp` 与 `/mcp/` 两条路由指向 `MCPGateway`，两者均直接返回 200。
**修复文件**：`main.py`
**状态**：✅ 已修复

### UI 优化：丝带详情弹窗底部排版拥挤

**现象**：回响输入框与下方「我是这条丝带的作者，想追加内容」虚线框紧贴在一起；底部「树语的声音，由 TokenDance 点亮」字小且对比度极低，文字还偏左，整体像糊成一团。
**根因**：`.story-witness-area` 只有下边距、没有上边距；署名里 hover 才显示的「了解更多 ›」虽然透明但仍占位，把居中文字挤向左侧。
**修复**：输入行与虚线框之间加 14px 间距；署名在弹窗内加大上方留白（22px / 16px）、字号 11→12px、文字与分隔线对比度提高；「了解更多 ›」改为绝对定位，不再占位，署名真正居中。首页底部的署名同样受益于居中修复。
**修改文件**：`templates/playground/ui.html`
**状态**：✅ 已完成（未做浏览器截图验证，需你在页面上确认效果）

### 已知待优化项

- MCP 的 `create_ribbon` / `add_echo` 没有 IP 限流（`ip` 固定记为 `"mcp"`），`add_echo` 也没有注入检测，与 Open API 不一致
- 前台「树语的声音，由 TokenDance 点亮」署名与新供应商不一致，待产品决定
- Key 曾在聊天中明文出现，上线后建议到控制台轮换

---

## 2026-04-24

### 新增功能：MCP Server（Streamable HTTP）

**内容**：为 TiedStory 添加 MCP（Model Context Protocol）服务端能力，使 AI Agent 可通过标准 MCP 协议接入树洞平台。

**传输方式**：Streamable HTTP（无状态模式），端点 `POST /mcp`

**暴露的 MCP Tools（7 个）：**
- `list_ribbons` — 浏览丝带列表（分页 + 颜色过滤）
- `get_ribbon` — 查看单条丝带详情（含回响和追加）
- `search_ribbons` — 搜索丝带内容
- `random_ribbon` — 随机看一条丝带
- `create_ribbon` — 发新丝带（完整 AI 审核+改写+保存）
- `add_echo` — 给丝带留回响
- `site_stats` — 查看站点统计

**新增文件**：
- `mcp_server.py` — MCP Server 定义（FastMCP 实例 + 7 个 Tool）

**修改文件**：
- `main.py` — 挂载 MCP Starlette 子应用到 `/mcp`
- `requirements.txt` — 添加 `mcp>=1.26.0` 依赖

**状态**：✅ 已完成

---

### BUG-001：POST /open/api/ribbon 返回 500，AI 改写超时

**现象**：`POST /open/api/ribbon` 返回 HTTP 500，耗时 ~31 秒，`reason` 字段冒号后为空。其余所有接口正常。网页端 `/api/ribbon/process` 也同样 500。  
**根因**：切换到词元跳动（TokenDance）网关后移除了 `enable_thinking: false` 参数，但 `qwen3.5-plus` 模型默认开启了 Reasoning/Thinking，导致每次请求产生大量思考 token（简单 "hi" 就生成 1123 reasoning tokens、耗时 22 秒），复杂改写内容超过 httpx 30 秒 timeout，触发 `ReadTimeout` 异常且 `str(e)` 为空字符串。  
**修复文件**：`main.py`  
**修复内容**：  
- 所有 7 处 tokendance API 调用恢复添加 `enable_thinking: false`  
- AI Echo 生成的 timeout 从 20s 提升到 30s  
- 改进异常日志：记录 `type(e).__name__` + `exc_info=True` 完整堆栈  
- 修复 `reason` 字段为空：fallback 到异常类型名  
**验证**：修复后接口响应 ~3 秒，完整流程（AI 审核 + 改写 + 保存）正常  
**状态**：✅ 已修复

### 新增：deploy.sh 一键部署脚本

**内容**：新增 `deploy.sh` 脚本，封装 git push → 服务器 pull → 重启服务的完整部署流程。  
**用法**：`./deploy.sh`（全量部署）、`./deploy.sh --restart`（仅重启）、`./deploy.sh --pull`（仅拉取）  
**状态**：✅ 已完成

---

### UI 优化：故事弹窗（story modal）布局

**现象**：长内容时弹窗整体滚动，头部与底部输入区不固定。  
**根因**：`.story-modal` 使用 `overflow-y: auto`，未将头部、正文、底部解耦。  
**修复文件**：`templates/playground/ui.html`  
**变更**：将故事弹窗改为列向 flex 布局，正文区 `story-modal-inner` 独立滚动，固定头部与底栏（`story-modal-header` / `story-modal-footer`），滚动条仅作用于内层。  
**状态**：已完成  

### 仓库：停止跟踪 `app.log` 并忽略 SQLite 辅助文件

**原因**：`app.log` 与 `*.db-shm` / `*.db-wal` 不应进入版本库。  
**修复文件**：`.gitignore`，并从仓库移除已跟踪的 `app.log`。  
**状态**：已完成  

---

### 变更：模型供应商切换至词元跳动（TokenDance）

**内容**：将所有大模型调用从阿里云百炼（DashScope）切换至词元跳动（tokendance.space）统一网关。

**变更详情：**
- API 端点：`dashscope.aliyuncs.com/compatible-mode/v1/chat/completions` → `tokendance.space/gateway/v1/chat/completions`
- 环境变量：`DASHSCOPE_API_KEY` → `TOKENDANCE_API_KEY`
- 模型名称：`qwen3.5-plus` / `qwen-plus` → `qwen3.5-plus`（统一为同一模型）
- 移除 DashScope 特有参数 `enable_thinking: false`（后经验证词元跳动同样支持此参数，已在 BUG-001 中恢复）

**影响范围（7 处调用）：**
- Playground AI 对话 (`/playground/api/chat`)
- AI 自动回响生成 (`_generate_ai_echo`)
- 丝带分析 (`/api/ribbon/analyze`)
- 丝带改写 (`/api/ribbon/rewrite`)
- 丝带处理 (`/api/ribbon/process`)
- 丝带保存二次审核 (`/api/ribbon/save`)
- Open API 创建丝带 (`/open/api/ribbon`)

**修改文件**：
- `main.py` — 全部 7 处 LLM 调用切换
- `.env` — 替换 API Key
- `tests/test_open_api.py` — 环境变量名同步更新
- `templates/playground/ai.html` — 前端显示名更新

**状态**：✅ 已完成

---

### 新增功能：Open API & Skill 文档

**内容**：为 TiedStory 开放公共 API，允许第三方 AI Agent / 脚本调用核心功能。

**新增端点（/open/api/）：**
- `POST /open/api/ribbon` — 发丝带（完整 AI 审核+改写+保存）
- `GET /open/api/ribbons` — 分页查看（支持颜色过滤）
- `GET /open/api/ribbons/search?q=` — 搜索丝带
- `GET /open/api/ribbon/random` — 随机看一条
- `GET /open/api/ribbon/{id}` — 查看单条详情
- `POST /open/api/ribbon/{id}/echo` — 留回响（支持署名）
- `GET /open/api/skill.md` — Skill 文档

**IP 限流**：写入操作每 IP 每小时最多 5 次，超限返回 429。

**回响署名**：echoes 表新增 `author` 字段，回响可附带可选署名（最长 20 字）。现有网页端回响 API 同步支持。

**前端入口**：首页右上角新增 API 按钮，点击弹出弹窗：
- Tab 1：API 概览表格 + 每个端点 curl 一键复制
- Tab 2：Skill 文件内容 + 复制全部 + 下载 .md

**修改文件**：
- `main.py` — 新增 Open API 路由、限流逻辑
- `db.py` — 新增 author 列迁移、搜索/随机/限流计数函数
- `templates/playground/ui.html` — API 按钮 + 弹窗 UI
- `static/tiedstory_skill.md` — Skill 文档
- `PRD_open_api.md` — 需求文档

**状态**：已完成，25 个单元测试全部通过
