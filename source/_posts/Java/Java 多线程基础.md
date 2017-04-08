---
title: Java 多线程基础
date: 2017-04-08
categories: Java
tags: Java
---

## 1.  创建线程

### 1.1 通过 `Runnable` 接口创建

1. 实现 `Runnable` 接口

    ```java
    class Myrunnable implement Runnable {
	   run();
    }
    ```

<!-- more -->

2. 创建 `Runnable` 对象

    ```java
    Runnable r = new Myrunnable();
    ```

3. 由 Runnable 对象创建 Thread 对象

    ```java
    Thread t = new Thread(r);
    ```

4. 启动线程

    ```java
    t.start();
    ```

    > 不能直接调用 `run()` 方法，应调用 `Thread.start()` 方法来间接调用 run 方法

### 1.2 通过继承 `Thread` 类实现

1. 实现继承类

    ```java
    public class MyThread extends Thread {
        public void run() {
            // Do works
        }
    }
    ```

2. 构造类实例

    ```java
    public void static main(Sting [] args) {
        MyThread my = new MyThread();
        Thread t = new Thread(my);
    }
    ```

3. 通过 `start()` 方法开启线程

    ```java
    t.start();
    ```

## 2. 中断线程

Java 使用**中断**来执行**终止线程**的作用；
但是，当一个线程接收到终止信号时，它可以选择对于中断信号的响应方式，这就带来了很好的扩展性。
但同时也带来了一些疑惑的地方。

### 2.1 中断置位和检测

1. 使用 `Thread.currentThread()` 方法获取到当前运行的线程

    > 关于 `Thread.currentThread()` 方法：
    此方法的官方解释是：Return the current executing Thread reference.
    所谓的**当前线程**指的是：**运行当前代码段的线程**，由于**一段代码只能在一个线程中运行**，如果使用多个线程同时执行同一段代码时，那么这个方法获取到的就是**执行当前代码段的线程**，叫做当前线程。
    注意，这个方法如果**不在子线程中**（即 `run()` 方法中），那么获取到的**就一直是主线程（main）**
    需要特别注意的是，不同线程不允许访问同一个变量，否则会引起**竞争冒险**

2. 使用 `interrupt()` 将中断布尔值置为 `true`

    > Java 的中断线程实际上是将线程内置的一个 `boolean` 值置为 `true`，以此来表示该线程已被中断。
    当我们需要中断一个线程时，就调用该方法将线程内部的中断布尔值置为 `true`。
    线程会在适当时候轮询这个布尔值，同时响应中断操作。注意这个动作是 `Thread` 官方类库中自带的。

3. 使用 `isInterrupted()` 来查询当前线程的中断布尔值

    > 一个好的 `run()` 方法应该包含对中断的检测，如果检测到中断，那么就应该进行响应。
    一般来说，应该放弃当前正在进行的工作，进行清理后将线程终止。

    > 但是如果需要在 `run()` 中执行 `sleep()` 方法，那么就没有必要检测中断状态，因为 `sleep()` 方法在被中断时，会抛出 `InterruptedException`，那么只需捕获这个异常进行处理即可。

4. 关于 `interrupted()` 和 `isInterrupted()`

    > `isInterrupted()` 方法检测中断状态，但是不会影响中断状态的值。
    `interrupted()` 方法检测中断状态，同时将中断状态清除。
    需要注意的是，`sleep()` `wait()` 方法在抛出 `InterruptedException` 之后，**都会将中断状态清除**。
    对于这种状况，我们就需要对其进行一些处理。

### 2.2 关于 `InterruptedException` 异常

#### 2.2.1 抛出时机

当线程同时位于**阻塞**和**中断**状态时，抛出。
即，当线程调用 `sleep()` `wait()` `join()` 等方法时被中断，那么抛出异常。

一般来说，如果一个方法可以抛出 `InterruptedException`，那么说明这个方法的当前线程是可以被中断（取消）的。


#### 2.2.2 `InterruptedException` 的处理

1. 不捕捉该异常，改为向上层抛出。

    > 这在很多基础类库的方法中很常见，比如 `sleep()`.
    通过将这个方法传送给更高级的调用者，让高层面的调用方法对其进行处理。

    ```java
    public void putTask(Task r) throws InterruptedException {
        queue.put(r);
    }
    ```

2. 执行清理后，将该异常抛出。

    > 这种逻辑常常在一些第三方的并发库中，为了避免由于异常导致的数据缺失，进行一些必要的清理、保存操作后，将异常传给调用者。

    ```java
    public void matchPlayers() throws InterruptedException {
        try {
             Player playerOne, playerTwo;
             while (true) {
                 playerOne = playerTwo = null;
                 // Wait for two players to arrive and start a new game
                 playerOne = players.waitForPlayer(); // could throw IE
                 playerTwo = players.waitForPlayer(); // could throw IE
                 startNewGame(playerOne, playerTwo);
             }
         }
         catch (InterruptedException e) {
             // If we got one player and were interrupted, put that player back
             if (playerOne != null)
                 players.addFirst(playerOne);
             // Then propagate the exception
             throw e;
         }
    }
    ```

3. 捕捉中断后，重新将中断置位

    > 当不便抛出中断时，比如通过实现 `Runnable` 接口定义的任务。
    此时，就要**重新将中断置位**，以便高层代码能了解到中断的发生。

    ```java
    public class TaskRunner implements Runnable {
        private BlockingQueue<Task> queue;

        public TaskRunner(BlockingQueue<Task> queue) {
            this.queue = queue;
        }

        public void run() {
            try {
                 while (true) {
                    Task task = queue.take(10, TimeUnit.SECONDS);
                     task.execute();
                 }
            }
            catch (InterruptedException e) {
                 // Restore the interrupted status
                 Thread.currentThread().interrupt();
             }
        }
    }
    ```

