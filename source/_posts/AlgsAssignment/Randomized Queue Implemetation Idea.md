---
title: Randomized Queue Implemetation Idea
date: 2017-04-08
categories: AlgsAssignment
tags: AlgsAssignment
---

## How to check full & empty?

- [x] Maintain a item size
- [ ] Calculate from pointer

<!-- more -->## How to resize?

1. Create a new array
2. Iterate the item in the origin array
3. Assign the new array to the old one

## How to iterate?

1. Initialization: begin at head
2. Next: `iterator = (iterator + 1) % array.length`
3. HasNext: `iterator != last + 1`

## How to add?

1. Check if is full, if so, double its size
2. `last = (last + 1) % array.length`
3. Place the item into the new last index position

## How to remove?

1. Generate a random integer within the range [0, Size)
2. Turn it to the index `randomInt + head`
3. Swap the item of that index with the head
4. Dequeue
