---
title: Kotlin 控制流程
date: 2017-04-08
categories: Kotlin
tags: Kotlin
---

## 1. If

Kotlin 中 `if` 语句是一个表达式，**有返回值**，功能和 C++ 和 Java 中的**条件表达式**相同。

所以，Kotlin 中不支持条件表达式，因为 `if` 语句已经具备了这个功能。

```kotlin
// Traditional usage
var max = a if (a < b)
max = b
// With else
var max: Int if (a > b)
max = a
else
max = b
// As expression
val max = if (a > b) a else b
```

同时，`if` 表达式也支持**语句块**，语句块中的**最后一个**变量或常量的值就是语句块的返回值。

```kotlin
val max = if (a > b) { print("Choose a") a
}
else {
    print("Choose b")
b }
```

需要注意的是，**如果 `if` 作为一个表达式（需要其返回值），那么 `else` 语句就必须存在**。

<!-- more -->## 2. When

Kotlin 用 `when` 表达式替代了 Java 和 C++ 中的 `switch` 语句的功能。

一个简单的 `when` 语句如下：

```kotlin
when (x) {
1 -> print("x == 1")
2 -> print("x == 2")
else -> { // Note the block
    print("x is neither 1 nor 2")
  }
}
```

与 `if` 语句一样，`when` 语句也可以作为表达式；当 `when` 作为表达式时，它的返回值是与其 case 相符的值。

同样，`when` 作为表达式时，也可以使用**块语句。**

与 Java 不同的是，`when` 语句可以对于一些不同的 case 进行一些相同的相应，而使用较少的代码量。

```kotlin
when (x) {
    0, 1 -> print("x == 0 or x == 1")
    else -> print("otherwise")
}
```

同时， `when` 语句的 case 可以使用**随意的表达式**，而不是 Java 中的仅能使用常量。

```kotlin
when (x) {
    parseInt(s) -> print("s encodes x")
    else -> print("s does not encode x")
}
```

此外，也可以使用 `in`、`!in`、`is`、`!is` 进行**范围**和**类型**检测。

```kotlin
when (x) {
    in 1..10 -> print("x is in the range")
    in validNumbers -> print("x is valid")
    !in 10..20 -> print("x is outside the range")
    else ->     print("none of the above")
}
```

```kotlin
val hasPrefix = when(x) {
    is String -> x.startsWith("prefix")
    else -> false
}
```

Kotlin 在这里拥有一个非常好的特性叫 **smart casts**，
当一个 `is` 表达式满足时，变量 `x` 将被**自动 cast 到相应的类型，**调用相应类型的方法。

最后，`when` 也可以不接受参数使用，此时，`when` 的各个分支条件就变成了简单的**布尔表达式**，可以用于替代 `if-else-if` 结构。

```kotlin
when {
    x.isOdd() -> print("x is odd")
    x.isEven() -> print("x is even")
    else -> print("x is funny")
}
```

## 3. For

Kotlin 中的 `for` 类似 Python 和 Java 中的 `for-each` 结构，使用 `in` 标识符来分隔 `item` 和 `collection`。

```kotlin
for (item in collection) [}
    print(item)
}
```

如果需要使用一个索引值，则可以使用 `indices`，它内置在 Kotlin 中的所有 `collection` 中。

```kotlin
for (i in array.indices)
    print(array[i]);
```

同时也可以使用 `withIndex()` 方法。

```kotlin
for ((index, value) in array.withIndex())
    print("$index, $value")
```

<!-- more -->## 4. While 和 do-while

这两者和 Java 没有区别。

## 5. 跳转

Kotlin 支持三种形式的跳转：

- `return`：在最近的函数（包括匿名函数）返回
- `break`：跳出当前最近的循环
- `continue`：结束当前最近循环内工作，并从下一次最近循环开始

与 Java 一样，Kotlin 也支持**带标签的跳转**，标签使用 `@` 符号来指定。

```kotlin
loop@ for (i in 1..100) {
    for (j in 1..100) {
        if (...) break@loop
    }
}
```

带标签的 `break` 用于跳出指定的循环结构，而带标签的 `continue` 则用于开始下一次指定的循环。

<!-- more -->## 6. 带标签的 return

不仅如此，Kotlin 还支持带标签的 `return`，这主要是因为 Kotlin 允许**函数的嵌套。**

一个比较普遍的使用场景是在 Lamda 表达式上。

```kotlin
fun foo() {
    ints.forEach {
        if (it == 0) return
        print(it)
    }
}
```

类似如上的语句，`return` 的作用对象是其最近的**函数**，在这里是 `foo()`。

但是如果我们要只从 Lambda 函数中返回(`forEach`)，则需要指定一个标签。

```kotlin
fun foo() {
    ints.forEach lit@ {
        if (it == 0) re turn@lit
        print(it)
    }
}
```

一个更为常用的形式是**直接使用 Lambda 表达式的名字**。

```kotlin
fun foo() {
    ints.forEach {
        if (it == 0) return@forEach
        print(it)
    }
}
```

另外的，我们也可以使用传统的匿名函数，来实现这个功能。

```kotlin
fun foo() {
    ints.forEach(fun(value: Int) {
        if (value == 0) return
        print(value)
    })
}
```

当需要返回某个值时，标签的解析具有更高优先权。

例如：

```kotlin
return@a 1
```

表示在 `a` 标签中返回 `1`，而不是返回 `@a 1`
