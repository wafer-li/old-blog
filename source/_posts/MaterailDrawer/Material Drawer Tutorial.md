---
title: Material Drawer Tutorial
date: 2017-04-08
categories: MaterailDrawer
tags: MaterailDrawer
---

## 添加依赖

按照[官方网站](https://github.com/mikepenz/MaterialDrawer)上的依赖添加即可。

不过需要注意的是，必须等到 `MavenCentral` **同步了最新版本**才能使用最新版本，否则请退回前一个版本。

不然的话就要自己管理 Material Drawer 的依赖了。

<!-- more -->## 建立 Drawer

### 最简单的版本

```java
new DrawerBuilder().withActivity(this).build();
```

### 带有汉堡包的版本

```java
Drawer drawer = new DrawerBuilder()
                            .withActivity(this)
                            .withToolbar(toolbar)
                            .withActionbarToggle(true)
                            .build();
```

#### 汉堡包会动的版本


```java
Drawer drawer = new DrawerBuilder()
                        .withActivity(this)
                        .withToolbar(toolbar)
                        .withActionbarToggle(true)
                        .withActionBarDrawerToggleAnimated(true)
                        .build();
```


### 带有 Header 的版本

```java
Drawer drawer = new DrawerBuilder()
                            .withActivity(this)
                            .withAccountHeader(accountHeader)
                            // ...
                            .build()
```

### 调整宽度

可以通过 `DrawerBuilder` 中的 `withDrawerWidth*()` 来调整宽度。

其中 `*` 可以是 `dp` 也可以是 `px`

```java
Drawer drawer = new DrawerBuilder()
                        .withActivity(this)
                        .withToolbar(toolbar)
                        .withActionbarToggle(true)
                        .withActionBarDrawerToggleAnimated(true)
                        .withDrawerWidthDp(100)
                        .build();
```

## 建立 AccountHeader

上面演示了如何建立带有 Header 的版本，但是，其中的 `accountHeader` 也是要我们自己建立和配置的。

### 最简单的版本

```java
AccontHeader accountHeader = new AccountHeaderBuilder()
                                .withActivity(this)
                                .withHeaderBackground(R.drawable.header)
                                .build()
```

### 单个账户时关闭下拉菜单


```java
builder.withSelectionListEnabledForSingleProfile(false)
```
