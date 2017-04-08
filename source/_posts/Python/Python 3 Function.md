---
title: Python 3 Function
date: 2017-04-08
categories: Python
tags: Python
---

## 1. 函数的定义

函数通过 `def` 关键字来定义。
`def` 后跟一个函数名称，**然后跟一对圆括号**，表示函数。
**注意不要漏掉括号**

```python
#!/usr/bin/python
# Filename: function1.py

def sayHello():
    print('Hello, World!')

sayHello() # 调用函数
```

<!-- more -->## 2. 函数参数

在函数定义的圆括号中可以指定形参。
**注意，不需要声明形参类型**

```python
def printMax(a, b):
    if a > b:
        print(a, 'is maximum')
    elif a == b:
        print(a, 'is equal to', b)
    else:
        print(b, 'is maximum')
```

> 注意，Python 的方法是 **Pass by reference**

其中 a, b 是形参

> 这里由于形参类型不确定，一般的 IDE 无法进行提示。所以可以使用冒号指明其类型

```python
def printMax(a:int, b:int):
```

## 3. 变量作用域

1. 函数内声明的变量称作**局部变量**
2. 可以使用 `global` 语句来调用和**修改函数外部声明的变量**

    > 但是，**不建议使用** `global` 语句。
    应通过其他方式实现。

3. 非局部变量

    > 在嵌套定义函数的情况下会遇到。
    通过 `nonlocal` 来调用外部函数定义的变量

    ```python
    def funcOuter():
        x = 2
        print('x is ', x)

        def funcInner():
            nonlocal x
            x = 5
    ```

    > 有毒性，最好不要这么搞

## 4. 默认参数

通过在**函数定义**的时候对**形参进行指定**，可以指定默认参数

```python
def say(message, times = 1):
    print(message * times)
```

**只有形参表末尾的形参才能有默认参数**

```python
def func(a, b = 5) # Correct
def func(a = 5, b) # Wrong
```

## 5. 关键参数

在**函数调用**的时候对**形参进行指定**，可以**忽略形参顺序**指定实参

```python
def func(a, b = 5, c = 10):
    print('a is ', a, 'and b is ', b, 'and c is ', c)

func(3, 7)
func(25, c = 24)
func(c = 50, a = 100)
```

## 6. 不定参数

通过在**函数定义**的时候使用**星号**标识形参

```python
#!/usr/bin/python
# Filename: total.py

def total(initial = 5, *numbers, **keywords):
    count = initial
    for number in numbers:
        count += number
    for key in keywords:
        count += keywords[key]
    return count

print(total(10, 1, 2, 3, vegetables = 50, fruits = 100))
```

> 带一个星号的参数范围内的参数会被收集为一个**列表**
如上面的函数会将 `1, 2, 3` 收集为一个叫做 `numbers` 的列表。

> 带两个星号的参数范围内的参数会被收集为一个**字典**
如上面的函数会将 `vegetables = 50, fruits = 100` 收集为一个叫做 `keywords` 的字典。

## 7. Keyword-only 参数

在**带星参数**之后的**普通参数**会成为 Keyword-only 参数，即**只能通过关键参数形式来传递实参**

假如不需要不定参数而又想使用 Keyword-only 参数，那么可以使用**没有名字的空星**，如下所示

```python
>>> def foo(a,b,*,c,d):
...     print(a,b,c,d)
...
>>> foo(1,2,3,4)
Traceback (most recent call last):
File "<stdin>", line 1, in <module>
TypeError: foo() takes exactly 2 positional arguments (4 given)
```

## 8. return 语句

Python 的函数**默认为没有返回值**
一个没有返回值的函数的 `return` 语句等价于 `return None`

<!-- more -->## 9. DocStrings

这一特性很类似 Java 的 javadoc。与 Java 不同的是，Python 的 DocStrings 在**函数的第一个逻辑行处定义**

特点如下：

1. 一个**多行字符串**
2. 以大写字母开头，句号结尾
3. **第二行是空行**

> Python 的每个函数都拥有 `__doc__` 属性，可以通过调用这个属性来显示 DocStrings
在 DocStrings 中可以使用 reStructureText 的格式来实现 Javadoc 中的 `@parma` `@retrun` 功能

```python
def foo(a, b):
    '''This is the foo function

    It is just a foo function
    :parma a: This is the parma a
    :type a: int
    :parma b: This is the parma b
    :type b: int
    '''

    pass
```

也可以使用 Google 的规范

```python
def module_level_function(param1, param2=None, *args, **kwargs):
    """This is an example of a module level function.

    Function parameters should be documented in the ``Args`` section. The name
    of each parameter is required. The type and description of each parameter
    is optional, but should be included if not obvious.

    Parameter types -- if given -- should be specified according to
    `PEP 484`_, though `PEP 484`_ conformance isn't required or enforced.

    If \*args or \*\*kwargs are accepted,
    they should be listed as ``*args`` and ``**kwargs``.

    The format for a parameter is::

        name (type): description
            The description may span multiple lines. Following
            lines should be indented. The "(type)" is optional.

            Multiple paragraphs are supported in parameter
            descriptions.

    Args:
        param1 (int): The first parameter.
        param2 (Optional[str]): The second parameter. Defaults to None.
            Second line of description should be indented.
        *args: Variable length argument list.
        **kwargs: Arbitrary keyword arguments.

    Returns:
        bool: True if successful, False otherwise.

        The return type is optional and may be specified at the beginning of
        the ``Returns`` section followed by a colon.

        The ``Returns`` section may span multiple lines and paragraphs.
        Following lines should be indented to match the first line.

        The ``Returns`` section supports any reStructuredText formatting,
        including literal blocks::

            {
                'param1': param1,
                'param2': param2
            }

    Raises:
        AttributeError: The ``Raises`` section is a list of all exceptions
            that are relevant to the interface.
        ValueError: If `param2` is equal to `param1`.


    .. _PEP 484:
       https://www.python.org/dev/peps/pep-0484/

    """
    if param1 == param2:
        raise ValueError('param1 may not be equal to param2')
    return True
```

## 10. 注解(Annotations)

<!-- more -->### 10.1 参数注解

Python 的参数注解定义在**形参声明的位置，与形参以括号间隔，置于参数默认值之前**

```python
def foo(a: "This is param a", b: "This is param b" = 5):
```

### 10.2 返回值注解

Python 的返回值注解定义在**函数头末尾的冒号之前，使用 `->` 和函数头分隔**

```python3
def haul(item: Haulable, *vargs: PackAnimal) -> Distance:
```

> 注意，注解可以是字符串，也可以是类型。
可以通过注解实现类型检查

### 10.3 Lambda 表达式

Lambda 表达式不支持注解
