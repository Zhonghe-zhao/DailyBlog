
+++
title = "跨网络通信编程模式"
date = "2025-06-27T13:41:09Z"
authors = ["Zhonghe-zhao"]
[taxonomies]
tags = [ "Development",  "Backend", ]
[extra]
author = "Zhonghe-zhao"
avatar = "https://avatars.githubusercontent.com/u/147113943?v=4"
issue_url = "https://github.com/Zhonghe-zhao/DailyBlog/issues/33"
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

## RESTFUL API

虽然HTTP协议已经规范了基础的请求/响应格式，但正是因为它太灵活，反而导致了早期Web服务的混乱。

HTTP原生问题：
同一个用户查询功能，不同开发者可能设计出完全不同的接口

所以导致了 RESTFUL API的诞生!

**约定:**

URL 表示资源，如 /users/1

用标准 HTTP 动词：GET 查，POST 新增，PUT 修改，DELETE 删

数据统一用 JSON（或标准格式）

服务无状态（每次请求都完整表达意图）

规范为

```http

HTTP/1.1 201 Created
Location: /users/123
Content-Type: application/json

{ "id": 123, "name": "Alice" }

```

```

// 传统混乱的响应
{
  "success": true,
  "code": 200,
  "message": "OK",
  "data": { "id": 123, "name": "Alice" }
}

```

也就是说:

 HTTP 可以发任何东西，RESTful API 让它发得标准、发得规范。

**注意:**

RESTful API 规范是靠人遵守的工程文化，不是自动生效的。


## gRPC

## WebSocket


## 消息队列


