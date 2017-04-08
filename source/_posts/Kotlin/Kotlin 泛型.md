---
title: Kotlin 泛型
date: 2017-04-08
categories: Kotlin
tags: Kotlin
---

## 1. 声明和实例化

和 Java 一样，Kotlin 使用类型参数来声明一个泛型类

```kotlin
class Box<T>(t: T) {
  var value = t
}
```

而在实例化时，我们需要显式给出类型参数

```kotlin
val box: Box<Int> = Box<Int>(1)
```

但是，如果类型能够被推断出，那么类型参数可以被省略

```kotlin
val box = Box(1) // 1 has type Int, so the compiler figures out that we are talking about Box<Int>
```

<!-- more -->## 2. Java 中的泛型可变性


在 Java 中，泛型是不可变的。
也就是说 `List<Object>` 不能接受一个 `String` 对象。

```java
// Java
List<String> strs = new ArrayList<String>();
List<Object> objs = strs; // !!! The cause of the upcoming problem sits here. Java prohibits this!

objs.add(1); // Here we put an Integer into a list of Strings

String s = strs.get(0); // !!! ClassCastException: Cannot cast Integer to String
```

但是我们又需要实现一个接受泛型对象的方法，例如 `addAll()`

```java
// Java
// Wrong implementation
interface Collection<E> ... {
  void addAll(Collection<E> items);
}
```

但是由于泛型不可变，这样的实现实际上是错误的。

所以 Java 引入了**通配符**(`?`)，使用 `extends` 和 `super` 来对通配符进行限制。

```java
// Java
// Correct implementation
interface Collection<E> ... {
  void addAll(Collection<? extends E> items);
}
```

### 2.1.1 `<? extends T>` 和 `<? super T>` 的区别

何时使用 `extends` 和 `super`，Java 有一个 PECS 原则。

PECS 的意思是 <b>P</b>roducer <b>E</b>xtends, <b>C</b>onsumer <b>S</b>uper。

即对于生产者，使用 `extends`，
对于消费者，使用 `super`，
如果一个类既要生产，也要消费，那么就不对通配符进行限制。

究其原因，还是得从这两者特性说起。

#### 2.1.1.1 `<? extends T>`

实际上，对于使用了 `<? extends T>` 的类，编译器会阻止向其加入任何的元素。

例如：

```java
List<Apple> apples = new ArrayList<Apple>();
List<? extends Fruit> fruits = apples; //works, apple is a subclass of Fruit.
fruits.add(new Strawberry());        //compile error
```

`fruits` 是一个 `Fruit` 的子类的 `List` ,由于 `Apple` 是 `Fruit` 的子类，因此将 `apples` 赋给 `fruits` 是合法的。

但是编译器会阻止将 `Strawberry` 加入 `fruits`。
因为编译器只知道 `fruits` 是 `Fruit` 的某个子类的 `List`，
但并不知道**究竟是哪个子类**，为了类型安全，只好阻止向其中加入任何子类。

那么可不可以加入 `Fruit` 呢？
很遗憾，也不可以。

但是由于编译器知道 `fruits` 中的元素总是 `Fruit` 的子类，
所以可以安全的将其取出。

```java
Fruit fruit = fruits.get(0);
```

#### 2.1.1.2 `<? super T>`

使用 `super` 的原因其实并不如使用 `extends` 的原因那样复杂。

使用 `super` 只是为了为了保证能向其加入 `T`，或者是对其调用**接受 `T` 作为参数的方法。**

有趣的是，编译器并没有禁止在这种类型上调用 `get()` 方法，
但是需要注意的是，如果调用 `get()`，返回的是 `Object` 而不是具体的 `T` 类型。

所以在 `<? super T>` 对象上，只能进行消费，即调用以 `T` 为参数的方法。

> 神奇的是，虽然类型是 `super`，但是却不能加入一个具体的超类，而可以加入一个具体的子类。

> 其原因就是编译器无法确定加入的超类究竟是哪一个，而 `T` 作为参数时，可以接受一个子类。


## 3. Kotlin 的改进： Declaration-site variance

在 Java 中，如果一个接口**只返回泛型，而不对泛型进行操作**，那么将其赋给超类泛型就是安全的。

```java
// Java
interface Source<T> {
  T nextT();
}

void demo(Source<String> strs) {
  Source<Object> objects = strs; // !!! Not allowed in Java
  // ...
}
```

由于 `Source<T>` 中只有**返回 `T`** 的方法，所以即使对 `objects` 进行操作，也只能返回 `T`，
而 `Object` 是 `T` 的超类或者它本身，所以这是安全的。

但是在 Java 中不允许这样的写法，你依旧要使用 `Sorce<? extends String>`，这显得毫无意义。

在 Kotlin 中，对于这样的情形，定义了 `out` 标识符，使用 `out` 标识符来说明，类、接口**只会返回泛型，而不会接受泛型作为参数。**

```kotlin
abstract class Source<out T> {
  abstract fun nextT(): T
}

fun demo(strs: Source<String>) {
  val objects: Source<Any> = strs // This is OK, since T is an out-parameter
  // ...
}
```

同样的，定义了 `in` 标识符，用于表明类、接口**只会接受 `T` 作为参数，而不会返回它。**

```kotlin
abstract class Comparable<in T> {
  abstract fun compareTo(other: T): Int
}

fun demo(x: Comparable<Number>) {
  x.compareTo(1.0) // 1.0 has type Double, which is a subtype of Number
  // Thus, we can assign x to a variable of type Comparable<Double>
  val y: Comparable<Double> = x // OK!
}
```

