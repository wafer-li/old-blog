---
title: Kotlin 内部类
date: 2017-04-08
categories: Kotlin
tags: Kotlin
---

## 1. 声明

```kotlin
class Outer {
  private val bar: Int = 1
  class Nested {
    fun foo() = 2
  }
}

val demo = Outer.Nested().foo() // == 2
```

<!-- more -->## 2. `inner` 关键字

需要使用 `inner` 关键字来指明一个内部类**允许访问外部类属性。**

```kotlin
class Outer {
  private val bar: Int = 1
  inner class Inner {
    fun foo() = bar
  }
}

val demo = Outer().Inner().foo() // == 1
```

## 3. 获取外部类实例

通过使用[带标签的 `this`](https://kotlinlang.org/docs/reference/this-expressions.html) 可以获取外部类实例。

## 4. 匿名内部类

Kotlin 没有 Java 中的匿名类，反之，Kotlin 使用**对象表达式(object expression)**来实现这一功能。

```kotlin
window.addMouseListener(object: MouseAdapter() {
  override fun mouseClicked(e: MouseEvent) {
    // ...
  }

  override fun mouseEntered(e: MouseEvent) {
    // ...
  }
})
```

如果内部类对应的接口只有一个方法，那么也可以使用 lambda 表达式来创建这个内部类。

```kotlin
val listener = ActionListener { println("clicked") }
```
