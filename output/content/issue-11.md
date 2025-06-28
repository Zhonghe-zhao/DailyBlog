
+++
title = "Go By Mistakes"
date = "2025-05-30T08:19:16Z"
authors = ["Zhonghe-zhao"]
[taxonomies]
tags = [ "Development",  "Go", ]
[extra]
author = "Zhonghe-zhao"
avatar = "https://avatars.githubusercontent.com/u/147113943?v=4"
issue_url = "https://github.com/Zhonghe-zhao/DailyBlog/issues/11"
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

# init函数的使用

在`init()`函数中，不能返回错误，因为init函数的作用是 完成初始化 或者直接使用`panic()`终止程序 ！

## 测试

在测试之前 
1. Go总会加载相关包
2. 自动调用包中的所有`init()`函数 

**执行顺序**： 测试加载顺序：包级变量初始化 → init() 执行 → TestMain()（如果存在）→ TestXxx() 执行。

### **注意：**

 init() 是全局性的，一旦定义就会在所有测试前执行
所以如果你在某个文件中写了一个 init()，它无法按需控制是否执行，这会给某些不需要它的测试带来副作用。

### 示例： 

如果你在一个文件中定义了

```go
// utils.go
func HashPassword(pw string) string {
    // 哈希逻辑
}
```

```go
func init() {
    // 建立数据库连接
    db, _ = sql.Open("postgres", "...")
}
```

你只想测试 HashPassword()，跟数据库没关系，但：

Go 会强制执行 init() → 建立数据库连接

如果数据库挂了、网络断了，测试失败

即使测试内容跟数据库一毛钱关系都没有

init() 是文件级别、不可控制的初始化逻辑，一旦存在，它就会对这个包的所有使用者和测试者产生影响。

**做法：**

 尽量避免在 init() 中建立全局连接或启动重逻辑 不要用 init() 连数据库

把数据库连接从 init() 拆出去，改成显式初始化函数，这样测试更灵活、代码更可控、依赖更清晰

```go
var DB *sql.DB

func InitDB(dsn string) error {
	var err error
	DB, err = sql.Open("postgres", dsn)
	return err
}
```

## 全局变量

如果把数据库连接对象赋值给全局变量（如 var db *sql.DB），为什么这会让单元测试变复杂、变得“不隔离”？

### 示例：

```go
// user.go
package user

import "yourproject/db"

func GetUserByID(id int) (*User, error) {
	return db.DB.Query(...) // 用的是全局变量 db.DB
}
```

它依赖的是全局变量 db.DB，你没法注入 mock 数据库(全局变量在代码里写死了，函数内部直接引用它，测试时你没法“替换”这个变量指向别的对象)，也无法用内存数据库替代。

### 解决：

将 DB 作为参数而不是全局变量

```go
// user.go
type UserRepo struct {
	DB *sql.DB
}

func (r *UserRepo) GetUserByID(id int) (*User, error) {
	return r.DB.Query(...)
}
```

main.go

```go
db, _ := sql.Open(...)
repo := user.UserRepo{DB: db}
```

测试中

```go
fakeDB := NewFakeDB() // 或用 sqlite、mock
repo := user.UserRepo{DB: fakeDB}
```
```go
// db_test.go
package db

import (
	"fmt"
	"testing"
)

func Test_Global_DB(t *testing.T) {
	DB = "RealDB"
	got := GetUserGlobal(1)
	fmt.Println(got)

	DB = "MockDB" // ← 修改全局变量

	got2 := GetUserGlobal(1)
	fmt.Println(got2)
	// 问题：前后结果不一致，测试间共享状态
}

func Test_DI_DB(t *testing.T) {
	real := &DBClient{DB: "RealDB"}
	mock := &DBClient{DB: "MockDB"}

	got := real.GetUserDI(1)
	fmt.Println(got)

	got2 := mock.GetUserDI(1)
	fmt.Println(got2)
	// 优点：各自隔离，不会互相影响
}
```


