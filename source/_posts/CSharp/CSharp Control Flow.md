---
title: C# Control Flow
date: 2017-04-08
categories: CSharp
tags: CSharp
---

## 1. if/else

只接受布尔值


<!-- more -->

## 2. 逻辑运算符

`&&` `||` `!`

需要注意的是，`&&` 和 `||` 在有必要的时候都会“短路”，也就是说如果只检查一个表达式就能确定 if 的布尔值，那么就不会检查另一个了。

## 3. switch

switch 相比 Java 来说，可以支持 **字符串** 和 **枚举** 值。

> 不过并不支持类型检测，相比 Kotlin 来说差了一截。

## 4. for

```csharp
for(int i = 0; i < 4; i++) {
    // for body
}
```

## 5. foreach

遗憾的是，C# 将 foreach 语法用了一个单独的关键字 `foreach`

```csharp
foreach(string c in carTypes) {
    Console.WriteLine(c);
}
```

当然也可以使用隐含类型 `var`

```csharp
foreach(var i in linqSubset) {
    Console.Write("{0}", i);
}
```

## 6. while/do-while

和 Java 没什么不同；
需要注意一下 do while 最后要有个分号。

```csharp
while(condition) {
    // hehe
}
```

```csharp
do {
    // hehe
}while(condition);
```
