---
title: Kotlin 扩展类型
date: 2017-04-08
categories: Kotlin
tags: Kotlin
---

## 1. 介绍

Kotlin 支持类似 C# 的对类进行扩展，而**不需要**对该类进行继承操作。
这个特性被称作扩展(extension)。

<!-- more -->## 2. 方法的扩展

给类写一个扩展方法很简单，只需要使用类成员运算符(`.`)即可。

```kotlin
fun MutableList<Int>.swap(index1: Int, index2: Int) {
  val tmp = this[index1] // 'this' corresponds to the list
  this[index1] = this[index2]
  this[index2] = tmp
}
```

上面的例子中，我们给 `MutableList<Int>` 类扩展了一个方法 `swap()`。
此时，我们称 `MutableList<Int>` 为**接收者类型**，例子中的 `this` 标识符指的就是接收者类型的对象本身。

对类进行方法扩展后，我们就可以调用普通方法一样调用这个方法。

```kotlin
val l = mutableListOf(1, 2, 3)
l.swap(0, 2) // 'this' inside 'swap()' will hold the value of 'l'
```

当然，可以看出 `MutableList` 是个泛型类，同样的，我们的扩展方法也支持泛型特性。

```kotlin
fun <T> MutableList<T>.swap(index1: Int, index2: Int) {
  val tmp = this[index1] // 'this' corresponds to the list
  this[index1] = this[index2]
  this[index2] = tmp
}
```

## 3. 方法的扩展是静态的

这指的是决定扩展方法调用的，是形式上的调用对象类型，而非实际的调用对象类型。

例如：

```kotlin
open class C

class D: C()

fun C.foo() = "c"

fun D.foo() = "d"

fun printFoo(c: C) {
    println(c.foo())
}

printFoo(D())
```

此时，`printFoo()` 的结果是 **"c"** 而不是 **"d"**。
虽然传入 `printFoo()` 方法的是 D 对象，但是在该方法定义中，使用的是 C 的 `foo()` 方法，
所以即使传入的是 D，而结果却依然是 C 的打印结果。

这就是扩展方法的静态特性。

## 4. 方法扩展的优先级和重载

### 4.1 优先级

如果类中已经存在了一个和我们扩展方法相同的成员，那么在方法调用时，**优先调用类成员**

```kotlin
class C {
    fun foo() { println("member") }
}

fun C.foo() { println("extension") }
```

如果我们调用对于一个任意的 `C` 对象调用 `c.foo()` ，结果都会是 **"menber"** ，而不是 **"extension"**。

### 4.2 重载

但是，如果我们的扩展方法和类成员拥有不同的**函数签名**，那么两者互不干涉，就像函数重载一样。

```kotlin
class C {
    fun foo() { println("member") }
}

fun C.foo(i: Int) { println("extension") }
```

如果我们调用 `C().foo(1)`，则依旧会打印 **"extension"**

## 5. 可以为空的接收者

扩展可以使用一个为空的接收者类型，这样的扩展方法在对象为 `null` 的时候仍然能被调用，此时可以在扩展方法中进行 `null` 检查，对于调用者来说，就直接调用方法即可。

```kotlin
fun Any?.toString(): String {
    if (this == null) return "null"
    // after the null check, 'this' is autocast to a non-null type, so the toString() below
    // resolves to the member function of the Any class
    return toString()
}
```

注意到，Kotlin 在经过 `if(this == null)` 这一 `null` 检查之后，会自动将对象 cast 成为一个非空对象。

## 6. 属性的扩展

与方法的扩展一样，Kotlin 中同样可以对属性进行扩展。

```kotlin
val <T> List<T>.lastIndex: Int
  get() = size - 1
```

需要注意的是，由于扩展采用静态处理，而不是插入一个新成员，
所以，扩展的属性没有 **backing field** 的支持，
因此，**扩展属性不能被初始化**，它们只能用显式的 getter 和 setter 来进行初始化。

<!-- more -->## 7. 友元对象的扩展

如果一个类具有友元对象(Companion Object)，那么，也可以对其进行扩展。

```kotlin
class MyClass {
  companion object { }  // will be called "Companion"
}

fun MyClass.Companion.foo() {
  // ...
}
```

扩展的友元对象就像类的友元对象一样，使用类名进行调用。

## 8. 扩展类型的作用域

通常，我们会将扩展定义在 top-level，此时就需要使用 `import` 语句来调用这个扩展。

## 9. 将扩展作为类成员

我们可以在一个类中定义另一个类的扩展方法

```kotlin
class D {
    fun bar() { ... }
}

class C {
    fun baz() { ... }

    fun D.foo() {
        bar()   // calls D.bar
        baz()   // calls C.baz
    }

    fun caller(d: D) {
        d.foo()   // call the extension function
    }
}
```

此时，我们称 C 为**调度接收者**，D 为**扩展接收者**。

当扩展名称和类成员冲突时，此时，在**扩展内部**，扩展接收者具有更高优先级；而在**扩展外部**，调度接收者具有更高优先级。

```kotlin
class C {
    fun foo() {
        println("C foo")
    }
}

class D {
    fun foo() {
        println("D foo")
    }

    fun C.fooBar() {
        foo()           // "C foo"
        this@D.foo()    // "D foo"
    }

    fun caller(c: C) {
        c.fooBar()
    }
}

fun main(args: Array<String>) {
    val d = D()
    val c = C()

    d.foo() // "D foo"
    c.foo() // "C foo"
}
```

如果需要在扩展内部访问外部类（即 D），则需要一个带标签的 `this` 来进行。

带标签的 `this` 通常用于内部类来访问外部类。

注意，扩展成员需要使用一个另外的调用器来执行。
在类的外部它是不可见的。

<!-- more -->## 10. 扩展成员的继承

与其他成员一样，扩展成员也可以进行继承和重载操作。
但需要注意的是，**扩展接收者**是静态的，而**调度接收者**是动态的。

即，**扩展接收者不受多态影响**

```kotlin
open class D {
}

class D1 : D() {
}

open class C {
    open fun D.foo() {
        println("D.foo in C")
    }

    open fun D1.foo() {
        println("D1.foo in C")
    }

    fun caller(d: D) {
        d.foo()   // call the extension function
    }
}

class C1 : C() {
    override fun D.foo() {
        println("D.foo in C1")
    }

    override fun D1.foo() {
        println("D1.foo in C1")
    }
}

C().caller(D())   // prints "D.foo in C"
C1().caller(D())  // prints "D.foo in C1" - dispatch receiver is resolved virtually
C().caller(D1())  // prints "D.foo in C" - extension receiver is resolved statically
```

## 11. 开发扩展的动机

提供扩展这一特性主要是为了简化 Java 代码中关于工具类的调用。

将这样的代码

```kotlin
// Java
Collections.swap(
    list,
    Collections.binarySearch(list,Collections.max(otherList)),
    Collections.max(list))
```

转换成这样的

```kotlin
// Java
list.swap(list.binarySearch(otherList.max()), list.max())
```
