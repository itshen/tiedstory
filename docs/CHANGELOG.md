# TiedStory Changelog

## 2026-04-24

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
- 移除 DashScope 特有参数 `enable_thinking: false`（词元跳动为标准 OpenAI 协议，无此参数）

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
