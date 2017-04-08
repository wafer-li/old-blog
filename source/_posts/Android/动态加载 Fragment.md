---
title: 动态加载 Fragment
date: 2017-04-08
categories: Android
tags: Android
---

## 1. 步骤

### 1.1 获取 `FragmentManager`

- 当位于 `Activity` 时，调用 `getFragmentManager()` 方法即可获取到 `FragmentManager` 实例
- 当位于 `Fragment` 时，调用 `getActivity().getFragmentManager()` 获取 `FragmentManager` 实例
- 如果在 `Fragment` 内层，即 `Fragment` 的 `container` 也是 `Fragment` 时，调用 `getChildFragmentManager()` 来获取 `FragmentManager` 实例

> 注意： `getChildFragmentManager()` 仅用于两层 `FragmentManager` 的时候。如果仅仅只是一层 `Fragment`，那么应该将 `Fragment` 的切换操作回调到 `Activity` 进行

<!-- more -->

```java
// when in the activity
FragmentManager fragmentManager = getFragmentManager();

// when in the fragment
FragmentManager fragmentManager = getActivity().getFragmentManager();

// When in the nested fragment
FragmentManager fragmentManager = getChildFragmentManager();
```

### 1.2 调用 `beginTransaction()` 启动一个事务

这个方法是 `FragmentManager` 的方法

```java
FragmentTransaction transcation = fragmentManager.beginTransaction();

```

### 1.3 将 `Fragment` 加入到容器里面 
我们有两种添加 `Fragment` 的方法， `add()` 和 `replace()`
注意添加的时候带上 `tag` 参数，以方便后面的弹出和返回。

1. 使用 `replace()` 方法

    一般的，我们使用 `replace()` 方法直接替换布局来将 `Fragment` 添加到 容器里面

    ```java
    transaction.replace(R.id.container, fragment, tag);
    ```

    > `replace()` 方法需要指定一个用于替换 `container` 的 `Fragment` 实例，同时还可以给其打上一个 `tag`（`String` 类型的）来方便以后寻找。
    注意，`R.id.container`是 `Activity` 布局中的一个 `layout` 一般不将根布局替换，而是将其内部的一个子布局替换掉。
例如下面的 xml，一般不替换根目录，而是上面的 `<RelativeLayout>`

```xml
    <LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
        android:layout_width="match_parent"
        android:layout_height="match_parent"
        android:fitsSystemWindows="true"
        android:orientation="vertical">

        <include layout="@layout/include_toolbar" />

        <RelativeLayout
            android:id="@+id/container"
            android:layout_width="match_parent"
            android:layout_height="wrap_content"/>


    </LinearLayout>
```

2. `add()` 方法

    另外还有另一种添加 `Fragment` 的方法 `add()`，与 `replace()` 的调用方式相同，将 `replace()` 替换成 `add()` 即可
    一般来说，`add()` 方法的效果和 `replace()` 方法相同，但在一些情况下有所区别。


### 1.4 使用 `commit()` 方法来提交事务

```java
// 用这条语句来提交事务使得事务生效
transaction.commit();

// 当然也可以连着写。
fragmentManager.beginTransaction()
               .replace(R.id.containe, fragment)
               .commit();
```

> 另外，还有一个 `commitAllowingStateLoss()` 方法，关于这个方法和 `commit()` 方法的区别和注意事项，在下面有所介绍


## 2. 补充部分

### 2.1 添加 Fragment 到返回栈

当有需要通过按返回键返回到上一个 Fragment 的时候，可以使用 `addToBackStack(null)` 方法将当前的 Fragment 添加到返回栈中，此时通过按返回键即可回到上一个 Fragment。
`addToBackStack()` 方法还可以接受一个 `tag` 作为参数，添加具有特定 tag 的 Fragment 进入返回栈。

> `Fragment` 的状态是最后离开这个 `Fragment` 的状态，也就是说它会保留最后的 `Fragment` 状态。


### 2.2 `add()` 和 `replace()` 的区别

- `replace()` 方法会**删除当前的 Fragment** 然后加入一个**新的 Fragment**
    - 当前仅会存在一个 `Fragment` 在 `container` 中
    - 此方法会**重新实例化 Fragment**

- `add()` 方法只是添加了一个实例到 container 中，而不会删除当前的 Fragment 实例
    - 当前有可能会存在多个 `Fragment` 在 `container` 中
    - 此方法不会重新实例化 `Fragment`，**当且仅当它没有被系统回收的时候**

- 如何选用这两个方法
    - 一般来说，它们的效果都是一样的，但是为了避免 `Layout` 的冗余，我们一般使用 `replace()`
    - 但是，当你需要在 `Fragment` 的生命周期中启动一个**异步任务**或者加载一些**大量的资源文件**的时候，`replace()` 的重新实例化特性会使得**资源被大量的消耗**，所以在这种情况下，使用 `add()`


