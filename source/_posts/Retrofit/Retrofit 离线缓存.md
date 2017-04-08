---
title: Retrofit 离线缓存
date: 2017-04-08
categories: Retrofit
tags: Retrofit
---

## 概述

Retrofit2 自从默认使用 OkHttp 库之后，自带了缓存功能；

但是，这个缓存功能是在线缓存，也就是**向服务器发起请求，服务器返回 304**，而不是直接从缓存读取而不发起网络请求。

这样，当我们的应用处在离线状态时候，就无法读取缓存中的内容了。

这对于用户体验来说显然是不好的，所以这篇文章就介绍一下如何配置 Retrofit 和 OkHttp 来进行**离线缓存**

<!-- more -->## 设置缓存路径

为了使用 OkHttp 的缓存，我们就必须设置相应的缓存路径。

```java
File cacheDir = getCacheDir();
Cache cache = new Cache(cacheDir);

client = builder.cache(cacheDir).build();
```

## 配置拦截器

OkHttp 可以通过拦截器来实现对请求(`Request`)和响应(`Response`)的魔改。

我们实现离线缓存的方式，就是采用这个拦截器对响应进行魔改。

### 通过 `CacheControl` 配置缓存

首先，我们要对我们的缓存策略进行配置，最好的当然就是使用 OkHttp 自带的 `CacheControl` 进行配置。

```java
CacheControl.Builder cacheBuilder = new CacheControl.Builder();
cacheBuilder.maxAge(0, TimeUnit.SECONDS);//这个是控制缓存的最大生命时间
cacheBuilder.maxStale(365,TimeUnit.DAYS);//这个是控制缓存的过时时间
CacheControl cacheControl = cacheBuilder.build();
```

### 建立拦截器

和自定义 `Response` 缓存不同，对于离线缓存，我们对 `Request` 进行处理；

当离线时，给 `Request` 赋予一个缓存控制对象，然后直接 proceed 即可。

```java
Request request = chain.request();

// 离线状态下才进行自定义缓存控制
if(!StateUtils.isNetworkAvailable(MyApp.mContext)){
    request = request.newBuilder()
            .cacheControl(cacheControl)
            .build();
}

Response response = chain.proceed(request);
```
