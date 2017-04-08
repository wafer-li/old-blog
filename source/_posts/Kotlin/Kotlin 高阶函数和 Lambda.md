---
title: Kotlin 高阶函数和 Lambda
date: 2017-04-08
categories: Kotlin
tags: Kotlin
---

## 1. 高阶函数

Kotlin 允许函数接受一个**函数引用**作为参数，这样的函数被称作**高阶函数**。

这使得回调机制在 Kotlin 中更容易被实现。

<!-- more -->### 1.1 声明

```kotlin
fun <T> lock(lock: Lock, body: () -> T): T {
  lock.lock()
  try {
    return body()
  }
  finally {
    lock.unlock()
  }
}
```

上面的这个例子中，`body` 就是一个函数引用，它的类型是 `() -> T`，表示该函数不接受参数，返回类型是 `T`。

可以看到，在这个高阶函数中，可以直接使用 `body()` 对 `body` 函数进行调用。

### 1.2 调用

调用高阶函数需要传入另一个函数作为其参数，这是 Kotlin 反射机制中的一部分。

Kotlin 使用**函数引用**来指明一个函数对象，其形式是 `::functionName`，例如：

```kotlin
fun toBeSynchronized() = sharedResource.operation()

val result = lock(lock, ::toBeSynchronized)
```

这个例子中 `::toBeSynchronized` 就是函数 `toBeSynchronized()` 的函数引用。

除此之外，高阶函数还可以接受一个 Lambda 表达式作为其函数参数。

```kotlin
val result = lock(lock, { sharedResource.operation() })
```

> Lambda 会在接下来的章节介绍，但是为了更好地理解高阶函数，先来几点简单的概述：
>
- Lambda 表达式无论何时都使用 `{}` 和其他表达式分隔
- `->` 之前的是 Lambda 表达式的参数
- `->` 之后的是 Lambda 表达式的主体

特别的，如果一个高阶函数的函数引用参数在最后一位，那么该参数能在括号外被指定。

```kotlin
lock (lock) {
  sharedResource.operation()
}
```

另一个高阶函数的例子是 `map()` 函数。

```kotlin
fun <T, R> List<T>.map(transform: (T) -> R): List<R> {
  val result = arrayListOf<R>()
  for (item in this)
    result.add(transform(item))
  return result
}
```

它可以这样被调用：

```kotlin
val doubled = ints.map { it -> it * 2 }
```

注意到，如果高阶函数只有唯一的一个参数，而且这个参数是一个函数类型的，那么调用它的圆括号也可以被省略。

<!-- more -->### 1.3 `it` 参数

如果一个 Lambda 表达式只拥有一个参数，那么其参数的声明和箭头符号(`->`)都可以省略。

```kotlin
ints.map { it * 2 }
```

这个唯一的参数被命名为 `it`，这是一个隐式的默认单参数名称。
当 Lambda 表达式像上面那样被调用时，不能使用 `it` 以外的名称来指代唯一的参数。

## 2. Lambda 表达式

Lambda 表达式是一种**匿名的函数**，它只有**文字上的函数定义**，而没有实际的名称。

也就是说 Lambda 表达式是一种没有被声明，却会被立即执行的函数。

考虑如下的高阶函数

```kotlin
max(strings, { a, b -> a.length < b.length })
```

其中的 Lambda 表达式和 `compare()` 方法是等价的。

```kotlin
fun compare(a: String, b: String): Boolean = a.length < b.length
```

> 注意到，lambda 是一个表达式，所以它最后一个语句的执行结果就是它的返回值。

<!-- more -->### 2.1 函数类型

对于上面的 `max()` 方法，定义如下：

```kotlin
fun <T> max(collection: Collection<T>, less: (T, T) -> Boolean): T? {
  var max: T? = null
  for (it in collection)
    if (max == null || less(max, it))
      max = it
  return max
}
```

它是一个高阶函数，其中， `less` 的类型是一个**函数**`(T, T) -> Boolean`，意味着 `less` 函数接受两个 `T` 类型的参数，返回布尔值。

