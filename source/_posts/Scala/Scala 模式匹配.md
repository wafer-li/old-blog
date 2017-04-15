---
title: Scala 模式匹配
date: '2017-04-16 03:07'
tags:
  - Scala
categories:
  - Scala
---

模式匹配，是 Scala 相比 Java 在类型上的一个很好地改进；

通过引入模式匹配，消除了 Java 中常见的类型检测和强制转换(cast)；

拥有更高的安全性

<!-- more -->


## 1. 问题背景

模式匹配主要解决的问题就是一个树状的类型依赖图；

比如算数表达式，由文法可知，它是具有树状依赖关系的：

$$
\begin{align}
E & \rightarrow \\
& E+E \ | \\
& E-E \ | \\
& E*E \ | \\
& E/E \ | \\
& (E) \ | \\
&  i
\end{align}
$$

所以，我们可以使用如下的类来表示一个算术表达式：

```scala
trait Expr
class Number(n: Int) extends Expr
class Sum(leftOp: Expr, rightOp: Expr) extends Expr
```

那么当我们需要使用类似 `eval()` 的方法时，该如何实现这个方法呢？

## 2. 各有缺陷的解法

### 2.1 使用类型说明

一个暴力解决的思路就是为 `Expr` 添加上一个类型的说明，即：

```scala
trait Expr {
    def isNumber: Boolean
    def isSum: Boolean
}
```

不过，随着以后算术表达式的种类越来越多，比如加入了乘法和除法；

那么，这个实现会导致方法数的平方级别爆炸。

> 每增加一个种类，都需要对现有的所有类进行方法的增加

显然，使用类型说明(classification) 是不行的。

### 2.2 类型检测和造型

Java 这门面向对象语言对此则有比较好的解法：

通过对对象进行类型检测和强制转换(cast)；

由于强制转换后类型得到限定，所以就可以分别进行检测工作：

```java
public int eval(Expr e) {
    if (e instanceof Number) {
        ...
    }
    else if (e instanceof Sum) {
        ...
    }
}
```

相对的，Scala 也具有这种语法特性：

```scala
def eval(e: Expr): Int = {
    if (e.isInstanceOf[Number]) {
        e.asInstanceOf[Number].numberValue
    }
    else if (e.isInstanceOf[Sum]) {
        val sum = e.asInstanceOf[Sum]
        eval(sum.leftOp) + eval(sum.rightOp)
    }
}
```

不过，这种方法由于是比较低层级的，具有指令性特征；

同时，过多的类型检测和强制转换也造成了诸多不安全因素：

如果运行时类型改变了，那么很可能会出现异常。

### 2.3 面向对象的解法

现在我们来选择一个更高级的解决办法，通过利用多态特性，来解决此类问题。

相比将 `eval()` 作为一个外部的函数，不如将其作为类的一个内部方法：

```scala
trait Expr {
    def eval: Int
}

class Number(n: Int) extends Expr {
    override def eval: Int = n
}

class Sum(leftOp: Expr, rightOp: Expr) extends Expr {
    override def eval: Int = leftOp.eval + rightOp.eval
}
```

通过语言自带的多态特性，我们可以使用到具体的 `eval()`；

这样就能很优雅的解决上面的问题；

不过，这种写法有个缺陷；

如果我们需要添加一个新的方法，例如 `show()`，则需要更改所有的现存类；

而且，如果我们需要一个化简操作，它不能仅仅只考虑一个节点，而需要多个节点综合考虑；

这样，我们可以发现，即使使用多态，也没能解决我们所有的问题

## 3. 模式匹配

在 Scala 中，具有一个很常用的语法用于解决这类问题，即 **模式匹配**；

模式匹配使用 `match` 定义：

```scala
e match {
    case Number(n) => n
    case Sum(left, right) => left.eval + right.eval
    case anotherE => anotherE.eval
    case _ => //Ignore
}
```

`match` 语句块中，包含多个 `case`  语句；

每个 `case` 语句包括：`case` 关键字，模式和表达式，模式和表达式使用 `=>` 分隔。

乍一看，这个语法和 C++/Java 中的 `switch` 很像；

不过，它进行了大幅度的强化，主要就是放宽了对选择器的限制：

现在 `case` 语句可以是：

1. 构造器
2. 变量
3. 常量
4. 通配符 `_`

其中：

- 构造器必须是 `case class`
- 变量必须以小写字母开头
- 常量必须以大写字母开头

## 4. 匹配处理

首先，如果没有 `case` 能够匹配选择器，则会抛出异常。

然后，如果匹配成功，会将 **整个 `match` 语句** 替换为 `case` 的 right-hand side。

对于不同的情况，则是：

- 构造器，将参数绑定 `case` 中的形参
- 变量，对变量进行赋值
- 常量，检测和常量的相等性

## 5. Case Class

Case Class 是一种特殊的类，通常用于进行模式匹配；

但是，它还具有一些其他的有用特性：

它不需要 `new` 关键字进行构建：

```scala
case Person(name: String, age: Int)

val person = Person("hehe", 18)
```

它的主要构造器参数直接可以作为类的字段：

```scala
val name = person.name
```

它的相等性判断是结构化的，当它所有的成员都相等时，它就相等，和引用无关；

同时还提供了 `toString()` 方法：

```scala
val firstSms = SMS("12345", "Hello!")
val secondSms = SMS("12345", "Hello!")

if (firstSms == secondSms) {
  println("They are equal!")
}

println("SMS is: " + firstSms)
```

输出：

```bash
They are equal!
SMS is: SMS(12345, Hello!)
```

## 6. 模式匹配的解决办法

使用模式匹配，我们不仅可以对单个节点进行解析工作；

同时，我们还可以查看节点之间的关系：

```scala
trait Expr {
  def eval: Int = this match {
    case Number(n) => n
    case Sum(left, right) => left.eval + right.eval
  }

  def show: String = this match {
    case Number(n) => n.toString
    case Sum(left, right) => left.show + "+" + right.show
    case Prod(left, right) =>
      def f(e: Expr): String = e match {
        case Sum(l, r) => "(" + l.show + "+" + r.show + ")"
        case _ => e.show
      }

      f(left) + "*" + f(right)
    case Var(x) => x
  }

}

case class Number(n: Int) extends Expr

case class Sum(left: Expr, right: Expr) extends Expr

case class Var(x: String) extends Expr

case class Prod(left: Expr, right: Expr) extends Expr
```

上面的 `show` 方法通过查看子节点情况，实现了优先级区分:

![](https://ww1.sinaimg.cn/large/006tNc79ly1fenynuh6prj316g09g763.jpg)

## 7. 和多态方法的区别

那么模式匹配相比面向对象方法有什么优势呢？

如果你倾向于在现有的类架构上添加 **通用的方法**，那么采用模式匹配会更好；

因为模式匹配只需要修改匹配代码，而不需要在各个子类重新实现方法。

但是，如果你倾向于增加子类，而不是增加通用的处理方法，那么采用多态方法会更好；

原因是采用多态架构只需要建立一个子类，而重载方法这些繁琐工作 IDE 会帮你做好；

而模式匹配还需要在顶层代码中进行修改
