---
title: Kotlin 类属性和域
date: 2017-04-08
categories: Kotlin
tags: Kotlin
---

## 1. 声明和调用

声明类中的属性和值很简单，类似 Java，使用 `var` 声明变量，使用 `val` 声明常量。

```kotlin
public class Address {
  public var name: String = ...
  public var street: String = ...
  public var city: String = ...
  public var state: String? = ...
  public var zip: String = ...
}
```

> 注意，变量默认为 `public` 属性。

由于变量默认为 `public`，所以直接使用类成员运算符(`.`)，即可调用其属性和方法。

```kotlin
fun copyAddress(address: Address): Address {
  val result = Address() // there's no 'new' keyword in Kotlin
  result.name = address.name // accessors are called
  result.street = address.street
  // ...
  return result
}
```

需要说明的是，在编译时，系统会**自动生成默认的 Getter 和 Setter**。

下面的写法
```kotlin
class Foo {
    var bar: Int = 1;
}
```

和以下 Java 代码是**等同的。**

```kotlin
class Foo {
    private int bar = 1;

    public int getBar() {
        return bar;
    }

    public void setBar(int value) {
        this.bar = value;
    }
}
```

同时，在访问和修改时，系统会调用变量的 getter 和 setter 来进行，**而不是直接取值和改值。**

除此之外，Kotlin 的变量在使用前必须被初始化，否则编译器将报错。


<!-- more -->## 2. Getter 和 Setter

定义一个类属性的完整语法如下：

```kotlin
var <propertyName>: <PropertyType> [= <property_initializer>]
  [<getter>]
  [<setter>]
```

可以看到，初始化，Getter 和 Setter 都是可选项。

需要注意的是，虽然在这里，初始化是可选项，但是这并不意味着变量不需要被初始化。

实际上，Kotlin 中的变量在被使用前**必须被初始化！**
特别的，一个类中的属性无论何时都要被初始化。

> 这实际上是 Kotlin 的主旨之一，即，尽量使得过程显式化。


```kotlin
var allByDefault: Int? // error: explicit initializer required, default getter and setter implied
var initialized = 1 // has type Int, default getter and setter
```

### 2.1 改变 Getter 和 Setter 的可见性

如果只需要改变可见性而不需要改变默认的 getter 和 setter，只需要在 `get` 或者 `set` 之前加上可见性修饰符即可，
而不需要定义其主体。


```kotlin
var setterVisibility: String = "abc"
  private set // the setter is private and has the default implementation

var setterWithAnnotation: Any? = null
  @Inject set // annotate the setter with Inject
```


### 2.2 自定义 Getter 和 Setter

自定义 getter 和 setter 很简单，只需要在变量下方使用 `get` 和 `set` 即可。

```kotlin
var stringRepresentation: String
  get() = this.toString()
  set(value) {
    setDataFromString(value) // parses the string and assigns values to other properties
  }
```

事实上， Kotlin 没有**域**这一属性，即**不允许直接取值和赋值。**

但为了自定义 getter 和 setter，又必须提供一个直接的取值和赋值的途径，
对此，Kotlin 采用了一个名为 **backing field** 的特性，
即，只允许在 getter 和 setter 中使用 `field` 这一变量作为直接取值和赋值的途径。

backing field 会在如下条件下生成：

- 变量进行了初始化
- 使用了 `field` 变量

```kotlin
var counter = 0 // the initializer value is written directly to the backing field
  set(value) {
    if (value >= 0)
      field = value
  }
```

如果 backing field 不能满足需求，Kotlin 还提供了 **backing property** 特性。

```kotlin
private var _table: Map<String, Int>? = null
public val table: Map<String, Int>
  get() {
    if (_table == null)
      _table = HashMap() // Type parameters are inferred
    return _table ?: throw AssertionError("Set to null by another thread")
  }
```

实际上就是使用另一个 `private` 变量来帮助实现自定义的 getter 和 setter。

## 3. 编译时常量

> 编译时常量指的是，**在编译时就能确定的常量**，也就是**不需要依赖其他类的常量**

> 以Java为例， `static final int a = 1` 将是一个编译时常量，编译后的符号表中将找不到 `a` ，所有对 `a `的引用都被替换成了 `1`。
而 `static final int b = "test".length()` 将是一个运行时常量。

Kotlin 中使用 `const` 标识符来指定编译时常量，JVM 将对这些变量进行优化，提高它们的运行速度。

编译时常量必须满足如下条件：

- 声明在 Top-level，或者是一个 object 的成员
- 使用原始类型或者 `String` 进行初始化
- 没有自定义的 getter

编译时常量可以使用在注解中。

```kotlin
const val SUBSYSTEM_DEPRECATED: String = "This subsystem is deprecated"

@Deprecated(SUBSYSTEM_DEPRECATED) fun foo() { ... }
```

<!-- more -->## 4. 延迟初始化

一般来说，类中的属性必须被初始化，但是也有时需要通过注入或者 `@SetUp` 在 JUnit 中进行初始化。

对此 Kotlin 提供一种特性称作**延迟初始化**，使用 `lateinit` 标识符可以指明一个变量需要延迟初始化。

```kotlin
public class MyTest {
    lateinit var subject: TestSubject

    @SetUp fun setup() {
        subject = TestSubject()
    }

    @Test fun test() {
        subject.method()  // dereference directly
    }
}
```

延迟初始化只能应用在 `var` 中（而不能在 primary constructor 中）。
延迟初始化的变量不能拥有自定义的 getter 和 setter，同时，它的类型也不能是原始类型。
