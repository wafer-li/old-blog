---
title: Java 多线程同步
date: 2017-04-08
categories: Java
tags: Java
---

## 0. 概述

由于每句代码只能在一个线程中执行，当多个线程试图访问同一个对象域时，就会出现**竞争**，导致对象的数据最终出现错误。
特别是当线程中的操作**不是原子操作**的时候，当线程切换的时候。

为了消除竞争的危害，对于多个线程**有可能**同时操作同一个对象的情况，我们就要实现**线程同步**

实现线程同步的方法主要有三种：

1. 使用 `Lock/Condition` 即显式的锁
2. 使用 `synchronized` 关键字
3. 使用并发库和阻塞类来实现线程管理

> **Executor 和 Task 优先于线程**
**并发工具优先于 `wait()` 和 `notify()`**
—— *Effective Java Second Edition*

注意，线程同步不仅要求**互斥性**，也要求**可见性**，即只有一个线程能对同步代码块进行操作，同时，**该代码块对所有线程应是可见的**

<!-- more -->## 1. 使用 ReentrantLock 实现同步

### 1.1 锁的初级使用

`ReentrantLock` 是一个锁对象，在有可能出现竞争的方法中使用锁，就可以**保护**一段代码块**同一时间只能由一个线程进行读写操作**

例如：

```java
public class Bank {
    private ReentrantLock myLock;
    public void transfer() {
        myLock.lock();
        // ----------- 临界区
        try {
            // some works
        }
        finally {
            myLock.unlock();
        }
        // ---------- 临界区
    }
}
```

在临界区之间的代码是受锁对象保护的，当其他线程试图执行临界区代码（试图获取锁）时，就会导致线程阻塞，直到当前执行的线程解开锁为止。

注意要将解锁代码放置在 `finally` 中，否则可能会由于异常的抛出而无法解锁。
此时，不能使用**带资源的try块**。
因为要在 `finally` 中释放锁，而释放锁的方法不是 `close()`

锁是**可重入**的，锁对象自身维护一个**持有计数**，如果在临界区中调用了另一个被锁保护的方法，那么，计数器增加，解锁后，计数器减少，直到持有计数为 0 时，线程才会释放锁。

当由于**异常而跳出临界区**时，应进行相应的清理操作，保证对象的完整性。
因为在 `finally` 中，锁会被释放。

### 1.2 公平锁

使用 `ReentrantLock(boolean fair)` 可以指定构造一个**公平锁**。
它倾向于让阻塞队列中等待时间最长的线程获取到锁，但是额外的检测成本可能会造成性能损失。

<!-- more -->### 1.3 条件对象

条件对象 `Condition` 用于确保临界区中的代码符合执行条件。

#### 1.3.1 使用条件对象的原因

1. 不能使用一般的 `if` 语句进行检查

    > 因为 `if` 是非原子性的，线程可能在通过检查之后被剥夺，再次进入时却又不满足执行条件。

    ```java
    // DON'T DO THAT!!
    if (bank.getBalance(form) >= amount) {
        // transfer() was protected by Lock object.
        bank.transfer(from, to, amount)
    }
    ```

2. 不能在临界区内检查条件

    > 有可能在条件不满足的情况下，需要其他线程的协助才能满足条件。
    例如，当前线程操作的账户对象不满足转出余额，那么就需要**等待另一线程向当前账户注资**。
    此时，由于当前线程**占有锁**，其他线程无法操作这一账户。

#### 1.3.2 使用条件对象

1. 通过锁对象的 `newCondition()` 来获得一个条件对象。
2. 当条件不满足时， 调用**条件对象的** `await()` 方法

    > 该方法会使当前线程阻塞，加入条件对象等待队列，并**放弃锁**

3. 当**条件有可能满足时**，调用**条件对象的** `singalAll()` 方法

    > 这一方法会激活**所有的**等待该条件对象的线程，并尝试重新获取锁，从被阻塞的地方**继续执行**
    此时，线程应**再次测试条件**，因为此时无法确保条件是否被满足。

    > 之所以不能确保，是因为线程在 `await()` 之后，**不具备将自己唤醒的能力**，必须由另一线程执行 `singalAll()` 方法。
    如果没有一个线程能够调用 `singnal`，那么此时系统就**死锁**了。
    所以就应在**对象的状态有利于等待线程的改变时**调用 `singalAll()` 方法。

    > 另外，也有一个 `singal()` 方法，这个方法会随机选择一个等待线程进行唤醒。

