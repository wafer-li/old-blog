---
title: Android 多个 icon 问题
date: 2017-04-08
categories: Android
tags: Android
---

最近在开发中遇到的 Android App 安装后，同一个 app 居然在应用列表里出现了**两个或者以上的图标**，这是怎么回事呢？

原来，Android 只要指定了 `action.MAIN` 的 `Activity` 就会显示一个图标，
而且图标的名字和 `Activity` 的 `android:label` 相同。

所以，解决办法就是只保留一个 `action.MAIN`。

同时，如果引入了其他 `module`，**也要检查那个 `module` 的 manifest**；

保证整个工程就只有一个 `action.MAIN`
