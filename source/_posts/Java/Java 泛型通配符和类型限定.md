---
title: Java 泛型通配符和类型限定
date: 2017-04-08
categories: Java
tags: Java
---

## 1. 概述

对于泛型系统而言，最重要的就是能够领过的使用；

所以，Java 增加了 **类型通配符(`?`)**；

使用 `?` 来表示 **任何类型**；

例如：

```java
Pair<? extends Employee>
```

表示 **任何** 是 `Empolyee` 的子类；

<!-- more -->## 2. 与类型参数 `T` 的不同

类型参数 `T` 和 通配符 `?` 似乎都是用于实现泛型灵活性的工具；

但是，实际上它们有着很大的不同

### 2.1 使用位置不同

在泛型中，类型参数 `T` 是一个 **确定的** 类型，

通常用于泛型类和泛型方法的 **定义**，不能用于调用代码。

```java
public static <T extends Number> void
copy(List<T> dest, List<T> src)
```

而通配符是一个 **不确定** 的类型，通常用于泛型方法的 **调用代码** 和形参，不能用于定义类和泛型方法

```java
Pair<? Empolyee> wildcardBuddies = managerBuddies;
```

### 2.2 类型参数保证形参一致性

基于 `T` 是一个确定的类型，那么就可以通过 `T` 来 **确保** 泛型参数的一致性；

例如上面的 `copy()` 方法，使用泛型参数 `T` 就 **确保了** 两个 `List` 的元素类型是 **一致的**；

但是，如果使用如下的代码：

```java
public static void
copy(List<? extends Number> dest, List<? extends Number> src)
```

由于通配符是 **不确定的**，所以这个方法不能保证两个 `List` 具有相同的元素类型

### 2.3 类型参数可以多重限定而通配符不行

类型参数 `T` 可以进行多重限定，如：

```java
T extends A & B & C
```

但是通配符不能进行多重限定，因为它不是一个确定的类型。

### 2.4 通配符可以使用超类限定而类型参数不行

类型参数 `T` 只具有 **一种** 类型限定方式：

```java
T extends A
```

但是通配符 `?` 可以进行 **两种限定**：

```java
? extends A
? super A
```


## 3. 通配符类型限定和继承

对于泛型来说，即使它的类型参数具有继承关系，泛型类之间也是 **没有** 任何关联的；

