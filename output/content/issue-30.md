
+++
title = "Docker"
date = "2025-06-26T08:59:00Z"
authors = ["Zhonghe-zhao"]
[taxonomies]
tags = [ "Development",  "Go",  "Backend", ]
[extra]
author = "Zhonghe-zhao"
avatar = "https://avatars.githubusercontent.com/u/147113943?v=4"
issue_url = "https://github.com/Zhonghe-zhao/DailyBlog/issues/30"
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

# Docker为什么会诞生

为解决传统部署存在的问题！ 

Docker(容器)： 

1. 确保环境一致性： 将应用打包成镜像， 一次构建到处运行！
2. **隔离性：**利用Linux内核特性（cgroups/namespace）实现进程隔离。

**vs** 虚拟机的隔离方式：

虚拟机：本质跑多个完整的系统，每个虚拟机有自己的 （独立内核 独立文件系统 独立网络 独立资源控制）

Docker： 本质是“在同一个系统中虚拟多个独立空间”，不用虚拟完整 OS，只是隔离进程  共享主机内核


Docker 利用 Namespaces 实现资源“看不见”（不同容器有自己独立的网络、进程表、文件系统），利用 Cgroups 实现资源“用不了太多”（ 限制 CPU 核心数、内存上限，避免资源抢光） 

### 问题：

要做到上述功能 必须需要Docker具有linux的内核，在Windows/mac上怎么才能具有linux内核呢？


Windows WSL2（Windows Subsystem for Linux） 轻量级Linux虚拟机（内置Linux内核）
macOS HyperKit（基于Hypervisor.framework） 轻量级Linux虚拟机

用户启动Docker Desktop

自动启动一个隐藏的Linux虚拟机（通过WSL2或Hyper-V）

所有Docker容器实际运行在这个Linux虚拟机内

Docker CLI通过RPC与虚拟机内的Docker引擎通信

事实就是：

>"Docker容器本质依赖Linux内核的特性（如Namespace/Cgroups）。在Windows/Mac上，Docker Desktop通过内置的Linux虚拟机（WSL2/HyperKit）提供Linux内核支持，容器实际运行在这个虚拟机内，而非直接调用Windows内核。"

## 为什么Docker 要运行在 Linux 上？

容器化技术依赖Linux内核的三大机制：

Namespaces（命名空间） → 提供进程隔离（PID、网络、挂载点等）

Cgroups（控制组） → 限制资源（CPU、内存、IO）

UnionFS（联合文件系统） → 实现镜像分层存储

## WSL2 VS VM

>WSL2 共享Windows内核的部分功能（如调度器），而传统VM需模拟完整硬件并运行独立OS。

### 问题：

“内核”到底是什么？它的角色和操作系统是一致的？

内核四大职责：

1. 进程管理

创建/销毁进程（fork()、exit()）

CPU调度（决定哪个进程运行）
示例：Docker容器本质是内核通过clone()+Namespace创建的隔离进程

2. 内存管理

分配物理内存（malloc()底层依赖内核）

虚拟内存（分页/交换空间）

3. 设备驱动

[todo]

4. 文件系统

[todo]

**联合文件系统**

**向上：通过系统调用（syscall） 为软件提供服务
向下：直接操作CPU/内存/设备寄存器**

## Docker部署的流程

1. 编写 Dockerfile

定义基础镜像（如 golang:1.20 或更小的 scratch）

拷贝你的代码和依赖

编译生成可执行文件（或直接用编译好的二进制）

设置容器启动命令（比如运行 simplebank 服务）

2. 构建镜像

执行 docker build -t simplebank:latest .

生成一个包含你的程序和运行环境的镜像文件

3. 推送镜像（可选）

把镜像上传到远程仓库，如 Docker Hub 或私有 Harbor

方便其他服务器拉取

4. 运行容器

5. 访问服务
通过服务器的 IP 和端口访问你的 SimpleBank API

6. 维护和更新

更新代码后，重复构建镜像和部署容器流程

