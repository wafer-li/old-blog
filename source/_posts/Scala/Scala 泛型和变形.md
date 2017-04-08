---
title: Scala 泛型和变形
date: 2017-04-08
categories: Scala
tags: Scala
---

## 1. 概述

泛型是多态的一个重要组成部分，通过运行时确定的类型来加载对应的类代码；

作为一个面向对象语言，Scala 同样具有泛型功能。

<!-- more -->## 2. 定义

与 Java 不同，Scala 的泛型是使用方括号 `[]` 定义的：

```scala
class List[T] { ... }
```

同样，在泛型方法的定义中，泛型参数的位置也和 Java 不一样：

Java:

```java
public static <T> listOf()
```

Scala:

```scala
def listOf[T]()
```

## 3. 上界和下界

这个方面，Scala 和 Java 有些许不同；

首先，在定义方面，Scala 使用两个特殊的符号表示上下界：

`A <: B` 表示 A 是 B 的子类，也就是 B 是 A 的上界；

`A >: B` 表示 A 是 B 的超类，也就是 B 是 A 的下界。

而 Java 使用 `extends` 关键字来说明。

其次，Scala 中，可以使用超类限定类型参数；

而 Java 只能使用 `extends` 即子类限定类型参数：

```
// Scala
[U >: T]

// Java
U super T // ERROR!
```

## 4. 逆变和协变

关于逆变和协变，Scala 相比于 Java 中的 **使用声明**，还可以在定义中指明协变和逆变。

### 4.1 名词解释

如果 `A <: B` (A 是 B 的子类)，那么对于类 `C` 来说：

1. $C[A] <: C[B]$ => C 是协变(covariant)的
2. $C[A] >: C[B]$ => C 是逆变(contravariant)的
3. $C[A]$ 和 $C[B]$ 没有继承关系 =>  C 是不变(nonvariant) 的

对 Java 而言，`? extends T` 提供了协变特性；

`? super T` 提供了逆变特性

### 4.2 定义中指明可变性

这是 Scala 和 Kotlin 中相对于 Java 的一个改进，可以在 **类定义** 中指明泛型可变性。

```
// Scala
class List[+T]

// Kotlin
class List<out T>
```

此时，指明了 `List` 是 **协变的**，也就是说，`List[String]` 是 `List[Object]` 的子类。

同理，下面的写法指明了逆变性：

```
// Scala
class List[-T]

// Kotlin
class List<in T>
```

当不使用 `+`、`-` 号修饰时，就是不变(nonvariant)的

### 4.3 函数

事实上，在 Scala 中，函数也是一个对象；

`def` 语句声明的函数会被转化成一个 `FunctionN<-T, +U>` 类：

```scala
class Function1[-T, +U] {
    def apply(param: T): U
}
```

通过 `apply` 函数来进行函数的调用。

我们可以看到，函数参数是逆变的，但是返回类型是协变的；

这是为什么呢？

实际上，这是里氏法则的应用：

如果 $A_2 <: A_1$ 且 $B_1 <: B_2$，那么对于 $A_1 \Rightarrow B_1$ 和 $A_2 \Rightarrow B_2$ 来说：

$A_1$ 所接受的范围比 $A_2$ 广，所以使用 $A_1$ 作为参数，可以接受 $A_2$；

$B_1$ 比 $B_2$ 要更加严格，所以返回 $B_1$ 就相当于肯定能返回 $B_2$；

此时，因为 $A_1 \Rightarrow B_1$ 的形参和返回值都满足 $A_2 \Rightarrow B_2$ 的要求；

我们就可以使用前者替代后者，也就是说，此时：

$$
A_1 \Rightarrow B_1 <: A_2 \Rightarrow B_2
$$

那么说明， **函数形参是逆变的，而返回值是协变的**

Scala 会自动检查函数的泛型变形，以满足上面的要求。

<!-- more -->### 4.4 协变的函数形参

函数上面的变形要求是为了保证数据的一致性；

如果你的函数不进行数据的更改操作，那么事实上是可以将形参声明为协变的；

不过，鉴于 Scala 的泛型检查，它禁止了这种方法的出现；

此时，我们可以使用泛型下界，来让我们的变形满足 Scala 的要求：

```scala
def concat[U >: T](elem: U): List[U] = new Cons(elem, Empty)
```
