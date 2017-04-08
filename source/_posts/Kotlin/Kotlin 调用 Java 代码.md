---
title: Kotlin 调用 Java 代码
date: 2017-04-08
categories: Kotlin
tags: Kotlin
---

## 1. 概述

Kotlin 完美支持 Java，你可以无缝地在 Kotlin 中引入 Java 库，调用 Java 类等。

```
import java.util.*

fun demo(source: List<Int>) {
  val list = ArrayList<Int>()
  // 'for'-loops work for Java collections:
  for (item in source)
    list.add(item)
  // Operator conventions work as well:
  for (i in 0..source.size() - 1)
    list[i] = source[i] // get and set are called
}
```

<!-- more -->## 2. 调用 getter 和 setter

Java 中的 getter 和 setter 在 Kotlin 中都会被转换为 Kotlin 的格式，即只需要直接引用属性值即可。

```kotlin
import java.util.Calendar

fun calendarDemo() {
    val calendar = Calendar.getInstance()
    if (calendar.firstDayOfWeek == Calendar.SUNDAY) {  // call getFirstDayOfWeek()
        calendar.firstDayOfWeek = Calendar.MONDAY       // call setFirstDayOfWeek()
    }
}
```

## 3. 返回 `void` 的方法

Java 中返回 `void` 的方法，在 Kotlin 中会转换为返回 `Unit`

## 4. 转义 Java 方法

Kotlin 中拥有一些 Java 没有的关键字（比如 `is` `in` `object` 等）。
对于这些关键字，如果 Java 代码中有相同的方法名或变量名，可以通过对其进行转义来调用它。

使用 ` `` ` 来进行转义工作。

```kotlin
foo.`is`(bar)
```

## 5. Null Safety 和 Platform Type

在 Java 中，任何引用都有可能为空，但是在 Kotlin 中，严格的类型系统不允许空值。

对于这种冲突，Kotlin 采用 Platform Type，也就是说在 Java 代码中的引用，Kotlin 类型系统会对其放松限制。

所以它们的安全性保障就和在 Java 代码中一样。

对于 Platform Type，我们可以使用一个 nullable 的 Kotlin 类型来承接它，也可以使用 non-nullable 对象。

```
val nullable: String? = item // allowed, always works
val notNull: String = item // allowed, may fail at runtime
```

当我们使用 non-null 对象来承接 Platform Type 时，
Kotlin 会自动在赋值语句上方插入断言，来保证 Kotlin 变量的非空性。

同样的，当我们把 Platform Type 传个一个接受非空类型的函数参数时，
Kotlin 也会自动在函数调用前插入断言语句。

不过有时候也不一定会进行断言，特别是在使用泛型的时候。

## 6. Platform Type 的符号

由于 Platform Type 不能被显式确定，所以没有关于它们的语法。

但是有时候 IDE 需要生成函数提示，所以对于 Platfrom Type 也有一些符号用于说明。

- `T!` 表示 `T` 或者 `T?`
- `(Mutable)Collection<T>!` 表示关于 `T` 的 Java 集合，可能会被修改，也可能不会；可能为空，也可能不会
- `Array<(out) T>!`  表示关于 `T` 或者其子类型的 Java 数组，有可能为空，也可能不为空。

<!-- more -->## 7. Nullability 注解

使用了注解表明 nullability 的 Platform Type 会被当做真正的 Kotlin 变量来处理。

Kotlin 目前支持以下注解：

- JetBrains (`@Nullable` and `@NotNull` from the  `org.jetbrains.annotations package`)
- Android (`com.android.annotations` and `android.support.annotations`)
- JSR-305 (`javax.annotation`)
- FindBugs (`edu.umd.cs.findbugs.annotations`)
- Eclipse (`org.eclipse.jdt.annotation`)
- Lombok (`lombok.NonNull`).

## 8. 类型的对应关系

由于 Kotlin 中没有原始类型，所以对于 Java 的原始类型，会被自动转换成对应的 Kotlin 类。

这个转换只会发生在**编译期间**，在运行期间是不变的，会保持 Platfrom Type。

Java type | Kotlin type
--- | ---
`byte` | `kotlin.Byte`
`short` | `kotlin.Short`
`int` | `kotlin.Int`
`long` | `kotlin.Long`
`char` | `kotlin.Char`
`float` | `kotlin.Float`
`double` | `kotlin.Double`
`boolean` | `kotlin.Boolean`

一些非原始类型的类也会被转换

Java type | Kotlin type
--- | ---
`java.lang.Object` | `kotlin.Any!`
`java.lang.Cloneable` | `kotlin.Cloneable!`
`java.lang.Comparable` | `kotlin.Comparable!`
`java.lang.Enum` | `kotlin.Enum!`
`java.lang.Annotation` | `kotlin.Annotation!`
`java.lang.Deprecated` | `kotlin.Deprecated!`
`java.lang.Void` | `kotlin.Nothing!`
`java.lang.CharSequence` | `kotlin.CharSequence!`
`java.lang.String` | `kotlin.String!`
`java.lang.Number` | `kotlin.Number!`
`java.lang.Throwable` | `kotlin.Throwable!`

