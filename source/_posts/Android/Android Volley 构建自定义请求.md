---
title: Android Volley 构建自定义请求
date: 2017-04-08
categories: Android
tags: Android
---

## 1. 介绍

Volley 提供了基本的 `StringRequest`，`JsonObjectRequest` 和 `JsonArrayRequest` 来满足字符串请求和 JSON 请求。

但是有时候这可能还不能满足我们对网络通信的需求。
比如说使用 `Gson` 库来自动的对响应的 JSON 进行解析等。

此时就需要构建自定义的 Volley 请求。

<!-- more -->## 2. 基本步骤

### 2.1 继承 `Request<T>` 类

自定义请求首先是通过继承基本的 `Request<T>` 类来实现的。

```
public class GsonRequst<T> extends Requst<T> {
    // class body
}
```

### 2.2 实现构造器

然后，我们要实现构造器满足基本的 Request 的构造方法。

```
public GsonRequest(String url, Class<T> clazz,
                    Response.Listener<T> listener,
                    Response.ErrorListener errorListener) {

    // Fulfill the super constructor
    super(Method.GET, url, errorListener);

    this.clazz = clazz;
    this.listener = listenr;
}
```

当然，这里作为一个 `GsonRequest`，仅仅要求满足父类的构造参数是不够的，我们还要指定 Gson 转换的 class 类型，以及必要的 Response Listener

### 2.3 重载必要方法

为了实现 `GsonRequest` 我们要重载必要的方法
`parseNetworkResponse()` 和 `deliverNetworkResponse()`

1. 重载 `parseNetworkResponse(Response response)`

    顾名思义，这个方法是用来解析网络的回复的，对于我们的 `GsonRequest`，我们首先要将网络的回复（**二进制流**）转换成 JSON，然后由 Gson 解析成相应的类。

    ```
    @Override
    protected Response<T> parseNetworkResponse(
            NetworkResponse response) {
        try {
            String json = new String(response.data,
            HttpHeaderParser.parseCharset(response.headers));
            return Response.success(gson.fromJson(json, clazz),
                    HttpHeaderParser.parseCacheHeaders(response));
        }
        // handle errors
        ...
    }
    ```

2. 重载 `deliverNetworkResponse(T response)`

    这个方法是将 `parseNetworkResponse()` 的**解析结果**发送给我们的 Response listener 的。
    所以，代码较为简单，直接把解析出来的 `response` 传给 `listener` 的回调方法即可。

    ```
    @Override
    protected void deliverResponse(T response) {
        listener.onResponse(response);
    }
    ```

### 2.4 完整示例

完整的可用代码如下：

```
public class GsonRequest<T> extends Request<T> {
    private final Gson gson = new Gson();
    private final Class<T> clazz;
    private final Map<String, String> headers;
    private final Listener<T> listener;

    /**
     * Make a GET request and return a parsed object from JSON.
     *
     * @param url URL of the request to make
     * @param clazz Relevant class object, for Gson's reflection
     * @param headers Map of request headers
     */
    public GsonRequest(String url, Class<T> clazz, Map<String, String> headers,
            Listener<T> listener, ErrorListener errorListener) {
        super(Method.GET, url, errorListener);
        this.clazz = clazz;
        this.headers = headers;
        this.listener = listener;
    }

    @Override
    public Map<String, String> getHeaders() throws AuthFailureError {
        return headers != null ? headers : super.getHeaders();
    }

    @Override
    protected void deliverResponse(T response) {
        listener.onResponse(response);
    }

    @Override
    protected Response<T> parseNetworkResponse(NetworkResponse response) {
        try {
            String json = new String(
                    response.data,
                    HttpHeaderParser.parseCharset(response.headers));
            return Response.success(
                    gson.fromJson(json, clazz),
                    HttpHeaderParser.parseCacheHeaders(response));
        } catch (UnsupportedEncodingException e) {
            return Response.error(new ParseError(e));
        } catch (JsonSyntaxException e) {
            return Response.error(new ParseError(e));
        }
    }
}
```

## 3. 关于 POST 方法

以上的例子是基于 `GET` 方法来介绍的，如果使用 POST 方法则略有不同。

仍然以 `GsonRequest` 举例子：

1. 首先，我们需要接受一个新的参数用来承接 POST 的实例对象
2. 使用 Gson 将对象序列化成 JSON 字符串
3. 将 JSON 字符串转换成 Params 或者直接 POST JSON 字符串

此时，我们需要重载几个新方法。

### 3.1 重载 `getParams()` 或 `getBody()` 方法

`getParams()` 方法实质上会在 `getBody()` 方法中**被调用**，
如果你只需要 POST 简单的 Params 形式(`key=val&another_key=another_val`)，那么重载 `getParams()` 方法即可。

但如果普通的 Params 形式无法满足需要，那么就需要重载 `getBody()` 方法，其返回的内容会成为 HTTP POST 报文中的 Body。

**注意：两个方法只能选择重载其中一个**

#### 3.1.1 重载 `getParams()` 方法

一般的 POST 使用，我们重载此方法即可，该方法返回类型是 `Map<Sting, String>`。

在 `GsonRequest` 中，我们只需要使用 `Gson` 将需要 POST 的对象序列化成 JSON，随后将 JSON 反序列化成 Map<String, String> 即可。
即 `Object -> JSON -> Map<String, String>`

```
@Override Map<String, String> getParmas() {
    String json = gson.toJson(mPostObject);

    // Use TypeToken to avoid the unchecked cast
    // and the floating number converted from primitive integer
    return gson.fromJson(
        json,
        new TypeToken<Map<String, String>>(){}.getType());
}
```

##<!-- more -->## 3.1.2 重载 `getBody()` 方法

如果基本的 `getParams()` 方法不能满足需要，那么我们可以直接重载 `getBody()` 方法来实现对 HTTP body 的高度定制。

在 `GsonRequest` 中，假如碰到有时需要 POST 带 `List` 或者数组类型的对象，由于 `List` 不能被 cast 成 `Map<String, String>` 的类型，那么就不能使用 `getParams()` 方法。
应该要使用 `getBody()` 方法。

注意 `getBody()` 返回的是 `byte[]` 类型，我们需要使用 `String` 的 `getBytes()` 方法来将 JSON 转换成二进制流。

```
@Override
public byte[] getBody() throws AuthFailureError {

    if (mPostObject != null) {
        String postJson = gson.toJson(mPostObject);

        try {
            return postJson.getBytes(PROTOCOL_CHARSET);
        } catch (UnsupportedEncodingException e) {
            VolleyLog.wtf(
                    "Unsupported Encoding while trying to get the byte of %s using %s",
                    postJson, PROTOCOL_CHARSET);
        }
    }

    return null;
}
```

### 3.2 重载 `getBodyContentType()` 方法

为了我们的 POST body 能被成功解析，我们还需要重载 `getBodyContentType()` 方法来指定我们 POST 的**数据的类型**

```
@Override
public String getBodyContentType() {
    return PROTOCOL_CONTENT_TYPE;
}
```
