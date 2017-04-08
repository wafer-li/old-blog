---
title: C# Basic
date: 2017-04-08
categories: CSharp
tags: CSharp
---

## 1. Hello, World!

```csharp
namespace SimpleCSharpApp
{
  class Program
  {
    static void Main(string[] app)
    {
      Console.WriteLine("Hello, World!");

      Console.ReadLine();
    }
  }
}
```

​	基本的编码规范：

- 区分大小写
- 命名空间、类、成员（包括方法）采用**大驼峰**
- 大括号另起一行


<!-- more -->

## 2. 基本类型

C# 中的基本类型都是**对象**，事实上，基本类型的关键字都对应一个 `System` 命名空间中的一个**类**

> 显然是相对于 Java 的重大进步

下表给出了 C# 基本类型和 CLS，系统类型的对应关系。

| 基本类型    | 符合 CLS？ | 系统类型           | 范围                                       | 作用                  |
| ------- | ------- | -------------- | ---------------------------------------- | ------------------- |
| bool    | T       | System.Boolean | true or false                            | 布尔值                 |
| sbyte   | F       | System.SByte   | -128 ~ 127                               | 有符号的 8 bit 整数       |
| byte    | T       | System.Bute    | 0 ~255                                   | 无符号的 8 bit 整数       |
| short   | T       | System.Int16   | -32768 ~32767                            | 有符号的 16 bit 整数      |
| ushort  | F       | System.UInt16  | 0 ~ 65535                                | 无符号的 16 bit 整数      |
| int     | T       | System.Int32   | -$2^{31}$ ~ $2^{31} -1$                  | 带符号的 32 bit 整数      |
| uint    | F       | System.UInt32  | 0 ~ $2^{32}$                             | 无符号的 32 bit 整数      |
| long    | T       | System.Int64   | -$2^{63}$ ~ $2^{63} -1$                  | 有符号的 64 bit 整数      |
| ulong   | F       | Sytem.UInt64   | 0 ~ $2^{64}$                             | 无符号的 64 bit 整数      |
| char    | T       | System.Char    | U+0000 ~U+ffff                           | 16 bit 的 Unicode 字符 |
| float   | T       | System.Single  | $-3.4 \times 10^{38} \sim +3.4 \times 10^{38}$ | 32 bit 浮点数          |
| double  | T       | System.Double  | $\pm 5.0 \times 10^{-324} \sim \ \pm 1.7 \times 10 ^{308}$ | 64 bit 浮点数          |
| decimal | T       | System.Decimal | $(-7.9 \times 10^{28} \sim 7.9 \times 10^{28})/(10^{0 \sim 28})$ | 128 bit 带符号数        |
| string  | T       | System.String  | 受系统内存限制                                  | 字符串                 |
| object  | T       | System.Object  | 任何类型都能保存在一个 object 变量中                   | 所有类的基类              |

### 2.1 声明和初始化

C# 变量声明和初始化采用 C 系语言的一贯语法：

```csharp
int myInt = 0;

string myString;
myString = "This is my string";

bool b1 = true, b2 = false, b3 = true;
```

当然也可以用全名来声明一个基本变量，不过基本没人这么干。


<!-- more -->

### 2.2 默认值

与 Java 一样，C# 的基本变量都具有一定的默认值。

- `bool` 默认为 `false`
- 数值类型默认为 0，如果是浮点数，则为 0.0
- `char` 类型默认为空字符
- `BigInteger` 默认为 0
- `DateTime` 类型设置为 `1/1/0001/ 12:00:00 AM`
- 对象引用默认为 `null`

### 2.3 基本类型的对象成员

C# 与 Java 最大的区别就是，取消了原始类型，所有的类型都是对象。

所以，基本对象也具有成员，通常集成了一些对本类型的一些处理方法，和 Java 中的 `Integer` `Long` 等类型不同。

需要注意的是，基本类型内置了 `Parse()` 方法，用于将 `string` 字面量转换成对应的对象。

```csharp
bool b = bool.Parse("True");
```


<!-- more -->

### 2.4 Big Number

与 Java 一样，C# 也内置了 `BigNumber` 类型，它需要使用 `System.Numerics` 命名空间才能使用。

## 3. 字符串

C# 的字符串和 Java 的大体相似，只有少数的扩展功能。

