---
title: Kotlin `this` 表达式
date: 2017-04-08
categories: Kotlin
tags: Kotlin
---

Tags: Kotlin


---

Kotlin 提供了一个 `this` 表达式，主要就是一个带标签的 `this`，用于在内部类、扩展中获取正确的类对象实例。

```kotlin
class A { // implicit label @A
  inner class B { // implicit label @B
    fun Int.foo() { // implicit label @foo
      val a = this@A // A's this
      val b = this@B // B's this

      val c = this // foo()'s receiver, an Int
      val c1 = this@foo // foo()'s receiver, an Int

      val funLit = lambda@ fun String.() {
        val d = this // funLit's receiver
      }


      val funLit2 = { s: String ->
        // foo()'s receiver, since enclosing lambda expression
        // doesn't have any receiver
        val d1 = this
      }
    }
  }
}
```
