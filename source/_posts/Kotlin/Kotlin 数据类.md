---
title: Kotlin 数据类
date: 2017-04-08
categories: Kotlin
tags: Kotlin
---

## 1. 介绍

我们经常要使用容器类结构，所以 Kotlin 提供了一种新特性，专门用于生成容器类，称为数据类(data class)

<!-- more -->## 2. 创建

Kotlin 使用 `data` 定义一个数据类

```kotlin
data class User(val name: String, val age: Int)
```

编译器会自动为这个类生成如下方法：

- `equal()` 和 `hashCode()`
- `toString()`：生成 `"User(name=John, age=42)"`
- `componentN()` 方法，用于类的解构
- `copy()` 方法，用于复制这个类

如果这些方法已经被显式声明了，那么则不进行生成。

## 3. 需要满足的条件

一个 Kotlin 数据类需要满足如下条件：

- primary constructor 必须具有至少一个参数
- 所有的 primary constructor 参数必须使用 `val` 或 `var`
- 数据类不能具有 `open` `abstract` `sealed` 修饰符，而且不能是内部类。
- 数据类不能继承其他类，但是可以实现接口

> 如果需要在 JVM 上使得类具有一个无参数的构造器，那么所有的 primary constructor 参数都必须有默认值

<!-- more -->## 4. 复制

数据类自动实现了 `copy()` 方法，可以进行数据类的深拷贝。

```kotlin
val jack = User(name = "Jack", age = 1)
val olderJack = jack.copy(age = 2)
```

`copy()` 方法的声明如下：

```kotlin
fun copy(name: String = this.name, age: Int = this.age) = User(name, age)
```

## 5. 数据类的解构

数据类自动生成了 `componentN()` 方法，因此可以用作数据类的解构。

> 解构指的是类似 Python 中的返回元组，将数据类中的数据拆分开，用不同的变量来承接的特性。

```kotlin
val jane = User("Jane", 35)
val (name, age) = jane
println("$name, $age years of age") // prints "Jane, 35 years of age"
```

上面这个例子实际上在编译过程中会被自动转换成

```kotlin
val name = jane.component1()
val age = jane.component2()
```

所以 `name` 和 `age` 可以直接被使用

```kotlin
println(name)
println(age)
```

`componentN()` 方法的顺序和 primary constructor 中**参数的顺序**相同。

> `componentN()` 方法的自定义
实际上，为了支持上面的类似元组的操作，需要使用 `operator` 标识符来声明 `componentN()` 方法。

> ```kotlin
operator fun <K, V> Map<K, V>.iterator(): Iterator<Map.Entry<K, V>> = entrySet().iterator()
operator fun <K, V> Map.Entry<K, V>.component1() = getKey()
operator fun <K, V> Map.Entry<K, V>.component2() = getValue()
> ```

> 定义之后，就可以像这样调用

> ```kotlin
for ((key, value) in map) {
   // do something with the key and the value
}
> ```
