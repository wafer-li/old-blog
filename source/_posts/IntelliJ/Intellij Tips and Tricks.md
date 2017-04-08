---
title: Intellij Tips and Tricks
date: 2017-04-08
categories: IntelliJ
tags: IntelliJ
---

## 1. 跳转

**原则： 尽量不使用鼠标、不使用标签页**

1. `command + O` 跳转到特定的类


2. `shift + command + O` 跳转到文件
    > 使用 `: + 行号` 可以快速跳转到特定文件的特定行


3. `alt + command + o` 变量、方法跳转

    > 使用 `<class>.<symbol>` 可以跳转到特定类的方法或者变量


4. `double shift` Search Everywhere

    > 上述方法的综合体

5. `command + E` Recent Files


6. `shift + command + E` Recent Changed Files


7. `command + [` 和 `command + ]` 在之前打开的文件前后跳转


8. 在 Project Window 使用 **Auto Scroll from Souce**，使用 `command + ↓` 来跳转到源文件


9. 在方法名、变量名和类名使用 `command + B` 可以跳转到声明部分


10. 在方法名、变量名和类名使用 `command + U` 可以跳转到继承链的上一级，即超类


11. 在声明部分使用 `alt + command + B` 可以查看所有的 **实现** 并进行跳转


12. 在变量声明部分使用 `ctrl + H` 可以显示整个变量、类的继承结构


13. 在方法名使用 `shift + command + H` 可以显示方法的继承结构


14. 在文件中使用 `command + F12` 可以显示一个当前类所有成员的 Popup 窗口

    > 也可以使用 `command + 7` 来打开结构窗口来查看


15. 使用 `command + ↑` 来打开 Navigation Bar， **不要把它长期显示在屏幕上**


16. 使用 `F2` 和 `shift + F2` 来在错误之间跳转

    > 在右上角的感叹号图标右键点击，可以设置 **只在 Error 之间跳转**

<!-- more -->## 2. 新建

1. 在 Project Window 使用 `command + N` 来新建文件或者 package 或者目录


2. 使用 `abc/def/ghi/mnop` 这种文件夹名来建立文件夹结构，而不要一个一个建立


3. 同上，在新建文件时，也可以使用 `abc/def/test.txt` 这种文件名来构建一个在文件夹内部的文件


4. 同，使用 `abc.def.ghi.Hehe` 这种 **类名** 可以建立一个 **在包内的类**


5. 焦点在编辑器时使用 `ctrl + alt + N` 来进行上述新建操作


6. 使用 `command + shift + N` 新建一个临时文件(Scratral File)

    > 临时文件可以是任何文件，也可以成功的编译运行。
    > 实际上就是用来给开发者进行一些小测试用的

## 3. 重构

1. 使用 `alt + ↑` 来选择一行代码

    > 持续点击会继续选择更大的作用域：
    > 方法 -> 内部类 -> 外部类 -> 文件


2. 使用 `alt + ↓` 来缩小选择的作用域范围


3. 使用 `alt + shift + ↑/↓` 来 **移动选择的代码**


4. 使用 `shift + command + V` 来打开剪切板历史记录

    > 不包括 IdeaVim 的剪贴板历史记录


5. 使用 `alt + shift + 左键点击` 来设置一个 Multicursor

    > **不要使用这个功能来进行代码重构**
    > 可以使用多重指针来进行复制粘贴操作

6. 使用 `shift + F6` 来进行变量重命名


7. 使用 `alt + command + L` 进行当前文件的代码格式化


8. 使用 Code Cleanup 来进行整个工程级别的代码格式化


9. 选择一段代码然后使用 `alt + Enter` 可以对当前片段的代码格式进行调整。


10. 使用 `ctrl + T` 可以调出 Refactor This 菜单，有很多重构功能可以使用

## 4. Language  Injection

在 **字符串** 使用 `alt + Enter` 选择 `inject language` 可以让 IDEA 认定当前字符串的语言成分，从而进行相应语言的提示和工作。

1. 选择 `json` 可以在 JSON 编辑框中编辑纯 JSON 内容，IDEA 会自动生成相应的 Java 字符串


2. 选择 SQL 可以进行 SQL 补全，同时选择链接的数据库进行执行。

    > 同时，如果在 SQL 字符串中使用重构功能，IDEA 不仅会重构代码内容，同时还会对 **数据库** 内容进行修改

3. 选择 **正则表达式** 可以在对应的 Hover 框内对正则表达式进行检验


<!-- more -->## 5. 补全

1. 使用 `ctrl + shift + Space` 进行 **智能补全**


2. 使用 `command + P` 来获取 **所调用方法的参数信息**


3. 使用 `ctrl + alt + Space` 可以补全方法名和类名


4. 使用 `alt + /` 来进行变量补全和 **变量命名补全**


5. 使用 `shift + command + Enter` 可以补全当前语句块

    > 不仅仅是分号补全，还可以是大括号补全


## 6. 模板

1. 使用 `command + J` 来插入已经定义好的 Live Template

    > 可以打出 Live Template 然后使用 Tab 进行补全
    > 不过使用 `command + J` 可以给予提示
    >
    > 常用的：`psvm -> public static void main(String[] args)`

2. 在选择了一段代码的情况下，使用 `alt + command + T` 可以将代码用特定的结构包起来

    > 比如说 `if-else` 、`try-catch` 等等


3. 使用调用可以在列表中选取 Postfix Completion，具体效果和上面相同


4. 模板不仅仅支持 Java，还支持例如 HTML，CSS， Javascript 等多种语言


## 7. 代码分析

1. 使用 Code Inspection By Name 可以分析特定的错误和缺陷


2. 使用 Structural Search/Replace 可以进行特定的代码结构的查找和替换，同时，可以将其加入 Inspection，进行错误提示


3. 使用 Analyze Data Flow 可以分析特定变量的流动，有助于读懂他人代码

<!-- more -->## 8. 版本控制

1. 选择两个 commit 然后使用 `ctrl + D` 来进行 Diff


2. 使用 Annotate 可以查看一个文件中的各行的修改


3. 使用 `command + K` 进行 commit 操作


4. 使用 `shift + command + K` 进行 push 操作


5. 使用 `alt + command + Z` 进行 revert 操作


6. 使用 `ctrl + V` 调出 有关版本控制的 Popup 窗口

## 9. 调试

1. 右键点击断点区域，可以设置断电的 condition

    > 还有个 More 可以点击


2. 在调用栈区域，可以选择 Drop Frame 将选择的 Frame 进行出栈操作

    > 如果不小心 Step Into 太深的话可以使用这个

## 10. 其他

1. 使用 **ctrl + \`** 来进行代码样式、快捷键等的快速切换


2. 可以在设置中定义一个常用的 Quick List


3. 使用 `alt + F12` 可以调出 IDEA 内置终端


3. Help 菜单中的 Productive Guild 记录了使用的 IDEA 功能，包括功能的解释和使用频率


4. Registry 内有一个选项可以减少输入延迟(editor latency)
