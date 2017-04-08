---
title: PHP
date: 2017-04-08
categories: PHP
tags: PHP
---

## 1. Basic

1. Begins with `<?php` and ends with `?>`
    ```php
    <?php
    echo strlen("Hello, World!");
    ?>
    ```

2. Comments
> `//` and `#` for a single line.
`/*  */ ` for block.

    ```php
    <?php
    // Single line Comment.
    # Also single line.
    /*
    And comment block,
    Cross
    multiple
    lines.
    */
    ?>
    ```

3. Case Sensitivity
- All the `function()` `class` and the `key word` is **NOt cAse SenSiTivE**

    ```php
    <?php
    // They all do the same things.
    ECHO "Hello World!<br>";
    echo "Hello World!<br>";
    EcHo "Hello World!<br>";
    ?>
    ```

- But the `$variable` is **CASE SENSITIVE**

    ```php
    <?php
    // Only the FIRST statement can do the right output.
    $color="red";
    echo "My car is " . $color . "<br>";
    echo "My house is " . $COLOR . "<br>";
    echo "My boat is " . $coLOR . "<br>";
    ?>
    ```

<!-- more -->## 2. Variable

1. The `$variable` begins with the `$` char.

    ```php
    <?php
    // They are all variables
    $x = 5;
    $txt = "Hello, World!";
    $y = 10.5;
    ?>
    ```
2. Weak Type
> PHP is an weak type language, you do not have to announce the type when you create the variable
As the above, `$x` is an **int**, `$txt` is an **string** and `$y` is an **float**

3. Scope
- Local
        - The variable can only be konwn inside the function or the current statement
- Global
        - The variable can be konwn at any where
- Static
        - The variable whose value can be maintain

4.