### 2.3 提交事务的注意事项

1. `IllegalStateException` 异常

    > 这个异常通常会在 `Activity` 的状态保存之后，尝试去提交（即调用 `commit()` 方法）一个 `FragmentTransaction` 的时候发生，称为活动状态丢失（Activity State Loss）。
    这是由于系统会在活动在被挂起或销毁之前会将其当前状态保留为一个快照（例如用户按下 `Home` 键），但是这个快照并没有将 `FragmentTransaction` 作为活动的一部分保留，而是**将其丢失**了，由于**活动当前被销毁或挂起**，所以无法提交一个 `FragmentTransaction`

    ```
    // 堆栈跟踪和异常代码
    java.lang.IllegalStateException:Can not perform this action after onSaveInstanceState
        at android.support.v4.app.FragmentManagerImpl.checkStateLoss(FragmentManager.java:1341)
        at android.support.v4.app.FragmentManagerImpl.enqueueAction(FragmentManager.java:1352)
        at android.support.v4.app.BackStackRecord.commitInternal(BackStackRecord.java:595)
        at android.support.v4.app.BackStackRecord.commit(BackStackRecord.java:574)
    ```

2. 异常抛出的时间点

    > 异常抛出的时间点通常和 `commit()` 的被调用时间点是一致的，总结为下表

    |注：Honeycomb 即 3.0(API 11) |Honeycomb 之前的版本|Honeycomb 及更新的版本|
    ----|---|----|
    `commit()` 在 `onPause()` 前被调用|	OK|	OK
    `commit()` 在 `onPause()` 和 `onStop()` 执行中间被调用|STATE LOSS(**此时并没有异常**)|	OK
    `commit()` 在 `onStop()` 之后被调用	|EXCEPTION	|EXCEPTION

3. 如何避免异常

    1. 谨慎的在除 `onCreate()` 的其他生命周期函数中提交 `Transaction`
        > 你必须保证 `Acitivity` 被**完全恢复之后**才能提交 `Transaction`。
例如，你不应该在 `FragmentActivity` 的 `onResume()` 方法中提交 `Transactions`，有时候这个方法可能在 `Activity` 被恢复前调用，你应该在 `onPostResume()` 方法中提交，以保证 `Acitivity` 完全恢复

    2. 避免在异步回调函数中提交 `Transaction`
        > 例如，应该避免在 `AsyncTask` 的 `onPostExecute()` 方法和 `LoaderManager.LoaderCallbacks` 的 `onLoadFinished()` 方法中提交 `Transaction`。由于它们都没有考虑到 `Activity` 的实际状态，有可能在 `Activity` 已经被结束之后仍然被调用。

    3. 使用 `commitAllowingStateLoss()` 方法
        > 此方法和 `commit()` 的唯一区别在于，当状态丢失出现的时候，其不会抛出一个异常。
        **通常不应使用这个方法，除非状态丢失无可避免，否则就不应使用此方法**

## 3. Fragment 管理

### 3.1 返回到指定的 Fragment

当我们开启了太多的 `Fragment`，想回到指定的某个 `Fragment` (比如说最开头的那一个) 时，使用 `popBackStack(String tag, int flags)` 通过指定一个 `Fragment` 的 `tag` 来返回到指定的那个 Fragment；

> 第二个 flags 参数用来指定是否要将指定的 Fragment 也 pop 出去，此参数只能有两个值 `POP_BACK_STACK_INCLUSIVE` 或者 `0`，如果指定了 `POP_BACK_STACK_INCLUSIVE` 这个参数，那么就会将指定的 Fragment 也 pop 出去。

注意事项：

1. 一般采用 `tag` 参数来定位一个 `Fragment`

    > 当使用 `add()` 方法添加 `Fragment` 时，因为一个 `ViewGroup` 容器可以依附 `add()` 多个Fragment，它们的 `id` 自然是相同的。

2. `popBackStack(null, FragmentManager.POP_BACK_STACK_INCLUSIVE)` 的真正作用。

    > 这个方法的官方文档似乎有一些错误（或者缺漏）
    由于第二个参数的存在，方法会在返回栈中寻找是否存在一个 `tag` 为 `null` 的 `Fragment`，显然，这是找不到的。
    **所以，这个方法实际上会清空返回栈**

### 3.2 在 Fragment 之间切换

#### 3.2.1 使用 `add() show() hide()` 方法

> `FragmentPagerAdapter` 采用这种模式，需要注意以下几种情况

