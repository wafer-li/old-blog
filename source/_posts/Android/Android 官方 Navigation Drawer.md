---
title: Android 官方 Navigation Drawer
date: 2017-04-08
categories: Android
tags: Android
---

## 概述

Navigation drawer 作为 Android Material Design 中主流的一种导航方式，当然受到 Google 的重视，所以，作为 MD 设计推出的实现部分，Android 更新了 support library 增加了关于 Navigation Drawer 的支持。

下面就来看看如何进行 Navigation Drawer 的构建。

<!-- more -->## 添加依赖

官方的 Navigation Drawer 需要用到 `DrawerLayout` 和 `NavigationView`，它们都在 support design 包下。

```groovy
compile 'com.android.support:design:24.2.1'
```

> 这里不使用最新的 `25.0.0` 的原因在于，最新版在 UI Editor 渲染时存在 bug。Google 不愧是世界上最伟大的半成品公司。

## 设计 `layout/activity_main.xml`

```xml
<?xml version="1.0" encoding="utf-8"?>
<android.support.v4.widget.DrawerLayout
    android:id="@+id/drawer_layout"
    xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    xmlns:tools="http://schemas.android.com/tools"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:fitsSystemWindows="true"
    tools:context="com.wafer.toy.github_client.ui.activity.MainActivity">

    <!-- Your main content -->


    <android.support.design.widget.NavigationView
        android:id="@+id/navigation_drawer"
        android:layout_width="wrap_content"
        android:layout_height="match_parent"
        android:layout_gravity="start"
        app:headerLayout="@layout/drawer_header"
        app:menu="@menu/drawer_item"/>
</android.support.v4.widget.DrawerLayout>
```

需要注意的是，`DrawerLayout` 是布局的**根目录**，同时要设置 `fitsSystemWindows="true"`，否则，将会覆盖掉顶部状态栏。

还有，注意要设置 `NavigationView` 的 `layout_gravity="start"`，否则不会生效。

## 构建 `layout/drawer_header.xml`

一般来说，Nav Drawer 都需要有一个 header 来存放用户头像等等有关用户账户的概览信息。

所以我们还要定义一个 header 的布局，然后像上面一样，将其赋予 `app:headerLayout`

