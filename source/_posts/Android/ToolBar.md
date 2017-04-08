---
title: ToolBar
date: 2017-04-08
categories: Android
tags: Android
---


## 1.  使用

<!-- more -->###  1. 1 定义风格

在使用 Toolbar 之前，我们首先要对其风格进行一些调整。

1. 使用 `AppTheme.Base` 进行一些方便的全局设定

	> 5.0(API 21) 之后，Google 发表了 Material Design，由于和之前的风格有很大的不同， Google 采用了两个文件—— `res/values/style.xml` 和 `res/values-v21/style.xml`


```xml
<resources>

  <!-- Base application theme. -->
  <style name="AppTheme" parent="AppTheme.Base">
  </style>

  <style name="AppTheme.Base" parent="Theme.AppCompat">
    <!-- 取消 ActionBar，使用 ToolBar 来代替 ActionBar -->
    <item name="windowActionBar">false</item>

	<!--
		用这条语句来防止复制粘贴时把 ToolBar 挤下去的问题；
		两句只能选一句来使用
	-->
    <!-- 编译 API 低于 22 时，使用下面这条 -->
    <del><item name="android:windowNoTitle">true</item></del>
    <!-- 使用 API Level 22 编译的话，使用下面这条 -->
    <item name="windowNoTitle">true</item>
  </style>

</resources>
```

### 1.2 添加组件到界面

在 `Activity` 或 `Fragment` 的布局 xml 文件中添加 Toolbar 控件

```
<android.support.v7.widget.Toolbar
  android:id="@+id/toolbar"
  android:layout_height="?attr/actionBarSize"
  android:layout_width="match_parent" >

</android.support.v7.widget.Toolbar>
```

注意采用 `support v7` 包的 `toolbar` 否则只有 **API 21** 以后的版本才能使用，即不兼容 4.0


<!-- more -->### 1.3 自定义颜色等其他属性

在上述的两个 style 文件中设定你想要的 Toolbar 的各种属性。添加属性时，在 `<style>` 下添加一个 `<item>` 即可。

例如：

```xml
<style name="AppTheme.Base" parent="Theme.AppCompat">
  <item name="windowActionBar">false</item>
  <item name="android:windowNoTitle">true</item>
  <!-- Actionbar color -->
  <item name="colorPrimary">@color/accent_material_dark</item>
  <!--Status bar color-->
  <item name="colorPrimaryDark">@color/accent_material_light</item>
  <!--Window color-->
  <item name="android:windowBackground">@color/dim_foreground_material_dark</item>
</style>
```

可以设定的属性有：

- `App bar` :  即原来 `ActionBar` 的底色，通过添加 `colorPrimary` 属性即可。
- `navigationBarColor` : 此为导航栏底色，仅在 **API 21 以上** 才有效, 必须设置在 `res/values-v21/style.xml` 中
- `windowBackground` : 主视窗底色。

![Style](http://www.jcodecraeer.com/uploads/20141118/14162849281137.png)


### 1.4 设置控件

 一般来说 ，`Toolbar` 有以下控件

![Component](http://www.jcodecraeer.com/uploads/20141118/1416285884351.png)

有关的代码如下，文件为 `Activity` 的对应 `.java` 文件 `MainAcitivity.java`

```java
Toolbar toolbar = (Toolbar) findViewById(R.id.toolbar);

// App Logo
toolbar.setLogo(R.drawable.ic_launcher);
// Title
toolbar.setTitle("My Title");
// Sub Title
toolbar.setSubtitle("Sub title");

setSupportActionBar(toolbar);

// Navigation Icon 要设定在 setSupoortActionBar 之后才有作用
// 否則會出現 back button
toolbar.setNavigationIcon(R.drawable.ab_android);
```

菜单部分：

1. 先在相应的`menu` 文件设置`MenuItem` `res/menu/menu_main.xml`

	```xml
	<menu xmlns:android="http://schemas.android.com/apk/res/android"
	      xmlns:app="http://schemas.android.com/apk/res-auto"
	      xmlns:tools="http://schemas.android.com/tools"
	      tools:context=".MainActivity">

	  <item android:id="@+id/action_edit"
	        android:title="@string/action_edit"
	        android:orderInCategory="80"
	        android:icon="@drawable/ab_edit"
	        app:showAsAction="ifRoom" />

	  <item android:id="@+id/action_share"
	        android:title="@string/action_edit"
	        android:orderInCategory="90"
	        android:icon="@drawable/ab_share"
	        app:showAsAction="ifRoom" />

	  <item android:id="@+id/action_settings"
	        android:title="@string/action_settings"
	        android:orderInCategory="100"
	        app:showAsAction="never"/>
	</menu>
	```

2. 在 `java` 文件中设定 `OnMenuItemClickListener`

	```java
	private Toolbar.OnMenuItemClickListener onMenuItemClick = new Toolbar.OnMenuItemClickListener() {
		@Override
		public boolean onMenuItemClick(MenuItem menuItem) {
			String msg = "";
			switch (menuItem.getItemId()) {
				case R.id.action_edit:
					msg += "Click edit";
					break;
				case R.id.action_share:
					msg += "Click share";
					break;
				case R.id.action_settings:
					msg += "Click settings";
					break;
			}

			if(!msg.equals("")) {
				Toast.makeText(MainActivity.this, msg, Toast.LENGTH_SHORT).show();
			}
			return true;
		}
	};

	// 将 Listener 传给设置方法
	// 其实也可以使用匿名类构造
	toolbar.setOnMenuItemClickListener(onMenuItemClick)
	```

	> 需要注意的是，`setOnMenuItemClickListener()` 需要在 `setActionBar()` 或 `setSupportActionBar()` 之后才能生效

<!-- more -->## 2. 动态加载

这里所指的是 在使用 `Fragment` 时，由于不同 `Fragment` 可能需要不同的 `ActionBar` 标题或者其他组件，由此产生的动态加载问题。


### 2.1 动态更改标题

当 `Title` 需要根据 `Fragment` 的内容进行动态加载，**不要直接使用 Toolbar 的** `setTitle()`，而应该使用 `getActionBar()` 来进行标题更改。

> 由于 Android Studio 会自动产生 Warning，认为 `getActionBar()` 有可能返回一个空值，可以使用 `assert` 来进行断言，说明其不会返回 `null`

```java
// 此处断言用于取消 Warnning，
// 但必须保证已经 setActionBar(toolbar);
assert getActionBar() != null;
getActionBar().setTitle("需要的标题");
```

### 2.2 动态加载 MenuItem

需要动态加载 `MenuItem` 时，应该在各个 `Fragment` 重载 `onCreateOptionsMenu()` 方法。

```java
@Override
public void onCreateOptionsMenu(Menu menu, MenuInflater inflater) {
        inflater.inflate(R.menu.pictrue_list, menu);
        super.onCreateOptionsMenu(menu,inflater);
}
```
同时，需要在 `Fragment` 的 `onCreate()` 方法中添加 `setHasOptionMenu(true)`，指明 `Fragment` 应显示菜单并对菜单进行响应。

```java
@Override
public void onCreate(Bundle savedInstanceState) {
    // TODO Auto-generated method stub
    super.onCreate(savedInstanceState);
    setHasOptionsMenu(true);    // 必须添加，否则无法显示 menu
}
```

需要注意的是， **`Fragment` 会自动继承 `Activity` 已经 inflate 的 `MenuItem`**，所以如果 `Fragment` 需要一个全新的 `MenuItem` 那就最好**重新 inflate 新的 xml**。

> 否则，MenuItem 将会重复出现，而且其点击事件也会同时在 `Activity` 和 `Fragment` 中得到响应
