---
title: Kotlin 基本类型
date: 2017-04-08
categories: Kotlin
tags: Kotlin
---


**Kotlin 中，任何事物都是对象。**

## 1. 数字类型

Kotlin 中的数字类型有 `Double`、`Float`、`Long`、`Int`、`Short`、`Byte`

<!-- more -->### 1.1 位宽

|  Type  | BitWidth |
| :----: | :------: |
| Double |    64    |
| Float  |    32    |
|  Long  |    64    |
|  Int   |    32    |
| Short  |    16    |
|  Byte  |    8     |

> 注意，在 Kotlin 中，**字符不是一种数字类型**

### 1.2 字面常量

数字类型可以有多种字面表示形式。

1. 整数
- 十进制数字 `123`
    - `Long` 类型通过加 `L` 后缀实现: `123L`
- 十六进制 `0x0F`
- 二进制 `0b00001011`

2. 浮点数
    - 默认为 `Double` 类型: `123.5`, `123.5e10`
    - 使用 `f` 或者 `F` 后缀来表示 `Float`: `123.5f`

<!-- more -->### 1.3 表示法

Kotlin 中，任何数字都会被**自动装箱**

```kotlin
val a: Int = 10000
print(a === a) // true
val boxedA: Int? = a // 在类型后加 ? 表示一个 Nullable 对象
val anotherBoxedA: Int? = a
print(boxedA === anotherBoxedA) // false
print(boxedA == anotherBoxedA) // true
```

> 上面是一个很好的例子，由于所有的数字都会被自动装箱，所以 **`boxedA` 与 `anotherBoxedA` 不一致**。
> 但是由于两者均指向 `a`，所以保持了相等性。

> 这里的 `Int` 与 Java 的 `Integer` 相同

### 1.4 转换

Kotlin 的原则之一就是尽量让事务明显化。
所以，Kotlin **禁止隐式转换**，就算是隐式向上转换也是不允许的。

```kotlin
val a: Int? = 1
val b: Long? = a
print(a == b) // false
```

> 由于 `Int` 不是 `Long` 的子类，而且禁止隐式转换，所以即使 `b` 指向了 `a`，它们也不相等。

```kotlin
val b: Byte = 1 // OK
val i: Int = b // ERROR
```

> 字面值会经编译器静态检查赋值给整数形式的变量，但是由于禁止隐式转换，第二个语句会产生 ERROR。

需要转换时，应采用内置的转换方法

- `toByte()`
- `toShort()`
- `toInt()`
- `toLong()`
- `toFloat()`
- `toDouble()`
- `toChar()`

### 1.5 位运算符

Kotlin 支持全套 Java 的普通数字运算符。
但关于位运算符则稍有不同，Kotlin 采用**单词型**而非 Java 的**符号型**位运算符。

下面是 Kotlin 的位运算符列表

- `shl(bits)` => 位左移，相当于 Java 的 `<<`
- `shr(bits)` => 位右移，相当于 Java 的 `>>`
- `ushr(bits)` => 无符号数右移，相当于 Java 的 `>>>`
- `and(bits)` => 按位取与操作，相当于 Java 的 `&`
- `or(bits)` => 按位取或操作，相当于 Java 的 `|`
- `xor(bits)` => 按位取异或操作，相当于 Java 的 `^`
- `inv()` => 按位取反操作，相当于 Java 的 `~`


<!-- more -->## 2. 字符类型

字符类型使用 `Char` 来表示，**字符不是数字**。

```kotlin
fun check(c: Char) {
    if (c == 1) // ERROR
}
```

字符使用单引号括起来`'1'`，反斜杠 `\` 表示转义，转义字符和 Java 相同。

和数字类型一样，字符类型也被自动装箱，保持相等性，而不保持一致性。

## 3. 布尔类型

使用 `Boolean` 来表示布尔类型，布尔类型有两个值，`true` 和 `false`。

内置的逻辑布尔操作与 Java 相同。

## 4. 数组

使用 `Array` 表示数组，这是一个泛型类，类似于 Java 中的 `ArrayList<T>`，但并不完全相同。

数组是 **invariant** 的，也就是说不能把 `Array<String>` 的数组赋予 `Array<Any>` 的实例，这会产生一个**runtime failure**

> Kotlin 同样拥有 `List` 和 `ArrayList` 类型，在 JVM 上，`Array` 会被替换成 Java array。

> 所以，事实上 `Array` 只是


### 4.1 创建数组

使用 `arrayOf()` 创建数组。

```kotlin
val array = arrayOf(1, 2, 3)
val nullArray = arrayOfNulls(5) // Array with 5 null elements
```

> 注意变量具有自动推断功能，类似 C++ 中的 `auto`

也可以使用 `Array()` 创建数组。

```kotlin
// Crates an Array<String> with values
// ["0", "1", "4", "9", "16"]
val asc = Array(5, {i -> (i * i).toString()})
```

Kotlin 内置了一些特定的数组类型，如 `IntArray`, `ByteArray` 等。

```kotlin
val x: IntArray = intArrayOf(1, 2, 3)
```

### 4.2 访问数组

`Array` 内置了 `get()` 和 `set()` 方法和 `size` 属性。
但是也支持使用方括号进行访问的操作 `[]`

<!-- more -->### 4.3 多维数组

```kotlin
val int2d: Array<IntArray>
int2d = arrayOf(intArrayOf(1, 2, 3), intArrayOf(4, 5, 6), intArrayOf(7, 8, 9))
```


## 5. 字符串

使用 `String` 来表示字符串。与 Java 一样，字符串是一个不可变对象。

### 5.1 相对 Java 增加的新特性

与 Java 不同的是，Kotlin 支持使用方括号 `[]` 来获取字符串中的字符，同时也支持对字符串字符进行遍历。

```kotlin
for (c in str) {
    println(c)
}
```

### 5.2 raw string

此外，Kotlin 还吸收了 Python 的多行字符串特性，使用三个双引号来表示一个 **raw string**，raw string 不接受转义，其中任何的字符都是字面字符。

```kotlin
val rawString = """
    This is a raw string.
    \n and \t will be displayed as
    its literal stirng.
"""
```

### 5.3 字符串模板

Kotlin 字符串具有模板功能，使用 `$` 来指定参数
例如：

```kotlin
val i = 10
val s = "i = $i" // evaluates to "i = 10"
```

也可以使用花括号 `{}` 来获取**对象的属性**填充到字符串中。
例如：

```kotlin
val s = "abc"
val str = "$s.lenth is ${s.lenth}" //  evaluates to "abc.length is 3"
```

需要注意的是，字符串的模板功能不仅可以在普通字符串中使用，同时**也可以在 raw string 中使用。**

此时，如果需要表示 `$` 美元符号，必须使用以下表达式：

```kotlin
var price = """
${'$'}9.99
"""
```

> 这里使用双引号`${"$"}`也是可以的，模板引用一个字面量时，结果就是它本身。
