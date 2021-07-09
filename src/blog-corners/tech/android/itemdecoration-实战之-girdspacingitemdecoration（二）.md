---
title: ItemDecoration 实战之 GirdSpacingItemDecoration（二）
author: Wafer Li
date: '2020-05-12 14:46'
mathjax: true
tags:
  - Android
  - ItemDecoration
  - 技术开发
category: Android
---

[上文](./itemdecoration-实战之-girdspacingitemdecoration（一）)说到，相等间距的 GridLayoutManager 的 ItemDecoration 可以使用 **公式法** 来对所有四个方向的 offset 进行计算，由此可以大大简化 `itemOffset` 的计算，同时也天然的支持 RTL。

但是，很多时候我们的 item 由于布局的原因，会出现一个 item 占据多个 span 的情况；

上文最后给出的代码并没能处理这种情况，本文在这里就这个问题再进行进一步的讨论。

<!-- more -->

## 1. SpanSizeLookup

首先，为什么 GridLayoutManager 出现一个 item 占据多个格子的情况，实际上就是通过重载 `SpanSizeLookup` 这个类进行处理的。

`SpanSizeLookup` 是一个抽象类，通过重载它实现 `getSpanSize(position)` 方法，就可以指定元素所占的**span 的数量**。

注意这个方法所返回的是 item **所占的 span 的数量**；

如图所示，某个 `GirdLayoutManager` 的 `spanCount` 是 3

![不同 spanSize 的 item](/images/不同-spansize-的-item.png)

这里的第一个 `spanSize` 就是 `2`，第二个 `spanSize` 是 `1`


## 2. spanIndex 和 spanGroupIndex

在允许了不等于 `1` 的 `spanSize` 之后，情况出现了变化，在水平方向上的数量不再是一致的，而竖直方向上，更不可能简单的通过 `position` 和 `spanCount` 算出现在是第几行；

那么怎么办呢？`SpanSizeLookup` 为此提供了 `spanIndex` 和 `spanGroupIndex`。

### 2.1 spanGroupIndex
先说说 `spanGroupIndex`，`spanIndex` 还有个潜在的坑；既然叫 `spanGroupIndex`，那肯定有一个 `group` 的概念，在这里很显然，就是「一行」。

因此，「一行」就是一个 `spanGroup`，那么 `spanGroupIndex` 就是当前**行**的索引，也就是**竖直方向上的 $(\mathrm{n-1})$**

因此，我们只需要通过 `SpanSizeLookup` 类计算出当前 `position` 所在的行就能算出其上下的边距。

### 2.2 spanIndex

`spanIndex` 则稍微有点特殊，乍一眼看上去，会认为它和 `spanGroupIndex` 一样，是当前的 item 在这一行的位置，然而并不是。

用上图来说，第二个 item 的 `spanIndex`，实际上是 `2`，而并不是当前 item 在这一行的索引。

也就是说，`spanIndex`，是当前的 item 所在的 **span** 的索引，一行有 3 个 span，那么第二个 item 在第 3 个 span，其索引就是 2。

## 3. 使用 SpanSizeLookup 计算 Offset

现在，我们知道了 `spanGroupIndex` 就是竖直方向的 $n-1$，可以直接进行对应计算。

但是对于 `spanIndex` 则不然，我们又拿这幅图来说一下：

![不同 spanSize 的 item](/images/不同-spansize-的-item.png)

对第一个 item 来说，它左边的 offset 是第 `0` 个 item 的 `left`；

但是它的右边的 offset 是**第 `1` 个** item 的 `right`；

所以在水平方向上来说：

1. startIndex = spanIndex
2. endIndex = spanIndex + spanSize - 1

这个坑需要非常注意，否则就会算错 offset

## 4. 总结

那么到这里，我们就已经知道了如何使用 `SpanSizeLookup` 的相关属性来获取我们需要的 $n-1$ 这个值，而只要有了 $n-1$ 这个值，我们就可以通过等差数列的通项公式去计算各个 item 的各个方向上的 offset，那么一个动态 spanSize 的 GirdSpacingItemDecoration 就可以构建出来了。

## 5. 番外：精度问题

虽然具体原理已经讲完了，但是对于 offset 的计算还需要注意一个精度的问题；

虽然各边的 offset 都是 `int` 值，但是我们的 `sizeAvg` 这个关键的量是需要通过除法计算的，所以如果 `sizeAvg` 使用 `int` 类型，就会丢失一部分的小数部分，导致最后计算出的 `offset` 和需求的不一致，或者宽了，或者窄了。

因此，`sizeAvg` 必须使用较高精度的浮点数进行表示，例如 `double`，那么也就说明我们给进去的参数也要是 `double` 类型的，这点也需要特别注意。

## 6. 代码

我知道大家就喜欢直入主题，代码[在此](https://gist.github.com/wafer-li/8b0e6ebd98f799f21b9f9f90a69575a9)；

虽然和[上篇](../itemdecoration-实战之-girdspacingitemdecoration（一）)的代码是同一个地址就是了。
