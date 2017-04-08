---
title: Android Gradle 介绍
date: 2017-04-08
categories: Android
tags: Android
---

## 0. 简介

Android Studio 使用 gradle 自动化编译工具用于替代老旧的 Ant Build。目前已经成为 Android App 构建的主流工具。

本篇文章简单介绍了 Android Gradle 的有关配置段和相关的简介。

Gradle 工具通过读取 `build.gradle` 文件的配置来对工程进行构建，同时，工程中的每一个分模块都有相应的 `build.gralde` 文件。

<!-- more -->## 1. 顶层文件（Top-Level）

顶层的 `build.gradle` 存储在工程根目录，定义一些用于所有模块的属性和设置。其中包括

```
/**
* buildscript{} 是用于 gradle 自身的配置，在构建工程时，gradle 会首先读取构建必要的依赖用于构建工程。
* 不要将 APP 用的依赖项加到这里来！
* 通常包含 respositories{} 和 dependencies{} 块。
*/
buildscript {

    /**
    * 这个区块是定义 gradle 寻找所有依赖项的 Java 包库。
    * 默认为 jcenter。
    * 也可以添加一些自己的库进去。
    *
    * 由于 jcenter 是 MavenCentral 的超集，所以直接使用 jcenter 即可
    */
    respositories {
        jcenter()
    }

    /**
    * 这个区块是 gradle 构建用的依赖项，android 工程中，
    * 一般是与 AS 版本号对应的 gradle 版本。
    */
    dependencies {
        classpath 'com.android.tools.build:gradle:2.2.0'
    }
}

/**
* allprojects{} 区块用于定义所有模块构建共用的代码库和依赖项。
* 原则上应在各模块对应的 build.gradle 设定相应的代码库和依赖项。
* Android Studio 默认配置了 jcenter() 作为默认的代码库。
*/
allprojects {
    repositories {
        jcenter()
    }
}

```

## 2. 模块级别文件

在各个模块的根目录中，也有对应的 `build.gradle` 文件，它是用来配置各个模块各自的编译构建项的，也是我们最常修改的文件。

```
apply plugin: 'com.android.application'
```
