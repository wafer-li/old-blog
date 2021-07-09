---
title: windows 自动更新走代理
date: 2016-10-14
tags: 
    - Proxy
    - 各种折腾
---

本部校园网 v4 收费，windows 更新又是刚需，那么如何让 windows 自动更新走代理呢？

其实只需要一条命令

```bash
netsh winhttp set proxy proxy-server="proxyserver:8080"
```

<!-- more -->

即可让 windows 的“设置”走代理。

**注意，设置中的代理选项对其本身是不起作用的。**

这点还是 *nix 好啊。

当然，也有想要直连的时候，使用如下命令即可恢复直连

```bash
netsh winhttp reset proxy
```
