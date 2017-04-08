---
title: OSX Mono Halal Installation
date: 2017-04-08
categories: Mono
tags: Mono
---

在开发时，总想保证自己的开发平台得到及时的更新；

但是使用官方安装包的安装不方便进行快速更新，而且安装下来一大堆版本堆积也不够清真。

所以，在这里使用 Homebrew Cask 可以让 mono-mdk 得到及时，清真的安装和更新。


```sh
brew cask install mono-mdk
```

> Homebrew 也有 mono 包，但是不知道为什么那个包一般的软件认不出来

有一点需要注意的地方就是，Visual Studio For Mac Preview 使用的是比较新的 mono，此时我们需要 tap `caskroom/versions` 仓库来获取 mono-mdk 的 preview 版本。

```sh
brew tap caskroom/versions
brew cask install mono-mdk-preview
```
