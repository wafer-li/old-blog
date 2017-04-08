---
title: Python 3 IO
date: 2017-04-08
categories: Python
tags: Python
---


## 1. 使用 `input()` 进行输入

Python3 使用 `input()` 函数获取用户输入。

`input()` 函数会返回一个字符串，随后可以使用 `int()` `float()` 等方法将字符串转为对应的类型或者格式

> 在 Python 3 中，`raw_input()` 被整合到 `input()` 函数中，Python 2 的 `input()` 函数的功能被抛弃了。

<!-- more -->## 2. 文件输入输出

与 C++ 和 Java 读取文件流的形式一样，Python 通过使用 `file` 类的函数来对文件进行读取写入

```python
poem = '''\ Programming is fun
When the work is done
if you wanna make your work also fun:
    use Python!
'''

f = open('poem.txt', 'w') # open for 'w'riting
f.write(poem) # write text to file
f.close() # close the file
f = open('poem.txt') # if no mode is specified, 'r'ead mode is assumed by default

while True:
    line = f.readline()
    if len(line) == 0: # Zero length indicates EOF
        break
    print(line, end='')

f.close() # close the file
```

> 使用 `open()` 打开文件，模式规则和 C++ 的相同
文件交互完毕后，使用 `close()` 来关闭文件流

## 3. pickle 模块

Python 提供了一个 `pickle` 的标准模块，用于将对象储存在文件中，称为对象的持久化保存

```python
#!/usr/bin/python
# Filename: pickling.py

import pickle

# the name of the file where we will store the object
shoplistfile = 'shoplist.data'
# the list of things to buy
shoplist = ['apple','mango','carrot']

# Write to the file
f = open(shoplistfile,'wb')
pickle.dump(shoplist, f) #dump the object to a file f.close()

del shoplist # detroy the shoplist variable

# Read back from the storage
f = open(shoplistfile,'rb')
storedlist = pickle.load(f) # load the object from the file
print(storedlist)
```

> 注意，持久化保存要求使用**二进制模式**
通过 `dump()` 和 `load()` 就可以对对象进行导入和导出
