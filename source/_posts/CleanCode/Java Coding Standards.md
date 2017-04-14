---
title: Java Coding Standards
date: 2016-11-18
categories: CleanCode
tags: CleanCode
---

## 1. Naming

### 1.1 Common

1. Do not allow `a, an, the` appear in the name
> `theCode`, `anException`, `getTheResult()`, are all **NOT** correct.

2. Name should be divide into words
> `reSetStatus` are **not** correct, it should be `resetStatus`

<!-- more -->

3. Not allow single character prefix of variable name
> The `aName`, `kFlag`, `cBook` are all **NOT** correct
>
> The name should be as meanningful as possible

### 1.2 Special for identifiers

#### 1.2.1 Class

ClassName use the **UpperCamelCase**

#### 1.2.2 Variable

1. variableName use the **lowCamelCase**
2. Single character name should **only** appears in the **Iterator**
    ```java
    // They are okay
    for(int i : int[])
    for(int i = 0;i<50;i++) {}

    // They are bad
    int k;
    int i;
    for (int j = 0; j < 50; j++) {
        int i;
    }
    ```
> But avoid using the single character name as possible

3. Not allow underscores
```java
// That's not allow
int red_color;
```

#### 1.2.3 Method

1. methodName() use the **lowCamelCase**
2. Do **NOT** allow single chracter
    ```java
    // That's not allow
    public void a() {}
    ```

3. Do **NOT** allow underscores
    ```java
    // They are not allow
    public void ini_Data() {}
    ```

#### 1.2.4 Paramater

1. Do **NOT** allow 1 character paramater
```java
// That's not allow
public void resetPosition(int a) {}
```

#### 1.2.5 Constant

Constant name use `CONSTANT_NAME` style. All UPPERCASE character and sperated by underscores.
Every constant is in **static** **final** field, but not all static final field is constant

```java
// Constants
static final int NUMBER = 5;
static final ImmutableList<String> NAMES = ImmutableList.of("Ed", "Ann");
static final Joiner COMMA_JOINER = Joiner.on(',');  // because Joiner is immutable
static final SomeMutableType[] EMPTY_ARRAY = {};
enum SomeEnum { ENUM_CONSTANT }

// Not constants
static String nonFinal = "non-final";
final String nonStatic = "non-static";
static final Set<String> mutableCollection = new HashSet<String>();
static final ImmutableSet<SomeMutableType> mutableElements = ImmutableSet.of(mutable);
static final Logger logger = Logger.getLogger(MyClass.getName());
static final String[] nonEmptyArray = {"these", "can", "change"};
```

#### 1.2.6 Camel case: defined

With the defined name, should still obey the camelCase


Prose form|	Correct|	Incorrect
---|---|-----
"XML HTTP request"|	XmlHttpRequest|	XMLHTTPRequest|
"new customer ID"	|newCustomerId	|newCustomerID|
"inner stopwatch"	|innerStopwatch|	innerStopWatch
"supports IPv6 on iOS?"	|supportsIpv6OnIos|	supportsIPv6OnIOS|
"YouTube importer"|	YouTubeImporter


## 2. Formatting

### 2.1 Braces

#### 2.1.1 Braces is used as much as possible

Braces are used with `if`, `else`, `for`, `do` and `while` statements, even when the body is empty or contains only a single statement.

#### 2.1.2 Non-Empty braces:use the K & R style

> `{` should after a space and appear at the end of line
`(` of control statement should have a space before it
`(` of method should have no space before it

```java
return new MyClass() {
  @Override public void method() {
    if (condition()) {
      try {
        something();
      } catch (ProblemException e) {
        recover();
      }
    }
  }
};
```

### 2.2 Blank

Blank should appear:

1. Between methods
    ```java
    public void doSomeThing() {}

    public void doOtherThing() {}
    ```
2. Between Set of attrs
    ```java
    // That's attrs set of context and container
    protected View mRootView;
    protected SetPersonalizedInfoActivity mContext;

    // That's attrs set of widget
    private WheelView firstTypeLpv;
    private WheelView secondTypeLpv;
    private TextView nextQuestionTxt;

    // That's attrs set of data
    private UserBean userBean = UserBean.getInstance();
    ```