集合类型在 Kotlin 有可变和不可变两种类型，
所以 Java 的集合类型也会进行相应的转换。

Java type | Kotlin read-only type | Kotlin mutable type | Loaded platform type
--- | --- | --- | ---
`Iterator<T>` |`Iterator<T>`|`MutableIterator<T>`|`(Mutable)Iterator<T>!`
`Iterable<T>`|`Iterable<T>`|`MutableIterable<T>`|`(Mutable)Iterable<T>!`
`Collection<T>`|`Collection<T>`|`MutableCollection<T>`|`(Mutable)Collection<T>!`
`Set<T>`|`Set<T>`|`MutableSet<T>`|`(Mutable)Set<T>!`
`List<T>`|`List<T>`|`MutableList<T>`|`(Mutable)List<T>!`
`ListIterator<T>`|`ListIterator<T>`|`MutableListIterator<T>`|`(Mutable)ListIterator<T>!`
`Map<K, V>`|`Map<K, V>`|`MutableMap<K, V>`|`(Mutable)Map<K, V>!`
`Map.Entry<K, V>`|`Map.Entry<K, V>`|`MutableMap.MutableEntry<K,V>`|`(Mutable)Map.(Mutable)Entry<K, V>!`


同样的，Java 的数组也会进行转换

Java type | Kotlin type
--- | ---
`int[]` | `kotlin.IntArray!`
`String[]` |`kotlin.Array<(out) String>!`

<!-- more -->## 9. Java 泛型

Kotlin 中的泛型系统和 Java 有些不同，所以当使用的 Java 代码存在泛型时，做如下转换：

- Java 泛型通配符被转换成类型预测
    - `Foo<? extends Bar>`  转换为 `Foo<out Bar!>!`
    - `Foo<? super Bar>` 转换为 `Foo<in Bar!>!`

- Java 的原始类型被转换成星形预测
    - `List` 转换为 `List<*>!`，也就是 `List<out Any?>!`

和 Java 一样，Kotlin 的泛型在运行期间是不会保留的。
也就是说对象在构建的时候不会携带泛型的真正类型的信息。
也就说说 Kotlin 不能区分 `ArrayList<Integer>` 和 `ArrayList<Character>`。

这限制了 `is` 语句的使用，对于泛型，`is` 只能用于星形预测类型的检查，而不能应用于其他普通泛型类型的检查。

```kotlin
if (a is List<Int>) // Error: cannot check if it is really a List of Ints
// but
if (a is List<*>) // OK: no guarantees about the contents of the list
```

## 10. Java 数组

与 Java 不同，数组在 Kotlin 中是不可变的。
也就是说 Kotlin 不允许将 `Array<Int>` 赋予 `Array<Any>`，这避免了一些运行期间的错误。

同样的，Kotlin 也不允许一个子类的数组传入一个超类数组的形参中。

在 Java 平台中，使用原生类型的数组能避免装箱和拆箱所带来的性能损失；
但是在 Kotlin 中，这些细节被隐藏了起来，所以在调用 Java 代码时就需要一些特殊方法来进行沟通。

Kotlin 对此为每个原始类型都提供了一个对应的数组类型，例如 `IntArray` `LongArray` `CharArray` 等，这些类和 `Array` 类**没有关系**。

在编译时，这些数组类型会被编译为 Java 的原生类型数组，以提高性能。

> `IntArray` 和 `Array<Int>` 的区别：

> `IntArray` 相当于 Java 中的 `int[]`，不进行装箱和拆箱操作；
`Array<Int>` 相当于 Java 中的 `Integer[]`，进行装箱和拆箱操作。

