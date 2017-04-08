---
title: C# Object Initialization
date: 2017-04-08
categories: CSharp
tags: CSharp
---

## 1. 概述

为了简化对象初始化的流程，C# 提供了 **对象初始化语法**。

简单的来说就是通过类似 **数组初始化** 的方法来对变量进行初始化操作。


<!-- more -->

## 2. 语法

```csharp
Point p = new Point {x = 1.0, y = 2.0};
```

## 3. 原理

此语法实际上是一个语法糖，其原理就是先调用 **默认构造函数**，然后再对每个属性或者字段 **依次赋值**。

和以下代码行为相同。

```csharp
Point point = new Point();
point.x = 1.0;
point.y = 2.0;
```

## 4. 调用自定义构造函数

对象初始化块除了调用默认的构造函数以外，还可以调用自定义的构造函数。

```csharp
Point point = new Point("This is a point") {x = 1.0, y = 2.0};
```

## 5. 初始化内部引用属性

由于自动属性默认为引用类型赋值为 `null` ，所以内部的属性必须经过正确的初始化之后才能使用。

为了简化繁琐的声明语句， C# 也提供了对内部引用属性的初始化语法

```csharp
Rectangle rect = new Rectangle
{
    TopLeft = new Point { X = 10, Y = 10 },     // 注意逗号
    BottomRight = new Point { X = 200, Y = 200 }
};  // 注意分号
```

其行为和如下代码相同：

```csharp
Rectangle rect = new Rectangle();

Point p1 = new Point();
p1.X = 10;
p1.Y = 10;
rect.TopLeft = p1;

Point p2 = new Point();
p2.X = 200;
p2.Y = 200;
rect.BottomRight = p2;
```
