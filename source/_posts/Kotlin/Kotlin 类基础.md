---
title: Kotlin 类基础
date: 2017-04-08
categories: Kotlin
tags: Kotlin
---

## 1. 声明

使用 `class` 来声明一个类。

```kotlin
class Invoice {
}
```

如果一个类是空的，那么大括号可以省略。

```kotlin
class Empty
```

<!-- more -->## 2. 创建

Kotlin 类使用 `constructor` 来指定构建方法。

### 2.1 primary constructor

**一个类必须拥有一个 primary constructor。**
**primary constructor 是类头的一部分。**

```kotlin
class Person constructor(name: String) {
}
```

如果一个 primary constructor 没有任何的可见性或者注解来修饰，则 `constructor` 可以省略。

```kotlin
class Person(name: String) {
}
```

一个 primary constructor 不能包含任何代码，对应的，使用 `init` 块来进行初始化构建。

```kotlin
class Person(name: String) {
    init {
        logger.info("Person construction.")
    }
}
```

类头的参数可以在 `init` 块中使用，而且，也可以在声明类域时使用。

```kotlin
class Customer(name: String) {
    val customerKey = name.toUpperCase()
}
```

实际上，也可以直接在 primary constructor 中进行类域的初始化。

```kotlin
class Person(val firstName: String, val lastName: String, var age: Int) {
// ...
}
```

通过添加 `val` 或者 `var`，primary constructor 中的参数就可以自动成为类的域。

当如果 primary constructor 中存在**可见性修饰符**或者**注解**时，`constructor` 标识符**必须存在**。

```kotlin
class Customer public @Inject constructor(name: String) { ... }
```

### 2.2 secondary constructor

类也可以声明一个次要的构造器，相当于 Java 的重载构造函数。

```kotlin
class Person {
    constructor(parent: Person) {
        parent.children.add(this)
    }
}
```

如果一个类拥有 primary constructor，则每一个 secondary 都需要包含 primary constructor 的参数。

语法类似于 C++ 的 `super` 继承，使用 `this`，通过参数来表示不同的所继承的 constructor。

```kotlin
class Person(firstName: String) {
    constructor(firstName: String,lastName: String) : this(firstName) {

    }

    constructor(firstName: String, lastName: String, middleName: String) : this(firstName, lastName) {

    }
}
```

注意，不是每个 constructor 都要**直接继承** primary constructor，只需要包含其参数即可。

### 2.3 默认参数

一个类的构造器可以拥有默认参数，默认参数使用 `=` 来指定。

```kotlin
class Customer(name: String = "") {
}
```

> 当 primary constructor 中的参数都有默认值后，编译器会自动生成一个没有参数的 constructor。

## 3. 实例化

将一个类实例化很简单，只需要像一个方法去调用即可。

```kotlin
val customer = Customer("hehe")
```

注意，Kotlin 中没有 `new` 标识符。

## 4. 继承

任何的类都有一个默认的超类 `Any`，但 `Any` 不是 Java 中的 `java.lang.Object`。

实际上，`Any` 只含有 `Object` 中的 `equals()` `toString()` `hashCode()` 方法。

### 4.1 声明超类

Kotlin 中使用冒号用于声明超类

```kotlin
open class Base(p: Int)

class Derived(p: Int) : Base(p)
```

如果子类拥有 primary constructor，那么超类就必须在 primary constructor 中立即进行实例化。

> 所谓的立即实例化就是在冒号之后**构建出基类的实例**

如果子类中没有 primary constructor，那么需要在其他 constructor 中使用 `super` 关键字进行基类构建。

```kotlin
class MyView : View {
    constructor(ctx: Context) : super(ctx) {
    }

    constructor(ctx: Context, attrs: AttributeSet) : super(ctx, attrs) {
    }
}
```

注意到，对于不同的 constructor，也可以使用**不同的基类 constructor** 进行构建。

注意到，Kotlin 在基类前使用了 `open` 关键字，这是用来指明 `Base` 类是**可以被继承的**。

默认情况下，**Kotlin 中的类全部都是 final 类，不允许被继承。**
需要被继承的类使用 `open` 来指定。

> 这主要基于 《Effective Java》中的第 17 条：设计并为你的继承写文档，否则就禁止它。

### 4.2 Override 成员

