
+++
title = "good_first_issue"
date = "2025-06-21T08:39:28Z"
authors = ["Zhonghe-zhao"]
[taxonomies]
tags = [ "rust",  "OpenSource", ]
[extra]
author = "Zhonghe-zhao"
avatar = "https://avatars.githubusercontent.com/u/147113943?v=4"
issue_url = "https://github.com/Zhonghe-zhao/DailyBlog/issues/25"
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

# 尝试解决人生的第一个issue

[rust-clippy](https://github.com/rust-lang/rust-clippy/issues/3219)

这个issue的由来大概是StackOverFlow中的一个人的疑惑

[Stackoverflow](https://stackoverflow.com/questions/48361537/why-do-underscore-prefixed-variables-exist/48370313#48370313)

大概内容是：

"rust 现在变量名称的开头添加下划线将使编译器在未使用时不会发出警告， 未使用的变量可能是不受欢迎的！"

要解决的问题： 添加一个lint

  ```rust
fn main() {
    used_underscore_but_unused(42);
}

// ⚠️ `_param` 没用，但以 `_` 开头（我们想让它被 lint 出来）
fn used_underscore_but_unused(_param: i32) {
    println!("just doing nothing with param");
}

```

当前输出：

```shell
PS E:\rust-demo\src> cargo clippy -- -W unused_variables -W clippy::used_underscore_binding -D warnings
    Checking rust-demo v0.1.0 (E:\rust-demo)
    Finished `dev` profile [unoptimized + debuginfo] target(s) in 0.31s  
```

---

问题可能比想象的要复杂：

![Image](https://github.com/user-attachments/assets/acb302e2-221e-4746-a3b2-470de5808c01)

这是社区的回复，我可能要先释放这个issue了

