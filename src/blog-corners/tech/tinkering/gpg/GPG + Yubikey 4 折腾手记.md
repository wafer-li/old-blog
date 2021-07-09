---
title: GPG + Yubikey 4 折腾手记
date: '2018-01-22 01:30'
tags:
  - GPG
  - Yubikey
  - 各种折腾
category: GPG
---

GPG 相信很多人都折腾过，Yubikey 也有很多人买过；

但是好像只有老外折腾过 Yubikey + GPG 的；

最近刚折腾完毕，因为自己不慎还把一个老钥匙搞丢了，现在只能随它去了；

这里就写写我折腾过程中遇到的坑，前车之鉴，后事之师。

<!-- more -->

## 准备 Yubikey

Yubikey 买不就行了，为什么要单开一个 section 来说呢？

其实 Yubikey 目前主要有两个系列，一个是 Yubikey 4，一个是 Yubikey NEO。

这两者有什么区别呢？

1. Yubikey 4 不支持 NFC，但是可以支持 4096 bit 的密钥
2. Yubikey NEO 支持 NFC，但是只能支持 2048 bit 的密钥

也就是说，如果你想在手机上用，那么就只能使用 2048 bit 的密钥；

如果你想更长的密钥，就不能在手机上用。

当然，除了用于 GPG 的 Smartcard 以外，Yubikey 还可以用于两步验证等其他方面，这就要看你的需求的取舍了，这个东西在你买的时候就要考虑好。

## 安装 GPG