对于函数类型，除了上面的这种声明方法外，也可以给函数类型中的各个变量赋上名称。这将有助于说明该函数类型的调用方法和作用。

```kotlin
val compare: (x: T, y: T) -> Int = ...
```

### 2.2 Lambda 表达式的语法

一个 lambda 表达式总是在花括号内；
参数的定义在括号之内，`->` 之前，而且可以省略类型；
函数的主题在 `->` 之后。

```kotlin
val sum: (Int, Int) -> Int = { x, y -> x + y }
```

同时，只有一个参数的 lambda 表达式可以直接省略参数声明和 `->`

如果高阶函数的函数类型参数在最后一位，那么 lambda 表达式可以在圆括号之外。

<!-- more -->### 2.3 匿名函数

lambda 表达式语法中缺少对返回类型的指定，
在通常情况下，这是非必须的，因为大多数的返回类型都可以被自动推断出来。

当然，如果你需要**显式地声明返回类型**，可以使用**匿名函数**

```kotlin
fun(x: Int, y: Int): Int = x + y
```

一个匿名函数和常规的函数声明很像，只不过它的名字被省略了。

匿名函数除了表达式之外，也可以使用语句块作为函数主体。

```kotlin
fun(x: Int, y: Int): Int {
  return x + y
}
```

当匿名函数的参数类型能够被推断得出时，其参数类型可以被省略。

```kotlin
ints.filter(fun(item) = item > 0)
```

同样的，匿名函数的返回类型也可以不显式指明，直接由函数主体推断得出。

需要注意的是，匿名函数的参数**必须在圆括号之中**，只有 Lambda 表达式材才允许在圆括号外传递参数。

匿名函数和 Lambda 表达式的一个主要区别是：
在 Lambda 表达式中的 `return` 语句会从其外部函数返回（即对应的高阶函数）；
而在匿名函数中的 `return` 将会在匿名函数自身返回。

> 实际上，`return` 所对应的是**最近的 `fun` 函数**（这称为 local return），
但是根据[这个帖子](https://discuss.kotlinlang.org/t/return-from-outer-function/590/2)，**非本地返回特性**只支持内联函数，
所以从一个非内联的 lambda 使用 `return`，是不可能的。

> 但是匿名函数可以进行这种操作，当你需要从 lambda 使用 `return` 时，使用匿名函数来代替它。

> https://www.reddit.com/r/Kotlin/comments/3yybyf/returning_from_lambda_functions/

### 2.4 闭包

闭包指的是内部函数可以访问外部变量，Kotlin 的 lambda 表达式、匿名函数、局部函数和 object expression 都支持这一特性。

```kotlin
var sum = 0
ints.filter { it > 0 }.forEach {
  sum += it
}
print(sum)
```

而且和 Java 不同的是，被闭包捕获的外部变量是可以改变的。


<!-- more -->### 2.5 带接收者的函数

Kotlin 还支持定义一个带**接收者**的函数字面量，这样就可以在 lambda 表达式和匿名函数内部调用接收者的成员。

```kotlin
sum : Int.(other: Int) -> Int
```

> 与扩展函数的区别：带接收者的函数没有名字，只能通过匿名函数或者 lambda 表达式来使用


这里定义了一个 `sum()` 函数，它的接收者是一个 `Int` 对象。

那么就可以像这样调用：

```kotlin
1.sum(2)
```

通过匿名函数，我们可以定义一个带接收者函数的变量。

```kotlin
val sum = fun Int.(other: Int): Int = this + other
```

当接收者能从上下文被推断出来时，可以使用 lambda 表达式来调用接收者成员。

```kotlin
class HTML {
    fun body() { ... }
}

fun html(init: HTML.() -> Unit): HTML {
  val html = HTML()  // create the receiver object
  html.init()        // pass the receiver object to the lambda
  return html
}


html {       // lambda with receiver begins here
    body()   // calling a method on the receiver object
}
```
