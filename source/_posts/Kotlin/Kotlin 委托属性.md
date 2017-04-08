---
title: Kotlin 委托属性
date: 2017-04-08
categories: Kotlin
tags: Kotlin
---

## 1. 使用场景

有些时候，对于一些特殊的变量，虽然我们每次都去手动生成它们，但是如果一次性生成它们，然后存进库中会更加方便，例如：

- lazy 属性：只在第一次访问它们的时候计算它们。
- observable 属性：当它被修改的时候，会通知它的监听者。
- 将属性储存在一个 Map 中，而不是用字段存储。

对于这些使用场景，Kotlin 支持使用**委托属性**

<!-- more -->## 2. 声明

```kotlin
class Example {
  var p: String by Delegate()
}
```

声明委托属性的语法为：`val/var <property name>: <Type> by <expression>`。

其中，在 `by` 之后的表达式就是**委托操作**。

上面的例子说明了 `p` 变量的操作将会委托给 `Delegate` 类来进行。

为了替代 `p` 的 getter 和 setter，`Delegate` 类必须提供 `getValue()` 和 `setValue()` 方法，委托之后，对 `p` 的调用操作**将会由这两个方法来完成**。

```kotlin
class Delegate {
  operator fun getValue(thisRef: Any?, property: KProperty<*>): String {
    return "$thisRef, thank you for delegating '${property.name}' to me!"
  }

  operator fun setValue(thisRef: Any?, property: KProperty<*>, value: String) {
    println("$value has been assigned to '${property.name} in $thisRef.'")
  }
}
```

那么当我们进行如下调用：

```kotlin
val e = Example()
println(e.p)
```

打印结果为

```kotlin
Example@33a17727, thank you for delegating ‘p’ to me!
```

同理，进行如下操作

```kotlin
e.p = "NEW"
```

将会打印如下结果：

```kotlin
NEW has been assigned to ‘p’ in Example@33a17727.
```

## 3. 需要满足的条件

对于只读属性(`val`)，被委派的类必须提供 `getValue()` 方法，该方法必须拥有如下参数

- 接收者：必须是**当前属性的拥有者**（属性所属的类）或者其**超类**的实例对象。
- 元数据：必须是 `KProperty<*>` 或者它的超类

`getValue()` 必须拥有返回值，而且类型与当前委托的属性类型相同。

对于可变属性(`var`)，被委托的类必须**额外提供**一个 `setValue()` 方法，该方法必须拥有如下参数：

- 接收者：和 `getValue()` 相同
- 元数据：和 `getValue()` 相同
- 新值：其类型必须和所委托的类型相同，或者是它的超类。


`getValue()` 和 `setValue()` 方法既可以是被委托类的成员，也可以是它的**扩展**。

**两个方法都需要使用 `operator` 来修饰。**

## 4. 一般的委托场景

Kotlin 的标准库提供了一些工厂方法，用来实现篇头所说的几种场景。

<!-- more -->### 4.1 lazy 变量

Kotlin 提供了一个 `lazy()` 方法用于 lazy 变量的生成。

`lazy()` 方法接受一个 lambda 表达式，返回一个 `Lazy<T>` 实例，用于委托属性。

```kotlin
val lazyValue: String by lazy {
    println("computed!")
    "Hello"
}

fun main(args: Array<String>) {
    println(lazyValue)
    println(lazyValue)
}
```

`main` 中的第一个调用会**触发 `lazy()`**进行 `lazyValue` 的计算，而第二个调用只会返回 `lazyValue` 的值。

结果为

```kotlin
computed!
Hello
Hello
```

默认情况下，`lazy()` 的调用是**同步的**。也就是说，只有一个线程会进行变量的计算，完成后，所有的线程都能看到其结果。

如果不需要初始化同步，那么可以通过将 `LazyThreadSafetyMode.PUBLICATION` 作为参数传给 `lazy()` 方法来实现。

如果确保变量的初始化只会有一个线程来完成，那么可以将 `LazyThreadSafetyMode.NONE` 作为参数传给 `lazy()`，这样一来，Kotlin 就不会对该变量的生成启用线程安全机制。

### 4.2 Observable

Kotlin 标准库用 `Delegates.observable()` 来实现可观察属性(observable property)。

```kotlin
import kotlin.properties.Delegates

class User {
    var name: String by Delegates.observable("<no name>") {
        prop, old, new ->
        println("$old -> $new")
    }
}

fun main(args: Array<String>) {
    val user = User()
    user.name = "first"
    user.name = "second"
}
```

`Delegates.observable()` 接受两个参数：一个是**初始化值**，另一个是 handler。

Handler 会在每次我们对变量进行**赋值操作后**被调用。
它具有三个参数：

- 被赋值的变量
- 旧的变量值
- 新的变量值

上面的例子的打印结果为：

```kotlin
<no name> -> first
first -> second
```

使用 `vetoable()` 代替 `observable()` 方法可以对变量赋值进行**拦截操作**。

`vetoable()` 的 handler 会在每次**赋值操作前**被调用。

### 4.3 在 Map 中储存属性

这个场景通常在进行 JSON 解析或者对其他数据进行动态解析时常用的。

对于 JSON 数据，我们通常将其解析为一个 Map，所以，我们可以通过对 Map 进行委派，从而实现反序列化操作。

```kotlin
class User(val map: Map<String, Any?>) {
    val name: String by map
    val age: Int     by map
}
```

一个调用的例子：

```kotlin
val user = User(mapOf(
    "name" to "John Doe",
    "age"  to 25
))
```

```kotlin
println(user.name) // Prints "John Doe"
println(user.age)  // Prints 25
```

`User` 类会通过 Map 将数据取出。

这个方法同样适用于 `var` 变量，只要把 `Map` 改成 `MutableMap` 即可。