综上，以下是使用条件对象的基本框架：

```java
class Bank {
    private Condition sufficientFunds;
    private ReentrantLock bankLock;
    ....
    public Bank() {
        ...
        // Using the Lock object to
        // get the condition object reference
        sufficientFunds = bankLock.newCondition();
    }

    ...

    public void transfer(int from, int to, int amount) {
        // Lock the code
        bankLock.lock();
        try {
            while(accounts[from] < amount) {
                // Don't have sufficient funds, await
                sufficientFunds.await();
            }
            // Have sufficient funds
            // Transfer funds..
            ...
            // Transfer complete, singnal all
            sufficientFund.singnalAll();
        }
        finally {
            // Unlock the code
            bankLock.unlock();
        }
    }
}
```

## 2. `synchronized` 关键字

### 2.1 内部锁

这里比 8.5.1 更 “高级” 和傻瓜性了；
其实从 jdk 1.0 开始，任何 Java 对象都拥有一个**内部锁**；
我们不需要再显式实现一个锁和条件对象的架构了。

如果一个方法用 `synchronized` 声明，那么对象的锁将保护整个方法;

也就是说：

```java
// Both of these method is equivalent

public synchronized void method() {
    // method body
}

public void method() {
    this.intrinsicLock.lock();
    try {
        // method body
    }
    finally {
        this.intrinsicLock.unlock();
    }
}
```

### 2.2 唯一的条件对象

对象的内部锁拥有唯一一个条件对象；
通过 `wait()` 方法将线程添加到条件的等待队列；
通过 `notifyAll()` `notify()` 方法解除等待线程的阻塞

也就是说：

```java
wait(); == intrinsicCondition.await();
notify()All == intrinsicCondition.singnalAll();
```

### 2.3 例子

使用 `synchronized` 重写的 `Bank` 类

```java
class Bank {
    private double[] accounts;

    public synchronized void transfer(int form, int to, int amount) throws InterruptedException {
        while (accounts[from] < amount) {
            // Do not have suffient funds
            // Using wait() method instead of await()
            wait();
        }
        // Do have suffient funds
        // Transfering..
        accounts[from] -= amount;
        accounts[to] += amount;

        // Transfer done
        // Using notifyAll() method instead of singnalAll()
        notifyAll();
    }

    public synchronized double getTotalBalance() {...}
}
```

### 2.4 局限性

可以看到，使用 `synchronized` 关键字大大减少了代码量，使代码更为整洁；
但是对应的，也存在一些缺点：

1. 不能中断一个正在试图获得锁的进程

    > 因为锁在对象内部，开发者无法操作，2 同

2. 试图获得锁时，不能设定超时
3. 每个锁仅有单一的条件，可能是不够的

<!-- more -->### 2.5 总结

那么，究竟是使用 `synchronized` 关键字还是 `Lock/Condition` 机制呢？

1. **最好两者都不使用**，使用 Java 自带或一些第三方的并发工具来处理同步问题。

    > *Effective Java* 中提到 “并发工具优先” 的概念，即，成套的并发库和并发工具，要优先于使用 `wait()`, `notify()` 方法

2. 如果不想采用并发库，并且 `synchronized` 的缺点并没有对程序造成影响，那么**尽量使用它**

    > 这样可以减少编写的代码，减少出错的几率

3. 如果特别需要 `Lock/Condition` 的独有特性时，那么才使用 `Lock/Condition`

    > 比如说即时中断，特定的等待超时等。

## 3. 同步阻塞

同步阻塞允许客户使用

```java
synchronized(lock) {
    // method body
}
```
获取到内部的锁

这也叫做**客户端锁定**，这个方法是很脆弱的，通常不推荐使用

## 4. 监视器

监视器是 *Per Brinch Hansen* 提出的面向对象的线程安全实现方式。

使用 Java 语言来表述就是：

1. 监视器是只包含**私有域**的类
2. 每个监视器类的对象有一个相关的锁
3. 使用该锁对所有的方法进行加锁
4. 该锁可以有任意多个相关条件

