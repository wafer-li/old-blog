---
title: 生成器模式(Builder Pattern)
date: 2017-04-08
categories: DesignPattern
tags: DesignPattern
---

## 1. 概述

生成器模式(Builder Pattern) 听起来很像 工厂模式(Factory Pattern)，不过两者有着很大的不同。

工厂模式的目标是利用多态，减少类之间的耦合度；

而生成器模式的目标在于， 一步一步地构建一个复杂产品，同时解决由于复杂参数造成的构造器数量爆炸。

同时，生成器需要一个指导者来一步一步地指定产品构建的参数或者产品构建的步骤；

而工厂模式不需要指导者。

<!-- more -->## 2. 结构类图

![](https://ww4.sinaimg.cn/large/006tNc79ly1fdk1a55zpqj309j0a2wep.jpg)

## 3. 构造复杂产品

所谓的复杂产品就是一个产品中有很多子类，而且每个子类都有相应的构造流程。

例如，一个蛤蜊比萨，拥有面饼，酱料，芝士，蛤蜊等其他食材。


```java
public class ClamPizza {
    Dough dough;
    Sauce sauce;
    Cheese cheese;
    Clam clam;
}
```

对于这样一个复杂产品，我们就将其构造的过程委派给一个建造者(Builder)来完成。

```java
public interface ClamPizzaBuilder {
    ClamPizzaBuilder prepareDough();
    ClamPizzaBuilder prepareSauce();
    ClamPizzaBuilder prepareCheese();
    ClamPizzaBuilder prepareClam();

    ClamPizza build();
}

```

然后，我们对接口进行实现。

注意，这里有两种具体类的实现方法：

1. 在构建实际建造者时，就 **立即** 创建一个 **默认的产品对象**；

2. 由实际建造者储存创建产品的参数，当调用 `build()` 方法时，才返回产品对象


在这里，需要指明的就是方法二更好；

因为方法二符合语义，只有调用 `build()` 才真正的构建了对象；

而且也适合于不可变对象（构造之后对象的属性不能发生改变）。


方法一：

```java
public class ConcreteClamPizzaBuilder implements ClamPizzaBuilder
{
    ClamPizza clamPizza = null;

    public ConcreteClamPizzaBuilder() {
        clamPizza = new ClamPizza();
    }

    @Override
    public ClamPizzaBuilder prepareDough(Dough dough) {
        // 准备面团，可以直接放入，也可以进行处理后放入
        return this;
    }

    //  剩下的 prepare 方法

    @Override
    public ClamPizza build() {
        return clamPizza;
    }
}
```

方法二：

```java
public class ClamPizza {
    // fields

    public ClamPizza(ClamPizzaBuilder builder) {
        this.dough = builder.dough;
        // etc.
    }
}

public class ConcreteClamPizzaBuilder implements ClamPizzaBuilder
{
    // fields

    public ConcreteClamPizzaBuilder() {
        clamPizza = new ClamPizza();
    }

    @Override
    public ClamPizzaBuilder prepareDough(Dough dough) {
        this.dough = dough;
        return this;
    }

    //  剩下的 prepare 方法

    @Override
    public ClamPizza build() {
        return ClamPizza(this);
    }
}
```

生成器模式和工厂模式最大的不同就是拥有一个指挥者来指挥产品的构建过程；

```java
public class ClamPizzaDirector {
    private ClamPizzaBuilder builder;

    // 指挥者用于指定产品建造的步骤
    public ClamPizza construct() {
        builder.prepareDough();
        builder.prepareCheese();
        builder.prepareClam();
        builder.prepareSauce();
    }
}
```

当然，有些比萨并不需要芝士，这个时候，我们就可以去除掉 `prepareCheese()` 的这一个步骤。

## 4. 内部生成器减少构造器

生成器模式除了能构造复杂产品以外，一个很重要的作用就是能解决由于构造参数的组合过多所导致的构造器爆炸。

### 4.1 构造器爆炸

假如一个类拥有 4 个属性，那么它 **理想状态** 下的构造函数就有 0 个参数，一个参数，两个参数，三个参数和四个参数。

也就是说，它的构造器数量
$$
W = C_4^0 + C_4^1 + C_4^2 + C_4^3 + C_4^4
$$

当类的属性为 $n$ 时，有

$$
\begin{align}
W &= C_n^0 + C_n^1 + C_n^2 + \cdots + C_n^{n-1} + C_n^n \\
&= 2^n
\end{align}
$$

所以，类的属性和理想状态下的构造器数量为 **指数关系**

### 4.2 实现

```java
public class Pizza {
    Dough dough;
    Cheese cheese;
    Sauce sauce;

    private Pizza(Pizza.Builder builder) {
        this.dough = builder.dough;
        this.cheese = builder.cheese;
        this.sauce = builder.sauce;
    }

    public static class Builder {
        private Dough dough = defaultDough;
        private Cheese cheese = null;
        private Sauce sauce = null;

        public Builder prepareDough(Dough dough) {
            this.dough = dough;
            return this;
        }

        public Builder prepareCheese(Cheese cheese) {
            this.cheese = cheese;
            return this;
        }

        public Builder prepareSauce(Sauce sauce) {
            this.sauce = sauce;
            return this;
        }

        public Pizza build() {
            return new Pizza(this);
        }
    }
}
```

这样，即使 `Pizza` 有三个属性，但是我们通过使用一个内置的 `Builder`，成功地将构造器限制在了一个；

同时，由于每个 `prepare` 方法都会返回 `Builder`；

也就是说，我们可以在任何一个准备阶段进行 `build()`；

这样，也就满足了不同的参数组合的需求；

同时，由于 `Pizza` 的构造函数是 `private` 的，所以这就限定了只能通过生成器来建造对象。


使用：

```java
public static void main(String[] args) {
    Pizza Pizza = new Pizza.Builder()
                    .prepareDough(dough)
                    .prepareSauce(sauce)
                    .prepareCheese(cheese)
                    .build();
}
```

<!-- more -->## 5. 模式扩展

当只有一个具体建造者时，可以直接省略生成器接口；

例如上面的静态内部生成器。

有时候可以直接省略指挥者对象，而由 **客户** 直接充当指导者；

例如，客户自己冲泡咖啡。


## 5. 与抽象工厂的不同

抽象工厂模式生产的是一个产品族，而生成器模式所生产的 **一个** 复杂产品；

形象的说明就是，抽象工厂生产的是 **汽车的零部件**；

而生成器是将零部件 **组装** 成为一辆汽车。

## 6. 优缺点

### 6.1 优点

1. 良好的封装性，客户端不必知道产品的内部细节

2. 建造者是独立的，容易扩展

3. 可以使用其他的对象进行构造辅助，而普通的产品构造方式不容易获取到


### 6.2 缺点

1. 产生多余的 `Builder`  对象

2. 建造的过程暴露在外
