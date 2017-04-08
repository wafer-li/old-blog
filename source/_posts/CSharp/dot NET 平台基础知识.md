---
title: .NET 平台基础知识
date: 2017-04-08
categories: CSharp
tags: CSharp
---

## 1 . 概述

.NET 是微软公司开发的一个运行库和平台，它是平台无关和语言无关的，可以支持多种语言创建 .NET 应用并跨平台运行。

> 这有点类似 Java 的 "write once, run anywhere" 的思想


<!-- more -->

## 2. .NET 平台的构成

.NET 平台主要有平台构造块（CLR, CTS, CLS）和基础类库构成。

### 2.1 平台构造块

.NET 的平台构造块有三个，分别为 CLR, CTS 和 CLS。

#### 2.1.1 CLR —— 公共语言运行库

CLR 全称叫做 Common Langurage Runtime。其主要作用就是为我们定位、加载和管理 .NET 类型，同时负责底层细节的工作，如内存管理、应用托管、处理线程、安全检查等。

> 从 Java 的角度看，CLR 相当于 Java 的 JRE

#### 2.1.2 CTS —— 公共类型系统

CTS 的全称叫做 Common Type System。顾名思义，它定义了一个公共的 .NET 类型系统，描述 .NET 支持的数据结构和类型，这是 .NET 的多语言支持的特点。

#### 2.1.3 CLS —— 公共语言规范

CLS 全称为 Common Language Specification。它定义了一个让所有的 .NET 语言都支持的公共类型和编程结构的子集，这主要是保证各个语言的兼容性而设计的。如果构造的 .NET 类型仅公开与 CLS 兼容的部分，那么所编写的 .NET 库就能与其他语言进行交互。

### 2.2 基础类库

.NET 除了三大构件以外，还提供了一个使用与全部 .NET 程序语言的基础库。

>  相当于 Java 和 C ++ 中的标准库

基础类库包括各种基本类型，文件 IO ，线程，GUI 以及与各种外部设备的交互等等。

下面的图显示了 .NET 构件与基础类库的关系。

![关系](http://img.blog.csdn.net/20160611195251305)

## 3. C# 的特点

1. 不需要指针

2. 自动管理内存和垃圾回收

   > 所以不支持 `delete` 关键字

3. 类、接口、结构、枚举、委托都有正式的语法结构

4. 可以重载操作符

5. 支持基于特性的编程

6. 属性(property) 而非字段(field)

   > 也就是说可以直接用点操作符而不是使用 getter 和 setter。

7. `await` 和 `async` 关键字，类似同步调用的异步调用方法

同时还具有其他语言的泛型、匿名类、反射等特性。

## 4. 托管代码和非托管代码

和 Java 一样，C# 语言需要生成类似 Java 字节码的一种中间代码才能够运行。

所以 C# 编译生成的代码只能在 .NET 运行库中执行。

> 就像 Java 必须使用 JRE 运行一样

正确的来说，这种必须在 .NET 运行库中执行的代码被称为**托管代码**(managed code)；

包含托管代码的二进制单元称为**程序集**(assembly)。

反之，不能直接在 .NET 运行库承载的代码被称为非托管代码(unmanaged code)

## 5. 其他支持 .NET 的编程语言

除了 C# 以外，.NET 框架也支持其他的编程语言。

实际上，在安装了 Visual Studio 之后，微软会提供 C#, Visual Basic, C++/CLI , JavaScript 和 F# 的 .NET 支持

## 6. .NET 程序集概览

 为了实现平台无关性，.NET 采用了程序集的概念。

不同的语言通过特定的编译器，编译得到一个中间语言(IL)和元数据，随后打包成一个程序集。

> 需要注意的是，.NET 中间语言拥有很多种缩写，IL 只是其中一种，其余的还有 MSIL 或者 CIL。
>
> IL, MSIL, CIL 都是等价的，指的就是中间语言。

程序集是二进制大对象所打包成的集合，大致分为两类；

一类是应用程序，拥有一个 `.exe` 入口。

另一类是库，具有 `.dll` 扩展名。

CIL 类似于 Java 的字节码，也是平台无关性的一个重要的原因。

在运行时，CIL 通过 JIT 编译器编译成为特定的机器码，在不同的设备上进行运行。

程序集除了包含 CIL 以外，还包含了元数据。元数据是许多 C# 特性的支柱（例如反射，晚期绑定等），同时，一些现代 IDE (Visual Studio)可以利用元数据进行智能感知。

此外，程序集还包含了描述程序集本身的元数据，它们叫做**清单**(manifest)。

## 7. CTS

CTS 是 .NET 的公共类型系统，它包括五个内容：

- 类
- 接口
- 结构
- 枚举
- 委托

大体上与 Java 类似，下面重点讲讲和 Java 不同的部分。

### 7.1 委托(delegate)

这可以算是 C# 相对 Java 的一个进步的方面。委托相当于一个类型安全的**函数指针**，实际上委托是一个派生自 `System.MultcastDelegate` 的**类**，使用 `delegate` 关键字可以声明一个委托。

```csharp
delegate int BinaryOp(int x, int y);
```

这样，就可以使用委托来实现回调，而不需要像 Java 一样使用臃肿的接口来进行回调动作。


<!-- more -->

### 7.2 结构(struct)

C# 的结构和 C99 之后的结构很像，用法也趋近；可以包含字段、构造函数、定义方法等。

不过一般当做一个容器类来使用。

## 8. 内建类型

同样，.NET 具有一个內建的核心数据类型，用于兼容不同平台的类型结构。下表给出了一个 CTS 数据类型和 C# 、C++ 的相应对比。

| CTS            | C#      | C++                          |
| -------------- | ------- | :--------------------------- |
| System.Byte    | byte    | unsigned char                |
| System.SByte   | sbyte   | signed cahr                  |
| System.Int16   | short   | short                        |
| System.Int32   | int     | int 或 long                   |
| System.Int64   | long    | int64_t                      |
| System.UInt16  | ushort  | unsigned short               |
| System.UInt32  | uint    | unsigned int 或 unsigned long |
| System.UInt64  | ulong   | unsigned int64_t             |
| System.Single  | float   | float                        |
| System.Double  | double  | double                       |
| System.Object  | object  | object^                      |
| System.Char    | char    | wchar_t                      |
| System.String  | string  | String^                      |
| System.Decimal | decimal | Decimal                      |
| System.Boolean | bool    | bool                         |

## 9. CLR

CLR 类似于 JVM，利用 `mscoree.dll` 库来进行 .NET 程序加载工作。

下图是 `mscoree.dll` 的工作流。

![](http://www.ituring.com.cn/download/01YY7g3jBdEN)


<!-- more -->

## 10. 名称空间(namespace)

这个特性类似于 Java 的 `package` 。

语法和 C++ 中的名称空间语法相同，使用 `using` 来引入名称空间（相当于 Java 的 `import`） 来进行使用。

```csharp
using System;

public class MyApp
{
  static void Main()
  {
    Console.WriteLine("Hi from C#");
  }
}
```

当然，同 Java 一样，在使用对应的名称空间之前，首先要引入依赖程序集。