![](https://ww3.sinaimg.cn/large/006tNc79ly1fdnt9c7mhsj30it0a6dfw.jpg)

但是，通过通配符的限定，就让泛型类之间具有了公有的父类；

例如：

![](https://ww2.sinaimg.cn/large/006tNc79ly1fdntbwn54jj30do0azdft.jpg)

`Pair<? extends Empolyee>` 是 `Pair<Manager>` 和 `Pair<Empolyee> ` 的 **公共超类**；

事实上， `Pair<? extends Empolyee>` 是 `Pair<Empolyee>` 和所有以 `Empolyee` **子类** 为类型参数的泛型类的超类。

对于超类型限定，同理；

```java
? super Empolyee
```

表示类型参数可能是 `Empolyee` 的 **某个超类**；

和子类型限定同理，超类型限定也可以为泛型类建立联系：

![](https://ww1.sinaimg.cn/large/006tNc79ly1fdnusk3uybj30j70h1wek.jpg)

如上，`Pair<? super Manager>` 是 `Pair<Empolyee>` 和 `Pair<Object>` 的共同超类。

需要注意的是，在 `Pair<? super Manager>` 之上，还有一个 **无限定通配符**，指代任何的类型。

## 4. PECS 原则

PECS 原则，指的就是 ***Producer Extends Consumer Super***

意思就是，对于生产者，采用 `? extends`；

对于消费者，采用 `? super`；

对于既可能是生产者有可能是消费者的对象，则 **不做类型限定**。


首先说明所谓的生产者和消费者的主语都是 **数据结构**；

例如：

```java
List<? extends Number> producer;
```

那么，`List` 就是 **生产者**，提供数据，调用 `get()` 方法，外部使用者提取其内部数据。

反过来，对于

```java
List<? super Number> consumer;
```

那么此时，`List` 就是 **消费者**，接收数据，调用 `add()` 方法，外部使用者将数据注入结构中。


实际上，这个原则是为了能够在泛型中提供尽可能的类型安全的写法。

### 4.1 生产者的读方法

```java
List<? extends Number> numbers;
```

这个就是很典型的生产者；

由于使用了上界限定，那么它 **保证** 其中的元素 **一定** 是 `Number`；

所以它可以调用 `get()` 方法；

### 4.2 生产者的写方法

但是此时，生产者不可以使用写方法；

这是因为 `? extends Number` 只是限定了上界；

换句话说也就是 `Number` 的某个 **子类型**；

由于不知道具体是 **哪个** 子类型，所以，也就无法对其进行写入。

那么是否可以写入 `Number` 对象呢？

很可惜，这也是不可以的，因为 `Number` 是上界，很可能由于多态的原因变成了它的某个子类；

所以对于 `? extends` 来说，禁止所有的写入操作。

### 4.3 消费者的读方法

根据原则，具有下面类型的是消费者：

```java
List<? super Number> numbers;
```

对于消费者来说，它接受的是 `Number` 的某个超类型；

那么，由于不清楚是 **哪个** 超类型；

所以，实际上返回的是最终的 `Object` 对象；

这显然对于读取没有什么帮助，如果读到一个 `Object` 类型，用户还需要将其转化为对应的子类型；

这显然是多此一举的。

> 注意，消费者 **并非是禁止** 读操作的访问

### 4.4 消费者的写操作

那么对于写操作如何呢？

```java
List<? super Integer> numbers = new ArrayList<Integer>;
```

此时，对于 `numbers` 来说，可以使用 `add()` 方法加入 `Integer`；

但是，能否加入 `Number` 元素呢？(`Number` 是 `Integer` 的超类)；

很遗憾，这是 **不行的！**；

`numbers` 目前只能写入 `Integer` 及其子类；

> 因为 `Integer` 的子类也是 `Integer` ，数据结构将子类当成 `Integer` 来处理

实际上，你 **无法加入任何的超类！**

如果允许加入 `Number` 甚至是 `Object`，那会造成什么结果呢？

就是一个 `Integer` 的列表中混入了 `Object`；

显然这是不合理的。

那么为什么有必要使用 `? super` 这种多此一举的声明呢？

从超类限定的关系图中我们可以看出，它在泛型类关系中，处于 **超类** 的地位；

所以，我们就可以通过它所提供的 **多态**，来将我们目前存储的数据，加入到一个 **更抽象通用的** 数据结构中。

例如：

```java
public static void count(Collection<? super Integer> ints, int n)
{
       for (int i = 0; i < n; i++) ints.add(i);
}

public static void main(String[] args) {
    List<Integer>ints = new ArrayList<>();
    count(ints, 5);
    assert ints.toString().equals("[0, 1, 2, 3, 4]");

    List<Number>nums = new ArrayList<>();
    count(nums, 5); nums.add(5.0);
    assert nums.toString().equals("[0, 1, 2, 3, 4, 5.0]");

    List<Object>objs = new ArrayList<>();
    count(objs, 5); objs.add("five");
    assert objs.toString().equals("[0, 1, 2, 3, 4, five]");
}
```

虽然我们的 `count()` 方法 **只能** 提供 `Integer` 数据；

但是，由于使用了 `<? super Integer>`，所以我们的数据可以被放入到 `List<Number>` 和 `List<Object>` 中。

**由 `? super` 提供的 **多态支持**，正是我们采用 `Consumer Super` 的关键。**

### 4.5 不做限定

当一个类既可能是生产者，又可能是消费者时；

就不对它的类型作出限定。

注意这里所说的 **不是** 无限定的通配符，而是指的是**普通的类型参数形式(`T`)**。

```java
public class Stack<T>{}
```

## 5. 无限定通配符

有时候我们会使用无限定的通配符。

例如：

```java
Pair<?>
```

此时，它的 `get()` 返回值类型只能是 `Object`；

同时， **不能** 调用 `set()`，即使通过 `Object` 也不能调用。

那么这时有什么用处呢？

我们可以用它实现一些与类型 **无关** 的操作；

如

```java
public static boolean hasNulls(Pair<?> piar) {
    return p.getFirst() == null || p.getSecond() == null;
}
```

因为 `hasNulls()` 方法不需要关心类型是什么；

这个时候我们就可以使用无限定的通配符。

## 6. 通配符捕获

有时候，当我们需要实现一个无限定通配符方法的时候；

有可能遇到需要使用类型参数的问题。

例如：

```java
public static void swap(Pair<?> pair)
```

但是，由于 `?` 不是类型参数，所以我们需要使用一个辅助方法来实现。

```java
public static <T> void swapHelper(Pair<T> pair) {
    T t = pair.getFirst();
    pair.setFirst(p.getSecond());
    pair.setSecond(t);
}
```

那么我们就可以通过下面的方法实现 `swap()` 方法：

```java
public static void swap(Pair<?> pair) {
    swapHelper(pair);
}
```

但是，对于这个例子来说，实现一个辅助方法的确是多此一举；

我们本来就可以通过辅助方法直接实现需求；

那么为什么需要这个技巧呢？

在使用了通配符的时候，不可避免的需要使用到这个技巧：

```java
public static void
maxminBonus(Manager[] a, Pair<? super Manager> result)
{
    minmaxBonus(a, result);
    PairAlg.swap(result);
}
```

由于使用了通配符，那么这个捕获技巧就不可避免的需要了。
