---
title: "Hexo Experience"
date: "2017-04-09 01:56"
categories: "Hexo"
tags: ["Hexo", "Blog"]
---

## 1. 简介

这是我折腾 Hexo 博客框架的经验；

希望能给后来者以启迪。

<!-- more -->

## 2. 我所需要的功能

虽然，现今，网上已经很多教你如何一步一步地搭建 Hexo 博客，也有很多人踩过很多坑；

不过，对于我的一些要求，仍然有很多的方面未能解决。

我主要需要的功能一共有四个：

1. 数学公式渲染
2. PlantUML 图
3. TODO List
4. Footnotes

## 3. 数学公式渲染

这个倒是有很多人发了很多博客，然后也解决了一些问题。

主要就是 [`hexo-renderer-marked`](https://www.npmjs.com/package/hexo-renderer-marked) 中，把 MathJax 中的 `_` 解析渲染成了斜体；

这样，就造成了解析错误；

同时，对于多行的数学公式，也存在很多问题。

经过一番倒腾，我的最终决定是使用 [`hexo-renderer-karmed`](https://www.npmjs.com/package/hexo-renderer-kramed) 代替原先官方自带的 [`hexo-renderer-marked`](https://www.npmjs.com/package/hexo-renderer-marked)

对于另外的渲染器，它们主要的缺点有：

- [`hexo-renderer-pandoc`](https://www.npmjs.com/package/hexo-renderer-pandoc) 过于沉重
- [`hexo-renderer-markdown-it`](https://www.npmjs.com/package/hexo-renderer-markdown-it) 不支持 NexT 主题的 『Read More』

所以，最后选择使用 [`hexo-renderer-karmed`](https://www.npmjs.com/package/hexo-renderer-markdown-it)；

不过这个插件在某些时候也存在问题；

在[这里](http://xudongyang.coding.me/math-in-hexo/)有一个 workaround


## 4. PlantUML

平时我主要使用的 UML 绘图工具就是这个；

主要是因为我用 Atom 上面的 `markdown-preview-enhanced` 能够实时展现 PlantUML 图。

Hexo 插件列表中，也存在一个 PlantUML 的插件，`hexo-tag-plantuml`；

不过这个是 `tag` 插件，如果使用这个的话，我就需要使用标签来定义 UML；

而不能使用 markdown 原生的 code fence；

此时，我的 `markdown-preview-enhanced` 也会不起作用；

所以就只能自造轮子：自己实现了一个 `filter` 插件，用来将 code fence 转换成 PlantUML 图。

插件源码在[这里](https://github.com/wafer-li/hexo-filter-plantuml)

## 5. TODO List

这个是比较神奇的：

之前选择的 `kramed` 没有这个功能，而 `marked` 有这个功能；

不过幸好代码量不多，可以直接将 [PR](https://github.com/hexojs/hexo-renderer-marked/pull/32) 中的改动合并到 `kramed` 中。

## 6. Footnotes

这个实际上是一个 Reference 的功能；

这个是目前最容易而且也没有坑的；

直接安装 [`hexo-reference`](https://www.npmjs.com/package/hexo-reference) 插件即可。

## 参考链接

[Goon X 的 Hexo 合集](http://ijiaober.github.io/categories/hexo/)

[如何处理Hexo和MathJax的兼容问题](http://2wildkids.com/2016/10/06/%E5%A6%82%E4%BD%95%E5%A4%84%E7%90%86Hexo%E5%92%8CMathJax%E7%9A%84%E5%85%BC%E5%AE%B9%E9%97%AE%E9%A2%98/)
