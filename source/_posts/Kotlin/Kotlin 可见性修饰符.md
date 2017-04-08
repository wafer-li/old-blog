---
title: Kotlin 可见性修饰符
date: 2017-04-08
categories: Kotlin
tags: Kotlin
---

## 1. 概述

Kotlin 的可见性修饰符和 Java 及 C++ 有比较大的区别。

首先，Kotlin 拥有**四种**可见性修饰符:
`public` `private` `protected` `internal`

**默认的可见性修饰符为 `public`**。

<!-- more -->## 2. 包级别

函数，变量，类都可以在 "top-level" 级别声明，即**直接在包内声明**。

```kotlin
// file name: example.kt
package foo

fun baz() {}
class Bar {}
```

在包级别中的可见性规则如下：

- 如果没有显式指定，那么 `public` 是默认的可见性，即你声明的内容在**任意地方**均可见
- 如果指定了 `private`，那么只有**同文件**可见
- 如果指定了 `internal`，那么只有在**同一个模块**可见
- `protected` 修饰符不支持在包级别使用

例如：

```kotlin
// file name: example.kt
package foo

private fun foo() {} // visible inside example.kt

public var bar: Int = 5 // property is visible everywhere
    private set         // setter is visible only in example.kt

internal val baz = 6    // visible inside the same module
```

## 3. 类级别

当在类或者接口中声明属性或方法时，也同样有可见性的修饰符作用。
此时，规则如下。

- 如果没有显式指定，那么默认为 `public`，此时，内容对**所有能看见这个类的对象**都是可见的
- 如果指定了 `private`，那么只有在类的内部才可见
- 如果指定了 `protected`，那么只在类内部和其子类可见，如果 override 了一个 `protected` 变量，那么 override 后的变量自动具有 `protected` 属性
- 如果指定了 `internal`，那么在模块内可见

> 需要注意的是，不像 Java，
外部类**不能**看见内部类的 `private` 变量。

```kotlin
open class Outer {
    private val a = 1
    protected open val b = 2
    internal val c = 3
    val d = 4  // public by default

    protected class Nested {
        public val e: Int = 5
    }
}

class Subclass : Outer() {
    // a is not visible
    // b, c and d are visible
    // Nested and e are visible

    override val b = 5   // 'b' is protected
}

class Unrelated(o: Outer) {
    // o.a, o.b are not visible
    // o.c and o.d are visible (same module)
    // Outer.Nested is not visible, and Nested::e is not visible either
}
```

<!-- more -->## 4. 构造器

同样的，构造器也可以指定可见性，但是如果可见性被指定了，那么 `constructor` 关键字就必须存在。

```kotlin
class C private constructor(a: Int) { ... }
```

构造器的默认可见性为 `public`，即能看到类，就能看到构造器。

## 5. 关于模块

一个具有 `internal` 可见性的变量，方法，类，函数在其模块内可见。

所谓的模块，更通俗一点来说就是**在一起编译的 Kotlin 文件**，比如说：

- 一个 IntelliJ IDEA module
- 一个 Maven 或者 Gradle 工程
- 一个使用同一个 Ant Task 调用的文件集合
