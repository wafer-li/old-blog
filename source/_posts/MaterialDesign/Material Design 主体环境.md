---
title: Material Design 主体环境
date: 2017-04-08
categories: MaterialDesign
tags: MaterialDesign
---

## 1. 概述

**Material Design 是一个三维环境，包括了灯光，实体，和投射阴影。**

<center><img src="https://material-design.storage.googleapis.com/publish/material_v_9/0B7WCemMG6e0VVFpiZ041SmhwY2c/what_is_material_environment.png" width="500"/></center>

所有的实体对象都具有 x, y, z 三个坐标。

一个对象只能拥有一个 z 轴位置。（即不允许两个实体重叠）

主光源用于制造方向投影，散射光源用于制造柔和阴影。

- 实体厚度： 1dp
- 阴影由重叠实体之间的高低差产生
    > 即阴影实际上就是高低差的代表

<!-- more -->## 2. 3D 世界

Material Design 是一个 3D 世界。
这意味着所有的实体都具有 3 个维度的坐标；
z 轴垂直对齐于屏幕，正轴指向屏幕外侧。

<center><img src="https://material-design.storage.googleapis.com/publish/material_v_9/0Bx4BSt6jniD7UXpQYWltVjNPWXc/whatismaterial_environment_3d.png"/></center>

一个实体厚度为 1dp，并独享一个 z 轴坐标。

> $dp = (像素宽度 \times 160) / 像素密度$

在网页端，z 轴是用来分层而不是用来展示视角，z 轴的坐标通过操作 y 轴来模拟实现。

## 3. 灯光和阴影

在环境中，虚拟光源营造出了场景。

主光源用于投射方向投影，而散射光源用于在各个角度投射柔和的光影。

在环境中的阴影由以上这两种光源来实现。
在 Android 开发中，阴影的产生是因为光源被不同 z 轴坐标上的实体遮挡。在网页开发中，通过调整 y 轴来进行仿真实现。

下面是一个标高为 6 dp 的实体的例子。

<center><img src="https://material-design.storage.googleapis.com/publish/material_v_9/0B6Okdz75tqQsSFZUZ01GTk13T28/whatismaterial_environment_shadow1.png" width="300"/></center>
<center>直射光源投射的阴影</center>

<center><img src="https://material-design.storage.googleapis.com/publish/material_v_9/0B6Okdz75tqQsdDhaaTMwMTFVLTA/whatismaterial_environment_shadow2.png" width="300"/></center>
<center>散射光源的阴影</center>

<center><img src="https://material-design.storage.googleapis.com/publish/material_v_9/0B6Okdz75tqQsNnVmbTNMUF9DR0U/whatismaterial_environment_shadow3.png" width="300"></center>
<center>两种光源的混合投影</center>
