---
title: Kotlin Android Extension
date: 2017-04-08
categories: Android
tags: Android
---

## 0. 概述

Kotlin 对于 Android 开发，还提供了一些扩展特性，有助于提高 Android 开发的效率。

<!-- more -->## 1. findViewById

任何一个 Android 开发者都会对这个方法非常熟悉，我们通过它来获取视图中组件的对象实例，随后进行操作。

当然，一堆 `findViewById()` 势必降低了代码可读性，所以也出现了一些库（如 `ButterKnife`）用于简化这个方法的调用和造型，但由于它们都是运行期间的库，所以也就要求使用注解，这实际上并没有根本解决问题。

Kotlin 则将简化一步到位，只需要 `import` 视图对应的包，你就可以简单轻松的获取到对象的实例。

```
// Using R.layout.activity_main from the main source set
import kotlinx.android.synthetic.main.activity_main.*

class MyActivity : Activity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)
        textView.setText("Hello, world!")
        // Instead of findView(R.id.textView) as TextView
        // The name of instance is the name of its id
    }
}
```

## 2. 如何使用

很简单，只需要在 `app/build.gradle` 文件添加上下面这一行即可：

```
apply plugin: 'kotlin-android-extensions'
```

## 3. 使用场景

配置好 Kotlin Android Extension 之后，就可以使用 `import` 语句来导入对应的 xml 视图组件了。

```
kotlinx.android.synthetic.main.activity_main.*
```

这样你就能在 `Activity` 中直接通过 `id` 来使用这些组件了。

假如你需要在 Fragment 中使用这些组件怎么办呢？
Fragment 不像 Activity 拥有自带的 `findViewById()` 方法，它通常要使用一个 `rootView` 来进行组件获取。

很简单，只需要在上面的基础上加一个 `view` 即可。

```
kotlinx.android.synthetic.main.activity_main.view.*
```

这个功能也可以用在 Adapter 上；
如果引入了这个语句，那么我们可以使用如下语法来进行组件获取和调用：

```
    <TextView
            android:id="@+id/hello"
            android:layout_width="fill_parent"
            android:layout_height="wrap_content"
            android:text="Hello World, MyActivity"
            />
```

```
activity.hello.setText("Hi!")
```

<!-- more -->## 4. Android Flavors

有些时候，我们的 APP 会被分成付费版和免费版；
这个特性通常是通过在 `build.gradle` 划定 Android Flavors 来实现的。

那么对于不同的 Flavor，我们需要不同的布局组件怎么办呢？

很简单，只需要把上面的 `main` 改成相应的包名就行了；
对于 `free/res/layout/activity_free.xml`，我们可以写如下语句

```
import kotlinx.android.synthetic.free.activity_free.*
```

## 5. 实现原理

通过扩展方法，来给每个类提供相应的扩展属性和扩展方法；
然后通过不同的包来引入这些扩展。
