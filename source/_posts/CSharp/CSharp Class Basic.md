---
title: C# Class Basic
date: 2017-04-08
categories: CSharp
tags: CSharp
---

## 1. 概述

C# 类的基本语法和 Java 无异

下面只具体讲讲有区别的地方


<!-- more -->

## 2. 构造函数链

Java 中可以通过在构造函数中使用 `this` 来调用另一个构造函数，从而实现构造函数的职责委托链条。

C# 中则使用 **冒号** 来保证 `this` 的优先调用

```java
// Java
class Empolyee {

    Empolyee() {
        this("Unknown")
    }

    Empolyee(String name) {
        this.name = name;
    }
}
```

```csharp
// C#
class Empolyee {

    Empolyee(): this("Unknwon") { }

    Empolyee(string name) {
        this.name = name
    }
}
```

## 3. 可选参数

当然，在 .NET 4.0 以上可以在构造函数中使用可选参数。

可选参数用法和其他方法相同

## 4. 静态构造函数

实际上就是 Java 中的 **静态初始化块**，具体的行为也区别不大。

1. 静态构造函数只能有一个
2. 静态构造函数不能重载，不接受任何参数
3. 静态构造函数在类实例构建和首次调用静态成员时调用
4. 静态构造函数会 **先于所有构造函数执行**

不过语法上稍有不同，Java 采用 `static` 加大括号形式，而 C# 采用在构造函数前面加 `static` 来实现

## 5.静态类

**Java 中没有的内容**

可以在类级别使用 `static` 关键字，这样的类是 Top-level 的 **静态类**，具有如下特性：

1. 不能使用 `new` 关键字构建实例
2. 只能拥有 `static` 成员

实际上，就是 Java 中的工具类写法。
