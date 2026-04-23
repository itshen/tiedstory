# TiedStory Open API — Skill 文档

> 让你的 AI Agent 接入 TiedStory 匿名情感树洞平台。

## 产品简介

TiedStory（系上去的故事）是一个匿名情感倾诉平台。用户写下心事，AI 将其改写为第三人称故事，以"丝带"形态挂在一棵公共的树上。路过的人可以读故事、留下匿名回响。

## API 基础信息

| 项目 | 值 |
|------|------|
| Base URL | `https://tiedstory.com` |
| 数据格式 | JSON |
| 认证方式 | 无需 API Key |
| 限流规则 | 写入操作（发丝带、留回响）每 IP 每小时最多 5 次 |
| 读取操作 | 不限流 |

## 端点列表

### 1. 发丝带

系一条新丝带到树上。系统自动完成 AI 内容审核和改写。

```
POST /open/api/ribbon
Content-Type: application/json
```

**请求体：**

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| text | string | 是 | 用户的原始心事，1-500 字 |

**成功响应（200）：**

```json
{
  "ok": true,
  "ribbon_id": "A3K7BN",
  "witness": "xKm3nP9qR2vZ",
  "color": "blue",
  "story": "有一个人很久没有笑过了……",
  "detail": "关于持续性的低落"
}
```

- `ribbon_id`：丝带公开 ID，用于后续查看和分享
- `witness`：见证码（私密），凭此码可追加内容、查看回响
- `color`：AI 自动判定的情绪颜色
- `story`：AI 改写后的故事（公开展示的内容）

**失败响应：**

| 状态码 | 说明 |
|--------|------|
| 400 | text 为空或超过 500 字 |
| 403 | 内容审核未通过（含违规、注入攻击等） |
| 429 | 限流，返回 `retry_after` 秒数 |

**curl 示例：**

```bash
curl -X POST https://tiedstory.com/open/api/ribbon \
  -H "Content-Type: application/json" \
  -d '{"text": "今天很难过，不知道跟谁说"}'
```

---

### 2. 查看丝带列表（分页 + 颜色过滤）

```
GET /open/api/ribbons?limit=10&offset=0&color=blue
```

**参数：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| limit | int | 否 | 每页条数，默认 10，最大 50 |
| offset | int | 否 | 偏移量，默认 0 |
| color | string | 否 | 颜色过滤：blue/orange/pink/green/purple/gray/gold |

**响应：**

```json
{
  "total": 128,
  "ribbons": [
    {
      "id": "A3K7BN",
      "color": "blue",
      "story": "有一个人很久没有笑过了……",
      "echo_count": 3,
      "created_at": 1714000000,
      "time": "2 小时前"
    }
  ]
}
```

**curl 示例：**

```bash
curl "https://tiedstory.com/open/api/ribbons?limit=5&color=blue"
```

---

### 3. 搜索丝带

```
GET /open/api/ribbons/search?q=关键词&limit=10&offset=0
```

**参数：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| q | string | 是 | 搜索关键词 |
| limit | int | 否 | 每页条数，默认 10，最大 50 |
| offset | int | 否 | 偏移量，默认 0 |

**响应格式同「查看丝带列表」。**

**curl 示例：**

```bash
curl "https://tiedstory.com/open/api/ribbons/search?q=孤独&limit=5"
```

---

### 4. 随机看一条

```
GET /open/api/ribbon/random
```

**响应：** 返回一条完整丝带（含回响列表）。

```json
{
  "id": "A3K7BN",
  "color": "blue",
  "story": "有一个人很久没有笑过了……",
  "echo_count": 2,
  "created_at": 1714000000,
  "time": "2 小时前",
  "echoes": [
    {"id": 1, "content": "你不是一个人", "author": "路过的风", "likes": 2, "time": "1 小时前"},
    {"id": 2, "content": "抱抱", "author": "", "likes": 0, "time": "30 分钟前"}
  ],
  "appends": []
}
```

**curl 示例：**

```bash
curl "https://tiedstory.com/open/api/ribbon/random"
```

---

### 5. 查看单条丝带

```
GET /open/api/ribbon/{ribbon_id}
```

**响应格式同「随机看一条」。**

**curl 示例：**

```bash
curl "https://tiedstory.com/open/api/ribbon/A3K7BN"
```

---

### 6. 留回响

给某条丝带留下一句匿名回响，可附带可选署名。

```
POST /open/api/ribbon/{ribbon_id}/echo
Content-Type: application/json
```

**请求体：**

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| content | string | 是 | 回响内容，1-100 字 |
| author | string | 否 | 署名，最长 20 字，留空则为匿名 |

**成功响应（200）：**

```json
{
  "ok": true,
  "echo_id": 42
}
```

**curl 示例：**

```bash
curl -X POST https://tiedstory.com/open/api/ribbon/A3K7BN/echo \
  -H "Content-Type: application/json" \
  -d '{"content": "你不是一个人", "author": "路过的风"}'
```

---

## 丝带颜色与情绪

| 颜色 | 英文 | 情绪 |
|------|------|------|
| 蓝色 | blue | 悲伤、失落 |
| 橙色 | orange | 愤怒、委屈 |
| 粉色 | pink | 思念、心碎 |
| 绿色 | green | 疲惫、压力 |
| 紫色 | purple | 迷茫、困惑 |
| 灰色 | gray | 麻木、空洞 |
| 金色 | gold | 喜悦、感恩 |

## Agent 使用场景示例

### 场景 1：帮用户倾诉

```
用户说："我今天特别难过，想找个地方说说"
→ Agent 调用 POST /open/api/ribbon，将用户的话发送出去
→ 返回见证码，告知用户保存好
```

### 场景 2：陪用户逛树洞

```
用户说："给我看看别人的故事吧"
→ Agent 调用 GET /open/api/ribbon/random
→ 展示故事内容和回响
→ 用户想留言 → 调用 POST /open/api/ribbon/{id}/echo
```

### 场景 3：搜索特定情绪

```
用户说："有没有人也觉得孤独"
→ Agent 调用 GET /open/api/ribbons/search?q=孤独
→ 展示搜索结果
```

## 注意事项

1. **见证码请妥善保管**：见证码是查看自己丝带回响的唯一凭证，遗失无法找回
2. **内容会被 AI 改写**：用户的原始文字会被 AI 脱敏处理成第三人称叙述
3. **限流**：写入操作每 IP 每小时最多 5 次，请合理使用
4. **内容规范**：广告、暴力、色情、政治敏感内容会被自动拦截
5. **回响字数**：回响限 100 字以内，重在共鸣而非长篇回复
