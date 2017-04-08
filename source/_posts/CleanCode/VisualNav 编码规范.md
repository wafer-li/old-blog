---
title: VisualNav 编码规范
date: 2016-11-18
categories: CleanCode
tags: CleanCode
---

## 1. 通用规范

VisualNav 项目的代码文件主要包含 Java、XML 以及 Gradle 三种。对于所有的代码文件，都需要遵守以下几条规范：

 1. 所有代码文件都必须使用 **UTF-8** 进行编码；

 2. 使用空格而不是制表符进行缩进，每个缩进的单位为 4 字符（使用 Android Studio 默认配置即可，不要修改缩进配置）；

 3. 每行仅书写一条语句，多条语句不能写在同一行中；

 3. 限制代码行的长度，每行不应该超过 100 字符。如果一条语句的长度超过 100 字符，需要适当地进行断行，具体断行的方法会在不同文件类型的规范中进行规定；

 4. 注释详细。推荐使用英文注释，也可以使用中文进行注释。对注释的具体要求会在不同文件类型的规范中进行规定；

 5. 每个代码文件的末尾必须有且只有一个空行。


<!-- more -->

## 2. Java 编码规范

### 2.1 文件组织

每个 Java 源文件都必须包含一个唯一的公共类或者接口，这个公共类或者接口与所在文件同名，并且必须是文件中的第一个类或者接口。与公共类相关的私有类和接口可以在公共类的定义之后进行定义。

### 2.2 注释

必须使用 **Javadoc** 标准注释。具体注释要求如下：

#### 2.2.1 类/接口注释

对于每个类和接口，都应该在类和接口定义之前给出一条注释，介绍这个类的主要功能。注释可以是名词性质的短语，也可以是以第三人称的动词开头的句子

例如：

```java
/**
 * A request for fetching user info.
 */
public class UserInfoRequest extends Request {
    ...
```

#### 2.2.2 方法注释

对于类中**自建**的方法，必须在方法定义之前给出一条注释，描述方法的用途、参数、返回值以及可能抛出的异常。注释是以第三人称的动词开头的句子。

例如：

```java
/**
 * Parses a {@link org.json.JSONObject} into a User object.
 *
 * @param userObject {@link org.json.JSONObject} to be parsed
 * @return a User object
 * @throws JSONException if JSON is invalid
 */
public User parseJson(JSONObject userObject) throws JSONException {
    ...
```

一般情况下，类中属性的 get 和 set 方法不需要 Javadoc 注释。如果 get 和 set 方法会带来特殊的效果，或者对应的属性不容易理解，就需要提供注释。例如：

```java
/**
 * Sets the last name of user.
 * Name of user will also be update: 2016-11-18
 */
public void setLastName(String lastName) {
    this.mLastName = lastName;
    this.mName = this.mFirstName + " " + this.mLastName;
}
```

#### 2.2.3 一般注释

主要包括代码块注释和行尾注释。

 1. 代码块注释

    编写方法的时候，需要为每个代码块加上一条注释，描述这个代码块的功能。简单的代码块（如变量声明）无需注释。注释是以第三人称的动词开头的句子。如果注释只有一行，使用单行注释（`//`），否则使用块注释（`/* ... */`）。

 2. 语句注释

    一些关键的、不易理解的语句需要加上注释进行解释。

     - 如果注释内容很短，使用单行注释（`//`）在行尾添加注释，并与语句之间留有一定的间隔使之可读。此时对注释的书写格式没有具体要求。

     - 如果注释内容较长或者语句较长，使用单行注释（`//`）在语句之前添加独立的一行注释。注释的书写格式和代码块注释相同。

例如：

```java
// Prepares parameters for the request.
JSONParams params = new JSONParams();
params.addParam("name", mName);

// Fills up the request.
mRequest = new JsonObjectRequest(mUrl, null,
        new Response.Listener<JSONObject>() {
            ...
        },
        new Response.ErrorListener() {
            ...
        }
);
mRequest.setShouldCache(false); // disable caching

// Executes the request.
super.execure();
```

