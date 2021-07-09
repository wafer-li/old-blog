---
title: Retrofit2 + Rxjava2
date: '2017-05-02 05:49'
tags:
  - Rxjava2
  - Retrofit
  - Android
category: Android

---

Retrofit 和 Rxjava 结合应该算得上是 Rxjava 在 Android  应用得最广泛的一个方面了。

这里就来讲讲关于这两个库具体组合的用法。

<!-- more -->

## 1. 添加依赖

具体需要添加的依赖库有： `Retrofit2`、`Rxjava2`、`RxAndroid2`、`Gson` 、`Rtrofit2` 到 `Rxjava2` 的转换器、`Retrofit2` 到 `Gson` 的转换器

```groovy
    // Retrofit
    compile 'com.squareup.retrofit2:retrofit:2.2.0'
    compile group: 'com.squareup.retrofit2', name: 'converter-gson', version: '2.2.0'
    compile group: 'com.squareup.retrofit2', name: 'adapter-rxjava2', version: '2.2.0'

    // Rx*
    compile 'io.reactivex.rxjava2:rxjava:2.1.0'
    compile 'io.reactivex.rxjava2:rxandroid:2.0.1'
    compile 'io.reactivex.rxjava2:rxkotlin:2.0.1-RC1'
```

其中，`Gson` 是 JSON 解析库，也可以使用 `Jackson` 替代；

上面的 `rxkotlin` 是 `Rxjava` 的 `Kotlin` 轻量支持库；

如果不使用 Kotlin 可以无视。


## 2. 构建 API

使用 `Retrofit` 的第一步当然就是构建 API 接口；

不过既然我们使用的是 Rxjava2，那么，这个 API 接口当然就稍微有点不一样：

```kotlin
interface TrendingApi {

    @GET("{language}")
    fun getTrending(@Path("language") language: String = ".", @Query("since") since: String)
            : Observable<ResponseBody>
}
```

可以看到，我们 API 返回的是一个 `Observable<T>` 对象，而非通常的 `Call<T>` 对象。

对于这个 `Observable`，假设我们的 Body 对象为 `T`，那么 `Observable` 一共有以下的几种可能情况：

- `Observable<T>`
- `Observable<Response<T>>`
- `Observable<Result<T>>`

前两个自然不用说，第三个 `Result` 是 `Response<T>` 和 `Throwable` 的包装对象；

也就是说，如果使用 `Result` 的话，我们可以在 `onNext()` 中同时处理正常情况和异常情况。

> 所谓的异常情况指的是抛出了 Exception


## 3. 三种 `Observable` 的区别

那么这三种 `Observable` 究竟有什么区别呢？

我们来看看具体 `adapter-rxjava2` 的源码：

```java
Observable<Response<R>> responseObservable = isAsync
      ? new CallEnqueueObservable<>(call)
      : new CallExecuteObservable<>(call);

  Observable<?> observable;
  if (isResult) {
    observable = new ResultObservable<>(responseObservable);
  } else if (isBody) {
    observable = new BodyObservable<>(responseObservable);
  } else {
    observable = responseObservable;
  }
```

从这段代码可以看到，默认的情况就是 `Observable<Response<T>>`；

而这个默认的 `Observable` 是通过执行 `CallEnqueueObservable` 或者 `CallExecuteObservable` 得到的。

然后再通过判断 `Observable` 的包装状态，对上面得到的 `Observable<Response<T>>` 进行转换。

### 3.1 `Observable<T>`

首先来看我们的 `BodyObservable`：

```java
@Override protected void subscribeActual(Observer<? super T> observer) {
  upstream.subscribe(new BodyObserver<T>(observer));
}
```

可以看到，在 `subscribeActual()` 中，对我们传入的 `observer` 封装了一层外壳 `BodyObserver`；

然后将其传入上层的 `subscribe` 中，以启动网络请求。

这层外壳正是这个 `Adapter` 的关键所在，通过使用另一个对象，来处理不同的网络情况，然后再委派到我们真正传入的 `observer`

```java
private static class BodyObserver<R> implements Observer<Response<R>> {
  private final Observer<? super R> observer;
  private boolean terminated;

  BodyObserver(Observer<? super R> observer) {
    this.observer = observer;
  }

  @Override public void onSubscribe(Disposable disposable) {
    observer.onSubscribe(disposable);
  }

  @Override public void onNext(Response<R> response) {
    if (response.isSuccessful()) {
      observer.onNext(response.body());
    } else {
      terminated = true;
      Throwable t = new HttpException(response);
      try {
        observer.onError(t);
      } catch (Throwable inner) {
        Exceptions.throwIfFatal(inner);
        RxJavaPlugins.onError(new CompositeException(t, inner));
      }
    }
  }

  @Override public void onComplete() {
    if (!terminated) {
      observer.onComplete();
    }
  }

  @Override public void onError(Throwable throwable) {
    if (!terminated) {
      observer.onError(throwable);
    } else {
      // This should never happen! onNext handles and forwards errors automatically.
      Throwable broken = new AssertionError(
          "This should never happen! Report as a bug with the full stacktrace.");
      //noinspection UnnecessaryInitCause Two-arg AssertionError constructor is 1.7+ only.
      broken.initCause(throwable);
      RxJavaPlugins.onError(broken);
    }
  }
}
```