可以通过 Docker Compose 或 Kubernetes 做多容器编排和扩展

## 镜像管理

## 容器操作

## 网络管理

## 数据持久化

## Dockerfile

构建镜像： 基础环境 依赖安装 文件复制 启动命令

实际的执行流程：

镜像（Image） → 启动后变成 → 容器（Container）

## Shell脚本

用途： 自动化任务、批量处理、服务管理、部署流程等。

```sh
#!/bin/sh

set -e

echo "run db migrations"
/app/migrate -path /app/migration -database "$DB_SOURCE" -verbose up

echo "start the app"
exec "$@"

```

```Dockerfiles

EXPOSE 8080 
CMD [ "/app/main" ]
ENTRYPOINT [ "/app/start.sh" ]

```
_CMD_  定义默认参数，会被 _ENTRYPOINT_ 使用，也可被 docker run 的参数覆盖

---

完成_Dockerfiles_文件的编写，构建镜像！

`docker build -t your-service:1.0 .`

`docker run -it --rm your-service:1.0 sh` 运行！

## Docker-compose.yaml

>通过一个 YAML 文件定义和编排多容器应用，实现一键启动完整服务栈。



### 什么是多容器编排

>多个容器协同运行，组成一个完整系统，并通过自动化工具统一管理和部署的过程，就叫多容器编排。

**多个容器之间需要保证什么？**

1. 启动顺序正确

2. 网络互通

3. 环境一致

4. 自动恢复

5. 动态扩容

## 实例：

```yml

services:
  postgres:
    image: postgres:12-alpine
    environment:
      - POSTGRES_USER=root
      - POSTGRES_PASSWORD=secret
      - POSTGRES_DB=simple_bank
    ports:
      - "5433:5432"
    volumes:
      - data-volume:/var/lib/postgresql/data

```
启动了一个数据库容器 并且配置了一系列环境 

```
    depends_on:
      - postgres
      - redis
```
启动顺序

## 连接Dockerfiles 和 docker-compose

```yml
 api:
  build:
    context: .
    dockerfile: Dockerfile
```

### 问题

编写完Dockerfiles文件后 也就是构建完成镜像之后就可以启动镜像为容器了，也就是项目可以正常启动了，为什么还需要docker-compose文件编排多个容器呢？

`docker-compose up -d  # 一键启动所有服务，自动处理依赖`



## docker中的网络问题

**网络模式：**

1. bridge

每个 Bridge 网络形成一个独立的虚拟局域网（VLAN）

同一网络内的容器可通过容器名互相访问（无需IP）

容器访问外网时，IP会被转换为宿主机IP（通过iptables规则）

需手动映射端口（-p 8080:80）才能从宿主机外部访问容器服务

### 端口映射

>Docker 将容器内部端口绑定到宿主机端口的机制

![Image](https://github.com/user-attachments/assets/c1b8951b-0444-4cb4-8341-fad1707d9947)

`# 将容器的80端口映射到宿主机的8080端口
docker run -d -p 8080:80 --name nginx nginx
`

**网卡的作用：**

_主机和外部网络的桥梁，完成数据收发和初步封装_

Docker 会创建虚拟网卡（veth pair）：

一端在容器内，另一端接到宿主机的网桥（docker0）。


通过虚拟网卡，容器流量被送到宿主机网络，再被转发出去（如 NAT）。

#### NAT

把私有网络的 IP 地址转换成公有网络的 IP 地址，实现内网访问外网或不同网段通信。 主要解决 IP 不够用 + 内网隔离 + 控制流量 的问题。

Docker 默认用 NAT：
容器内的私有 IP（如 172.17.x.x）通过 NAT 转换成宿主机的 IP 对外通信。

## 通信

同网络下的容器可以通信，在自定义的网络中 他们可以通过容器名自动互相访问

创建网络 并加入pg容器

`docker network connect bank-network postgres12`

检查容器内部配置

`docker network inspect bank-newtork`

`docker container inspect postgres12`





