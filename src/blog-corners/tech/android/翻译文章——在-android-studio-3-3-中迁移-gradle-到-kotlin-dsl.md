---
title: 翻译文章——在 Android Studio 3.3 中迁移 Gradle 到 Kotlin DSL
author: Wafer Li
date: '2019-07-31 13:44'
tags:
  - Android
  - Gradle
  - Kotlin
  - Translate
  - 技术开发
category: Android
---

这是一篇翻译文章，目前可以作为迁移 Gradle 到 Kotlin DSL 的备忘录，译者在 Android Studio 3.5 RC-1 上也迁移成功。

原文：[Migrating Gradle to Kotlin DSL in Android Studio 3.3](https://medium.com/@stoltmanjan/migrating-gradle-to-kotlin-dsl-in-android-studio-3-3-18651f37227f)

<!-- more -->

> 注意：在本文中我认为你应该了解了[Kotlin 可以应用于 Gradle 中](https://blog.gradle.org/kotlin-meets-gradle)，同时你想寻找一个快速备忘录或者一个直接复制粘贴就能用的解决方案。如果你想寻找一个完整的文档，请到[这里](https://docs.gradle.org/current/userguide/kotlin_dsl.html)查看。

## 第一步：Gradle Wrapper 版本

迁移 Gradle 到 Kotlin DSL 推荐使用 5.0 以上的 Gradle 版本，但不巧的是，在 Android 工程中，它也同时强烈建议当你没有使用 Android Gradle Plugin 3.4 时，不要使用 Gradle 5.0。在这种情况下，请确认你使用了目前支持的最新 Gradle 版本（本文撰写时该版本为 4.10.1）

```properties
//gradle.properties
distributionBase=GRADLE_USER_HOME
distributionPath=wrapper/dists
zipStoreBase=GRADLE_USER_HOME
zipStorePath=wrapper/dists
distributionUrl=https\://services.gradle.org/distributions/gradle-4.10.1-all.zip
```

## 第二步：更改所有的单引号为双引号

使用查找和替换(在 Android Studio 中使用 <kbd>ctrl + R</kbd>)工具将 Gradle 文件中所有的单引号(`'`)改为双引号(`"`)

对于一个新建的工程，你要修改以下的三个文件：

- settings.gradle
- build.gradle (根目录)
- build.gradle (模块目录)

## 第三步：将所有的隐式赋值和函数调用修改为显式的

然后，所有的 Gradle 式的赋值和函数调用都要转换为 Koltin 式的。像下面这个例子这样将它们进行转换：

```
// Groovy assignment
applicationId "com.yggdralisk.githubbrowser"
// Kotlin assignment
applicationId = "com.yggdralisk.githubbrowser"
// Groovy function call
implementation "androidx.constraintlayout:constraintlayout:2.0.0-alpha3"
// Kotlin function call
implementation("androidx.constraintlayout:constraintlayout:2.0.0-alpha3")
```

如果你不知道在这一步该如何修改，甚至不知道该修改什么，你可以通过文章底部的示例文件链接查看一下实例文件。

## 第四步：迁移 settings.gradle 文件

> 注意：在开始这一步之前，你应该要关掉 Gradle 的 auto-sync 功能，否则它会让你十分抓狂。当你完成了整个工程的迁移工作之后，可以将其再次打开。

> 译者注：其实 Gradle 官方并不推荐开启 auto-sync 功能，官方推荐的是开启 auto-load，但是最好是开发者自己去 sync[^1]

[^1]: https://docs.gradle.org/current/userguide/kotlin_dsl.html#automatic_build_import_vs_automatic_reloading_of_script_dependencies

使用重命名文件(<kbd>shift + F6</kbd>)功能将 settings.gradle 文件重命名为 settings.gradle.kts。

对于一个新建的工程，如下所示：

```kotlin
//settings.gradle.kts
include(":app")
```

## 第五步：迁移根目录 build.gradle 文件

对根目录的 build.gradle 文件进行类似上一步的操作，将它的文件名修改为 build.gradle.kts


```kotlin
//build.gradle.kts (Project)
// Top-level build file where you can add configuration options common to all sub-projects/modules.
buildscript {
    val kotlinVersion = "1.3.11"
    repositories {
        google()
        jcenter()
    }
    dependencies {
        classpath("com.android.tools.build:gradle:3.3.0")
        classpath(kotlin("gradle-plugin", kotlinVersion))

        // NOTE: Do not place your application dependencies here; they belong
        // in the individual module build.gradle files
    }
}

allprojects {
    repositories {
        google()
        jcenter()
    }
}

tasks {
    val clean by registering(Delete::class) {
        delete(buildDir)
    }
}
```

## 第六步：迁移模块的 settings.gradle 文件

对于模块的 settings.gradle 文件，我们也执行同样的操作，将它的文件名修改为 build.gradle.kts


```kotlin
import org.jetbrains.kotlin.config.KotlinCompilerVersion

plugins {
    id("com.android.application")
    kotlin("android")
    kotlin("android.extensions")
}

android {
    compileSdkVersion(28)
    defaultConfig {
        applicationId = "com.yggdralisk.githubbrowser"
        minSdkVersion(21)
        targetSdkVersion(28)
        versionCode = 1
        versionName = "1.0"
        testInstrumentationRunner = "android.support.test.runner.AndroidJUnitRunner"
    }
    buildTypes {
        getByName("release") {
            isMinifyEnabled = false
            proguardFiles(getDefaultProguardFile("proguard-android.txt"), "proguard-rules.pro")
        }
    }
}

dependencies {
    implementation(fileTree(mapOf("dir" to "libs", "include" to listOf("*.jar"))))
    implementation(kotlin("stdlib-jdk7", KotlinCompilerVersion.VERSION))
    implementation("com.android.support:appcompat-v7:28.0.0")
    testImplementation("junit:junit:4.12")
    androidTestImplementation("com.android.support.test:runner:1.0.2")
    androidTestImplementation("com.android.support.test.espresso:espresso-core:3.0.2")
}

repositories {
    mavenCentral()
    maven("http://repository.jetbrains.com/all")
}
```

## 示例文件链接

你可以在我的 GitHub 仓库中找到能用的 Gradle 示例文件，你也可以在任何时间随意地分叉和复制这些文件。

- [settings.gradle.kts](https://github.com/JanStoltman/GithubBrowser/blob/master/settings.gradle.kts)
- [根目录 build.gradle.kts](https://github.com/JanStoltman/GithubBrowser/blob/master/build.gradle.kts)
- [模块 build.gradle.kts](https://github.com/JanStoltman/GithubBrowser/blob/master/app/build.gradle.kts)


如果你在迁移中遇到了任何问题，记住要查看 **build/sync logs** 里面的错误提示，而不是看 Android Studio 弹出的错误提示，因为 Android Studio 对于 Gradle Kotlin DSL 的支持还远远称不上完美。
