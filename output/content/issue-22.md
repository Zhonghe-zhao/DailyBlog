
+++
title = "go-redis使用"
date = "2025-06-15T12:57:28Z"
authors = ["Zhonghe-zhao"]
[taxonomies]
tags = [ "Go",  "Backend", ]
[extra]
author = "Zhonghe-zhao"
avatar = "https://avatars.githubusercontent.com/u/147113943?v=4"
issue_url = "https://github.com/Zhonghe-zhao/DailyBlog/issues/22"
[extra.reactions]
thumbs_up = 0
thumbs_down = 0
laugh = 0
heart = 0
hooray = 0
confused = 0
rocket = 0
eyes = 0

[[extra.comments]]
url = "https://github.com/Zhonghe-zhao/DailyBlog/issues/22#issuecomment-2974914808"
author_name = "Zhonghe-zhao"
author_avatar = "https://avatars.githubusercontent.com/u/147113943?v=4"
content = '''## Getset

GETSET key value 是一个 Redis 命令，原子性地执行以下操作：
获取（GET）：返回指定键 key 的当前值（如果存在）。
设置（SET）：将 key 的值设置为新值 value。

SET counter 10

GETSET counter 20  # 返回: 10，counter 现在是 20

保证在并发场景下不会出现数据竞争 ， 计数器更新：获取当前计数并更新为新值（如统计页面访问量）。 

相比于关系型数据库：

开启事务。

SELECT 查询键对应的值。

UPDATE 更新值为新值。

提交事务。

## SetNX

```sh
SETNX key value
```

当 key 不存在时，设置它的值为 value（返回 1）；如果 key 已存在，则不做任何操作（返回 0）。

### 分布式锁

在分布式系统中控制多个进程/服务互斥访问共享资源的机制。它的核心目标是：在分布式环境下，确保同一时刻只有一个客户端能执行关键操作（如修改数据、触发任务等）。

```sh
# 加锁（推荐方式，原子性设置键值+过期时间）
SET lock:order 随机唯一值 EX 30 NX

# 解锁（需用 Lua 脚本保证原子性）
EVAL "if redis.call('GET', KEYS[1]) == ARGV[1] then return redis.call('DEL', KEYS[1]) else return 0 end" 1 lock:order 随机唯一值
```

**问题：**

对于类似 防止重复下单 定时任务调度  避免并发更新数据 怎么应对这些场景？对于pg 和 redis等数据库都有什么应对措施？

完善秒杀系统

##MGet

批量查询：

```sh
MGET key [key ...]
```
减少网络开销：只需一次网络往返 

## MSet

批量设置

```sh
MSET key value [key value ...]
```
结合Redis 对于 Pg的操作应该思考怎么去做

### 缓存预热

##Incr IncrBy

原子性递增数字

```sh
INCR key
```
将 key 中存储的数字值增加1, 如果 key 不存在，会先初始化为 0 再执行加1操作

```sh
INCRBY key increment
```
将 key 中存储的数字值增加指定的整数值

**应用场景：**

文章阅读量统计

视频播放次数

用户点赞数

商品点击量

传统计数：性能低下：需要3次操作（GET+计算+SET） 容易导致数据竞争！

### 原子性内部到底是怎么操作的能避免竞争？ 

所有客户端命令都进入一个队列, 单一线程（主线程）顺序从队列取出并执行命令,即使服务器有多个CPU核心，Redis核心操作也只用单线程处理

### 为什么Redis使用单线程还能高性能

纯内存操作：没有磁盘IO瓶颈  

高效数据结构 ：

IO多路复用： 使用epoll/kqueue处理网络IO'''
updated_at = "2025-06-16T02:17:43Z"

+++

# Redis

高性能内存数据库：

为解决传统数据库在高并发和低延迟场景下的性能瓶颈

传统数据库 I/O 慢，不适合做高频缓存

Memcached 只支持简单的 key-value，不能表达复杂业务

项目中很多需求本质上是“操作数据结构”：列表、集合、计数器等

## 为什么要操作数据结构？

展示出最近的10条评论

`SELECT * FROM comments WHERE post_id = ? ORDER BY created_at DESC LIMIT 10 OFFSET x`


## Redis内置数据结构：

（String、Hash、List、Set、Sorted Set 等）

根据情况 **选择合适的数据结构**

1. 字符串

缓存用户姓名：SET user:1:name "Alice".

页面访问计数：INCR page:views.

数据量小，操作简单（读写、增减）。

2. Hash（哈希）

存储用户信息：HSET user:1 name "Alice" age 25.

更新年龄：HSET user:1 age 26.

3. List（列表）

任务队列：LPUSH tasks "send_email"，RPOP tasks.

最近浏览记录：LPUSH user:1:history "item1", LTRIM user:1:history 0 9（保留最近 10 条）。

4. Set（集合）

用户标签：SADD user:1:tags "tech" "sports".

共同好友：SINTER user:1:friends user:2:friends.

用 Set 实现推荐系统（比如推荐共同兴趣的用户）。

5. Sorted Set（有序集合）

游戏排行榜：ZADD leaderboard 100 "Alice".

获取前 3 名：ZREVRANGE leaderboard 0 2.

## 问题：

“如何用 Redis 做缓存？”（String/Hash）

“如何实现消息队列？”（List）

“如何设计排行榜？”（Sorted Set）

为什么选这个数据结构？ 它的优点！

##问题

为什么redis可以操作列表等数据结构呢？ 它的底层就是一个哈希表吗？

Redis 的全局键值存储是基于哈希表（Dict）

全局哈希表只存储「键」和「值的指针」

对于Redis 不同数据类型有不同的底层实现

实际上：

以 _LPUSH mylist A_ 为例：

1. 查找 Key：先在全局哈希表中查找 "mylist"：

2. 如果不存在，创建一个新的 List（底层可能是 QuickList）。

3. 如果存在，拿到指向 List 的指针。

4. 操作数据结构：调用 QuickList 的插入逻辑，在头部插入 "A"。

