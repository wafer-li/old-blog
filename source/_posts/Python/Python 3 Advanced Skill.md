---
title: Python 3 Advanced Skill
date: 2017-04-08
categories: Python
tags: Python
---

## 1. 函数返回多个值

函数可以通过返回一个**元组**来达到返回多个值的目的。

```python
def get_error_details():
    return (2, 'second error details')

errnum, errstr = get_error_details()
```

> 上面运用到了**元组解包**技术，通过使用逗号分隔变量，就可以分别取出对应位置的元组元素。

<!-- more -->## 2. 特殊方法

Python 的类中有许多内置的特殊方法，例如 `__init__()` 和 `__del__()`

可以在 Python 的参考手册中找到它们以及对应的作用。

## 3. 单行语句块

如果一个语句块只有一个逻辑行，则可以把它置于条件语句或者循环语句的同一行

```python
if flag: print 'Yes'
```

## 4. Lambda 表达式

`lambda` 语句用来创建新的**函数对象**，并且在运行时返回它们。

```python
def make_repeater(n):
    return lambda s: s*n
```

> 本质上, `lambda` 需要一个参数,后面仅跟单个表达 式作为函数体,而表达式的值被这个新建的函数返回。注意,即便是 `print` 语句也不 能用在 `lambda` 形式中,只能使用表达式。

## 5. 列表综合

通过列表综合，可以从一个已有的列表导出一个新的列表。

```python
#!/usr/bin/python
# Filename: list_comprehension.py

listone = [2,3,4]
listtwo = [2*i for i in listone if i > 2]
```

> 通过在列表中使用这样的语句就可以对符合条件的每个列表元素进行处理
注意原有的列表并没有改变，这个操作实际上是**生成了一个新列表**

## 6. `exec` 和 `eval`

`exec` 语句用来执行**字符串形式**的 Python 语句

```
>>> exec('print("Hello, World")')
Hello, World
```

`eval` 语句用来执行**字符串形式**的 Python 表达式

```python
>>> eval('2*3')
6
```

> 两者看似相同，但是也有细微区别：

> 1. `eval` 只接受**单行字符串表达式**，`exec` 可以接受一个语句和语句块
    >> “表达式”所指的就是**可以放在等号右边的东西**，`break` `if` `pass` 等不是表达式

> 2. `eval` 会**返回表达式的结果**，`exec` 则会忽略该结果

## 7. `assert` 语句

同 Java 中的 `assert` 语句一样，以调试为目的。
但是 Python 的 `assert` 语句功能是默认启动的
当 `assert` 失败时，会引发一个 `AssertionError`

## 8. repr 函数

该函数用来取得对象的规范字符串表示，实际上它的作用就是**为对象包了一层`""`**

```python
>>> i = []
>>> i.append('item')
>>> i
['item']
>>> repr(i)
"['item']"
>>> eval(repr(i))
['item']
>>> eval(repr(i)) == i
True
```
