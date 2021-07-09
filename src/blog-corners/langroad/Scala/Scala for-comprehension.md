---
title: Scala for-comprehension
date: '2017-04-22 14:21'
tags:
  - Scala
category: Scala
---

Scala 作为函数式语言，提供了很多用于高阶函数来解决一类范式问题；

但是，使用过多的高阶函数就会让代码的可读性变差；

所以，对此 Scala 提供了一种类 Python 的简便的语法糖，用来解决代码的可读性问题。

<!-- more -->

## 1. 问题背景

在这里举一个 *Effective Scala* 中的例子：

比如说，我要列出所有不同字母组成的 `pair`，那么该怎么办呢？

如果用 Java 的话，就会有两层 `for`，那么在 Scala 下，我们就应该用到 `flatMap`：

```scala
val chars = 'a' to 'z'

chars flatMap { a =>
    chars flatMap { b =>
        Vector("%c%c".format(a, b))
    }
} filter { s => s.head != s.last }
```

这里用到了两个 `flatMap`，为什么？

首先，如果都使用 `map`，那么内部的 `map` 将元素转变为了 `Vector`；

而 `char` 作为 `Range`，会默认选择 `Vector` 作为 `map` 的选项；

此时， `a` 转换成的东西就变成了 `Vector[Vector[String]]`；

而 `chars` 又会默认生成一层 `Vector`；

所以，最后生成的东西就会有三层 `Vector`，即 `Vector[Vector[Vector(String)]]`；

所以，我们需要两次 `flatten` 进行展平，才能最终得到 `Vector(String)`；

这也是为什么需要两次 `flatMap` 的原因。

可以看到，如果采用 `flatMap`，那么操作就会变得十分难以理解。


## 2. `for-comprehension`

对此，Scala 提供了一种简便的，用于生成 `Seq` 的 `for` 表达式；

通常称为 `for-comprehension`，也称为 `Sequence Comprehension`，或者 `for expression`。

它的语法结构如下：

```scala
for (s) yield e
```

其中，`s` 被称作 `enumerators`，`e` 则是遍历生成的元素；

表达式对于 `s` 有以下几点要求：

1. `s` 是 `generator` 和 `filter` 组成的，以分号间隔的语句序列。

2. `genrator` 的形式为： `p <- c`。

    > 其中 `p` 是一个模式(pattern)，`c`  则是一个集合

3. `filter` 的形式为 `if condition`，其中 `condition` 是个布尔表达式

4. 允许多个 `generator`，但是在下面的 `generator` 必须比在上面的要变化的快。

    > 换成指令性语言的话，就是在下面的 `generator` 必须在更内部的 `for` 循环中。


经过执行之后，这个表达式会返回一个由 `e` 组成的集合；

具体返回的集合类型，例如 `List` 和 `Vector`，则由 `s` 来决定；

如果类型不能满足，则会向类型结构的上一层回溯，直到找到一个最接近的满足要求的类型为止。

同时，`for-comprehension` 可以使用花括号代替圆括号，此时，就不需要用分号来分隔语句了。

## 3. 使用 `for-comprehension` 解决问题

那么，对于上面的问题，我们试着使用 `for-comprehension` 来解决：

```scala
val chars = 'a' to 'z'

for {
    a <- chars
    b <- chars
    if (a != b)
} yield "%c%c".format(a, b)
```

可以看到，使用 `for-comprehension` 来解决，写出来的代码会比 `flatMap` 简单得多。

## 4. 关于返回类型

对于上面的表达式，它的返回类型是什么呢？

实际上，是一个 `Vector`。

为什么是一个 `Vector` ？

这是因为，`chars` 实际上是一个 `Range` 对象；

而对于 `Range` 对象，它不能拥有一堆 `String`；

此时，Scala 编译器会在类型结构中向上寻找最近的满足条件的类型；

此时，寻找到的是 `IndexedSeq`，而这个类型的默认 `Seq` 实现就是 `Vector`
