---
title: Kotlin Android Getting Started
date: 2017-04-08
categories: Android
tags: Android
---

## 0. 概述

由于 Android Studio 基于 IntelliJ IDEA 开发，所以很容易在 Android Studio 上使用 Kotlin 开发 Android。

<!-- more -->## 1. 创建工程

这步和普通的 Android 创建工程没有什么区别。

创建完毕后，你一般会拥有一个由 AS 创建的 Java Activity 类。

## 2. 将 Java 代码转换成 Kotlin 代码

IDEA 内建了代码转换功能，只需要通过 Find Action(`cmd + shift + a`) 即可找到 **Convert Java File to Kotlin File**

![](https://kotlinlang.org/assets/images/tutorials/kotlin-android/convert-java-to-kotlin.png)

经过转换之后，我们就能拥有一个使用 Kotlin 来编写的 Activity 类了。

## 3. 在工程中配置 Kotlin

由于 Kotlin 是一个外部库，所以我们需要对工程进行一些配置。

当然，Android Studio 内置了自动配置方法，只需要在 Find Action 中搜索 **Configure Kotlin in Project** 即可。

![](https://kotlinlang.org/assets/images/tutorials/kotlin-android/configure-kotlin-in-project.png)

接下来会弹出一个对话框，选择最新的 Kotlin 版本即可。

![](https://kotlinlang.org/assets/images/tutorials/kotlin-android/configure-kotlin-in-project-details.png)

最后，我们只需要同步一下 Gradle 即可。

![](https://kotlinlang.org/assets/images/tutorials/kotlin-android/sync-project-with-gradle.png)

<!-- more -->## 4. 剩下的工作

由于 Kotlin 最终还是会被编译成字节码，所以剩下的 UI 开发和 APK 构建与使用 Java 语言时并没有任何区别。

尽情享受 Kotlin 所带来的便利吧！