header 的布局注意满足 [Material Design](https://material.google.com/patterns/navigation-drawer.html) 即可；布局样式和摆放不限。

<!-- more -->## 定义 `menu/drawer_item.xml`

是时候给我们的 Nav Drawer 加上一点内容了，通过在 `menu/drawer_item.xml` 中定义相应的组件即可。

```xml
<menu xmlns:android="http://schemas.android.com/apk/res/android">

    <group android:checkableBehavior="single">
        <item
            android:id="@+id/nav_home"
            android:icon="@drawable/ic_drawer_home"
            android:title="@string/nav_home" />
        <item
            android:id="@+id/nav_about"
            android:icon="@drawable/ic_drawer_about"
            android:title="@string/nav_about" />
        <item
            android:id="@+id/nav_settings"
            android:icon="@drawable/ic_drawer_settings"
            android:title="@string/nav_settings" />

        <item
            android:id="@+id/navigation_subheader"
            android:title="@string/nav_sub_header">
            <menu>
                <item
                    android:id="@+id/navigation_sub_item_1"
                    android:icon="@drawable/ic_drawer_about"
                    android:title="@string/nav_sub_item_1" />
                <item
                    android:id="@+id/navigation_sub_item_2"
                    android:icon="@drawable/ic_drawer_home"
                    android:title="@string/nav_sub_item_2" />
            </menu>
        </item>
    </group>
</menu>
```

注意，项目的分界通过内嵌的 `<menu>` 来实现。

需要注意的是，官方的 nav drawer 中的 item 没有 ripple，只有长按才能显示。

最后我们再将这个 `menu` 赋到 `NavgationView`的 `app:menu="@menu/drawer_item"`上

## 显示汉堡包图标

Drawer 到这里就完全搭建好了，但是，没有汉堡包图标，用户就不知道我们的应有有个 Nav Drawer。所以，我们就需要给 `toolbar` 加上一个汉堡包图标来凸显 Nav Drawer 的存在。

在这里，我们需要进入到 `java` 文件中进行修改了，由于我用的是 Kotlin，这里使用 Kotlin 来做演示。

下面就是增加显示汉堡包的方法：

```kotlin
class MainActivity : BaseActivity() {

    private val actionBarDrawerToggle: ActionBarDrawerToggle by lazy { createActionBarDrawerToggle() }

    override fun initView() {
        initToolbar()
        initActionBarDrawerToggle()
    }

    private fun initActionBarDrawerToggle() {
        drawer_layout.addDrawerListener(actionBarDrawerToggle)
        actionBarDrawerToggle.syncState()
    }

    private fun initToolbar() {
        setSupportActionBar(toolbar)
    }



    private fun createActionBarDrawerToggle(): ActionBarDrawerToggle {
        return ActionBarDrawerToggle(
                this, drawer_layout, toolbar, R.string.open_drawer, R.string.close_drawer)
    }

    override fun getLayoutRes(): Int {
        return R.layout.activity_main
    }
}
```

首先，使用 `DrawerLayout` 对象和 `toolbar` 对象来构建一个 `ActionBarDrawerToggle` 对象；

然后让 `ActionBarDrawerToggle` 成为 `drawer_layout` 的一个接口；

最后设置 `actionBarDrawerToggle.syncState()` 即可。

## 使状态栏透明

我们已经成功的构建出了一个 Navigation Drawer，但是，其显示出来的效果是这样的

![](https://img.readitlater.com/i/matthewwear.xyz/content/images/2016/05/Screenshot-2016-05-31-09-57-54/RS/w1408.png)

而官方的 MD 规范上，状态栏的效果是半透明的。

所以，我们还要做一些额外的步骤来让我们的 Nav Drawer 更符合规范。

### 去除 Actionbar

这个步骤通常已经在初步搭建构架的时候就完成了。也就是说为 `style.xml` 增加如下两项：

```xml
<item name="windowActionBar">false</item>
<item name="windowNoTitle">true</item>
```

并且继承 `Theme.AppCompact.Light.DarkActionBar`

<!-- more -->### v21 增加关于状态栏的属性

在 `value-21/style.xml` 中，增加另外的两项：

```xml
<item name="windowActionBar">false</item>
<item name="windowNoTitle">true</item>
<item name="android:windowDrawsSystemBarBackgrounds">true</item>
<item name="android:statusBarColor">@android:color/transparent</item>
```

### 设置 DrawerLayout 使用 `fitsSystemWindow`

```xml
<android.support.v4.widget.DrawerLayout
    ...
    android:fitsSystemWindows="true"
    app:insetForeground="@color/inset_color"
    >
```

OK，到这里就大功告成了！

![](https://img.readitlater.com/i/matthewwear.xyz/content/images/2016/05/Screenshot-2016-05-31-10-24-05/RS/w1408.png)

<!-- more -->### 补充：动态改变 status bar 颜色

如果你想动态改变状态栏颜色的话，也有相应的 Java 接口。

```java
drawerLayout.setStatusBarBackgroundColor(ContextCompat.getColor(this, R.color.wierd_green));

drawerLayout.setScrimColor(ContextCompat.getColor(this, R.color.wierd_transparent_orange));
```

## 总结

这样构造出来的 Nav Drawer 和 MaterialDrawer 不同的一个地方在于，Nav Drawer 是在设计层面上进行修改，而 MaterialDrawer 是在代码层面上进行修改，侵入性不强，不过也较为麻烦。

总的来说，如果要快速搭建，则选择 MaterialDrawer；
但是要选择使用清真的写法，那么 Nav Drawer 则会更好。
