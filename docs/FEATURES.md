# TiedStory 功能点列表

## 核心功能

- [x] 匿名倾诉：用户无需注册即可输入心事
- [x] AI 改写：树语 AI 将心事改写为第三人称故事
- [x] 丝带颜色：AI 自动判断情绪并分配颜色（蓝/橙/粉/绿/紫/灰/金）
- [x] 见证码：系统生成唯一见证码，用于查看回响和追加内容
- [x] 回响：路人可给丝带留下匿名回响
- [x] 回响署名：回响可附带可选署名（最长 20 字）
- [x] 回响点赞
- [x] 作者追加：凭见证码追加内容
- [x] AI 自动回响：系统在随机时间自动为丝带生成 AI 回响

## 安全与审核

- [x] Prompt Injection 防护（输入层 + 输出层）
- [x] AI 内容审核（广告/暴力/色情/政治/歧视拦截）
- [x] 危机内容处理（自伤/轻生内容附加心理援助热线）
- [x] IP 封禁机制
- [x] 管理后台蜜罐（/admin）
- [x] 登录暴力破解防护

## 浏览与发现

- [x] 丝带列表（分页 + 颜色过滤）
- [x] 丝带详情页（SEO 友好）
- [x] 情绪专题页（12 个情绪主题）
- [x] 可视化网站地图

## Open API

- [x] 公共 API（/open/api/）：发丝带、查看列表、搜索、随机、详情、留回响
- [x] IP 限流：写入操作每 IP 每小时 5 次
- [x] Skill 文档：MD 格式 API 说明，供 AI Agent 导入
- [x] 首页 API 入口弹窗（API 概览 + Skill 文件 + 一键复制/下载）
- [x] MCP Server（Streamable HTTP）：标准 MCP 协议接入，端点 /mcp（/mcp/ 同样可用，无重定向），暴露 7 个 Tools

## 大模型接入

- [x] 米羊 Gateway 统一接入：端点、模型、超时、思考开关集中在 config/llm.yaml，代码按角色取用（llm.py）
- [x] 审核 + 改写（一步完成）使用 aliyun_bailian_shanghai/qwen3.8-flash
- [x] AI 自动回响使用 miyang/gemini-3.8-flash（max_tokens 留足思考余量、超时 90 秒、失败重试一次）
- [x] Playground 对话使用 qwen3.8-flash
- [x] 联网测试：有真实 Key 时自动校验两个模型的连通性与回响不返回空内容

## 管理后台

- [x] 丝带管理（查看/隐藏/删除/虚拟回响数）
- [x] 回响管理（查看/隐藏/删除）
- [x] IP 封禁管理（查看/解封/手动封禁）
- [x] 爬虫统计（解析 nginx 日志）
- [x] PV/UV 统计图表

## 前端体验

- [x] 全屏 Hero 背景（双层淡入淡出）
- [x] 时段感知（根据时间显示不同背景和标签）
- [x] 多语言支持（语言切换器）
- [x] 移动端响应式
- [x] Service Worker（静态资源缓存策略）
- [x] SEO 优化（sitemap.xml、robots.txt、专题页结构化数据）

## 待开发 / 新增想法

- [ ] MCP 写入类 Tool（create_ribbon / add_echo）补上 IP 限流，与 Open API 的「每 IP 每小时 5 次」对齐（当前 ip 固定记为 "mcp"，无限流）
- [ ] MCP add_echo 补上 Prompt Injection 检测（Open API 的回响接口已有）
- [ ] 前台「树语的声音，由 TokenDance 点亮」署名与新供应商（米羊）不一致，待产品决定是否修改
- [ ] 为 MCP 补充独立 PRD 文档（本次接入时未先写 PRD）

## 开发工具

- [x] deploy.sh 一键部署脚本（push + pull + 重启，支持 --restart / --pull 模式）