1. 只是显示和隐藏 `Fragment`，并不进入 `Fragment` 生命周期
2. 当隐藏的时候，`Fragment` 仍然被激活，**依旧会对点击事件作出反应**。

    > 仍然会响应点击事件的原因在于，由于使用的是 add() 方法，所以当前 `container` 会有**多个 Fragment 实例**，然后 `show()` 和 `hide()` **仅仅是将视图隐藏**了，`Fragment` 实例依旧处于激活状态，所以会导致多个 Fragment 都会对点击事件做出响应。我们称为**点击事件的泄露**

    > 此时，需要一些技巧防止点击事件的泄露

    1. 使用 `xml` 截获点击事件

        > 将 **内层 Fragment** 的**根布局**设置为 `clickable="true"` 即可

        ```
        <LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
            android:layout_width="fill_parent"
            android:layout_height="fill_parent"
            android:clickable="true" />
        ```

    2. 使用 `java` 截获点击事件

        > 为**根布局**设置 `OnTouchListener` 并重载一个空方法，返回 `true`

        ```
        @Override
        public View onCreateView(LayoutInflater inflater,ViewGroup container,Bundle savedInstance){
            View root;

            /*here is an implementation*/

            root.setOnTouchListener(new View.OnTouchListener() {
                public boolean onTouch(View v, MotionEvent event) {
                    return true;
                }
            });
            return root;
        }
        ```

3. 解决 `Fragment already added` 错误

    > 在复杂的 `Fragment` 管理中，经常会遇到 `Fragment already added` 错误，所以每次在 `add Fragment` 之前，首先要判断 `fragment.isAdded()` 如果已经存在了那就不用再 `add()` 了

4. 解决由于屏幕旋转或其他原因引起的 `Activity` **重构建**导致 `Fragment` **重复**问题

    > Android 系统中，Activity 可能在**任何时刻**被**不被通知地销毁和重建**，由此则会引起 Fragment 的重叠问题。
    可以通过检查是否存在 Activity 的快照 `savedInstanceState` 来决定是否需要重新构建一个 Fragment 实例。
    如果存在 `savedInstanceState`，则不需要重新构建，只重新显示最后的当前 Fragment 即可

这里是 `add()` `show()` `hide()` 模式的代码：
```java
/**
* This way aims at resolve the following problem
* 1. The reinstantiaiton of Fragment
* 2. The Layout redundancy of multiple Fragment
*/

//Check the Fragment isAdded. Aim to #1
public void switchContent(Fragment from, Fragment to) {

    // The mContent is the current fragment
    if (mContent != to) {
        mContent = to;
        FragmentTransaction transaction = mFragmentMan.beginTransaction().setCustomAnimations(
                android.R.anim.fade_in, R.anim.slide_out);
        if (!to.isAdded()) {    // Judge if is added

            // if not added, hide the current Fragment and add the next to Activity
            transaction.hide(from).add(R.id.content_frame, to).commit();
        } else {
            //if added, just show the next.
            transaction.hide(from).show(to).commit();
        }
    }
}



//Check the saveInstance to avoid the activity reinstance. Aim to #2
@Override
protected void onCreate (Bundle savedInstanceState) {
    if (savedInstanceState == null) {
        getFragmentManager().beginTransaction().add(android.R.id.content,
            new UIFragment(),"Tag").commit();
    } else {
        //if the instance does be recover,
        //use `findFragmentByTag()` to find the reference of the Fragment
        UIFragment fragment1 = getFragmentManager().findFragmentById(R.id.fragment1);
        UIFragment fragment2 = getFragmentManager().findFragmentByTag("tag");
        UIFragment fragment3 = ...
        ...
        //show one of them
        getFragmentManager().beginTransaction()
        .show(fragment1)
        .hide(fragment2)
        .hide(fragment3)
        .hide(...)
        .commit();
    }
}
```

## 3.2.2 使用 `replace()` 方法

> `FragmentStatePageAdapter` 采用这种模式

- 当前**只会存在一个 fragment 实例**，简单的使用 `replace()` 和 `popBackStack()` 的重载方法即可在 `Fragment` 之间进行切换

- 但是由于此方法在切换时**每次都会重新构建 Fragment 实例**，如果需要从网络加载资源的话，会造成很多的网络流量损失和性能浪费。


## 3.2.3 比较和使用场景
- 如果管理 `Fragment` 的开销比网络流量的开销要大，使用 `replace()` 方法较好。

    > 例如每次仅仅加载 几个k 或 几十b 的数据，就没有必要为了这点微不足道的流量节省从而进行复杂的 `Fragment` 管理，一是加大开发难度，二是容易出现错误。

- 如果在 Fragment 中需要加载大量的网络资源，或者进行十分耗时的资源加载工作（比如3D绘图），那么就应使用 `add()` `show()` `hide()` 方法
