---
title: Genymotion Problems & Solutions
date: 2017-04-08
categories: Android
tags: Android
---

## 0. 简介

这里是一些 Genymotion 安卓模拟器的问题解答集
虽然这个工具很出名，但是由于它使用 VirtualBox 来实现一个 x86 的虚拟机，
它在 Windows 上就显得有些烦人（和反人类）

<!-- more -->## 1. Unable connect to virtual_device

当这个错误发生的时候，Genymotion 会让你在 VirtualBox 里面启动你的安卓虚拟机。请遵循这个执行，然后你就会获取到一个出错信息

这里有一些已知的情况：

### 1.1 Virtual Host Error

如果你收到了一个关于 Virtual Host 的出错信息，那它将会像这样子：

    Failed to open/create the internal network 'HostInterfaceNetworking-VirtualBox Host-Only Ethernet Adapter' (VERR_INTNET_FLT_IF_NOT_FOUND).
    Failed to attach the network LUN (VERR_INTNET_FLT_IF_NOT_FOUND).

解决办法：

解决办法很简单，根据这个 [stackoverflow](http://stackoverflow.com/questions/33725779/failed-to-open-create-the-internal-network-vagrant-on-windows10) :

1. 打开 Windows 网络与共享中心
2. 点击**更改适配器设置**
3. 右键 VirtualBox 建立的 VirtualBox Host only adapter

    > 这个通常可以在 VirtualBox 的你的虚拟机选项中的网络选项查看。
    也可以从 VirtualBox 的设置 -> 网络中查看

4. 点击**属性**
5. 勾选 "VirtualBox NDIS6 Bridged Networking driver"
6. 禁用并重新启用这个适配器

![Solution for Virtual Host Error](http://i.stack.imgur.com/Tkkws.png)

> When this error occurs, genymotion will ask you to start the virtual device on VirtualBox, plase follow the instruction, and then you will get a ERROR message.


## 2. 虚拟机链接不上网络

这个有时会让人挺困惑——“为什么我的虚拟机连不上网络呢？”

解决办法：

其实并不是什么大事，在虚拟机中打开 wifi 选项，然后**直接连接里面的 wifi** 即可

> 它**不会连接到真实的 wifi**，而仅仅是虚拟网络
