
+++
title = "Grokking Concurrency"
date = "2025-06-01T07:47:47Z"
authors = ["Zhonghe-zhao"]
[taxonomies]
tags = [ "Book",  "Concurrency", ]
[extra]
author = "Zhonghe-zhao"
avatar = "https://avatars.githubusercontent.com/u/147113943?v=4"
issue_url = "https://github.com/Zhonghe-zhao/DailyBlog/issues/12"
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
url = "https://github.com/Zhonghe-zhao/DailyBlog/issues/12#issuecomment-2953650346"
author_name = "Zhonghe-zhao"
author_avatar = "https://avatars.githubusercontent.com/u/147113943?v=4"
content = '''# 多级并发硬件

## 指令级并行

一次执行多个指令，让一条指令执行的同时，下一条指令也开始执行。
➤ 例子：流水线（pipeline）、乱序执行（out-of-order execution）。


## 位级并行

一次处理多个位的数据。
➤ 例子：以前 8 位处理器升级成 16/32/64 位，能一次处理更多的数据位，效率提升。


>多级并发硬件本质上是指硬件系统在多个层级上实现并发执行，以提升性能和吞吐量。

# 对称多处理器架构(SMP)

有两个或更多的相同的处理机（处理器）共享同一主存，由一个操作系统控制


## 优缺点

优点是并发度很高，但是由于系统总线的带宽是有限的，故处理器数目受限，且性能受限。


>核心思想：

<html>
<body>
<!--StartFragment--><html><head></head><body>
思想 | 说明
-- | --
对称性 | 所有 CPU 平等地访问内存与 I/O，无主从之分。
共享性 | 共享同一内存空间，便于线程/进程通信。
可扩展性（中等） | 可以添加更多 CPU，但随着数量增加总线可能成为瓶颈。

</body></html><!--EndFragment-->
</body>
</html>

## 实际用处

<html>
<body>
<!--StartFragment--><html><head></head><body>
场景 | SMP 的优势
-- | --
多线程应用（Web服务器） | 各 CPU 并行处理请求，响应快
数据库（PostgreSQL等） | 并行查询，提高吞吐量
操作系统调度 | 系统把进程平均调度到多个 CPU 上
虚拟化（如 KVM） | 每个虚拟机分配一个核心运行更流畅
多核编程（Go 并发等） | 利用 SMP 启动多个 goroutine，映射到多个核心并行执行

</body></html><!--EndFragment-->
</body>
</html>

## 缺点和瓶颈：

共享内存导致竞争：多个 CPU 同时访问共享数据，需加锁或同步。

总线带宽瓶颈：CPU 越多，共享总线的压力越大。
'''
updated_at = "2025-06-08T11:40:16Z"

