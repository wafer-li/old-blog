---
title: Butter Knife
date: 2017-04-08
categories: Android
tags: Android
---

## 1. 安装与配置

<!-- more -->### 1.1 添加 Gradle 依赖

在 `app/build.gradle` 中加入如下语句

```
compile 'com.jakewharton:butterknife:7.0.1'
```

### 1.2 压制 Lint Warnning

在使用 Butter Knife 时，由于它是动态生成代码，Lint 由于没有检测到代码，所以会提示一些错误的警告，所以需要压制 Lint Warning。

在 `app/build.gradle` 中添加如下代码

```
lintOptions {
  disable 'InvalidPackage'
}
```

### 1.3 配置 ProGuard

由于 Android 在 Release apk 时，会使用 ProGuard 来进行代码优化和混淆，但是它很可能无法正确区分所需要的代码，从而将 Butter Knife 的代码删除，所以要配置一些 Keep 选项。

在 `proguard.cfg` 文件中配置

```
-keep class butterknife.** { *; }
-dontwarn butterknife.internal.**
-keep class **$$ViewBinder { *; }

-keepclasseswithmembernames class * {
    @butterknife.* <fields>;
}

-keepclasseswithmembernames class * {
    @butterknife.* <methods>;
}
```

## 2. 使用

Butter Knife 最大的好处就是使用注解式开发，从而减少大量重复冗余的代码。

<!-- more -->### 2.1 绑定视图

这里需要注意的是，**重点是要调用 `ButterKnife.bind()` 方法**，否则是无法起作用的。

#### 2.1.1 在 Activity 中进行绑定

使用 `@Bind` 注释，并传入相应的视图 `id`，就可以将一个组件和它的视图快速绑定

例如：

```java
class ExampleActivity extends Activity {
  @Bind(R.id.title) TextView title;
  @Bind(R.id.subtitle) TextView subtitle;
  @Bind(R.id.footer) TextView footer;

  @Override
  public void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    setContentView(R.layout.simple_activity);
    // 注意，这个必须在 setContentView之后执行
    ButterKnife.bind(this);
    // TODO Use fields...
  }
}
```

注意， Butter Knife 的原理是通过生成代码来实现的，上面的使用相当于（生成了）以下代码

```java
public void bind(ExampleActivity activity) {
  activity.subtitle = (android.widget.TextView) activity.findViewById(2130968578);
  activity.footer = (android.widget.TextView) activity.findViewById(2130968579);
  activity.title = (android.widget.TextView) activity.findViewById(2130968577);
}
```

#### 2.1.2 在 Fragment 中进行绑定

Butter Knife 提供了其 `bind()` 方法的几个重载，也可以通过接受一个根布局来进行绑定，所以在 Fragment 中应如下使用：

```java
public class FancyFragment extends Fragment {
  @Bind(R.id.button1) Button button1;
  @Bind(R.id.button2) Button button2;

  @Override public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
    View view = inflater.inflate(R.layout.fancy_fragment, container, false);
    // 通过提供一个根布局实现 Fragment 的绑定
    ButterKnife.bind(this, view);
    // TODO Use fields...
    return view;
  }
}
```

#### 2.1.3 在 ViewHolder 中实现绑定

Android APP 中， ListView 或 RecyclerView 是最为常见的视图组件，对此，Butter Knife 也实现了 ViewHolder 的绑定方法。如下：

这里使用的是 ListView, 但是由于绑定的实现都在 ViewHolder 内部类中，因而 RecyclerView 的使用同理。

```java
public class MyAdapter extends BaseAdapter {
  @Override public View getView(int position, View view, ViewGroup parent) {
    ViewHolder holder;
    if (view != null) {
      holder = (ViewHolder) view.getTag();
    } else {
      view = inflater.inflate(R.layout.whatever, parent, false);
      holder = new ViewHolder(view);
      view.setTag(holder);
    }

    holder.name.setText("John Doe");
    // etc...

    return view;
  }

  static class ViewHolder {
    @Bind(R.id.title) TextView name;
    @Bind(R.id.job_title) TextView jobTitle;

    public ViewHolder(View view) {
      ButterKnife.bind(this, view);
    }
  }
}
```

#### 2.1.4 其他情形

实际上，@Bind 注解只是起到了一个引入视图的作用，真正起到作用的是 `ButterKnife.bind` 方法，这一方法可以被放在任何你想使用 `findViewById` 的地方

#### 2.1.5 其他绑定 API

1. ButterKnife.bind(this, activity)

    > 这个方法可以在将导入的视图 xml 在任何地方进行绑定，如果采用了类似 **MVC** 的编程模式，那么就可以使用这个方法在 `Controller` 中进行绑定

#### 2.1.6 绑定 View 列表

你可以一次性将多个 View 绑定到一个 List 或者数组上

