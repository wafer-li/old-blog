---
title: Java 多线程工具
date: 2017-04-08
categories: Java
tags: Java
---

## 1. 并发工具

对于很多的多线程问题，我们不需要再去实现一遍底层的锁和同步机制了。
对于一般的应用向问题，应**优先采用并发工具**

> Executor 和 Task 优先于线程(`Runnable`)
并发工具优先于 `wait()` 和 `notify()`
—— *Effective Java Second Edition*

<!-- more -->### 1.1 阻塞队列

对于许多线程问题，可以通过使用一个或者多个队列来将其形式化。可以通过 `Producesor` 将任务加入队列，然后由 `Comsumor` 来将任务取出然后进行处理的方式来实现。

Java 的阻塞队列自带了阻塞特性，**不再需要显式的同步**

#### 1.1.1 API

这里只介绍阻塞队列的阻塞方法，实际上阻塞队列也包含一些非阻塞的方法

方法    |   正常动作    |   特殊情况下的动作
:----:  |   :------:    |   :--------:
put     |   添加一个元素    |   如果队列满，则阻塞
take    |   移出并返回头元素|   如果队列空，则阻塞
offer   |   添加一个元素，并返回 true| 如果队列满，则返回 false
poll    |   移出并返回队列的头元素| 如果队列空，则返回 null
peek    |   返回队列的头元素（**不移出**）| 如果队列空，则返回 null

> 注意：

> 1. offer 、peek、poll **在特殊情况下并不阻塞**，但是它们有对应的**超时版本**
2. 由于 peak poll 带有 **返回 `null`** 的属性，所以**不能往这样的队列插入 `null` 值**
3. 这个队列还具有 `add()` 和 `remove` 方法，但是它们在特殊情况下会**抛出异常**，所以在多线程程序中不要使用这样的方法。

Java 准备了多种实现形式的阻塞队列，包括链表、双端链表、数组等实现，甚至包括优先队列。

同时，Java 1.7 还提供了 `TransferQueue` 接口，这个接口允许生产者线程等待，直到消费者线程准备就绪。

##<!-- more -->## 1.1.2 例子

下面是一个使用阻塞队列来管理多线程关系的例子：
即，**生产者线程将元素加入到队列中，消费者线程将元素取出进行处理**

```java
public class BlockingQueueExample {
    public static void main(String[] args) throws Exception {
        BlockingQueue bq = new ArrayBlockingQueue(1000);
        Producer producer = new Producer(bq);
        Consumer consumer = new Consumer(bq);

        new Thread(producer).start();
        new Thread(consumer).start();

        Thread.sleep(4000);
    }
}


/**
* Producer generate the sum.
* And add it into the queue
*/
public class Producer implements Runnable {
    private BlockingQueue bq = null;

    public Producer(BlockingQueue queue) {
        this.setBlockingQueue(queue);
    }

    // The blocking queue has a internal synchronize
    // The delay of each end of the addition will show this
    public void run() {
        Random rand = new Random();
        int res = 0;
        try {
            res = Addition(rand.nextInt(100), rand.nextInt(50));
            System.out.println("Produced: " + res);
            bq.put(res);
            Thread.sleep(1000);

            res = Addition(rand.nextInt(100), rand.nextInt(50));
            System.out.println("Produced: " + res);
            bq.put(res);
            Thread.sleep(1000);

            res = Addition(rand.nextInt(100), rand.nextInt(50));
            System.out.println("Produced: " + res);
            bq.put(res);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }

    public void setBlockingQueue(BlockingQueue bq) {
        this.bq = bq;
    }

    public int Addition(int x, int y) {
        int result = 0;
        result = x + y;
        return result;
    }
}

/**
* Comsumer take the result from the queue.
* And print it out to the output
*/
public class Consumer implements Runnable {
    protected BlockingQueue queue = null;

    public Consumer(BlockingQueue queue) {
        this.queue = queue;
    }

    public void run() {
        try {
            System.out.println("Consumed: " + queue.take());
            System.out.println("Consumed: " + queue.take());
            System.out.println("Consumed: " + queue.take());
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }
}
```

The output:

```
Produced: 93
Consumed: 93
Produced: 69
Consumed: 69
Produced: 76
Consumed: 76
```

### 1.2 线程安全的集合

在 `java.util.concurrent` 包提供了许多线程安全的集合。
主要用于**多线程并发修改一个数据结构**的并发问题。
包括 哈希表、有序集和队列等

一般来说，线程安全的集合要比一般的集合**更高效**

在较早的 Java 版本，曾有“同步包装器”使得一般的集合类型变为同步的，但是现在已经不推荐使用了，**最好使用 `java.util.concurrent` 包中的集合**


## 2. `Callable` 和  `Future`

### 2.1 `Callable`

`Callable` 是一个**带返回值**的 `Runnable`，具有泛型特性。
例如 `Callable<Integer>` 表示一个最终返回 `Interger` 的异步计算

