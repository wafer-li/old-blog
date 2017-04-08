---
title: Java 泛型基础
date: 2017-04-08
categories: Java
tags: Java
---

## 1. 概述

泛型类似于 C++ 中的模板，使得编写的代码可以被多种不同的对象所使用。

在 Java 增加泛型类之前，泛型实际上是以**继承**方式实现的

泛型使用类型参数来指示元素的类型

```java
ArrayList<String> files = new ArrayList<String>();

// Java SE 7 之后可以省略构造函数中的泛型类型
ArrayList<String> files = new ArrayList<>();
```

<!-- more -->## 2. 泛型类

1. 单个参数

    ```java
    // 其中 T 为类型参数
    public class Pair<T> {}
    ```

2. 多个参数

    ```java
    // 多个类型参数用逗号隔开
    public class Piar<T, U> {}
    ```

## 3. 泛型方法

泛型方法不仅只存在于泛型类中，也可以在非泛型类中定义泛型方法

```java
class ArrarAlg {

    /**
    * 这是一个泛型方法，
    * <T> 表示其为泛型方法
    */
    public static <T> T getMiddle(T... a) {}
}
```

调用泛型方法时，通过在**方法名前**的尖括号中放入具体的类型来将其实例化

```java
String middle = ArrayAlg.<String>getMiddle("John", "Q.", "Public");
```

其实大多数情况下，编译器都能推断出正确的类型，所以方括号可以省略

## 4. 类型变量的限定

有时候我们需要对类型变量进行一定的约束:

比如，当我们需要对变量进行比较操作时，我们需要确保变量都实现了 `Comparable` 接口。

对于类型变量的限定有两种方式

1. 限定上界

    ```java
    public static <T extends Comarable> T min(T[] a) ...
    ```

    > 这里我们限定了 T 必须是实现了 Comarable 接口的变量。
    如果 Comarable 是一个类，那么 T 必须是它，或者它的子类

2. 限定下界

    ```java
    public static <T super Child> T doSomeThings(T[] a) ...
    ```

    > 这里限定了 T 必须是 Child 的超类，或者它本身。

使用 `&` 分隔限定类型，使用逗号来分隔 类型参数

```java
T extends Comparable & Serializable
```

## 5.泛型类的实例化

### 5.1 类型擦除

Java 中的泛型类采用 **类型擦除** 方式来进行实例化。

> 类型擦除即为，擦除类型参数，并将其替换为限定的类型。
> 例如上面的 `T extends Comparable` 则在类中的 `T` 会被替换为 `Comparable`
>
> 如果类型没有被限定，则替换为 `Object`

需要注意的是，虚拟机中没有泛型类型变量，任何的泛型类在需要实例化的时候，都会先进行**类型擦除**，然后替换为实例化的类型。

例如， `Pair<T>` 的原始类型如下

```java
public class Pair {
    private Object first;
    private Object second;

    public Pair() {
        first = null;
        second = null;
    }

    public Object getFirst() {
        return this.first;
    }

    public Object getSecond() {
        return this.second;
    }
}
```

通过类型擦除的方法，Java 使得泛型类就好像一个普通的类，从而避免了 C++ 模板实例化所造成的代码膨胀。

### 5.2 翻译泛型表达式

当程序调用泛型方法时， Java 采用强制类型转换（Cast）来返回或调用正确的类型

例如

```java
Pair<Employee> buddies = ...;
Employee buddy = buddies.getFirst();
```

此时，编译器自动插入强制类型转换使得 `getFirst()` 方法返回 `Employee` 类型

### 5.3 泛型方法的实例化和桥方法

泛型方法在实例化过程中也使用 **类型擦除**
但是这在继承中会导致方法的冲突。

例如：

```java
class DateInterval extends Pair<Date> {
    public void setSecond(Date second) { ... }
}

// 经过类型擦除之后
class DateInterval extends Pair {
    public void setSecond(Date second) { ... }
}
```

当使用基类指针实现多态性的时候

```java
Pair<Date> pair = interval;
pair.setSecond(aDate);
```

此时，存在一个从 `Pair` 继承而来的方法

```java
public void setSecond(Object second)
```

由于**形式参数的改变**，使得这是一个不同的方法；
但是我们对 `pair` 的多态性描述显然是要调用 `setSecond(Date second)` 方法；
此时，编译器就会自动生成一个桥方法，用来保证多态的正确使用。

```java
// 桥方法
public void setSecond(Objedt second) {
    setSecond((Date) second);
}
```

## 6. 约束和局限性

### 6.1 不能用基本类型实例化类型参数

由于泛型使用**类型擦除**来实现，所有的未限定类型均会被替换成 `Object`；

而 `Object` 不能储存基本类型

此时一般使用对象包装器来实现基本类型的实例化

### 6.2 运行时的类型查询只适用于原始类型

由于使用了类型擦除，所有的类型查询都只对泛型类的**原始类型**适用，而对泛型版本不适用。

`instanceof` 和 `getClass()` 返回的都是原始类型

### 6.3 不能创建参数化类型的数组

创建泛型类的**数组**是不合法的。

由于类型擦除的存在，所有的未限定泛型类都会被替换成 `Object`。

例如

```java
Pair<String>[] table = new Pair<String> [10];   // ERROR
// After erase
Pair[] table = new Pair[10];
```

此时，如果有下面的一条语句

```java
Object[] objects = table;   // OK, Pair is a type of Object

// But, if edit one of the elements
objects[0] = "Hello";   // ERROR, because the objects[0] is Pair, not String
```

当需要收集参数化类型对象时，使用 `ArrayList` 来代替数组实现

