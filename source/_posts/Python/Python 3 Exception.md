---
title: Python 3 Exception
date: 2017-04-08
categories: Python
tags: Python
---

## 0. 概述

Python 的异常处理和 Java 相似，函数拼写错误等也会触发异常。

<!-- more -->## 1. 处理异常

通过 `try...except` 语句来处理异常

```python
try:
    text = input('Enter something --> ')

except EOFError:
    print('Why did you do an EOF on me?')
except KeyboardInterrupt:
    print('You cancelled the operation.')
else:
    print('You entered {0}'.format(text))
```

> `try` 还可以带一个 `else` 语句，作用与 `while` 的语句类似

## 2. 引发异常

通过 `raise` 语句来引发异常

```python
class ShortInputException(Exception):
'''A user-defined exception class'''
    def __init__(self, length,atleast):
        Exception.__init__(self)
        self.length = length
        self.atleast = atleast
try:
    text = input('Enter something-->')
    if len(text) < 3:
        raise ShortInputException(len(text),3)
    #other work can continue as usual here

except EOFError:
    print('Why did you do an EOF on me')

except ShortInputException as ex:
    print('ShortInputException The input was {0} long, excepted \
atleast {1}'.format(ex.length, ex.atleast))

else:
    print('No exception was raised.')
```

<!-- more -->## 3. Try...Finally 语句

这点与 Java 相似，Python 使用 `finally` 语句来对流进行一些收尾操作

```python
#!/usr/bin/python
# Filename: finally.py

import time

try:
    f = open('poem.txt')
    while True: # our usual file-reading idiom
        line = f.readline()
        if len(line) == 0:
            break
        print(line, end = '')
        time.sleep(2) # To make sure it runs for a while

except KeyboardInterrupt:
    print('!! You cancelled the reading from the file.')

finally:
    f.close()
    print('(Cleanig up: closed the file)')
```

## 4. with 语句

这个语句类似 Java 中的**带资源的 `try` 块**
通过使用 `with` 来打开一个带资源的操作，则其会自动在最后将资源关闭

```python
#!/usr/bin/python
# Filename: using_with.py
with open("poem.txt") as f:
    for line in f:
        print(line,end='')
```
