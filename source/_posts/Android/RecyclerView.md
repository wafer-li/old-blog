---
title: RecyclerView
date: 2017-04-08
categories: Android
tags: Android
---

## 1. 一般的使用

<!-- more -->### 1.1 添加编译依赖

```
compile 'com.android.support:recyclerview-v7:+'
```

### 1.2 界面的基本设置

1. 将 RecyclerView 加入到 `layout.xml`

    > `layout.xml` 指的是 `Activity` 或者 `Fragment` 的布局

    ```xml
<android.support.v7.widget.RecyclerView
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:id="@+id/recycler"
    android:scrollbars="vertical"/>

    <!-- Must define the scrollbars attr -->
    ```


2. 新建一个 `item_layout.xml` 用于 `item` 的界面

    ```xml
    <?xml version="1.0" encoding="utf-8"?>
    <LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
        android:orientation="vertical"
        android:layout_width="match_parent"
        android:layout_height="wrap_content">

    <TextView
        android:layout_width="match_parent"
        android:layout_height="match_parent"
        android:id="@+id/quest_item" />

    </LinearLayout>
    ```

    > 注意，在 `support-library 23.2.0` 之后，`LayoutManager` 提供了**自动调整**功能，所以对 `item` 的根布局应采用 `wrap_content` 的 `layout_hight`

<!-- more -->### 1.3 设置 **LayoutManager** 和 **Adapter**

```java
@Override
public View onCreateView(LayoutInflater inflater, ViewGroup parent, Bundle savedInstanceState) {

    View v = inflater.inflate(R.layout.fragment_recyclerview, parent, false);

    //set the Recycler
    mRecyclerView = (RecyclerView) v.findViewById(R.id.recycler_view);

    //set LayoutManager
    mRecyclerView.setLayoutManager(new LinearLayoutManager(getActivity()));

    //DataSet
    mCrimes = CrimeLab.get(getActivity()).getCrimes();

    //set the Adapter
    mRecyclerView.setAdapter(new CrimeAdapter());

    return v;
}
```

### 1.4 定义 Adapter 和重载方法

你需要自定义一个自己的 `MyAdapter` 并继承 `Adapter`
注意以下几点：

1. Adapter 储存着数据的集合，还有一个作为内部类的 `ViewHolder`

    ```java
public class MyAdapter extends RecyclerView.Adapter<MyAdapter.ViewHolder> {

    //The DataSet
    private List<Object> mDatas;
    //...other stuff

    //The inner ViewHolder
    class MyViewHolder extends Recycler.ViewHolder {
        //The views
        public TextView textView;

        //The Ctor is Auto-Generate
        public MyViewHolder (View itemView) {
            super(itemView);
            //Just set the view as the @param is Ok
        }
    }
}
    ```

2. 重载方法的使用

    ```java
    @Override
    public MyViewHolder onCreateViewHolder(ViewGroup parent, int ViewType) {
        // Build a ViewHolder which is the inner class, and return it

        /**
        * Notice: The ViewType is use to build the diffirent ViewHolder
        * to display diffirent ViewHolder
        */
        return new MyViewHolder(mLayoutInflater.inflate(R.layout.item_text, parent, false));
    }

    @Override
    public void onBindViewHolder(MyViewHolder holder, int position) {
        // Bind the view with the DataSet
        // Just like the getView() method in ListView
        // But it's more easier

        holder.mTextView.setText(mData[position]);

    }

    public int getItemCount() {
        // Return the amount of item
    }
    ```

## 2. 多 Item 布局实现

使用 `getItemViewType(int position)` 方法来获取每个 `position` 的 `ViewType`

> RecyclerView 中取消了 `getItemViewTypeCount()` 方法

例如：

```java
@Override
public int getItemViewType(int position) {
    return position % 2 == 0 ? ITEM_TYPE.ITEM_TYPE_IMAGE.ordinal() :
    ITEM_TYPE.ITEM_TYPE_TEXT.ordinal();
}
```

然后使用 `onCreateViewHolder()` 中的 `int ViewType` 属性来判别构建的 View 类型。

<!-- more -->## 3. 设置 OnItemClickListener

> 官方并没有为 RecyclerView 实现一个 OnItemClickListener，所以只能由开发者自行实现

一般来说，我们使用回调来实现这个监听器
需要注意的是，官方并没有为 Item 实现一个点击的 feedback 动画（至少在 5.1.1(API 22)中），所以我们需要添加一个 `<ripple>` 的 `drawable ` 然后将其设置为背景来实现一个点击回馈的效果。


### 2.1 定义一个 Listener 接口

通常作为 Adapter 的一个内部类

```java
public interface OnItemClickListener {

    /**
    * This is the callback method.
    * Aimed to notify the context the Click Event.
    * To modify UI, also need to pass the position for UI updating or do othertings
    */
    void onItemClick (View view, int position);
}
```

### 2.2 为 Adapter 添加接口成员

```java
class MyAdapter ... {
    private OnItemClickListener mOnItemClickListener;

    public void setOnItemClickListener(OnItemClickListener mOnItemClickListener) {
        this.mOnItemClickListener = mOnItemClickListener;
    }
}
```

### 2.3 设置点击响应并将其回调

这里在 `onBindViewHolder()` 中设置 `ViewHolder` 中 `View` 的 `onClick()` 事件，并将这个事件回调到上面的接口成员中。

```java
public void onBindViewHolder (final MyViewHolder holder, final int position) {
    // Bind the View with Data
    holder.textView.setText(mDatas.get(position));

    // Set the Listener
    // Notice: if the callback was set,
    // then set the Click Event for the ViewHolder
    if(mOnItemClickLitener != null) {
        holder.textView.setOnClickListener (new OnClickListener() {
            @Override
            public void onClick (View v) {
                int pos = holder.getLayoutPosition();
                // Call the callback method
                mOnItemClickListener.onItemClick(hodler.textView, pos);
            }
        });
    }
}
```

### 2.4 在 Acitivity 或者 Fragment 中响应回调

注意，这个方法是在 Fragment 中进行的。

```java
@Override
public void onCreateView(...) {
    mAdapter.setOnClickListener (new OnItemClickListener() {
        @Override
        public void onItemClick(View v, int position) {
            //Update UI or execute some operation
        }
    })
}
```
