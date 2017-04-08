---
title: 策略模式(Strategy Pattern)
date: 2017-04-08
categories: DesignPattern
tags: DesignPattern
---

## 1. 概述

策略模式：定义算法族，分别封装起来，使它们可以相互替换。

此模式让算法的变化独立于使用算法的用户。

<!-- more -->## 2. OO 基础

- 抽象
- 封装
- 多态
- 继承

## 3. 设计原则

- 封装变化

  > 将应用（类）中有可能变化的部分封装出来，和稳定的部分相互隔离

- 针对接口编程，而非针对 实现编程

  > 为了运行时能动态改变类的行为，我们应该**针对接口编程**，而非针对实现编程。
  >
  > 也就是说，使用接口来实现各个行为，而不是将行为固定在类的具体实现中。

- 多用组合，少用继承

  > `has-a` 比 `is-a` 更好，能够得到更多的应用弹性。

<!-- more -->## 4.  具体实现

**关键：使用委托，并使用 setter 实现行为的动态变化。**

### 4.1 使用接口封装行为

![](http://ww3.sinaimg.cn/large/65e4f1e6gw1f9psjbgdc1j20le0a6mxh.jpg)



### 4.2 对象包含接口

![](http://ww4.sinaimg.cn/large/65e4f1e6gw1f9pszct1akj20tz0efab4.jpg)

### 4.3 使用 Setter 实现运行时更改行为

![](http://ww3.sinaimg.cn/large/65e4f1e6jw1f9ptf31737j20tu0fcq43.jpg)

```java
ModelDuck modelDuck = new ModelDuck();
modelDuck.performFly();		// FlyNoWay
modelDuck.setFlyBehavior(new FlywithWings());
modelDuck.performFly();		// FlywithWings
```
