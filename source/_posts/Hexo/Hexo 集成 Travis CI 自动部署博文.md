---
title: Hexo 集成 Travis CI 自动部署博文
date: '2018-01-11 21:37'
tags:
  - Hexo
  - Trivas CI
categories:
  - Hexo
---

这个想法是我在折腾 Hexo Next 6.0 的时候发现的，有位仁兄在 Next 的新 repo 问如何处理 CI 问题，受到他的启发，我就开始折腾使用 Travis CI 进行博客的自动部署了。

<!-- more -->

## 1. 为什么要用 CI 来部署博客

遇到一项新技术，一个好习惯就是问一下自己 **为什么要用这个新技术**，它带来了什么好处，解决了什么问题？否则就会陷入为了使用新技术而使用新技术的陷阱之中。

那么为什么要用 CI 来部署呢？好处是显而易见的：

在未采用 CI 的时候，编写完博客总需要自己手动 `hexo g -d`，这种工作是重复性的、枯燥的，那么就应当尽量寻找让重复性的工作进行自动化的方法；

在使用 CI 之后，我只需要执行 `git push`，将博客的 markdown source 推到远端仓库，剩下的静态页面构建过程就由 CI 接手进行，而不需要我手动打字，而且还占用我的 CPU。

这虽然方便，但是不禁会有人担心：如果每 push 一次就会自己构建，博客会不会因为 push 上去了一些不好的东西而搞炸了？

其实这种担心是多余的，只需要在进行了大面积更改的时候先在本地查看一下，如果没有问题就再 push 就行了，这时候虽然需要本地生成，但是你不可能整天重构你的博客，所以 CI 的效率提升还是存在的。


## 2. Travis CI 的配置流程

本博客采用 Travis CI 作为持续集成工具，下面就介绍一下基本的配置流程。

由于 Travis CI 比较流行，注册和关联 repo 这种操作就不介绍了。

### 2.1 获取 Access Token

在做任何配置之前，我们首先要获取一个 Access Token，否则 Travis CI 即使生成了 HTML 也无法 push 到 master 分支进行部署。

GitHub 获取 Access Token 的步骤如下：

```
Settings -> Developer settings -> Personal access token
-> Generate new token
```

接着就进入创建 Access Token 的页面了，对于一个博客的 CI 来说，我们需要的权限比较少，我尝试了一下只需要 `public_repo` 的权限即可；

为了尽量保证我们 GitHub 帐号的安全，能少给权限就少给。

然后我们选择生成，此时会返回到 `Personal access token` 的页面，并显示我们刚才生成的 access token。

> 需要注意的是，这个 access token **只会在这一个页面显示一次**，切记要复制下来，否则就只能 **重新生成**。

然后我们到博客 repo 的 Travis CI 设置页面中新建一个环境变量，将这个 Access Token 粘贴到环境变量的 value 中。

> 这里要注意一定要关掉 `Display in log` 的选项，否则你的 Access Token 就泄漏了。

### 2.2 只构建含有 `.travis.yml` 文件的分支

对于本博客而言，我采用单 repo 双分支管理，即一个 `source` 分支保存原始的 markdown 文件，另一个 `master` 分支保存用于部署的 HTML。

对于这种情况，我们就 **必须要** 在 Travis CI 的 **repo 设置页面** 中勾选 **只构建含有 `.travis.yml` 文件的分支**；

由于 Travis CI 会侦听 commit 事件进行自动构建，而对于 master 上的 commit，是不含有 `.travis.yml` 文件也不需要构建的。

为了防止 Travis CI 构建 master 分支，我们就必须要勾选这个选项。

有些教程提到使用

```yml
branches:
    only:
        - source
```

也可以起到只构建 `source` 的功能；
不过在我这里这种方法行不通，最后还是使用了只构建含有 `.travis,yml` 文件的方法。

### 2.3 `.travis.yml` 文件的基本配置

本博客使用的 Hexo 框架是采用 Node.js 技术编写的，所以可以直接套用 Node.js 的 Travis CI 流程。

下面是一些基本的 Node.js `.travis.yml` 的配置

