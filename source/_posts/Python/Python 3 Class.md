---
title: Python 3 Class
date: 2017-04-08
categories: Python
tags: Python
---

## 0. 概述

Python 是高度面向对象的语言，事实上，任何的变量类型都是**类**

<!-- more -->## 1. 创建类

类由 `class` 关键词定义，后面加冒号表示类的作用域

```python
class Person:
    pass
```

## 2. self 参数

Python 的 `self` 参数类似于 Java 的 `this`，但是这个参数在 Python 中的作用则更为重要，具体可以看下面的内容

## 3. 类域

Python 类的域与 Java 不同

1. 不带 `self` 参数修饰的普通变量为**静态变量**
2. 只有带 `self` 修饰的才是对象变量

    > 例如 `self.name` 是对象变量，`name` 是静态变量

3. **成员都是公有的，包括数据成员**

    > 但是以双下划线 `__` 开头的成员会被 Python 的名称管理体系作为**私有变量**，这是 Python 的名称管理体系做出的，而不是类的特性

## 4. 类方法

Python 的类方法和 Java 稍有不同

1. 类的普通方法必须定义 `self` 参数
2. 类块中不带 `self` 参数的方法一般为**静态方法**，需要用 `staticmethod()` 修饰

    ```python
    class Robot:
        '''Represent a robot, with a name'''

        def sayHi(self):
            print("hehe")

        def howMany():
            print('We have {0:d} robot'.format(Robot.population) )
        howMany = staticmethod(howMany)
    ```

    > 静态方法也可以用以下语句修饰

    ```python
    @staticmethod
    def howMany():
        print('We have {0:d} robot'.format(Robot.population))
    ```

## 5. 构造函数和析构函数

Python 拥有构造函数和析构函数。工作原理和 C++ 的构造函数和析构函数相同。

```python
class Person:
    def __init__(self, name):
        self.name = name

    def sayHi(self):
        print('Hello, my name is', self.name)

    def __del__(self):
        print("I am dying.")
```

## 6. 继承

Python 的继承通过在类名称后面添加括号实现。
括号中为父类的名字

```python
class SchoolMember:
    def __init__(self,name,age):
        self.name = name
        self.age = age
        print('(Initialize SchoolMember:{0})'.format(self.name))
    def tell(self):
        '''Tell my details.'''
        print('Name:"{0}" Age:"{1}"'.format(self.name,self.age),end ='')

class Teacher(SchoolMember):
    '''Repressent a teacher.'''
    def __init__(self,name,age,salary):
        SchoolMember.__init__(self,name,age)
        self.salary = salary
        print('(Initialized Teacher:{0})'.format(self.name))

    def tell(self):
        SchoolMember.tell(self)
        print('Salary:"{0:d}"'.format(self.salary))

class Student(SchoolMember):
    '''Represents a student'''
    def __init__(self,name,age,marks):
        SchoolMember.__init__(self,name,age)
        self.marks = marks
        print('(Initialized Student:{0})'.format(self.name))

    def tell(self):
        SchoolMember.tell(self)
        print('Marks:"{0:d}"'.format(self.marks))

t = Teacher('Mrs.Shrividya',30,30000)
s = Student('Swaroop',25,75)
print() # print a blank line

members = [t,s]
for member in members:
    member.tell() # work for both Teacher and Students
```

> 上面的例子中，`Student` 和 `Teacher` 都继承自 `SchoolMenber`
通过 `SchoolMenber` 调用父类方法