4. 当且仅当已知线程即将退出时，才能**生吞**线程

    > 这种线程首先必须是由继承 `Thread` 实现的，而不是 `Runnable` 实现的，或者其他通用代码库中的方法。
    应在两处轮询中断状态，确保其一定会退出

    ```java
    public class PrimeProducer extends Thread {
        private final BlockingQueue<BigInteger> queue;

        PrimeProducer(BlockingQueue<BigInteger> queue) {
            this.queue = queue;
        }

        public void run() {
            try {
                BigInteger p = BigInteger.ONE;
                // 两处轮询中断状态
                while (!Thread.currentThread().isInterrupted())
                    queue.put(p = p.nextProbablePrime());
            } catch (InterruptedException consumed) {
                /* Allow thread to exit */
            }
        }

        public void cancel() { interrupt(); }
    }
    ```

## 3. 线程的生命周期

![Thread Life Cycle](http://ww2.sinaimg.cn/large/8c1fca6bjw1f0lm5o2cp2j20fx0csdgk.jpg)

1. 新建

    > 当线程被 `new` 的时候

2. 可运行

    > 当调用 `start()` 方法后，进入可运行状态

3. 运行

    > 当线程经调度器获得资源时，进入运行状态

4. 阻塞状态

    > 当 `sleep()` `wait()` `join()` 方法调用，和**等待锁**或者等待 **IO 输入** 时，进入阻塞状态。
    注意，`join()` 方法会导致**调用这个方法的线程**阻塞，如果线程 `t1` 调用 `t2.join()`，那么 `t1` 将进入阻塞状态，直到 `t2` 执行完毕。
    使用 `yeild()` 方法不会使线程被阻塞，它只是让当前运行的线程放弃资源，重新进入**可运行**状态，接受调度器的重新调度。

5. 终止状态

    > 仅有两种情况会使得线程终止。
    一是 `run()` 方法执行完毕。
    一是由于未捕获的异常造成的线程终止。

### 3.1 Java 如何终止一个线程

1. 对于会引起 `InterruptedException` 的方法

    > 对于这种方法，直接对 `InterruptedException` 进行捕获即可。
    注意如果产生异常的方法在一个循环之中，那么就要 `break` 出来。
    注意要将中断状态再次置位，否则如果在一个嵌套循环里面发生中断的话，那么将得不到正确处理。

2. 对于不会引起 `InterruptedException` 的方法

    > 对于这种方法，我们可以通过在执行真正的工作前，先轮询中断状态的布尔变量。如果中断状态已经被置位了，那么就执行退出。
    但是这样会造成一定程度的延时性，所以最好还是通过异常进行处理。
    例如：

    ```java
    public void run() {
        try {
            while(!Thread.currentThread().isInterrupted()) {
                 // ...
            }
        } catch (InterruptedException consumed) {
            /* Allow thread to exit */
        }
    }

    public void cancel() { interrupt(); }
    ```

3. 对于被 `IO` 阻塞的方法

    > 对于这种方法，当中断发生时，它会产生 `InterruptedIOException`。
    通过类似捕获 `InterruptedException` 的方法来捕获 `InterruptedIOException`。
    但是要注意，由于中断的发生，我们需要同时关闭这个线程所占有的 IO 流，此时，我们要重载 `interrupt()` 方法，使其能够关闭 IO 流，同时引起 `IOException` 的发生。
    所以对于 `IOException`，我们就需要判断是否是由于中断引起的 `IOException`

    ```java
    import java.io.IOException;
    import java.io.InputStream;
    import java.io.InterruptedIOException;

    public class BlockedOnIO extends Thread {
        private final InputStream in;
        public BlockedOnIO(InputStream in) {
            this.in = in;
        }

        @Override
        public void interrupt() {
            super.interrupt();
            try {
                in.close();
            } catch (IOException e) {} // quietly close
        }

        public void run() {
            try {
                System.out.println("Reading from input stream");
                in.read();
                System.out.println("Finished reading");
            } catch (InterruptedIOException e) {
                Thread.currentThread().interrupt();
                System.out.println("Interrupted via InterruptedIOException");
            } catch (IOException e) {
                if (!isInterrupted()) {
                    e.printStackTrace();
                } else {
                    System.out.println("Interrupted");
                }
            }
            System.out.println("Shutting down thread");
        }
}
    ```

## 4. 线程属性

### 4.1 优先级

1. 系统会优先调用高优先级的线程
2. 线程优先级高度依赖系统实现，由系统线程优先级映射到 Java 虚拟机上

### 4.2 守护线程

1. 守护线程用于给其他线程提供服务，例如发送定时信号等。
2. 守护线程由于很容易中断，**不应访问固有资源**（例如文件、数据库等）
3. `setDaemon()` 方法必须在线程开始前调用
4. 当程序中**只存在守护线程时**，JVM 退出，守护线程一并终止
5. 典型应用：GC（垃圾回收），保持长连接等。

### 4.3 `uncaughtExceptionHandler`

1. 线程的 `run()` 方法不能抛出任何被检测的异常
2. 未捕获的异常会被 `uncaughtExceptionHandler` 捕获
3. 可以使用特定的方法设置处理器，如果未设置，则为**空**
4. 任何线程默认情况同属于一个线程组
5. 线程组（`ThreadGroup`）默认实现了一个处理器，其对应方法按照如下逻辑进行工作

    1. 如果有父线程组，那么就采用父线程组的处理器
    2. 否则，如果 `getDefaultExceptionHandler()` 方法部位空，那么则调用该处理器。
    3. 否则，如果线程已经死亡，则什么都不做
    4. 否则，将线程的名字和对应的栈轨迹输出到 `System.err` 上。

        > 这也是我们通常见到的情景。
