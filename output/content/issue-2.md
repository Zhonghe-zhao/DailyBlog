
+++
title = " C++ Learning"
date = "2025-05-28T11:35:20Z"
authors = ["Zhonghe-zhao"]
[taxonomies]
tags = [ "Language", ]
[extra]
author = "Zhonghe-zhao"
avatar = "https://avatars.githubusercontent.com/u/147113943?v=4"
issue_url = "https://github.com/Zhonghe-zhao/DailyBlog/issues/2"
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


给定 CPU 可以理解的所有可能的机器语言指令的集合称为**指令集** 。

每条指令被 CPU 理解为执行非常具体工作的命令，

例如： *“比较这两个数字”或“将此数字复制到该内存位置”。在计算机刚发明时，程序员必须直接用机器语*
*言编写程序，这是一件非常困难且耗时的事情。*


每个 CPU 系列都有自己的机器语言一样，每个 CPU 系列也有自己的汇编语言（旨在为同一 CPU 系列组装成机器语言）。这意味着有许多不同的汇编语言。尽管在概念上相似，但不同的汇编语言支持不同的指令，使用不同的命名约定，等等......



![Image](https://github.com/user-attachments/assets/fd21e869-6449-4758-b435-1cd1ff5b4e71)

## 一 . 前奏


### 第 1 步：定义您要解决的问题

这是 “what” 步骤，您可以在其中弄清楚您打算解决的问题。想出你想要编程的初步想法可能是最简单的步骤，也可能是最困难的一步。但从概念上讲，这是最简单的。您所需要的只是一个可以明确定义的想法，然后您就可以为下一步做好准备。


**示例：**

	“我想编写一个程序，让我输入许多数字，然后计算平均值。”
	“我想编写一个程序来生成一个 2D 迷宫并让用户在其中导航。如果用户到达终点，他们就会获胜。
	“我想编写一个程序，该程序读取股票价格文件并预测股票是上涨还是下跌。”



### 第 2 步：确定您将如何解决问题

这是 “如何” 步骤，您可以在其中确定如何解决在步骤 1 中提出的问题。这也是软件开发中最容易被忽视的步骤。问题的症结在于解决问题的方法有很多种 —— 但是，其中一些解决方案是好的，而另一些是坏的。很多时候，程序员会得到一个想法，坐下来，然后立即开始编写解决方案。这通常会产生一个属于 bad 类别的解决方案。


**好的解决方法的特性：**

	 它们很简单（不会过于复杂或令人困惑）。
	 它们有据可查（尤其是围绕所做的任何假设或限制）。
	 它们是模块化构建的，因此部分可以重复使用或稍后更改，而不会影响程序的其他部分。
	 它们可以正常恢复或在发生意外情况时提供有用的错误消息。


### 第三步：编写程序



### 第四步： 编译源代码

**为了编译 C++ 源代码文件，我们使用 C++ 编译器。C++ 编译器按顺序遍历程序中的每个源代码 （.cpp） 文件，并执行两项重要任务**

1. 首先，编译器检查您的 C++ 代码，以确保它遵循 C++ 语言的规则。如果没有，编译器将为您提供错误（和相应的行号）以帮助确定需要修复的内容。编译过程也将中止，直到错误得到修复。

2. 其次，编译器将您的 C++ 代码转换为机器语言指令。这些指令存储在称为**对象文件的**中间文件中。对象文件还包含后续步骤中需要或有用的其他数据（包括步骤 5 中链接器所需的数据，以及步骤 7 中用于调试的数据）。

如果您的程序有 3 个 .cpp 文件，则编译器将生成 3 个目标文件


### 第 5 步：链接对象文件和库并创建所需的输出文件

编译器成功完成后，另一个称为**链接器**的程序将启动。链接器的工作是合并所有目标文件并生成所需的输出文件 此过程称为**链接** 如果链接过程中的任何步骤失败，链接器将生成一条描述问题的错误消息，然后中止。


1. 首先，链接器读取编译器生成的每个目标文件，并确保它们有效。

2. 其次，链接器确保所有跨文件依赖项都得到正确解析。例如，如果您在一个 .cpp 文件中定义某些内容，然后在不同的 .cpp 文件中使用它，则链接器会将两者连接在一起。如果链接器无法将引用连接到具有其定义的内容，则会收到链接器错误，并且链接过程将中止。

3. 第三，链接器通常在一个或多个**库文件中**链接，这些文件是预编译代码的集合，这些文件已被“打包”以供其他程序重用。

4. 最后，链接器输出所需的输出文件。通常，这将是一个可以启动的可执行文件


示例：

你调用了 `fmt.Println()`，这个函数并不在你的代码里，而是来自 Go 的标准库 `fmt`，Go 编译器会把你用到的 `fmt` 里的代码从**库文件**中找出来，并**链接**进最终的可执行程序里


![Image](https://github.com/user-attachments/assets/363b6da6-8b78-4443-8ce5-699019703182)

### 步骤6 & 7：测试和调试

一旦你可以运行你的程序，你就可以测试它。 **测试**是评估您的软件是否按预期工作的过程。基本测试通常涉及尝试不同的输入组合，以确保软件在不同情况下正常运行。


如果程序没有按预期运行，那么您将不得不进行一些**调试** ，这是查找和修复编程错误的过程。



## 二. 配置编译器

![Image](https://github.com/user-attachments/assets/84018bf1-b618-4406-8a38-e4266b1b2a5a)

显示出必要的警告，有些警告非常有用，并且在必要时需要解决

## 三. 了解Hello World！

```C
#include <iostream>

int main()
{
	std::cout << "Hello world!";
	return 0;
}
```


第 1 行是一种特殊类型的行，称为预处理器指令。此 `#include` 预处理器指令表示我们希望使用 `iostream` 库的内容，该库是 C++ 标准库的一部分，允许我们从控制台读取和写入文本。我们需要这一行，以便在第 5 行使用 `std：：cout`。排除此行将导致第 5 行出现编译错误，否则编译器将不知道 `std：：cout` 是什么。

第 2 行为空，编译器将忽略该行。此行的存在只是为了帮助使程序对人类更具可读性（通过将 `#include` preprocessor 指令和程序的后续部分分开）。

第 3 行告诉编译器，我们将编写（定义）一个名称（标识符）为 `main` 的函数。正如您在上面所学到的，每个 C++ 程序都必须有一个 `main` 函数，否则将无法链接。此函数将生成一个类型为 `int` （整数） 的值

第 4 行和第 7 行告诉编译器哪些行是 _main_ 函数的一部分。第 4 行的左大括号和第 7 行的右大括号之间的所有内容都被视为 `main` 函数的一部分。这称为函数体。


*问题： 程序运行时会发生什么？*

`main（）` 中的语句按顺序执行。



## 四. 注释

在 C++ 中，有两种不同样式的注释，它们都有相同的目的：帮助程序员以某种方式记录代码。

1. 单行注释开头
该注释指示编译器忽略从该符号到行尾的所有内容，单行注释用于对单行代码进行快速注释。


```c
std::cout << "Hello world!\n";                 // std::cout lives in the iostream library
std::cout << "It is very nice to meet you!\n"; // this is much easier to read
std::cout << "Yeah!\n";                        // don't you think so?
```

2. 多行注释

`/*` 和 `*/` 对符号表示 C 样式的多行注释。符号之间的所有内容都将被忽


**正确使用注释**


通常，注释应该用于三件事。首先，对于给定的库、程序或函数，注释最适合_用于描述库_ 、程序或函数的作用。这些通常位于文件或库的顶部，或紧靠在函数之前。例如

*所有这些注释都使读者可以很好地了解库、程序或函数试图完成什么，而不必查看实际代码*。用户（可能是其他人，或者如果您尝试重用以前编写的代码，则可能是您）可以*一目了然地判断代码是否与他或她要完成的任务相关*。这在作为*团队的一部分*工作时尤其重要，因为不*是每个人都熟悉所有代码*。


在语句级别，应该使用注释来描述代码执行某项作_的原因_ 。错误的 statement _注释解释了代码_正在做什么。如果您编写的代码非常复杂，以至于需要一个注释_来解释语句_的作用，则可能需要重写您的语句，而不是注释它。



***“好代码说明‘做什么’，好注释说明‘为什么’。”***


## 五. 值

对值最常见的作之一是将它们*打印到屏幕*上

计算机中的主内存称为**随机存取存储器** （通常简称 **RAM**）。当我们运行一个程序时，作系统会将程序加载到 RAM 中。此时*将加载硬编码到程序本身中的任何数据*（例如，诸如 “Hello， world！” 之类的文本）。


系统还保留了一些额外的 RAM 供程序在运行时使用。此内存的常见用途是存储用户输入的值，存储从文件或网络读取的数据，或存储程序运行时计算的值（例如两个值的总和），以便以后可以再次使用。

***文本是只读值，因此无法修改其值。因此，如果我们想在内存中存储数据，我们需要其他方法来做到这一点***


```c++
char *s = "hello";   // 指向字符串常量，不能修改
s[0] = 'H';          // ❌ 未定义行为，可能崩溃
```

```c++
char s[] = "hello";  // 拷贝到数组，位于可写内存中
s[0] = 'H';          // ✅ 可以修改
```


Go中

```go
b := []byte("hello")
b[0] = 'H'           // ✅ 可以修改
s2 := string(b)
fmt.Println(s2)      // 输出 "Hello"

```

## 六. 对象和变量

在 C++ 中，不建议直接访问内存。相反，我们通过对象间接访问内存。 **对象**表示可以保存值的存储区域（通常是 RAM 或 CPU 寄存器）。对象还具有关联的属性


```c
int x; // define a variable named x (of type int)
```

编译器为我们处理有关此变量的所有其他细节，包括确定对象需要多少内存、对象将放置在哪种存储中（例如在 RAM 或 CPU 寄存器中）、它相对于其他对象的放置位置、何时创建和销毁它等

执行从 `main（）` 的顶部开始。为 `x` 分配内存。然后程序结束。

什么是对象？

`An object is a region of storage (usually memory) that can store a value.`

什么是变量

`A variable is an object that has a name.`

什么是数据

`A value is a letter (e.g. `a`), number (e.g. `5`), text (e.g. `Hello`), or instance of some other useful concept that can be represented as data.`


## 七. 变量赋值和初始化

1. 分配变量

```c
int main()
{
    int x;    // define an integer variable named x (preferred)
    int y, z; // define two integer variables, named y and z

    return 0;
}
```

2. 赋值

```c++
int width; // define an integer variable named width
width = 5; // assignment of value 5 into variable width

// variable width now has value 5
```

这被称为**复制分配**


一旦为变量指定了值，就可以通过 `std：：cout` 和 `<<` 运算符打印该变量的值

***C++ 中有 5 种常见的初始化形式：***

```c++
int a;         // default-initialization (no initializer)

// Traditional initialization forms:
int b = 5;     // copy-initialization (initial value after equals sign)
int c ( 6 );   // direct-initialization (initial value in parenthesis)

// Modern initialization forms (preferred):
int d { 7 };   // direct-list-initialization (initial value in braces)
int e {};      // value-initialization (empty braces)
```

|写法|名称|值|特点|
|---|---|---|---|
|`int a;`|默认初始化|未定义|不安全，局部变量是垃圾值|
|`int b = 5;`|复制初始化|5|支持隐式转换|
|`int c(6);`|直接初始化|6|类似函数调用|
|`int d{7};`|直接列表初始化 ✅推荐|7|安全，防止隐式类型转换|
|`int e{};`|值初始化 ✅推荐|0|初始化为零|

```c++
struct MyClass {
    MyClass(int x) { ... }          // 构造函数
    MyClass(const MyClass& other) { ... } // 拷贝构造函数
};

```


```c++
MyClass a = 5;   // copy-initialization（可能调用拷贝构造函数）
MyClass b(5);    // direct-initialization（直接调用构造函数）
```

旧的编译器可能会让 `a = 5` 先调用构造函数再调用拷贝构造函数，多一步；  
但 **现代编译器（尤其 C++17 后）会优化掉这一步**，效果基本一样。

|写法|是否推荐|备注|
|---|---|---|
|`MyClass a = x;`|✅ C++17 后可以放心用|语法清晰|
|`MyClass a(x);`|✅ 更偏向现代风格|少见歧义|
|`MyClass a{x};`|✅ 最安全，禁止隐式转换|推荐用于新项目|

**问题 : When should I initialize with { 0 } vs {}?**


```c++
struct Foo {
    Foo() : v(42) {}
    int v;
};

Foo f1{};   // ✅ 调用默认构造，v = 42
Foo f2{0};  // ❌ 编译错误：找不到接受 int 的构造函数

```

我们还注意到，最佳做法是完全避免这种语法。但是，由于您可能会遇到使用此样式的其他代码，因此多讨论一下它仍然很有用，如果不是其他原因，只是为了强调您应该避免使用它的一些原因。

```c++
int a = 5, b = 6;          // copy-initialization
int c ( 7 ), d ( 8 );      // direct-initialization
int e { 9 }, f { 10 };     // direct-list-initialization
int i {}, j {};            // value-initialization
```

```c++
int a, b = 5;     // wrong: a is not initialized to 5!
int a = 5, b = 5; // correct: a and b are initialized to 5
```



```c++
#include <iostream>

int main()
{
    [[maybe_unused]] double pi { 3.14159 };  // Don't complain if pi is unused
    [[maybe_unused]] double gravity { 9.8 }; // Don't complain if gravity is unused
    [[maybe_unused]] double phi { 1.61803 }; // Don't complain if phi is unused

    std::cout << pi << '\n';
    std::cout << phi << '\n';

    // The compiler will no longer warn about gravity not being used

    return 0;
}
```

 [[maybe_unused]]  可以接受编译而没有被使用的变量


~~~
Prefer `\n` over `std::endl` when outputting text to the console.
~~~


*缓冲区*

`std::cin` 使用的是**输入缓冲区**

- 当你输入内容后，**按下回车**，整个一行文本会被放入缓冲区中；
    
- `std::cin` 会从这个缓冲区中逐个提取数据。



*使用未初始化变量*

```c++
#include <iostream>

void doNothing(int&) // Don't worry about what & is for now, we're just using it to trick the compiler into thinking variable x is used
{
}

int main()
{
    // define an integer variable named x
    int x; // this variable is uninitialized

    doNothing(x); // make the compiler think we're assigning a value to this variable

    // print the value of x to the screen (who knows what we'll get, because x is uninitialized)
    std::cout << x << '\n';

    return 0;
}
```


## 八：标识符命名最佳实践

```c++
int value; // conventional

int Value; // unconventional (should start with lower case letter)
int VALUE; // unconventional (should start with lower case letter and be in all lower case)
int VaLuE; // unconventional (see your psychiatrist) ;)
```


```c++
int my_variable_name;   // conventional (separated by underscores/snake_case)
int my_function_name(); // conventional (separated by underscores/snake_case)

int myVariableName;     // conventional (intercapped/camelCase)
int myFunctionName();   // conventional (intercapped/camelCase)

int my variable name;   // invalid (whitespace not allowed)
int my function name(); // invalid (whitespace not allowed)

int MyVariableName;     // unconventional (should start with lower case letter)
int MyFunctionName();   // unconventional (should start with lower case letter)
```


避免使用缩写，除非它们是常见且明确的


## 九： 文字和运算符

```c++
#include <iostream>

int main()
{
    std::cout << 5 << '\n'; // print the value of a literal

    int x{ 5 };
    std::cout << x << '\n'; // print the value of a variable
    return 0;
}
```

*直接打印 值 和 变量的区别*


因此，两个 output 语句执行相同的作（打印值 5）。但是对于 Literals，可以直接打印值 `5`。对于变量，必须从*变量表示的内存中获取值*

这也解释了为什么 Literals 是 constant，而 variable 可以更改。文本的值直接放置在可执行文件中，可执行文件本身在创建后无法更改。变量的值被放置在内存中，*并且可以在可执行文件运行时更改 memory 的值。*

文本值无法更改！！！！

变量值可以在后续被其它执行代码更改！！！


## *第一个项目

返回输入数字的二倍

```c++
#include <iostream>

// worst version
int main()
{
	std::cout << "Enter an integer: ";

	int num{ };
	std::cin >> num;

	num = num * 2; // double num's value, then assign that value back to num

	std::cout << "Double that number is: " << num << '\n';

	return 0;
}
```

为什么这是不好的！

1. 丢失了原始输入，无法重用

- 比如你想再做一步 `num * 3`，但这时候 `num` 早就不是用户输入了，是翻倍后的；
    
- **原始输入已经被覆盖，无法再用**。

2.变量含义“变了”，容易让人困惑

- 原来 `num` 表示“用户输入的值”；
    
- 后来 `num` 被改成了 “输入值 × 2”；
    
- **同一个变量**，含义却在中途改变 → 看代码的人容易糊涂。


## *编程思想

编程的首要目标是使您的程序正常工作。一个不工作的程序，无论它写得有多好，都是没有用的。

但是，我喜欢一句话：“你必须写一次程序，才能知道你第一次应该怎么写它。这说明了这样一个事实，即最佳解决方案通常并不明显，而且我们对问题的第一个解决方案通常没有应有的那么好。

当我们专注于弄清楚如何使我们的程序工作时，将大量时间投入到我们甚至不知道我们是否会保留的代码上没有多大意义。所以我们走捷径。我们跳过了错误处理和注释等内容。我们在整个解决方案中散布调试代码，以帮助我们诊断问题和查找错误。我们边走边学 -- 我们认为可能有效的事情终究是行不通的，我们不得不回头尝试另一种方法。

最终结果是，我们的初始解决方案通常结构不合理、健壮（防错）、可读性或简洁性。因此，一旦您的程序开始工作，您的工作就真的没有完成（除非该程序是一次性的/一次性的）。下一步是清理代码。这包括以下内容：删除 （或注释掉） 临时/调试代码、添加注释、处理错误情况、格式化代码以及确保遵循最佳实践。即使这样，您的程序也可能没有想象中那么简单 —— 也许有可以合并的冗余逻辑，或者可以组合的多个语句，或者不需要的变量，或者可以简化的一千个其他小事情。很多时候，新程序员专注于优化性能，而他们应该优化可维护性。

这些教程中介绍的解决方案很少在第一次就表现出色。相反，它们是不断完善的结果，直到找不到其他可以改进的地方。在许多情况下，读者仍然可以找到许多其他改进建议！

所有这一切实际上是在说：如果/当您的解决方案没有从您的大脑中得到出色的优化时，请不要感到沮丧。这很正常。完美的编程是一个迭代过程（需要重复的过程）。

***写代码是先求能跑，再求好；想写出好代码，必须接受写烂再改的过程。***



#### 问题： 初始化和赋值的区别

Initialization 为变量提供初始值（在创建时）。赋值 在定义变量后为变量提供新值

由于变量只创建一次，因此只能初始化一次。可以根据需要多次为变量分配值。

#### 问题：未定义的行为？什么后果？

当程序员执行 C++ 语言未指定的内容时，将发生未定义的行为。后果几乎是任何东西，从崩溃到产生错误的答案，再到无论如何都能正常工作。


## 一. 函数

您已经知道每个可执行程序都必须有一个名为 `main（）` 的函数（这是程序运行时开始执行的位置）。然而，随着程序开始变得越来越长，将所有代码放在 `main（）` 函数中变得越来越难以管理。函数为我们提供了一种将程序拆分为小的、模块化的块的方法，这些块更易于组织、测试和使用。大多数程序使用许多功能。C++ 标准库附带了大量已编写的函数供您使用 - 但是，编写自己的函数也同样常见。您自己编写的函数称为**用户定义的函数** 。


C++ 程序可以以相同的方式工作（并借用一些相同的命名法）。当程序遇到函数调用时，它将在一个函数中按顺序执行语句。 **函数调用**告诉 CPU 中断当前函数并执行另一个函数。CPU 实质上是在当前执行点 “放置书签”，执行函数调用中指定的函数，然后**返回到**它添加书签的点并继续执行。

发起函数调用的函数是**调用方** ，被**调用** （执行）的函数是**被调用方** 。函数调用有时也称为**调用** ，调用方**调用**被调用方。


```c++
#include <iostream> // for std::cout

void doB()
{
    std::cout << "In doB()\n";
}


void doA()
{
    std::cout << "Starting doA()\n";

    doB();

    std::cout << "Ending doA()\n";
}

// Definition of function main()
int main()
{
    std::cout << "Starting main()\n";

    doA();

    std::cout << "Ending main()\n";

    return 0;
}
```


一层层封装 进入弹出

## 二. 局部性

```c++
int add(int x, int y) // x and y created and initialized here
{
    int z{ x + y };   // z created and initialized here

    return z;
}
```

就像一个人的一生被定义为他们出生和死亡之间的时间一样，一个物体的**一生**被定义为其被创造和毁灭之间的时间。请注意，*变量创建和销毁发生在程序运行时（称为运行时），而不是在编译时。因此，lifetime 是一个运行时属性。*



```c++
#include <iostream>

void doSomething()
{
    std::cout << "Hello!\n";
}

int main()
{
    int x{ 0 };    // x's lifetime begins here

    doSomething(); // x is still alive during this function call

    return 0;
} // x's lifetime ends here
```


在上面的程序中，`x` 的生命周期从定义点到函数 `main` 的末尾。这包括执行函数 `doSomething` 期间所花费的时间。

**销毁的对象将变为无效。**


在对象被销毁后，对对象的任何使用都将导致未定义的行为。  **在销毁后的某个时间点，对象使用的内存将被释放 （释放以供重用）。**


局部变量的生命周期在它超出范围时结束，因此局部变量在此时被销毁。 *请注意，并非所有类型的变量在超出范围时都会被销毁*


***"One Task"***


## 三. 命名冲突


1. a.cpp

```c++
#include <iostream>

void myFcn(int x)
{
    std::cout << x;
}
```

2. main.cpp

```c++
#include <iostream>

void myFcn(int x)
{
    std::cout << 2 * x;
}

int main()
{
    return 0;
}
```


每个文件按编译的时候 不会出现问题但是 当链接器执行时，它会将 _a.cpp_ 和 _main.cpp_ 中的所有定义链接在一起，并发现函数 `myFcn（）` 的冲突定义。然后，链接器将中止并显示错误。请注意，即使从未调用 `myFcn（），` 也会发生此错误！

在给定的范围区域内，所有标识符都必须是唯一的，否则将导致命名冲突。

## 四. 命名空间

**命名空间**提供了另一种类型的范围区域（称为**命名空间范围** ），它允许您在其中声明或定义名称以消除歧义。在命名空间中声明的名称与其他范围内声明的名称隔离，从而允许此类名称存在而不会发生冲突。

在 C++ 中，未在类、函数或命名空间中定义的任何名称都被视为隐式定义的命名空间的一部分，该命名空间称为**全局命名空间** （有时也称为**全局范围** ）。

例如，可以在不同的命名空间内定义两个具有相同声明的函数，并且不会发生命名冲突或歧义。


命名空间只能包含声明和定义。可执行语句仅允许作为定义的一部分（例如函数的一部分）。


命名空间通常用于对大型项目中的相关标识符进行分组，以帮助确保它们不会无意中与其他标识符发生冲突。*例如，如果你把所有的数学函数都放在一个名为 `math` 的命名空间中，那么你的数学函数不会与 `math` 命名空间外的同名函数发生冲突。*


1. **全局命名空间**

函数 `main（）` 和 `myFcn（）` 的两个版本都是在全局命名空间内定义的。示例中遇到的命名冲突是因为 `myFcn（）` 的两个版本最终都位于全局命名空间内*，这违反了范围区域中的所有名称都必须唯一的规则*

尽管可以在全局命名空间中定义变量，但通常应该避免这种情况

事实证明，`std：：cout` 的名字并不是真正的 `std：：cout`。它实际上只是 `cout`， `而 std` 是标识符 `cout` 所属的命名空间的名称。因为 `cout` 是在 `std` 命名空间中定义的，所以名称 `cout` 不会与我们在 `std` 命名空间之外创建的任何名为 `cout` 的对象或函数冲突（例如在全局命名空间中）。


**当您使用在非全局命名空间（例如 `std` 命名空间）中定义的标识符时，您需要告诉编译器该标识符位于命名空间内。**


2. 显式命名空间限定符 std：：

告诉编译器我们想使用 `std` 命名空间中的 `cout` 的最直接方法是显式使用 `std：：` 前缀

```c++
#include <iostream>

int main()
{
    std::cout << "Hello world!"; // when we say cout, we mean the cout defined in the std namespace
    return 0;
}
```

访问命名空间内标识符的另一种方法是使用 using 指令语句。这是我们的原始 “Hello world” 程序，带有 using 指令：

```c++
#include <iostream>

using namespace std; // this is a using-directive that allows us to access names in the std namespace with no namespace prefix

int main()
{
    cout << "Hello world!";
    return 0;
}
```

**using 指令**允许我们在不使用命名空间前缀的情况下访问命名空间中的名称。所以在上面的例子中，当编译器去确定标识符 `cout` 是什么时，它将与 `std：：cout` 匹配，由于 using 指令，它只能作为 `cout` 访问。


### Why?

```c++
#include <iostream> // imports the declaration of std::cout into the global scope

using namespace std; // makes std::cout accessible as "cout"

int cout() // defines our own "cout" function in the global namespace
{
    return 5;
}

int main()
{
    cout << "Hello, world!"; // Compile error!  Which cout do we want here?  The one in the std namespace or the one we defined above?

    return 0;
}
```


上面的程序没有编译，因为编译器现在无法判断我们想要的是定义的 `cout` 函数，还是 `std：：cout`


以这种方式使用 using 指令时，我们定义_的任何_标识符_都可能与_ `std` 命名空间中的任何同名标识符冲突

`using namespace std;`

我接下来代码中要用 std 命名空间里的所有东西，不用再加 std:: 前缀了”

等价`std::cout` → `cout`，`std::cin` → `cin`。


```c++
#include <iostream> // imports the declaration of std::cout into the global scope

using namespace std; // makes std::cout accessible as "cout"



class  mm
{
public:
	 mm();
	~ mm();
    int cout();

private:
};

int mm::cout() {
    return 5;
}

 mm:: mm()
{
}

 mm::~ mm()
{
}

int main()
{
    class mm  a;
    a.cout(); // Compile error!  Which cout do we want here?  The one in the std namespace or the one we defined above?
    cout << "11111111";
    return 0;
}
```

大体是这个意思


### 缩进

```c
#include <iostream>   // 在全局作用域中，不需要缩进

void foo()           // 也是在全局作用域中定义，不缩进
{
    std::cout << "Inside foo\n";  // 在函数作用域（foo 的内部），所以缩进一级
}

int main()           // 也是在全局作用域中定义，不缩进
{
    std::cout << "Inside main\n"; // 也是在函数作用域内部，缩进一级
    foo();                        // 继续缩进一级
    return 0;
}

```



- `#include` 和函数定义 `void foo()`、`int main()` —— 这些是**最外层的代码（global scope）**，不缩进。
    
- 函数内部的代码是函数的“嵌套作用域”（nested scope）—— 所以要**缩进一级**，表示它们**属于这个函数内部**。
    
- 缩进不仅提高可读性，还帮助你视觉上快速看出哪段代码属于哪个作用域。


---

Day2


## 五. 预处理器

在编译之前，每个代码 （.cpp） 文件都会经历**一个预处理**阶段。在此阶段中，称为 **preprocessor** 的程序对代码文件的文本进行各种更改。预处理器实际上不会以任何方式修改原始代码文件 —— 相反，

**预处理器所做的所有更改要么临时发生在内存中，要么使用临时文件。**


从历史上看，预处理器是独立于编译器的程序，但在现代编译器中，预处理器可能直接内置到编译器本身中

它去除注释，并确保每个代码文件都以换行符结尾。但是，预处理器确实有一个非常重要的角色：它是处理 `#include` 指令的程序（我们稍后将详细讨论）。

当预处理器处理完代码文件时，结果称为**翻译单元** 。此翻译单元是编译器随后编译的内容。


```c++
#include <iostream>

int main()
{
    std::cout << "Hello, world!\n";
    return 0;
}
```

当预处理器在此程序上运行时，预处理器会将 `#include<iostream>` 替换为名为 “iostream” 的文件内容，然后预处理包含的内容和文件的其余部分。


_#define_ 指令可用于创建宏。在 C++ 中， **宏**是定义如何将输入文本转换为替换输出文本的规则。


宏有两种基本类型： _类对象宏_和_类函数宏_ 。

1. _Function-like macros_

作用类似于函数，并且具有类似的用途。它们的使用通常被认为是不安全的，几乎他们能做的任何事情都可以由普通函数完成。

2. _Object-like macros_

```c++
#define IDENTIFIER
#define IDENTIFIER substitution_text
```


宏的标识符使用与普通标识符相同的命名规则：它们可以使用字母、数字和下划线，不能以数字开头，也不应以下划线开头。按照约定，宏名称通常全部大写，并用下划线分隔。



```c++
#include <iostream>

#define MY_NAME "Alex"

int main()
{
    std::cout << "My name is: " << MY_NAME << '\n';

    return 0;
}
```

预处理器将上述内容转换为以下内容：

```c++
// The contents of iostream are inserted here

int main()
{
    std::cout << "My name is: " << "Alex" << '\n';

    return 0;
}
```

带有替换文本的类对象宏被使用（在 C 中）作为为文字分配名称的一种方式。这不再是必需的，因为 C++ 中有更好的方法可用:

***内联变量：*** 在多个文件之间共享全局常量


#### 不带替换文本的类对象宏

```c++
#define USE_YEN
```

这种形式的宏的工作方式可能如您所料：标识符的大多数后续出现都被删除并替换为任何内容！
这似乎很无用，而且对于进行文本替换_毫无用_处。但是，这不是这种形式的指令通常的用途。我们稍后将讨论此表单的用途。

### 条件编译 

_条件编译_预处理器指令允许您指定在什么条件下会编译或不编译。有很多不同的条件编译指令，但我们只介绍最常用的几种：

_#ifdef_、_#ifndef_ 和 _#endif_。

_#ifdef_ preprocessor 指令允许预处理器检查之前是否通过 #define 定义了标识符。如果是这样，则会编译 _#ifdef_ 和 Matching _#endif_ 之间的代码。否则，将忽略该代码。


### ifdef

```c++
#include <iostream>

#define PRINT_JOE

int main()
{
#ifdef PRINT_JOE
    std::cout << "Joe\n"; // will be compiled since PRINT_JOE is defined
#endif

#ifdef PRINT_BOB
    std::cout << "Bob\n"; // will be excluded since PRINT_BOB is not defined
#endif

    return 0;
}
```


因为 PRINT_JOE 已被 #defined，所以将编译 `std：：cout << “Joe\n”` 行。由于尚未 #defined PRINT_BOB，因此将忽略 `std：：cout << “Bob\n”` 行。

_#ifndef_ 与 _#ifdef_ 相反，因为它允许您检查标识符_是否尚未_ _#define_d。

### ifndef

```c++
#include <iostream>

int main()
{
#ifndef PRINT_BOB
    std::cout << "Bob\n";
#endif

    return 0;
}
```

此程序打印 “Bob”，因为 PRINT_BOB 从未 _#define_d。

### if 0

```c++
#include <iostream>

int main()
{
    std::cout << "Joe\n";

#if 0 // Don't compile anything starting here
    std::cout << "Bob\n";
    std::cout << "Steve\n";
#endif // until this point

    return 0;
}
```


上面的代码只打印 “Joe”，因为 _#if 0_ 预处理器指令将 “Bob” 和 “Steve” 排除在编译之外。

### if 1

```c++
#include <iostream>

int main()
{
    std::cout << "Joe\n";

#if 1 // always true, so the following code will be compiled
    std::cout << "Bob\n";
    /* Some
     * multi-line
     * comment here
     */
    std::cout << "Steve\n";
#endif

    return 0;
}
```


#### 试用场景
1. 控制调试信息

```c++
#define DEBUG

#ifdef DEBUG
std::cout << "Debug info\n";
#endif

```

2. 控制 **平台相关代码**


```c++
#ifdef _WIN32
    // Windows 特有代码
#else
    // Linux/macOS 特有代码
#endif

```



```c ++ 
#include <iostream>

void foo()
{
#define MY_NAME "Alex"
}

int main()
{
	std::cout << "My name is: " << MY_NAME << '\n';

	return 0;
}
```

尽管看起来 _#define MY_NAME “Alex”_ 是在函数 _foo_ 中定义的，但预处理器并不理解函数等 C++概念。因此，此程序的行为与在函数 _foo_ 之前或之后定义 _#define MY_NAME “Alex”_ 的行为相同。为避免混淆，您通常需要在函数之外 #define 标识符。



即使 PRINT 是在 _main.cpp_ 中定义的，也不会对 _function.cpp_ 中的任何代码产生任何影响（PRINT 仅 #defined 从定义点到 main.cpp 末尾）。当我们在以后的课程中讨论 Header Guard 时，这将产生重要影响。


*实际用处！*

wave.h

```
#ifndef WAVE_H
#define WAVE_H

#include "square.h"

#endif

```

square.h

```c++
#ifndef SQUARE_H
#define SQUARE_H

int getSquareSides()
{
    return 4;
}

#endif
```


main.cpp


```c++
#include "square.h"
#include "wave.h"

int main()
{
    return 0;
}
```


***作用防止头文件被重复编译***

## 六. 头文件

当程序仅包含几个小文件时，在每个文件的顶部手动添加一些前向声明还不错。但是，随着程序变大（并使用更多的文件和函数），必须手动将大量（可能不同）前向声明添加到每个文件的顶部变得非常乏味。例如，如果你有一个 5 个文件的程序，每个程序需要 10 个正向声明，你将不得不复制/粘贴 50 个正向声明。现在考虑这样一种情况：您有 100 个文件，每个文件都需要 100 个正向声明。这根本无法扩展！

C++ 代码文件（扩展名为 .cpp）并不是 C++程序中唯一常见的文件。另一种类型的文件称为**头文件** 。*头文件通常具有 .h 扩展名*，但您偶尔会看到*它们具有 .hpp 扩展名或根本没有扩展名。*



*言外之意：*

- 如果你的程序只有几个 `.cpp` 文件，手动写上这些前向声明还行。
    
- 但当项目变大，比如有 **100 个源文件（.cpp）**，每个文件需要调用很多别的函数，你就需要**复制粘贴大量前向声明到每个文件顶部**。
    
- 这是非常繁琐、容易出错、无法维护的。


 *解决方案*：
 
 用头文件！

你可以把这些前向声明写进一个 `.h` 文件：

这样，**声明只写一次、重复使用**，项目才容易扩展。


![Image](https://github.com/user-attachments/assets/2b1e9536-7720-4af5-a63b-bfcbfbb83d3b)



***目前，您应该避免将函数或变量定义放在头文件中。这样做通常会导致在头文件包含在多个源文件中的情况下违反单一定义规则***

1. 编译 `main.cpp` 时，`#include “add.h”` 将替换为 `add.h` 的内容，然后进行编译。因此，编译器将编译如下所示的内容


```c++
// from add.h:
int add(int x, int y)
{
    return x + y;
}

// contents of iostream header here

int main()
{
    std::cout << "The sum of 3 and 4 is " << add(3, 4) << '\n';

    return 0;
}
```

add.cpp

```
int add(int x, int y)
{
    return x + y;
}
```


`避免 #including .cpp 文件。`

`使用不带 .h 扩展名的标准库头文件。用户定义的标头仍应使用 .h 扩展名。`


### 标头保护

好消息是，我们可以通过一种称为 **header guard**（也称为 **include guard**）的机制来避免上述问题。Header guard 是条件编译指令，采用以下形式：

## *设计您的第一个程序

新程序员通常很难弄清楚如何将这个想法转化为实际代码。但事实证明，您已经拥有从日常生活中获得的许多解决问题的技能。

要记住的最重要的事情（也是最难做到的）是在_开始编码之前_设计你的程序。在许多方面，编程就像架构。如果您尝试在不遵循建筑计划的情况下建造房屋会发生什么？很有可能，除非你非常有才华，否则你最终会得到一个有很多问题的房子：墙壁不直、屋顶漏水等......同样，如果你在有一个好的游戏计划之前尝试编程，你可能会发现你的代码有很多问题，你将不得不花费大量时间来解决本可以通过提前思考完全避免的问题。


### 设计步骤 1：定义您的目标

**写程序前，一定要先明确目标。**  
你应该能用一两句话清楚说明程序的功能，最好从用户角度描述预期结果。比如：“帮用户管理联系人”，或者“模拟物体下落时间”。这个步骤看似简单，但非常关键。最糟糕的情况就是你写了一个根本不符合预期需求的程序。

### 设计步骤 2：定义要求

> **“Requirements（需求）”指的是两个方面：**

1. **约束条件**：你写程序时必须遵守的限制，比如预算、时间、内存等；
    
2. **功能要求**：程序必须具备哪些能力来满足用户的需求。
    

重点是：**需求应该关注“做什么”，而不是“怎么做”**。


### 设计步骤 3：定义您的工具、目标和备份计划

1. 定义您的程序将在什么目标架构和/或作系统上运行。
2. 确定您将使用的工具集。
3. 确定您是单独编写程序还是作为团队的一部分编写程序
4. 定义您的测试/反馈/发布策略。
5. 确定如何备份代码。


也就是说，如果你要处理任何非平凡的复杂性，你应该有一个备份代码的计划。将源目录压缩或复制到同一存储设备上的其他位置是不够的 - 如果存储设备死机或损坏，您将丢失所有内容。最好将副本或压缩到可移动存储设备（例如闪存驱动器）中，但在发生盗窃、火灾或重大自然灾害时，您仍然有可能丢失所有内容。

最好的备份策略包括将代码的副本获取到位于不同物理位置的计算机上。有很多简单的方法可以做到这一点：压缩并通过电子邮件发送给自己，将其上传到云存储服务（例如 Dropbox），使用文件传输协议（例如 SFTP）将其上传到您控制的服务器，或使用驻留在另一台机器或云中的版本控制系统（例如 github）。版本控制系统还有一个额外的优势，不仅可以恢复您的文件，还可以将它们回滚到以前的版本。

### 设计步骤 4：将困难问题分解为简单问题


事实证明，这些任务层次结构在编程中非常有用，因为一旦有了任务层次结构，您基本上就定义了整个程序的结构。顶级任务（在本例中为 “Clean the house” 或 “Go to work”） 变为 main（） （因为它是你试图解决的主要问题）。子项将成为程序中的函数


~~~
- Get from bed to work  
    从床上到工作地点
    - Bedroom things  卧室物品
        - Turn off alarm  关闭闹钟
        - Get out of bed  起床
        - Pick out clothes  挑选衣服
    - Bathroom things  浴室用品
        - Take a shower  洗个澡
        - Get dressed  穿衣服
        - Brush your teeth  刷牙
    - Breakfast things  早餐
        - Make coffee or tea  冲泡咖啡或茶
        - Eat cereal  吃麦片
    - Transportation things  交通
        - Get on your bicycle  骑上你的自行车
        - Travel to work  上班旅行
~~~


如果事实证明其中一个项目（功能）太难实现，只需将该项目拆分为多个子项目/子功能即可。最终，您应该达到程序中的每个函数都很容易实现的地步。

### 设计步骤 5：确定事件的顺序

现在，您的程序已经有了结构，是时候确定如何将所有任务链接在一起了。第一步是确定将要执行的事件的顺序。例如，当您早上起床时，您按什么顺序执行上述任务？它可能看起来像这样：

- Bedroom things  卧室物品
- Bathroom things  浴室用品
- Breakfast things  早餐
- Transportation things  交通


### 实施步骤 1：概述您的主要功能


```c++
int main()
{
//    doBedroomThings();
//    doBathroomThings();
//    doBreakfastThings();
//    doTransportationThings();

    return 0;
}
```

### 实现步骤 2：实现每个功能

1. 定义函数原型（输入和输出）
2. 编写函数
3. 测试函数


### 实施步骤 3：最终测试

**让您的程序易于启动** 。通常，新程序员对他们希望程序完成的所有事情都有一个宏伟的愿景。“我想写一个带有图形和声音的角色扮演游戏，以及随机的怪物和地牢，有一个你可以参观的城镇来出售你在地牢中找到的物品”。如果你试图写一些太复杂而无法开始的东西，你会因为没有进展而变得不知所措和气馁。相反，让你的第一个目标尽可能简单，这绝对是你能实现的。例如，“我希望能够在屏幕上显示 2 维字段”。

**随时间推移添加功能** 。一旦您的简单程序运行良好，您就可以为其添加功能。例如，一旦您可以显示您的字段，请添加一个可以四处走动的角色。一旦你可以四处走动，添加可能阻碍你前进的墙壁。一旦你有了城墙，就用它们建造一个简单的城镇。一旦你有一个城镇，添加商人。通过逐步添加每个功能，您的程序将逐渐变得更加复杂，而不会在此过程中让您不知所措。

**一次专注于一个区域** 。不要试图一次编写所有内容，也不要将注意力分散到多个任务上。一次专注于一项任务。有一个工作任务和五个尚未开始的任务比有六个部分工作的任务要好得多。如果你分散注意力，你更有可能犯错误并忘记重要的细节。

**随时测试每段代码** 。新程序员通常会一次性编写整个程序。然后，当他们第一次编译它时，编译器会报告数百个错误。这不仅令人生畏，如果您的代码不起作用，可能很难弄清楚原因。相反，编写一段代码，然后立即编译和测试它。如果它不起作用，您将确切地知道问题所在，并且很容易解决。确定代码有效后，请转到下一部分并重复。完成代码编写可能需要更长的时间，但是当您完成时，整个事情应该可以正常工作，并且您不必花费两倍的时间来试图找出它为什么不行。

**不要投资于完善早期代码** 。功能（或程序）的初稿很少是好的。此外，随着您添加功能并找到更好的方法来构建事物，程序往往会随着时间的推移而发展。如果您过早地投资于完善代码（添加大量文档、完全符合最佳实践、进行优化），那么在需要更改代码时，您可能会失去所有投资。相反，让您的功能最低限度地工作，然后继续前进。当您对自己的解决方案充满信心时，可以进行连续的润色。不要追求完美 -- 非平凡的程序永远不会完美，总有更多的事情可以改进它们。达到 “足够好” 并继续前进。

**针对可维护性进行优化，而不是针对性能进行优化** 。有一句名言（由 Donald Knuth 引用）说“过早优化是万恶之源”。新程序员通常会花费太多时间思考如何对他们的代码进行微优化（例如，试图找出 2 个语句中哪一个更快）。这很少重要。大多数性能优势来自良好的程序结构、针对手头的问题使用正确的工具和功能以及遵循最佳实践。应使用额外的时间来提高代码的可维护性。找到冗余并删除它。将长函数拆分为较短的函数。用更好的代码替换笨拙或难以使用的代码。最终结果将是代码更容易改进和优化（在您确定了实际需要优化的位置之后）和更少的错误。

***总结：***

- **从简单开始**：不要一开始就写复杂系统，先实现最基础、最小的功能，逐步迭代。
    
- **逐步增加功能**：先把核心功能做好，再逐步加入角色、障碍、城镇等扩展内容。
    
- **一次专注一件事**：不要分心做多个任务，集中精力完成一个功能，比多个半成品更好。
    
- **边写边测试**：写一点，编译测试一点，问题容易定位，避免一堆错误一起出现。
    
- **别急着打磨代码**：先实现功能，不用一开始就追求完美，功能稳定后再优化。
    
- **优先可维护性而非性能**：早期不要过度优化，写结构清晰、易维护的代码更重要。


## 一. 语法和语义错误

学习查找和删除您编写的程序中的错误是成为一名成功程序员极其重要的部分

行时语义错误并不容易通过观察代码来发现。这就是调试技术可以派上用场的地方。

### 通过运行程序查找问题

幸运的是，如果我们无法通过代码检查找到问题，我们可以采取另一种途径：我们可以在程序运行时观察其行为，并尝试从中*诊断问题*。这种方法可以概括为：

1. 弄清楚如何重现问题
2. 运行程序并收集信息以缩小问题所在范围
3. 重复上一步，直到找到问题

### 重现问题

发现问题的第一步也是最重要的一步是能够_重现问题_ 。重现问题意味着使问题以一致的方式出现。原因很简单：除非你能观察到问题的发生，否则很难发现它。

### 关注问题

### 调试策略 1：注释掉你的代码

让我们从一个简单的开始。如果您的程序表现出错误的行为，减少必须搜索的代码量的一种方法是注释掉一些代码，然后查看问题是否仍然存在。如果问题保持不变，则注释掉的代码可能没有责任。

### 调试策略 2：验证代码流


`std::cerr << "getValue() called\n";`



```c
#include <iostream>

int getValue()
{
    std::cerr << "getValue() called\n";
    return 4;
}

int main()
{
    std::cout << getValue << '\n';

    return 0;
}
```


### 调试策略 3：打印值

对于某些类型的 bug，程序可能会计算或传递错误的值。

我们还可以输出变量（包括参数）或表达式的值，以确保它们是正确的


虽然向程序添加调试语句以进行诊断是一种常见的基本技术，也是一种功能性技术（尤其是当调试器由于某种原因不可用时），但它并不是那么好，原因有很多：

1. Debug 语句会使您的代码变得混乱。

2. Debug 语句会使程序的输出变得混乱。

3. 调试语句需要修改代码以添加和删除，这可能会引入新的错误。

4. 调试语句必须在使用完后删除它们，这使得它们不可重用。


###   3.5 – 更多调试策略

#### 宏

在整个程序中更轻松地禁用和启用调试的一种方法是使用预处理器指令*将调试语句设为条件：*


```c++
#include <iostream>

#define ENABLE_DEBUG // comment out to disable debugging

int getUserInput()
{
#ifdef ENABLE_DEBUG
	std::cerr << "getUserInput() called\n";
#endif
	std::cout << "Enter a number: ";
	int x{};
	std::cin >> x;
	return x;
}

int main()
{
#ifdef ENABLE_DEBUG
	std::cerr << "main() called\n";
#endif
	int x{ getUserInput() };
	std::cout << "You entered: " << x << '\n';

	return 0;
}
```


现在我们只需通过注释 / 取消注释 _#define ENABLE_DEBUG_ 来启用调试。这允许我们重用以前添加的 debug 语句，然后在完成它们时禁用它们，而不必实际从代码中删除它们。如果这是一个多文件程序，则 #define ENABLE_DEBUG 将放入包含在所有代码文件中的头文件中，以便我们可以在单个位置注释/取消注释 #define 并将其传播到所有代码文件。


#### 日志文件

通过预处理器进行条件化调试的另一种方法是将调试信息发送到日志。 **日志**是已发生事件的顺序记录，通常带有时间戳。生成日志的过程称为**日志记录** 。通常，日志会写入磁盘上的文件（称为**日志文件** ），以便以后查看。大多数应用程序和作系统都会写入日志文件，这些文件可用于帮助诊断发生的问题。


***写入日志文件的信息与程序的输出是分开的***

~~~
C++ 包含一个名为 `std：：clog` 的输出流，该流旨在用于写入日志记录信息。但是，默认情况下，`std：：clog` 会写入标准错误流（与 `std：：cerr` 相同）。虽然您可以将其重定向到 file，但这是您通常最好使用众多现有可用第三方日志记录工具之一的领域。你使用哪一个取决于你。
~~~


```c++
#include <plog/Log.h> // Step 1: include the logger headers
#include <plog/Initializers/RollingFileInitializer.h>
#include <iostream>

int getUserInput()
{
	PLOGD << "getUserInput() called"; // PLOGD is defined by the plog library

	std::cout << "Enter a number: ";
	int x{};
	std::cin >> x;
	return x;
}

int main()
{
	plog::init(plog::debug, "Logfile.txt"); // Step 2: initialize the logger

	PLOGD << "main() called"; // Step 3: Output to the log as if you were writing to the console

	int x{ getUserInput() };
	std::cout << "You entered: " << x << '\n';

	return 0;
}
```



## 跳跃！

## 7.1  复合语句

一组_零个或多个语句_ ，编译器将其视为单个语句

### 其他块内的块

虽然函数不能嵌套在其他函数中，但块_可以_嵌套在其他块中：

```c++
int add(int x, int y)
{ // block
    return x + y;
} // end block

int main()
{ // outer block

    // multiple statements
    int value {};

    { // inner/nested block
        add(3, 4);
    } // end inner/nested block

    return 0;

} // end outer block
```


*当块嵌套时，封闭块通常称为**外部块** ，封闭块称为**内部块**或**嵌套块** 。*


### 使用块有条件地执行多个语句

块最常见的用例之一是与 `if 语句`结合使用。默认情况下，如果条件的计算结果为 `true`， `则 if 语句`将执行单个语句。但是，如果我们希望在条件计算结果为 `true` 时执行多个语句，则可以将这个语句替换为一个语句块。

```c
#include <iostream>

int main()
{ // start of outer block
    std::cout << "Enter an integer: ";
    int value {};
    std::cin >> value;

    if (value >= 0)
    { // start of nested block
        std::cout << value << " is a positive integer (or zero)\n";
        std::cout << "Double this number is " << value * 2 << '\n';
    } // end of nested block
    else
    { // start of another nested block
        std::cout << value << " is a negative integer\n";
        std::cout << "The positive of this number is " << -value << '\n';
    } // end of another nested block

    return 0;
} // end of outer block
```

### 块嵌套级别

甚至可以将块放在块内，块内放在块内：


函数的**嵌套级别** （也称为**嵌套深度** ）是您在函数中任何点（包括外部块）可以位于内部的最大嵌套块数。在上面的函数中，有 4 个块，但嵌套级别是 3，因为在这个程序中，你在任何时候都不能超过 3 个块。


最好将嵌套级别保持在 3 或更低。正如过长的函数是重构（分成更小的函数）的良好候选者一样，过度嵌套的块很难阅读，并且是重构的良好候选者（嵌套最多的块成为单独的函数）。

### 用户定义的命名空间和范围解析运算符

让我们重新审视一个命名冲突的示例，然后展示如何使用命名空间进行改进。在下面的示例中，`foo.cpp` 和 `goo.cpp` 是包含执行不同作但具有相同名称和参数的函数的源文件。

解决此问题的一种方法是重命名其中一个函数，这样名称就不会再发生冲突。但这也需要更改所有函数调用的名称，这可能会很痛苦，并且容易出错。避免冲突的更好方法是将函数放入自己的命名空间中。因此，标准库被移动到 `std` 命名空间中。



foo.cpp 

```c++
// This doSomething() adds the value of its parameters
int doSomething(int x, int y)
{
    return x + y;
}
```


goo.cpp

```c++
// This doSomething() subtracts the value of its parameters
int doSomething(int x, int y)
{
    return x - y;
}
```

如果将两个 *.cpp*  文件 编译在一起 一定会产生冲突！ *main.cpp*不知道使用哪个*doSomething（）*

解决此问题的一种方法是重命名其中一个函数，这样名称就不会再发生冲突。但这也需要更改所有函数调用的名称，这可能会很痛苦，并且容易出错。

**避免冲突的更好方法是将函数放入自己的命名空间中。因此，标准库被移动到 `std` 命名空间中。**


## 7.2定义您自己的命名空间

C++ 允许我们通过 `namespace` 关键字定义我们自己的命名空间。您在自己的程序中创建的命名空间被随意称为**用户定义的命名空间** （尽管将它们称为**程序定义的命名空间**更准确）。


```c++
namespace NamespaceIdentifier
{
    // content of namespace here
}
```

我们建议命名空间名称以大写字母开头。但是，任何一种风格都应该被视为可以接受。


！！！修改一下：

```c++
namespace Foo // define a namespace named Foo
{
    // This doSomething() belongs to namespace Foo
    int doSomething(int x, int y)
    {
        return x + y;
    }
}
```

！！！修改一下：

```c++
namespace Goo // define a namespace named Goo
{
    // This doSomething() belongs to namespace Goo
    int doSomething(int x, int y)
    {
        return x - y;
    }
}
```


但是！ 在这种情况下，编译器满足了（通过我们的 forward 声明），但链接器在全局命名空间中找不到 `doSomething` 的定义。这是因为我们的两个 `doSomething` 版本都不再位于全局命名空间中！它们现在位于各自的命名空间范围内！

告诉编译器在特定命名空间中查找标识符的最佳方法是使用**范围解析运算符** （：:).范围解析运算符告诉编译器，应在左侧作数的范围内查找右侧作数指定的标识符。

```c++
#include <iostream>

void print() // this print() lives in the global namespace
{
	std::cout << " there\n";
}

namespace Foo
{
	void print() // this print() lives in the Foo namespace
	{
		std::cout << "Hello";
	}

	void printHelloThere()
	{
		print();   // calls print() in Foo namespace
		::print(); // calls print() in global namespace
	}
}

int main()
{
	Foo::printHelloThere();

	return 0;
}
```


请注意，因为命名空间 `Goo` 在命名空间 `Foo` 内，所以我们以 `Foo：：Goo：：add` 的形式访问 `add`。

```c++
#include <iostream>

namespace Foo
{
    namespace Goo // Goo is a namespace inside the Foo namespace
    {
        int add(int x, int y)
        {
            return x + y;
        }
    }
}

int main()
{
    std::cout << Foo::Goo::add(1, 2) << '\n';
    return 0;
}
```



### 命名空间别名
因为在嵌套命名空间中键入变量或函数的限定名称可能很痛苦，所以 C++ 允许你创建**命名空间别名** ，这允许我们暂时将一长串命名空间缩短为更短的命名空间：


```c++
#include <iostream>

namespace Foo::Goo
{
    int add(int x, int y)
    {
        return x + y;
    }
}

int main()
{
    namespace Active = Foo::Goo; // active now refers to Foo::Goo

    std::cout << Active::add(1, 2) << '\n'; // This is really Foo::Goo::add()

    return 0;
} // The Active alias ends here
```

别名的好处：

```c++
#include <iostream>

namespace Foo::Goo
{
}

namespace V2
{
    int add(int x, int y)
    {
        return x + y;
    }
}

int main()
{
    namespace Active = V2; // active now refers to V2

    std::cout << Active::add(1, 2) << '\n'; // We don't have to change this

    return 0;
}
```


*在多团队组织中，经常使用两级甚至三级命名空间来防止不同团队生成的代码之间的命名冲突。这些通常采用以下形式之一：*


1. 项目或库 ：： 模块 （例如 `Foologger：：Lang`）
2. 公司或组织 ：： 项目或库 （例如 `Foosoft：：Foologger`）
3. Company or org ：： 项目或库 ：： 模块 （例如 `Foosoft：：Foologger：：Lang`）

## 7.3 局部变量

局部变量具有**块范围** ，这意味着它们在从其*定义点到定义它们的块末尾的_范围内_*

在*最有限的现有范围内定义变量*。*避免创建仅以限制变量范围*为目的的新区块。

不要这样
```c++
{
    temp := compute() // 只想让 temp 只在这个块里生效
    use(temp)
}

```

而是这样 
```c++
temp := compute()
use(temp)
```

## 7.4 全局变量
全局变量也可以在用户定义的命名空间中定义。这是与上面相同的示例，*但 `g_x` 已从全局范围移动到用户定义的命名空间 `Foo` 中：*

```c++
#include <iostream>

namespace Foo // Foo is defined in the global scope
{
    int g_x {}; // g_x is now inside the Foo namespace, but is still a global variable
}

void doSomething()
{
    // global variables can be seen and used everywhere in the file
    Foo::g_x = 3;
    std::cout << Foo::g_x << '\n';
}

int main()
{
    doSomething();
    std::cout << Foo::g_x << '\n';

    // global variables can be seen and used everywhere in the file
    Foo::g_x = 5;
    std::cout << Foo::g_x << '\n';

    return 0;
}
```

    !!! 首选在命名空间内定义全局变量，而不是在全局命名空间中定义全局变量。


### 局变量具有静态持续时间

全局变量在程序启动时（ `在 main（）` 开始执行之前）创建，并在程序结束时销毁。这称为**静态持续时间** 。具有_静态持续时间_的变量有时称为**静态变量** 。

按照惯例，一些开发人员在全局变量标识符前面加上 “g” 或 “g_” 以指示它们是全局变量。此前缀有几个用途

*在命名全局变量（尤其是在全局命名空间中定义的变量）时，请考虑使用“g”或“g_”前缀，以帮助将它们与局部变量和函数参数区分开来。*

```c++
const int g_x;     // error: constant variables must be initialized
constexpr int g_w; // error: constexpr variables must be initialized

const int g_y{ 1 };     // const global variable g_y, initialized with a value
constexpr int g_z{ 2 }; // constexpr global variable g_z, initialized with a value
```


**普通全局变量**、**`const` 全局变量** 和 **`constexpr` 全局变量**

```c++
int g_x;        // 默认初始化为 0（在全局作用域）
int g_x {};     // 显式初始化为 0
int g_x { 1 };  // 显式初始化为 1
```

```c++
const int g_y;       // ❌ 错：必须初始化
const int g_y { 2 }; // ✅ 正确：初始化为 2
```


## 7.5 变量隐藏（名称隐藏）


*局部变量的隐藏*


```c++
#include <iostream>

int main()
{ // outer block
    int apples{ 5 }; // here's the outer block apples

    { // nested block
        // apples refers to outer block apples here
        std::cout << apples << '\n'; // print value of outer block apples

        int apples{ 0 }; // define apples in the scope of the nested block

        // apples now refers to the nested block apples
        // the outer block apples is temporarily hidden

        apples = 10; // this assigns value 10 to nested block apples, not outer block apples

        std::cout << apples << '\n'; // print value of nested block apples
    } // nested block apples destroyed


    std::cout << apples << '\n'; // prints value of outer block apples

    return 0;
} // outer block apples destroyed
```

如果块内没有  `int apples{ 0 };` 则会影响块外变量

#### 全局变量的隐藏

```c++
#include <iostream>
int value { 5 }; // global variable

void foo()
{
    std::cout << "global variable value: " << value << '\n'; // value is not shadowed here, so this refers to the global value
}

int main()
{
    int value { 7 }; // hides the global variable value (wherever local variable value is in scope)

    ++value; // increments local value, not global value

    std::cout << "local variable value: " << value << '\n';

    foo();

    return 0;
} // local value is destroyed
```


`（：:) 来告诉编译器我们指的是全局变量而不是局部变量。`



#### 避免变量阴影

通常应避免局部变量的阴影，因为在使用或修改错误的变量时，这可能会导致无意中的错误。某些编译器会在变量被隐藏时发出警告。

出于我们建议避免隐藏局部变量的相同原因，我们也建议避免隐藏全局变量。如果你的所有全域名称都使用 “g_” 前缀，这是很容易避免的。

***内层变量不要和外层重名**


## 7.6 – 内部链接


全局变量和函数标识符可以具有`内部链接`或`外部链接`
局部变量并没有链接！


```c++
// file1.cpp
int g_val = 100;  // 外部链接变量

// file2.cpp
extern int g_val; // 引用 file1 中的变量

```


```c++
// file1.cpp
static int g_val = 42;  // 内部链接，只能 file1 访问

static void helper() {} // 内部链接函数
```


#### 具有内部链接的全局变量

具有内部链接的全局变量有时称为**内部变量**

要使非常量全局变量内部化，我们使用 `static` 关键字。

#### 内联变量

函数标识符也具有链接。函数默认为 external linkage


>WHY？ 为什么要费心给标识符内部链接呢？


我们要确保其他文件无法访问某个标识符。这可能是我们不想弄乱的全局变量，或者是我们不想被调用的辅助函数。

对避免命名冲突迂腐。因为具有内部链接的标识符不会暴露给链接器，所以它们只能与同一翻译单元中的名称发生冲突，而不能在整个程序中发生冲突

>考虑为所有你不希望其他文件访问的标识符提供内部链接

>当您有明确的理由禁止从其他文件访问时，为 identifiers 提供内部链接。

## 7.7 外部链接和可变前向声明

具有外部链接的标识符对链接器可见。这允许链接器执行两项作：

1. 将一个翻译单元中使用的标识符与另一个翻译单元中的相应定义连接起来。
2. 删除重复的内联标识符，以便保留一个规范定义


### 函数默认具有外部链接

具有外部链接的全局变量有时称为**外部变量** 。要使全局变量为 external（从而被其他文件访问），我们可以使用 `extern` 关键字来做到这一点：

```c++
int g_x { 2 }; // non-constant globals are external by default (no need to use extern)

extern const int g_y { 3 }; // const globals can be defined as extern, making them external
extern constexpr int g_z { 3 }; // constexpr globals can be defined as extern, making them external (but this is pretty useless, see the warning in the next section)

int main()
{
    return 0;
}
```

> 如果要定义未初始化的非 const 全局变量，请不要使用 extern 关键字，否则 C++ 会认为你正在尝试为该变量进行前向声明。


#### 向前声明

“**向前声明（forward declaration）**”是告诉编译器：“某个变量或函数**在别的地方有定义**，你先记着，现在先别报错。”

```c++
// a.cpp
int g_x = 10;  // 真正定义并初始化 g_x（外部链接）

// main.cpp
extern int g_x;  // 👉 向前声明：g_x 在别处定义
int main() {
    std::cout << g_x << '\n';  // 可以用
}

```

向前声明 **不等于定义**，只是告诉编译器：“等下你会看到它的定义”。


*向前声明是**多文件协作的关键技术**，让你能在一个文件中使用另一个文件里的变量或函数。*



>避免在带有初始化器的非 const 全局变量上使用 `extern`


```c++
int g_x { 1 };        // extern by default
extern int g_x { 1 }; // explicitly extern (may cause compiler warning)
```

但是，编译器可能会发出有关后一个语句的警告，即使它在技术上是有效的

>仅将 `extern` 用于全局变量前向声明或 const 全局变量定义。

>不要将 `extern` 用于非 const 全局变量定义（它们是隐式的 `extern`）。

## 7.8 — 为什么全局变量是邪恶的

***“避免使用全局变量！而且有充分的理由：全局变量是该语言中历史上最被滥用的概念之一***

非 const 全局变量。


>非 const 全局变量危险的最大原因是它们的值可以被调用_的任何_函数更改，并且程序员没有简单的方法可以知道这种情况会发生



如果在大型项目中 可能会造成的问题！

```c++
#include <iostream>

int g_mode; // declare global variable (will be zero-initialized by default)

void doSomething()
{
    g_mode = 2; // set the global g_mode variable to 2
}

int main()
{
    g_mode = 1; // note: this sets the global g_mode variable to 1.  It does not declare a local g_mode variable!

    doSomething();

    // Programmer still expects g_mode to be 1
    // But doSomething changed it to 2!

    if (g_mode == 1)
    {
        std::cout << "No threat detected.\n";
    }
    else
    {
        std::cout << "Launching nuclear missiles...\n";
    }

    return 0;
}
```


请注意，程序员将变量 `g_mode` 设置为 _1_，然后调用 `doSomething（）。` 除非程序员明确知道 `doSomething（）` 将更改 `g_mode` 的值，否则他或她可能不希望 `doSomething（）` 更改该值！因此，`main（）` 的其余部分并不像程序员期望的那样工作（并且世界被抹去了）。

全局变量使程序的状态不可预测。每个函数调用都变得具有潜在的危险，程序员无法轻松知道哪些是危险的，哪些不是！*局部变量要安全得多，因为其他函数不能直接影响它们*。

全局变量还会降低程序的模块化程度和灵活性。一个只利用其参数且没有副作用的函数是完美的模块化的。模块化有助于理解程序的作用，以及可重用性。全局变量显著降低了模块化。

>**全局变量会破坏模块化设计**，而 ✅ **纯函数（只用参数、不产生副作用）是理想的模块化单位**。

- **容易测试** ✅
    
- **容易复用** ✅
    
- **行为可预测** ✅

一个函数/模块只管自己，输入什么就输出什么，不依赖外部状态，也不影响其他模块。

>**模块化 = 自成一体、无副作用、可独立测试复用**，  
**全局变量 = 容易打破这种模块化结构，导致 bug 多、维护难。**


### 全局变量的初始化顺序问题

*静态变量（包括全局变量）的初始化作为程序启动的一部分进行，

在执行 `main` 函数之前。这分两个阶段进行。

有 constexpr 初始值设定项（包括 Literals）的全局变量被初始化为这些值。这称为**常量初始化** 。

 1. 没有初始化器的全局变量是零初始化的。零初始化被认为是静态初始化的一种形式，因为 `0` 是 constexpr 值。



```c++
constexpr int a = 10; // ✔ 编译时能确定，常量初始化
const int b = 5;      // ✔ 也是常量初始化
int c = 0;            // ✔ 0 也是 constexpr，叫做 zero-initialization
```

**快、安全、顺序无依赖**

3. 第二个阶段称为**动态初始化** 。这个阶段更加复杂和细微，但其要点是初始化具有非 constexpr 初始值设定项的全局变量。

```c++
int getValue() { return 42; }
int x = getValue(); // ❌ 不是 constexpr，必须运行 getValue()，这是动态初始化
```

这个阶段就**可能会有初始化顺序问题**，比如多个全局变量之间相互依赖，顺序搞错就可能出 bug。

| 阶段    | 什么时候发生     | 初始化什么                        |
| ----- | ---------- | ---------------------------- |
| 静态初始化 | 程序启动前（编译时） | `constexpr` 值、字面值、未初始化变量设为 0 |
| 动态初始化 | 程序启动时（运行时） | 需要函数/表达式结果的初始化               |

> 全局变量的使用：变量在程序中应该只表示一个事物，并且它的使用应该在整个程序中无处不在。


如果你确实找到了 non-const 全局变量的好用法，那么一些有用的建议将最大限度地减少你可能遇到的麻烦。这个建议不仅适用于 non-const global variables，而且可以帮助所有 global variables。


*首先，在所有非命名空间的全局变量前面加上 “g” 或 “g_”，或者更好的是，将它们放在命名空间中，以减少命名冲突的可能性。*


## 7.9 内联函数

将代码作为现有函数的一部分编写（称为“就地”或“内联”编写代码）。

创建一个新函数（可能还有子函数）来处理任务。

将代码放入新函数中提供了许多潜在的好处，如小函数：

但是，使用 new 函数的一个缺点是，每次调用函数时，都会产生一定量的性能开销。请考虑以下示例：

```c++
#include <iostream>

int min(int x, int y)
{
    return (x < y) ? x : y;
}

int main()
{
    std::cout << min(5, 6) << '\n';
    std::cout << min(3, 2) << '\n';
    return 0;
}
```

当遇到对 `min（）` 的调用时，CPU 必须存储它正在执行的当前指令的地址（以便它知道稍后返回何处）以及各种 CPU 寄存器的值（以便它们可以在返回时恢复）。然后，必须实例化参数 `x` 和 `y`，然后初始化。然后，执行路径必须跳转到 `min（）` 函数中的代码。当函数结束时，程序必须跳回到函数调用的位置，并且必须复制返回值以便输出。必须为每个函数调用执行此作。

*在完成某些任务（在本例中为进行函数调用）后，设置、促进和/或清理所必须发生的所有额外工作都称为**开销** 。*

对于大型和/或执行复杂任务的函数，与函数运行所需的时间相比，函数调用的开销通常微不足道。但是，对于小型函数（例如上面的 `min（），` 开销成本可能大于实际执行函数代码所需的时间！在经常***调用小型函数的情况下，使用函数可能会导致就地编写相同代码的显著性能损失。***

### 内联拓展

幸运的是，C++ 编译器有一个技巧可以用来避免这种开销成本： **内联扩展**是一个过程，其中函数调用被调用函数定义中的代码替换。

```c++
#include <iostream>

int main()
{
    std::cout << ((5 < 6) ? 5 : 6) << '\n';
    std::cout << ((3 < 2) ? 3 : 2) << '\n';
    return 0;
}
```

对函数 `min（）` 的两次调用已替换为 `min（）` 函数主体中的代码 使我们能够避免这些调用的开销，同时保留代码的结果。

除了消除函数调用的成本之外，内联扩展还可以让编译器更有效地优化结果代码 -- 例如，由于表达式 `（（5 < 6） ？ 5 ： 6）` 现在是一个常量表达式，编译器可以进一步将 `main（）` 中的第一个语句优化为 `std：：cout << 5 << '\n';`。

！ 可以拓展 ！

！ 无法拓展 ！

#### inline

使用 `inline` 关键字声明的函数称为**内联函数** 。

```c++
#include <iostream>

inline int min(int x, int y) // inline keyword means this function is an inline function
{
    return (x < y) ? x : y;
}

int main()
{
    std::cout << min(5, 6) << '\n';
    std::cout << min(3, 2) << '\n';
    return 0;
}
```

使用 `inline` 请求内联扩展是一种过早的优化形式，滥用实际上可能会损害性能。

`inline` 关键字只是一个提示，可帮助编译器确定在何处执行内联扩展。编译器完全可以自由地忽略该请求，而且它很可能会这样做。编译器还可以自由地对不使用 `inline` 关键字作为其常规优化集一部分的函数执行内联扩展。



> 请勿使用 `inline` 关键字为您的函数请求内联扩展。


***“你别真的去调用函数，把函数体直接展开到调用处去，提高运行效率。”***

 2. 使用场景

- 函数非常短小（如 getter/setter、加减乘除等）；
    
- 多次频繁调用；
    
- 希望避免函数调用带来的开销（如压栈、跳转等）

|特性|描述|
|---|---|
|优点|提高效率，省去函数调用开销|
|缺点|增加代码体积，可能影响缓存命中率|
|使用建议|小函数，头文件中，避免滥用|


> 为什么不将所有函数内联并在头文件中定义呢？


## 7.10 作为内部变量的全局常量


