---
title: Material Design 高度和阴影
date: 2017-04-08
categories: MaterialDesign
tags: MaterialDesign
---

## 概述

在 Materail Design 中，物体的行为和真实世界中很相似。

<center>
<img src="http://ooo.0o0.ooo/2016/10/25/580f8d694233c.png" width= 300/>
</center>


在真实世界中，物体堆放和叠加在一起，但是不能穿过彼此，并且会投射出阴影。
Material Design 的实体与之类似，也需要投射阴影。

Material Design 实体具有以下三个高度属性：

- 高度：指的是一个物体 **表面** 到另一物体表面的距离。物体的高度决定了它的阴影投射情况


- 默认高度：任何的实体都具有默认高度(Resting Elevation)，在一个平台中，组件的默认高度是 **一致的**，但是不同的 **平台** 或者 **设备** 可能具有不同的默认高度。


- 动态的高度偏移：这个属性指的是实体在 **响应事件时** 相对于 **默认高度** 的偏移量。


<!-- more -->## 高度（Android）

### 说明

高度的表示单位也是 dp，与 x 和 y 坐标一样。

需要注意的是，由于实体也具有厚度(1 dp)，所以高度指的是从一个实体表面到另一个实体表面的距离。

<center>
<img src="http://ooo.0o0.ooo/2016/10/25/580f911c51c09.png" width=550/>
</center>

同时，一个子对象的高度，指的是其 **相对于父对象的距离**。

### 默认高度

默认高度是不会变化的，当一个组件的高度变化时，它应该尽快的恢复默认高度。


#### 组件的默认高度