折腾 GPG 的第一步当然就是安装 GPG，我使用的是 Mac，所以直接安装 [GPGSuite](https://gpgtools.org/)，然后再用 `brew` 安装 `gnupg` 就行了。

不过，如果你使用 4096 bit 的密钥，那么你需要使用 `gpg2` 而不是 `gpg`

## 编辑卡的信息

把 Yubikey 拿到手之后我们先别忙着生成密钥，首先，我们要配置一下卡的信息，其实主要就是设置卡的 PIN 和 Admin PIN，而这个在要把密钥导入卡的时候需要。

将卡插入 USB，然后执行 `gpg2 --card-edit`；

然后你就会看到卡的相关信息：

```bash
Reader ...........: Yubico Yubikey 4 OTP U2F CCID
Application ID ...: D2760001240102010006046218630000
Version ..........: 2.1
Manufacturer .....: Yubico
Serial number ....: 04621863
Name of cardholder: Wafer Li
Language prefs ...: zh
Sex ..............: 男性
URL of public key : hkp://keys.gnupg.net
Login data .......: omyshokami@gmail.com
Signature PIN ....: 必须
Key attributes ...: rsa4096 rsa4096 rsa4096
Max. PIN lengths .: 127 127 127
PIN retry counter : 3 0 3
Signature counter : 43
Signature key ....: E219 29F0 DEC5 FAEC 434A  91D7 E22B 63C2 E449 298F
      created ....: 2018-01-21 09:31:56
Encryption key....: 20F2 E95E 0107 1097 A853  A5CC E6AB 1330 6FE4 E5D9
      created ....: 2018-01-21 09:31:56
Authentication key: C1A4 2561 3A5D E7D5 4CBF  CD4B 7440 5003 FFA1 4684
      created ....: 2018-01-21 09:32:39
General key info..: pub  rsa4096/E22B63C2E449298F 2018-01-21 Wafer Li (Gmail. Mainly used in git) <omyshokami@gmail.com>
sec>  rsa4096/E22B63C2E449298F  创建于：2018-01-21  有效至：2020-01-21
                                卡号：0006 04621863
ssb>  rsa4096/E6AB13306FE4E5D9  创建于：2018-01-21  有效至：2020-01-21
                                卡号：0006 04621863
ssb>  rsa4096/74405003FFA14684  创建于：2018-01-21  有效至：2020-01-21
                                卡号：0006 04621863
```

然后输入 `admin`，再输入 `help`，就可以使用管理员命令并看到相关帮助：

```bash
gpg/card> admin
允许使用管理员命令

gpg/card> help
quit           离开这个菜单
admin          显示管理员命令
help           显示这份在线说明
list           列出所有可用数据
name           更改卡持有人的姓名
url            更改获取密钥的 URL
fetch          根据卡中指定的 URL 获取密钥
login          更改登录名
lang           更改首选语言首选
sex            更改卡持有人的性别
cafpr          更改一个 CA 指纹
forcesig       设定 PIN 签名是否必须
generate       生成新的密钥
passwd         更改或解锁 PIN 的菜单
verify         验证 PIN 并列出所有数据
unblock        unblock the PIN using a Reset Code
factory-reset  destroy all keys and data
```

最近 `gpg2` 的中文化做的不错，相信你已经看懂大概了，要修改密码，我们输入 `passwd`：

```bash
gpg/card> passwd
gpg: 检测到 OpenPGP 卡号 D2760001240102010006046218630000

1 - change PIN
2 - unblock PIN
3 - change Admin PIN
4 - set the Reset Code
Q - quit

您的选择？
```

然后我们分别输入 `1`  和 `2` 去修改 PIN 和 Admin PIN。

接着会弹出一个框让你输入原来的 PIN，那么原来的 PIN 是什么呢？

根据 Yubikey 的文档，**PIN 和 Admin PIN 的出厂设置都是 12345678**。

记住这个密码，如果你接下来把东西搞炸了，你还可以把 Yubikey 恢复出厂设置，这时你就需要它了。

改完密码之后我们选择 `Q` 和 `quit` 退出卡的编辑界面，注意不要 `Ctrl + C`，可能会丢失修改，最好还是使用它的退出来退出。

## 生成密钥

现在我们终于要生成密钥了，生成密钥这个很多人都讲过了，操作也就那些，这里就不再细讲，说点要注意的地方。

首先就是密钥的长度，如果你使用 Yubikey 4 的话，使用 4096 bit 的，如果你使用 Yubikey NEO 的话，那么就只能使用默认的 2048 bit 了。

但是，如果你以后想换成 Yubikey NEO 的话，那么还是用 2048 的，不要用 4096 的。

然后在生成密钥的时候为了让它得到更多的熵，多动动鼠标就行了，不需要敲键盘，否则就敲到什么命令了。

生成完毕之后，输入 `gpg2 --expert --edit-key KEYID` 进入下一个步骤。

### 生成子密钥

这个可能很多人没讲过，实际上 Yubikey 可以存储 3 种密钥，签名、加密和认证；

默认生成的只有签名密钥和加密密钥，并不会生成认证密钥。

认证密钥有什么用呢？我查到主要还是用于 SSH 登录，不过这次我没有折腾出来，之后可能会写另外一篇关于这个的文章。

刚才我们进入了 `--edit-key` 的界面，在这里我们输入 `addkey` 就可以增加一个子密钥了。

```bash
gpg> addkey
主钥的私钥部分存储在卡上。
请选择您要使用的密钥种类：
   (3) DSA (仅用于签名)
   (4) RSA (仅用于签名)
   (5) ElGamal (仅用于加密)
   (6) RSA (仅用于加密)
   (7) DSA (自定义用途)
   (8) RSA (自定义用途)
  (10) ECC (sign only)
  (11) ECC (set your own capabilities)
  (12) ECC (encrypt only)
  (13) Existing key
您的选择？
```

这里之所以出现这么多选项是因为我们上面使用了 `--expert` 模式，如果你要创建认证密钥，那么就必须使用这种模式。

在这里我们选择 8，用 RSA 算法来生成认证子密钥。

```sh
RSA 密钥可能的操作：签名 加密 认证
目前允许的操作：签名 加密

   (S) 选择是否用于签名
   (E) 选择是否用于加密
   (A) 选择是否用于认证
   (Q) 已完成

您的选择？
```

这里给你的选项是个开关选项，像现在的状态，我如果选择 S，上面的 _目前允许的操作_ 就会变成只有加密。

```sh
您的选择？ s

RSA 密钥可能的操作：签名 加密 认证
目前允许的操作：加密

   (S) 选择是否用于签名
   (E) 选择是否用于加密
   (A) 选择是否用于认证
   (Q) 已完成

您的选择？
```

然后我们让这个密钥只能进行认证，然后生成它就行了。

最后输入 `save` 保存并退出。

## 备份密钥

注意！

**这个操作必须在将密钥传入 Yubikey 之前进行！**

备份是很重要的，一旦你将密钥传入 Yubikey 中，那么就再也取不出来了！

<p style="font-weight: bold; font-size: x-large">而且尤其注意要备份你的主密钥！<p>

你的主密钥不仅具有签名功能，而且还代表了你的身份，如果丢失了主密钥，就意味着你的身份就此丢失，你只能创建一个新的密钥，并把原来的吊销掉。

这里尤其要注意：

<p style="font-weight: bold; font-size: xx-large">请记住你的密钥 passphrase<p>

因为 GPG 在导入一个私钥的时候会要求它的密码，如果你把它忘记了，那么你就丢失了你的密钥。

使用下面的命令来导出你的私钥：

```
gpg2 --armor --export-secret-keys KEYID >> private.asc
```

请好好保存它，并记住它的密码。

## 转移密钥到 Yubikey

当你备份并保存好你的主私钥之后，就可以将密钥传入 Yubikey 了。

当然其实也可以不将主密钥传到 Yubikey 中，不过在有了良好备份的情况下，我们就可以追求更高的安全性，毕竟把你的私钥保存在电脑里面总是不好的。

进入密钥编辑模式：

```
gpg2 --edit-key KEYID
```

输入 `toggle`，然后输入 `keytocard`，输入 `y` 确认将主密钥传入 Yubikey 中，然后选择 `1`，将主密钥作为签名密钥。

这时就会把你的主密钥传到 Yubikey 中，这时它就会问你密钥的密码，还有 Yubikey 的 Admin PIN。

输入 `key 1` 选择**第二个**密钥：

![](https://ws1.sinaimg.cn/large/006tNc79ly1fnppmejbx9j307b06ft8m.jpg)

这时候你的第二个密钥就会有个 `*`，如上图所示。

然后继续输入 `keytocard` 将密钥传入，接着选择对应的密钥类型就行了。

第二个密钥传入完成之后，我们输入 `key 1` **取消选择第二个密钥**。

![](https://ws4.sinaimg.cn/large/006tNc79ly1fnpppmud1vj307b061q2u.jpg)

接着，我们再输入 `key 2` 选择第三个密钥。

![](https://ws4.sinaimg.cn/large/006tNc79ly1fnppq8ms3xj308105lq2u.jpg)

接着再输入 `keytocard` 传入 Yubikey，选择对应的密钥类型就行了。

## 关于 keytocard 的说明

当你使用了 keytocard 之后会发现，好像你的密钥并没有传出去啊？

如果你使用 `gpg2 --export-secret-keys` 也能正常导出，这是怎么回事呢？

其实，`keytocard` 的确将你的密钥导出了，但是它在电脑里面留下了一个 stub，这个实际上是没有什么用的。

使用 `gpg2 --export-secret-keys` 可以将你的密钥导出，但是，并没有什么卵用，它不是真的私钥，如果你将你的 Yubikey 恢复出厂设置，删掉你的私钥并将这个新导出的导入。

然后你就会发现你**并没有导入私钥**，在你的钥匙链里面显示的你的密钥是**公钥**，并不是密钥对。

这也是为什么我一再强调必须备份私钥并记住密码的原因了；

假如你随便乱搞，没有备份私钥又将 Yubikey 恢复出厂设置，那么你的私钥就彻底丢失了。

## 使用密钥

GPG 能干嘛呢？可以给邮件加密，给 Git Commit 签名之类的。

或者你可以直接用 `gpg2 --clearsign` 签名一段信息；

如果你没用 Yubikey，那么 GPG 会直接询问你的密钥 passphrase；

但是如果你使用了 Yubikey，那么它就不会问你 passphrase，而是问你的 Yubikey PIN 作为密码。

如果你在 Yubikey 拔掉的时候进行 GPG 签名或者加密操作，那么它就会要求你插入智能卡。

如果你遇见了上面的情况，那么就说明你的配置成功了。

## Yubikey 的支持性

目前来看，PC 端(Mac)和 Android 都支持使用 Yubikey；

但是 Chrome 插件就不行了，还是只能使用 passphrase 解锁私钥。

这也是为什么要让你记住 passphrase 的原因。

## 最后

说了这么多，最后欢迎大家导入我的公钥给我发加密邮件。

我的密钥是 E449298F
指纹：E219 29F0 DEC5 FAEC 434A  91D7 E22B 63C2 E449 298F

你应该会至少看到 3 个标识，两个邮箱，一个 PhotoID；

其中邮箱有 Tsanie Lily(1701D0C1) 的签名。
