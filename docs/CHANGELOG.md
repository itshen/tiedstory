# TiedStory Changelog

## 2026-04-24

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