[[extra.comments]]
url = "https://github.com/Zhonghe-zhao/DailyBlog/issues/12#issuecomment-2953810101"
author_name = "Zhonghe-zhao"
author_avatar = "https://avatars.githubusercontent.com/u/147113943?v=4"
content = '''# 缓存一致性问题

## SMP架构

所有 CPU 共享同一个内存、I/O 设备，硬件设计容易实现，降低成本，

**现有问题：**

1. 总线瓶颈：多个 CPU 竞争同一个总线访问内存，扩展性受限

2. 缓存一致性问题：多个 CPU 缓存共享数据，需要一致性协议（如 MESI） 怎么解决的


SMP 架构中，每个 CPU 有自己的 L1/L2/L3 缓存。

多个 CPU **同时读写 共享内存的同一地址**，每个 CPU 缓存了这块数据。

某个 CPU 修改了数据，别的 CPU 的缓存仍然是旧值 ⇒ 缓存不一致。

```c
// 假设共享变量 x 存在主内存，初始值为 0
CPU0 和 CPU1 各有一份缓存

// CPU0 执行
x = 1  // 修改的是自己缓存中的 x

// CPU1 执行
print(x) // 它读取的是自己缓存中还没被更新的 x ⇒ 输出 0（错了）
```

## 现代解决

MESI 协议 


M (Modified) | 缓存已被修改，和内存不一致
E (Exclusive) | 缓存和内存一致，其他 CPU 没有该数据
S (Shared) | 缓存和内存一致，多个 CPU 都有副本
I (Invalid) | 缓存无效，需要从内存或其他 CPU 获取

### 伪共享

CPU 缓存行（Cache Line）：现代 CPU 读取内存时，并不是逐字节读取，而是以 缓存行（通常 64 字节） 为单位加载。

伪共享问题：如果两个线程（Thread A 和 Thread B）分别修改 同一个缓存行里的不同变量，即使它们_逻辑上不冲突_，也会导致缓存行频繁失效，触发 缓存一致性协议（如 MESI） 的额外同步开销，降低性能。

#### 如何理解

以 缓存行（通常 64 字节） 为单位加载，什么是，修改同一个缓存行里的不用变量

**缓存行：**

缓存行 = CPU 缓存中最小的传输/对齐单位
大小通常是 64 字节（也有 32、128，看架构）也就是： CPU 并不会每次只加载 8 字节，而是以一整块 64 字节（cache line）为单位。

当 CPU 想读取 a 时，它会加载从 0x1000 开始的 64 字节内存块 到缓存。

这 64 字节中包含了 a 和 b。

一次读/写内存，CPU 不是按字节，而是按“缓存行”来加载的

例如：你访问内存地址 0x1000，CPU 会一次性加载 0x1000 ~ 0x103F（64 字节）到缓存中

为什么这么设计？

**局部性原理（Locality）**：程序访问内存通常是“连着访问”，一次多取一点更高效

提高内存带宽利用率，降低缓存 miss

**示例：**

```go
type Data struct {
    a int64 // 8字节
    b int64 // 8字节
    c int64 // 8字节
    d int64 // 8字节
    e int64 // 8字节
    f int64 // 8字节
    g int64 // 8字节
    h int64 // 8字节
} // 共64字节，刚好一个缓存行
```
c

_如果变量落在同一个缓存行内，会发生什么？_


虽然这些变量本身没有关系（不同用途、不同线程在用），但是：

因为在同一个 cache line 里

一个 CPU 修改了它自己的变量 ⇒ 整个 cache line 被标记“已修改”

其他 CPU 的该 cache line 就变成 Invalid，必须重新从内存加载 ⇒ 频繁的 cache line 失效和同步

---

加深理解：

```go
go func() { counter.a++ }()  // goroutine1
go func() { counter.b++ }()  // goroutine2
```

因为go的调度器可以将 不同的goruntine调度到cpu0和cpu1

 缓存行一致性协议就会出现：

goroutine1 在 CPU0 上运行：

执行 counter.a++，需要修改 a。
CPU0 将包含 a 和 b 的缓存行加载到自己的缓存，并标记为 Exclusive。
修改 a 后，缓存行状态变为 Modified。

goroutine2 在 CPU1 上运行：

执行 counter.b++，需要修改 b。
因为 b 和 a 在同一个缓存行，CPU1 需要访问这个缓存行。
但 CPU0 的缓存行已标记为 Modified，CPU1 必须通过总线通信，要求 CPU0 将缓存行写回主内存（或直接传递给 CPU1）。
这导致 CPU0 的缓存行变为 Invalid 或 Shared，CPU1 获得缓存行并标记为 Exclusive，然后修改 b，状态变为 Modified。

反复竞争：
如果 goroutine1 再次尝试修改 a，它会发现自己的缓存行已失效（因为 CPU1 拿走了控制权），需要重新从 CPU1 或主内存获取缓存行。
这会导致频繁的缓存失效和总线通信，显著降低性能。


>多线程程序会被操作系统分配到多个 CPU 核心上运行。如果这些线程操作的变量刚好在同一个 cache line 内，即使它们本身没关系，也会因硬件的“整块缓存同步”机制发生冲突，这就叫伪共享，性能严重受影响。


---

## 处理伪共享

1. 在结构体中添加填充字节，使 a 和 b 分属不同的缓存行。例如：

```go
type Counter struct {
    a int64
    _ [56]byte // 填充 56 字节，确保 a 和 b 不在同一缓存行（假设缓存行 64 字节）
    b int64
}
```

2. 将 a 和 b 定义为独立的变量，而不是结构体的字段：

```go
var a, b int64
```

3. 同步机制

```go
var mu sync.Mutex
mu.Lock()
counter.a++
mu.Unlock()
```

为什么同步机制可以避免伪共享？

互斥访问：mu.Lock() 确保 goroutine1 和 goroutine2 不会同时修改 counter.a 和 counter.b。

缓存行为：

当 goroutine1 获取锁并运行在 CPU0 上时，它加载包含 a 和 b 的缓存行到 CPU0 的缓存，状态为 Exclusive 或 Modified。
goroutine2 在尝试获取锁时会被阻塞，无法同时访问缓存行，因此不会触发 CPU1 的缓存加载或修改。
只有当 goroutine1 释放锁（mu.Unlock()）后，goroutine2 才能获取锁并加载缓存行到 CPU1。

>因为只有一个 CPU 核心在修改缓存行，MESI 协议不会触发缓存失效或总线通信，消除了伪共享。 **加锁避免了伪共享的性能问题可以理解为 加锁过程是顺序的没有抢夺开销，而伪共享互相抢夺一直触发MESI协议导致效率低下**

'''
updated_at = "2025-06-17T09:05:02Z"