字符串使用 `string` 定义，而不是使用大写的。

同样，支持加号拼接、转义、`StringBuilder`。

字符串也是不可变的。

不过，C# 字符串相对于 Java 来说也有一些扩展功能。

### 3.1 逐字字符串

实际上就是原始字符串，在字符串引号前加上 `@`，则编译器不会对转义字符进行转义，同时，空格也会得到保留（即可以声明多行字符串）。

```csharp
string raw = @"C:\MyApp\bin\Debug";

string multipleLine = @"This is
  mutiple
  line
  string";
```

### 3.2 相等性判别

谢天谢地，C# 支持了操作符重载功能，也就是说，可以用 `==` 和 `!=` 进行字符串相等性判别，而不是 Java 的引用判别。

与此同时，也可以使用传统的 `Equals()` 来进行字符串相等性判断。

```csharp
string s1 = "hello";
Console.WriteLine(s1 == "hello");	// true
Console.WriteLine(s1.Equals("hello"));
```

### 3.3 字符串格式化

C# 中使用 `{0}` `{1}` 等可以实现字符串格式化。

```csharp
string hehe = "hhe";
string s = "{0}, {1}, $hehe";
Console.WriteLine(string.Format(s, 1, 2));
```

同时也可以使用基本的格式化字符，可以直接使用于控制台输出。

```csharp
Console.WriteLine("c format: {0:c}", 99999); //$99999.00
```



> 比起 Java 只能用格式化字符，不知道高到哪里去了。

下面是一些常用的格式化字符：

| 格式化字符 | 作用                                 |
| ----- | :--------------------------------- |
| C 或 c | 用于格式化货币，这个标识会以当地的货币符号为前缀           |
| D 或 d | 用于格式化十进制数，还可以指定最小的填充个数             |
| E 或 e | 用于指数计数法，字母的大小写决定了数字后的 E 的大小写       |
| F 或 f | 用于顶点小数的格式化，也可以指定最小的填充个数            |
| G 或 g | 代表 general。这个字符能用来将一个数格式化为定点或者指数格式 |
| N 或 n | 用于基本的数值格式化（带逗号）                    |
| X 或 x | 用于十六进制，字母的大小写决定了十六进制字母的大小写         |

其中，给定的占位符由冒号分隔，如上面的 `{0:c}`

能指定填充个数的，在格式化字符后添加个数。例如：`{0:d9}`

## 4. 类型转换

与 C 系 语言一样，C# 对于数据类型，会使用**隐式向上转换**，或者称为**宽化**。

使用 `()` 对类型进行**强制转换**(cast)，也叫做**窄化**。

```csharp
short s1 = 30000;
short s2 = 30000;

s1 + s2;			// 转换为 int
(short)(s1 + s2);	// 强制转换为 short，丢失数据。
```


<!-- more -->

### 4.1 checked 和 unchecked

当我们不希望数据丢失时，可以使用 `checked`，这个关键字在数据出现溢出时会抛出异常。

```csharp
checked((short)(s1 + s2));	// OverflowException
```

同样也可以使用 `checked` 块。

```csharp
checked {
  byte sum = (byte)Add(b1, b2);
  Console.WriteLine("sum = {0}", sum);
}
```

当然，如果运算过多，我们可以直接开启 `checked` 编译选项，此时对**所有运算**都会进行 `checkede` 操作。

当然，这个时候，我们也会有一些不想被 check 的运算，那么就可以使用 `unchecked` 关键字来避免 checked。

用法类似 `checked`，就不举例了。

## 5. 隐式类型 var

C# 中，可以利用 `var` 关键字来让编译器对变量的类型进行**自动推断**。

这个特性有点类似 C++ 11 的 `auto`

```csharp
var myInt = 0;
```

需要注意的是，`var` 仍然是**强类型**的，只不过类型并不在编辑时确定，但是也是在编译期间就确定类型，而且不能改变。这和 JS 中的 `var` 有很大不同。

### 真正用途

虽然有这么好用的特性，但是 C# 并不鼓励滥用，**如果需要 int，那么就声明 int。**

这个特性通常**只在** LINQ 查询中使用，由于某些情况下无法得知数据库查询结果的真正类型，所以此时使用 `var` 是合理的。

```csharp
var subset = from i in numbers where i < 10 select i;
```
