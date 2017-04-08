---
title: Android Studio FAQ
date: 2017-04-08
categories: Android
tags: Android
---

## 1. .gitignore 文件

> 如果你想要尽量的减少冲突，就**不要直接使用** Android Studio 默认生成的 `.gitignore` 文件，而是要在 `.gitignore` 中添加一些项目，或者直接导入其内置的许多模板。

这里有一些应该加入的项目:

1. `/.idea` 文件夹

    > `/.idea` 文件夹是 `gradle` 导入工程时生成的文件夹，它会被 gradle **自动生成**。在添加一个新依赖的时候，build 流程会自动添加依赖项的描述到 `/.idea` 文件夹里，所以很容易会引起冲突。

2. `.iml` 文件

    > `iml` 文件会在当你导入 gradle 工程的时候被 gradle **自动生成**，和上面一样，gradle 会自动添加一些描述到 `.iml` 文件里面，其中也包括了依赖项的描述

3.  `/gradle.properties` 文件

    > 这个文件经常只保存了 gradle 的代理设置，1.5 版本以后的 Anroid Studio 会在当你进行 Gradle Sync 的时候自动将 Android Studio 的代理设置导入到这个文件里面。
    **如果组员各自使用不同的代理设置，那么就应该忽略它**

4. 补充1：别忘记执行 `git rm -r --cached` 来删除 git 版本树中的版本

    > `.gitigonre` 仅对那些没有追踪的文件起作用，如果已经被 git 系统追踪了，仅将其加入到 `.gitignore` 是没有作用的。

5. 补充2：当你需要忽略一个文件夹的时候，别忘记添加 `/` 后缀

    > 例如：当你需要忽略 `.gradle` 文件夹的时候，你需要输入 `/.gradle/` ，这样，它才能忽略整个文件夹，否则，当你删除这个文件夹，然后被重新生成时， Android Studio 就不会识别出它是已经忽略掉的了。

综上所述，这里是我的 `.gitignore` 例子。

```.gitignore
*.iml
/.idea/
/gradle.properties
.gradle/
/local.properties
.DS_Store
/build
/captures
```

<!-- more -->## 2. 当出现 cannot resolve symbols 时

首先，你需要检查依赖是否已经被正确加载了，如果依赖项没有问题
那么请依照以下流程来尝试进行修复

1. 检查使用的 gradle 是否正确

    > 在 `Settings` 中检查 `gradle` 的选项，一般推荐使用 Anroid Studio 内置的 gradle。

2. 删除本地的代码库，重新克隆一份
3. 尝试点击 `Gradle Sync` 按钮进行 `Gradle Sync`
4. 在 `Build` 菜单选择 `Clean the Project`
5. 在 `Build` 菜单选择 `Rebuild the Project`

> 需要注意的是，当你克隆完毕后，使用 `Open existing Project` 或者 `Import from gradle` 来打开工程，而不是在 `recently projects` 中打开。


## 3. 当不能识别出 Android 框架时

> 如果你的 Android Studio 不能识别出 Gradle 或者整个 Anroid 框架的时候，例如，导航条没有 `app` module，在 Build 菜单只有一点点东西的时候。

![Poisonous](http://ww2.sinaimg.cn/large/8c1fca6bjw1eyyb1dvnnmj20zk0qotb3.jpg)

<span style="font-size:1.5em;font-weight:bold">
备份你的代码库到远端，然后重新克隆它。
当你克隆完毕的时候， rebuild project.
</span>
