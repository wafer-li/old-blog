---
title: Python 3 Basic
date: 2017-04-08
categories: Python
tags: Python
---

## 1. 注释

1. 注释以 `#` 开头
2. 以 `#!` 开头的称为**组织行**，表明了执行脚本的**解释器**

> Linux/Unix 中，如果不清楚 Python 的位置，可以使用 `#!/usr/bin/env python`，`env` 会自动寻找 Python 的解释器路径进行执行。

<!-- more -->## 2. 字面意义的常量

如同 5, 1.23, 9.25e-3 这样的**数**，以及 "This is a string" 等**字符串**被称作字面意义上的**常量**

### 2.1 数

数的类型有三种——整数、浮点数和复数

1. `2` 是整数
2. `3.23` 和 `52.3E-4` 是浮点数
3. `(-5+4j)` 和 `(2.3-4.6j)` 是复数

> Python 3 只有一种整数类型，不区分 `long` 和 `int`
Python 2 中区分 `long` 类型
布尔型(`bool`) 属于整型(`integer`)的一种

<!-- more -->### 2.2 字符串

1. 字符串是字符的**序列**，其编码默认为 **Unicode**。

    > 可以使用 `str.encode("ascii")` 将字符串编码转换为 ASCII

2. 可以用**单引号**和**双引号**来指定字符串，**单引号和双引号的意义完全相同**

3. 利用**三引号** `"""` 或者 `'''` 可以指定一个**多行字符串**

    ```python
    '''This is a multi-line-string. This is the first line.
    And this is the second line.
    "What's your name?" I asked.
    He said "Bond, James Bond."
    '''
    ```

    > 在三引号中，可以自由使用单引号和双引号

4. 使用**转义**来表示原有字符

    > 例如 `'What's your name?'` 中，由于（**使用单引号界定的**）字符串中有单引号，会使 Python 解释出现错误，此时需要用转义来表示原有的单引号。
    正确的应该是 `'What\'s your name?'`。
    但是，**可以在用双引号界定的字符串中使用单引号。**
    这个也是正确的 `"What's your name?"`

    > 另外，在一行的末尾的反斜杠 `\` 仅仅表示下一行的字符串是上一行的**继续**，**并不增加新的行**

    ```python
    # 以下字符串是等价的
    "This is the first line.\
    This is also the first line."

    "This is the firstline. This is also the first line."
    ```

5. 原始字符串

    > 当需要指定一些字符不被特殊处理时，可以使用 `r` 或者 `R` 附加在字符串前面指定**原始字符串**。
    例如： `r"Newlines are indicated by \n"`
    此时，**字符串中的所有字符都不会被转义**

    > **在正则表达式使用的时候，请尽量使用原始字符串**

6. 字符串是**不可变**的
7. 字符串按字面意义连接

    > 如果将两个字符串按字面意义相邻放着，会被自动转为一个字符串

8. `format()` 方法

    > 可以使用 `format()` 方法来通过使用其他信息构建字符串

    ```python
    #!/usr/bin/python
    age = 25
    name = 'Swaroop'
    print('{0} is {1} years old'.format(name, age))

    # 输出为
    # Swaroop is 25 years old.
    ```

    > 也可以使用 `format()` 进行格式化输出

    ```python
    >>> '{0:.3}'.format(1/3)
    '0.333'
    ```

## 3. 变量

<!-- more -->### 3.1 命名

同其他语言的变量命名无多大差别。

1. 不允许数字开头
2. 大小写敏感

### 3.2 类型

Python 变量**不需要声明类型**，但仍然是**强类型**
实际上，Python 的任何一切都称为**对象**

## 4. 逻辑行和物理行

Python 中**一个逻辑行对应一个物理行**，虽然 Python 也可以使用分号，但是**一般不使用分号**

> 其他语言一般强制要求行尾分号，Python 不推荐分号的使用。

## 5. 缩进

Python 有着严格的缩进区分，不能随意缩进，**缩进用来标明语句块**
**同一个语句块具有相同的缩进层次**

> Python 使用缩进来表示代码块，**不再使用花括号**

## 6. 操作符

1. Python 中的 `//` 符号表示**向下取整相除**，而不是单行注释。注释使用 `#` 来开头。

    > 注意这里是**向下取整**，而不是**趋零取整**

2. 布尔操作
    - `not` 表示布尔非（相当于 `!`）
    - `and` 表示布尔与（相当于 `&&`）
    - `or` 表示布尔或（相当于 `||`）

    > 有趣的是，不等于仍然使用 `!=` 来表示

3. 相等性判别

    > Python 3 中有两种相等性判别，一种是变量相等性(equality)，另一种是实例相等性(identity)

    > `is` 用作判断实例相等性
    否定操作为 `is not`

    > 而 `==` 用于判断变量相等性

    区别：

    ```python
    a = [1, 2, 3]
    b = [1, 2, 3]
    a == b # True
    a is b # False
    ```

3. 优先级

    > 在 Python 中，`lambda` 表达式处在最高优先级，而并非布尔运算
