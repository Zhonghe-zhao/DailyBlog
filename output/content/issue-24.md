
+++
title = "工具链"
date = "2025-06-20T12:28:01Z"
authors = ["Zhonghe-zhao"]
[taxonomies]
tags = [ "Development",  "ComputerScience", ]
[extra]
author = "Zhonghe-zhao"
avatar = "https://avatars.githubusercontent.com/u/147113943?v=4"
issue_url = "https://github.com/Zhonghe-zhao/DailyBlog/issues/24"
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

# 什么是工具链

>从源码出发，支持你完成开发、构建、测试、调试、部署的完整过程

**编译构建：**把源码变成可运行的程序（如 cargo build、go build）

**依赖管理：**统一管理三方库版本、下载、更新（如 go mod、Cargo.toml）

**代码质量保证：**自动化测试、格式化、静态检查（如 cargo test、clippy）

**调试和发布支持：**调试运行、打包部署、发布（如 cargo run --release）

##理解指令

_go build_ _go mod init_ _cargo build_ 等指令做了什么事情？ 

_go.mod_是做什么的，如果没有会怎么样？

go.mod 记录了模块名和依赖项

go build
编译当前模块的代码，生成可执行文件。

如果没有 go.mod：

无法使用模块化依赖（Go 1.11+推荐模块模式）

Go 会尝试用 GOPATH 模式构建（已逐渐废弃）

## 模块化依赖

每个模块只关心自己需要的依赖和版本，互不干扰。

例子：
项目 A 用的是 viper v1.9.0，项目 B 用的是 viper v1.8.1，互不冲突。
不像老的 GOPATH 模式下，全局只有一份依赖，项目之间可能“踩版本”。


