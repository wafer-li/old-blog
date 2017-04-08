---
title: C# 分部类
date: 2017-04-08
categories: CSharp
tags: CSharp
---

当开发大型项目时，会出现某个类非常长的情况。

C# 对此提供了一个 `partial` 关键字；

可以用它将一个类分割成多个文件，以期分隔经常改动的内容和不经常改动的内容。

<!-- more -->

例如 `Empolyee.cs` ：

```csharp
class Employee
{
    // 字段

    // 构造函数

    // 方法

    // 属性
}
```


可以将其分割为两个文件，然后使用 `partial` 进行标记。

```csharp
// Employee.cs

partial class Employee
{
    // 方法

    // 属性
}
```

```csharp
// Employee.Internal.cs
partial class Employee
{
    // 字段

    // 构造函数
}
```

需要注意的是，文件的名字是可以随便取的，并没有特别的限制。