**Java 的 `synchronized` 关键字使用一种不严谨的方法实现了监视器**

> 但是这也导致了 *Per Brinch Hansen* 本人的批评

## 5. Volatile 域

`volatile` 可以被看做是一种 **程度较轻的 `synchronized`**;
它只具有 `synchronized` 提供的**可见性**，而不具备**原子性**
同时， `volatile` 变量**不会造成阻塞**

这说明了，当我们需要同步的写入操作时，`volatile` 就不适用了；
但是如果该变量仅用于读取，那么 `volatile` 能提供优于 `synchronized` 的性能。


### 5.1 正确使用 `volatile` 变量的条件

1. 对该变量的写操作**不依赖于**当前值

    > 比如说，用 `volatile` 变量做计数器是不行的，因为计数器的增加要先读取当前值

2. 该变量没有包含在具有其他变量的不变式中

大多数的编程情形都会和这两个条件的其中之一冲突，使得 `volatile` 不能如 `synchronized` 一样普遍实现线程安全

### 5.2 性能考虑

一般情况下， `volatile` 的性能要比使用 `synchronized` 要高；
所以在符合使用 `volatile` 的情形下应该尽量使用。

### 5.3 正确使用的情形

1. 状态标志

    > 这是 `volatile` 的最常使用情形，作为一个布尔状态标志，用于指示发生了一个重要的一次性事件，或监视线程状态（是否被终止）

    ```java
    volatile boolean shutdownRequested;

    ...

    public void shutdown() { shutdownRequested = true; }

    public void doWork() {
        while (!shutdownRequested) {
            // do stuff
        }
    }
    ```

    > 此时，很可能需要从外部（另一线程）调用 `shutdown()` 方法，那么就需要保证 `shutdownRequested` 的可见性。
    此时，显然使用 `volatile` 关键字会更好

2. 一次性安全发布

    > 当缺乏同步可见性时，可能会出现一个线程获取到了一个**不完全构建的对象**，从而出现**更新值**和**旧值**同时存在。
    此时，可以将该对象的引用定义为 `volatile` 类型，然后在使用前通过检查该引用就可以知道对象是否安全发布了。

    ```java
    public class BackgroundFloobleLoader {
        public volatile Flooble theFlooble;

        public void initInBackground() {
            // do lots of stuff
            theFlooble = new Flooble();  // this is the only write to theFlooble
        }
    }

    public class SomeOtherClass {
        public void doWork() {
            while (true) {
                // do some stuff...
                // use the Flooble, but only if it is ready
                if (floobleLoader.theFlooble != null)
                    doSomething(floobleLoader.theFlooble);
            }
        }
    }
    ```

    > 注意使用的条件在于，**该对象一经发布就不可修改，或者是线程安全对象**
    如果需要对该对象进行异步更改，那么就需要 `synchronized` 等进行额外的同步操作。

3. 独立观察

    > `volatile` 变量可以定期的发布一些观察结果供程序内部使用，或者收集必要的统计信息

    ```java
    // Record the last login user's account
    public class UserManager {
        public volatile String lastUser;

        public boolean authenticate(String user, String password) {
            boolean valid = passwordIsValid(user, password);
            if (valid) {
                User u = new User();
                activeUsers.add(u);
                lastUser = user;
            }
            return valid;
        }
    }
    ```

    > 这个模式和上述的模式稍有不同，使用该值的代码需要清除该值可能会随时变化。

4. volatile bean 模式

    > 这是 Java Bean 模式的一种。
    它要求，所有的数据成员都是 `volatile` 的，同时， getter & setter 必须非常简单，不包含其他复杂代码
    该模式为一些易变数据提供了容器，但是要求**放入这些容器的对象必须是线程安全的**

    ```java
    @ThreadSafe
    public class Person {
        private volatile String firstName;
        private volatile String lastName;
        private volatile int age;

        public String getFirstName() { return firstName; }
        public String getLastName() { return lastName; }
        public int getAge() { return age; }

        public void setFirstName(String firstName) {
            this.firstName = firstName;
        }

        public void setLastName(String lastName) {
            this.lastName = lastName;
        }

        public void setAge(int age) {
            this.age = age;
       }
}
    ```