Kotlin 的一个主要原则是尽量将操作显式化。
所以，如果一个成员是 override 基类成员而来的，则需要显式指明 `override` 。

```kotlin
open class Base {
  open fun v() {}
  fun nv() {}
}
class Derived() : Base() {
  override fun v() {}
}
```

注意，**不仅类是 final 的，成员也是 final 的**。
被 override 成员在基类中的 `open` 和在子类中的 `override` 标识符**<span style="font-size:25px">缺一不可</span>**

如果一个成员被指定了 `override`，那么它**默认不再带有 final 属性。**如果不允许再次 override，那么就需要给它指定 `final`

```kotlin
open class AnotherDerived() : Base() {
  final override fun v() {}
}
```

Override 一个变量和 override 方法一样，不过比较有趣的是，你可以在 primary constructor 中使用 `override` 关键字。

```kotlin
open class Foo {
    open val x: Int get { ... }
}

class Bar1(override val x: Int) : Foo() {

}
```

注意，可以将 `val` 常量使用 `var` 进行 override，但**反之不行**。

这主要是因为 `val` 只拥有 getter，当使用 `var` 时，相当于给它赋上了 setter，但是反过来则不行了，`val` 不具备 setter。

### 4.3 关于 override 的规则

如果一个类继承了具有同一个域的不同基类和接口，那么，这个类就必须 override 这个域。

> 域指的是变量、常量、方法等类成员

```kotlin
open class A {
  open fun f() { print("A") }
  fun a() { print("a") }
}

interface B {
  fun f() { print("B") } // interface members are 'open' by default
  fun b() { print("b") }
}

class C() : A(), B {
  // The compiler requires f() to be overridden:
  override fun f() {
    super<A>.f() // call to A.f()
    super<B>.f() // call to B.f()
  }
}
```

<!-- more -->## 5. 抽象类

一个声明了 `abstract` 的类是一个抽象类。

一个抽象类，**其本身和其所有的方法都必须声明 `abstract`**

`abstract` 类中不允许存在没有声明 `abstract` 的方法。

声明了 `abstract` 的方法不能存在于没有声明 `abstract` 的类中。

```kotlin
open class Base {
  open fun f() {}
}

abstract class Derived : Base() {
  override abstract fun f()
}
```

## 6. 伴生对象(Companion Objects)

Kotlin 不像 Java，没有静态成员对象。

**Kotlin 推荐使用包级别的函数来实现工具类。**

但是，缺少静态成员也有缺点，其一就是无法实现静态工厂。

为了实现这一特性，Kotlin 通过所谓的伴生对象(Companion Objects)来实现。

```kotlin
class MyClass {
  companion object Factory {
    fun create(): MyClass = MyClass()
  }
}
```

伴生对象是**对象声明**的一种，在另一篇文章会有所介绍。

## 7. 封闭类(Sealed Class)

封闭类(Sealed class)用来表示对类阶层的限制, 可以限定一个值只允许是某些指定的类型之一, 而不允许是其他类型. 感觉上, 封闭类是枚举类(enum class)的一种扩展: 枚举类的值也是有限的, 但每一个枚举值常数都只存在唯一的一个实例, 封闭类则不同, 它允许的子类类型是有限的, 但子类可以有多个实例, 每个实例都可以包含它自己的状态数据.

要声明一个封闭类, 需要将 sealed 修饰符放在类名之前. 封闭类可以有子类, 但所有的子类声明都必须嵌套在封闭类的声明部分之内.

```kotlin
sealed class Expr {
    class Const(val number: Double) : Expr()
    class Sum(val e1: Expr, val e2: Expr) : Expr()
    object NotANumber : Expr()
}

```
> 注：从封闭类的子类再继承的子类(间接继承者)可以放在任何地方, 不必在封闭类的声明部分之内.

使用封闭类的主要好处在于, 当使用 when expression 时, 可以验证分支语句覆盖了所有的可能情况, 因此就不必通过 else 分支来处理例外情况.

```kotlin
fun eval(expr: Expr): Double = when(expr) {
    is Expr.Const -> expr.number
    is Expr.Sum -> eval(expr.e1) + eval(expr.e2)
    Expr.NotANumber -> Double.NaN
    // 不需要 `else` 分支, 因为我们已经覆盖了所有的可能情况
}
```