### 2.2 `Future`

`Future` 保存异步任务的结果，可以将其启动然后交给一个线程。
所有者在任务执行完毕后，可以通过 `get()` 方法获得结果。

`Future` 具有以下方法

```java
public interface Future<V> {
    V get() throws ...;
    V get(long timeout, TimeUnit unit) throws ...;
    void cancel(boolean mayInterrupt);
    boolean isCancelled();
    boolean isDone();
}
```

第一个 `get()` 调用直到计算完成前会被**阻塞**；
如果任务完成前第二个 `get()` 超时，则抛出 `TimeoutException`
如果线程被中断，则都抛出 `InterruptedException`
如果任务已经完成，那么 `get()` 立即返回

可以使用 `cancel()` 方法来**中断**任务，
如果任务没有开始，则它将被取消而不会再运行，
如果任务已经在运行，那么则由 `mayInterrupt` 参数来决定是否**中断**任务
如果任务**已经被取消**或者**已经完成**，那么返回 `false`，其他情况返回 `true`
> 注意，**此方法一旦返回，则 `isDone()` 永远返回 `true`**

### 2.3 `FutureTask`

Java 实现了 `FutureTask` 包装器，它是一个类，同时实现了 `Runnable` 和 `Future` 接口
它接受一个 `Callable` 接口作为构建器参数，主要用于将 `Callable` 转换为 `Runnalbe` 和 `Future`

可以如下使用

```java
Callable<Integer> myComputation = ...;
FutureTask<Integer> task = new FutureTask<Integer>(myComputation);
Thread t = new Thread(task)     // It's a Runnale
t.start();
...
Integer result = task.get();    // It's a Future
```

## 3. 执行器(Executor)

如果你需要做一些重复性较高的异步任务，或者创建大量的生命期很短的线程，那么就应该用线程池来管理。
实际上，为了提高效率，执行任何的并发任务，都应该优先考虑 Execulator 和 Task

> Execulator 和 Task 优先于线程(Thread)
—— *Effective Java Second Edition*

在这里，并发的最小单位升级为 `Executor` 和 `Task`。
所谓的 `Task` 就是用户构建的 `Runnable` 或者 `Callable` 对象；
这也是为什么要优先采用 `Runnable` 的原因

### 3.1 基本使用

基本的使用步骤如下：

1. 使用 `Executors` 的静态方法构建线程池，或者叫 `ExecutorService`
2. 调用 `execute()` 或 `submit()` 提交 `Runnable` 或 `Callable` 对象
3. 当不在提交任务时，调用 `shutdown()`

> 注意，还有一个 `execute()` 方法执行 `submit()` 的效果。
它们的主要区别在于，
`execute()` 会触发**未捕获处理器**，从而向 `System.err` 输出错误信息;
`submit()` 会抛出 `ExecutionException`，可以使用 `getCause()` 获取出错信息

> 另外， `submit()` 返回的是 `Future` 对象，可以通过它取消特定任务。
由此，如果使用 `Callable` 那么使用 `submit()`；
如果使用 `Runnable` 那么使用 `execute()`

例子：

```java
ExecutorService executorService = Executors.newFixedThreadPool(10);

executorService.execute(new Runnable() {
    public void run() {
        System.out.println("Asynchronous task");
    }
});

executorService.shutdown();
```

### 3.2 `ScheduledExecutorService` 预定执行

该类是 `ExecutorService` 的子类，用于构建**预订性**和**重复性、周期性** 的任务

可以指定任务只运行一次，也可以指定任务的运行周期

### 3.3 控制任务组

使用 `ExecutorService` 的另一个重要原因就是可以实现控制一组相关任务。
特别是在采用**分治策略**的算法中常常能用到。

例如，使用对一个大整数进行因式分解，那么我们可以将整个过程分成很多很小的过程，当小任务全部解决完毕时，整数的因式分解也就完毕了。

或者，我们可以用它来提交很多对于同一个问题的不同解决方案，如果有任何一个解决方案得出答案，那整个任务就可以停止了。

对于以上两种情况，使用 `ExecutorService` 分别有两种方法进行对应：

1. `invokeAll()`，这个方法**提交所有的 `Callable` 到一个集合中**，并返回一个 `Future` 对象，代表**所有任务解决结果**
2. `invokeAny()`，这个方法**提交所有的 `Callable` 到一个集合中**，并返回一个 `Future` 对象，代表**某一个任务的解决结果**

例子：

```java
// invokeAll -- Return a List of Future
List<Callable<T>> task = ...;
List<Future<T>> results = executor.invokeAll(task);

// invokeAny -- Return only one Future
Future<T> resultOfInvokeAny = executor.invokeAny(task);
```

可以使用 `ExecutorCompletionService` 来对 `invokeAll()` 得到的结果集进行排列处理

