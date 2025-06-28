
+++
title = "授权与认证"
date = "2025-06-27T09:34:29Z"
authors = ["Zhonghe-zhao"]
[taxonomies]
tags = [ "Development",  "Backend", ]
[extra]
author = "Zhonghe-zhao"
avatar = "https://avatars.githubusercontent.com/u/147113943?v=4"
issue_url = "https://github.com/Zhonghe-zhao/DailyBlog/issues/32"
[extra.reactions]
thumbs_up = 0
thumbs_down = 0
laugh = 0
heart = 0
hooray = 0
confused = 0
rocket = 0
eyes = 0

+++

# 明确概念

**认证：** 确认你是谁？ 验证你的身份

**授权：** 确认你能做什么，给_认证的用户_分配权限

## Why 诞生 Cookie Session？

因为HTTP的无状态性，诞生的问题 

“如何在同一用户的多次请求间保持连续状态？”

用户登录后，服务器需要知道后续请求（如购物车操作）来自同一个已认证用户。

## Cookie

Cookie 必须通过 HTTP 协议的头字段（Headers）传递

1. 服务器下发 Cookie（响应头）
通过 _Set-Cookie_ 头字段向客户端（如浏览器）写入 Cookie

2. 客户端回传 Cookie（请求头）

有一定安全风险！

## Session

**解决问题：**  如果直接把用户权限、余额等敏感信息存在客户端（如 Cookie），用户可以轻易篡改

敏感数据存服务端，客户端仅持有无意义的 session_id

在服务器端集中存储用户状态，用户登录时，服务器生成唯一 session_id 并存储相关数据

传递Session_id -> 客户端

**Session的本质：** 

用户登录 → 浏览网站 → 加购商品 → 退出登录。

这一系列操作属于 同一个会话，数据仅在会话期间需要。

**问题：**

为什么Session要具备 存储具体数据的能力？

Session 存在于服务端，它的职责是「存储这个人的状态和数据」，比如 user_id、is_login、username 等。

方便服务端快速取用用户数据
Session 已经在内存或持久化存储中存了这些信息，后续请求不需要每次拿 token 去查数据库。

安全性和灵活性
Session 的内容在服务端，客户端完全看不到。这样可以存一些和权限、业务相关的信息（比如角色、登录状态等），防止客户端篡改。

支持更多状态管理
比如除了登录状态，还可以记录购物车、上次访问时间、权限标志等，这些都放在 Session 里方便统一管理。

所以Session：

可以，但那样每次请求都需要拿这个 id 去查数据库或其他存储，浪费性能。**Session 就是为了避免频繁查数据库**，同时把**状态控制在服务端**，提高安全性。

如果想极简方案，也可以只存 user_id，但这会牺牲性能或灵活性。

**减少数据库查询：将高频访问的数据（如权限、购物车）缓存在 Session 中。

实时生效：修改 Session 后立即可见（如用户退出时直接删除 Session）。**


## 缺陷

**Cookie 的短板：**

若把所有数据（如 user_role=admin）存在 Cookie 中：

用户可手动修改 role=superadmin 提权（安全隐患）。

数据大小受限（不能存购物车等复杂数据）。

## Token

在客户端存储自包含的加密数据（如 JWT），服务端无需存储会话状态。

如果 Token 是明文（如 user_id=123&role=admin），用户可随意修改（如改 role=superadmin）。

通过签名（如 HMAC、RSA）加密 Token，确保数据不被篡改。



