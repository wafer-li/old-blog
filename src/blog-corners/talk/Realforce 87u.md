---
title: Realforce 87u
date: '2017-04-11 13:28'
tags:
  - 键盘
  - Realforce
  - 杂谈
category: 杂谈
---

最近终于下定决心来买这个键盘了。

主要说说使用感受吧

2018/1/8 更新部分内容

<!-- more -->

## 1. 手感

我买的这个是静音版，手感介于红轴和茶轴之间，就是稍微软一点的茶轴，按起来有种噗噗的感觉；

显然，打击感是一点也没有了，不过真的有种揉胸的感觉。

不过这个键盘的优点在于：由于是分区压力，所以能极大地缓解小拇指的压力；

之前我用的 filco 青轴，最后有 40% 的概率用小拇指打不出 shift 按键；

这也是为什么我要买一个新键盘的原因。

## 2. 特色功能

Realforce 87u 有个特色功能，就是把没有什么卵用的 Scroll Lock 变成了 NumLock；

也就是说，这个键盘有 **小键盘** 的功能！

这是我在 87 键盘上从来没有见到过的。

不过在 Mac 上，这个 NumLock 就失效了；

> 2018/1/8 补充：
> **可惜的是，自从升级到 High Sierra 之后下面的方法就不管用了**
> **不过吧，反正我也不怎么用这个小键盘，先就这样吧。**

需要使用 Karabiner 进行键位修改。

首先下载 Karabiner，这里有个小问题就是 `brew cask` 会报 `Operation not permitted` 的错误；

所以最好还是自己下载镜像安装为好。

随后点击 `Open private.xml`：

![](https://ww1.sinaimg.cn/large/006tNbRwly1feindhtm6kj318g0zoagn.jpg)

然后加上一条自定义配置[^1]：

[^1]: [https://www.zhihu.com/question/39522431/answer/81753723](https://www.zhihu.com/question/39522431/answer/81753723)

```xml
<item>
    <name>Map Realforce Numlock to OSX Numlock function</name>
    <identifier>private.pc_numlock_to_mac_numlock</identifier>
    <autogen>__KeyToKey__ KeyCode::KEYPAD_CLEAR, KeyCode::VK_IOHIKEYBOARD_TOGGLE_NUMLOCK</autogen>
</item>
```

最后再到 `Change Key` 启用就可以了。

![](https://ww3.sinaimg.cn/large/006tNbRwly1feingd0pg8j30ts06qabi.jpg)

## 3. 缺点

目前遇到的缺点只有一个：

就是它的导线槽太紧了，几乎是死死卡住键盘的线缆；

结果我摆弄的时候需要用很大的力气才能把线弄出来，希望以后不要弄烂为好；

> 小贴士：弄的时候长痛不如短痛，直接一个猛劲可以更快的减轻线缆的损伤

其次就是居然不配理线用的尼龙扎带，差评！

## 4. 为什么不买 HHKB

不喜欢 HHKB 的配列。

我就爱用 `Caps Lock` 🙃

## 5. 总结

如果你很喜欢用青轴，很享受用青轴的打击感，请直接买青轴，静电容不适合你；

如果你用青轴感觉到力不从心，但是钱不够，请买茶轴或者红轴；

如果你有点闲钱，而且比较有意向打造一个良好的打字环境，那么可以考虑买一个静电容；

最后来一张玉照：

![](https://ww3.sinaimg.cn/large/006tNbRwly1feinxuuro5j31kw23ve83.jpg)

## 6. 补充

上传一张 Switch 的说明书，说不定以后会用到。

![](https://ws3.sinaimg.cn/large/006tNc79ly1fn953gfiazj31kw2t5h2v.jpg)
