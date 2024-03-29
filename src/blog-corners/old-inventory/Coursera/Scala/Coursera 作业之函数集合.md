---
title: Coursera 作业之函数集合
date: '2017-04-17 02:41'
tags:
  - Coursera
  - Scala
category: Coursera

mathjax: true
---


> 本文源码：
> https://github.com/wafer-li/scala-coursera/tree/master/funsets


## 1. 背景知识

该作业是实现一个函数集合的相关内容。

何为函数集合？

一般来说，编程语言中的集合(Collection)都是有限集合；

但是，在数学上，还有很多的集合是无限集合，比如说 **负数集**；

我们有没有一种办法去表示这个集合呢？

<!-- more -->

当然有的，对于上面的负数集来说，我们如何知道一个数字是不是负数集中的元素呢？

将它与 0 进行比较，如果 x < 0，那么它就是负数集的元素。

此时，`(x) => x == 0` 就成为了负数集的判断标准，我们将其作为负数集的 **特征函数**，通过特征函数来指代特定的集合。

于是，我们得到了函数集合的定义：`type Set = (Int) => Boolean`

和它的一个基本方法 `contains()`：

```scala
def contains(set: Set, x : Int) = set(x)
```

## 2. 基本方法

接下来，题目要求我们实现一些集合的基本方法。

### 2.1 `singletonSet()`

如何返回一个只有一个元素的函数集合呢？

对于我们的特征函数来说，也就是只有给定的元素才能满足这个特征函数，这样的集合就是只存在给定元素的集合。

所以，定义如下：

```scala
def singletonSet(elem: Int): Set = (x) => x == elem
```

### 2.2 交、并、补

这几个基本的数学集合操作并不难，只需要抓住我们特征函数就是 `contains()` 这一点就行了。

### 2.3 `filter()`

这个方法算是在 JVM 函数式语言中经常出现的集合方法；

作用就是返回满足条件的集合内的元素；

其中，一个很有趣的地方在于，`filter(s, p)` 的两个参数，虽然其表面上的类型不一样；

但是实际上他们的类型是一样的，也就是说，`s` 和 `p` 都是集合！

所以，我们只需要返回 `s` 和 `p` 的交集就行了

```scala
def filter(s: Set, p: Int => Boolean) = intersect(s, p)
```

## 3. `forAll()`

然后，有趣的地方来了，题目要求我们实现一个 `forAll()` 方法，用来检测是否 **所有的** 元素都满足给定的条件。

当然，我们不能遍历全部的无限集元素；

所以，我们就采取一个区间的办法，如果在这个区间内的所有的元素都满足条件，那么我们有信心认为所有的元素都满足了条件。

在这里，同样要注意， `s` 和 `p` 的类型实际上是一样的！

```scala
def forall(s: Set, p: Int => Boolean): Boolean = {
  def iter(a: Int): Boolean = {
    if (a > bound) true
    else if (diff(s, p)(a)) false
    else iter(a + 1)
  }

  iter(-bound)
}
```

## 4. `exists()`

本题第二难的地方来了，题目要求实现一个 `exists()` 函数，用于检测 **是否存在** 一个元素满足给定的条件。

按说这个还不是很难，但是，题目要求使用 `forAll()` 进行实现。

按照我的早就丢给高中老师的逻辑关系知识，『所有』和 『存在』好像并无什么联系。

不过，在论坛上有人提醒了我，可以使用 **间接法**；

也就是说，我们可以考虑一下 **不存在** 的情况；

也就是说，对于 **所有的** 元素，都 **不满足** 给定的条件；

到此，我们就可以利用上之前实现的 `forAll()` 了。

```scala
def exists(s: Set, p: Int => Boolean) =
    !forAll(s, (elem) => !p(elem))
```

但是，这显得太长了，能不能缩短到只有一行代码呢？

之前提到，`s` 和 `p` 的类型实际上是一样的，也就是说，我们可以重用上面的方法来对 `s` 和 `p` 进行处理。

那么，`s` 和 `p` 在不存在的情况下，是什么样的关系呢？

我们可以从上面的结论出发继续思考：

对于所有的元素，都不满足给定条件 $\Rightarrow$ 对于 `s` 的所有元素，都位于「在 `s` 且不在 `p` 中」这个集合内

所以，我们得到了一个简便的写法：

```scala
def exists(s: Set, p: Int => Boolean) = !forAll(s, diff(s, p))
```

## 5. `map()`

本题最难的部分来了，`map()` 函数，用于对集合中的元素进行变换操作，返回一个变换过后的新集合。

鉴于我们的集合是一个 **函数**，那么 `map()` 方法也就是返回一个 **新函数**，用来检测参数是否满足新变换过后的条件。

因为 `map()` 函数是针对原有集合进行变换，所以，我们应该基于原有集合生成上面的新函数。

也就是说，对于原有集合来说，是否存在一个元素，它变换过后的数值和传入的参数相等：

```scala
def map(s: Set, f: Int => Int) =
    x => exists(s, elem => x==f(elem))
```
