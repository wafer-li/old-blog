---
title: C# Properties and Fields
date: 2017-04-08
categories: CSharp
tags: CSharp
---

## 1. 概述

C# 相对于 Java 的一个较大的改进就是提供了类的 **属性访问** 语法。

在这里，将和 Kotlin 来比较学习。


<!-- more -->

## 2. 定义属性

这是 C# 和 Kotlin 的第一个不同，

C# 的普通属性需要 **自定义后备字段(backing field)**；

而 Kotlin 不允许字段，只在 getter 和 setter 中使用 `field` 来指代字段。

```csharp
// C#
class Point {
    private int x;

    public X {
        get {
            return x;
        }
        set {
            x = value;
        }
    }
}
```

注意上面的 `value` 指代的是传入 setter 的值

而与之相反的是，Kotlin 允许 setter 使用括号来进行传入参数命名

```kotlin
class Point {
    var x: Int = 0
        get() = field
        set(value) {
            field = value
        }
}
```

## 3. 静态属性

Kotlin 实际上没有这个语法，只能使用伴生对象来实现。

C# 支持静态属性，不过只能应用于静态字段。

```csharp
class Bank {
    private static int interest;

    public static Interest {
        get { return interest; }
        set { interest = value; }
    }
}
```

## 4. 自动属性

如果一个属性不包括具体逻辑，只负责简单获取返回，那么定义一大堆私有后备字段是极其不方便的，所以 C# 提供了 **自动属性**，使用一个 **私有的后备字段** 和 简单的 getter 和 setter。

```csharp
class Point {
    public X {
        get;
        set;
    }

    public Y {
        get;
        set;
    }
}
```

由于后备字段不可见，所以整个类都必须使用 **属性** 来进行操作，而不能直接操作字段。

> 这点和 Kotlin 的行为很像

有一点需要注意的地方，自动属性会使用默认值来填充私有后备属性；

这说明任何 **引用类型** 默认为 `null`，使用时需要注意。

在 C# 6.0 后可以对自动属性进行初始化

```csharp
public double X {get; set;} = 1.0
```

## 5. 只读只写属性

**忽略**属性中对应的 `set` 或者 `get` 可以让属性成为 **只读只写属性**

当进行写入操作时，编译器会报错。

> 而 Kotlin 使用 `var` 和 `val` 来区分可读可写，如果需要做严格限制，可以将 getter 或者 setter 设置为私有
