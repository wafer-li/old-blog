---
title: My Linux Experiences
date: 2017-04-08
categories: Linux
tags: Linux
---

## Linux Mint Installation Notes

### 1. Using the USB boot

> Do not use the hard disk boot option, it will cause a lot of problems.
As I am known, if you do that, the battery will be some weird problems.

<!-- more -->

### 2. Partition

> You could do the patition base on your needs, or follow the advice in the Internet.
Normally, I just use `/`, `/boot`, `/home` and `/swap` parts.

> Maybe the `/usr` needs to mount into another space, for what the software is almost install by
the package manager.(such as `apt-get`)

### 3. Dual Boot

> This is extremely important,
(for me ,because I still can not leave the big game which is only can be run in Windows)
If you want to have the bennifits from each of these OS

#### 1) Single Hard Disk

> That's nothing to say about, if only have **one** hard disk,
you must be care of the order of the installation,
because the first installed boot loader will be covered by the secound.

#### 2) Dual or Multiple Hard Disks

> **you need to be awared of the boot loader's position,
because if you install them into the same disk, the latter will cover the former**

> I recomend to use the **Win to load the Linux**, because the linux is actually a bit annoying,
you need to **reinstall the system for many times at the very first time**. If you use the grup to
boot the Win, when you need to **reinstall** the linux, it will be difficult to do it.

<div style="font-size:25px;font-weight:bold;color:red;">
Improtant:

Use the USB driver to install the Linux, do not just use the hard driver to install.

Keep the USB driver, it will be more convient to REINSTALL the system
</div>

- The install position of the boot loader
    > The position must contain the name of the hard disk.
    That is, you need to install it into `/dev/sda` or the `/dev/sdb`
    not the hard driver which has number with it.

    - If you want to let the **Win to boot the linux**, just place the boot loader into
    where the Windows C driver is not in it.
        > I have two hard disks, and my Windows C driver place in the SSD, if I want to
        use win to load the linux, I just place it into the HDD

    - If you want to do the oppsite, just let the Linux to boot the Windows, you need to install
    the boot loader into the same disk which the Windows c driver has been installed.

- Supplement for Linux boot Windows
<div style="color:orange;font-weight:bold;font-size:25px">
<div style="text-align:center;">
DO NOT FORMAT THE LINUX PARTITION IN WINDOWS!!!
</div>
if so, the two systems will not be able to start neither.
</div>

### 4. Proxy

> Normally, I only use the socks proxy, but also the http proxy,
so, what I am using is the `Shadowsocks + Privoxy` to build up the
`socks` proxy and the `http` proxy

1. Down `Shadowsocks-qt5` or install it by ppa

2. Using the `apt-get` to install `Privoxy`
    > Edit the `/etc/privoxy/config` for the configuration.

    > To enable the socks config, just edit the

    ```
     forward-socks5     /       host:port .
    ```
    Usually, it will be

    ```
     forward-socks5     /       127.0.0.1:1080 .
    ```
    **Do remenber the `<space>` of the `port` and the `.` is necessary**

    **Use the `IP` instead of the `localhost`**

    **Defaultly, the HTTP listen port is `8118`**

3. Using the following command to start an `service ` of the privoxy

```
 sudo service privoxy restart
```

**Remember it's `restart` not the `start`,sometime, the `start` won't work.**

**And the socks proxy is `127.0.0.1:1080`, the http proxy is `127.0.0.1:8118`**

### 5. Enviroment Variables

> Normally, the enviroment variables could be define and edit in the
`~/.*shrc`, now I am using `Zsh`,so the file is `.zshrc`,
normally, it will be `.bashrc`

> Different from Ubuntu, when you need to run a program from the desktop enviroment,
such as `IntillJ IDEA`, you need to edit the `~/.profile` to define the enviroment variables,
such as `JAVA_HOME`

### 6. About the `unable to run "mate-settings deamon"`

> It might be cause by the **incorrect NVIDIA driver**,
use the default is just fine.

> Do not change the NV driver from the driver manager.

### 7. About my battery problems

> It might due to some weird problems,
if the battery cannot be reconized, try to install
`acpi`, it might be some help.

<span style="font-size:10px">Actually, I not quite sure.</span>

### 8. Zsh

> Following the instruction of [robbyrussell/oh-my-zsh](https://github.com/robbyrussell/oh-my-zsh)
to install the `zsh` is ok, and don't forget to install `oh-my-zsh` to customze the zsh

> To enable the [agnoster](https://github.com/agnoster/agnoster-zsh-theme) bulit-in theme of the
oh-my-zsh, need to install the [Powerline-patched font](https://github.com/powerline/fonts), just
use the `install.sh` is okay.
And after that, change the terminal font to which has the powerline suffix.

### 9. Vim

> The vim is almost the biggest problem for me.
After hours of hours test, I found a config that is suit with me.

> What I use it the [spf13/spf13-vim](https://github.com/spf13/spf13-vim) + [suan/vim-instant-markdown](https://github.com/suan/vim-instant-markdown)
for supporting my vim usage and do the notes.

> Just follow the instruction in each repo, that is okay.

**Supplements**:

- Change the theme of the status line in spf13-vim

    > The status line is using the ariline, the instruction is place at
    https://github.com/bling/vim-airline/wiki/FAQ,
    click the Screenshot, it will list its themes and the theme name.

    > What I like is the `badwolf`.

- Add **MathJax** support for the `vim-instant-markdown`

See this [issue](https://github.com/suan/vim-instant-markdown/issues/67)

**Known Issue:**

- The `vim-instant-markdown` will remain the chrome tab when the vim is leave.
