---
title: Automata Theory and Formal Language
date: 2017-04-08
categories: Automata
tags: Automata
---

## 1. Automata

<!-- more -->### 1.5 The Central Concept of Automata Theory

#### 1.5.1 Alphabet

> - Alphabet is the **finite**, **non-empty** **Set** of the symbol
- Using the $\sum$ symbol stand for the Alphabet

##<!-- more -->## 1.5.2 String

> String, sometime called **word** is a **finite** sequence of symbols, which choose from the Alphabet.

- Empty String
> If the string has no symbol, it is empty String, use the $\epsilon$ stand for it.

- String's lenth
> The number of symbol in the the string called the **lenth** of the string, use the $|w|$ stand for the lenth of string $w$

- The power of Alphabet

> Use the exponent of the Alphabet like $\sum^k$ stand for the Set of string, which lenth is $k$, in $\sum$
Notice that $\sum^0 = \{\epsilon\}$

> The set of **all** strings in an Alphabet, use $\sum^*$
If remove the $\epsilon$ in the normal Alphabet, the rest is called $\sum^+$
$\sum^+ = \sum^0\bigcup\sum^1\bigcup\sum^2\bigcup\dots$

> $\sum^*=\sum^+\bigcup\{\epsilon\}$

##<!-- more -->## 1.5.3 Language
