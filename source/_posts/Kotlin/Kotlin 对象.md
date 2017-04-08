---
title: Kotlin 对象
date: 2017-04-08
categories: Kotlin
tags: Kotlin
---

## 1. 概述

Kotlin 提供了一个 Object 属性用来实现在 Java 中很常见的三个功能：

- 匿名类对象
- 单例模式(Singleton)
- 静态类成员

它们分别被称为 **对象表达式**，**对象声明**，**companion object**

<!-- more -->## 2. 对象表达式

Kotlin 使用 对象表达式 来实现 Java 中常用的匿名类对象功能。

```kotlin
window.addMouseListener(object : MouseAdapter() {
  override fun mouseClicked(e: MouseEvent) {
    // ...
  }

  override fun mouseEntered(e: MouseEvent) {
    // ...
  }
})
```

如果类拥有一个构造器，那么就必须传入相应的参数

```kotlin
open class A(x: Int) {
  public open val y: Int = x
}

interface B {...}

val ab: A = object : A(1), B {
  override val y = 15
}
```

当然，我们也可以**只声明一个 object**

```kotlin
val adHoc = object {
  var x: Int = 0
  var y: Int = 0
}
print(adHoc.x + adHoc.y)
```

和 Java 的匿名类一样，对象表达式 也可以访问外部的变量，但和 Java 不同的是，变量**并没有要求必须是 `final`**

```kotlin
fun countClicks(window: JComponent) {
  var clickCount = 0
  var enterCount = 0

  window.addMouseListener(object : MouseAdapter() {
    override fun mouseClicked(e: MouseEvent) {
      clickCount++
    }

    override fun mouseEntered(e: MouseEvent) {
      enterCount++
    }
  })
  // ...
}
```

## 3. 对象声明

Kotlin 使用 对象声明 来实现 Java 中常用的**单例模式**

```kotlin
object DataProviderManager {
  fun registerDataProvider(provider: DataProvider) {
    // ...
  }

  val allDataProviders: Collection<DataProvider>
    get() = // ...
}
```

这虽然和 对象表达式 很相似，但是要注意的是 object 关键字后面跟一个名字后，我们不能再叫它表达式，也不能给他赋值，但是可以通过它的名字访问它。

调用 object

```kotlin
DataProviderManager.registerDataProvider(...)
```

对象声明 可以拥有超类。

```kotlin
object DefaultListener : MouseAdapter() {
  override fun mouseClicked(e: MouseEvent) {
    // ...
  }

  override fun mouseEntered(e: MouseEvent) {
    // ...
  }
}
```

同时， 对象声明 不能是局部变量，比如直接嵌套在一个方法里，但是可以嵌套在其他的对象声明或者非内部类里面。

## 4. 伴生对象(companion object)

这个在类的章节中也有所介绍，用于实现 Java 的静态成员功能。

使用 `companion` 关键字来声明一个伴生对象
```kotlin
class MyClass {
  companion object Factory {
    fun create(): MyClass = MyClass()
  }
}
```

伴生对象的成员可以直接使用其名字来调用

```kotlin
val instance = MyClass.create()
```

我们也可以调用伴生对象本身，通过使用 `Companion`

```kotlin
val x = MyClass.Companion
```

> 由于没有名字区分，一个类**只能拥有一个伴生对象**

虽然说伴生对象看起来是静态的，但是在实际执行过程中，它依旧会实例化，所以它也可以拥有超类和重载方法。

```kotlin
interface Factory<T> {
  fun create(): T
}


class MyClass {
  companion object : Factory<MyClass> {
    override fun create(): MyClass = MyClass()
  }
}
```

> 当然，你也可以让 JVM 将伴生对象真正的**静态化**，使用 `@JvmStatic` 注解即可。

## 5. 对象表达式 和 对象声明 的不同点

- 当 对象表达式 被声明时，它将会被立即执行。
- 而 对象声明 会被延迟初始化，它将会在第一次调用它的时候进行初始化，而不是声明它的时候。
- 伴生对象会在对应的类第一次被加载之后使用 java 的静态初始化器生成