各个 Android 组件的默认高度可以到[官网](https://material.google.com/material-design/elevation-shadows.html#elevation-shadows-elevation-android)查看。

对于桌面环境来说，为了容纳鼠标和其他非触摸事件，它的组件的默认高度要比 Android 组件的默认高度低 2 dp。

组件的高度在不同的 App 之间应该相同，但是在不同设备之间不同。

比如说电视和 PC 就比手机具有更深的层次。

### 感应高度和动态的高度偏移

一些组件可能拥有感应高度，也就是说它会根据用户的输入（比如说触摸事件）来改变自己的高度。

一般来说，触摸，或者按压一个组件会使它的高度变高。

这些高度变化是通过 **动态高度偏移** 实现的。

动态高度偏移是相对于默认高度来说，组件需要移动的高度量。

动态高度偏移保证了在移动应用中组件高度偏移量的一致性。组件接受到触摸事件后，都能有一个不变的高度偏移量。

一旦触摸事件完毕，或者被取消，那么组件就必须恢复到其默认高度。

<!-- more -->### 避免高度冲突

拥有感应高度的组件可能会导致其他组件随着其高度变化而变化，这是因为 **组件不可以相互穿透**。

避免冲突的方法有很多：

在某一元素水平上，元素可以在它们产生冲突前提前移动或者消失。比如说一个 FAB 就可以在用户选择一个卡片的时候消失或者移出屏幕。

在布局水平上，你需要通过设计你的 App 布局来减少冲突的可能性。

比如说将 FAB 置于卡片列表的一端来避免 FAB 与卡片出现的冲突。

### 组件高度比较

<center>
<img src="http://ooo.0o0.ooo/2016/10/25/580f97a8896b0.png"/>
</center>

图中只有组件的高度是正确的，其他的属性(比如面积)不一定正确

<center>
![whatismaterial_3d_elevation3](http://ooo.0o0.ooo/2016/10/25/580f985cb48ba.png)
</center>
一个卡片，App Bar 和 FAB 的例子

<center>
![whatismaterial_3d_elevation4](http://ooo.0o0.ooo/2016/10/25/580f989bbcbd6.png)
</center>
另一个 Navigation Drawer 的例子

## 阴影

阴影给物体的高度和其运动的方向给予了一个重要的视觉线索。

它们也是唯一的用于区分不同平面的视觉线索。

一个物体的阴影由其高度决定。

<center>
<img src="http://ooo.0o0.ooo/2016/10/25/580f99629c60b.png" width=300/>
</center>

<div style="color:#D32F2F;text-align:center">
不可取，没有阴影，无法区分 FAB 和背景
</div>

<center>
<img src="http://ooo.0o0.ooo/2016/10/25/580f9a338a84a.png" width=300/>
</center>

<div style="color:#D32F2F;text-align:center">
不可取，过于脆弱的阴影表示 FAB 和蓝色背景是在同一个平面的
</div>

<center>
<img src="http://ooo.0o0.ooo/2016/10/25/580f9afa716f2.png" width=300/>
</center>

<div style="color:#4CAF50;text-align:center">
可取，较大且柔软的阴影表示 FAB 的高度比蓝色背景要高。
</div>

当出现触摸事件时，阴影可以提供一个物体运动方向的视觉线索，以体现物体和平面之间的相对距离。

<center>
<img src="http://ooo.0o0.ooo/2016/10/27/581193071df86.png" width=300/>
</center>

<div style="color:#D32F2F;text-align:center">
不可取，没有阴影无法指示物体是增大体积还是增加高度
</div>

<center>
<img src="http://ooo.0o0.ooo/2016/10/27/581193e7b8cfa.png" width=300/>
</center>

<div style="color:#4CAF50;text-align:center">
可取，阴影变得更大，更柔软表明了物体的高度在增加；<br />
反之，阴影变得更小，更脆弱表明物体的高度在减少
</div>

<center>
<img src="http://ooo.0o0.ooo/2016/10/27/581194ad53a92.png" width=300/>
</center>

<div style="color:#4CAF50; text-align:center">
可取，阴影不改变，表明物体的高度没有增加，而只是体积增大了。
</div>

### 组件参考高度

下面列出一些组件的参考高度，它们应当作为高度的典范来使用。

<!-- more -->#### App Bar

**4dp**

![whatismaterial_3d_elevation_component06](http://ooo.0o0.ooo/2016/10/27/581197337063a.png)


#### Raised Button

默认高度： **2dp**
按下高度： **8dp**

![whatismaterial_3d_elevation_component02](http://ooo.0o0.ooo/2016/10/27/581197947852f.png)

#### Floating Action Button(FAB)

默认高度： **6dp**
按下高度： **12dp**

![whatismaterial_3d_elevation_component08](http://ooo.0o0.ooo/2016/10/27/581198129617a.png)

#### Card

按下高度： **2dp**
抬起高度： **8dp**

![whatismaterial_3d_elevation_component03](http://ooo.0o0.ooo/2016/10/27/58119867c7e68.png)

#### Menus and sub menus

菜单： **8dp**

每个子菜单相对于父菜单增加 1dp

![whatismaterial_3d_elevation_component09](http://ooo.0o0.ooo/2016/10/27/581198f529dfc.png)

#### Dialogs

**24dp**

![whatismaterial_3d_elevation_component12](http://ooo.0o0.ooo/2016/10/27/5811992fdb62f.png)

#### Nav Drawer and Right Drawer

**16dp**

![whatismaterial_3d_elevation_component10](http://ooo.0o0.ooo/2016/10/27/5811998438b5d.png)

#### Modal Button Sheet

**16dp**

![whatismaterial_3d_elevation_component11](http://ooo.0o0.ooo/2016/10/27/581199c05092c.png)

#### Refresh indecator

**3dp**

![whatismaterial_3d_elevation_component05](http://ooo.0o0.ooo/2016/10/27/58119a02a62c2.png)

#### Quick entry/Search bar

默认高度： **2dp**
滚动高度： **3dp**

![whatismaterial_3d_elevation_component04](http://ooo.0o0.ooo/2016/10/27/58119a4d3e9cd.png)

#### Snackbar

**6dp**

![whatismaterial_3d_elevation_component07](http://ooo.0o0.ooo/2016/10/27/58119a7fe42f7.png)


#### Switch

**1dp**

![whatismaterial_3d_elevation_component01](http://ooo.0o0.ooo/2016/10/27/58119aa685bdd.png)


## 对象间关系

对象和对象集合间的关系和组织结构就决定了，当某个对象移动时，其他的对象是否随其移动。

对象可以独立的移动，也可以被其他上层对象的移动而随其移动

### 对象的层次结构

所有的对象都在一个 **父子关系** 的组织结构中。

> 由于 Android 采用 XML 标签结构

一个对象可以是系统的子对象，也可以是另一个对象的子对象。

父子关系的说明：

- 任何一个对象都有一个父对象
- 任何一个对象可以拥有 0 或多个子对象
- 子对象从父对象中继承可变属性，例如位置，旋转角度，放大倍数，和高度
- 同一层级的两个对象称为兄弟对象

如图，卡片上的按钮随着内容的滚动而滚动

![ezgif-979248372](http://ooo.0o0.ooo/2016/10/27/5811aa8d33959.gif)



### 例外

父对象是根对象的对象，例如一些主要的 UI 组件，它们的移动是独立于其他对象的。

比如说，一个 FAB 是不会随着内容的移动而滚动的。

其他的这种对象还包括：

- Nav drawer
- App bar
- Dialogs


如图，FAB 不随着内容的滚动而滚动

![ezgif-3827406795](http://ooo.0o0.ooo/2016/10/27/5811b33c38ca6.gif)

<!-- more -->### 交互

对象和其他对象的交互动作由它所在的结构位置决定。

例如：

- 子对象具有一个能与父对象区分的最小 z 轴高度。其他的对象不能插入到这个父对象和子对象之间
- 滚动的卡片是兄弟对象，所以它们会一起移动。而控制它们移动的就是它们的父对象。

### 高度

对象的高度取决于它的内容的结构还有它是否能独立于其他对象移动。