##
<!-- more -->

## 2.2.4 关于调试用注释

master 分支或合并到 master 分支的代码不允许出现调试用的注释
所谓调试用的注释即为，为了**调试目的**而使某些代码**暂时失效**的注释
例如：

```java
public void doSomeThing() {
    do1();
    do2();
//    do3();    // 此即为调试用注释，master 分支上的代码不允许出现这种注释
}
```
有关 Git 的规范，请看下面的 [Git 规范](#git-standards) 部分

### 2.3 缩进与排版

除了第 1 节中提出的一些通用规范，还应该遵守以下缩进和排版的规范。


<!-- more -->

#### 2.3.1 换行

对于长度过长的语句，必须按以下规则断行：

 1. 可以在逗号后断行；

 2. 可以在运算符前面断行；

 3. 新的一行开头应该与上一行同一级别的表达式开头对齐；

 4. 如果满足以上规则导致代码较为混乱，新的一行开头可以改为缩进8个字符。

以下是一些对长语句断行的例子：

 1. 长度过长的方法定义和调用，可以在参数处进行断行，并保持参数对齐。

    ```
    public UserInfoRequest(Context context, String name,
                           RequestSuccessListener<User> successListener,
                           RequestErrorListener errorListener)
    ```

 2. 在运算符处断开较长的表达式。

    ```
    num1 = num2 * (num3 + num4 - num5) / num6
            + (num7 - num8) * num9 / num10;
    if ((condition1 || condition2)
            &&  (condition3 || condition4)
            && !(condition5 || condition6)) {
        ...
    }
    ```

大括号的使用规则：在任何情况下，左大括号（`{`）都要与语句在同一行，右大括号（`}`）独占一行。

```
// 正确                    错误
if (a == 1) {             if (a == 1)
    ...                   {
}                             ...
                          }
```

编写方法时，按功能、步骤对代码进行分块，以一个空行分开不同的代码块。每个代码块都需要给出解释其作用的注释，具体格式参考 2.2.3 节。

##
<!-- more -->

## 2.3.2 空格与括号

需要在适当的位置插入空格或使用括号，使代码更可读。

 1. 除一元运算符和 `.` 之外，运算符与运算数之间需要以空格分隔。

    ```java
    // 正确                    错误
    a = 0                     a=0
    a + b                     a+b
    a < b                     a<b
    a && b                    a&&b
    !a                        ! a
    a++                       a ++
    user.getName()            user . getName()
    ```

    `for` 循环头的写法为：

    ```java
    for (int i = 0; i < n; i++)
    ```

    括号与操作数之间不需要空格，例如：

    ```java
    // 正确                    错误
    if (a == 1)               if ( a = 1 )
    ```

    左大括号（`{`）之前需要一个空格，例如：

    ```
    // 正确                    错误
    if (a == 1) {             if (a == 1){
        ...
    }
    ```

 2. 关键字与括号之间要添加 1 个空格，方法名、类名和括号之间不需要空格。

    ```java
    // 正确                    错误
    if (a == 1)               if(a == 1)
    while (b == true)         while(b == true)
    User user = new User();   User user = new User ();
    user.setName("Name");     user.setName ("Name");
    ```

 3. 注释符号（`//`、`/*` 和 `*/`）与注释内容之间需要加一个空格。

    ```java
    // 注释符号与注释之间有一个空格
    /* 就像这样 */
    ```

 4. 强制类型转换后需要有一个空格。

    ```java
    mTextView = (TextView) findViewById(R.id.text)
    ```

 5. 必要时需要为一些表达式加上括号（即使并没有出现运算符优先级的问题），以增强代码的可读性。例如：

    ```java
    if ((a && b) || (c && d) || e) {
        ...
    }
    ```

#### 2.3.3 空行

在适当的位置插入空行使得代码更具有可读性：

1. 在**两个方法之间**要空两行

    ```java
    public void doSomeThing() {
        // There
        // are
        // a
        // lot
        // of
        // stuffs

        /*
        * I cannot
        * simply
        * count
        */
    }


    public void doOtherThing() {
        // There
        // are
        // a
        // lot
        // of
        // stuffs

        /*
        * I cannot
        * simply
        * count
        */
    }
    ```

2. 在类的**不同的属性集合之间**要有空行

    ```java
    // 上下文和视图 container
    protected View mRootView;
    protected SetPersonalizedInfoActivity mContext;

    // 各视图组件
    private WheelView firstTypeLpv;
    private WheelView secondTypeLpv;
    private TextView nextQuestionTxt;

    // 数据域
    private UserBean userBean = UserBean.getInstance();
    ```
3. 类的成员变量和方法之间要有空行

    ```java
    // 上下文和视图 container
    protected View mRootView;
    protected SetPersonalizedInfoActivity mContext;

    // 各视图组件
    private WheelView firstTypeLpv;
    private WheelView secondTypeLpv;
    private TextView nextQuestionTxt;

    // 数据域
    private UserBean userBean = UserBean.getInstance();

    //方法
    public void doSomeThing() {}


    public void doOtherThing() {}
    ```

4. 如果有内部类或内部接口，内部类与上下文要空**两行**

    > 若内部类或接口在所有代码的尾部，则不需要与下文有空行

    ```java
    public class OuterClass {
        public void doSomeThing() {}


        public void doOtherThing() {}


        class InnerClass {
            // 这里是内部类的一些东西
        }


        public void methodBehindInnerClass() {}
    }
    ```

5. 方法内部**不同功能**的代码块要空行

    ```java
    public void onPrevFragment() {

        // Pop back stack
        fragmentManager.popBackStack();

        int index;

        // Find index
        for (index = 0; index < fragmentTitles.length; index++) {
            if (currentFragmentTag.equals(fragmentTitles[index])) {
                break;
            }
        }

        // Set currentFragmentTag
        if (index > 0) {
            currentFragmentTag = fragmentTitles[index - 1];
        }

        // Set title
        assert getSupportActionBar() != null;
        getSupportActionBar().setTitle(currentFragmentTag);

    }
    ```

###2.4 命名规范


<!-- more -->

####2.4.1 通用规范

1. 将缩写词作为普通单词处理。
     例如在类名中：

    ```java
    class XmlParser  // 而不是 XMLParser
    ```

2. 不允许出现 `a, an, the` 等冠词

    ```java
    void getTheResult()   // 错误

    void getResult()    // 正确
    ```

3. 除**常量外**，其余命名不允许出现下划线字符(`_`)

####2.4.2 包名

包名必须为全小写字母。如果出现多个单词构成的包名，不进行分隔。例如：

```
com.example.packagename
```

####2.4.3 类名

类名必须是名词或名词短语，每个单词首字母均大写。例如：

```
class ImageDownloader
```

####2.4.4 接口名

与类名规则相同。不需要加 `I` 前缀。

```
interface OnButtonClickListener  // 而不是IOnButtonClickListener
```

####2.4.5 方法名

方法名是一个动词或动词短语，第一个单词的首字母小写，其余单词首字母均大写。例如：

```
public int getId()
private void start();
```

#### 2.4.6 变量与常量名

常量名所有字母均大写，单词之间以下划线（`_`）分隔。例如：

```
public static final String DATABASE_NAME = "...";
```

类中的成员变量需要加前缀 `m`，每个单词首字母大写。例如：

```
private String mLastName;
public int mAge;
```

~~~类的**静态**成员变量需要添加前缀 `s`，其余每个单词首字母大写。例如：~~~

```
// 抛弃的旧规范
private static int sCountOfInstances;
```

局部变量第一个单词首字母小写，其余每个单词首字母大写。例如：

```
public void method() {
    int tempVariable;
    ...
}
```

### 2.5 其他规范

#### 2.5.1 异常处理

 1. 异常处理的首要原则是**不能忽略异常**。例如以下代码是不可取的：

    ```
    try {
        JSONTokener jsonTokener = new JSONTokener(jsonString);
    } catch (JSONException ex) { }
    ```

    捕获到异常，必须对异常进行处理。

 2. 不能捕获顶级异常（`Exception`）。

    必须根据异常的种类分别进行捕获和处理，不能直接捕获 `Exception`。以下代码是不可取的：

    ```
    try {
        ...  // 这里会抛出多种异常
    } catch (Exception ex) {
        ...
    }
    ```

    正确的做法是：

    ```
    try {
        ...
    } catch (OneKindOfException ex1) {
        // 处理 ex1
    } catch (AnotherKindOfException ex2) {
        // 处理 ex2
    }
    ```

#### 2.5.2 import 规范

不要手动输入 `import` 语句或手动调整 `import` 之间的顺序，而应通过 Android Studio 提供的自动 import 功能来管理。

例如，如果需要导入 `java.util` 包的 `ArrayList` 类，只需要输入 `ArrayList`，根据 Android Studio 自动弹出的提示选择正确的类，即可自动添加一条 `import java.util.ArrayList;` 语句。

如果出现了导入之后没有使用的情况，应该对废弃的 `import` 语句进行清理。

#### 2.5.3 Java Annotation 的使用规范

Annotation 必须出现在其他任何修饰符之前，每个 Annotation 独占一行。例如：

```
@Override
protected void onCreated(Bundle savedInstanceState) {
    ...
}
```

只要类中的一个方法覆盖了所在类或者父类中的方法，必须为这个方法加上 `@Override`。

#### 2.5.4 使用 TODO 注释

TODO 注释用于标记和管理待办事项。在当前无法完成某项工作时，必须将待办的工作用 TODO 注释写在相应的位置。TODO 注释的用法是：只要在注释中出现独立的（作为一个独立单词的）`TODO`，即可生成 TODO 注释。

一般的做法是在注释开头标记 `TODO`。例如：

```
// TODO: add a click listener for button
```

## 3. XML 编码规范

XML 文件的编码规范以 Android Studio 默认格式为准，主要包括以下几条要求：

 1. 命名空间（`xmlns`）全部写在 XML 文件根元素的开始处，并按字母顺序排序；

 2. 元素的 `id` 属性必须位于其他所有属性之上，布局和尺寸属性位于 `id` 属性下方、其他属性之上；

 3. 不同元素之间必须以一个空行分隔；

 4. 元素的开始标签中，属性不能和元素出现在同一行，并且向右缩进4个字符；

 5. 所有字符串不允许硬编码，必须统一写入 `strings.xml` 资源文件并通过 `@string` 标记引用；

 6. 不含有内容的元素必须使用闭合标签（`<name />`），不能使用标签对（`<name></name>`）；

 7. 编辑完成 XML 文件后，请使用 Android Studio 的 Code 菜单中的 **Reformat Code** 功能对格式进行自动调整。


## 4. Git 规范 {#git-standards}

这里主要遵循的是 Git Flow 的简化版，主要包括以下几点要求：

### 4.1 提交

1. 请保证以下操作在 commit 之前完成

    > 进行代码分析，解决可以解决的 Warning。
    优化 import 语句
    Reformat 代码

2. 关于 Commit Message

- 以动词开头的祈使句，首字母大写

    ```
    git commit -m "Add GSON module"
    ```
- 信息过多，应进行折行，而不能在一行内写完

    > 此时应使用 `git commit` 在弹出的编辑器中填写多行信息

    ```
    git commit

    """
    Fix the moudule:
    1. Remove the unnessary method
    2. Replace the ListView with RecyclerView
    """
    ```

- Commit Message 内容应要尽量意义丰富。

    > 尽量说明操作内容和所涉及到的部分

    ```
    "Fix bug" // 错误
    "Fix not render bug of the register page"   // 正确
    ```

- 建议采用 "Fix issue" 形式来让 Message 更加简洁

    > 相应的，在对应的 issue 就要对问题进行详细的描述

    ```
    // 都是正确的
    "Fix #1"
    "Fix the bug of #2"
    "Fix the render bug of #3"
    ```


<!-- more -->

### 4.2 拉取

1. 养成良好习惯，编码前先同步 master 分支

    > 如果有重构相应事项，先进行处理后再编码

2. 采用 `git pull --rebase` 代替简单的 `git pull`

    > rebase 可以生成相对简洁的版本线图


### 4.3 分支

- 不设立 develop 分支
- master 分支应是**随时可以运行**的，不允许出现不可运行的错误（编译错误，打开即 Crash 等）
- 各分支的内容应基于**最新的** master 分支程序**架构**进行编写，可以随时无冲突的 merge 到 master


<!-- more -->

### 4.4 合并

1. 向 master 分支的合并

- 原则

    > 必须通过 Pull Requet 进行
    合并到 master 分支的代码不允许出现调试用的注释
    **所有分支应保证彻底运行无误后，才能 merge 到 master**

- Feature 分支向 master 分支的合并

    > 原则上，管理员应在 **18 小时**之内回应**项目组成员**的 PullRequest，若管理员超时未进行回应或合并操纵，开发者可经测试后**自行合并**。
    但仍然需要提出 Pull Request 并阐述分支的 Changelog, 以便代码审查。

- HotFix 分支向 master 分支的合并

    > HotFix 分支的合并可以**不经管理员批准或等待流程**快速合并到 master 上。
    但仍需要提出 Pull Request，保留 Changelog （紧急的可以合并后再写）

2. 其他分支的相互合并

- **不允许**使用 Pull Request 进行

    > 其他分支的相互合并由负责成员之间相互协商解决

- 其他要求放宽

    > 可以存在不能运行的 bug，但是必须在 merge 到 master 分支之前解决。

### 4.5 冲突

1. 冲突**必须立即解决**，不允许忽视冲突 force push
2. 由其他分支相互合并引起的冲突，由相应开发者进行协商处理
3. 关于向 master 合并的冲突，请查看[重构](#refactor)部分

    > 由于所有分支必须基于最新 master 程序架构编写，会出现此种冲突的场景仅存在于重构和 HotFix


<!-- more -->

### 4.6 重构 {#refactor}

1. 重构前

    > 需要重构时,重构发起人 **必须发起 Issue 阐述重构 TODO 事项和最终的 Changelog**


2. 重构中

    > 重构**不允许**直接在 master 分支进行修改，应**新建分支**进行重构 commit

3. 重构完成后

    > 重构完成后，向 master **提交 Pull Request**，视为 Feature 分支向 master 分支合并进行处理流程。
    分支一旦被合并，合并操作者（**管理员或相应重构开发者**）应立即在各类有效平台通知各分支开发者。
    各分支开发者应在接收到通知后**立即** merge master 分支，以保证基于最新 master 分支进行编写。

4. 关于冲突

    > 重构 Issue 应说明相应文件和目录结构变化情况
    当各分支 merge master 出现冲突时，按照相应 Issue 的修改进行 resolve conflict.

### 4.7 热修补 （HotFix）

1. 热修补即是**紧急的重构**
2. 热修补发起人必须尽快通知管理员和项目组其他成员

    > 应使用可能的包括但不限于以下的通知方式:
    **项目 Issue**，QQ，微信，Telegram，邮件，电话，各协作平台等。
    热修补可以不提出 Issue，但应在对应的 Pull Request 中说明对应的修改内容。

3. 热修补仍然需要在新分支进行操作，但合并时无需经等待或批准流程。

    > 但仍然需要提出 Pull Request，之后可自行合并。
    注意，必须要在 Pull Request 中说明热修补的修改事项。（可以在合并后添加评论）

4. 其余事项均遵守重构相关规范
