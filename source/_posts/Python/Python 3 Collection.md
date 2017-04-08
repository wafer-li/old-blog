---
title: Python 3 Collection
date: 2017-04-08
categories: Python
tags: Python
---

## 1. 列表(list)

列表是用于处理**有序项目**的数据结构，与 Java 的**数组**类似，自带排序方法，可以使用 `[]` 进行**随机访问**

列表使用方括号定义，使用 `len()` 函数来获取列表长度

```python
#!/usr/bin/python

# This is my shopping list
shoplist = ['apple', 'mango', 'carrot', 'banana']

print(len(shoplist))

olditem = shoplist[0]
del shoplist[0]
```

> `del` 类似 C++ 中的 `delete`，用于释放一个对象。
这里使用 `del` 来将列表元素移除

<!-- more -->## 2. 元组(tupple)

元组和列表相似，唯一的区别是**元组不可改变**

元组使用**圆括号来定义**

```python
#!/usr/bin/python

# 圆括号是可选的，但是还是加上圆括号为好
zoo = ('python', 'elephant', 'penguin')
print('Number of annimal in the zoo is', len(zoo))

new_zoo = ('monkey', 'camel', zoo)
print('Last annimal in the zoo is', new_zoo[2][2])
```

> 注意到，元组是**可以嵌套的**，有点类似于 Java 中的**二维数组**，但**并不完全相同**。

> `new_zoo[0]` ==> `'monkey'`
`new_zoo[2]` ==> `zoo` ==> `('python', 'elephant', 'penguin')`
`new_zoo[2][2]` ==> `zoo[2]` ==> `'penguin'`

> 含有 0 个或者 1 个元素的元组
含有 0 个元素的元组用**空圆括号**表示，`empty = ()`
含有 1 个元素的元组**要在元素后面接一个逗号** `singleton = (2, )`

## 3. 字典(dict)

字典是一个**键值对**的表，类似于 Java 中的哈希表，一个项目具有 `Key` 和 `Value`

只能用**不可变**对象作为项目的**键**，值则可以是可变的也可以是不可变的。

字典使用**花括号**定义，用**冒号**分隔键和值，用**逗号**分隔项目，使用 `[]` 来取值。

```python
ab = {
        'Swaroop'   :   'swaroop@swaroopch.com'
        'Larry'     :   'larry@wall.org'
     }


print("Swaroop's address is", ab['Swaroop'])

for name, adderss in ab:
    # iterate the dict
```

> 在字典中，使用**键**来充当索引成分。
字典可以通过 `items()` 方法来返回键值对的列表，但是是无序的。
注意字典是没有顺序的（不能维持插入时的顺序），要使用时最好先排序。

## 4. 序列

列表，元组和字符串都是序列，序列具有以下特点：

1. 支持索引操作符 `[]` 随机访问

    > 索引从 0 开始，可以**支持负数**
    当索引是负数时，它会抓取倒数的项目

2. 可以采取**切片操作**

    > 即返回一个序列的子集，例如子数组等
    切片操作通过冒号完成，例如下面的 `shoplist[1:3]`。
    切片操作的区间是**左闭右开**，上面返回的是 `shoplist[1]` 和 `shoplist[2]` 组成的子列表
    假如前一个为空，切片从**序列头**开始，后一个为空，切片在**序列尾**停止。（后一个为空，最后结果**包括最后一个元素**，`shoplist[:]` 返回整个列表）

    > 也可以使用**负数**作切片，此时的负数只作为一个定位元素的**索引**，例如 `shoplist[:-1]` 会在**倒数第一个停止**，也就是**不包括最后一个元素的子列表**

    > 也可以给切片定义第三个参数——切片的**步长**。其实就是切片操作在遍历数组时的步长。
    步长通过两个冒号的最后一个参数定义
    `shoplist[::3]` ==> `shoplist[0], shoplist[3], shoplist[6]...`

```python
# Indexing or 'Subscription' operation
print('Item 0 is', shoplist[0])
print('Item 1 is', shoplist[1])
print('Item 2 is', shoplist[2])
print('Item 3 is', shoplist[3])
print('Item -1 is', shoplist[-1])
print('Item -2 is', shoplist[-2])
print('Character 0 is', name[0])

# Slicing on a list
print('Item 1 to 3 is', shoplist[1:3])
print('Item 2 to end is', shoplist[2:])
print('Item 1 to -1 is', shoplist[1:-1])
print('Item start to end is', shoplist[:])

# Slicing on a string
print('characters 1 to 3 is', name[1:3])
print('characters 2 to end is', name[2:])
print('characters 1 to -1 is', name[1:-1])
print('characters start to end is', name[:])
```

## 5. 集合

集合是无顺序的简单对象的聚集。

使用集合，可以**检查是否是成员**，**是否是另一个集合的子集**，**得到两个集合的交集**

```python
>>> bri = set(['brazil', 'russia', 'india'])
>>> 'india' in bri
True
>>> 'usa' in bri
False
>>> bric = bri.copy() >>> bric.add('china')
>>> bric.issuperset(bri)
True
>>> bri.remove('russia')
>>> bri & bric # OR bri.intersection(bric)
{'brazil', 'india'}
```

<!-- more -->## 6. 引用

这个概念和 Java 中的引用相同。

注意切片操作可以对一个序列进行**深拷贝(deep copy)**
