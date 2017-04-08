---
title: Retrofit2 使用简明手册
date: 2017-04-08
categories: Retrofit
tags: Retrofit
---


## 0. 介绍

Retrofit 是 Square 公司出品的 Android 开源网络框架，使用注解和代理实现各项 HTTP 操作和 body 解析处理等。

Retrofit2 通过与 Square 公司的另一开源库 OkHttp3 合并，由 OkHttp 进行 HTTP 操作，重定向响应，以及缓存支持。

<!-- more -->## 1. 初始化设置

### 1.1 添加依赖

```
compile 'com.squareup.retrofit2:retrofit:2.1.0'
```

注意现在已经是 **Retrofit2** 的年代了。

### 1.2 配置 Proguard

```
# Platform calls Class.forName on types which do not exist on Android to determine platform.
-dontnote retrofit2.Platform
# Platform used when running on RoboVM on iOS. Will not be used at runtime.
-dontnote retrofit2.Platform$IOS$MainThreadExecutor
# Platform used when running on Java 8 VMs. Will not be used at runtime.
-dontwarn retrofit2.Platform$Java8
# Retain generic type information for use by reflection by converters and adapters.
-keepattributes Signature
# Retain declared checked exceptions for use by a Proxy instance.
-keepattributes Exceptions
```


## 2. 基本使用

<!-- more -->### 2.1 创建 ApiService interface

创建一个 `interface`，用于储存需要进行的网络操作 API

```java
public interface GitHubService {
  @GET("users/{user}/repos")
  Call<List<Repo>> listRepos(@Path("user") String user);
}
```

其中，方法的返回值是一个 `Call` 对象，泛型内部的 `List<Repo>` 是 GET 请求获取到的 HTTP Body 解析后的内容。
方法的参数通过注解来区分是 Request 的 URL 参数还是 Body 参数。

方法顶上的注解表明了该请求的 **HTTP method**，括号中的内容是请求**所涉及到的 URL 部分**。URL 的**基础部分**由 Retrofit 类构建时指定。

### 2.2 构建 Retrofit 类，获取 ApiService 实例

```java
Retrofit retrofit = new Retrofit.Builder()
    .baseUrl("https://api.github.com/")
    .build();

GitHubService service = retrofit.create(GitHubService.class);
```

### 2.3 通过 ApiService 实例发起请求

1. 发起同步请求

    ```java
    Call<List<Repo>> repos = service.listRepos;
    repos.execute();
    ```

2. 发起异步请求

    ```java
    Call<List<Repo>> repos = service.listRepos;
    repos.enqueue(new CallBack());
    ```

### 2.4 取消请求

```java
repos.cancel();
```

## 3. 可变 URL 和 GET 请求参数

### 3.1 可变 URL

```java
@GET("group/{id}/users")
Call<List<User>> groupList(@Path("id") int groupId);
```

上面的 `id` 在程序运行时可能会动态变化，对于这种参数， retrofit2 采用 `{}` 将其包住进行区分，并在方法形参中使用 **@Path** 注解来指定动态参数。

### 3.2 Query 参数

```java
@GET("group/{id}/users")
Call<List<User>> groupList(@Path("id") int groupId, @Query("sort") String sort);
```

通过使用 **@Query** 注解来指定请求参数。

同时也可以直接在 URL 中添加。

```java
@GET("users/list?sort=desc")
```

如果 query 参数过于复杂，可以使用 `Map` 对象来指定，此时需要使用 **@QueryMap** 注解来表示

```java
@GET("group/{id}/users")
Call<List<User>> groupList(@Path("id") int groupId, @QueryMap Map<String, String> options);
```

## 4. 通过 Body 请求

```java
@POST("users/new")
Call<User> createUser(@Body User user);
```

POST 等方法均是通过 HTTP Body 来传输内容的， retrofit 中通过使用 **@Body** 注解来表示该参数通过 HTTP Body 来进行传输。

Body 的类型会通过转换器(converter)反序列化成对应的类，如果没有指定转换器，则只能使用 Okhttp 的 **RequestBody** 作为转换的对象。

## 5. Form URL encode 数据

使用 **@FormUrlEncoded** 注解来发送 `application/x-www-form-urlencoded` 类型的数据。

使用 **@Field** 注解来指示表单的项。

```java
@FormUrlEncoded
@POST("user/edit")
Call<User> updateUser(@Field("first_name") String first, @Field("last_name") String last);
```

> `application/x-www-form-urlencoded` 和 `application/json` 的异同
前者说明，客户端会将表单参数通过 URL 加密传输，后者说明客户端会使用 HTTP Body 来传送 json。
> `application/x-www-form-urlendoced`
> ```
> { Name : 'John Smith', Age: 23}
> ```
> `application/json`
> ```
> Name=John+Smith&Age=23
> ```

## 6. 上传文件

使用 **@Multipart** 注解来表示要上传文件

```java
@Multipart
@PUT("user/photo")
Call<User> updateUser(@Part("photo") RequestBody photo, @Part("description") RequestBody description);
```

<!-- more -->## 7. 指定 Header

通过 **@Header** 注解来指定 HTTP Header

```java
@Headers("Cache-Control: max-age=640000")
@GET("widget/list")
Call<List<Widget>> widgetList();
```

这个方法只适合用于单独的一个或者几个 API 设置头，如果需要加入公有头，则需要使用 OkHttp 拦截器实现。

## 8. 指定转换器

retrofit 除了 okhttp 默认的 RequestBody 外，还提供了其他知名的序列化和反序列化的库用作转换器。
其中包括：

- Gson: `com.squareup.retrofit2:converter-gson`
- Jackson: `com.squareup.retrofit2:converter-jackson`
- Moshi: `com.squareup.retrofit2:converter-moshi`
- Protobuf: `com.squareup.retrofit2:converter-protobuf`
- Wire: `com.squareup.retrofit2:converter-wire`
- Simple XML: `com.squareup.retrofit2:converter-simplexml`
- Scalars (primitives, boxed, and String): `com.squareup.retrofit2:converter-scalars`

通过在构建 `Retorfit` 实例时，使用 `addConverterFactory()` 来实现。

```java
Retrofit retrofit = new Retrofit.Builder()
    .baseUrl("https://api.github.com")
    .addConverterFactory(GsonConverterFactory.create())
    .build();

GitHubService service = retrofit.create(GitHubService.class);
```


------

参考资料：

Retrofit 主页：http://square.github.io/retrofit/
