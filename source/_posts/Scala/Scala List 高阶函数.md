---
title: Scala List 高阶函数
date: '2017-04-21 03:20'
tags:
  - Scala
categories:
  - Scala
---

高阶函数是函数式编程的一个很大的特性；

同时，其中集合类的高阶函数在日常的开发和使用中，占了一个很重要的位置；

但是，这些函数有可能会在刚接触的时候搞不懂它们的具体作用；

那么今天就以 `List` 来说一说常用的高阶函数具体的作用。

<!-- more -->

## 1.子集操作

在一个集合中选取一些特定的元素作为子集；

我们在指令性语言中，通常选用 `for` 语句来实现这个需求；

而在函数式语言中，我们有对应的高阶函数来解决这个问题。

### 1.1 `filter(p: (T) => Boolean)`

顾名思义， **过滤器**，用来 **选取符合条件的元素**， 并将其作为返回值；

这里的 **符合条件** 指的是 使得函数 `p` 的返回值为 `true` 的元素。

例如：

```scala
val list = List(1, 2, 3, 4)

list.filter((x) => x > 2) // List(3, 4)
```

### 1.2 `filterNot(p: (T) => Boolean)`

同理，这个函数是上面的反面，也就是用来 **过滤掉** 符合条件的元素；

返回的是， **不包含符合元素的子集**；

例如：

```scala
val list = List(1,2,2,3)

list.filterNot((x) => x == 2) // List(1, 3)
```

### 1.3 `partition(p: (T) => Boolean)`

这个函数是上面两个函数的集合体，返回的是一个 `Turple`，包含的元素为：

```
(list.filter, list.filterNot)
```

例如：

```scala
val list = List(1, 2, 3, 4, 5, 6, 7)

// Returns: (List(1, 2, 3), List(4, 5, 6, 7))
list.partition((x) => x < 4)
```

### 1.4 `takeWhile(p: (T) => Boolean)`

这个函数会一直选取元素， **直到 `p` 的返回值为 `false`**，然后将元素作为新的集合返回。

可以看到，这个函数返回的就是 **符合条件的集合前缀**

例如：

```scala
val list = List(1, 1, 1, 1, 2, 1)

// 注意最后一个 1 并没有拿走
list.takeWhile((x) => x == 1) // List(1, 1, 1, 1)
```

### 1.5 `dropWhile(p: (T) => Boolean)`

和上面的方法相反，这个方法会一直 **丢弃** 元素，直到 `p` 的返回值为 `false`；

那么可以看到，这个函数返回的就是 **不符合条件的集合后缀**；

```scala
val list = List(1, 3, 6, 9, 4, 2, 1)

list.dropWhile((x) x != 4) // List(4, 2, 1)
```

### 1.6 `span(p: (T) => Boolean)`

这个函数是上两个函数的结合，它返回的是如下的一个 `Turple`：

```scala
(list.takeWhile, list.dropWhile)
```

### 1.7 `partition`、`span` 和它们的基本方法的区别

既然 `partition` 和 `span` 都可以用基本的 `filter`、`filterNot` 和 `takeWhile`、`dropWhile` 来解决，那为什么还要专门实现一次这两个方法呢？

其实，`span` 和 `partition` 只需要扫描一次集合；

但是如果使用 `filter`、`filterNot` 和 `takeWhile`、`dropWhile` 来实现的话，就需要扫描两次集合了。

所以，如果同时需要两者的数据的话，那么使用 `span` 和 `partition` 显然是更经济的。

## 2. 变换

### 2.1 `map(f: (T) => U)`

`map` 函数，可以说是这里面用的最多的高阶函数了；

`map` 函数的真正作用，实际上是一种变换功能，而且不仅可以变换成和现元素类型相同的类型，也可以变换成不同的类型；

也就是说，可以通过 `map` 函数，将一种元素的集合，变成另一种元素的集合。

例子：

```scala
// 将所有元素都乘以 2

val list = List(1, 2, 3, 4)

list.map((x) => x * 2)  // List(2, 4, 6, 8)
```

```scala
// 将 Int 变成 String

val list = List(1, 2, 3, 4)

list.map((x) => x.toString())   // List("1", "2", "3", "4")
```

### 2.2 `flatten`

这个函数可以将嵌套的 `List` 展平，就像它的名字一样。

例如：

```scala
val listOfLists = List(List(1, 2), List(3, 4))

listOfLists.flatten = List(1, 2, 3, 4, 5, 6)
```

### 2.3 `flatMap`

它是 `map` 和 `flatten` 的集合体，相当于先进行 `map` 然后 `flatten`。

例子：

```scala
val listOfLists = List(List(1, 2), List(3, 4))

listOfLists.flatMap((x) => x.map(_ * 2)) // List(2, 4, 6, 8)
```

