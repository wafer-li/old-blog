---
title: AndroidX 测试坑点详解（一）
author: Wafer Li
date: '2019-05-31 16:49'
categories:
  - Android
tags:
  - Android
  - Instrument Test
  - Espresso
---


最近在迁移到 AndroidX 之后一直折腾 TDD 的事情，也遇到了大的小的不少坑点；

鉴于 AndroidX 在测试方面还没有太多的文档，就写一篇博文来总结一下折腾的经验，也给后来人做一些参考。

<!-- more -->

## 1. 国产 ROM 的坑

`ActivityScenario` 和 `ActivityScenarioRule` 是新推出的操作 Activity 生命周期的类。

当构建 `ActivityScenario` 时，它便会自动启动你指定的 Activity 并让它处于 `RESUMED` 状态。

使用示例如下：

```kotlin
@RunWith(AndroidJunit4::class)
class MainActivityTest {
  @get:Rule
  val mainActivityScenarioRule = ActivityScenarioRule<MainActivity>(MainActivity::class.java)

    @Test
    fun onCreate_saveInstanceNull() {
        mainActivityScenarioRule.scenario
                .onActivity { activity ->
                  // 在这里获取 Activity 实例
                }
    }
}
```

但是，当我在手机上跑这个测试的时候，却遇到了下面的问题：

```bash
java.lang.AssertionError: Activity never becomes requested state "[RESUMED]"
(last lifecycle transition = "PRE_ON_CREATE")
```

也就是说，我这个 Activity 实际上并没有真正的 `onCreate` 而是一直处于被创建之前的状态，随后因为超时导致了报错退出。

> 具体的超时时间是 45 秒

但是到底是什么东西导致我的 Activity 启动不了却没有什么头绪，直到我用模拟器运行测试代码的时候，我发现： **居然测试通过了！**

原来，Android 的仪器测试(Instrumented Test)都会构建一个独立的 `test.apk` 并自动安装和运行。

而国产的手机系统对于应用自启动的管理非常激进（例如华为），而我也没有对 `test.apk` 设置白名单，于是系统就一直禁止 `tesk.apk` 的启动，导致测试失败。

在华为的手机应用管家中为 `test.apk` 设置白名单，测试就可以通过了。

## 2. Fragment Testing 的坑


### 2.1 编译依赖的坑

和 `ActivityScenario` 一样，Google 也提供了一个 `FragmentScenario` 方便在测试中获取 `Fragment` 实例和对 `Fragment` 进行操作。

但是需要引入 `fragment-testing` 库，按照 Google 的文档是下面的这条语句:

```groovy
debugImplementation 'androidx.fragment:fragment-testing:1.1.0-alpha07'
```

这里就是它的第一个坑，如果你只引入上面的这条语句，实际上根本不可能成功 Build。

主要有以下两点原因：

1. `fragment-testing` 需要依赖 `androidx.test.core`，而 debugImplementation 并没有引入 `androidx.text.core`

2. 我们需要在 Instrumented Test 中使用 `fragment-testing`，而上面并没有在 `androidTestImplementation` 引入


于是乎，正确的引入方式是：

```groovy
debugImplementation(Libs.androidx_test_core)
debugImplementation(Libs.fragment_testing)
androidTestImplementation(Libs.androidx_test_core)
androidTestImplementation(Libs.fragment_testing)
```

那么能不能把 `debugImplementation` 换成普通的 `implementation` 呢？

很可惜，这是不行的，不过至于为什么不行，我目前并没有对此进行深入研究。


### 2.2 主题的坑

导入和依赖的坑解决之后就到了如何使用的环节了。

具体的用法为：

```kotlin
@Test
fun testFragment() {
  launchFragmentScenario<LoginFragment>() { fragment ->
    // 使用 fragment
  }
}
```

但是，这么使用也是不行的。

如果你使用了 Material 的组件，例如 `TextInputLayout`，那么它会报如下错误：

```
Caused by: android.view.InflateException: Binary XML file line
#9: Error inflating class
**com.google.android.material.textfield.TextInputLayout**
```

