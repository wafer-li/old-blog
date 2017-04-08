---
title: TextInputLayout 使用
date: 2017-04-08
categories: Android
tags: Android
---

## 1. 介绍

`TextInputLayout` 是 Android 6.0 提供的新的输入框架，可以显示一个更好的输入效果。

以下是 `TextInputLaout` 的显示效果

<center>![](http://blog.incredibleandros.com/images/textInputlayout.gif)</center>

<!-- more -->## 2. 基本使用

### 2.1 添加依赖框架

TextInputLayout 是 Android design 库的控件，所以需要添加 Android 的 design 库。

```
  compile 'com.android.support:appcompat-v7:23.3.0'
  compile 'com.android.support:design:23.3.0'
```

### 2.2 XML 代码

在这里要注意， `TextInputLayout` 实际上是一个 `Layout` 控件，**不能提供输入框功能**

输入框应由其中的 `TextInputEditText` 提供。

其实使用 `EditText` 代替也是可以的，但是 Google 官方更加推崇 TextInput 系列的配套使用

```
<android.support.design.widget.TextInputLayout
          android:layout_width="fill_parent"
          android:id="@+id/your_matchcode_holder"
          app:errorEnabled="true"
          android:layout_height="wrap_content">

        <android.support.design.widget.TextInputEditText
            android:id="@+id/your_matchcode"
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
</android.support.design.widget.TextInputLayout>
```

<!-- more -->### 2.3 相应效果的设置

`TextInputLayout` 区别于 `EditText` 的一点在于，一些提示效果，如 Hint 和 Error Message 需要在 **Java** 代码中进行设置。

注意，因为 `TextInputLayout` 中内置了 `getEditText()` 方法，所以**只需要给 `TextInputLayout` 设置 id 即可**。

#### 2.3.1 Hint 效果

设置 `TextInputLayout` 的 Hint 效果很简单，只需要调用 `setHint()` 方法即可。

```java
phoneWrapper.setHint(getString(R.string.login_hint_phone));
```

#### 2.3.2 Error 效果

设置 `TextInputLayout` 的 Error 效果则有点 tricky。

一般来说，设置 Error 效果和 Hint 一样，调用 `setError()` 即可。

```java
phoneWrapper.setError(phoneNumberErrorMessage);
```

> `setError("error message")` 会判断如果 Error 没有 Enable 的话，会先调用 `setErrorEnable(true)`，所以设置 Error **不需要事先设置 `setErrorEnable(true)`**

但是，当需要清除 Error 效果时，则**必须需要两步。**

1. 设置 `setError(null)`
2. 设置 `setErrorEnable(false)`


> 原因在于，`setError(null)` 只会把 `Error` 设置为 `View.INVISIABLE`，不会消除错误信息所占的空间。
所以，我们需要使用 `setErrorEnable(false)` 去将显示错误的 `TextView` 删除掉，从而消除错误所占的空间。

> 那能不能**只调用 `setErrorEnable(false)` 呢**？
答案是**不能**。
原因在于，`setErrorEnable(false)`，不会消除存储错误信息的 `mError`，而当再次出现同样的错误，设置 `setError("error message")` 时，由于 `mError` 没有更新，导致 `setError()` 判断**前后错误信息一致，直接返回，没有重新生成 `TextView`，从而错误信息就不会再显示了。**
