---
title: Kotlin 范围
date: 2017-04-08
categories: Kotlin
tags: Kotlin
---

## 1. 概述

虽然 Kotlin 支持了简单易用的 `foreach` 语法，但是，有些时候也有必要获取下标，并显式的限定其范围，或者你需要判定一个值是否在一个范围内。

Kotlin 对此支持 Range 语法，它就是简单的使用 `..` 来表示范围，并且支持使用 `in` 和 `!in` 来进行判定；以及 `for` 进行遍历。

<!-- more -->## 2. 判定

```kotlin
if (i in 1..10) { // equivalent of 1 <= i && i <= 10
  println(i)
}
```

## 3. 遍历

对于标准库中的范围（`IntRange` `LongRange` `CharRange`），Kotlin 支持遍历操作。

```kotlin
for (i in 1..4) print(i) // prints "1234"

for (i in 4..1) print(i) // prints nothing
```

上面的第二种写法不会打印出值，但是，如果你需要逆序遍历也很简单，只需要使用 `downTo()` 方法即可。

```kotlin
for (i in 4 downTo 1) print(i) // prints "4321"
```

如果需要定义步长，使用 `step()` 方法

```kotlin
for (i in 1..4 step 2) print(i) // prints "13"

for (i in 4 downTo 1 step 2) print(i) // prints "42"
```

## 4. 原理

范围需要实现一个 `ClosedRange<T>` 接口。

`ClosedRange<T>` 代表着一个**闭区间**，
它有两个变量 `start` 和 `endInclusive`，分别代表着区间的两端。
它主要的方法是 `contains()` 一般应用在 `in` 和 `!in` 的范围检查中。

对于步长和逆序方法，它们主要是通过 `*Progression` 来实现的；
目前 Kotlin 拥有 `IntProgression`, `LongProgression`, `CharProgression`

`Progresssion` 接受三个参数，`first` 、`last` 和一个非零的 `increment`。

`Progression` 主要实现了 `Iterable<N>` 接口，进行遍历的操作和以下的 Java 代码类似

```kotlin
for (int i = first; i != last; i += increment) {
  // ...
}
```

`Progression` 类主要通过以下方法进行构建

```kotlin
IntProgression.fromClosedRange(start, end, increment)
```

注意 `increment` 不能是**负的**，也就是说不允许出现

```kotlin
(last - first) % increment == 0
```

## 5. 其他有用的方法

除了上面介绍的有用的方法外，还有一些比较有用的方法。

<!-- more -->### 5.1 `reversed()`

很简单，用于反转整个流程。

```kotlin
fun IntProgression.reversed(): IntProgression {
  return IntProgression.fromClosedRange(last, first, -increment)
}
```