[[extra.comments]]
url = "https://github.com/Zhonghe-zhao/DailyBlog/issues/12#issuecomment-2979839111"
author_name = "Zhonghe-zhao"
author_avatar = "https://avatars.githubusercontent.com/u/147113943?v=4"
content = '''# 放弃共享内存架构

也就是 **分布式内存架构：** ，不要多线程竞争数据，而是让数据主动迁移，或使用消息通信来代替共享状态。也就是 让某个线程“拥有”这块数据，**其他线程需要时请求它来处理数据并返回结果。**

1. Go的_WokerPool_
2. 微服务架构：服务之间用 HTTP / gRPC 通信，不共享数据库连接或内存

**不共享状态，就不需要锁，程序就简单且高性能。**

'''
updated_at = "2025-06-17T10:33:47Z"

[[extra.comments]]
url = "https://github.com/Zhonghe-zhao/DailyBlog/issues/12#issuecomment-2979937256"
author_name = "Zhonghe-zhao"
author_avatar = "https://avatars.githubusercontent.com/u/147113943?v=4"
content = '''# 并行计算机分类

## Flynn 并行计算机分类（按指令流和数据流）

SISD | Single Instruction, Single Data | 单处理器，串行执行 | 传统单核 CPU
SIMD | Single Instruction, Multiple Data | 一条指令处理多个数据（数据级并行） | GPU、向量处理器（如 AVX）
MISD | Multiple Instruction, Single Data | 理论上存在，几乎无实际用途 | 容错系统（很罕见）
MIMD | Multiple Instruction, Multiple Data | 多处理器，各自独立运行程序（主流） | 多核 CPU、分布式集群

## 按内存架构分类

SMP | 对称多处理器，共享主内存 | 多核 CPU，桌面服务器
NUMA | 非统一内存访问，每个 CPU 有本地内存 | 大型多核服务器
分布式内存 | 每个节点独立内存，通过网络通信 | 集群（HPC、分布式系统）

## 按通信方式分类

共享内存 | 通过共享变量通信 | 多线程程序、Go channel
消息传递 | 通过显式消息通信 | 分布式系统（gRPC、MPI、微服务）

## CPU架构


**cpu的时钟频率为什么时钟频率的快慢决定执行指令的多少？**

时钟频率越高，单位时间内“干活的机会”越多，理论上能执行更多指令

典型的 MIMD：每个核干自己的活，处理不同数据，互不干扰。现代 CPU 之所以“基于 MIMD”，是因为它们具备多个核心，每个核心能独立执行不同的程序（指令）并处理不同的数据。

## GPU架构

SIMD 更适合 GPU： “一条指令，多份数据” 也就是：一个指令流，作用于多个数据。所有执行单元同时做同一件事，但每个操作的数据不同。 数据量大、操作统一。 因为矩阵单元的大多数操作**彼此独立且相似**，可以并行化，也就是大规模的并行处理
'''
updated_at = "2025-06-17T11:09:06Z"