> see [here](http://stackoverflow.com/a/35253626/5730641)

所以对于一个接受 `int[]` 的 Java 方法

```java
public class JavaArrayExample {

    public void removeIndices(int[] indices) {
        // code here...
    }
}
```

我们可以使用 `IntArray` 将参数传入：

```kotlin
val javaObj = JavaArrayExample()
val array = intArrayOf(0, 1, 2, 3)
javaObj.removeIndices(array)  // passes int[] to method
```

当代码被编译为 JVM 字节码时，编译器会对以上类型进行优化，取消 getter 和 setter 的使用，而是**直接取值赋值**。

```kotlin
val array = arrayOf(1, 2, 3, 4)
array[x] = array[x] * 2 // no actual calls to get() and set() generated
for (x in array) // no iterator created
  print(x)
```

同样，在遍历这样的一个数组时，不会创建 `iterator`。

```kotlin
for (i in array.indices) // no iterator created
  array[i] += 2
```

最后，在 `in` 语句中，对于这样的数组也不会调用 `contains()` 方法。

```kotlin
if (i in array.indices) { // same as (i >= 0 && i < array.size)
  print(array[i])
}
```

<!-- more -->## 11. Java 不定参数

对于 Java 的不定参数，你需要像 Kotlin 中一样，使用 spread operator(`*`) 来传入一个数组。

```java
public class JavaArrayExample {

    public void removeIndices(int... indices) {
        // code here...
    }
}
```

```kotlin
val javaObj = JavaArray()
val array = intArrayOf(0, 1, 2, 3)
javaObj.removeIndicesVarArg(*array)
```

## 12. 操作符

由于 Java 没有操作符重载，所以 Kotlin 允许将任何的拥有正确命名和函数参数的 Java 方法**当做操作符重载使用**。

不过不允许在中缀函数中调用 Java 方法。

## 13. 已检查异常

由于 Kotlin 没有已检查异常，所以 Kotlin 不会强制要求你进行异常捕获；
即使你调用的 Java 方法声明了已检查异常**也一样**。

## 14. Java Object 类方法

引用 Java 代码时，Java 的 `Object` 类会被转换成 `Any`；
但是 `Any` 类只声明了 `toString()`，`hashCode()` 和 `equals()`方法，
所以，为了完整实现 `Object` 类的功能，我们使用**扩展**来实现。

### 14.1 `wait()` 和 `notify()`

《Effective Java》第 69 条中强调：尽量使用多线程工具而不是使用 `wait()` 和 `notify()` 方法；
所以 `Any` 类中并没有实现这两个方法。

但是如果你真的需要使用这两个方法，可以把 `Any` 造型为 `Object` 来使用。

```kotlin
(foo as java.lang.Object).wait()
```

### 14.2 `getClass()` 方法

在 Kotlin 中，我们使用 `javaClass` 变量来获取对应的 `Class` 变量。

```kotlin
val fooClass = foo.javaClass
```

对于 Java 中的 `Foo.class`，Kotlin 中使用 `Foo::class.java`

```kotlin
val fooClass = Foo::class.java
```

### 14.3 `clone()` 方法

要重载 `clone()` 方法，你的类必须实现 `kotlin.Cloneable`：

```kotlin
class Example : Cloneable {
  override fun clone(): Any { ... }
}
```

不要忘记 《Effective Java》的忠告，第 11 条：**明智地重载 `clone()` 方法**

### 14.4 `finalize()` 方法

要重载 `finalize()` 方法，你只需要声明它即可，而不需要使用 `override` 。

```kotlin
class C {
  protected fun finalize() {
    // finalization logic
  }
}
```

注意，`finalize()` 不能是 `private` 的。

## 15. 继承 Java 类

只能继承一个基类；
可以实现多个接口。

## 16. 访问静态成员

Java 类的静态成员会被自动转换成这个类的伴生对象。

我们不能直接将这个伴生对象作为参数或者变量；
但是我们依旧可以显式的调用它的静态成员。

```java
if (Character.isLetter(a)) {
  // ...
}
```

## 17. Java 反射

Java 的反射机制可以应用于 Kotlin 上，反之亦然。
刚才也提到，你可以使用 `instance.javaClass` 或者 `ClassName::class.java` 来使用 Java 的反射机制。

同样的，Kotlin 也支持使用 Java 方法来生成 getter、setter 和 backing field。
`KProperty` 指代 Java 的字段，`KFunction` 指代 Java 方法，反之亦然。

## 18. SAM 方法

和 Java 8 一样，Kotlin 也支持 SAM 类型，这意味着 Kotlin 的直接函数定义（lambda 函数主体）可以被转换为一个只有单个方法的接口实现，只要函数接口能够对应的上的话，转换就能成功。

```kotlin
val runnable = Runnable { println("This runs in a runnable") }
```

也可以应用于方法调用中：

```kotlin
val executor = ThreadPoolExecutor()
// Java signature: void execute(Runnable command)
executor.execute { println("This runs in a thread pool") }
```

如果一个 Java 类有多个这种方法的重载，那么我们可以通过对 SAM 类型指定对应的转换器。

```kotlin
executor.execute(Runnable { println("This runs in a thread pool") })
```

注意，SAM 只能应用于**接口**，而不能应用于抽象类，即使这个类只有一个方法。

还有，这个特性只支持 Java 代码，
Kotlin 拥有相应的函数类型，所以将其转换为 Kotlin 接口的实现是非必须的，所以也没有实现这个特性。

## 19. 使用 JNI

通过 `external` 关键字来指明一个方法会调用 native 的 C 或者 C++ 代码。

```kotlin
external fun foo(x: Int): Double
```

## 20. 其他方面

在其他方面，Kotlin 和 Java 工作程序一致。