```yml
# 环境变量，注意一个 item 就会构建一次
# 所以一次构建中需要多个环境变量的，也要写到一行里
env:
    - ENV_1=xxxxxx ENV_2=yyyyyy

language: node_js   # 构建的编程语言
node_js: node       # Node.js 的版本，node 表示最新版

# 缓存的目录
# Node.js 项目一般缓存 node_modules
# 用于加快构建速度
cache:
  directories:
    - "node_modules"

# 在 install 阶段之前执行的命令
before_install:

# Install 阶段，在这里是 npm install
install: npm install

# 在 script 之前执行的命令
before_script:

# Script 阶段，执行 hexo 相关命令
script:
    - hexo clean
    - hexo g -d --config source/_data/next.yml
```

在拥有 `.travis.yml` 文件后，每次 commit 之后 Travis CI 就会读取这个文件用来进行自动化构建工作

## 3. 相关的坑

当然，Travis CI 的配置不可能这么一帆风顺，还存在着非常多的坑。

下面就来介绍一下我所遇到的坑，希望给大家以前车之鉴。

### 3.1 Git Submodule 的坑

如果你的 GitHub 使用了两步验证，那么你平时肯定是使用 ssh 的地址进行 git 的相关操作；

但是对于 Travis CI 的虚拟机来说，它不具备你的 SSH key，当然也就不能使用 ssh 地址进行 clone 和 push。

特别是对于 git submodule，由于 Travis CI 自己可以处理 https 地址的 submodule，但是如果采用 ssh 方式，它根本就无法 clone 下来。

此时，我们就需要自己手动管理 git submodule，在 `.travis.yml` 中增加如下选项：

```yml
git:
    submodules: false

before_install:
    - sed -i 's/git@github.com:/https:\/\/github.com\//' .gitmodules
```

上面的 `sed` 命令就是将 ssh 地址替换成 https 地址的。

不过，对于后面的部署阶段，由于要 push 到自己的仓库，所以 deploy 的地址需要修改为 `https://<username>:<ACCESS_TOKEN>@github.com/<username>/repo.git`

所以，如果使用 `hexo-deploy` 插件的话，还需要以下的命令：

```yml
before_script:
    - sed i "s/git@github.com:/https:\/\/yourusername:${ACCESS_TOKEN}@github.com\//" you_config_file.yml
```

把上面的 `yourusername` 和 `your_config_file.yml` 作出相应修改即可。

### 3.2 安装某些额外程序包

如果你使用 `hexo-all-minifier` 来进行 HTML 的相关文件压缩，那么你就需要额外安装一个系统程序包 `nasm`。

Travis CI 对此推出了 `addons` 选项来方便你配置：

```yml
addons:
  apt:
    packages:
        - nasm
```

这个问题比较难暴露，我查看了很久的 log，最后在 `npm install` 的 log 里面发现了某个依赖没办法安装；

最后才发现是缺了一个系统的程序包。

### 3.3 Patch 某些 Hexo 插件

有时候你使用的 Hexo 插件有些问题，虽然有人提出了 PR，但是久久没有合并；

在本地生成的时代，你需要自己手动 patch 这个插件，然而我们现在使用 CI，当然不可能由你进去复制粘贴。

这时候，我们可以使用 `curl` 把 patch 文件下载下来，并覆写相关文件。

通过下面的命令可以进行覆写操作：

```bash
curl {raw-path-file-url} >| {problem_file}
```

其中 `>|` 符号可以使后面的文件清空，类似于文件操作的 `w` 选项。

### 3.4 安装 Hexo Next 主题的插件

Hexo Next 在 6.0 之后，把一些原本在 `source/lib` 中的 js 文件移到了新的 repo 中，以减少 next 本身 repo 的复杂度。

但是由于 Next 把 `source/lib` 这个路径 ignore 了，所以我们要手动将插件 clone 到 `source/lib` 里面。

在使用 CI 时，我们需要在 `hexo g -d` 之前将插件装好：

```yml
before_script:
  ## Theme Dependencies
  - cd themes/next-reloaded
  # canvas-nest
  - git clone https://github.com/theme-next/theme-next-canvas-nest source/lib/canvas-nest
  # fancybox3
  - git clone https://github.com/theme-next/theme-next-fancybox3 source/lib/fancybox
  # reading_progress
  - git clone https://github.com/theme-next/theme-next-reading-progress source/lib/reading_progress
  - cd ../..
```

这里需要注意一下当前工作路径的问题，记得切换回原目录。

## 4. 总结

经过一段时间的奋战，Travis CI 的集成终于做好了；
虽然花费了点时间，不过在折腾的过程中还接触了一下 Travis CI 的配置流程，想必还是有些收获的；

要不人们总说折腾博客比写博客有趣呢？