```java
// executor is a ExecutorService
ExecutorCompletionService service = new ExecutroCompletionService(executor);

for (Callable<T> task : tasks) {
    service.submit(task);
}

for (int i = 0; i < tasks.size(); i++) {
    processFurther(service.take().get());
}
```

### 3.4 Fork-Join 框架

对于多线程处理的**分治策略**的任务， Java 实现了一种 Fork-Join 框架来更好的实现这种任务流程。

分治的很常见的实现方式是**递归实现**，这个框架也使用了**递归**的思路

使用步骤：

1. 提供一个扩展了 `RecursiveTask<T>` 或者 `RecursiveAction` 的类
2. Override `compute()` 方法，在其中调用子任务并将其合并

例子：

```java
class Counter extends RecursiveTask<Integer> {
    ...
    @Override
    protected Integer computer() {
        if (to - from < THRESHOLD) {
            // solve problem directly
        }
        else {
            int mid = from + (to - from) / 2;
            // Recursive solve left
            Counter first = new Counter(values, form, mid, filter);
            // Recursive solve right
            Counter second = new Counter(values, mid, to, filter);
            invokeAll(first, second);   // Add both to executor
            return first.join() + second.join(); // bind the solution
        }
    }
}
```

<!-- more -->## 4. 同步器(Synchronizer)

同步器是并发工具的一种，一些使线程能够等待另一个线程的对象，允许它们协调动作。

<table>
<th colspan="3" style="text-align:center;">同步器</th>

<tr style="text-align:center;">
<td style="text-align:center;">类</td>
<td style="text-align:center;">作用</td>
<td style="text-align:center;">何时使用</td>
</tr>

<tr style="text-align:center;">
<td style="text-align:center;">CyclicBarrier  (不常用)</td>
<td style="text-align:center;">允许线程集等待直到其中预定数目的线程到达一个公共障栅(barrier)，然后可以选择执行一个处理 barrier 的动作</td>
<td style="text-align:center;">当大量的线程需要在它们的结果可用之前完成时</td>
</tr>

<tr style="text-align:center;">
<td style="text-align:center;">CountDownLatch (常用)</td>
<td style="text-align:center;">允许线程集等待直到计数器为 0</td>
<td style="text-align:center;">当线程需要等待事件发生（才允许执行时）</td>
</tr>

<tr style="text-align:center;">
<td style="text-align:center;">Exchanger（不常用）</td>
<td style="text-align:center;">允许两个线程在要交换的对象准备好时交换对象</td>
<td style="text-align:center;">当两个线程工作在同一个数据结构的<b>两个实例</b>上时</td>
</tr>

<tr style="text-align:center;">
<td style="text-align:center;">Semaphore（常用）</td>
<td style="text-align:center;">允许线程集等待知道它被允许继续执行为止</td>
<td style="text-align:center;">限制访问资源的线程总数</td>
</tr>

<tr style="text-align:center;">
<td style="text-align:center;">SynchronousQueue</td>
<td style="text-align:center;">允许一个线程将对象交给另一个线程</td>
<td style="text-align:center;">在没有显式同步的情况下，当两个线程准备好将一个对象传递到另一个时</td>
</tr>
</table>

> 注意 `CountDownLatch`，这个类用于**让某些线程等待其他线程**。
它是唯一一个带有 `int` 构造参数的同步器，用于**指定等待的并发线程的个数**

> 形象来说，就是一个红绿灯，直到倒计时完毕，线程才可以运行
下面是一个简单的多线程计时的例子

```java
/**
* A simple timing concurrent execution.
* The timer will not start until all the worker thread are ready.
* And when the last worker thread done, the timer stop
*/
public static long time(Executor executor, int concurrency, final Runnalbe action) throws InterruptedException {
    final CountDownLatch ready = new CounDownLatch(concurrency);
    final CountDownLatch start = new CounDownLatch(1);
    final CountDownLatch done = new CounDownLatch(concurrency);

    for (int i = 0; i < concurrency; i++) {
        executor.execute(new Runnable() {
            // This is the worker thread
            public void run() {
                ready.countDown(); // Tell the timer worker is ready
                try {
                    start.await(); // Worker stuck at start point

                    // Because of blocking,
                    // this statement will not run
                    // until the start count down reach 0
                    action.run();
                } catch (InterruptedException) {
                    Thread.currentThread().interrupt();
                } finally {
                    done.countDown();   // Tell the timer worker is done
                }
            }
        });
    }

    // This is the timer thread
    ready.await();  // Wait for all the workers are done
    long startNanos = System.nanoTime();
    start.countDown();  // Let worker thread off!!
    done.await();   // Wait for worker done.
    return System.nanoTime() - startNanos;
}
```

> 在**线程**中调用锁存器的 `await()` 方法**可以阻塞当前线程**
当锁存器的计数器为 0 时，**所有的被该锁存器阻塞的线程即刻执行**

> 锁存器是共享的，在任何线程中都可被更改
一旦归 0，障碍即刻被放弃
