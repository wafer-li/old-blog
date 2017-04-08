---
title: OS X Using ShimakazeGo + Poi to play kancolle
date: 2017-04-08
categories: Kancolle
tags: Kancolle
---

## 0. Intro

This is the instruction of how to bulid a kancolle playing enviroment in Mac OS X.

My current OS X version is 10.11

Necessary tools: Automator

<!-- more -->## 1. Install ShimakazeGo

ShimakazeGo is a proxy for playing Kancolle. Because DMM has banned the IP addresses of foreigners, you need to use a proxy to connect to the game site.

Here is the [ShimakazeGo official site](http://unlockacgweb.galstars.net/). There is a instruction how to install it on Mac OS X

## 2. Pack ShimakazeGo as a OS X APP

**This section is pretty important**.

The ShimakazeGo developer offer a shell scipt to start the program.

Therefore, it's very easy to convert it to a application by using **Automator**, a convient and easy-to-use app buliding tool on Mac OS X.

Open Automator, choose the **Application** and serch for **Run Apple Script** at the search bar.

And then paste this script inside the input frame.

```
on run
	do shell script "/path/to/the/ShimakazeGo/run_mac > /dev/null 2>&1 &"
	quit
end run
```

Save the App, copy to your `/Application` and close the Automator, using a text editor, such as vim to open the **run_mac** script and **delete the last two line**

The script will appear like this

```
#!/bin/bash

export LANG="zh-CN.UTF-8"
export LC_ALL="zh-CN.UTF-8"

defaults write mono NSAppSleepDisabled -bool YES

MONO_LIB=/Library/Frameworks/Mono.framework/Versions/Current/bin/mono

dir=$(dirname ${BASH_SOURCE:-$0})
$MONO_LIB $dir/ShimakazeGo.exe > /dev/null &
```

And done. Start the app and you will see the ShimakazeGo window.

## 2.5 Supplement: Change App Icon

The app that we generate will come with a default Automator icon like a robot.
Some people may dislike it and want to changge to another icon.
It is very easy, **just follow these instructions**:

1. Open the App info window(`cmd + i`)
2. Open the icon img you want to replace with.
3. Select the whole img(`cmd + a`) and copy(`cmd + c`)
4. Click the icon inside the App info window, and paste(`cmd + v`)
5. Done!

<!-- more -->## 3. Install Poi

Poi is a Scalable KanColle browser and tool.
Due to using the web techology, it is **totally cross-platform**

Here is the [GitHub repo](https://github.com/poooi/poi)
