---
title: 解决 Travis CI 总是更新旧博客的问题
date: '2018-01-12 16:45'
tags:
  - Hexo
  - Trivas CI
categories:
  - Hexo
---

本文着重介绍一下如何解决 Travis CI 在进行自动集成的时候，总是会更新旧博客的问题。

之前有想过要把这篇文章合并到上一篇里面，不过这个问题比较隐蔽，而且较难解决，最后还是新开一篇文章来详细讲一下该怎么做，防止以后有人再被这个问题困扰。

<!-- more -->

## 1. 初级症状——master 的 commit 只有两个

在经过上一篇文章的折腾之后，Travis CI 总算是能够正常执行脚本并提交到 GitHub 上进行；

不过，如果你查看 master 的 commit 情况就会发现，你原本满满当当的页面构建历史突然就只有两个了。

博客最重要的就是积累，现在一个构建你的博客就变成新博客了，简直不能忍。

这个问题的原因在于你的博客目录下没有之前 deploy 会生成的 `.deploy_git` 这个目录；

这个目录实际上也就是你的 master 分支，在没有这个目录的情况下，`hexo-deploy-git` 插件会自动生成 `.deploy_git`，并将 `public` 复制到这个目录下；

然后插件会进行 **force push**！这就是你的 commit 历史会丢失的原因！

解决方法也很简单，首先你需要在本地进行一次 deploy，来恢复你的 commit 历史

然后，只需要在每次构建的时候都 `clone` 一下这个目录，这样你的历史就不会丢失了。

往 `.travis.yml` 加入如下脚本即可：

```yml
before_install:
    - git clone --branch=master {your_blog_repo_git_url} .deploy_git
```

## 2. 高级症状——旧博客总是被更新

这个症状是本文的重点，也是本文最终要解决的问题。

症状的具体表现在于，博客的更新时间总是最新的；

**就连你没有更新过的旧博客也一样！**

如图所示，图片中的更新时间全部都一样，按常理来说这是不可能的。