与 Java 不同的是，Kotlin 并没有定义一个口诀来帮助记忆，`out` 和 `in` 已经足够说明其属性。

> `out` 代表着类、接口只会**给出**`T`，相当于 `T` 的生产者；
`in` 代表着类、接口只会**接受** `T`，相当于 `T` 的消费者。

> 这些词语的表意性已经十分明确了。

## 4. 类型预测

对于一个既能生产又能消费的类，我们就不能在声明阶段限定它的泛型类型。例如：

```kotlin
class Array<T>(val size: Int) {
  fun get(index: Int): T { /* ... */ }
  fun set(index: Int, value: T) { /* ... */ }
}
```

但是对于如下方法

```kotlin
fun copy(from: Array<Any>, to: Array<Any>) {
  assert(from.size == to.size)
  for (i in from.indices)
    to[i] = from[i]
}
```

这个方法的目的是将一个类的元素复制到另一个类中去，如果进行如下的调用：

```kotlin
val ints: Array<Int> = arrayOf(1, 2, 3)
val any = Array<Any>(3)
copy(ints, any) // Error: expects (Array<Any>, Array<Any>)
```

一个 `Array<Any>` 当然可以接受一个 `Int` 的值，理论上来说这段代码是完全没有问题的。

但是编译器阻止这么使用的原因在于：
`Array<T>` 类既可以生产又可以消费，
如果我们向 `from` 中**添加一个 `Any` 对象**（因为 `from` 的形参是 `Array<Any>`），
但是当前 `from` 是 `Int`， 当然这就会导致 `ClassCastException`。

为了防止这种不安全的事情发生，编译器就禁止了上述操作。

但是，**只要 `from` 不进行消费操作，那么这段代码就是类型安全的。**

所以，Kotlin 除了提供在声明阶段进行泛型限制以外，还可以在调用阶段进行泛型限制。

在 `copy()` 方法中，如果我们限制 `from` 只会生产，而不会消费，那么上面的调用就是安全的了。

```kotlin
fun copy(from: Array<out Any>, to: Array<Any>) {
 // ...
}
```

Kotlin 的这种特性，我们称之为**类型预测**：`from` 不仅仅只是一个简单的 `Array`，而且它受到了限制，它的类型已经被预测了。

同样，我们也可以使用 `in` 来指明一个变量只会消费，而不会生产。

```kotlin
fun fill(dest: Array<in String>, value: String) {
  // ...
}
```

> 事实上， `<out T>` 相当于 Java 的 `<? extends T>`；`<in T>` 相当于 Java 的 `<? super T>`


<!-- more -->## 5. 星号

除了上述的泛型类型限制外，Kotlin 还提供了一个星号类型(`*`)。
这和 Java 的通配符(`?`)很相似，当你不知道具体的泛型类型，而又想使用它时，那么就可以使用星号类型。

具体来说：

- 对于 `Foo<out T>`，`Foo<*>` 意味着 `Foo<out TUpper>`，`TUpper` 指的是 `Foo()` 方法所给定的泛型上界。也就是说当 `T` 是未知的时候，你可以从 `Foo<*>`读取**`T` 的上界**
- 对于 `Foo<in T>`，`Foo<*>` 指的是 `Foo<in Nothing>`，意思是当 `T` 未知时，你不能向 `Foo<*>` 中写入任何东西。
- 对于 `Foo<T>`，`T` 是一个不可变的泛型类型，所以 `Foo<*>` 表示 `Foo<out TUpper>` 和 `Foo<in Nothing>`

一个更为通俗的解释如下：

对于接口声明 `interface Function<in T, out U>`：

- `Function<*, String>` 表示 `Function<in Nothing, String>`
- `Function<String, *>` 表示 `Function<String, out Any?>`
- `Function<*, *>` 表示 `Function<in Nothing, out Any?>`

## 6. 泛型方法

与 Java 一样，Kotlin 中的方法也可以有泛型。

```kotlin
fun <T> singletonList(item: T): List<T> {
  // ...
}

fun <T> T.basicToString() : String {  // extension function
  // ...
}
```

调用方法：

```kotlin
val l = singletonList<Int>(1)
```

<!-- more -->## 7. 泛型约束

与 Java 一样，Kotlin 也拥有泛型约束，这用在当泛型参数 `T` 未知时，用于对 `T` 的类型做出限制，即 `TUpper`

最常用的泛型约束就是上界，Java 中使用 `extends` 来指明上界。

Kotlin 使用 冒号(`:`) 来指明上界。

```kotlin
fun <T : Comparable<T>> sort(list: List<T>) {
  // ...
}
```

用法举例：

```kotlin
sort(listOf(1, 2, 3)) // OK. Int is a subtype of Comparable<Int>
sort(listOf(HashMap<Int, String>())) // Error: HashMap<Int, String> is not a subtype of Comparable<HashMap<Int, String>>
```

默认的上界是 `Any?`（`?` 说明可以为空`nullable`）。

只有**一个**上界可以在尖括号中被指定，如果需要对同一个泛型参数指定多个上界，则需要使用 `where` 语句。

```kotlin
fun <T> cloneWhenGreater(list: List<T>, threshold: T): List<T>
    where T : Comparable,
          T : Cloneable {
  return list.filter { it > threshold }.map { it.clone() }
}
```

注意 `Comparable` 和 `Cloneable` 都是接口。
