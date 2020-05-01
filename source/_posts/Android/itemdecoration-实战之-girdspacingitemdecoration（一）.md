---
title: ItemDecoration 实战之 GirdSpacingItemDecoration（一）
author: Wafer Li
date: '2020-05-01 13:46'
mathjax: true
tags:
  - Android
  - ItemDecoration
categories:
  - Android
---

在 Android 开发中，给网格状布局的元素之间添加空隙，并让他们居中对齐算是 UI 层面的一个常见需求;

很多时候我们都是通过在 itemView 中添加适当的 margin 来实现的，但是这个实现方式在遇到头尾部空隙和中间不一致时，就需要进行特殊处理，而且从权责上来看，实际上也不应该由 itemView 负责这个间隙的调整工作。

当然，Google 提供了一个 ItemDecoration 类专门来做这个事情，但是网上对于这个类的解析文章水平参差不齐，例如本文的[参考文章](https://www.jianshu.com/u/3f3c4485b55a)，解析写的很好，但是提供出来的例子性能很糟糕，这里采用这篇文章进行参考，同时给出一个性能较好的例子供大家使用。

在这里也感谢此文的作者，他写的这篇文章很好的解释了 ItemDecoration 的原理，也使我增加了知识从而成文。

<!-- more -->

## 0. 太长不看

文章最后有参考代码的链接


## 1. ItemDecoration 的布局原理

这里就引用参考文章的图

![ItemDecoration 原理](../images/itemdecoration-实战之-girdspacingitemdecoration（一）/itemdecoration-原理.png)


其中，蓝色部分就是我们在 ItemDecoration 中的 `getItemOffsets` 给 `outRect` 设置的边界。

对于这种单纯增加空隙的效果，我们仅需要关注 `getItemOffsets` 即可。

## 2. 仅设置单独一边的问题

当然，我们很容易想到，如果需要给元素之间增加边界，那么我们就在元素的一边单独增加边界不就行了吗？

然而不行，在 GridLayoutManager 下会呈现出这种效果：

![仅设置一边边距的效果](../images/itemdecoration-实战之-girdspacingitemdecoration（一）/仅设置一边边距的效果.png)

可以看到，这里面 1 是正常的，但是 2 和 3 都被拉长了；

原因就是 GridLayoutManager 会将所有的空间给元素进行平均分配，看橙色底的格子，每个格子就是 GridLayoutManager 给元素分配的空间，橙色部分的边距就是我们设定的 itemOffsets 和 margin 的组合，以下统称为 offsets

那么由于 2 没有在左边设置 offsets，那么 2 的 itemView 就会贴着橙色格子的边，然后右边与边上有边距，那么就出现了元素被拉伸的情况，同时，这几个元素从视觉效果上来看，也没有「居中」排列。

## 3. 解决问题的关键

那么按照这个布局策略以及我们的「元素有空隙、整体居中」的布局要求，那么就得出了两点：

1. 每个元素所提供的 offset 要相同——这样 itemView 才不会被压缩
2. 元素之间的间距相同

按照第一点，我们可以计算平均每个元素需要提供的 offset 值，我们将其叫做 `sizeAvg`

显然，`sizeAvg` 有如下等式：

$$
\mathrm{
sizeAvg = \frac{start + end + spacing * (spanCount - 1)}{spanCount}
}
$$


其中 $\mathrm{start}$ 和 $\mathrm{end}$ 分别是距离 recyclerView 「左边」和「右边」的边距，$\mathrm{spacing}$ 是每个元素之间的间距，$\mathrm{spanCount}$ 是这一排元素的个数

根据我们得出的第一点关系，我们得到了第一个等式，然后根据第二点关系，我们就能算出各个 item 的各个边所需要提供的值。

例如第一个 item，左边是 $start$，那么右边就是 $\mathrm{sizeAvg - start}$，由此我们就能算第二个，第三个，第四个等等。

如图所示：

![计算实例](../images/itemdecoration-实战之-girdspacingitemdecoration（一）/计算实例.png)

## 4. 参考文章的算法失误

到这里你可能会说，问题不就是已经解决了吗？我就按照这样递归的计算下去不就行了吗？

这也是为什么我说「参考文章性能糟糕」的原因，事实上，如果采用递归方式进行计算，在元素比较多，手机性能不好的情况下，会出现爆栈问题。


其实，我们还可以进一步的挖掘其中的规律，规避掉性能较差的递归计算。

首先，对于第一个元素，我们有如下公式：

$$
\begin{aligned}
\mathrm{left_1} &= \mathrm{start}\\
\mathrm{right_1} &= \mathrm{sizeAvg - start}\\
\mathrm{left_2} &= \mathrm{center - right_1}\\
\therefore \mathrm{left_2} &= \mathrm{center - (sizeAvg - start)} \\
\therefore \mathrm{left_2} &= \mathrm{start + center - sizeAvg}
\end{aligned}
$$


同理，对于 $\mathrm{left_3}$ 有如下公式：

$$
\begin{aligned}
\because \mathrm{left_3} &= \mathrm{center - right_2}\\
\mathrm{right_2} &= \mathrm{sizeAvg - left_2} \\
\therefore \mathrm{left_3} &= \mathrm{center - (sizeAvg - left_2)} \\
&= \mathrm{left_2 + (center - sizeAvg)}
\end{aligned}
$$

由于 $\mathrm{center}$ 和 $\mathrm{sizeAvg}$ 都是**常量**，比较 $\mathrm{left_2}$ 和 $\mathrm{left_3}$，我们可以看出，实际上对于 $\mathrm{left_x}$ 呈现出**等差数列**的趋势。

因此，对于 $\mathrm{left_n}$ 有如下公式（等差数列通项公式）：

$$
\mathrm{left_n} = \mathrm{start} + (n - 1) \times (\mathrm{center - sizeAvg})
$$


因此，我们可以通过这个公式，求出 **任意的 `position` 的 `left` 值**；

同理，如果把方向反过来，那么我们就能求出 **任意的 `position` 的 `right` 值**；

对于竖直方向上，也有这个规律，这样，我们就能求出**任意 `position` 的四个方向的边距值**；

从而轻松解决问题，由于只涉及到了公式计算，规避了递归操作，相比来说性能得到了极大提升；

同时，由于各个方向上的值我们都可以一视同仁无差别的计算，因此**天然的适配 RTL 布局**，相比很多实现都无法简单的处理 RTL 问题，要不就很多分支情况，要不就干脆不处理 RTL 来说是一个不错的优势。

## 5. 代码

我知道很多人就只看这个，[源码](https://gist.github.com/wafer-li/8b0e6ebd98f799f21b9f9f90a69575a9)

## 6. 参考文章与作者

[鸡汤程序员](https://www.jianshu.com/u/3f3c4485b55a)——[《ItemDecoration深入解析与实战（二）—— 实际运用》](https://www.jianshu.com/p/f41db270d5fe)
