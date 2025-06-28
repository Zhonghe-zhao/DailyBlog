
+++
title = "Golang In Deep"
date = "2025-06-11T12:49:51Z"
authors = ["Zhonghe-zhao"]
[taxonomies]
tags = [ "Go", ]
[extra]
author = "Zhonghe-zhao"
avatar = "https://avatars.githubusercontent.com/u/147113943?v=4"
issue_url = "https://github.com/Zhonghe-zhao/DailyBlog/issues/19"
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
url = "https://github.com/Zhonghe-zhao/DailyBlog/issues/19#issuecomment-2965055764"
author_name = "Zhonghe-zhao"
author_avatar = "https://avatars.githubusercontent.com/u/147113943?v=4"
content = '''# new与make

## **new 函数：**

"将内存初始化为类型的零值 然后返回指针"

零值是什么？

- 数值类型（int/float等）：0
- bool：false
- string：""（空字符串）
- 指针/slice/map/channel/interface：nil
- 结构体：所有字段都是各自类型的零值

new(T) 为类型T 分配内存空间 并将内存中的值设置为T的零值 返回指向这块内存的指针

## **make函数: **

专用于 **slice map channel**   做特定类型的**初始化**

```go
// 切片
s := make([]T, length, capacity)  // capacity 可省略

// 映射
m := make(map[K]V)  // 可加初始容量参数：make(map[K]V, initialCapacity)

// 通道
ch := make(chan T)    // 无缓冲通道
ch := make(chan T, n) // 带缓冲通道，缓冲区大小 n
```

**对于切片：**
 
创建底层数组 初始化长度与容量 所有元素设置为0值

**对于map**

初始化哈希表的数据结构 准备后续的键值对存储

**对于channel**

初始化缓冲区 设置同步所需的内部数据结构     


'''
updated_at = "2025-06-12T04:14:33Z"

[[extra.comments]]
url = "https://github.com/Zhonghe-zhao/DailyBlog/issues/19#issuecomment-2973596303"
author_name = "Zhonghe-zhao"
author_avatar = "https://avatars.githubusercontent.com/u/147113943?v=4"
content = '''# Map

关键点涉及： 并发安全！

## 并发安全！

当多个线程或协程同时访问共享资源时，程序依然能正常运行，数据不会出错。

考虑 是否需要同步， 是否有资源竞争， 是否有读写冲突？

_sync.Map_ 用于并发

## Why？

为什么对普通的map进行并发操作会导致问题 ：

首先Map底层是 

哈希表：

多个 goroutine 同时读写 map 的同一桶或元数据，可能导致内存访问冲突

Go 的 map 底层是一个哈希表，哈希表把键值对分组存储在“桶”中。每个桶可以存多个键值对。
比如，键 "apple" 和 "banana" 通过哈希函数可能被分配到同一个桶里。

Map的桶：
'''
updated_at = "2025-06-15T08:47:00Z"

+++

# GMP模型 

首先思考 GMP调度模型是什么？ 为了解决什么问题？

引出下文： 

GMP是 Go runtime的一个调度模型， 调度模型是什么？ Go runtime是什么？ 

**Go runtime：** Go runtime 是 Go 语言自带的一套 运行时系统。

他自己有一套功能：

1. GMP调度器
2. 垃圾回收GC
3. 系统调用封装 等

因为GO需要自己管理这些情况 所以需要内置 runtime


**调度模型： **系统如何决定“哪个任务（线程、协程）由哪个 CPU 在什么时候执行”的策略和机制。

Go 调度器运行在用户态，负责调度 goroutine 到 Go 自己维护的 M（线程） 上。

## 为什么goroutine切换比线程轻量？

**线程就是操作系统里执行代码的最小单位。**

首先清楚： _上下文越大，切换开销越大（保存/恢复更多信息）_

### 线程是并发编程的基础

**线程内代码按顺序执行。多个线程通过 CPU 多核或调度实现任务并行或并发，提高效率。**

回到最初！因为os线程的并发下 开销大！ 所以Go设计了用户级goruntine 目前的问题就是 如何**把成千上万的goroutine 高效的调度到有限的os上**

用户级别的协程确实在开销上非常小 目前的问题就是 如何将协程和线程连接起来 从而让真正的CPU去工作

Goroutine的执行条件是什么？

CPU状态 任务队列 本地缓存 调度信息

这些环境谁来提供？

p！

p 管理能运行多少个G 协调 本地队列 与 全局队列 

谁来维护p？

CPU核数 限制了 p的数量

M 是操作系统的线程，是实际能被 CPU 调度执行的实体 M必须绑定p 才能执行G

P调度G M执行G

为什么 只有绑定P才能执行G 早期没有P是如何运行的？

## M如何直接调度G

 有哪些缺点?

M 同时负责调度和执行，导致调度逻辑复杂且不够高效。 容易出现资源竞争和瓶颈。

## 发生阻塞怎么办

什么会发生阻塞？ 

**I/O阻塞：** 程序必须完成某个程序的输入输出 才能执行后续的代码 

M属于内核级别 M发生系统调用 M会被操作系统挂起，进入阻塞状态 

Go检测到阻塞就会就会让M释放P 创建或唤醒另一个M去绑定这个P然后执行G，被挂起的 M 等调用完成后再尝试回收利用。


Go的runtime做法， 发现这个G是阻塞的 就从当前M中剥离这个G 然后G标记waiting 把p解绑 交给别的M

### 系统调用为什么会阻塞

运行在用户态 去请求 系统内核的某些权限!(文件读写， 网络通信，进程管理)

1. 读取磁盘文件可能需要等待磁盘控制器返回数据

2. 网络 I/O：接收网络数据（如 net.Conn.Read）需要等待客户端发送数据。

3. 进程同步：如 waitpid 等待子进程退出。

### 疑惑：

所以说 系统调用 为什么会阻塞？ 如果当系统调用需要从磁盘读取数据的时候 线程去执行其它资源，然后等数据返回再去执行，这样不就大大提高了利用率吗？

### 回答:

这个问题就是**同步阻塞I/O模型**

让线程去做别的事情就是 **异步非阻塞模型:** 这样一个线程可以管理成千上万个 I/O 连接，提高吞吐量。



