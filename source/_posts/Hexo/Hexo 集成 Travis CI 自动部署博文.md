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

### 2.1 获取相关权限

在配置和使用 Travis CI 之前，我们首先要做的就是为 Travis CI 获取其所需要的权限。

当然，获取所需要的权限有很多种方法，这里推荐两种，分别为 Access Token和 Deploy Key

这两种各有好处，Deploy Key 的好处在于安全性比较高，Access Token 的好处是较为灵活。

下面每种都写了推荐使用的 repo，你可以根据你的 repo 的实际情况来选择。

#### 2.1.1 使用 Depoly Key 进行部署

> **本方法适用于大多数的公有博客仓库**
> **同时，仓库内不具备私有的子模块**
> **建议首选**

Deploy Key 是一个 SSH Key，区别于个人 SSH Key 的是，它仅对配置了它的仓库有效；

也就是说，如果应用使用了 Deploy Key，那么应用的权限就仅限于 repo 之中，准确的来说，是仅限于 repo 的 **文件读写权限**。

这就给 Deploy Key 带来了很高的安全度，即使 Key 泄漏了，威胁到的也只是设置了它的仓库，而不会威胁帐号本身。

使用了 SSH Key 也就意味着我们是使用 SSH 和 GitHub 进行连接，那么对 SSH 的配置是必不可少的；


##### 2.1.1.1 密钥生成

首先我们要生成一对公钥和私钥，这个在很多地方都有操作介绍了，这里就不多讲。

```bash
ssh-keygen -t rsa -b 4096 -C "email" -f key_file -N ''
```

接着，到 repo 的 Settings 里面创建一个 Deploy Key，把公钥的内容粘贴进去。

> 如果是 coding.net 的话，是配置在 `部署公钥` 之中。

然后我们把公钥删掉，避免你误把它加入了 git 中。

```bash
rm -f key_file.pub
```

##### 2.1.1.2 使用 Travis 命令行程序进行加密

密钥显然是不能给别人看的，因此，我们就要把密钥通过 `travis` 程序加密。

首先，我们要安装 `travis`

```bash
gem install travis
```

> 如果你的 `ruby` 版本太旧，可能还需要先升级一下。
> **最好在你的 repo 目录下执行 `travis` 命令**
> 方便 `travis` 自动识别仓库。

然后，我们通过 `travis` 来登录：

```bash
travis login
```

这是为了让 `travis` 自动将加密好的东西上传到 Settings 的环境变量中，这样就不用我们配置 `.travis.yml` 文件了。

接着，我们对文件进行加密：

```bash
travis encrypt key_file
```


随后，我们把生成的 `.enc` 文件加入 git 中，并把私钥删掉。

```bash
rm -f key_file
git add key_file.enc
```

##### 2.1.1.3 配置 Known Hosts 和 SSH

接下来，我们就进行 SSH 的相关配置；

**首先需要配置的是 Known Hosts，否则 CI 就会卡在问你是否要继续那里。**

然后，我们使用 `openssl` 把之前加密的文件解压成私钥，最后把私钥配置上就行了。

```yml
addons:
    ssh_known_hosts:
        - github.com
        - git.coding.net

before_install:
    # SSH Setup
    - openssl aes-256-cbc -K $encrypted_693585a97b8c_key -iv $encrypted_693585a97b8c_iv -in blog_deploy_key.enc -out blog_deploy_key -d
    - eval "$(ssh-agent -s)"
    - chmod 600 ./blog_deploy_key
    - ssh-add ./blog_deploy_key
```

#### 2.1.2 获取 Access Token

> **本方法适用于具有私有 Submodule 的仓库的情况**

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

### 3.5 时区问题

Travis CI 好像默认使用的是美国的时区，这样就会让你的 master commit 历史变得很乱。

所以，我们有必要让 Travis CI 和你的本机时区进行统一

这个配置比较简单，通过设置 `TZ` 环境变量即可。

```yml
env:
    global:
        - TZ=Asia/Tokyo
```

> 别吐槽我为什么用日本时区，玩游戏需要。

这里需要多说一点的是，如果只有 `env`，如：

```yml
env:
    - ENV1=xxxx
    - ENV2=yyyy
```

此时，Travis CI 就会进行 **两次** 构建，分别采用 `ENV1` 和 `ENV2`

而对于 `global` 的环境变量，就会采取所有的环境变量，只构建一次。

## 4. 总结

经过一段时间的奋战，Travis CI 的集成终于做好了；
虽然花费了点时间，不过在折腾的过程中还接触了一下 Travis CI 的配置流程，想必还是有些收获的；

要不人们总说折腾博客比写博客有趣呢？