可以看到，其实这层壳处理的并不是我们的 `Body` 对象，而是之前使用 `Call` 调用时返回的 `Response` 对象。

我们重点来看看 `onNext()`：

```java
@Override public void onNext(Response<R> response) {
  if (response.isSuccessful()) {
    observer.onNext(response.body());
  } else {
    terminated = true;
    Throwable t = new HttpException(response);
    try {
      observer.onError(t);
    } catch (Throwable inner) {
      Exceptions.throwIfFatal(inner);
      RxJavaPlugins.onError(new CompositeException(t, inner));
    }
  }
}
```

可以看到，当成功访问并响应的时候(2xx)，结果返回给了我们的 `onNext()` ；

而当成功访问但不成功响应的时候(4xx/5xx)，返回的结果通过 `HttpException` 的包装，然后返回给了我们的 `onError()` 方法。

而当这个壳子中出现 `onError()` 时，意味着可能出现了断网的情况，或者其他异常；

此时也是通过 `onError()` 返回到我们的观察者中。

结论：

- 2xx 结果通过 `onNext()` 返回
- 4xx/5xx 结果通过 `onError()` 返回
- 断网和其他异常情况也通过 `onError()` 返回

### 3.2 `Observable<Result<T>>`

`Result` 是 `adapter-rxjava2` 新增的包装类，包装了 `error` 和 `response` ；

关于它具体如何工作的，我们来看看它的源码：

首先是 `Result` 类，下面的是 `ResultObservable` 使用到的静态工厂方法和 `Result` 的构造函数：

```java
public static <T> Result<T> error(Throwable error) {
  if (error == null) throw new NullPointerException("error == null");
  return new Result<>(null, error);
}

public static <T> Result<T> response(Response<T> response) {
  if (response == null) throw new NullPointerException("response == null");
  return new Result<>(response, null);
}

private final Response<T> response;
private final Throwable error;

private Result(Response<T> response, Throwable error) {
  this.response = response;
  this.error = error;
}
```

可以看到，`error` 和 `response` 是不共戴天的关系，符合 `Retrofit`  的设计。

下面我们来看看具体的 `ResultObservable` 的包装类：

```java
  private static class ResultObserver<R> implements Observer<Response<R>> {
    private final Observer<? super Result<R>> observer;

    ResultObserver(Observer<? super Result<R>> observer) {
      this.observer = observer;
    }

    @Override public void onSubscribe(Disposable disposable) {
      observer.onSubscribe(disposable);
    }

    @Override public void onNext(Response<R> response) {
      observer.onNext(Result.response(response));
    }

    @Override public void onError(Throwable throwable) {
      try {
        observer.onNext(Result.<R>error(throwable));
      } catch (Throwable t) {
        try {
          observer.onError(t);
        } catch (Throwable inner) {
          Exceptions.throwIfFatal(inner);
          RxJavaPlugins.onError(new CompositeException(t, inner));
        }
        return;
      }
      observer.onComplete();
    }

    @Override public void onComplete() {
      observer.onComplete();
    }
  }
}
```

可以看到，这回，重点在 `onError` 方法；

通过重载 `onError` 并使用 `Result` 的静态工厂；

让我们的 `observer` 也能通过 `onNext` 获取到具体的 `Throwable`；

也就是说，我们可以在 `onNext()` 处理网络错误。

而当更严重的错误发生时，`onError()` 才会被调用

结论：

网络异常和正常的网络内容都通过 `onNext()` 进行处理。

### 3.3 `Observable<Response<T>>` 的获取

那么作为关键的 `Observable<Response<T>>` 对象是从哪里获取的呢？

让我们将目光转向在开头的两个 `Call` 开头的 `Observable`；

很容易知道，一个对应了 `Retrofit` 的 `call.execute()`；

而另外一个对应了 `call.enqueue()`

为了简便，我们只看 `execute()` 部分的源码：

下面就是关键的 `subscribeActual` 方法：

```java
@Override protected void subscribeActual(Observer<? super Response<T>> observer) {
  // Since Call is a one-shot type, clone it for each new observer.
  Call<T> call = originalCall.clone();
  observer.onSubscribe(new CallDisposable(call));

  boolean terminated = false;
  try {
    Response<T> response = call.execute();
    if (!call.isCanceled()) {
      observer.onNext(response);
    }
    if (!call.isCanceled()) {
      terminated = true;
      observer.onComplete();
    }
  } catch (Throwable t) {
    Exceptions.throwIfFatal(t);
    if (terminated) {
      RxJavaPlugins.onError(t);
    } else if (!call.isCanceled()) {
      try {
        observer.onError(t);
      } catch (Throwable inner) {
        Exceptions.throwIfFatal(inner);
        RxJavaPlugins.onError(new CompositeException(t, inner));
      }
    }
  }
}
```

