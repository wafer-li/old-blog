---
title: Android Volley 库的基本使用
date: 2017-04-08
categories: Android
tags: Android
---

## 1. Volley 介绍与基本使用场景

Volley 是 Google 在 2013 年 I/O 大会上发布的一个 Android 的网络框架库，用于简化 Android 构建网络连接的步骤，同时提供 **缓存**、**网络优先级**等功能。

Volley 适用于高频，小流量的网络访问，例如传输 Json 信息，前后端的小流量交互等。

对于上传和下载文件的需求，Volley 不适用。
这主要是由于 Volley 对请求队列采用的是**在内存中的缓存**，决定了 Volley 不适应大文件（二进制流）的传输。

<!-- more -->## 2. Volley 的基本使用

### 2.1 添加编译依赖

Volley 在不久前加入了 `jCenter`，直接使用 `gradle` 的 `compile` 语句即可。

```
compile 'com.android.volley:volley:1.0.0'
```

> 如果不使用 compile 语句，则需要从 Git repository 中克隆，添加编译 module

```
git clone https://android.googlesource.com/platform/frameworks/volley
```

### 2.2 添加网络访问权限

为了使用 Volley 这一**网络**库，需要在 `Manifest` 中添加网络访问权限 `android.permission.INTERNET`

### 2.3 发起网络请求

Volley 是通过**优先队列**来管理多个网络请求的，所以使用 Volley 即构建请求队列和相应的网络请求对象即可。

#### 2.3.1 例子

Volley 提供了默认的静态方法用于构建一个请求队列的实例。
所以构建一个请求对象，设置好监听，并将其加入请求队列即可。

```
final TextView mTextView = (TextView) findViewById(R.id.text);
...

// Instantiate the RequestQueue.
RequestQueue queue = Volley.newRequestQueue(this);
String url ="http://www.google.com";

// Request a string response from the provided URL.
StringRequest stringRequest = new StringRequest(Request.Method.GET,
url,
new Response.Listener<String>() {
    @Override
    public void onResponse(String response) {
        // Display the first 500 characters of the response string.
        mTextView.setText("Response is: "+ response.substring(0,500));
    }
}, new Response.ErrorListener() {
    @Override
    public void onErrorResponse(VolleyError error) {
        mTextView.setText("That didn't work!");
    }
});

// Add the request to the RequestQueue.
queue.add(stringRequest);
```

`StringRequest` 的最后两个参数是 `Response.Listener<T>` 和 `Response.ErrorListener`。

通过使用匿名的监听类来分别获得**正常的服务器响应**和**网络错误时的响应**

#### 2.3.2 基本原理

当请求被加入到队列后，Volley 会自动运行**缓存处理线程**和一个**网络通信线程池**。

**缓存处理进程**将请求出列，并判断缓存是否命中，如果缓存命中，就直接返回主线程进行结果处理。

如果缓存没有命中，则将请求加入内置的**网络通信队列**，网络通信线程池中的第一个可用线程会对请求进行处理，建立 HTTP 连接，解析返回结果并将其写入缓存，随后将结果返回到主线程。

下图是具体的工作流程图解

![Volley Request](http://i2.piimg.com/3b76b51675570a97.png)

### 2.4 取消请求

如果要取消一个网络请求，只需要调用 `Request` 的 `cancel()` 方法即可。

一经取消，Volley 会**保证**不会调用返回结果的处理器，这也就是说你可以在 `Activity` 的 `onStop()` 方法中取消所有正在处理的网络请求。

同时，还可以给请求打上 TAG，使用 `RequestQueue` 中的 `cancelAll()` 方法来取消对应的被打上 TAG 的请求。

TAG 的类型不限，甚至可以是 `Activty`，可以通过在 `onStop()` 中调用 `cancelAll(this)` 来取消所有跟这个 `Activty` 有关的 `Request`

下面是一个使用 `String` 作为 TAG 的应用例子：

```
public static final String TAG = "MyTag";
StringRequest stringRequest; // Assume this exists.
RequestQueue mRequestQueue;  // Assume this exists.

// Set the tag on the request.
stringRequest.setTag(TAG);

// Add the request to the RequestQueue.
mRequestQueue.add(stringRequest);

@Override
protected void onStop () {
    super.onStop();
    if (mRequestQueue != null) {
        mRequestQueue.cancelAll(TAG);
    }
}
```

## 3. 构建队列单例

对于 APP 来说，使用多个网络队列是浪费性能的，最好是整个 APP 使用一个队列。

所以，我们使用单例模式来进行 Volley `RequestQueue` 的操作。

### 3.1 自定义队列

`RequestQueue` 除了使用 Volley 的静态方法构建以外，还可以自己构建 `RequestQueue`。
这时，就可以对队列的缓存大小进行设定。

1. 初始化 `Cache` 实例

    ```
    // The first is the Context method
    // The second is the SIZE of the queue, described by BYTES
    Cache cache = new DiskBasedCache(getCacheDir(), 1024 * 1024);
    ```

2. 初始化 `Network` 实例

    ```
    // Using the HttpUrlConnection
    Network network = new NetWork(new HurlStack());
    ```

3. 使用以上两个实例来构建请求队列

    ```
    mRequestQueue = new RequestQueue(cache, network);
    ```

4. 启动队列

    ```
    mRequestQueue.start();
    ```

### 3.2 构建单例模型

为了节省系统资源，我们构建一个单例模型，整个 App 只使用这一个请求队列。

```
public class NetworkSingleton {
    private static NetworkSingleton mInstance;
    private static mContext;

    private RequestQueue mRequestQueue;

    // Use private constructor
    private NetworkSingleton(Context context) {
        mContext = context;
        mRequestQueue = getRequestQueue();
    }

    public static synchronized NetworkSingleton getInstance(
                                                Context context) {
        if (mInstance == null) {
            mInstance = new NetworkSingleton(context);
        }
        return mInstance;
    }

    public RequestQueue getRequestQueue() {
        if (mRequestQueue == null) {

            // The request queue needs the Application context
            // if someone pass a Activity context
            // using the getApplicationContext() could prevent
            // the wrong paramaters
            mRequestQueue = Volley.newRequestQueue(
                            mContext.getApplicationContext());
        }
        return mRequestQueue;
    }

    public <T> void addToRequestQueue(Request<T> request) {
        getRequestQueue().add(request);
    }
}
```

使用类似 Java Bean 的单例模型，我们在整个应用程序的生命周期中就只需要维护一个队列实例。
同时，还可以利用单例模型来进行请求的**添加和删除**
