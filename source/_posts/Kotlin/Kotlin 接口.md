---
title: Kotlin 接口
date: 2017-04-08
categories: Kotlin
tags: Kotlin
---

## 1. 基本形式

Kotlin 的接口和 Java 8 中很相似。

```kotlin
interface MyInterface {
    fun bar()
    fun foo() {
      // optional body
    }
}
```

<!-- more -->## 2. 实现接口

和类继承一样，使用同样的语法进行接口的实现

```kotlin
class Child : MyInterface {
   override fun bar() {
      // body
   }
}
```

## 3. 声明属性

在接口中可以声明属性。
需要注意的是，接口中的属性不具备 **backing field**，所以**不能进行初始化**。

接口中的属性可以是 `abstract` 的，或者提供一个自定义 getter。

```kotlin
interface MyInterface {
    val property: Int // abstract

    val propertyWithImplementation: String
        get() = "foo"

    fun foo() {
        print(property)
    }
}

class Child : MyInterface {
    override val property: Int = 29
}
```

## 4. 解决冲突

和类继承一样，如果实现的多个接口方法出现冲突，就必须赋予 `override` 属性进行重载。

```kotlin
interface A {
  fun foo() { print("A") }
  fun bar()
}

interface B {
  fun foo() { print("B") }
  fun bar() { print("bar") }
}

class C : A {
  override fun bar() { print("bar") }
}

class D : A, B {
  override fun foo() {
    super<A>.foo()
    super<B>.foo()
  }
}
```

在这里，D 不需要 override `bar()`，
这是因为 D 同时实现了 A，B，
而 B 中对 `bar()` 方法进行了实现，同时 `bar()` 的实现中没有冲突。
