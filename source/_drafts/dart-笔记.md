---
title: "dart 笔记"
author: "Wafer Li"
date: "2019-07-03 10:34"
---

Java + JavaScript

## 1. 基础

1. 任何东西都是变量(无拆箱装箱)
2. 类型可推断，且可以设定为动态类型(`dynamic`)
3. 支持 top-level function and variable
4. 没有 `public`, `protected` 和 `private`，用下划线表示“私有”
    > 其实也不是真的「私有」，下面细说
5. 声明式常量 `final`，编译期常量 `const`


### 1.1 变量声明

基本方式： **Java** 式

可以进行类型推断: `var a = 1;`
可以设定动态类型：`dynamic a = 1; a = true;`

`var` 不声明则默认为 `dynamic`

### 1.2 `final` 和 `const`

`final` 指定声明型常量，意思是 **变量只能被赋值一次**

`const` 指定编译期常量，意思是：

1. 可以被立即推算出
2. 对象本身不可变
3. 是规范化的，多次使用不改变本身

```dart
/// 举几个例子

const a = 1;
const b = [1,2,3];  // 不可变列表
var c = const [1, 2, 3];  // c 可变，但是列表不可变
const d = pi * 5;
```


### 1.3 相等性测试

1. equal: `==`
2. identical : `identical()`

### 1.4 Type Test and Type Cast

1. `as`: Type cast
2. `is`: 是某个对象
3. `!is`：不是某个对象
4. 支持智能 cast

### 1.5 条件表达式

```dart
expr1 ?? expr2
```

如果 `expr1` 是 `null`，返回 `expr2`，否则返回 `expr1`


### 1.6 级联操作符(`..`)

类似 Kotlin 的 `with()` 函数

```dart
querySelector('#confirm') // Get an object.
  ..text = 'Confirm' // Use its members.
  ..classes.add('important')
  ..onClick.listen((e) => window.alert('Confirmed!'));
```

### 1.7 Spread Operator(`...`)

类似 Scala 的拼接操作，用来拼接 Collection：

```dart
var a = [1, 2, 3];
var b = [0, ...a];  // [0,1,2,3]
```

同时还有一个 Null-Aware 类型的操作符 `...?`，如果拼接的变量是 `null`，就不进行拼接：

```dart
var a = null;
var b = [0, ...?a];  // [0]
```


### 1.8 可见性

Dart 不存在 `public`, `private`, `protected` 这种可见性修饰符，只存在 public 和 library-level private

如果变量名称以下划线开头，那么该变量就是 `library-level private`

所谓 `library-level private` 类似于 Java 默认的 `package-private`；

默认情况下，每个 `dart` 文件都是一个 library

## 2. 基本类型

### 2.1 数字

数字都是 `num`，它有两个子类：

1. `int`： **64** 位有符号整数
2. `double`： 64 位双精度浮点

## 3. 闭包

闭包在 JS 系的语言都很常用，但是一直搞不懂它的意思，借此来进行一个总结：

闭包是一个函数对象(是函数)；
且闭包能够访问其内部作用域变量；
即使它离开了它之前所在的作用域。

重点：

所谓离开了定义它的环境，比如说闭包是在某个函数内部定义的，使用高阶函数将闭包传递到了其母体之外，当程序运行到外部时调用闭包，此时闭包依旧能访问它内部的作用域， **包括通过参数传入的其母体的内部作用域**

## 4. 函数

如果没有返回值，则返回 `null`

## 5. 类

大体上和 Java 类似，说一下与 Java 不同的点

### 5.1 构造器

Dart 构造器特别的是它的 **子类不继承超类的构造器**，如果子类没有声明自定义的构造器，那么它就只有默认的无参构造器

### 5.2 命名构造器

其实类似于 Java 的静态工厂：

```dart
class Point {
  num x, y;

  Point.origin() {
    x = 0;
    y = 0;
  }
}

Point.origin();
```

### 5.3 初始化列表

类似于 C++：

```dart
Point.fromJson(Map<String, num> json) :
x = json['x'],
y = json['y'] {
  print('In Point.fromJson(): ($x, $y)');
}
```

### 5.4 调用超类构造器

```dart
Person.fromJson(Map data) : super.fromJson(data) {
  print('in Person');
}
```

### 5.4 构建方式的调用顺序

1. 初始化列表
2. 超类构造器
3. 子类构造器


### 5.5 factory

可以使用 factory 进行对象的构建

```dart
factory Logger(String name) {
    if (_cache.containsKey(name)) {
      return _cache[name];
    } else {
      final logger = Logger._internal(name);
      _cache[name] = logger;
      return logger;
    }
  }
```

`factory` 与命名构造器的不同在于，`factory` 不能访问 `this`；
从这一点来看，`factory` 可能更接近 Java 的静态工厂。

### 5.6 getter 和 setter

```Dart
class Rectangle {
  num left, top, width, height;

  Rectangle(this.left, this.top, this.width, this.height);

  // Define two calculated properties: right and bottom.
  num get right => left + width;
  set right(num value) => left = value - width;
  num get bottom => top + height;
  set bottom(num value) => top = value - height;
}
```

### 5.7 接口

Dart 没有 `interface` 关键字，但是定义类的同时也隐式定义了一个同名的接口

该接口包含类中所有的域和方法

```dart
class Person {
  // In the interface, but visible only in this library.
  final _name;

  // Not in the interface, since this is a constructor.
  Person(this._name);

  // In the interface.
  String greet(String who) => 'Hello, $who. I am $_name.';
}

// An implementation of the Person interface.
class Impostor implements Person {
  get _name => '';

  String greet(String who) => 'Hi $who. Do you know who I am?';
}
```

## 6. 混入(mixin)

