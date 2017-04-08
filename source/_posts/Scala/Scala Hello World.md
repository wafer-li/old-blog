---
title: Scala Hello World
date: 2017-04-08
categories: Scala
tags: Scala
---

## 1. 简介

Scala 既可以使用交互式命令行来编程，也可以将其写成一个独立的程序；

其中，关于构建独立程序的写法一共有两种。

<!-- more -->## 2. `main()` 方法

使用 `main()` 方法是通常各种语言的程序入口，Scala 也不例外：

```scala
def main(args: Array[String]) {
    println("Hello, World!")
}
```

## 3. 使用 `Application` 特质

```scala
object Hello extends Application {
    println("Hello, World!")
}
```
