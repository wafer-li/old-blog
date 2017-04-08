---
title: C# Const and Readonly Field
date: 2017-04-08
categories: CSharp
tags: CSharp
---

## 1. 概述

C# 提供了两种 **常量级别** 数据，相当于 Kotlin 中的 `const` 和 `lazy value`；

使用 `const` 和 `readonly` 来进行修饰


<!-- more -->

## 2. Const

`const` 类型是 **编译时常量**。

`const` 必须被初始化！

与 Kotlin 不同的是 C# 中的 `const` 除了字面常量以外，还允许使用 `null` 应用。

除此之外，C# 的 `const` 还允许在局部作用域使用，而 Kotlin 的 `const` 只允许在 Top-level 使用

## 3. Readonly Field

只读字段是一种特殊的 `lazy` 常量。

和 Kotlin 的 `lazy-value` 不同的是：

1. 只读字段可以不被初始化


2. 只读字段 **只能被显式初始化，或者构造函数初始化**


3. 如果不被初始化，那么显式字段拥有默认值


<!-- more -->

## 4. 两者区别

C# 中 `const` 和 `readonly` 的主要区别在于：

`const` 是 **隐式静态的**，即可以直接通过类名来调用 `const`

而 `readonly` **不是隐式静态的**。