可以看到，通过调用 `call.execute()` 获取 `Response` 对象；

然后将获取到的 `Response` 对象进行传递，就实现了一个 `Observable` 的功能。

### 3.4 原理和结论

通过以上的源码解读，我们得出了 `adapter-rxjava2` 的具体原理：

首先通过  `CallExecuteObservable` 获取到 `Observable<Response<T>>` 对象；

然后根据不同的 `Observable` 类型对这个对象进行变换，最后传出，得到了我们需要的 `Observable`；

在调用 `Observable.subscribe(observer)` 时；

首先是最外层的 `subscribeActual()` 被调用；

然后被层层传递，直到 `CallExecuteObservable` 的 `subscribeActual()` 调用 `call.execute()`；

然后将 `Response`  向下进行层层传递，完成了整个订阅流程。


结论：

1. 只有最后 `subscribe()` 调用，才会触发网络请求

    > 在此之前可以先保留 `Observable` 对象；
    > 直到需要的时候再进行调用

2. `Observable<T>` 的 2xx 结果在 `onNext()`  调用，4xx/5xx 结果在 `onError()` 调用

3. `Observable<Result<T>>` 的 `error` 和 `response` 都在 `onNext()` 调用


## 4. 创建 `Retrofit` 实例

当我们的 API 创建好之后，我们就可以开始创建 `Retrofit` 实例；

为了能够使用 Rxjava，必须给 `Retrofit` 加上 `CallAdapterFactory`：

```kotlin
private val retrofitBuilder: Retrofit.Builder =
         Retrofit.Builder()
                 .baseUrl(BASE_URL)
                 .addCallAdapterFactory(RxJava2CallAdapterFactory.create())
                 .addConverterFactory(GsonConverterFactory.create(gson))
```

这里来说一下有关 `RxJava2CallAdapterFactory` 的几个 `create()` 的区别；

这个工厂一共有三个静态构造方法：

- `create()`
- `createAsync()`
- `createScheduler(scheduler)`


第一个是产生一个同步的 `Adapter`，相当于调用 `call.execute()`；

同时，也不对 `call.execute()` 的线程进行提前控制。


第二个是产生一个异步的 `Adapter`，相当于调用 `call.enqueue()`；

> **此时，`Observable` 的 `subscribeOn()` 方法失效**

第三个是指定一个 `Scheduler`，让 `Adapter` 产生的 `Observable` 一开始就 `subscribeOn` 到那个线程上。

## 5. 调用网络 API

终于，我们可以开始对构建起来的 API 进行调用了，调用的方法和 Rxjava 的普通使用无异；

下面给出一个基本的例子：

```java
ApiManager.createTrendingService(TrendingApi::class)
                   .getTrending(since)
                   .subscribeOn(Schedulers.io())
                   .observeOn(AndroidSchedulers.mainThread())
                   .subscribe(observer);
```

这里，让我们的网络请求在 `io()` 线程上发生；

然后在 Android 的主线程进行回调；

需要注意的是，我们需要使用 `AndroidSchedulers` 来进行主线程的指定。

> 特别需要注意的是，`observeOn()` 是可以多次指定的
> 如果你需要对结果进行变换操作
> 请务必将 `observeOn()` 紧挨在 `subscribe()` 进行设置
> 否则就会在主线程进行请求的变换操作

## 6. 取消请求

讲了这么多都是在讲发起请求，那么该如何取消请求呢？

没有了 `Call` 对象，我们该如何取消已经发出去的请求呢？

实际上 `adapter-rxjava2` 已经考虑到了这一点。

在 `CallExecuteObservable` 中，它向 `observer` 的 `onSubscribe()` 传入了一个 `CallDisposable` 对象；

通过这个 `CallDisposable`，当我们取消订阅时，就会自动地将请求取消。

```java
private static final class CallDisposable implements Disposable {
   private final Call<?> call;

   CallDisposable(Call<?> call) {
     this.call = call;
   }

   @Override public void dispose() {
     call.cancel();
   }

   @Override public boolean isDisposed() {
     return call.isCanceled();
   }
 }
```

所以，只要在 `onSubscribe()` 中获取到 `Disposable` 对象；

通过调用 `dispose()` 就能取消请求。

## 7. 其他

`adapter-rxjava2` 除了支持 `Observable` 以外，还支持了 `Flowable`、`Single` 和 `Maybe` 等对象；

由于原理都是类似的，在这里就不详细展开了。

> 不过，请务必注意 `Flowable` 和 `Observable` 的区别。
