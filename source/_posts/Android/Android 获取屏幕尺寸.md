---
title: Android 获取屏幕尺寸
date: 2017-04-08
categories: Android
tags: Android
---

有时候为了实现 Respnsive 或者一些其他的需求，我们就需要拿到当前屏幕的尺寸。

那么在 Android 中该如何做到呢？请看如下代码：

```kotlin
fun getScreenSizeDp(activity: Activity): Pair<Float, Float> {
    val display: Display = activity.windowManager.defaultDisplay
    val displayMetrics = DisplayMetrics()
    display.getMetrics(displayMetrics)

    val density = activity.resources.displayMetrics.density

    return Pair(displayMetrics.widthPixels / density, displayMetrics.heightPixels / density)
}
```

首先，我们使用 `Activity` 对象来获取到 `WindowManager` 的 `defaultDisplay`。

然后，我们构建一个 `DisplayMetrics` 对象，用来存储特定的尺寸数据。

注意，我们只能获取到屏幕的**像素大小**，而不能获取到 Android 常用的 dp。

所以，我们就要先拿到屏幕的像素密度，然后再用像素除以像素密度来得到屏幕的 dp 尺寸。