[[extra.comments]]
url = "https://github.com/Zhonghe-zhao/DailyBlog/issues/12#issuecomment-2980216508"
author_name = "Zhonghe-zhao"
author_avatar = "https://avatars.githubusercontent.com/u/147113943?v=4"
content = '''#并发编程步骤

拆分程序为小型 ，独立任务，找出大任务中可以独立完成的部分，任务之间尽量无依赖、无共享状态

任务不要太大，避免单个任务阻塞整体

任务不要太小，避免调度开销过大

拆分并发任务，就是找出可以独立执行的“小任务”，用合适工具调度它们并行执行。

## 进程

>程序是静态的代码和资源，
进程是程序在内存中的运行实例，包含程序计数器、寄存器状态、内存空间等，操作系统调度它在硬件上执行指令。

也就是 : 

程序在磁盘，静止不动

进程在内存，是程序运行时的动态表现

操作系统把每个运行的程序包装成一个进程，不同进程之间：

拥有独立的内存空间

互不干扰，一方崩溃不影响另一方

通过特定方式（IPC）通信 以后会继续了解!

## 进程内部

进程的内部 由于 进程读取和写入的数据在内存中,所以进程可以看到或访问的内存是运行中的进程的一部分 

进程的内存空间主要包括：

代码段（Text Segment）：存储可执行文件的机器指令，只读。
数据段（Data Segment）：存储初始化和未初始化的全局/静态变量。
堆（Heap）：动态分配的内存（如malloc分配）。
栈（Stack）：存储局部变量、函数调用信息。
环境变量和命令行参数：存储进程的环境信息。

## PCB

PCB是操作系统用来存储和管理每个进程元信息的数据结构

PCB 存储 进程ID 进程状态 可执行文件 程序还会访问磁盘 网络资源 等 必须包含进程打开的文件列表 

启动一个进程是一个非常繁重的事情 这就是为什么通常被称为重量级进程

## 进程状态

进程从开始到执行到销毁 一定是有一定的状态去区分和管理的!  整个对于进程的状态的管理全部交给操作系统,进程附带的许多资源必须被创建或者释放,这将引入很大的额外延迟

'''
updated_at = "2025-06-17T12:38:27Z"

+++

---

Date: 2025-06-01

---

## 并行的限制

>程序中无法并行的部分，决定了整体性能的上限。

**Amdahl 定律**

![Image](https://github.com/user-attachments/assets/8424dc92-6a55-4270-ac97-b1d229244343)

 一个程序中，假设其中 Lock / Unlock 是串行（不可并行），只占 30% 时间；
    
- 你把其余的 70% 并行了，最多也只能加速约 1 / (0.3 + 0.7/N)；
    
- 即使 N=100，也不是 100 倍加速，可能只有 3 倍左右。


- **任务中无法并行的部分就是瓶颈**，再多线程、再多 CPU 也没用；
    
- **可并行度越小，增加资源的收益越差**。

_虽然Amdahl 定律 展现了一个令人失望的结果！ 但我们仍然需要乐观_

### 乐观视角

**Gustafson 定律**

Amdahl 假设任务总量是固定的，这在现实中不常见，反过来看：既然加速比有瓶颈，那我们不如做更多的任务！

**核心思想：** 并行不是为了加速固定的任务，而是为了让我们能处理更大的问题规模、更复杂的数据量。

![Image](https://github.com/user-attachments/assets/223d1c36-fdde-47e2-97fe-b83e4443ec56)

你银行系统如果每天只能处理 1 万笔转账（串行），用了并发系统之后，不是把 1 万笔处理更快 —— 而是你能处理 100 万笔！


## 并发和并行

Rob Pike说过的一句经典的话

>“Concurrency is about dealing with lots of things at once. Parallelism is about doing lots of things at once.”

并发： 你能同时接收很多个转账请求，每个请求你都安排好流程、排队、处理顺序；

并行： 你有多个处理器，多个请求可以真的在同一时刻一起处理（比如一个核心处理用户 A 的转账，另一个处理用户 B 的转账）。

**并发是编程模型，Go 语言提供了 goroutine + channel，容易表达并发逻辑；是否能并行，是操作系统 + CPU 的事。**

## 进程和线程

**为什么说没有线程的进程是不存在的？**

现代操作系统的进程实现方式。从技术角度看，进程至少包含一个执行线程（即主线程）

_进程类比为： 拥有者资源
线程类比为： 执行资源的人_

线程(工人) 进程（建筑）

所以说 即使你拥有资源但是无法执行 也就相当于没有拥有！ 

**谁又去管理 线程和进程呢？**

也就是操作系统，操作系统_使用PCB和TCB_去管理

操作系统用PCB记录进程的资源（内存、文件等）。

用TCB记录线程的执行状态（寄存器、栈等）。

PCB必须关联至少一个TCB，否则进程无法被调度执行。





