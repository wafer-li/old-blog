---
title: Python 3 Module
date: 2017-04-08
categories: Python
tags: Python
---

## 0. 概述

模块有点类似 C++ 中的 Namespace，但并不完全相同

<!-- more -->## 1. 导入模块

通过使用 `import` 语句来导入一个模块进行使用

```python
#!/usr/bin/python
# Filename: using_sys.py

import sys

print ('The conmmand line arguments are:')
for i in sys.argv:
    print(i)

print('\n\nThe PYTHONPATH is', sys.path, '\n')
```

> 在上面的例子中，通过使用 `import sys` 就可以通过 `sys.function` 的形式来调用 sys 模块中的函数和变量。

> 用户自定义模块在第一次导入时，会编译成**字节码**文件，这是 Python 处理的，可以提高模块导入的效率。
这些文件以 `.pyc` 为扩展名，如果 Python 没有当前目录的访问权限，那么就不会创建 `.pyc` 文件

> 第三方模块可以通过 Python 自带的 `pip` 进行安装

另外，还可以通过使用 `from...import...` 语句来导入语句；
它和 `import` 语句的唯一区别就是在模块导入之后，不用再在调用的时候填写模块名称。

```python
# Import statement
import sys
print(sys.path)

# From...import... statement
from sys import argv
print(argv)

# If you want to import all the identifiers,
# use this statement.
form sys import *
```

> 注意，`from...import *` 语句**不会导入以双下划线开头的标识符**，如 `__version__`

> 一般来说，**不建议使用 `from...import...` 语句**

## 2. 创建模块

创建模块最简单的方法就是**编写 .py 文件**；
一个 `.py` 文件就是一个 Python 模块。
例如：

```python
#!/usr/bin/python
# Filename: mymodule.py

__version__ = '0.1'

def sayHi():
    print('Hi')
```

Module Demo:

```python
#!/usr/bin/python
# Filename: mymodule_demo.py

import mymodule

mymodule.sayHi()
print('Version', mymodule.__version__)
```

## 3. 模块的默认变量

每个模块都有几个默认变量，它们是由 Python 自动构建的；
如 `__name__` 变量，这是**模块的名字**（即 `.py` 文件的名字）

可以使用 `__name__` 变量来检测其自身是否是作为主程序运行

```python
#!/usr/bin/python
# Filename: using_name.py

if __name__ == '__main__':
    print('This program is being run by itself')
else:
    print('I am being imported from another module')
```

> `'__main__'` 是主模块的名字，也就是**主程序的文件名**

## 4. `dir()` 函数

`dir()` 函数是内建函数，可以通过它来列出模块定义的标识符，包括**函数、类和变量**
如果不提供参数，则返回**当前模块**中定义的名称列表

```python
>>> a = [1, 2, 3, 4, 5]
>>> import fibo
>>> fib = fibo.fib
>>> dir()
['__builtins__', '__name__', 'a', 'fib', 'fibo', 'sys']
```

> 由此可以看出，主模块具有 `__buitins__` 对象，实际上这就是 Python 的内建函数和类
`dir()` 函数一般不会将内建函数列出，如果需要查看，可以通过 `dir(builtins)` 查看

## 5. 包(Package)

包是模块的文件夹，其中包含了很多模块；
同时一个包也可以包含**另一个包**。

**一个包必须包含 `__init__.py` 文件，以免 Python 将包识别为普通目录**

可以使用点号来访问到包中的模块

例如：

```python
sound/                          Top-level package
      __init__.py               Initialize the sound package
      formats/                  Subpackage for file format conversions
              __init__.py
              wavread.py
              wavwrite.py
              aiffread.py
              aiffwrite.py
              auread.py
              auwrite.py
              ...
      effects/                  Subpackage for sound effects
              __init__.py
              echo.py
              surround.py
              reverse.py
              ...
      filters/                  Subpackage for filters
              __init__.py
              equalizer.py
              vocoder.py
              karaoke.py
              ...
```

> 关于 `__init__.py`:

> 1. 一个包必须包含这个文件
> 2. 这个文件可以是空的，也可以做一些包的初始化工作，比如定义 `__all__` 变量

### 5.1 导入包

包的导入有如下几种形式：

1. 使用 `import` 语句

    > 例如 `import sound.effects.echo`, 将 `sound/effects/echo` 模块导入；
    使用方法为 `sound.effects.echo.echofilter(input, output, delay = 0.7, atten = 4`

2. 使用 `from package import item`

    > 在包(Package)层面，**Python 推荐这么导入**，主要的优点在于能够减少没有必要的前缀修饰。
    例如： `from sound.effects import echo` 将 `echo` 模块导入
    使用方法为：`echo.echofilter(input, output, delay = 0.7, atten = 4)`

3. 补充：关于 `from package import *` 和 `__all__` 变量

    > `__all__` 变量通常在 `__init__.py` 文件中定义，用于指定**允许 `import *` 识别的标识符**，即允许导出的标识符；
    如果没有指定这个变量，那么在使用 `import *` 时便会自动**忽略以下划线开头的标识符**

4. 内包导入

    > 对于**包中的模块**，在可能需要到另一个兄弟包模块的时候，由于它们处在同一个目录结构中，所以可以简单地省略一些前缀。
    Python 在导入包时，首先会搜寻**当前目录**，如果搜索不到，则再到系统 PATH 中进行搜索
    例如 `srround` 想要利用 `echo` 模块，则直接简单地 `import echo` 即可。

    > 在 Python 2.5 之后，可以使用**相对路径**进行包导入，例如：

    ```python
    # 一个点代表当前目录
    # 两个点代表父目录
    from . import echo
    from .. import formats
    from ..filters import equalizer
    ```

> 目前，Python 推荐使用 `from package import item` 的包层面导入，和 `import module` 的模块层面导入方法，能更好地避免冗余和变量名称冲突。
