---
title: Rxjava2 坑点详解
date: '2017-05-02 04:03'
tags:
  - Rxjava2
  - Rxjava
category: Rxjava
---

Rxjava，是一个响应式的(Reactive)，基于观察者模式的异步框架。

除此之外，还有其他的 RxScala 和 RxSwift 等。

> 说起来现在已经 2017 年了，应该没有什么 Java 工程师不知道什么是 Rxjava 了吧

<!-- more -->

网上关于 Rxjava 的文章已经非常多了， 如果你没有了解过 Rxjava；

那么请直接到文章最后看一些资料和教程；

这里就主要来讲讲一些 Rxjava2 的坑点。

## 1. `Observable` 和 `Flowable`

Rxjava2 新增了一个 `Flowable`，看起来 API 调用和 `Observable` 类似，而且官方的 README 上都是 `Flowable` 的示例教程；

那么很自然的就会联想到 `Flowable` 是 `Obserable` 的替代用品；

它们的 API 调用没有什么区别；

如果你这么想那就是 **大错特错**！

它们俩存在一个很大的区别就是关于背压问题的处理。

### 1.1 什么是背压(backpressure)

在异步任务中，经常会出现一种情况：生产者生产产品过快，而消费者消费速率不同；

如果不做处理，那么接收端就会被发送端淹没，或者发送端堆积一大堆事件无法处理，最终导致内存爆炸。

在计算机网络中，对于这种情况的最简单处理就是采用停等模型，直到收到接收端的回报之后，才发送下一个数据。

而背压，指的就是这样一种处理策略：

通过将默认的被动接受事件的模式变成 **主动请求事件** ，从而避免接收端处理不及而被淹没或者 OOM 的问题。

### 1.2 关于背压的不同处理

那么两者具体的区别就是：

1. `Flowable` 是有背压策略的，需要**主动请求事件发送**

2. 而 `Observable` 是没有背压策略的，事件会自动发送，多了就会 OOM


### 1.3 具体的例子

Observable：

```java
Observable.just(1, 2, 3, 4, 5)
          .subscribe(new Observer<Integer>() {
              @Override
              public void onSubscribe(Disposable d) {
                  // Disposable 用来取消订阅
              }

              @Override
              public void onNext(Integer value) {

              }

              @Override
              public void onError(Throwable e) {

              }

              @Override
              public void onComplete() {

              }
          })
```

`Observable` 对应的是 `Observer`；

这个写法是没有背压控制的，如果事件过多会 OOM


Flowable：

```java
Flowable.just(1, 2, 3, 4, 5)
.subscribe(new Subscriber<Integer>() {
    Subscription sub;
    //当订阅后，会首先调用这个方法，其实就相当于onStart()，
    //传入的Subscription s参数可以用于请求数据或者取消订阅
    @Override
    public void onSubscribe(Subscription s) {
        Log.w("TAG","onsubscribe start");
        sub=s;
        sub.request(1);
        Log.w("TAG","onsubscribe end");
    }

    @Override
    public void onNext(Integer o) {
        Log.w("TAG","onNext--->"+o);
        sub.request(1);
    }
    @Override
    public void onError(Throwable t) {
        t.printStackTrace();
    }
    @Override
    public void onComplete() {
        Log.w("TAG","onComplete");
    }
});
```

`Flowable` 对应的是 `Subscriber`

可以看到，在具体的回调方法中，我们需要使用 `request()` 来指示上游的数据传输。

否则， **数据是不会自动传输的**。


还有一个有趣的地方在于上面代码的输出结果：

```bash
onsubscribe start
onNext--->0
onNext--->1
onNext--->2
...
onNext--->10
onComplete
onsubscribe end
```

可以看到，`onNext` 在 `onSubscribe` 方法 **并没有执行完毕** 就开始调用了。

具体来说，是在 `request()` 之后，`onNext` 方法就立即被执行了；

> 不过在实践中也不一定是这样的结果

所以千万要注意，在 `request()` 之前就要将所有的初始化工作做好。

## 2. 线程调度

能够对线程进行自由调度是 Rxjava 的一大优势；

但是，由于 Rxjava 的 API 是流式调用，所以很可能会出现线程调度的坑。

具体来说，Rxjava 通过 `subscribeOn()` 和 `observeOn()`  来实现对线程的调度；

其中，`subscribeOn()` 指定的是数据的生产线程；

`observeOn()` 指定的是数据的消费线程。

但是，一个很重要的区别在于：

1. `subscribeOn()` 只能指定一次

    > 如果多次指定，则以第一次为准

2. `observeOn()` 可以指定多次

    > 每指定一次，其之后流式操作所在的线程就会是指定的线程

举个例子：

```java
Observable.just(getFilePath())
           //指定在新线程中创建被观察者
          .subscribeOn(Schedulers.newThread())
          //将接下来执行的线程环境指定为io线程
          .observeOn(Schedulers.io())
            //map就处在io线程
          .map(mMapOperater)
            //将后面执行的线程环境切换为主线程，
            //但是这一句依然执行在io线程
          .observeOn(AndroidSchedulers.mainThread())
          //指定线程无效，但这句代码本身执行在主线程
          .subscribeOn(Schedulers.io())
          //执行在主线程
          .subscribe(mSubscriber)
```

## 3. 参考资料

[给 Android 开发者的 RxJava 详解](https://gank.io/post/560e15be2dca930e00da1083)

[关于RxJava最友好的文章](http://www.jianshu.com/p/6fd8640046f1)

[关于RxJava最友好的文章（进阶）](http://www.jianshu.com/p/e61e1307e538)

[关于RxJava最友好的文章——背压（Backpressure）](http://www.jianshu.com/p/2c4799fa91a4)

[关于 RxJava 最友好的文章—— RxJava 2.0 全新来袭](http://www.jianshu.com/p/220955eefc1f)