![](https://ws2.sinaimg.cn/large/006tNc79ly1fnedchdb50j30jn0dg0ta.jpg)

这到底是什么原因呢？

### 2.1 症状原因

经过一番查询之后，我查到了[这篇博文](https://blog.jamespan.me/2016/04/24/restore-files-modification-time-in-git)；

里面提到，Hexo 并不识别文章的更新时间，而是将这个更新时间交给了系统进行；

实际上 Hexo 的文章更改时间就是 markdown 文件的 **最后修改时间**；

到这里，原因已经很明显了：

由于 Travis CI 在构建的时候，总是 **重新 clone repo**，这就造成了 **所有文件的最后修改时间都是最新的 clone 时间**；

实际上，这并不是 Travis CI 的问题，而是 git 的问题，git 由于分布式的原因，并不会保留文件的最后修改时间；

不过，作为一个博客系统来说，我们可以采用 git 的最后 commit 时间来替代，这样子就能恢复文件的修改时间了。

### 2.2 解决办法

解决方案清楚之后我就开始寻找相关的实现，不过网上现有的一步到位修改文件 last modified time 的实现都不能解决 non-ASCII 的问题；

> 所谓 non-ASCII 的问题就是当你的文件名含有中文或者其他的字符的时候，脚本就会炸掉，执行不下去。

最后面还是毛主席说得好，自己动手丰衣足食，在参照了[这个 StackOverflow 的答案](https://serverfault.com/a/774574)之后，我编写了下面的脚本，终于解决了 non-ASCII 文件名的问题：

```python
# -*- coding: utf-8 -*-

import subprocess
import os
import shlex

if __name__ != '__main__':
    raise ImportError("%s should not be used as a module." % __name__)

# 'git ls-files -z | xargs -0 -n1 -I{} -- git log -1 --format="%ct {}" {} | sort'
git_ls_cmd = 'git ls-files -z'
xargs_cmd = 'xargs -0 -n1 -I{} -- git log -1 --format="%ct {}" {}'
sort_cmd = 'sort'

work_dir = os.getcwd()

git_ls_result = subprocess.Popen(shlex.split(git_ls_cmd), stdout=subprocess.PIPE)
xargs_result = subprocess.Popen(shlex.split(xargs_cmd), stdin=git_ls_result.stdout, stdout=subprocess.PIPE)
result = subprocess.check_output('sort', stdin=xargs_result.stdout)

timestamp_file_list = [tuple(it.split(' ', 1)) for it in result.decode('utf-8').split('\n')][:-1]

for timestamp, file_path in timestamp_file_list:
    os.utime(os.path.join(work_dir, file_path), (int(timestamp), int(timestamp)))
```

你也可以在[这个 gist](https://gist.github.com/wafer-li/a7a62a4423cf39c43dc56d628ff4c365)里面获取其代码；

在你把 repo 克隆下来，进行了 `user.name` 和 `user.email` 的配置之后，用 `python3` 执行一下这个脚本，就能恢复文件的最后修改时间。

相关的 `.travis.yml` 配置：

```yml
before_install:
    # Git Config
    - git config --global user.name "your_user_name"
    - git config --global user.email "your_email"
# Restore last modified time
    - chmod +x git_reset_mtime.py
    - python3 ./git_reset_mtime.py
```

> 特别注意！**必须使用 `python3` 执行**，本脚本目前最低支持到 python 3.4

> 之所以是 3.4 是因为 Travis CI 的 python3 的最新版本就只到 3.4；
> 不能采用 3.5 之后才能使用的 `subprocess.run()`

### 2.3 Clone Depth 导致的问题

在经过上面的一番折腾之后，你会发现一个奇怪的现象：在本地测试脚本完全成功，但是把脚本放到 Travis CI 去运行却不行， **最多只能恢复几天前的修改时间**。

在查看了一下 Travis CI 的 log 之后，我发现：

Travis CI 默认会采用 `--depth=50` 这个参数，也就是说，它之后克隆 **前 50 个 commit**；

而我们的脚本需要**完整的 git 历史记录**才能正确的恢复文件的修改时间；

所以，我们还需要取消 Travis CI 的默认 `depth` 参数，让它克隆我们完整的 git 仓库:

```yml
git:
    depth: false
```

## 3. 最终的 Travis CI 脚本

这里给出我最终测试成功的 Travis CI 脚本给大家参考：

```yml
dist: trusty
sudo: required

addons:
    ssh_known_hosts:
        - github.com
        - git.coding.net
    apt:
        packages:
            - nasm

env:
    global:
        - ATOM_WRITER_PATCH_URL=https://raw.githubusercontent.com/wafer-li/hexo-generator-atom-markdown-writer-meta/9f8ab23d42a60a9fa7ef8eed161f216a7716d14d/lib/generator.js
        - ATOM_WRITER_DIR=node_modules/hexo-generator-atom-markdown-writer-meta/
        - TZ=Asia/Tokyo

language: node_js
node_js: node

branches:
    only:
        - source

git:
    depth: false
    submodules: false

cache:
    apt: true
    directories:
        - node_modules


before_install:
    # Git Config
    - sed -i 's/git@github.com:/https:\/\/github.com\//' .gitmodules
    - git config --global user.name "wafer-li"
    - git config --global user.email "omyshokami@gmail.com"

    # Restore last modified time
    - "git ls-files -z | while read -d '' path; do touch -d \"$(git log -1 --format=\"@%ct\" \"$path\")\" \"$path\"; done"

    # Submodules
    - git submodule update --recursive --remote --init

    # Deploy history
    - git clone --branch=master --single-branch https://github.com/wafer-li/wafer-li.github.io.git .deploy_git

    # SSH Setup
    - openssl aes-256-cbc -K $encrypted_XXXXXXXXX_key -iv $encrypted_XXXXXXXXX_iv -in blog_deploy_key.enc -out blog_deploy_key -d
    - eval "$(ssh-agent -s)"
    - chmod 600 ./blog_deploy_key
    - ssh-add ./blog_deploy_key

install: npm install

before_script:
    # Patch atom writer generator
    - curl $ATOM_WRITER_PATCH_URL >| ${ATOM_WRITER_DIR}/lib/generator.js

    ## Theme Dependencies
    - cd themes/next-reloaded
    # canvas-nest
    - git clone https://github.com/theme-next/theme-next-canvas-nest source/lib/canvas-nest
    # fancybox3
    - git clone https://github.com/theme-next/theme-next-fancybox3 source/lib/fancybox
    # reading_progress
    - git clone https://github.com/theme-next/theme-next-reading-progress source/lib/reading_progress

    - cd ../..

script:
    - hexo clean
    - hexo g -d --config source/_data/next.yml
```

## 4. 参考资料

[从 Git 提交历史中「恢复」文件修改时间](https://blog.jamespan.me/2016/04/24/restore-files-modification-time-in-git)

[How to retrieve the last modification date of all files in a git repository](https://serverfault.com/a/774574)

[git-tools/git-restore-mtime at master · MestreLion/git-tools](https://github.com/MestreLion/git-tools/blob/master/git-restore-mtime)
