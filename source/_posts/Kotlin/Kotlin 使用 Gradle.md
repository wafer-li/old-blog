---
title: Kotlin 使用 Gradle
date: 2017-04-08
categories: Kotlin
tags: Kotlin
---

## 1. 概述

一般来说，IntilliJ 会自动的给我们配置 Kotlin 的 Gradle 设置；

但是，有时候我们也想自己进行一些自定义的 Gradle 配置；

下面就来总结几个常用的配置方法

<!-- more -->## 2. 去除 `src` 中的 `java` 目录

虽然说 Kotlin 经常和 Java 混着写，但是，有时候我们想写一个纯 Kotlin 程序的时候，却发现 `src` 目录中一直存在着一个 `java` 目录；

这着实激起了我的强迫症，解决方法如下：

```groovy
sourceSets {
    main.java.srcDirs = ['src/main/kotlin']
    test.java.srcDirs = ['src/test/kotlin']
}
```

这是 gradle java 插件中常用的指定源文件位置的方法；

不过需要注意的是，即使我们使用的是 kotlin 插件，也要使用 `main.java`；

而不能使用 `main.kotlin`

这应该是因为 kotlin 插件继承了 java 插件的源文件位置设定的结果。

## 2. 指定字节码版本

有时候我们想使用一些高级的语言特性，不想为低级的 JVM 编写代码；

这个时候就需要指定字节码版本；

在 java 插件中，我们可以通过 `sourceCompatibility` 和 `targetCompatibility` 来解决这个问题；

不过在 Kotlin 中，我们还有对应的 JVM 版本和语言和 API 版本可以设定（注意，仅在 Kotlin 1.1 之后可以使用）；

```groovy
compileKotlin {
    sourceCompatibility = JavaVersion.VERSION_1_8
    targetCompatibility = JavaVersion.VERSION_1_8

    kotlinOptions {
        jvmTarget = "1.8"
        apiVersion = "1.1"
        languageVersion = "1.1"
    }
}
```

注意一定要在 `compileKotiln` 中，因为这个是编译 Kotlin 时候的选项。
