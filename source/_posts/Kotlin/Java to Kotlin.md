---
title: Java to Kotlin
date: 2017-04-08
categories: Kotlin
tags: Kotlin
---

## 1. 概述

下面总结一些代码段，用于帮助从 Java 迁移到 Kotlin

<!-- more -->## 2. Lazy Initialization

```java
// Java

private A a = null;

public A getA() {
    if (a == null) {
        a = initA();
    }

    return a;
}

private A initA() {
    // ...
}
```

```kotlin
// Kotlin

val a: A by lazy { initA() }

private fun initA(): A {
    // ...
}
```

## 3. App.getContext()

```java
// Java

class App extends Application {
    private Context context = null;

    @Override
    public void onCreate() {
        super.onCreate();

        context = getAppContext();
    }

    public Context getContext() {
        retrun context;
    }
}
```

```kotlin
// Kotlin

class App : Application() {
    conpanion object {
        lateinit var context: Context
        private set
    }

    override fun onCreate() {
        context = applicationContext
    }
}
```

或者也可以直接扩展 `Context` 类

```kotlin
val Context.myApp: MyApp
        get() = applicationContext as MyApp
```

## 4. `it` in lambda

当实现的接口是单方法接口时，Kotlin 会自动使用 lambda 来代替；
这时候很容易出现不知道怎么写的问题。

此时，放心大胆的用 `it` 这个内置的 lambda 表达式参数。

```java
// Java

button.setOnClickListener(new OnClickListener() {
    @Override
    public void onClick(View view) {
        // Perform action on click
    }
});
```

```kotlin
// Kotlin

button.setOnClickListener { it -> // it is a view
    // Perform action on click
}
```

> 需要注意的是 lambda 是表达式，默认返回值为最后执行函数的返回值或者字面量；
不需要 `return` 关键字。

## 5. Functional Read From StdIn

```kotlin
fun main(args: Array<String>) {
    val reader = BufferedReader(InputStreamReader(System.`in`))

    reader.lines().forEach(::println)
}
```
