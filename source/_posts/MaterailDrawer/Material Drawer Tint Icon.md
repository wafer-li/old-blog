---
title: Material Drawer Tint Icon
date: 2017-04-08
categories: MaterailDrawer
tags: MaterailDrawer
---

Material Drawer 是 GitHub 上有名的 Android Navigation Drawer 的实现库，目前有 6000 左右个星，充分说明它的流行和稳定性。

这里来说说它的 Account Header 的 Profile Icon 的染色问题。

目前，对于透明背景的图片，Profile Item 不会对背景进行染色；这样就可能导致在有背景图的时候，对于这种 Icon 有看不清的问题。

作者对此表示不想修复，于是提供了一个 workaround 进行图片的染色。

以下的 Kotlin 就是对一个默认的用户图标进行染色，然后返回染色后的 `Drawable` 的代码

```kotlin
fun getTintDefaultProfileIcon(activity: Activity): LayerDrawable {

    val res = activity.resources

    val background = ShapeDrawable()
    background.paint.color = res.getColor(R.color.default_icon_bg, activity.theme)

    val icon = res.getDrawable(R.drawable.default_user_icon, activity.theme)

    return LayerDrawable(arrayOf(background, icon))
}
```