也就是说，`flatMap` 先将元素 `map` 成 **嵌套的** `List`；

随后，再调用 `flatten`，将嵌套的 `List` 展平

> `flatMap` 的作用过于强大，使用时需要小心谨慎
> 在 Twitter 的 *Effective Scala* 中，推荐使用 *for-comprehention* 来代替 `flatMap` 的使用

## 3. 规约

在一个集合中，我们通常还会进行规约操作；

例如求一个 1 到 100 的和；

那么，此时，我们就是将一个 1 到 100 的集合规约到一个 `Int`，它是这个集合所有元素的和。

下面介绍的就是一系列规约函数。

### 3.1 `reduceLeft(op: (B, T) => B)`

顾名思义，从左到右进行规约操作；

该函数会从左到右地使用操作符 `op` 将元素连接起来。

注意 `op` 是个二元操作，它接受两个参数，返回一个值。

那么产生的结果就是一个 **左斜的树**：

```puml
@startuml
digraph G {
    node [shape=plaintext];
    edge [arrowhead=none];

    op1 [label=op];
    op2 [label=op];
    op3 [label=op];

    op1 -> x1;
    op1 -> x2;

    op2 -> op1;
    op2 -> x3;

    op3 -> op2 [style=dotted];
    op3 -> xn;
}
@enduml
```

需要注意的是，`reduceLeft` 不仅能返回和原有元素相同类型的值，也能返回不同类型的值；

基于这样的树结构，那么对 `op` 的类型就有了要求；

可以看到，在上面，下方的 `op` 的返回值是作为上方 `op` 的左节点；

也就是说，`reduceLeft` 要求， **`op` 的左边参数的类型，必须和其返回值的类型相同。**

### 3.2 `foldLeft(z: B)(op: (B, T) => B)`

`foldLeft` 则是对 `reduceLeft` 的进一步泛化；

`reduceLeft` 是不允许在 **空列表** 中执行的；

对此，`foldLeft` 提供了一个 **初始值** `z`；

如果列表为空，那么就返回 `z`；

它生成的树如下：

```puml
@startuml
digraph G {
    node [shape=plaintext];
    edge [arrowhead=none];

    op1 [label=op];
    op2 [label=op];
    op3 [label=op];

    op1 -> z;
    op1 -> x1;

    op2 -> op1;
    op2 -> x2;

    op3 -> op2 [style=dotted];
    op3 -> xn;
}
@enduml
```

这里比较有意思的就是 `foldLeft` 实际上是一个 **柯里化函数**；

可以先提供初始值，然后在 `op` 操作确定之后，再进行规约运算。

### 3.3 `reduceRight(op: (T, B) => B)`

我们既然能从左边规约，当然也可以从右边规约；

`reduceRight` 的作用就是， **从右到左** 执行规约操作；

那么，它所生成的树就是 **右斜的**：

```puml
@startuml
digraph G {
    node[shape=plaintext];
    edge[arrowhead=none];

    op1 [label=op];
    op2 [label=op];
    op3 [label=op];

    x_n [label="x_n-1"]

    op1 -> x1[tailport=sw];
    op1 -> op2[tailport=se];

    op2 -> x2[tailport=sw];
    op2 -> op3 [tailport=se, style=dotted];

    op3 -> x_n [tailport=sw];
    op3 -> xn [tailport=se];
}
@enduml
```

同理，`reduceRight` 要求，它的右操作数的类型必须和它的返回值类型相同。

### 3.4 `foldRight(z: B)(op: (T, B) => B)`

同样的，我们也具有一个  `foldRight` 函数，在集合为空时，返回初始值 `z`；

它生成的树如下：


```puml
@startuml
digraph G {
    node[shape=plaintext];
    edge[arrowhead=none];

    op1 [label=op];
    op2 [label=op];
    op3 [label=op];

    op1 -> x1[tailport=sw];
    op1 -> op2[tailport=se];

    op2 -> x2[tailport=sw];
    op2 -> op3 [tailport=se, style=dotted];

    op3 -> z [tailport=sw];
    op3 -> xn [tailport=se];
}
@enduml
```

### 3.5 `left` 和 `right` 的区别

那么 `left` 和 `right` 有什么区别呢？

实际上，高阶函数的作用范围都是 **整个列表**；

所以，对于满足 **交换律** 和 **结合律** 的运算，从左边执行和从右边执行的结果是 **一样的**，例如 **加法操作**；

但是，对于不满足交换律和结合律的运算，例如 **减法操作**；

那么这两个函数的执行结果就不一样。

## 4. 其他高阶函数

Scala 集合中还拥有其他的高阶函数，诸如：`count`、`find`、`sortWith` 等；

这些函数的作用比较明显，可以从它的命名中推测出其作用，在这里就不多做解释了。