5. 高级应用——开销较低的读——写锁策略

    > 当对于一个变量的读操作远远超过写操作时，我们就可以使用 `volatile` 关键字修饰该变量，用于保证可见性，同时对 setter 方法采取 `synchronized` 修饰保证同步性，实现较低开销的读和写锁

    ```java
    @ThreadSafe
    public class CheesyCounter {
        // Employs the cheap read-write lock trick
        // All mutative operations MUST be done with the 'this' lock held
        @GuardedBy("this") private volatile int value;

        public int getValue() { return value; }

        public synchronized int increment() {
            return value++;
        }
    }
    ```

## 6. `final` 变量

如果一个域被声明为 `final`，那么对于该**变量**将不会出现线程安全问题。
其他线程将在 `final` 变量被赋值成功后才能见到此变量。

注意，只有**变量**是线程安全的，其指向的数组、对象等仍然需要同步操作。

<!-- more -->## 7. 死锁

Java 并不能在语言层次上避免或打破死锁的发生，这是程序设计的工作。

## 8. 线程局部变量

如果要避免线程间共享变量，那么可以使用 ThreadLocal 辅助类为各个线程提供各自的实例。

例如，如果要让每个线程都拥有自己的 `SimpleDateFormat` 变量，那么只需要

```java
public static final ThreadLocal<SimpleDateFormat> dateFormat =
    new ThreadLocal<SimpleDateFormat>() {
        protected SimpleDateFormat initalValue() {
            return new SimpleDateFormat("yyyy-MM-dd");
        }
    }
```

如果要访问具体线程的格式化方法，可以调用

```java
String dateStamp = dateFormat.get().format(new Date());
```

在一个**给定线程**中**首次调用** `get()` 方法时，会调用 `initialValue()` 方法。
在此之后， `get()` 会返回属于当前线程的那个实例

$\Delta$ 对于随机数生成器，如果需要线程独享的随机数生成器，那么可以使用

```java
int random = ThreadLocalRandom.current().nextInt(upperBound);
```

`current()` 会返回特定于当前线程的 `Random` 类实例。

另外还有个 `set()` 和 `remove()` 方法，分别用于为当前线程设置新值和删除当前线程的值。

## 9. 锁测试与超时

如果要使用这一特性，就要使用 `Lock/Condition` 架构。

由于尝试获取锁会导致阻塞，使用 `tryLock` 可以试图申请一个锁，成功则返回 `true`, 失败返回 `false`，同时，线程可以**立即离开**做其他事情

```java
if (myLock.tryLock()) {
    // now the thread owns the lock
    try {...}
    finally {
        myLock.unlock();
    }
}
else {
    // Do something else
}
```

同时，还可以设置**超时参数**

```java
if (myLock.tryLock(100, TimeUnit.MILLSECONDS));
```

注意， `tryLock()` 会**忽略**锁的公平性

`lock()` 方法不能被中断，如果一个线程在等待获取锁时被中断，**那么就有可能会造成死锁**

但是，如果采用 `tryLock()`，如果线程在等待期间被中断，将抛出 `InterruptedException` ，此时就可以用这个特性来跳出死锁问题。

同时，`await()` 方法也可以设定超时。

<!-- more -->## 10. 读/写锁

如果很多线程从一个数据结构读取数据而很少修改其中数据的话，那么我们使用另一种锁 `ReentrantReadWriteLock` 来提高性能

此时，允许读线程**共享访问**，写线程为**互斥访问**

> 这里有点像 `volatile` 的高级应用；
不同的点在于，`volatile` 用于一个变量，而 `ReentrantReadWriteLock` 用于一个**数据结构**

### 10.1 使用步骤

1. 构建 `ReentrantReadWriteLock` 对象

    ```java
    private ReentrantReadWriteLock rwl = new ReentrantReadWriteLock();
    ```

2. 抽取读锁和写锁

    ```java
    private Lock readLock = rwl.readLock();
    private Lock writeLock = rwl.writeLock();1
    ```

3. 对所有的 getter 加读锁

    ```java
    public double getTotalBalance() {
        readLock.lock();
        try {...}
        finally {
            readLock.unlock();
        }
    }
    ```

4. 对所有 setter 加写锁

    ```java
    public void transfer(...) {
        writeLock.lock();
        try {...}
        finally {
            writeLock.unlock();
        }
    }
    ```
