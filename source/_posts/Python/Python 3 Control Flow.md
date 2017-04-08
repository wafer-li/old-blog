---
title: Python 3 Control Flow
date: 2017-04-08
categories: Python
tags: Python
---

## 0. 概述

控制流程包括 `if` `for` 和 `while`

Python 的流程控制语句有些特殊

1. 首先，关于流程控制**不使用括号**，只有函数和表达式才使用小括号
2. 使用冒号指示语句块的开头

<!-- more -->## 1. if 语句

下面是一个 `if` 语句的例子

```python
#!/usr/bin/python
# Filename: if.py

number = 23
guess = int(input('Enter an integer : '))

if guess == number:
    print('Congratualtions, you guessed it!')
    print('But you do not win any prizes!')
elif guess < number:
    print('No, it is a little higher than that')
else:
    print('No, it is a little lower than that')
print('Done')
```

> 几个注意要点：
1. Python 中为了减少缩进，使用 `elif` 来代替 `if...else if...else`
2. 注意缩进，同样的缩进等级表示了同一个代码块
3. **Python 中没有 `switch` 语句，使用相应的 `if..eles` 结构来替代**
4. **注意不要漏掉冒号**

## 2. while 语句

while 语句与其他语言无太大差别，讲几个注意事项
1. **注意不要漏掉 `while` 语句末尾的冒号**
2. `Ture` 和 `False` 代表布尔类型
3. `while` 可以有 `else` 语句，但一般不使用

## 3. for 语句

`for` 语句和其他语言有较大区别，以下是 Python 和 Java 语言的对比

```python
# Python
for i in range(0, 4):
    print(i)
```

下面是等价的 Java

```java
// Java
for(int i = 0; i < 4; i++) {
    System.out.println(i);
}
```

实际上 Python 的 `for` 语句更像 Java 中的 `foreach` 语句，下面是两种等价的语法形式

```python
# Python
for word in wordList:
    print(word)
```

下面是 Java 语法表述

```java
// Java
for(word : wordList) {
    System.out.println(word);
}
```

需要注意的几个要点：

1. `range()` 函数的指示区间为**左闭右开**

2. `print()` 函数会**默认打印换行符**

    > 通过指示 `end` 来进行单行打印
    `print(word, end='')`
    如果缓冲区中有字符，那么指定 `flush` 为 `True` 来清除缓冲区
    `print(word, end='', flush=True)`

## 4. 其他流程控制

`break` 和 `continue` 都和其他语言无异