```java
@Bind({ R.id.first_name, R.id.middle_name, R.id.last_name })
List<EditText> nameViews;
```

可以使用统一的 apply() 方法来对 View 进行统一的操作

```java
ButterKnife.apply(nameViews, DISABLE);
ButterKnife.apply(nameViews, ENABLED, false);
```

> 上面的代码实际上就相当于对列表中的每一个元素都采用这样的操作。
注意，上面的 DISABLE 和 ENABLE 需要定义 Action 和 Setter 的接口方法之后才能有效

```java
static final ButterKnife.Action<View> DISABLE = new ButterKnife.Action<View>() {
  @Override public void apply(View view, int index) {
    view.setEnabled(false);
  }
};
static final ButterKnife.Setter<View, Boolean> ENABLED = new ButterKnife.Setter<View, Boolean>() {
  @Override public void set(View view, Boolean value, int index) {
    view.setEnabled(value);
  }
};
```

同时，也可以将 Android 的 Property 应用到 apply() 方法中

```java
ButterKnife.apply(nameViews, View.ALPHA, 0.0f);
```

### 2.2 绑定监听器

Butter Knife 也同时提供了绑定监听器的方法；
通过使用 @OnClick 注解，在随后的方法中实现监听处理即可。

```java
@OnClick(R.id.submit)
public void submit(View view) {
  // TODO submit data to server...
}
```

监听器的所有参数都是可选的

```java
@OnClick(R.id.submit)
public void submit() {
  // TODO submit data to server...
}
```

定义一个其他的类型，Butter Knife 也能够识别，并进行自动 Cast

> 为了尽量避免 Cast，所以应该尽量少使用这一种模式

```java
@OnClick(R.id.submit)
public void sayHi(Button button) {
  button.setText("Hello!");
}
```

自定义的组件可以通过不传入 id 来实现监听器绑定

```java
public class FancyButton extends Button {
  @OnClick
  public void onClick() {
    // TODO do something!
  }
}
```

还可以绑定多个控件到同一个事件监听器上

```java
@OnClick({ R.id.door1, R.id.door2, R.id.door3 })
public void pickDoor(DoorView door) {
  if (door.hasPrizeBehind()) {
    Toast.makeText(this, "You win!", LENGTH_SHORT).show();
  } else {
    Toast.makeText(this, "Try again", LENGTH_SHORT).show();
  }
}
```

### 2.3 取消绑定

这个步骤通常在 Fragment 的使用中出现，由于 Fragment 的生命周期和 Activity 不同，我们可能需要在 `onCreateView()` 中构建视图，然后在 `onDestroyView()` 中将视图进行销毁。
这时候，我们就需要在 `onDestroyView()` 中将视图取消绑定

```java
public class FancyFragment extends Fragment {
  @Bind(R.id.button1) Button button1;
  @Bind(R.id.button2) Button button2;

  @Override public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
    View view = inflater.inflate(R.layout.fancy_fragment, container, false);
    ButterKnife.bind(this, view);
    // TODO Use fields...
    return view;
  }

  @Override public void onDestroyView() {
    super.onDestroyView();
    ButterKnife.unbind(this);   // 在这里取消绑定
  }
}
```

### 2.4 可选的绑定

在默认情况下， `@Bind` 和监听器的绑定都是需要的，如果目标 View 没有找到的话，Butter Knife 将会抛出一个异常。
可以通过设置 `@Nullable` 注解来取消这个绑定

> 注意，`@Nullable` 注解来源于 Android 的 `support-annotations` 库

```java
@Nullable @Bind(R.id.might_not_be_there) TextView mightNotBeThere;

@Nullable @OnClick(R.id.maybe_missing) void onMaybeMissingClicked() {
  // TODO ...
}
```

### 2.5 对于多个方法的监听器绑定

当一个监听器拥有多个回调方法时，使用 `callback` 参数来指定所需要绑定的回调方法

```java
@OnItemSelected(R.id.list_view)
void onItemSelected(int position) {
  // TODO ...
}

@OnItemSelected(value = R.id.maybe_missing, callback = NOTHING_SELECTED)
void onNothingSelected() {
  // TODO ...
}
```

<!-- more -->### 2.6 简化的 findViewById()

Butter Knife 同时还提供了一个简化版本的 `findViewById()` —— `findById()`；
用这个方法可以在 `View`, `Acitivity`, `Dialog` 中找到想要的 View；
同时，该方法通过泛型来对返回值进行转换，所以可以省去 `findViewById()` 的强制转换了。

```java
View view = LayoutInflater.from(context).inflate(R.layout.thing, null);
TextView firstName = ButterKnife.findById(view, R.id.first_name);
TextView lastName = ButterKnife.findById(view, R.id.last_name);
ImageView photo = ButterKnife.findById(view, R.id.photo);
```
