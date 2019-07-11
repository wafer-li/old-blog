---
title: "HashMap 的 loadFactor 为什么是 0.75"
author: "Wafer Li"
date: "2019-07-11 16:46"
---

之前看各大面经的时候搜索到了这个问题，切实感觉到如果刨根问底的问，自己还真不能抵挡住这种攻势，现在闲暇时间又心血来潮地想起来这个问题，就打算好好弄懂弄透，也希望能在将来面试的时候做好准备。

本文基于[这个 StackOverflow 回答](https://stackoverflow.com/a/31401836)进一步推导，并给出详细解答步骤

<!-- more -->

## 1. loadFactor 是什么

loadFactor 翻译为 **负载因子**，是 HashMap 负载程度的一个度量，所谓负载程度即 HashMap 持有的元素数量和 HashMap 大小的比值

当 HashMap 中的元素数量大于 `capacity * loadFactor` 时，HashMap 就要扩容，并进行重新 hash

那么，我们可以得出一个重要结论，`loadFactor` 是为了让 HashMap 尽可能 **不满** 而存在的

众所周知，HashMap 越空越好，这样插入和查找都能尽可能接近常数级别

那么接下来的一个重要问题就是：HashMap 什么时候是空的？通过这个问题，我们就可以一步一步推导出 `loadFactor` 的值

## 2. HashMap 什么时候不是很满

我们调整 loadFactor 的根本目标在于，要让元素的插入时间缩短到最少，也就是说，**元素最好不要发生碰撞**

**只要元素在插入时不发生碰撞，那么我们的 HashMap 就不算特别的满**

这是一个很重要的结论，通过它，我们成功地把 HashMap 满不满的问题，转换到了插入元素是否碰撞的问题

## 3. 插入元素的碰撞几率

插入元素是否碰撞，这是一个概率事件，有可能碰撞，也可能不碰撞


对于一个未知的元素，它有可能插入到 HashMap 的任何一个位置，因此，对于未知的元素插入，碰撞是**等可能的**，而一个元素是否碰撞和它之后的元素是否碰撞并无关系，因此是 **独立的**

> 为什么是独立的？因为 HashMap 采用拉链法解决碰撞，碰撞的元素不占用数组空间，因此一个元素是否碰撞和它前一个元素是否碰撞没有关系

在这里，我们要引入一个假设，上面我们提到的 HashMap 不是很满，但是 loadFactor 也不应该让一个 HashMap 过于空，太空的 HashMap 会造成空间的浪费；
假如一个元素的插入正好导致它碰撞，那么说明这个 HashMap 肯定不是特别空旷，而且当元素插入就碰撞时，恰好说明我们需要扩大 HashMap，而不是修改元素的 `hash()` 方法

因此，我们有单个元素插入碰撞的概率为

$$
p = \frac{1}{s}
$$

## 4. HashMap 在插入过程中不发生碰撞的概率

得到单个元素插入发生碰撞的概率之后，我们来考虑整个 HashMap 在插入过程中不发生碰撞的概率

对于一个 $s$ 大小的 Hashmap，我们插入 $n$ 个元素，这个操作属于等可能独立事件的**重复操作**，满足 **二项分布**，因此我们可以得出，在这个重复插入操作中，没有碰撞的概率为：

$$
\begin{aligned}
P(0)  & = C_n^0 \times (\frac{1}{s})^0 \times (1 - \frac{1}{s})^{n - 0} \\
 & = (1 - \frac{1}{s})^n
\end{aligned}
$$

## 5. 什么叫“HashMap 很可能不满”

假如一个 HashMap，它在插入元素的过程中，如果它一次碰撞都没有发生，说明它没有满；

上面我们得到了这个事件的概率，如果这个事件发生的概率很大，那么就说明 HashMap **很可能不满**

所以，若 $P(0) \le 0.5$，则说明 HashMap 很可能没有满

则有
$$
\begin{aligned}
(1 - \frac{1}{s})^n \ge \frac{1}{2}
\end{aligned}
$$
其中 $n$ 代表 HashMap 中元素的个数，$s$ 代表 HashMap 的数组大小

## 6. loadFactor 的计算过程

HashMap 中 `loadFactor` 即为 $n/s$，首先求出 $n$，对于上面的式子取对数，则有
$$
\begin{aligned}
n\ln(1 - \frac{1}{s}) & \ge -\ln2 \\
n & \le \frac{-\ln2}{\ln(1 - \frac{1}{s})} \\
n & \le \frac{-\ln2}{\ln\frac{s-1}{s}} \\
n & \le \frac{\ln2}{\ln\frac{s}{s-1}}
\end{aligned}
$$
所以，当 $n \le \frac{\ln2}{\ln\frac{2s}{2s-1}}$ 时，HashMap **很可能**不满，所以
$$
\frac{n}{s} \le \frac{\ln2}{s\ln\frac{s}{s-1}}
$$
当 $s \rightarrow \infty $ 时，有
$$
\begin{aligned}
loadFactor & = \lim_{s \to \infty}\frac{\ln2}{s\ln\frac{s}{s-1}}
\end{aligned}
$$
对于分母的式子有
$$
\begin{aligned}
\lim_{s \to \infty}s\ln\frac{s}{s-1}
\end{aligned}
$$
从形式上来看，当 $s \to \infty$ 时，$\frac{2s}{2s-1} \to 0$，则上式为 $\infty \cdot 0$ 型，应转换为 $\frac{0}{\infty}$ 或者 $\frac{\infty}{0}$ 计算，对 $s$ 取倒数，有：
令 $s = \frac{1}{t}$：
$$
\begin{aligned}
& \lim_{t \to 0} \frac{1}{t} \ln\frac{\frac{1}{t}}{\frac{1}{t} - 1} \\
& = \lim_{t \to 0}\frac{1}{t} \ln\frac{\frac{1}{t}}{\frac{1-t}{t}} \\
& = \lim_{t \to 0} \frac{1}{t}\ln\frac{1}{1-t} \\
& = \lim_{t \to 0} \frac{\ln\frac{1}{1-t}}{t} \cdots (\star) \\
\end{aligned}
$$
遇见 $x \to 0$，就要想 **等价无穷小**，对于 $\ln$ 可以构造 $\ln(1 + x) \sim x$，则有：
$$
\begin{aligned}
& \ln\frac{1}{1-t} \\
& = \ln\frac{1-t+t}{1-t} \\
& = \ln 1 + \frac{t}{1-t}
\end{aligned}
$$
则 $(\star)$式则有
$$
\begin{aligned}
& \lim_{t \to 0} \frac{\frac{t}{1-t}}{t} \\
& = \lim_{t \to 0} \frac{1}{1-t} \\
& = 1 \\
\\
\therefore loadFactor & = \lim_{s \to \infty}\frac{\ln2}{s\ln\frac{s}{s-1}} \\
& = \lim_{s \to \infty} \frac{\ln2}{1} \\
& = \ln2 \\
& \sim 0.693
\end{aligned}
$$

## 7. 为什么是 0.75

从上面的计算来看，`loadFactor` 取 $\ln2$ 时，能够让 HashMap 尽可能不满

但是在实际中，HashMap 碰撞与否，其实是与 `hashCode()` 的设计有很大关系，因此 JDK 设计者在平衡空间利用和性能方面给了一个更高的经验数字。

## 8. 总结

当然，这只是一家之言，你也可以从其他方面解释 0.75 这个值如何如何；

其实这种刨根问底的问题，终究希望考察你的 **能力** 而不是 **记忆**，只要你能给出自己的解释，而不是被问住，呆若木鸡，就能通过面试。
