---
title: 使用 buildSrcVersions 轻松管理 gradle 依赖
author: Wafer Li
date: '2019-05-26 01:04'
tags:
  - Android
  - Gradle
categories:
  - Android
---
如果你开发过稍微有点体量的 Android App，都会因为越来越多的 Gradle 依赖而头疼。

一个 App 的编译依赖少则十几项，多则几十项，如果再加上多 module，那么依赖的统一管理就很重要了。

但是，如何高效统一管理，则是一个难题。今天就来说说如何使用 buildSrcVersions 轻松管理 gradle 依赖。

<!-- more -->

## 1. Ext 的弊端

在介绍 buildSrcVersions 之前，我们先来看看 Google 官方推荐的统一管理方式，即使用 `ext` 进行管理，例如：

```groovy
ext {
    // The following are only a few examples of the types of properties you can define.
    compileSdkVersion = 28
    buildToolsVersion = "28.0.3"

    // You can also use this to specify versions for dependencies. Having consistent
    // versions between modules can avoid behavior conflicts.
    supportLibVersion = "28.0.0"
    ...
}
```

然后在 `build.gradle` 中

```groovy
android {
  // Use the following syntax to access properties you defined at the project level:
  // rootProject.ext.property_name
  compileSdkVersion rootProject.ext.compileSdkVersion
  buildToolsVersion rootProject.ext.buildToolsVersion
  ...
}
```

但是！这种方式有很大的问题：

1. 由于多 module 工程需要共享一些变量，`ext` 定义的位置可能在其他地方
2. 最大的问题在于，IDE 不能跳转到这些变量的定义

在日常使用中，如果你对工程不是很熟悉，那么在依赖版本需要更改的时候就要翻箱倒柜找一阵，这不免令人烦躁，影响工作效率。

那么除了 `ext` 之外有没有更好的统一管理依赖的方式呢？

有的，Gradle 提供了一个 `buildSrc` 方式。

## 2. Kotlin + buildSrc 管理 gradle 依赖

时至今日，Kotlin 不仅可以作为源文件用于开发目的，而且也可以当成脚本运行，这就是 `.kts` 文件，而且 Gradle 系统也支持使用 `kts` 文件作为 build 脚本。

废话不多说，使用 Kotlin 和 buildSrc 进行依赖管理主要需要以下步骤：

1. 在根目录建立 `buildSrc` 文件夹
2. 在 `buildSrc` 中创建 `build.gradle.kts`，并加上如下语句

```kotlin
plugins {
  `kotlin-dsl`
}

repositories {
  jcenter()
}
```

3. 在 `buildSrc/src/main/java` 中创建 `Versions.kt` 和 `Libs.kt`

```kotlin
object Versions {
  const val compileSdkVersion = 28
  const val targetSdkVersion = 28
  ...
  const val retrofit = "2.8.6"
}

object Libs {
  const val retrofit = "com.squareup.retrofit2:retrofit:${Versions.retrofit}”
}
```

4. 最后，在 `app/build.gradle` 中

```groovy
android {
  compileSdkVersion(Versions.compileSdkVersion)
}
dependencies {
  implementation(Libs.retrofit)
}
```

这样，我们既能实现依赖的统一管理，也能使用到 IDE 的自动补全和定义跳转功能，迅速定位到需要改动的版本。

但是！上面我们还是要自己去编写 `buildSrc`，不免有些麻烦。

而于此同时，我们也丢失了原先 gradle 会自动提示依赖的版本升级特性。

那么有没有一种东西能够把这两个东西结合在一起实现文体两开花呢？

到这里终于进入本篇主题：使用 `buildSrcVersions` 插件

## 3. buildSrcVersions 自动生成 buildSrc 目录

[`buildSrcVersions` 插件的项目地址](https://github.com/jmfayard/buildSrcVersions)


首先，我们在根目录的 `build.gradle` 中引入插件：

```groovy
buildscript {
    //...
}
plugins {
  id("de.fayard.buildSrcVersions") version "0.3.2"
}
// Don't put any code before the buildscripts {} and plugins {} block
```

这个插件增加了 `buildSrcVersions` 这个 gradle task。

运行这个 task，它就会扫描并读取你的依赖项，并以此自动生成 `buildSrc` 目录。

运行的结果如下：
![buildSrcVersions Result](https://pic2.superbed.cn/item/5ce99625451253d178df7b87.jpg)

接下来，我们就可以将 `build.gradle` 中的依赖换成使用 `Libs` 进行引用

![build.gradle with buildSrc](https://pic.superbed.cn/item/5ce9971a451253d178df821a.jpg)

可以看到，上面这些依赖都是染了色的，也就是说它们可以直接跳转到对应的定义，而且也可以进行补全。

同时，`buildSrcVersions` 还具备检查更新的能力，如果你已经生成过 `buildSrc` 了，那么再次运行 `buildSrcVersions` task 就会对你的依赖项进行更新检查，可用的新版本会以注释的形式附在对应依赖项字符串的后面。

![buildSrcVersions Update](https://pic.superbed.cn/item/5ce99890451253d178df8c1e.jpg)

当然，它是不会随便改你的代码的，这个更新它只是进行一下提示，到底要不要使用新版本还是根据项目情况来决定。

不过，这个好用的插件也是有缺陷的：

首先，它会生成一个空的 `settings.gradle.kts` 文件，因为工程中只能有一个 `settings.gradle`，所以当它为空时还好，但是如果你往里面填东西，就会让 gradle 摸不着头脑，导致编译不稳定

对此，我们需要让它自动将 `settings.gradle` 文件删掉，为 `buildSrcVersions` task 增加一个 `doLast()` 即可：

```groovy
tasks["buildSrcVersions"].doLast { delete("${rootDir.path}/buildSrc/settings.gradle.kts") }
```

其次，它会导致 `build configuration` 失败，如图：

![](https://pic.superbed.cn/item/5ce99ac2451253d178df9b03.jpg)

其原因在于它的进程会占用 `build/dependenciesUpdate` 导致 `task("clean")` 无法创建。

虽然不影响工程的 Sync 和构建，但是有这个黄条总归是看的不爽的。

最后，它并不能自动的帮你改你的 `build.gradle`，需要你手动修改，当第一次使用这个东西的时候需要打的字还挺多的。

不过，比起它能自动快速构建 `buildSrc` 来说，也还算得上是瑕不掩瑜。

## 4. 一些潜在的坑

如果你选择自己编写 `buildSrc` 目录，务必注意以下几件事情：

1. 使用正确的目录结构

> `buildSrc` 遵循默认的 Java/Kotlin 目录结构，即 `buildSrc/src/main/java/...`

2. 不要忘记加 `jcenter()`

> 不要忘记在 `buildSrc/build.gradle.kts` 中增加 `jcenter()`，否则 `kotlin-dsl` 插件是加载不成功的


最后，也希望我的这篇文章能给大家提高劳动生产率吧，毕竟谁都想偷懒不是？:laughing:
