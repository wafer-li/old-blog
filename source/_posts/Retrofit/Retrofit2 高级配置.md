---
title: Retrofit2 高级配置
date: 2017-04-08
categories: Retrofit
tags: Retrofit
---

## 0. 介绍

有时候，retrofit 提供的基础功能不够我们使用，比如我们需要打网络日志、强制缓存，设置公有头等。
此时，我们就需要对 OkHttp 的 client 进行定制，随后让 retrofit 使用我们定制的 client，从而实现我们的需求。

<!-- more -->## 1. 初始化操作

为了定制我们自己的 Okhttp client，需要先获取 `Okhttp.Builder` 对象，通过对 builder 的不断处理，从而构建出我们所需要的 client。

```java
OkHttpClient.Builder builder = new OkHttpClient.Builder();
```

## 2. 设置缓存

Retrofit 在很长的一段时间内，都没有内置的缓存处理框架，但是在 Retrofit2 强制使用 OkHttp 之后，这个问题就不再存在了。
我一开始入门 retrofit 的时候也是花了很长时间在找如何建立缓存处理机制，实际上这是没有必要的。

**只要服务端提供正确的头信息，OkHttp 就能对应的实现缓存功能，而不需要其他设置。**

当然，如果需要强制使用缓存的话，可以通过增加拦截器的办法设置 `Cache-Control` 头，从而构建客户端自己的缓存处理。

但是，只要服务端提供正确的头信息，这一步就可以省略，OkHttp 会自动进行缓存。

不过，我们还是需要通过 builder 的 `cache()` 方法来**设置缓存的路径**

```java
File cacheDir = getCacheDir();
Cache cache = new Cache(cacheDir);
builder.cache(cache);
```




### 2.1 构建自己的缓存处理策略

通过拦截器设置 `Cache-Control` 头，可以构建自己的缓存处理策略。

```java
File cacheFile = new File(DemoApplication.getContext().getExternalCacheDir(), "WuXiaolongCache");
Cache cache = new Cache(cacheFile, 1024 * 1024 * 50);
Interceptor cacheInterceptor = new Interceptor() {
    @Override
    public Response intercept(Chain chain) throws IOException {
        Request request = chain.request();
        if (!AppUtils.networkIsAvailable(DemoApplication.getContext())) {
            request = request.newBuilder()
                    .cacheControl(CacheControl.FORCE_CACHE)
                    .build();
        }
        Response response = chain.proceed(request);
        if (AppUtils.networkIsAvailable(DemoApplication.getContext())) {
            int maxAge = 0;
            // 有网络时 设置缓存超时时间0个小时
            response.newBuilder()
                    .header("Cache-Control", "public, max-age=" + maxAge)
                    .removeHeader("WuXiaolong")// 清除头信息，因为服务器如果不支持，会返回一些干扰信息，不清除下面无法生效
                    .build();
        } else {
            // 无网络时，设置超时为4周
            int maxStale = 60 * 60 * 24 * 28;
            response.newBuilder()
                    .header("Cache-Control", "public, only-if-cached, max-stale=" + maxStale)
                    .removeHeader("nyn")
                    .build();
        }
        return response;
    }
};
builder.cache(cache).addInterceptor(cacheInterceptor);
```

<!-- more -->## 3. 头信息

有时候我们需要自己定义头信息；
包括最基本的 `Accept` 和 `Content-Type` 信息；
还有就是服务器要求验证的时候，我们需要提供 `Authentication` 信息。

头信息当然可以在 `ApiServices` 接口中通过注解来指定；
但是如果我们要所有的请求都带上头信息的话，使用注解来指定势必显得太过麻烦了。

此时，我们使用 OkHttp 的 `Interceptor` 来进行。

```java
Interceptor interceptor = new Interceptor() {
    @Override
    public Response intercept(Chain chain) throws IOException {
        // 直接使用旧请求新建
        Request originalRequest = chain.request();

        Request request = originalRequest.newBuilder()
                        .header("Accept", "application/json");
                        .header("Content-Type", "application/json");

       return chain.proceed(request);
    }
};

builder.addInterceptor(interceptor);
```

## 4. 日志

众所周知，网络如果没有日志打印是无法调 bug 的。
那么如何在使用 retrofit 时打印网络日志呢？

同样，我们使用还是 OkHttp 的 `Interceptor`。

但是，这次稍微有点不同，因为我们使用的是 retrofit 提供的官方打日志专用拦截器。

**注意，日志拦截器必须在第一位！**

<!-- more -->### 4.1 添加依赖

```groovy
compile 'com.squareup.okhttp3:logging-interceptor:3.4.1'
```

### 4.2 配置拦截器

```java
HttpLoggingInterceptor logging = new HttpLoggingInterceptor();
logging.setLevel(Level.BASIC);

builder.addIntercetor(logging);
```

<!-- more -->## 5. 构建 client

当配置完毕后，就可以用我们的 Builder 生成 client 了。

```java
client = builder.build();
```

## 6. 将 client 加入 retrofit builder

最后，要让我们的 retrofit 使用 client 才能达到效果。

```java
retrofitBuilder.client(client);
```
