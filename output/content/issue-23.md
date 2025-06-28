
+++
title = "地址和字节的关系"
date = "2025-06-19T09:00:13Z"
authors = ["Zhonghe-zhao"]
[taxonomies]
tags = [ "ComputerScience", ]
[extra]
author = "Zhonghe-zhao"
avatar = "https://avatars.githubusercontent.com/u/147113943?v=4"
issue_url = "https://github.com/Zhonghe-zhao/DailyBlog/issues/23"
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

**问题：**

 理解一下2的32次方的含义是什么？ 我的理解是 2的32次方代表着 它可以表示2的32次方个数据？ 我不理解他跟B有什么关系！

如果一个地址对应 1 个字节（Byte），那总共能表示 2的32次方个字节！

现在虚拟内存地址：地址范围的个数 = 可访问的字节数

所以2的32次方 = 4GB内存空间


**所以就是：**

每个地址指向1字节， 如果我有一个int型的变量a 他现在存储8 它的字节数是4字节是吧？ 我打印a变量的地址最终会输出一个类似于 0x0192730098这样的一个地址，所以说 这一个地址代表一个B？

> 是的，这个地址代表的是“a变量所占内存的第1个字节”的地址。 所以 &a 返回的是 a 的“起始字节地址”

int 占 4 字节 ⇒ 实际用了连续的 4 个地址

## 单级页表

32位内存：

2的32次方 = 4GB 虚拟内存

**理解虚拟内存 和 主存的概念：**

32位系统的虚拟地址空间最大只能访问 4GB 的内存（也就是每个进程最多可以用4GB），但你的物理内存（主存）可以比这大，比如16GB；只是你用不满而已。

页大小4KB： 总空间/页大小 = 页个数（2的20次方） 每个页必须都能被找到 就需要_2的20次方个PTE（PTE大小为4字节（32位））_去定位物理地址 总大小就变成了 4MB

## 如何看待多级页表

