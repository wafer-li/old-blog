---
title: Scala 类和对象基础
date: 2017-04-08
categories: Scala
tags: Scala
---

## 1. 简介

Scala 除了是一门函数式语言外，还同时具有面向对象的特征；

在 Scala 中，一样具有类和对象以及多态的支持。

<!-- more -->## 2. 构造器

类具有一个默认的 primary 构造器，它的参数直接位于 `class` 头中；

而且，更加神奇的是，`class` 中可以直接执行另外的函数；

也就是说， **整个类** 都是 primary 构造器。

对于多个构造器，我们采用如下的声明来实现：

```scala
class Person(val name:String, val age: Int) {
    def this(name: String) = this(name, 17)
}
```

通过直接定义 `this` 来定义一个新的构造器

## 3. 定义和创建

和 Java 一样，Scala 中，类使用 `class` 关键字进行定义：


```scala
class ChecksumAccumulator {
    // class body
}
```

不过和 Java 不同的，对象的构建，类没有参数，则不需要括号：

```scala
new ChecksumAccumulator
```

## 3. 字段和方法

类中，字段使用 `val` 和 `var` 定义，方法使用 `def` 定义。

注意 `def` 同样要使用等于号 `=`

```scala
class ChecksumAccumulator {
    var sum = 0
    def checkSum(): Int = {
        return ~(sum + 0XFF) + 1
    }
}
```

其中，如果方法需要有副作用，则将其返回值声明为 `Unit`

```scala
def add(b: Int): Unit = {
    sum += b
}
```

此时，方法会忽略函数体最后的值类型，转而将其转换为 `Unit`

如果需要返回 `Unit`，我们也可以直接省略等于号，使用 Java 中常用的方法声明形式：

```scala
def add(b: Int) {
    sum += b
}
```

如果一个函数或者方法的定义没有等于号，那么默认其返回值类型为 `Unit`。

如果需要函数或者方法来推断返回值类型，则需要加上等于号

## 4. Getter 和 Setter

很遗憾，Scala 的类成员是字段形式的，所以，不能像 Kotlin 那样采用语法糖式的 getter 和 setter 的写法；

相比 Java，Scala 在定义字段时，会自动生成字段的 getter 和 setter，他们的命名为：

```scala
def x:T                      // getter
def x_= : (y: T): Unit       // setter
```

注意，方法名为 `x` 和 `x_=`

那么如何提供自定义的 getter 和 setter 呢？

我们只能采用后备字段，同时，将我们自定义的 getter 和 setter 满足上面的命名公约：

```scala
class Person(private var _name: String) {
    def name = _name
    def name_= (thatName: String): Unit = {
        _name = thatName
    }
}
```

这样，我们就能够像使用属性一样使用 `name` 了。

```scala
val p = new Person("hehe")

p.name = "nihao"
```

## 5. 可见性简述

Scala 中，默认的可见性是 `public`；

其余的可见性修饰符和 Java 一致。

## 6. 伴生对象

Scala 没有静态成员，但是具有伴生对象(companion object)，是对象(object) 的一种。

对象是一个 **单例**，当对象和类在同一个文件中定义，具有同样的名称时，称对象是类的伴生对象。

对象不带参数，不能通过 `new` 关键字进行构建。

方法的调用形式和 Java 的静态方法调用相同。

```scala
object ChecksumAccumulator {
    private val cache = Map[String, Int]()
    def calculate(s: String): Int =
    if (cache.contains(s))
        cache(s)
    else {
        val acc = new ChecksumAccumulator
        for (c <- s)
            acc.add(c.toByte)
        val cs = acc.checksum()
        cache += (s -> cs)
        cs
     }
```

没有伴生类的对象称为 **孤立对象**，实际上就是一个简单的单例。

## 7. 类的解析过程

Scala 采用代换模型对表达式进行解析，那么它是如何解析类的定义和声明调用的呢？

对此，有如下的几个步骤：

1. 将 `new` 关键字当成普通方法进行代换，最终为值

2. 解析类定义中的方法形参

3. 解析构造器形参

4. 将 `this` 关键字替换成 `new` 的表达式

5. 将上述解析到的所有值进行代入，函数解析为字面量

6. 继续代换，最终得到结果
