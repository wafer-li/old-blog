---
title: C# 复杂类型
date: 2017-04-08
categories: CSharp
tags: CSharp
---

## 1. 数组

使用类似 Java 的语法进行数组初始化

```csharp
int[] intArray = new int[];

string[] stringArray = new string[] {"1", "2", "3"};
```

当然，数组也可以使用 `var` 声明

```csharp
// c is a int array
var c = new[] {1, 2, 3};
```


<!-- more -->

### 1.1 多维数组

C# 比较神奇的一点就是它有 **两种** 多维数组类型：矩形数组和交错数组。

#### 1.1.1 矩形数组

矩形数组时一个每一行长度都相等的多维数组

```csharp
// 6*6 的数组
int [,] matrix = new int[6, 6];
```

#### 1.1.2 交错数组

交错数组是 **数组的数组**，其中包括了内部数组。

```csharp
// 5 个不同数组
int[][] jagArray = new int[5][];
```

#### 1.1.3 区别

1. 矩形数组是 **一个数组**
2. 交错数组是 **数组的数组**，实际上也就是 Java 的普通多维数组
3. 矩形数组涉及方法调用，而交错数组只涉及内存访问。

    > 交错数组比矩形数组要快。

### 1.2 数组基类

数组实际上也是一个对象，可以调用基类 `System.Array` 的静态方法来进行一些工作。

 主要的方法有：

 - `Clear()`
 - `CopyTo()`
 - `Length`
 - `Rank`
 - `Reverse()`
 - `Sort()`

## 2. 枚举


<!-- more -->

### 2.1 声明与使用

使用 `enum` 定义枚举。

默认会以 `int` 来存储枚举值。

```csharp
enum EmpType
{
    Manager,                // 0
    Grunt,                  // 1
    Contractor,             // 2
    VicePresident = 101     // 101
}
```

可以通过 **冒号** (`:`) 来指定枚举储存的类型

```csharp
enum EmpType : byte
{
    Manager,        // 0
    Grunt,          // 1
    Contractor,     // 2
    VicePresident   // 3
}
```

### 2.2 获取枚举值

每个枚举对象都有个 `ToString()` 方法，可以用它获取枚举的 **名字**

```csharp
EmpType emp = EmpType.Manager;

emp.ToString();     // "Manager"
```

如果想获取枚举存储的变量值，那么使用强制转换即可。

```csharp
Console.WriteLine("{0} = {1}", emp.ToString(), (byte)emp);
```

`System.Enum` 还提供了 `GetValues()` 方法来获取枚举中的所有成员。

### 2.3 注意事项

需要注意的是，`switch` 可以接受 **0** 作为 **枚举值** 进行处理；

但是，对于其他的数值则不行。

所以最好还是使用类似 Java 的枚举使用方法。

## 3. 结构 (struct)

结构类型和类很相似，都可以具有构造函数、域和方法；同时也可以给它们附上可见性修饰符。

```csharp
struct Point
{
    public int x;
    public int y;

    public void Display()
    {
        Console.WriteLine("X = {0}, Y = {1}", x, y);
    }
}
```

结构和类的不同点主要在于：结构是一个 **值类型**，而类是一个 **引用类型**。

下面会详细描述两种类型的不同点。

需要注意的是，结构在声明时必须为 **每个域** 赋值；或者使用 **默认构造函数**，否则在使用结构时就会报错。


## 4. 值类型和引用类型

1. 值类型分配在栈中，引用类型分配在堆中
2. 值类型在使用等号(`=`)赋值时，对应内容的值被复制，而引用类型只复制指向对象的引用

    > 即，值类型在复制时，构造出了新的对象
    > 而引用类型只是复制指针，并没有构造出新的对象

3. 基本类型和枚举、结构都是值类型
4. 类、数组、字符串都是引用类型
5. 结构中包含引用类型时，复制结构，只复制引用类型的引用
6. 按值传递引用类型时，引用本身进行复制，然后传入方法中，不会改变原有的引用的指向
7. 按引用传递引用类型时，引用本身被传入方法中，会改变原有引用的指向

## 5. 可空类型

可空类型(nullable-type) 只能用于 **值类型**。

它使用 `?` 来表示一个值类型是 **可以为空的**。

```csharp
int? nullableInt = null;
```

这通常用于数据库编程中。

此语法不能用于引用类型，因为引用类型可以为空。

> 这和 Kotlin 中的 `?` 不同，Kotlin 中不指明 `?` 的类型都是不可空的。

可以使用 `??` 操作符为空类型赋予初始值。

```csharp
int myData = dr.GetIntFromDatabase() ?? 100;
```
