---
title: Network API
date: 2017-04-08
categories: MdzzProject
tags: MdzzProject
---

## 1. 说明

**必须先看说明！！**

1. 所有的网络请求 API 均位于 `NetworkUtils` 类中，以静态方法形式呈现。

2. API 方法包括**三个参数**——发起请求的必要信息，一个结果回调监听器和一个错误回调监听器，并返回一个 `Request` 对象用于**取消请求**

    > 如下，`registerInfo` 是存储注册信息的对象，`listener` 是结果监听器， `errorListener` 是错误监听器。

    ```java
    public static Request register(RegisterInfo registerInfo,
                                   Response.Listener listener,
                        Response.ErrorListener errorListener)
    ```

    > 取消请求调用 `Request` 类的 `cancel()` 方法即可。

3. API 方法中的两个监听器需要**调用者自行实现**对结果和错误的处理

    如下是一个匿名类的监听器实现：

    ```java
    register(registerInfo,
        // 这个是结果监听器
        new Response.Listener<BaseResponse>() {
            @Override
            public void onResponse(BaseResponse response) {
                // Do with response
            }
        },
        // 这个是错误监听器
        new Response.ErrorListener() {
            @Override
            public void onError(VolleyError error) {
                // Handle error
            }
        });
    ```

4. 回调结果(**Response**)采用继承模型，所有网络结果均是或继承于`BaseResponse`，由其派生以增加相应字段。

    即**所有的回调结果都至少包含 `BaseResponse` 的字段**

    > `BaseResponse` 包括两个字段，`status` 和 `message`。

    > - BaseResponse
    >    - `status`(**boolean**): 用于表示请求的成功状态
    >   - `message`(**String**): 用于描述结果信息，一般来说将其直接呈现给用户即可

    其余具有特殊相应字段的结果均继承自 `BaseResponse`，通过派生增加新字段。

    > 如登陆的回调结果需要包含 token，则通过建立新的 `LoginResponse` 继承 `BaseResponse` ，在 `LoginResponse` 中增加 `token` 字段。

    > 回调结果类均存储在 `models.response` 包中。
    关于各个 API 回调结果的说明，请参照**服务器端文档**

5. 请通过使用 `VolleyErrorHelper` 类来获取网络错误信息的形式来处理网络错误，**不要自己处理**。

    > `VolleyErrorHelper` 类位于 `utils` 包中。
    其中也包含了一个展示默认 Snackbar 的 `display()` 方法

<!-- more -->## 2. API 列表

这里只列出**发起请求的必要参数**，剩下的两个监听器不予列出。
返回的 `Request` 对象同上，不予列出。

### 2.1 注册

```java
register(RegisterInfo registerInfo)
```

- `registerInfo`：保存用户注册信息的容器类对象，仅包括用户在注册界面填写的信息。

### 2.2 获取验证码

```java
getAuthCode(String phoneNumber)
```

- `phoneNumber`：用于获取验证码的用户手机号，要求 11 位，以 `1` 开头。
