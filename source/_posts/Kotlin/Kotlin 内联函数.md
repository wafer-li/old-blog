---
title: Kotlin 内联函数
date: 2017-04-08
categories: Kotlin
tags: Kotlin
---

## 1. 概述

使用 lambda 和高阶函数固然方便，但是由于需要生成函数对象和进行闭包操作，这也造成了一些不必要的内存和时间开销。

但是一般情况下，我们可以通过将函数和 Lambda 表达式内联化进行开销的减免。

> 内联函数指的是将整个函数直接替换为函数实际代码的技术，它可以减少函数调用时由于跳转产生的开销浪费。

<!-- more -->## 2. Kotlin 内联语法

例如 `lock()` 函数，它可以很方便的在调用点进行内联化操作：

```kotlin
lock(l) { foo() }
```

通过这种写法，编译器并没有为 lambda 表达式创建一个函数对象，而是生成了如下代码：

```kotlin
l.lock()
try {
  foo()
}
finally {
  l.unlock()
}
```

为了让编译器进行这种操作，我们可以给函数使用 `inline` 修饰符。

```kotlin
inline fun lock<T>(lock: Lock, body: () -> T): T {
  // ...
}
```

注意，`inline` 修饰符会对整个函数和其 lambda 表达式都有效，即整个函数和 lambda 都被替换成实际代码。

```kotlin
//  内联函数
inline fun <T> inlineLock(lock: Lock, body: () -> T): T {
    lock.lock()
    try {
        return body()
    } finally {
        lock.unlock()
    }
}

//  普通函数
fun echo() = println("foo")
```

调用该内联函数：

```kotlin
val lock = ReentrantLock()
inlineLock(lock, { echo() })
```

以上代码会被编译为如下代码：

```kotlin
val lock = ReentrantLock()
lock.lock()
try {
    println("foo")
} finally {
    lock.unlock()
}
```

函数内联技术会导致代码体积膨胀，为了减少代码体积膨胀，不要内联大体积的函数。

## 3. Noinline

有时候我们只希望对函数本身进行内联化操作，而对其 lambda 参数不使用内联。

此时我们可以对参数使用 `noinline` 标识符

```kotlin
inline fun foo(inlined: () -> Unit, noinline notInlined: () -> Unit) {
  // ...
}
```

内联的 lambda 只能在内联函数内部调用，或者作为一个 `inline` 参数传给内联函数；
但是非内联的 labmda 可以储存在变量中，或者传递它。

<!-- more -->## 4. 非局部返回

普通的 `return` 默认返回的函数是**最近的 `fun` 所定义的函数**，这叫做局部返回(local return)

所以，由于在 lambda 表达式内部不能让外部函数返回，所以在 lambda 表达式中使用 `return` 是被禁止的。

```kotlin
fun foo() {
  ordinaryFunction {
     return // ERROR: can not make `foo` return here
  }
}
```

但是内联函数由于使用定义替代了调用，所以在其中使用 `return` 是可以的。

```kotlin
fun foo() {
  inlineFunction {
    return // OK: the lambda is inlined
  }
}
```

这个例子中，`return` 会让 `foo()` 返回。

这种返回方式被称作非局部返回。
这种特性十分有效，所以被内建在标准的循环中

```kotlin
fun hasZeros(ints: List<Int>): Boolean {
  ints.forEach {
    if (it == 0) return true // returns from hasZeros
  }
  return false
}
```

有时候，在调用处传入的 lambda 可能并不会被立即执行，而是传入到另一个线程中，或者另一个本地对象或本地方法中，此时，非本地返回同样会被禁止。

为了提示编译器，我们使用 `crossinline` 标识符来指明当前的函数对象会在一个内嵌的函数或者对象，或是在另一个线程中执行。

```kotlin
inline fun f(crossinline body: () -> Unit) {
    val f = object: Runnable {
        override fun run() = body()
    }
    // ...
}
```

`break` 和 `continue` 尚未写入支持，但是 Kotlin 开发组预计会在未来实现这两个功能。

## 5. 类型参数

有时候我们希望访问一个对象的类型参数，例如 `Class`，在 Java 中，这通常是通过**反射机制**来实现的。

```kotlin
fun <T> TreeNode.findParentOfType(clazz: Class<T>): T? {
    var p = parent
    while (p != null && !clazz.isInstance(p)) {
        p = p.parent
    }
    @Suppress("UNCHECKED_CAST")
    return p as T
}
```

调用这个函数：

```kotlin
val root = DefaultMutableTreeNode("root")
val node1 = DefaultMutableTreeNode("node1")
val node1_1 = DefaultMutableTreeNode("node1_1")
val node2 = DefaultMutableTreeNode("node2")
node1.add(node1_1)
root.add(node1)
root.add(node2)

var parent = node1_1.findParentOfType(DefaultMutableTreeNode::class.java)
println(parent) //  node1
```

可以看到由于依赖于反射，所以在函数体内不但要处理未检查类型转换的警告也很难处理具体类型的信息。

而内联函数由于是复制到调用处，所以实际在运行时无需依赖反射，可以直接得到真实类型。
要开启此功能，只需在泛型参数前加上 `reified` 关键字。

```kotlin
inline fun <reified T> TreeNode.inlineFindParentOfType(): T? {
    var p = parent
    while (p != null && p !is T) {
        p = p.parent
    }
    return p as T
}
```

调用该函数

```kotlin
val parent = node1_1.inlineFindParentOfType<DefaultMutableTreeNode>()
println(parent) //  node1
```

非内联的函数不能使用 `reified` 标识符。
一个不具备运行时表示类型的类型（比如一个没有 reified 的类型参数，或者是一个虚拟的类型，如 `Nothing`），不能当做 `reified` 函数参数使用。
