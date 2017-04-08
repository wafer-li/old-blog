---
title: C# Visibility Modifiers
date: 2017-04-08
categories: CSharp
tags: CSharp
---

## 1. 概述

C# 的访问修饰符比 Java 多了两个 `internal` 和 `protected internal`

默认行为也不同


<!-- more -->

## 1. Internal

C# 新增的 `internal` 访问修饰符，指的是，该类型的可见范围为 **当前程序集**(即 `.dll` 和 `.exe` 中)

> 注意和 Java 的 package 级别的可见性区分，`internal` 指示的是整个程序集的可见性。

## 2. Protected Internal

`protected internal` 实际上是 `protected` 和 `internal` 的一个 `union`。

它指示的是，该类型在当前程序集可见 **或者** 在其他程序集中的派生类可见

## 3. 修饰限制

Top-level 的类型只能使用 `public` 和 `internal` 来修饰，如普通的类。

嵌套类、嵌套的数据结构可以使用其他的修饰符。
