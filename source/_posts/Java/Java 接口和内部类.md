---
title: Java 接口和内部类
date: 2017-04-08
categories: Java
tags: Java
---

## 1. 接口

这是 Java 中的专有名词，指代的是 **interface** 关键字

<!-- more -->### 1.1 接口

```java
public interface Comparable {...}
```

- 接口不是类，而是对类的一组需求描述
- 接口中的所有方法自动为public
- 实现接口
    - 将类声明为实现给定的接口

        ```java
        class Employee implements Comparable {....}
        ```

    - 对接口中的所有方法进行定义

        > **接口实现必须声明为public**

- 特性
    - 不是类，不能使用new来实例化
    - 不能包含实例域和静态方法
    - 可以包含常量，接口中的域被自动设为public static final
    - 可以声明接口的变量

        ```java
        Comparable x;
        ```
    - 必须引用实现了接口的类对象

        ```java
        x = new Employee();
        ```

- 可以使用instanceof来检查一个对象是否实现了某个特定接口

    ```java
    if(anObject instanceof Comparable)
    ```

- 可以扩展（**继承**）

    ```java
    public interface Powered extends Moveable
    ```

- 每个类只能拥有一个超类，但是可以实现多个接口

    ```java
    class Employee extends Persons implements Comparable {
        ...
    }
    ```

### 1.2 对象克隆

- 默认克隆（`Object.clone()`）
- 浅拷贝
- protected方法
- 实现克隆
    - 必须实现 `Cloneable` 接口
    - 使用 `public` 重新定义 `clone()` 方法
    - 即使浅拷贝能满足要求，也要进行上述两条操作
    - 需要声明 `CloneNotSupportedException` 异常

<!-- more -->## 2. 内部类

```java
class TalkingClock
{
	public class TimePrinter implements ActionListenner
	{
		...
	}
}
```

### 2.1 概述

- 在类的内部直接定义，类似于C++的嵌套类
- 可以访问作用域内的数据，包括私有的
- 可以隐藏内部类
- 可以便捷实现回调

### 2.2 普通内部类

- 可以访问外围类对象数据（包括私有的）
- 通过 `OuterClass.this` 访问外围类
- 在外围类的作用域之外，使用 `OuterClass.InnerClass` 引用内部类

<!-- more -->### 2.3 局部内部类

- 简称局部类，在一个方法内进行定义

    ```java
    public void start()
    {
	    class TinmePrinter implements ActionListenner
	    {
		    ...
	    }
    }
    ```
- 局部类可以访问局部变量（必须声明为 `final`）
- 更新封闭作用域内的计数器时，使用 `final` 的长度为 $1$ 的数组

### 2.4 匿名内部类

```java
new SuperType(cosntruction parameters)
	{
		...
	}
// 如果只创建局部类的一个对象的时候才使用
```

- SuperType可以是类或者接口
- 如果用于实现接口时，不能有任何构造参数

```java
new InterfaceType()
	{
		...
	}
```

<!-- more -->### 2.5 静态内部类

- 用于将一个类隐藏在另一个类之中，通常用于防止名称的冲突
- 只有内部类可以声明为 `static`
- 特别的，通过静态方法构造的内部类必须声明为 `static`
