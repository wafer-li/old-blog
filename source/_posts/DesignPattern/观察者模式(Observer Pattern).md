---
title: 观察者模式(Observer Pattern)
date: 2017-04-08
categories: DesignPattern
tags: DesignPattern
---

## 1. 概述

观察者模式，是在对象间定义一个**一对多**的关系。

当“一个” 对象的改变状态，依赖它的对象都会**收到通知**，并自动更新。

其中，“一个” 对象称作**主题、可观察者、被观察者**；

“多个” 对象被称作**观察者、倾听者、订阅者**。

> 这有点类似报社和读者的关系：发生新闻后，报社通过报纸来通知读者。
>
> 实际上就是一个典型的观察者模式。

> 事实上，观察者模式是 JDK 乃至实际程序和库中使用得最多的设计模式。
>
> 基本上所有的 Java GUI 均实现了观察者模式。（也就是 `Listener`）

<!-- more -->## 2. 实现方式

### 2.1 实现思路

1. 封装变化

   > 观察者模式中，主题的状态和观察者的种类和数量都会变化。
   >
   > 所以，需要对观察者进行封装。
   >
   > 同理，观察者也可能订阅多个主题，所以主题也需要进行封装。

2. 针对接口编程，不针对实现编程

   > 所以，我们使用接口，分别将主题和观察者进行封装。
   >
   > 实际上就是让各个主题实现统一的 `Subject` 接口；观察者实现统一的 `Observer` 接口。

3. 多用组合，少用继承

   > 观察者模式是一个一对多的**依赖关系**，这意味着，主题必须维护一个**观察者列表**。
   >
   > 状态改变后，通过调用通知方法来**逐个**通知观察者。
   >
   > 实际上，这意味着将观察者**组合**进了主题中。

### 2.2 图解

![](http://www.plantuml.com/plantuml/png/oymhIIrAIqnELGWkJSfAJIvHgEPIK2XAJSyi1ahu9nMd5fMb5cbeWWLpyyjIKOJoyaioqofXGiL0iLgkJBY9C76maQK5AOabgM0LoJc9nSKAplbvoKMf9Qd8zYh4nsErNQ5QJq-l5eiRu18OBe7BwEa1YVJKak0IYFqA2iK83hfZi3ePrIXzVOMdhTkUx9xsRDhEPvkd0es0-S165-vbBdJV0UNGxK3egz7JGmyEBhXBK6HXeW00)

## 3. 新设计原则——松耦合

**为了交互对象之间的松耦合设计而努力！**

> 所谓的**松耦合**，指的就是两个类、函数、模块之间相关度不高，改变其中的一个类不会造成另一个类的大幅变化。

观察者模式通过**接口**的形式来进行交互，主题可以随时增加和删除观察者列表中的观察者；

观察者也不需要关心主题的内容，它只需要接受主题的通知就可以了。

<!-- more -->## 4. 气象站例子的 UML 图解

![](http://www.plantuml.com/plantuml/png/bLD1JiCm4Bpx5Jw2LD8FS44jY4j5fLRYM6sJRJ5gd6YzgOX2_ewRO9FOAL8lbkoPdPtPR9Hcf0EaA3VL_XDJbesG3UmD4wJSIiAZCfRojZT8PwIx-m3EYpDU0NN1wb0xq5Yq5KBvXWu8EbPb1emXUQbCUOBw-OGvwj1areDzJNe2O-Gx0dyWBO7XGfPojxDdd4OsIPAq7JHEue4eXKUIn1v7v2tc9H9mHHVRtTDhbQjCSUtkQq9ZUjnRN5H4DikYq9Qf2cr-CtP-tHJ6pNnGsSpdJg2rahtYXe5jFfNUBBM2hvbSAJsJe3FvP8F24Ti_hoy5OGg6RzLrTGEfxOUYR0t4zQrYNQKiBwMTdjlOnmU_IsButUtxjHc7l6Xo8I4OG0X7eGRklfDak8v2-CNleAiMnxJOuHWF3OxH2NyY-AN-DpD5ZYrDiK9ZKvp8tWy0)

## 5. 推和拉

实际上，主题向观察者发送通知并不只有**主题向观察者推送**这一个方法；

我们还可以**让观察者主动从主题拉取数据**。

它们的主要区别在于：推的通知方法包含数据，而拉的不包含，只负责传输主题的引用。

```java
// Push
public void notifyObservers() {
  for (observer : list) {
    observer.update(Data data);
  }
}

// Pull
public void notifyObservers() {
  for (observer : list) {
    observer.update(this);
  }
}
```

拉的方法实现起来也很方便：

1. 首先主题提供 getter
2. 随后将**主题本身**作为参数传递给观察者即可。

采用拉的好处在于，观察者种类繁多，需要的数据不尽相同，这样一来，观察者只需要获取自己感兴趣的数据即可，而不需要同时拿到一大堆自己不想要的数据。

书中提到

> 如果采用拉，当扩展功能的时候，就不必要更新和修改观察者的调用，而只需改变自己来允许更多的 getter 方法来取得新增的状态。

这个观点固然不错，但是实际上，我们可以通过将数据**封装成一个类**来解决调用的问题。

事实上，根据 OO 设计的原则，应该 **Tell, Don't Ask** ，所以使用**推的方法会更好。**

<!-- more -->## 6. Java 内置的观察者模式

Java API 中内置了一个观察者模式，包含一个基本的 `Observer` 接口和一个 `Observable` **类**。

我们可以使用 Java 的内置 API 来快速的实现观察者模式，而不需要自己再造轮子。

基本的类图如下：

![](https://raw.githubusercontent.com/wafer-li/UMLStorage/master/image/observer_java_built_in.png)

其中，`setChanged()` 方法是用来**指示状态改变的**。在调用 `notifyObservers()` 之前，需要先调用这个方法。

同时，Java 也实现了推和拉的方式。

不带参数的 `notifyObservers()` 使用的是**拉的方法**，而带参数的使用的是推。

```java
public notifyObservers(Objecgt arg) {
  if (changed) {
    for (observer : list) {
      observer.update(this, arg);
    }
  }
}

public notifyObservers() {
  notifyObservers(null);
}
```



## 7. Java 内置观察者模式的缺陷

1. 违反面对接口编程原则

   > 由于 `Observable` 是一个**类**，并且实现了**自己的通知方法**，我们的通知途径就被绑定在了 `Observable` 的具体实现上，无法轻易改变。这也导致了对观察者的通知次序被绑定而无法改变。
   >
   > 同时，由于 Java 禁止多重继承，所以无法对 `Observable` 进行复用。

2. 违反多用组合，少用继承

   > `Observable`  中的 `setChanged()` 方法是 `protected` 的，
   >
   > 这意味着如果不继承 `Observable` 就无法修改 `setChanged()` 方法。

所以，如果应用要求弹性高，那么更好的方法应该是：

**自己重新造轮子！**
