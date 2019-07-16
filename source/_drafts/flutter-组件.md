---
title: "Flutter 组件"
author: "Wafer Li"
date: "2019-07-16 11:23"
---

基本布局思想：Flex 布局

## 1. 根组件

根组件通常就是 APP，分为 `MaterialApp(Material Design)` 和 `CupertinoApp(iOS Design)`

## 1. 基本组件

> Container

为组件增加 margin padding 等属性，也就是说普通的组件是不具备通常的盒子模型的，container 就是为其加上盒子模型

> Row

按照水平行展示其孩子，需要将其孩子包裹在 `Expanded` 中，让孩子占据其可用空间。

可类比 Android 的 `LinearLayout`

如果不包裹在 `Expanded` 中，当溢出可显示区域时，Flutter 会显示一个黄黑相间的警示条

但是，如果你的 `Row` 是位于一个可以水平滚动的组件之下，那么就可以去掉 `Row` 孩子的 `Expanded`；`Expanded` 的意义在于， **让 `Expanded` 内部的东西占据可能的剩余父空间**，如果父亲的空间是无限的，那么就可以让孩子全部展示出来

> Column

与 `Row` 类似，只不过是垂直展示的

> Text

显示文字，包括文字的颜色等各种样式，类似于 Android 的 `TextView`；

此外还有一个 `RichText`，可以在一个 `Text` 中显示不同的样式，类似于 Android 的 `SpannableText`

> Image

显示图片，有不同的构造函数，用来从不同的数据源取得图片

> Scaffold

顾名思义，提供了基本的 Material Design 骨架，包括抽屉、Appbar 等

> Appbar

顾名思义，提供了 Material Design 的 Appbar

> RaisedButton

类似 Android 的 MaterialButton，具有阴影和点击反馈
