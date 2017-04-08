---
title: Java 基础
date: 2017-04-08
categories: Java
tags: Java
---

## 1. 变量和数据类型

1. boolean【Java】 = bool【C ++】

2. 所有的变量都要被初始化，最好在声明的时候就对其赋值

    ```java
    double n = 0.0;		//Recommended
    ```

3. 使用 `final` 关键字指定常量

4. Java 有 **原始类型** 和 **引用类型**

    - 原始类型保存的是值，而引用类型实际上是指向内存块的指针
    - 数组和对象名都是对于真正的数组或者对象的引用，而不是其自身
    - 【这里的“引用”类似于指针，而不是对象的别名】

5. **数组和对象都要使用new来声明构建，Java会自动进行垃圾处理，因而不需要显式delete**

    > 数组的声明：`int[] a = new int[100];`
    > 类的构建：`Class a = new Class(...);`

    > 注意只有使用了 `new` 才会分配空间和构建对象，单纯的声明 `int[] a`类似于声明一个指向数组的指针
    >
    > Java对于大型数据类型只有通过 `new` 来构建，`int a [100]` 这种语法将不被接受，对于数组还可以使用列表初始化的语法
    > `int[] a = {1,2,3,4,6};`

6. Java允许数组长度为0 **（注意这里和null并不同）**

<!-- more -->## 2. 作用域

1. Java不允许在嵌套的代码块内声明同名变量

    > 所以尽量保证变量的名称不重复【在同一个包(package)内】

## 3. 控制流程

1. for循环中，Java要求在三个部分对同一计数器变量进行初始化，检测和更新

2. 可以使用break label的形式来跳出多重嵌套循环

    ```java
    //例如
    label:
    for()
    {
	    for()
	    {
		    for()
		    {
			    if()
		    	{
				    break label;
			    }
		    }
	    }
    }

    //break语句使得程序跳转到带标签的语句块末尾
    //即最外层的for循环的末尾
    ```

3. **for each循环，可以依此处理数组（或其他形式的集合）的每个元素，而不需要在意下标值**

    ```java
    //语法
    for(variable : colletion)
    {
	    //statement
    }

    //依次打印数组内字符
    a[]  = new int [100];
    ....
    for(int element : a)
    {
	    System.out.println(element);
	}
    ```
