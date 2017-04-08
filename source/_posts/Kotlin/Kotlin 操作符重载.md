---
title: Kotlin 操作符重载
date: 2017-04-08
categories: Kotlin
tags: Kotlin
---

## 1. 概述

Kotlin 中的操作符都是由函数实现的，包括成员函数、扩展函数和中缀函数。

重载一个操作符，我们只要给对应的类提供一个成员函数或者扩展函数即可。

重载操作符的函数必须使用 `operator` 进行标识。

遗憾的是，Kotlin 不支持自定义操作符，只能对现有的操作符进行重载。

<!-- more -->## 2. 公约

这里阐述的是 Kotlin 中各种操作符的对应函数和重载约定。

没有在以下列出的操作符，不允许被重载。

> 关于 Kotlin 中所有的操作符，请查看[这个链接](https://kotlinlang.org/docs/reference/grammar.html#precedence)

### 2.1 一元操作符

Expression |Translated to
--- | ---
+a|a.unaryPlus()
-a|a.unaryMinus()
!a|a.not()

当编译时，上面的操作符会被替换为对应的函数，步骤如下:

1. 确定 `a` 的类型，比如 `T`
2. 在 `T` 中寻找方法，比如说 `unaryPlus()`
3. 当寻找不到方法时，报错
4. 如果 `unaryPlus()` 返回类型 `R`，那么 `+a` 的类型为 `R`

注意，所有的操作符都会对基本类型进行优化，以减少函数调用的开支。

Expression | Translated to
--- | ---
`a++` | `a.inc()` + see below
`a--` |`a.dec()` + see below

这些操作符是用来改变它们的接收者的。

> 注意，所谓的改变接收者指的是**改变其内部的值**，而不是改变其对象。
事实上，应该**创建并返回一个拥有新值的对象**，而不是对对象本身进行操作。

编译器会对这样的操作符采取以下步骤的操作：

1. 确定 `a` 的类型 `T`
2. 在 `a` 中寻找 `inc()` 方法
3. 如果 `inc()` 返回类型为 `R`，那么它必须是 `T` 的子类

对于**后缀**操作符的计算过程如下(`a++`)：

1. 将 `a` 的初始值存储在临时对象 `a0` 中
2. 将 `a.inc()` 的结果赋予 `a`
3. 返回 `a0`

`a--` 与之相同

对于**前缀**操作符的计算过程如下(`++a`)：

1. 将 `a.inc()` 的结果赋予 `a`
2. 返回 `a`

## 2.2 二元操作符

<!-- more -->### 2.2.1 数学运算与范围

Expression | Translated to
--- | ---
`a + b` | `a.plus(b)`
`a - b` | `a.minus(b)`
`a * b` | `a.times(b)`
`a / b` | `a.div(b)`
`a % b` | `a.mod(b)`
`a..b` | `a.rangeTo(b)`

这些操作符在执行时会自动翻译成相应的函数执行。

### 2.2.2 `in` 操作符

Expression | Translated to
--- | ---
`a in b` | `b.contains(a)`
`a !in b` | `!b.contains(a)`

对于这些方法，执行的步骤一样，但是只不过把调用关系颠倒了过来。

<!-- more -->### 2.2.3 方括号操作符

Symbol | Translated to
--- | ---
`a[i]` | `a.get(i)`
`a[i, j]` | `a.get(i, j)`
`a[i_1, ..., i_n]` | `a.get(i_1, ..., i_n)`
`a[i] = b` | `a.set(i, b)`
`a[i, j] = b` | `a.set(i, j, b)`
`a[i_1, ..., i_n] = b` | `a.set(i_1, ..., i_n, b)`

方括号操作符的对应方法为 `get()`，根据参数个数来调用不同的 `get()` 方法，如果有赋值操作则调用 `set()` 方法。

### 2.2.4 圆括号操作符

Symbol | Translated to
--- | ---
`a()` | `a.invoke()`
`a(i)` | `a.invoke(i)`
`a(i, j)` | `a.invoke(i, j)`
`a(i_1, ..., i_n)` | `a.invoke(i_1, ..., i_n)`

圆括号操作符会根据参数调用相应的 `invoke()` 方法

<!-- more -->### 2.2.5 复合赋值操作

Expression | Translated to
--- | ---
`a += b` | `a.plusAssign(b)`
`a -= b` | `a.minusAssign(b)`
`a *= b` | `a.timesAssign(b)`
`a /= b` | `a.divAssign(b)`
`a %= b` | `a.modAssign(b)`

对于复合赋值操作，编译器做以下处理(`a += b`)：

- 如果右边一列中的函数在类中存在，那么：
    - 检查对应的二元函数是否存在，比如 `plus()` 对应 `plusAssign()`，如果存在，报错
    - 检查函数的返回值是否为 `Unit`，如果不是，报错
    - 上面检查通过后，生成相应代码

- 如果右边一列中的函数在类中不存在，那么**尝试生成 `a = a + b`**，包括类型检查（`a + b` 的返回值必须是 `A` 或其子类型）

> 不允许 `plus()` 和 `plusAssign()` 同时存在的原因：
这是因为编译器会默认转为 `a = a + b` 进行处理，所以当存在 `plus()` 时，就没必要编写重复代码。

需要注意的是，复合赋值是赋值语句的一种，而在 Kotlin 中，
**赋值不是一个表达式**

这主要是为了避免赋值语句和单行函数的冲突

```
fun attachView(view: View) = this.view = view
```

上面的代码出现了二义性。

但是在 Java 中，赋值是一种表达式，也就是说 Java 允许

```
int a = 1, b = 1, c = 1;
if ((a = b) != c) {
    ....
}
```

而 Kotlin 只能将赋值语句移到括号外。

> [这个链接](http://stackoverflow.com/questions/36879236/how-to-convert-java-assignment-expression-to-kotlin)中还有更多方法

### 2.2.6 相等性检查

Expression | Translated to
--- | ---
`a == b` | `a?.equals(b) ?: b === null`
`a != b` | `!(a?.equals(b) ?: b === null)`

相等性检查只需要提供 `equals()` 方法即可。

注意：引用相等性检查 `===` 和 `!==` 是不允许重载的。

相等性检查被转换成如此复杂的表达式是为了筛选 `null` 值，而且保证 `null == null` 返回 `true`

<!-- more -->### 2.7 比较运算符

Symbol | Translated to
--- | ---
`a > b` | `a.compareTo(b) > 0`
`a < b` | `a.compareTo(b) < 0`
`a >= b` | `a.compareTo(b) >= 0`
`a <= b` | `a.compareTo(b) <= 0`

所有的比较运算符都会被转换成 `compareTo()` 方法；
`compareTo()` 方法必须返回一个 `Int` 值。


## 3. 中缀函数

除此之外，我们还可以通过定义中缀函数来定义新的**“运算符”**

比如数字类型的位运算就是通过中缀函数实现的。
