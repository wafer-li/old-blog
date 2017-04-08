---
title: Kotlin lateinit vs lazy
date: 2017-04-08
categories: Kotlin
tags: Kotlin
---

`lateinit` 和 `lazy` 是 Kotlin 中的两种不同的延迟初始化技术。

在 Kotlin 使用中，很可能搞不清楚它们的使用场景和方法。下面就来做一个理清：

1. `lateinit` 只用于 `var`，而 `lazy` 只用于 `val`
2. `lateinit` 和 `lazy` 都不能有 **自定义的 getter 和 setter**，但是可以对 getter 和 setter 进行可见符修饰
3. `lazy` 应用于单例模式(`if-null-then-init-else-return`)，而且当且仅当变量被**第一次调用**的时候，委托方法才会执行。
4. `lateinit` 则用于只能生命周期流程中进行获取或者初始化的变量，比如 Android 的 `onCreate()`
5. 当单例对象需要使用外界参数来进行构造时，内部的该参数对应的属性应使用 `lateinit`
    > 比如说网络 `ApiManager` 需要 `context` 来进行获取缓存的操作；
    > 那么，`ApiManager` 中的 `context` 属性就必须使用 `lateinit`
    >
    > 这是因为，`lazy` 使用委托方法来进行变量初始化，而委托方法不能从外界获取参数，但是 `lateinit` 可以通过一个 `init(context: Context)` 来获取到相应的外界参数来初始化属性。