如果实在需要创建泛型类的数组，那么就必须使用 **强制转换**。

```java
Pair<String> p = (Pair<String>[]) new Object[10];
```

### 6.4 Varargs 警告

当使用可变参数的泛型类作为形参时，由于可变类型是一个数组，此时违反了上面一条规则。

但是对于这种情况，规则有所放松，使用这个会得到一个**警告**，可以用 `@SafeVarargs` 注解来压制这个警告

```java
@SafeVarargs
public static <T> void addAll(Collection<T> coll, T... ts)
```

### 6.5 不能实例化类型变量

所谓的类型变量指的是 `T`

不能使用  `new T(...)` 类似这样的表达式

而是通过反射调用 `Class.newInstance` 来构造新的 `T` 对象；

不过，很遗憾的是，不能通过 `T.class.newInstance()` 来实现；

调用 `newInstance()` 的 `Class` 对象必须由 **外部传入**：

```java
public static <T> Pair<T> makePair(Class<T> clazz) {
    try {
        return new Pair<>(clazz.newInstance(), clazz.newInstance());
    }
    catch (Exception e) {
        return null;
    }
}
```

### 6.6 不能构造泛型数组

指的是不能构造 `T[]`；

```java
T[] array = new T[2];   // ERROR!
```

如果一定要使用数组，则必须进行强制转换：

```java
T[] array = (T[]) new Object[2];
```

需要注意的是，这种数组不能作为返回值：

```java
public static <T> T[] minmax(T... a) {
    Object[] mm = new Object[2];
    ...
    return (T[]) mm;
}
```

在调用的时候，会出现 `ClassCastException`：

```java
// Exception！
String[] ss = minmax("Tom", "Dick", "Harry");
```

这是因为类型擦除的问题；

对于虚拟机而言，虚拟机知道每个元素的具体类型，所以做元素层次的强制转换是没有问题的：

```java
public T get(int index) {
    // T[] items
    return items[index]; // OK
}
```

但是对于数组本身而言，由于类型擦除导致实际上的数组的 **声明** 是 `Object[]`，可以接受任何的类型，所以无法将其强制转换为特定类型的数组。

也就是说，对于一个 `String` 数组，可以将其转换为 `Object` 数组再转换回去；

但是由于类型擦除导致 **一开始** 数组的声明就是 `Object[]`；

所以无法将其转换为特定类型。

对于这种情况，就需要使用泛型的 `Array.newInstance()`；

通过 `Class.getComponentType()` 来获取到元素的真实类型。

```java
public static <T> T[] minmax(T... a) {
    T[] mm = (T[]) Array.newInstance(a.getClass().getComponentType(), 2);
}
```

### 6.7 泛型类静态成员类型参数无效

在泛型类中，不能在静态域或者方法中引用类型变量。

```java
public class Singleton<T> {
    private static T singleInstance; // ERROR
}
```

这也是因为类型擦除，`Singleton<String>` 会恢复为 `Singleton`；

而对于一个所有实例都共享的方法或者域，它不能仅仅依赖于某一个类型。

### 6.8 不能抛出或捕获泛型类对象

不能抛出和捕获 **泛型类**，同时，也不允许泛型类扩展 `Throwable`。

```java
// ERROR
public class Problem<T> extends Exception {
    /* ... */
}
```

同时，`catch` 块中也不能使用类型变量 `T`

```java
try {
    // do work
}
catch(T e) {
    // ERROR
}
```

不过可以在 `throws` 中使用类型变量 `T`

```java
@SuppressWarnings("unchecked")
public static <T extends Throwable> void throwAs(Throwable e)
throws T
{
    throw (T) e
}
```

在这种情况下，编译器会认为 `T`  是一个 **未检查异常**

### 6.9 注意擦除后的冲突

类型擦除很可能会引发和超类型的冲突；

例如有这么一个方法：

```java
public class Pair<T> {
    public boolean equals(T value) {
        return first.equals(value) && second.equals(value);
    }
}
```

这个方法在类型擦除之后，会变成：

```java
boolean equals(Object value)
```

然而，这个方法和超类继承而来的：

```java
// Object 继承而来的！
boolean equals(Object)
```

出现冲突。

此时，只能改名解决。

同时，还必须注意类和它的子类不能实现两个不同 **类型参数 `T`** 的接口：

```java
class Calendar implements Comparable<Calendar> {...}

class GregorianCalendar extends Calendar
implements Comparable<CregorianCalendar>
{...}
```

这里，`Calendar` 类和它的子类 `GregorianCalendar` 实现了两个不同类型参数的接口；

这会导致合成的桥方法出现错误；

对于实现了 `Comparable<X>` 的类，可以获得一个桥方法：

```java
public int comparaTo(Object other) {
    return compareTo((X) other);
}
```

但是，由于 `GregorianCalendar` 同时实现了两个类型参数不同的同一个泛型接口；

所以就会有两个 **相同签名** 的桥方法，而这是不允许的。

## 7. 泛型类的继承

在使用泛型类时，需要注意的是它的继承规则和直觉不同；

例如， `Employee` 和 `Manager` 是父类和子类；

但是 `Pair<Manager>` **不是** `Pair<Employee>`  的子类

![](https://ww3.sinaimg.cn/large/006tNc79ly1fdnqlhl1f9j30ce0ey74h.jpg)


> 这里体现出来泛型和数组的一个重要区别；
> 对于一个数组来说，可以将 `Manager[]` 赋给 `Employee[]`。
>
> 不过如果尝试将一个低级别的 `Employee` 插入到多态的 `Employee[]` 中，则会抛出 `ArrayStoreException`
