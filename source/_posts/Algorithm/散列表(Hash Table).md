---
title: 散列表(Hash Table)
date: 2017-04-08
categories: Algorithm
tags: Algorithm
---

## 1. 介绍

散列表是使用散列函数，将相应的键值对映射到数组的某个位置的数据结构。

它在一般情况下相对于其他的数据结构要效率更高，你甚至可以实现在**常数时间**内进行查找和插入操作的符号表。

但是它也有相应的缺点，下面将会详细讲述

<!-- more -->## 2. 散列函数

散列表一个重要部分就是**散列函数的计算**，我们使用散列函数将键值转换为数组的索引。

计算散列值一个很重要的方面就是让键值尽量分布到整个表中去，以避免碰撞的发生。

如果我们拥有一个大小为 $M$ 的数组，那么我们需要返回$[0, M - 1]$ 的散列值。

散列值的计算与**类型**相关。

### 2.1 Java 的约定

对于 Java 来说，比较幸运的是，Java 对于内置类型都实现了一个 `hashCode()` 方法，返回一个 32 位的 `int` 作为 `hashCode`；

我们可以直接使用这个 `hashCode` 来实现我们自己的散列值计算。

需要注意的是，Java 要求如果 `x` 和 `y` 相等，那么它们两者的 `hashCode` 也相等。


<!-- more -->### 2.2 散列计算方法

常用的散列方法是**除留余数法**。

我们选择大小为 $M$ 的数组，对于任意的正整数 k，计算 `k % M`，这样就能有效的将键分布于 $[0, M - 1]$

> $M$ 最好选择使用**质数**。

> 虽然现在给不出严谨的数学证明，但是工程实践中说明使用质数作为除数可以更好地利用键值的信息。

### 2.3 使用 `hashCode` 的计算问题

下面是一个实现的例子：

```java
private int hash(Key x) {
    return (Math.abs(x.hashCode())) % M;
}
```

在这个例子中，因为 Java 的 `hashCode` 返回的是一个 `int` 值；

这说明 `hashCode` 的范围是 $-2^{31} \sim 2^{31} - 1$；

但是我们需要的散列值要位于 $[0, M - 1]$；

所以我们首先要将 `hashCode` 取绝对值。

通常来说，取绝对值一般使用 `Math.abs()`；

但是，由于 `hashCode` 可以取到整个 32 位整形的范围；

当 `hashCode` 为 $-2^{31}$ 时，`Math.abs()` 是使用 `-1` 与之相乘；

此时，数值变为 $2^{31}$，出现 **上溢**，便会回绕至 $-2^{31}$；

**所以，$-2^{31}$ 的绝对值是其本身！**

正确的做法如下：

```java
private int hash(Key x) {
    return (x.hashCode() & 0x7fffffff) % M;
}
```

通过忽略整形中的符号位来达到取绝对值的作用。

<!-- more -->### 2.4 浮点数

对于 0 到 1 浮点数，我们可以将它乘以 $M$ 并四舍五入得到索引。

但是这种方法下，浮点数的**高位**作用更大，所以我们可以先将浮点数转为二进制数，随后使用除留余数法

### 2.5 字符串

对于字符串，我们也可以使用除留余数法。

通过 `chatAt()` 来返回一个 `char` 值。

以下的代码使用 Horner 算法来生成散列值

```java
int hash = 0;
for (int i = 0; i < s.lengh(); i++) {
    hash = (R * hash + s.charAt(i)) % M
}
```

### 2.6 组合键

如果键的类型含有多个整型变量，那么我们就可以将它们结合起来进行计算。

例如：

```java
int hash = (((day * R + month) % M) * R + year) % M;
```
### 1.6 缓存

如果散列值的计算很耗时，那么我们或许可以**将每个键的散列值缓存起来**

Java 内置的 `String` 就使用了这种方法来减少计算量。

### 1.7 结论

为一个数据类型实现散列函数需要满足三个条件：

1. 一致性——等价的键必定产生相等的散列值
2. 高效性
3. 均匀性

## 3. 碰撞处理

散列表的另一个重要部分是**碰撞处理**。

无论如何设计散列函数，总会出现两个不同的键得到同一个散列值的情况，这就叫做**碰撞**。

此时，我们就需要对碰撞进行处理。

### 3.1 拉链法

一种处理碰撞的方法就是拉链法，实际上就是**使用链表储存碰撞的元素**。

每个数组元素都是一个链表头，随后跟着与其碰撞的元素

此时，我们的数组大小 $M$ 可以小于键值数量 $N$

### 3.1.1 实现

