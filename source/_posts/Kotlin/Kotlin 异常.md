---
title: Kotlin 异常
date: 2017-04-08
categories: Kotlin
tags: Kotlin
---

## 1. 概述

和 Java 一样，Kotlin 的异常都继承于 `Throwable` 类。

每个异常都拥有 `message` `stacktrace` 和 `cause`

<!-- more -->## 2. 抛出异常

使用 `throw` 抛出一个异常

```kotlin
throw MyException("Hi There!")
```

> 注意到，没有 `new`

## 3. 捕获异常

使用 `try-catch-finally` 来进行异常捕获和处理。

```kotlin
try {
  // some code
}
catch (e: SomeException) {
  // handler
}
finally {
  // optional finally block
}
```

可以有多个 `catch` 块，`finally` 块是可选的；
但是必须存在至少一个 `catch` 块，否则就必须有 `finally`。

## 4. `try` 表达式

`try` 也可以是一个表达式，也就是说它可以拥有**返回值**

```kotlin
val a: Int? = try { parseInt(input) } catch (e: NumberFormatException) { null }
```

表达式的返回值不是 `try` 块的最后一个值，就是 `catch` 块的最后一个值。
`finally` 块中的语句不会被作为返回值返回。

<!-- more -->## 5. 已检查异常

不像 Java，Kotlin 中**没有已检查异常**；
也就说它不需要也不会在函数头进行 `throws` 声明。

原因在于，如果类似 Java 拥有已检查异常，那么：

```kotlin
Appendable append(CharSequence csq) throws IOException;
```

当我在调用这个方法时，我就必须进行异常捕获（有很多方法内部不允许再次抛出异常）。

```kotlin
try {
  log.append(message)
}
catch (IOException e) {
  // Must be safe
}
```

很多时候，就会写出上面的代码，由于生吞了异常，这是一种非常不好的写法，同时这也违反了《Effective Java》中的条款。

> 《Effective Java》第六十五条：不要忽略异常

同样也有很多关于已检查异常的批评意见
see [here](https://kotlinlang.org/docs/reference/exceptions.html#checked-exceptions)
