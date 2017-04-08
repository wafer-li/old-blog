---
title: Kotlin 函数
date: 2017-04-08
categories: Kotlin
tags: Kotlin
---

## 1. 声明

函数使用 `fun` 关键字进行声明。

```kotlin
fun double(x: Int): Int {
}
```

<!-- more -->## 2. 调用

函数的调用和其他语言一样

```kotlin
val result = double(2)
```

### 2.1 类成员函数调用

类成员函数使用 `.` 进行调用。

```kotlin
Sample().foo() // create instance of class Sample and calls foo
```

### 2.2 中继调用

使用了 `infix` 标识符的函数可以进行中继调用

#### 2.2.1 条件

- 函数是成员函数或者扩展
- 函数只有一个参数
- 使用 `infix` 进行标识

##<!-- more -->## 2.2.2 例子

```kotlin
// Define extension to Int
infix fun Int.shl(x: Int): Int {
...
}

// call extension function using infix notation

1 shl 2

// is the same as

1.shl(2)
```

## 3. 参数

函数的参数使用 Pascal 的形式进行调用。(`name: Type`)

使用逗号分隔不同的参数。

每个参数都**必须显式指明类型**

```kotlin
fun powerOf(number: Int, exponent: Int) {
...
}
```

### 3.1 默认参数

Kotlin 中允许使用默认参数，这样相比 Java 就减少了函数重载的使用。

> 在 Java 中，如果出现多个重载函数，开销将迅速增长。
> 但是 Kotlin 相对于 Python 来说仍然支持函数重载特性

使用 `=` 来指定参数的默认值，而且 Kotlin 不对默认参数的位置进行要求。

```kotlin
fun read(b: Array<Byte>, off: Int = 0, len: Int = b.size()) {
...
}
```

通过类重载的方法**不允许拥有默认参数**

```kotlin
open class A {
    open fun foo(i: Int = 10) { ... }
}

class B : A() {
    override fun foo(i: Int) { ... }  // no default value allowed
}
```

### 3.2 参数指定

在函数调用时，Kotlin 支持参数的指定，类似 Python

例如，对如下函数：

```kotlin
fun reformat(str: String,
             normalizeCase: Boolean = true,
             upperCaseFirstLetter: Boolean = true,
             divideByCamelHumps: Boolean = false,
             wordSeparator: Char = ' ') {
...
}
```

在**调用时**使用 `=` 来指定参数。

```kotlin
reformat(str,
    normalizeCase = true,
    upperCaseFirstLetter = true,
    divideByCamelHumps = false,
    wordSeparator = '_'
  )
```

当然我们也可以不指定所有的参数，如果参数有默认值的话。
此时，没有被指定的实参按照顺序赋予形参。

```kotlin
reformat(str, wordSeparator = '_')
```

需要注意的是，**调用 Java 的方法时，不能使用参数指定。**

### 3.3 不定参数

Kotlin 同样支持不定参数，只需要给参数标识上 `vararg` 即可。

例如：

```kotlin
fun <T> asList(vararg ts: T): List<T> {
  val result = ArrayList<T>()
  for (t in ts) // ts is an Array
    result.add(t)
  return result
}
```

与 Java 一样，不定参数会被视作一个 `Array` 对象来进行处理。

**只有一个参数能被标记为 `vararg`**。

不定参数可以不处于最后位置，此时，只能通过**参数指定**的形式对剩下的参数进行赋值，或者如果其中一个参数是函数，那么可以在**括号外**使用 lambda 表达式。

此外，Kotlin 中可以将一个 `Array` 对象传给不定参数，通过使用 spread operator (`*`) 来实现。

```kotlin
val a = arrayOf(1, 2, 3)
val list = asList(-1, 0, *a, 4)
```

## 4. 返回值

如果一个函数没有指明返回值或者没有使用 `return` 语句，那么默认返回 `Unit`。

> `Unit` 是一种特有类型，只具有 `Unit` 一个值。
使用 `Unit` 的原因在于，Kotlin 一切都是对象，使用一个具体类型能使泛型更好的工作

> 不使用 `Void` 的原因：因为已经存在了一个 `Nothing` 类，为了防止意思冲突，所以使用 `Unit` 来指代 Java 中的 `void`


```kotlin
fun printHello(name: String?): Unit {
    if (name != null)
        println("Hello ${name}")
    else
        println("Hi there!")
    // `return Unit` or `return` is optional
}
```

当然，`Unit` 的返回值声明也是可以省略的。

> 实际上，在编码规范中，要求对其省略。

```kotlin
fun printHello(name: String?) {
    ...
}
```

<!-- more -->### 4.1 单一表达式函数

当一个函数只具有一条表达式时，花括号可以被省略。

```kotlin
fun double(x: Int): Int = x * 2
```

此时，如果编译器能推断出表达式的值，那么返回类型的声明也是可以省略的。

```kotlin
fun double(x: Int) = x * 2
```

### 4.2 非单一表达式函数

如果函数不是单一表达式，而且具有返回值，那么返回类型就必须被声明。

## 5. 函数作用域

在 Kotlin 中，函数可以在 Top-level 声明，也就是说不需要用类来包裹函数。

函数同样也可以是**局部的**，也就是说它可以是成员函数或者函数的扩展。

### 5.1 局部函数

Kotlin 支持局部函数，例如**嵌套函数**

```kotlin
fun dfs(graph: Graph) {
  fun dfs(current: Vertex, visited: Set<Vertex>) {
    if (!visited.add(current)) return
    for (v in current.neighbors)
      dfs(v, visited)
  }

  dfs(graph.vertices[0], HashSet())
}
```

同时，内部函数可以访问外部函数的局部变量，也就是**闭包**属性。

所以对于上面的例子，`visited` 可以作为一个局部变量。

```kotlin
fun dfs(graph: Graph) {
  val visited = HashSet<Vertex>()
  fun dfs(current: Vertex) {
    if (!visited.add(current)) return
    for (v in current.neighbors)
      dfs(v)
  }

  dfs(graph.vertices[0])
}
```

<!-- more -->## 6. 尾调用

对于一些算法实现来说，使用递归实现会令算法过程更加明晰。

对此，Kotlin 拥有一个特殊的关键字 `tailrec`，使用它可以支持使用尾调用(tail recursion)形式的函数。

使用 `tailrec` 关键字的原因在于：
虽然不使用这个关键字也可以实现尾调用形式的函数，
但是 `tailrec` 会指示编译器将其优化为相应的循环形式，
从而避免了因递归调用过多造成的 `StackOverflow`。

```kotlin
tailrec fun findFixPoint(x: Double = 1.0): Double
        = if (x == Math.cos(x)) x else findFixPoint(Math.cos(x))
```

使用 `tailrec` 的函数必须满足尾调用形式，即**函数的最后一个操作就是调用其自身。**

当你的递归调用操作之后还存在更多代码时，不能对函数使用 `tailrec`
