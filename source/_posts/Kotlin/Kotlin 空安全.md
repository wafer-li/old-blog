---
title: Kotlin 空安全
date: 2017-04-08
categories: Kotlin
tags: Kotlin
---

## 1. 概述

Kotlin 对于 Java 的一个很大的改进在于，Kotlin 的类型系统目标在于要**消除 `NullPointerException`**或者 NPE。

所以 Kotlin 提供了一个健壮的 Null 检查系统。

<!-- more -->## 2. 产生 NPE 的原因

可能产生 NPE 的原因如下：

- 显式调用 `throw NullPointerException()`
- 使用 `!!` 操作符
- Java 代码造成的
- 一些前后矛盾的初始化（在构造函数中没有初始化的 `this` 在其他地方使用）

## 3. Kotlin 类型系统

在 Kotlin 中，类型系统将变量引用分成了**两种类型**：可以为 `null` 的类型（nullable），和不能为 `null` 的类型（non-null）

```kotlin
var a: String = "abc"
a = null // compilation error
```

在类型后添加一个问号(`?`)来表明它是可以为空的。

```kotlin
var b: String? = "abc"
b = null // ok
```

此时，对于 `a`，由于它不会产生 NPE，你可以安全的访问它的成员。

```kotlin
val l = a.length
```

但是对于 `b`，由于它可能为空，所以直接访问它，编译器会报错

```kotlin
val l = b.length // error: variable 'b' can be null
```

但是我们依旧需要访问 `b` 啊！


<!-- more -->## 4. 访问可能为空变量的方法

下面就介绍几种方法来进行 `b` 的安全访问。

### 4.1 显式检查

首先你可以直接对 `b` 进行空检查

```kotlin
val l = if (b != null) b.length else -1
```

由于 Kotlin 具有智能造型特性，还可以直接在 `if` 语句中访问 `b` 的成员。

```kotlin
if (b != null && b.length > 0)
  print("String of length ${b.length}")
else
  print("Empty string")
```

当然，这只适用于当 `b` 符合智能造型条件的情景，否则，`b` 有可能在检查之后再次变为空。

### 4.2 使用安全访问

第二个方法是采用安全访问操作符(`?.`)，即在点号(`.`)前加一个问号(`?`)

```kotlin
b?.length
```

这个表达式当 `b` 不为空时返回 `b.length`；
当 `b` 为空时，返回 `null`。

表达式的返回结果是 `Int?`

安全访问在链式操作中很有用。
比如说，`bob` 是一个 `Employee`，他有可能被派往一个 `Department`，这个部门也许会存在一个主管。
那么我们通过以下调用链来获取 `bob` 所在部门主管的名字。

```kotlin
bob?.department?.head?.name
```

当调用链上的任何一个值为 `null` 时，表达式的返回值都为 `null`。

如果你想对集合中的非空元素进行某种操作，可以结合安全访问和 `let()`

```kotlin
val listWithNulls: List<String?> = listOf("A", null)
for (item in listWithNulls) {
     item?.let { println(it) } // prints A and ignores null
}
```

> `let` 操作接受一个 lambda 表达式，并返回 lambda 表达式的值。[源代码](https://github.com/JetBrains/kotlin/blob/1.0.3/libraries/stdlib/src/kotlin/util/Standard.kt#L55)


<!-- more -->### 4.3 Elvis 表达式

如果对于一个引用 `r`，我们需要：
当 `r` 不为空时，使用它；否则我们就使用一个其他的值(`x`)

我们可以使用如下的语句：

```kotlin
val l: Int = if (b != null) b.length else -1
```

一个更为简单的方法是使用 Elvis 表达式(`?:`)

```kotlin
val l = b?.length ?: -1
```

如果在 `?:` 的左边的值不为空，那么 Elvis 操作符就返回这个值，否则就返回右边的值。

与 Java 中的条件操作符不同的是，只有当 `?:` 的左边的值**为空**时，才会执行右边的语句；
所以这个操作符不能像条件操作符一样执行一般的判断。

> 想要实现条件操作符的功能，请使用单行的 `if-else` 表达式。

### 4.4 `!!` 操作符

第三个方法是给 NPE 爱好者们使用的，我们可以使用 `b!!`，使用它来进行调用，结果就会和 Java 一样，会抛出 NPE。

```kotlin
val l = b!!.length
```

也就是说，如果你需要 NPE，就使用这个操作符。

<!-- more -->## 5. 安全的造型

一般的造型 `as` 在对象不相符的时候，会产生一个 `ClassCastException`。

一个更好的选择是使用 `as?`，一种更为安全的造型，当造型失败时，将会返回 `null`

```kotlin
val aInt: Int? = a as? Int  // return null if failure
```

## 6. 空类型的集合

如果你拥有一个可空类型的集合，想要过滤出非空类型。只需要写如下语句：

```kotlin
val nullableList: List<Int?> = listOf(1, 2, null, 4)
val intList: List<Int> = nullableList.filterNotNull() // non-null
```