实现类似多重继承的效果，即可以引入其他类的代码

使用：

```dart
class Dove extends Bird with Walker, Flyer {}

// 注意 Walker 和 Flyer 都是实际的类
// Dove 可以调用它们的代码
```

与接口的区别：

1. 混入是决定 **干什么**，而接口决定 **是什么**
2. 混入可以调用 **真实代码**，接口只是 **方法签名** 而没有实现

混入是 **有顺序的！**，下面代码的继承关系如图：

```dart
class AB extends P with A, B {}

class BA extends P with B, A {}
```

![mixin-order](../images/dart-笔记/mixin-order.png)

继承链越末端的类，它的方法权重就越高：
在 `AB` 中，`B` 中方法的权重比 `A` 要高

同时，如果对 `AB` 进行类型检测，那么以下代码都返回 true:

```dart
AB ab = AB();
ab is P;
ab is A;
ab is B;
```

`BA` 同理


## 7 covariant 关键字

Dart 拥有一个 covariant，用于指定某个类型是协变的，通常用于 override 方法的时候

如果你的类型符合协变，那么 `covariant` 会让编译器跳过这个类型的静态分析，然后在运行时再进行类型检测。

```dart
class Animal {
  void chase(Animal x) { ... }
}

class Mouse extends Animal { ... }

class Cat extends Animal {
  void chase(covariant Mouse x) { ... }
}
```

上面的代码如果不加 `covariant`，就会报类型错误

但是如果加了，在调用的时候就要十分注意，一定要传一个对应的类型进去，因为静态分析功能被关掉了，下面的代码可以通过变异，但是在运行时会报错崩溃：

```dart
var cat = Cat();
var mouse = Mouse();
var Animal = Animal();

cat.chase(animal);  // 运行时错误
```

## 8. 泛型

Dart 作为动态语言，它的泛型是 **具体化的(Reifined)**，意思就是 Dart 的泛型类型在其运行时也会得到保留；

而 Java 泛型是类型擦除的，它在运行时不会存在泛型的类型。

```dart
var names = List<String>();
names.addAll(['Seth', 'Kathy', 'Lars']);
print(names is List<String>); // true
```

```java
List<String> list = new ArrayList<>();
list instanceof List<String>;
  错误:
  instanceof 的泛型类型不合法
  list instanceof List<String>;
                  ^----------^
```

### 8.1 协变和逆变

Dart 采用 `extends` 表示类型协变，如同 `T extends String`

但是并没有 `T super String`

## 9. Lazy Loading Library

对于一个 Library，可以进行懒加载

首先，要使用 `deferred as` 对 Library 进行引入：

```dart
import 'package:greetings/hello.dart' deferred as hello;
```

然后调用 `loadLibrary()` 进行 Library 的加载：

```dart
Future greet() async {
  await hello.loadLibrary();
  hello.printGreeting();
}
```

同一个 `loadLibrary()` 可以调用很多次，但是只有第一次是有效的


## 10. 异步

Dart 异步有很多种方式，具体可以看[这篇文章](https://juejin.im/post/5c4875f86fb9a049ff4e78cf)

下面来总结一些常用的

### 10.1 async/await

这个在 JS 和 Kotlin 协程中也有出现，底层实现的具体原理不同，但是表现上是基本相同的，看一张图：

![async/await 的调用关系](../images/dart-笔记/async-await-的调用关系.png)

上面的代码，绿色的是一块，红色的是一块

> 绿框里面的代码会在foo函数被调用的时候同步执行，在遇到await的时候，会马上返回一个Future，剩下的红框里面的代码以then的方式链入这个Future被异步调度执行。

也就是说绿框的代码是在当前线程[^1]执行，而后的红色代码则会到后台线程异步执行

需要注意的几个地方：

1. await只能在async函数中出现
2. async函数中可以出现多个await,每遇见一个就返回一个Future, 实际结果类似于用then串起来的回调
3. async函数也可以没有await, 在函数体同步执行完毕以后返回一个Future

同时，async/await 可以通过 `try/catch` 进行处理：

```dart
foo() async {
  try {
    print('foo E');
    var value = await bar();
    print('foo X $value');
  } catch (e) {
    // 同步执行代码中的异常和异步执行代码的异常都会被捕获
  } finally {

  }
}
```

也可以采用 `await for` 处理多个请求：

```dart
Future main() async {
  // ...
  await for (var request in requestServer) {
    handleRequest(request);
  }
  // ...
}
```

## 11. 生成器

Dart 还支持生成序列，类似 Kotln 的 `Sequence`；
同时，还支持同步序列和异步序列

主要来说就是使用 `sync*/async*` 和 `yeild` 来生成

生成同步序列：

```dart
Iterable<int> naturalsTo(int n) sync* {
  int k = 0;
  while (k < n) yield k++;
}
```

生成异步序列：

```dart
Stream<int> asynchronousNaturalsTo(int n) async* {
  int k = 0;
  while (k < n) yield k++;
}
```

如果你采用递归方式生成序列的话，可以采用 `yeild*` 来增加性能：

```dart
Iterable<int> naturalsDownFrom(int n) sync* {
  if (n > 0) {
    yield n;
    yield* naturalsDownFrom(n - 1);
  }
}
```

## 12. 可调用的类

通过重载 `call()` 方法，可以让一个类像函数一样被调用：

```dart
class WannabeFunction {
  call(String a, String b, String c) => '$a $b $c!';
}

main() {
  var wf = new WannabeFunction();
  var out = wf("Hi","there,","gang");
  print('$out');
}
```


[^1]: Dart 没有线程的概念，是采用和 JS 类似的事件调度机制，和 JS 区别的地方是包含了微任务队列和事件队列
