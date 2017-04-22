---
title: Kotlin Scoping 函数
date: '2017-04-22 21:02'
tags:
  - Kotlin
categories:
  - Kotlin
---

在 Kotlin 的 [Standard.kt](https://github.com/JetBrains/kotlin/blob/master/libraries/stdlib/src/kotlin/util/Standard.kt) 中提供了一些特殊的高阶函数；

它们被称作 **Scoping 函数**，此类函数通过使用一个函数 `block`，将你需要对某对象进行的一系列操作限制在 lambda 作用域内；

这样，对于该对象操作的代码就不会泄露到外层作用域，使得代码更为干净整洁。

例如：

```kotlin
DbConnection.getConnection().let { connection ->
}
// connection is no longer visible here
```

可以看到，对于 `connection` 的操作就仅局限于 `let` 的 lambda 区域，而在 lambda 区域外是不可见的；

这就可以保证对 `connection` 的操作，不会影响到接下来的作用域。

<!-- more -->

## 1. `let`

### 1.1 定义

```kotlin
public inline fun <T, R> T.let(f: (T) -> R): R = f(this)
```

### 1.2 例子

```kotlin
val s = "hoge".let { it.toUpperCase() }
println(s) //=> HOGE
```

从定义之中我们可以看到，`let` 是所有类型都具有的扩展函数；

它的 `lambda` 的参数就是 `let` 的调用者。

### 1.3 主要用途

`let` 的主要用途在 Kotlin 的 [Idioms](https://kotlinlang.org/docs/reference/idioms.html#execute-if-not-null) 中有介绍；

主要就是用于在对象 `nullable` 的时候，对对象进行操作；

```kotlin
data?.let {
    ... // execute this block if not null
}
```

当 `data` 为 `null` 时，`let` 就不执行，而直接返回 `null`；

否则就执行 `let` 的 lambda。

此时，它与 Java `Optional` 的以下三个函数的功能类似：

- `map`
- `flatMap`
- `ifPresent`

可以看到，`let` 实际上就相当于集合中的 `map`，作用就是进行元素的变换功能；

![](https://ww2.sinaimg.cn/large/006tNbRwgy1fevs5lulszj30ho08k74u.jpg)

注意，不能在 `let` 中调用 `it` 的修改方法；

否则，就会对原有对象进行改变。

## 2. `with`

### 2.1 定义

```kotlin
public inline fun <T, R> with(receiver: T, f: T.() -> R): R = receiver.f()
```

### 2.2 例子

```kotlin
val w = Window()
with(w) {
  setWidth(100)
  setHeight(200)
  setBackground(RED)
}
```

和 `let` 不同，`with`  **并不是扩展函数**；

它的第一个参数，是任意类型的对象，如上面的 `x`；

需要注意的是它的 lambda 部分，它的 lambda 要求接收者（调用者）必须是第一个参数的类型；

也就是说，我们可以在它的 lambda 中调用第一个参数的方法；

正如上面的例子，其中的几个 `set` 方法都隐含了调用者是 `w`

### 2.3 主要用途

由于指定了接收者类型，所以 `with` 函数主要用于对复杂对象的一系列配置操作。

如上面的设置 `Window` 的宽度和高度，以及背景颜色等。

![](https://ww4.sinaimg.cn/large/006tNbRwgy1fevsj7j8fij30e60agjrw.jpg)

可以看到，`with` 的调用 **会改变传入的对象**

实际上，这里也可以使用 `let` 函数进行这种操作；

不过由于 `let` 函数是将对象当做 **参数** 传入，所以如果要获得和 `with` 一样的效果，就必须在前面加 `it`：

![](https://ww3.sinaimg.cn/large/006tNbRwly1fevslr0wr7j30iu0aijrz.jpg)

所以，`let` 并不适合这里所说的这个用途，利用 `let` 进行元素变换即可。

## 3. `run`

### 3.1 定义

```kotlin
public inline fun <T, R> T.run(f: T.() -> R): R = f()
```

### 3.2 例子

```kotlin
val s = "hoge".run { toUpperCase() }
println(s) //=> HOGE
```

可以看到，`run` 实际上就是 `let` 和 `with` 的结合；

可以让 `with` 不需要指定 `receiver` 参数就进行对象内部属性的配置；

同时，`run` 也是一个扩展函数，可以通过任何的类进行调用。


### 3.3 主要用途

作为 `let` 和 `with` 的合体方法，那么最主要的用途当然还是进行某个对象的配置。

![](https://ww1.sinaimg.cn/large/006tNbRwgy1fevw96ztszj30go0843yz.jpg)

需要注意的是，`run` 也会对对象进行改变。

## 4. `apply`

### 4.1 定义

```kotlin
public inline fun <T> T.apply(f: T.() -> Unit): T { f(); return this }
```

### 4.2 例子

```kotlin
val s = "hoge".apply { toUpperCase() }
println(s) //=> hoge
```

相比之前的结果，返回的依旧是小写字符；

这是由于 `apply` 返回的是 `apply` 的调用者的缘故。


### 4.3 主要用途

由于 `apply` 的返回类型为调用者自身，所以可以利用 `apply` 实现一个 **流式 API 调用**。

实际上就是 `with` 最后返回 `this` 的简略版本。

![](https://ww1.sinaimg.cn/large/006tNbRwgy1fevwr9abcuj30va062q3m.jpg)

## 5. `also`

这是 Kotlin 1.1 新增的 scoping 函数

### 5.1 定义

```kotlin
public inline fun <T> T.also(block: (T) -> Unit): T { block(this); return this }
```

### 5.2 使用例子

```kotlin
val s = "hoge".also { it.toUpperCase() }
println(s) //=> hoge
```

可以看到，其作用和 `apply` 一样；

但是和 `apply` 的区别在于，`also` 的函数参数并非指定接收者；

而是将调用者 `T` 当做其参数传入 lambda；

类似于 `let` 的 `apply` 版本。

### 5.3 主要用途

那么这样做有什么好处呢？

首先，由于 **没有指定接收者**，所以 lambda 内外的 `this` 的含义没有改变：

```kotlin
// applyを使用
val button = Button(this).apply {
  text = "Click me"
  setOnClickListener {
    startActivity(Intent(this@MainActivity, NextActivity::class.java))
    // 単なる「this」ではNG   ^
  }
}

// alsoを使用
val button = Button(this).also { button ->
  button.text = "Click me"
  button.setOnClickListener {
    startActivity(Intent(this, NextActivity::class.java))
  }
}
```

其次，可以通过赋予 lambda 参数名字，例如上面的 `button` ，增强可读性。

### 5.4 和 `let` 的区别

`also` 和 `let` 都是通过将调用者作为 lambda 的参数传入函数的形式进行调用；

其区别就在于 `also` 最终返回值为其自身的调用者，即 `this`；

而 `let` 的最终返回值由它的 lambda 的最后一个表达式的返回值决定。

类似于 `apply` 和 `with` 的区别；

同理，也可以利用 `let` 来实现上面的 `also` 实现的功能：

```kotlin
val button = Button(this).let { button ->
  button.text = "Click me"
  button.setOnClickListener {
    startActivity(Intent(this, NextActivity::class.java))
  }
  button // letの場合はこれが必要になる
}
```

## 6. 总结

1. `let` 用于进行元素变换操作，类似于 `map`
2. `with` 用于对复杂对象的配置，需要提供具体的对象
3. `run` 是 `with` 的 `let` 版本，配置对象属性，不需要提供具体对象
4. `apply` 是 `with` 的流式 API 版本
5. `also` 是 `let` 的 `apply` 版本，用于对象配置，同时保留流式 API 和 当前 `this` 的含义

## 7. 参考资料

[Kotlin スコープ関数 用途まとめ](http://qiita.com/ngsw_taro/items/d29e3080d9fc8a38691e#%E5%AE%9A%E7%BE%A9-2)

[Exploring the Kotlin standard library](http://beust.com/weblog/2015/10/30/exploring-the-kotlin-standard-library/)