```java
public class SeparateChainingHashST<Key, Value> {
    private int N;                              // 键值对总数
    private int M;                              // 散列表的大小
    private SequentialSearchST<Key, Value>[] st; // 存放链表的数组

    public SeparateChainingHashST() {
        this(997);
    }

    public SeparateChainingHashST(int M) {
        // Create linked list
        this.M = M;
        st = (SequentialSearchST<Key, Value>[]) new SequentialSearchST[M];

        for (int i = 0; i < M; i++) {
            st[i] = new SequentialSearchST();
        }
    }

    private int hash(Key key) {
        return (key.hashCode() & 0x7fffffff) % M;
    }

    private Value get(Key key) {
        return (Value) st[hash(key)].get(key);
    }

    private void put(key, val) {
        st[hash(key)].put(key, val);
    }
}
```

> 关于删除操作，拉链法的删除操作相对简单，只需要找到 `SequentialSearchST` 对象，直接调用 `delete()` 方法即可。
实际上就是链表的删除操作。

#### 3.1.2 性能

1. 在一张含有 $M$ 条链表和 $N$ 个键的散列表中，任意一条链表的键的数量均在 $N/M$ 的常数范围内的概率无限趋向 $1$
2. 在一张含有 $M$ 条链表和 $N$ 个键的散列表中，未命中查找和插入操作所需的比较次数为 $\sim N/M$

> 这里可以看到，散列表的效率是很高的，一般情况下只需要**常数级别的**时间即可完成搜索和插入

### 3.2 开放地址法

另一种碰撞处理方法啊就是开放地址法，它倾向于利用**数组中的空位**来解决冲突。

所以如果使用这种方法来进行碰撞处理，那么就要求数组的数量 $M$ 大于键值数量 $N$。

#### 3.2.1 实现

开放地址的最简单实现叫做**线性探测法**：当碰撞发生时，直接检查数组的下一个位置。

这会产生三种结果：

1. 命中
2. 未命中（为空）
3. 未命中（该位置的键与被查找的键不同）

> 特别重要的一点是，我们要在到达数组结尾时返回开头。

```java
public class LinearProbingHashST<Key, Value> {
    private int N;
    private int M;
    private Key[] keys;
    private Value[] vals;

    public LinearProbingHashST() {
        keys = (Key[]) new Object[M];
        vals = (Value[]) new Object[M];
    }

    private int hash(Key key) {
        return (key.hashCode() & 0x7fffffff) % M;
    }

    private void resize() [
        /* resize method*/
    }

    public put(Key key, Value val) {
        if (N >= M / 2) resize(2 * M);

        int i;
        for (i = hash(key); keys[i] != null; i = (i + 1) % M) {
            if (keys[i].equals(key)) {
                vals[i] = val;
                return;
            }
        }

        keys[i] = key;
        vals[i] = val;
        N++;
    }

    public Value get(Key key) {
        for (int i = hash(key); keys[i] != nul; i = (i + 1) % M) {
            if (keys[i].equals(key)) {
                return vals[i];
            }
        }
        return null;
    }

    public void delete(Key key) {
        if (!contains(key)) {
            return;
        }

        int i = hash(key);

        while(!key.equals(keys[i])) {
            i = (i + 1) % M;
        }
        keys[i] = null;
        vals[i] = null;

        i = (i + 1) % M;
        while (keys[i] != null) {
            Key keyToRedo = keys[i];
            Value valToRedo = vals[i];
            keys[i] = null;
            vals[i] = null;
            N--;
            put(keyToRedo, valToRedo);
            i = (i + 1) % M;
        }
        N --;

        if (N > 0 && N == M / 8) resize(M /2);
    }
}
```

> 关于删除操作：
我们不能直接将键的位置设置为 `null`，这会导致剩下的键无法被找到，所以我们需要**将被删除键的右侧的键重新插入**

##<!-- more -->## 3.2.2 性能

在一张大小为 $M$ 并含有 $N = \alpha M$ 个键的基于线性探测的散列表中，命中和未命中的查找所需要的探测次数分别为：

$$
\sim \frac{1}{2}(1 + \frac{1}{1 - a})
$$

$$
\sim \frac{1}{2}(1 + \frac{1}{(1 - a)^2})
$$

所以，如果要维护线性探测法的最佳性能；

应尽量保证数组是**半满**的

## 4. 结论

1. 散列表在一般情况下可以实现**常数级别的**查找和插入操作
2. 性能保证来自于散列函数的质量

    > 这会导致散列表性能的不稳定，同时容易受到外部攻击。
    一些特殊的数据在经过散列计算后会映射到同一个位置，此时散列表的性能就会急剧下降。

    > **当需要性能保证时，优先考虑平衡二叉树（红黑树）**

3. 散列计算可能复杂而且昂贵
4. 难以支持有序性相关的符号表操作

    > 经过散列计算后，键值对会随机地分布于数组中，不能保持其插入顺序。
