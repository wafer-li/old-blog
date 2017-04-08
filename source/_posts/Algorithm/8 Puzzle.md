---
title: 8 Puzzle
date: 2017-04-08
categories: Algorithm
tags: Algorithm
---

## 1. Intro

Give a 3-by-3 grid with 8 square blocks and 1 blank.
Rearrange the block to make it in order, using as **few moves** as possible.

Return the result of sequence. Like this below:

```
    1  3        1     3        1  2  3        1  2  3        1  2  3
 4  2  5   =>   4  2  5   =>   4     5   =>   4  5      =>   4  5  6
 7  8  6        7  8  6        7  8  6        7  8  6        7  8

 initial        1 left          2 up          5 left          goal
```

<!-- more -->## 2. Best-first search

The best-first search is that from initial broad to the goal, we do our each step at the best, or small cost move.

### 2.1 Search node

First, we need to define our start and goal. We use a terminology called
