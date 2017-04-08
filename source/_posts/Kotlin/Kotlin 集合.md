---
title: Kotlin 集合
date: 2017-04-08
categories: Kotlin
tags: Kotlin
---

## 1. 概述

和许多其他语言不同的是， Kotlin 将集合分成了**可变**和**不可变**两大类。

理解和区分可变集合和不可变集合是很重要的，Kotlin 致力于尽量将事务显式化，所以 Kotlin 对这两种集合进行了区分。

<!-- more -->## 2. 与 Java 的区别

与 Java 相比的很大的不同点在于，Kotlin 的 `List` 是 `List<out T> `，而不是 `List<T>`，也就是说 Kotlin 的 `List` 是只读的，而对应的 `MutableList<T>` 才是可写的。

其他的集合类型如 `Set`、`Map` 同样继承了这个特点。

```kotlin
val numbers: MutableList<Int> = mutableListOf(1, 2, 3)
val readOnlyView: List<Int> = numbers
println(numbers)        // prints "[1, 2, 3]"
numbers.add(4)
println(readOnlyView)   // prints "[1, 2, 3, 4]"
readOnlyView.clear()    // -> does not compile

val strings = hashSetOf("a", "b", "c", "c")
assert(strings.size == 3)
```

## 3. 创建

Kotlin 没有专门的语法或者构造器来构建一个集合类型；反之，Kotlin 使用标准库中的方法对集合类型进行构建，比如说  `listOf()` `mutableListOf()` `setOf()` `mutableSetOf()`

需要注意的是，上面的 `readOnlyView` 引用指向的是**同一个列表**，如果一个列表只有一个引用指向它，而且该引用是不可变类型的话，那么这个列表就是**不可变的**。

> 也就说一个不可变的集合可以接受一个可变集合的引用


生成这样的一个列表的简易方法是：

```kotlin
val items = listOf(1, 2, 3)
```

> 目前，`listOf()` 方法返回的是一个 array list，以后可能会采用更为节省内存的实现方法。


需要注意的是，不可变集合是**协变的**，也就是说一个 `List<Shape>` 可以接受一个 `List<Rectangle>` 变量，如果 `Rectangle` 是继承于 `Shape` 的话。

相反，可变类型的集合没有这个特性。

<!-- more -->## 4. 返回一个只读列表的快照

有时候，虽然类中的列表在不断变动，但是你只想给调用者呈现一个**某时刻的只读列表**，可以使用如下方法

```kotlin
class Controller {
    private val _items = mutableListOf<String>()
    val items: List<String> get() = _items.toList()
}
```

`toList()` 方法只是简单的复制了列表中的元素，而且保证它是只读的，这样调用者就可以得到调用时列表的状态，而且是只读的。

## 5. 其他有用的方法

列表类中还拥有其他十分有用的扩展方法。

```kotlin
val items = listOf(1, 2, 3, 4)
items.first() == 1
items.last() == 4
items.filter { it % 2 == 0 }   // returns [2, 4]

val rwList = mutableListOf(1, 2, 3)
rwList.requireNoNulls()        // returns [1, 2, 3]
if (rwList.none { it > 6 }) println("No items above 6")  // prints "No items above 6"
val item = rwList.firstOrNull()
```

同样，`Map` 也继承了这个特点

```kotlin
val readWriteMap = hashMapOf("foo" to 1, "bar" to 2)
println(readWriteMap["foo"])  // prints "1"
val snapshot: Map<String, Int> = HashMap(readWriteMap)
```
