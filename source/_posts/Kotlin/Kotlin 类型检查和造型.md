---
title: Kotlin 类型检查和造型
date: 2017-04-08
categories: Kotlin
tags: Kotlin
---

## 1. 类型检查

使用 `is` 和 `!is` 来检查一个变量的类型

```kotlin
if (obj is String) {
  print(obj.length)
}

if (obj !is String) { // same as !(obj is String)
  print("Not a String")
}
else {
  print(obj.length)
}
```

<!-- more -->## 2. 智能造型(Smart Cast)

智能造型指的是，当一个对象满足一个 `is` 表达式时，它就会被自动转换成这个类型。

```kotlin
fun demo(x: Any) {
  if (x is String) {
    print(x.length) // x is automatically cast to String
  }
}
```

同样的，它也支持**否定**检查

```kotlin
if (x !is String) return
print(x.length) // x is automatically cast to String
```

也支持 `&&` 和 `||` 表达式

```kotlin
  // x is automatically cast to string on the right-hand side of `||`
  if (x !is String || x.length == 0) return

  // x is automatically cast to string on the right-hand side of `&&`
  if (x is String && x.length > 0)
      print(x.length) // x is automatically cast to String
```

同样，在 `when` 和 `while` 语句中也支持这个特性

```kotlin
when (x) {
  is Int -> print(x + 1)
  is String -> print(x.length + 1)
  is IntArray -> print(x.sum())
}
```

但是，智能造型在编译器**无法保证**在检查和使用的过程中类型不会发生变化时，不能使用。

具体来说，智能造型在以下场景中有效：

- `val` 局部变量：**总是有效**
- `val` 属性
    - 这个属性是 `private` 或者 `internal`；
    - 对于它的检查代码与它的声明在同一个模块中时
    - 注意，智能造型不适用于具有自定义 getter 或者开放的变量(`public`)
- `var` 局部变量
    - 这个变量没有在检查和使用代码间进行改动
    - 这个变量没有被修改它的 lambda 表达式捕获
- `var` 属性：**总是无效**

## 3. 不安全的造型

通常来说，当一个造型操作会丢出异常时，说明这个造型操作是不安全的。

对于这种造型操作，Kotlin 使用 `as` 关键字。

```kotlin
val x: String = y as String
```

注意，`null` 不能强制转换成 `String`，如果 `y` 是 `null`，那么上述代码将会抛出异常。

我们可以使用一个 `nullable` 对象来进行造型

```kotlin
val x: String? = y as String?
```

<!-- more -->## 4. 安全的造型

为了避免在造型中抛出异常，我们可以使用一个安全的造型操作符 `as?`。

它会在造型失败时返回 `null`

```kotlin
val x: String? = y as? String
```

注意，虽然 `as?` 右边是一个非空类型，但是造型返回的结果也可以为空。
