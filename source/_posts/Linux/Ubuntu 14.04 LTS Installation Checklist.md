---
title: Ubuntu 14.04 LTS Installation Checklist
date: 2017-04-08
categories: Linux
tags: Linux
---

## 0. Intro

This is the installation checklist of the lastest Ubuntu LTS version: Ubuntu 14.04 LTS

The reason of choosing Ubuntu is that the Ubuntu has the least problems with my hardware.
Actually, it's only the Wireless Issue exist.

<!-- more -->## 1. Before Install

1. Backup all the **proxy** settings and the other software settings which cannot be synchronized.

2. Design the harddrive parttition

    > The `/boot`, `/`, `/swap` and the `/home`

## 2. System Configuration

1. Change software source to mainland China

    > In my home, the aliyun's software source seems better.
    In my school, the bjtu's software source seems better.

2. Upgrade software

    > The Ubuntu Software Center will automatically upgrade the softwares.
    Or, you can use
    `sudo apt-get update
    sudo apt-get upgrade`
    to upgrade the softwares.

3. Install fcitx input method frame

    > Due to the account of my baidu is Chinese.
    So I need to install the fcitx first to get the shadowsocks server info
    Check this [post](https://blogs.fsfe.org/stefan.a/2014/09/23/set-up-fcitx-chinese-and-japanese-language-input-ubuntu-14-04/) for details

    > Telegram seems not support `super + space` as  the switch shortcut.
    Remenber use a secondary switch shortcut as `ctrl + super + space`

4. Fix the Wireless Issue of **RTL8723BE**

    > Need to install **vim** at first

    > This is the model of my Wireless Network Adapter.
    It has a issue of network connection in Ubuntu.

    > The way how to fix is open the
    `/etc/modprobe.d/rtl8723be.conf`
    if it doesn't exsit, create it.
    And add such line in it:
    `options rtl8723be fwlps=N ips=N`
    And then reboot, it will fix this problem

    > Check this [post](http://www.dedoimedo.com/computers/ubuntu-trusty-realtek.html) for details.

## 3. The necessary softwares

1. Install shadowsocks

    > The GUI client of linux is the shadowsocks-qt5

2. Install Google Chrome

    > I don't know somehow the original firefox bulit in the system cannot play song of the neteasy cloud music.
    So, install the Chrome is necessary.

3. Install LastPass

    > I store most of my passwords in the LastPass, including the Google account.

4. Install **git** and the **bulid-essntial** package

    > For the development needs

5. Install **zsh** and **oh-my-zsh**

    > The best shell I have ever seen

5. Install **spf13-vim**

    > The spf13 vim has problem of neocomplete plugin, but it's still the best _vimrc.
    Maybe the k-vim will be better.

<!-- more -->## 4. Entertainment

The entertainment is almost the Kancolle game.

1. Install the **ShimakazeGo**

    > Prerequisites:
    **mono**, **openssl**, **libssl-dev**, **libssl0.9.8**, **p7zip-full**
    The openssl is built in the system.
    The p7zip-full is the command line version of 7z

2. Install the **poi**

    > Prerequisites:
    **electron**, **nodejs**, **npm**
    The npm is the bulit-in module of nodejs

    > Install nodejs:
    Download the archive and add it to the PATH in `~/.zshrc`

    > Notes for npm:
    The origin registry is extremely slow.
    Recommand to change it to the `http://registry.cnpm.org`

## 5. Java & Jetbrains' IDEs

1. Using the **oracle's Java** is recommended.

    > use
    `sudo update-altiretive --install "/usr/bin/java" "java" "/path/of/oracle/java" 1` to use as default.
    This step should fix the Android SDK Manager not responding in Android Studio

2. Enviroment Variable:
    - For command line program, define it at `~/.zshrc`
    - For desktop entry: Define at `/etc/enviroment`
3. Java Enviroment Settings Procedure: (in `/etc/enviroment`)
    1. Set `JAVA_HOME` (not include the `bin/`)
    2. Set `CLASSPATH` (normally the `lib/` folder in `$JAVA_HOME`)
    3. Add `$JAVA_HOME` to `$PATH`

4. Android Studio

    > Prerequisites:
    See this [answer](http://stackoverflow.com/a/29242123) in StackOverflow.

    > Android SDK Manager:
    ~~It seems a issue that I cannot lanuch the standalone SDK Manager in Android Studio.
    It wired, by far I have no idea how to solve it.~~
    ~~But the bulit-in manager works fine, so it's not so important at this moment.~~

<!-- more -->## 6. Desktop Entry

The desktop entry of per user store in
`~/.local/share/applications`

The format of desktop entry is :

```script
[Desktop Entry]
Name= # The name of the app, use camercal case
Icon= # The icon
Exec= # The execute path, must be absolute path
Type=Application
Terminal=false
Categories= # The categories
```

## 7. Fonts

By far, the font settings seems acceptable.

As follow:

<table>
<th colspan="2" style="text-align:center">My Unity Fonts Settings</th>
<tr>
<td>Default Font</td>
<td>Droid Sans Regular</td>
</tr>

<tr>
<td>Document font</td>
<td>Droid Sans Regular</td>
</tr>

<tr>
<td>Monospace font</td>
<td>Meslo LG S for Powerline Regular</td>
</tr>

<tr>
<td>Windows font</td>
<td>Ubuntu mono</td>
</tr>

<tr>
<td>Terminal font</td>
<td>Meslo LG S for Powerline Regular</td>
</tr>

</table>

<table>
<th colspan="2" style="text-align:center">My Chrome Fonts Settings</th>

<tr>
<td>Standard font</td>
<td>WenQuanYi Micro Hei 15px</td>
</tr>

<tr>
<td>Serif font</td>
<td>Droid Serif</td>
</tr>

<tr>
<td>Sans-serif font</td>
<td>DejaVu Sans</td>
</tr>

<tr>
<td>Fixed width font</td>
<td>Meslo LG S for Powerline</td>
</tr>
</table>

Special: Jetbrains' IDEs using **Robono Mono for powerline**
