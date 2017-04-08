---
title: Kotlin 基础
date: 2017-04-08
categories: Kotlin
tags: Kotlin
---

## 1. 基本语法

<!-- more -->### 1.1 变量定义

1.  使用 `val` 定义**常量**（只读）

     ```kotlin
     val a: Int = 1
     val b = 1   // 类型可以被自动推断
     val c: Int  // 如果没有进行变量初始化，则需要指定变量类型
     c = 1
     ```

    > 注意，kotlin 取消了分号

2.  使用 `var` 定义变量

     ```kotlin
     var x = 5
     x += 1
     ```

### 1.2 注释

与 Java 相同，单行注释使用 `//` ，多行注释使用 `/* */`

不同的是，kotlin 中允许注释块嵌套。

## 2. 编码规范

### 2.1 命名风格

命名风格和 Java 相同。

- 类名采用大驼峰
- 函数、方法、变量采用小驼峰
- 使用 4 空格缩进
- 公有方法和函数必须加上 KDoc

### 2.2 关于冒号

冒号在分隔两个类型的时候，**前后都要有空格**

其余情况，只需后有空格即可。

```kotlin
interface Foo<out T : Any> : Bar {
    fun foo(a: Int): T
}
```

<!-- more -->### 2.3 Lambda 表达式

在使用 lambda 表达式时，lambda 表达式应与花括号有空格分隔。

lambda 表达式应尽量的短。

```kotlin
list.filter { it > 10 }.map { element -> element * 2 }
```

### 2.4 关于 Unit

当一个函数返回 `Unit` 类型时，应将其省略。

类似于 Java 中的返回值为 `void`

<!-- more -->## 3. 包和导入

Kotlin 中的包和导入与 Java 区别不大。

另外增加了 `as` 关键字用于赋予别名给类和函数，以防出现名称冲突。
同时，Kotlin 中没有 Java 中的 `import static` 语句，所有的导入均使用 `import` 进行。
