---
title: C# Method
date: 2017-04-08
categories: CSharp
tags: CSharp
---
## 1. 定义

C# 中的方法定义和 Java 没有区别。

```csharp
int Add(int x, int y)
{
    return x + y;
}
```


<!-- more -->

## 2. 默认按值传递

C# 默认的参数传递是 **按值传递** 的；
也就是说，方法中拿到的参数实际上是实参的一个 **副本**

## 3. 输出参数

C# 支持 **输出参数**， 这是 C/C++ 语言中常用的一种技巧；
即，通过对传入的指针进行赋值，然后在调用完毕后进行指针解引用，从而得到多个返回值。

C# 没有指针，所以使用了 `out` 关键字用作指明输出参数。

使用输出参数的方法定义如下：

```csharp
void Add(int x, int y, out int ans)
{
    ans = x + y;
}
```

调用时， **也需要** 使用 `out` 关键字。

```csharp
int ans;
Add(90, 90, out ans);
```

用作输出参数的变量可以不进行初始化，如同上面的 `ans` 一样；
但是， **必须** 在方法内部对输出参数进行赋值，否则会报错。

使用这个技巧，我们可以一次性返回多个值。

```csharp
void Hehe(out int a, out int b, out int c)
{
    // hehe
}
```

## 4. 按引用传递

C# 比 Java 高明的地方就在于，C# 可以 **按引用传递**，所以可以做到 Java 比较难做到的 **交换两个 int**；

只要使用 `ref`  关键字，指明需要按照引用传递的参数即可

```csharp
public static void swapStrings(ref string s1, ref string s2)
{
    string temp = s1;
    s1 = s2;
    s2 = temp;
}
```

此时，由于两个参数是按照 **引用** 传递的，所以上述代码是有效的。

## 5. 不定参数

同 Java 一样，C# 也支持不定参数。

只要使用 `params` 关键字指明不定参数即可。

```csharp
void addToList(params int[] args)
{
    // Add to list
}
```

与 Java 一样，不定参数只支持 **数组** 类型，而不支持其他集合类型。

需要注意的是，C# 只支持 **一个** `params` 参数， 而且必须是参数列表中 **最后一个** 参数。

## 6. 可选参数

C# 也支持可选参数（也叫做 **默认参数**），即给参数赋予默认值的行为。

```csharp
static void EnterLogData(string message, string owner = "Programmer")
{
    // hehe
}
```

只要在 **定义** 方法时，给形参进行 **“赋值”** 即可。

需要注意的是，可选参数的默认值必须在 **编译时确定**；
也就是说，不能将一些运行时才能确定的量作为默认值

```csharp
static void EnterLogData(string message, string owner = "Programmer", DateTime timeStamp = DateTime.Now) {
    // ERROR!
    // DateTime.Now determined at runtime!
}
```

## 7. 命名参数

C# 还支持 **命名参数**，即，通过形参名字来指定对应的实参，而不需要遵守参数顺序。

```csharp
DisplayFancyMessage(message: "Wow! Very Fancy indeed!",
                    textColor: ConsoleColor.DarkRed,
                    backgroundColor: ConsoleColor.White)
```

通过 **冒号** (`:`) 来分隔形参和实参。

通过命名参数，可以很好地结合可选参数来使用。

## 8. 方法重载

和其他现代语言一样，C# 也支持方法重载。

注意方法签名只由两部分决定：方法名字和方法参数（类型和数量）。
和 Java 的方法重载没什么区别。
