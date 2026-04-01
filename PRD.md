# PRD：管理员后台 + IP 封禁系统

## 一、背景

TiedStory 需要一个管理员后台用于查看和管理丝带数据，同时需要防止暴力破解和扫描攻击。

---

## 二、功能说明

### 2.1 蜜罐页 `/admin`

- 外观与真实登录页完全一致（假登录表单）
- **任何人提交表单（无论内容）→ 立即封 IP 30 天**
- 封禁后返回 403，不给任何提示
- 作用：扫描器/攻击者访问 `/admin` 即触发封禁

### 2.2 真实登录页 `/admin/login`

- 密码写死：`Itshen369*`
- 同一 IP 输错密码 **3 次 → 封 IP 30 天**
- 登录成功 → 写入 Session Cookie，跳转 `/admin/dashboard`
- Session 有效期 24 小时

### 2.3 管理后台 `/admin/dashboard`

- 需要 Session 验证，未登录跳转 `/admin/login`
- 功能：
  - 丝带列表（分页，每页 20 条）
  - 查看单条丝带详情（story、echoes、appends）
  - **删除丝带**（物理删除，连带删除其 echoes 和 appends）
  - **显隐丝带**（软删除：hidden 字段，隐藏后不在前台展示，后台仍可见）
  - **回响（echo）管理**：删除单条回响、显隐单条回响
  - **回响数额调整**：手动修改某条丝带显示的 echo 虚拟数（virtual_echo_count 字段，前台展示时用此值叠加真实数）
  - 查看 IP 封禁列表
  - 手动解封 IP

### 2.4 登出 `/admin/logout`

- 清除 Session，跳转 `/admin/login`

---

## 三、IP 封禁机制

### 数据表设计

```sql
CREATE TABLE IF NOT EXISTS banned_ips (
    ip          TEXT PRIMARY KEY,
    reason      TEXT NOT NULL,   -- 'honeypot' | 'brute_force'
    banned_at   INTEGER NOT NULL,
    expire_at   INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS login_attempts (
    ip          TEXT NOT NULL,
    attempted_at INTEGER NOT NULL
);
```

ribbons 表新增字段：
- `hidden INTEGER NOT NULL DEFAULT 0` — 软删除标志
- `virtual_echo_count INTEGER NOT NULL DEFAULT 0` — 虚拟回响数额（后台可调整）

echoes 表新增字段：
- `hidden INTEGER NOT NULL DEFAULT 0` — 软删除标志

### 封禁逻辑

- 每次请求先检查 `banned_ips`，命中且未过期 → 返回 403
- `/admin` 提交表单 → reason=`honeypot`，封 30 天
- `/admin/login` 密码错误 → 记录 `login_attempts`，最近 1 小时内失败 ≥ 3 次 → reason=`brute_force`，封 30 天

### 中间件

- FastAPI Middleware 统一拦截，在每个请求最前面检查 IP 是否被封

---

## 四、Session 机制

- 使用 `itsdangerous.URLSafeTimedSerializer` 签名 Cookie
- Cookie 名：`admin_session`
- 有效期：86400 秒（24 小时）
- Secret key：从 env `ADMIN_SECRET_KEY` 读取，缺省使用随机值（重启失效）

---

## 五、流程图

```mermaid
flowchart TD
    A[请求进入] --> B{IP 是否被封禁？}
    B -- 是 --> C[返回 403]
    B -- 否 --> D{路由判断}

    D --> E[/admin 蜜罐]
    D --> F[/admin/login]
    D --> G[/admin/dashboard]

    E -- GET --> E1[渲染假登录页]
    E -- POST 提交任何内容 --> E2[封 IP 30天 → 403]

    F -- GET --> F1[渲染真登录页]
    F -- POST 密码正确 --> F2[写 Session → 跳转 dashboard]
    F -- POST 密码错误 --> F3{最近1小时失败 ≥ 3次？}
    F3 -- 是 --> F4[封 IP 30天 → 403]
    F3 -- 否 --> F5[记录失败 → 提示错误]

    G --> G1{Session 有效？}
    G1 -- 否 --> G2[跳转 /admin/login]
    G1 -- 是 --> G3[渲染后台页面]
```

---

## 六、文件结构

```
main.py                          # 新增 admin 路由和中间件
db.py                            # 新增 banned_ips / login_attempts 表和操作函数
templates/admin/
  login.html                     # 真实登录页（/admin/login）
  honeypot.html                  # 蜜罐页（/admin，外观同 login）
  dashboard.html                 # 后台主页（丝带列表）
  ribbon_detail.html             # 丝带详情页（含回响管理、数额调整）
  banned_list.html               # 封禁列表页
```

---

## 七、安全说明

- 蜜罐页不在任何地方链接，只有知道地址的人才能找到真实后台
- 密码明文写死在代码中（内网/私有项目可接受）
- Session Cookie 使用 HttpOnly + SameSite=Lax
