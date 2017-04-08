---
title: Java 集合框架 Collection
date: 2017-04-08
categories: Java
tags: Java
---

## 1. 概述

`Collection` 接口是 Java 集合框架最基本的接口；

它提供了基本的元素操作方法和遍历使用的迭代器；

同时，它还提供了关于 `Collection` 的批量操作方法。

<!-- more -->## 2. 基本操作

基本的元素操作包括 `add()` 和 `remove()`，同时也包括 `size()` 和 `isEmpty()` 等一系列的集合基本操作。

其中 `add()` 和 `remove()` 的返回值是 `boolean`；

这个布尔值用于表示增加和删除是否成功。（是否对集合本身进行了操作）

## 3. 遍历操作

Java 的 Collection 遍历操作有三种：

1. 使用迭代器 `Iterator`
2. 使用 _for each_ 循环
3. 使用 `Stream` 的聚合操作(Java 8)

实际上，使用 _for each_ 循环和使用迭代器是一样的；

_for each_ 可以应用于任何实现了 `Iterable` 接口的类：

```java
public ineterface Iterable<E> {
    Iterator<E> iterator();
}
```

_for each_ 实际上就是应用它返回的迭代器进行遍历操作。

关于 `Stream` 用单独的一篇文章介绍，这里主要解析迭代器的工作。

## 4. 迭代器的遍历

```java
public interface Iterator<E> {
    E next();
    boolean hasNext();
    void remove();
}
```

其中，`next()` 方法返回下一个元素，`hasNext()` 方法用于检测是否到达了集合末尾。

当到达了集合末尾时，调用 `next()` 会抛出 `NoSuchElementException`，所以，正确的写法是在循环时使用 `hasNext()` 作为判断条件：

```java
while(iter.hasNext()) {
    element = iter.next();
}
```

其中，`Collection` 接口已经扩展(extends)了 `Iterable` 接口，所以自带 `iterator()` 方法。

元素被访问的顺序取决于集合类的具体实现。

比较特别的是，Java 中的迭代器和 C++ 中的迭代器不一样；

C++ 中的迭代器是基于索引的，可以不执行查找操作就将迭代器进行移动；

相反，Java 中的迭代器更类似于 `read()` 方法，迭代器的查找操作和移动操作紧密相连；

Java 中的迭代器更类似于是 **位于两个元素之间**，调用 `next()` 将越过一个元素，并返回这个元素的引用。

## 5. 迭代器的删除

比较特别的是，`Iterator` 接口还提供了一个 `remove()` 方法；

它会删除 **上次** 调用 `next()` 的元素；

也就是说，如果你想删除某个位置上的元素，你的迭代器就必须 **先越过** 这个元素。

```java
Iterator<String> it = c.iterator();

iter.next();    //skip over the first
iter.remove();  // delete the first
```

需要注意的是，`next()` 和 `remove()` 是具有依赖性的；

**不能连续调用两次 `remove()`**，否则，将会抛出 `IllegalStateException`

```java
iter.remove();
iter.remove();
```

必须先调用 `next()` 来越过将要删除的元素。

## 6. 批量操作

Collection 同时提供了一套批量操作方法，用于对另一个集合进行操作，主要的方法有：

1. `containsAll()`

    > 判断另一集合是否为本集合的子集
    > （本集合是否完全包含了另一集合）

2. `addAll()`

    > 将另一集合的所有元素加入到本集合中

3. `removeAll()`

    > 将本集合中含有的 另一集合中的所有元素 从本集合中删除

4. `retainAll()`

    > 将本集合中 **不属于**  另一集合的所有元素从本集合中删除
    > 即，将本集合改造成两个集合的 **交集**

4. `clear()`

    > 删除本集合中的所有元素

## 7. 和数组的转换操作

`Collection` 存在一个 `toArray()` 方法；

但是，比较坑爹的是，这个方法仅仅只返回一个 `Object[]`；

```java
Object[] a = c.toArray();
```

这显然没有什么卵用，因为 `Object[]` 是 **新构建的**，它不能强制转换成更为具体的数组。

所以，我们需要采用另一个 `toArray(T[] a)` 方法；

```java
// 写法一
String[] stringArray = c.toArray(new String[0]);
```

实际上，我们可以直接向 `toArray()` 提供一个足够大的数组：

```java
// 写法二
String[] stringArray = c.toArray(new String[c.size()]);
```

那么这两种写法有什么区别呢？

根据 JDK 文档，当数组参数的空间不够大时，它会自动重新构建一个足够大的数组进行元素转存；

当数组空间足够大时，`toArray()` 就不自己构建数组了，而是直接将元素储存到数组中。

这样看来，写法一好像没有什么必要，毕竟都要创建数组，不如直接创建了事，何必要多出一个无用的数组呢？

实际上，写法二具有线程安全问题；

即使你使用线程安全的 `Collection`，但是当有元素在 `size()` 和 `toArray()` 之间被删除了，那么最终生成的数组就会包含 `null`。

而，写法一就可以直接避免这个问题。

> 线程安全的 `Collection` 只保证每个方法是线程安全的，当你调用两个以上的方法联合使用时，就不具备线程安全了。

Reference: [The easiest way to transform collection to array?](http://stackoverflow.com/questions/3293946/the-easiest-way-to-transform-collection-to-array#comment66730178_3293970)