在查阅相关资料之后，发现了[一个相关的 Issue](https://issuetracker.google.com/issues/119054431)

其中 Google 的人指出：

> You need to tell FragmentScenario **what theme you want** if you want something **other than the default Theme.WithActionBar**, that's correct.

也就是说，如果你使用了 Material 相关的主题，比如说常见的 `Theme.Appcompat` 等，那么就需要向 `FragmentScenario` 明确指出你使用的主题样式。

也就是说，上面的代码需要写成：

```kotlin
fun testFragment() {
  launchFragmentScenario<LoginFragment>(
    themeResId = R.style.Your_App_Theme
    ) { fragment ->
    // 使用 fragment
  }
}
```

程序才能正常运行。


## 3. onFragment/onActivity 和 check 的坑

`ActivityScenario` 和 `FragmentScenario` 都提供了一个相应的高阶函数 `onActivity()` 和 `onFragment()`，可以在其中获取到对应的 `Activity` 和 `Fragment` 的实例，并用它做相应的操作。

> 实际上 `onFragment()` 内部也是调用了 `onActivity()`

但是！需要注意的是，这两个 `on` 方法都是运行在主线程的，而 Espresso 的 `check()` 函数是一个耗时操作，如果你在 `onFragment()` 中调用 `check()`，那么就会 **阻塞 UI 线程**。

也就是说，需要将 `onView()` 相关的内容放到 `onFragment/onActivity` 的外面：

```kotlin
launchFragmentInContainer<LoginFragment>(
    themeResId = R.style.Theme_Shrine
).onFragment {
    tintColorRes = typedValue.resourceId
}

onView(withContentDescription(R.string.shr_logo_content_description))
    .check(matches(withDrawable(R.drawable.shr_logo, tintColorRes)))
    .check(matches(isCompletelyDisplayed()))
```

等等，放到外面就不会阻塞 UI 线程了吗？难道不会阻塞 `test.apk` 的 UI 线程？

经过反编译 `tesk.apk` 之后发现，实际上 `test.apk` **只包含测试用例相关的内容**，甚至没有一个 `Activity`，而真正的被测试的内容实际上还是在我们原来的 apk 之中，`test.apk` 实际上是通过启动被测试的 apk 的相关内容来实现仪器测试的。

也就是说，如果将 `onView` 相关的代码放到外面，实际上是在 `test.apk` 里面跑的，也就不会对被测试的 apk 进行阻塞。

## 4. 动画的坑

Android 官方的 Espresso 测试框架不能兼容动画效果，在跑测试，特别是点击、输入等 UI 测试时，需要进入开发者模式把能显示动画的都关掉：

![Turn Off Animation](../../images/android-espresso-坑点详解（一）/turn-off-animation.png)

不然 Espresso 会报 `PerformException`。

## 5. 测试 ImageView 的 Drawable 的坑


### 5.1 android:tint 的坑

对于 `ImageView`，我们需要测试它是否展示出了我们传入的 Drawable，不过比较可惜的是，Espresso 自身并没有提供 `withDrawable()` 方法，幸运的是，我们可以通过 Kotlin 的扩展函数实现这个功能：

```kotlin
fun withDrawable(@DrawableRes id: Int, @ColorRes tint: Int? = null, tintMode: PorterDuff.Mode = SRC_IN) = object : TypeSafeMatcher<View>() {
    override fun describeTo(description: Description) {
        description.appendText("ImageView with drawable same as drawable with id $id")
    }

    override fun matchesSafely(view: View): Boolean {
        val context = view.context
        val expectedBitmap = context.getDrawable(id)?.toBitmap()

        return view is ImageView && view.drawable.toBitmap().sameAs(expectedBitmap)
    }
}
```

但是，`ImageView` 支持着色 (tint) 功能，真正显示出来的 Drawable 和我们从 `Context` 里面拿到的 Drawable 很可能是不一样的，因此，我们也需要给 `expectedBitmap` 进行着色：

```kotlin
private fun Int.toColor(context: Context) = ContextCompat.getColor(context, this)

private fun Drawable.tinted(@ColorInt tintColor: Int? = null, tintMode: PorterDuff.Mode = SRC_IN) =
        apply {
            setTintList(tintColor?.toColorStateList())
            setTintMode(tintMode)
        }

private fun Int.toColorStateList() = ColorStateList.valueOf(this)

fun withDrawable(@DrawableRes id: Int, @ColorRes tint: Int? = null, tintMode: PorterDuff.Mode = SRC_IN) = object : TypeSafeMatcher<View>() {
    override fun describeTo(description: Description) {
        description.appendText("ImageView with drawable same as drawable with id $id")
        tint?.let { description.appendText(", tint color id: $tint, mode: $tintMode") }
    }

    override fun matchesSafely(view: View): Boolean {
        val context = view.context
        val tintColor = tint?.toColor(context)
        val expectedBitmap = context.getDrawable(id)?.tinted(tintColor, tintMode)?.toBitmap()

        return view is ImageView && view.drawable.toBitmap().sameAs(expectedBitmap)
    }
}
```

### 5.2 VectorDrawable 的坑

从 5.0 之后， Android 支持矢量图，即 `VectorDrawable`，在 `ImageView` 中使用 `app:srcCompat` 进行显示。

但是，虽然在普通的 apk 中可以正常显示矢量图，但是在运行仪器测试时仅仅这样是显示不了的，还需要在代码中使用 `setImageResource()` 才能在测试中显示出矢量图。

目前来看这是 Android 测试框架的一个 Bug，如果不想改代码的话可以不进行这方面的测试，毕竟图能不能显示出来，用眼睛看看就行了。

### 5.3 VectorDrawable 和 tint 的坑

上面说到了 Drawable 需要 tint，如果我们的 `ImageView` 显示的是 `VectorDrawable`，那就要小心了，因为 `VectorDrawable` 可以在它自己的 xml 文件中进行着色：

```xml
<vector xmlns:android="http://schemas.android.com/apk/res/android"
  android:height="152dp"
  android:tint="?attr/colorControlNormal"
  android:viewportHeight="152"
  android:viewportWidth="149"
  android:width="149dp">
```

注意上面的 **`android:tint="?attr/colorControlNormal"`**，这是在 `vector` 中定义的。

如果你给这个 `tint` 设定的是一个 `<selector>`，那么就需要注意了：

如果你的 `<selector>` 的第一个 `<item>` 不是默认颜色，而是 `state_enable:false` 之类的有状态的颜色，那么就需要在测试代码中获取 `R.attr.colorControlNormal` 并对 Drawable 重新进行着色，否则即使你没有对这个 Drawable 进行过任何修改，测试依旧会报错失败。

如果你的 `<selector>` 的第一个 `<item>` 是默认的不带有状态限定的颜色，那么就不需要重新着色。

鉴于默认的 `colorControlNormal` 是 `<selector>` 颜色，我建议在测试 Drawable 的时候都统一进行重新着色。

而如何在运行时取到 `colorControlNormal` 的真正的颜色资源 ID，可以参照以下代码：

```kotlin
val typedValue = TypedValue()
it.activity?.theme?.resolveAttribute(R.attr.colorControlNormal, typedValue, true)
tintColorRes = typedValue.resourceId
```

最后拿到的 `tintColorRes` 即为颜色资源 ID。

关于其中具体原理，可以参照我的[下一篇文章](/Android/android-测试坑点详解（二）——-vectordrawable-和-tint-问题解析)。
