---
title: Computer Organization and Architecture
date: 2016-10-14
categories: COA
tags: COA
---

## Introduction


<!-- more -->

### 1.Basic Concepts

- Architecture: such as **Instruction set**, **I/O mechanisms** (Visiable to programmer)
- Organization: such as the **Control singals**, **interfaces**, **memory technology** (NOT visiable to the programmer)
- Family of computer models(系列机): All with the same architecture but with differences in organization. Such as **Intel 286** and **Intel 386**
- Organization is the high-level aspect of computer design, Hardware is the specific mechine.
- The computer system include:
    - Hardware
    - Software
    - Peripheral device
        - Keyboard and mouse and so on.
- The computer consist of:
    - CPU(or processor)
    - Input & Output
    - Main Memory
    - System Bus
- The **CPU** consist of:
    - Control Unit(CU)
    - Arithmetic and Logic Unit(ALU)
    - Registers
    - Internal Bus

## Computer Performance design and assessment


<!-- more -->

### 1. Designing for performance

> - Three things affect the performance:
    - Microprocessor speed
    - Performance balance
    - Improvements in chip organization and architecture

##
<!-- more -->

## 1) The Microprocessor Speed

By adding these things to improve the performance:

- Branch prediction
- Data flow analysis
- Speculative execution

##
<!-- more -->

## 2) The balance (Balance is the key)

> With the microprocessor speed increasing rapily refer to the Mooore's Law, the Memory accessing sppeding is on the contrary, cannot catch the speed of the microporcessor increase.

Solutions for memory access:

- Make DRAM "wider" rather than "deeper"
Increase number of bits retrieved at one time

- Change DRAM interface (by using cache)
- Reduce frequency of memory access
    - more complex cache and cache on chip
- Increase interconnection bandwith
    - High speed buese
    - Hierarchy of buses

> The I/O devices are much more slow than the memory access

Solutions for I/O devices:

- Caching
- Buffering
- Higher-speed interconnection buses
- More elaborate bus structures
- Multiple-processor configurations

##
<!-- more -->

## 3) Imporve the chip O&A

- Increase hardware speed of processor
    - Power
    - RC delay
    - Memory latency
- Increase size and speed of caches
    - Multiple levels of caches
    - Increase the chip density
- Change processor organization and architecture
    - Enable parallel execution of instructions
    - Pipeline works like assembly line
    - Superscalar allows **multiple pipelines within single processor**
        - Instructions that do not depend on the other can be executed in parallel

> Supplement: Using the **multiple cores** can be more efficiency

### 2. Performance Assessment


<!-- more -->

#### 1) Clock Speed

**The clock speed is not every thing**


#### 2) Instruction Execution Rate

> There are three index of the rate, CPI, MIPS and MFLOPS

> - CPI: The time cycle with one instruction needed (Cycle Per Instruction)
- MIPS: The number(million) of the instructions within in one second being executed.
- MFLOPS: Like the MIPS, it is the floating point calculate instruction.

$$CPI = {{\sum_{i = 1}^n(CPI_i \times I_i)} \over I_c}$$
<div style="margin:0 auto;width:18em;">$I_c$ is the number of the instruction</div>

The processing time $T$ is:
$$T = I_c \times CPI \times \gamma$$
<div style="margin:0 auto;width:20em;">$\gamma$ is the constant cycle, which means $1/f$</div>

So, the MIPS is:

$$MIPS = {I_c \over {T \times 10^6}} = {f \over {CPI \times 10^6}}$$

$$MFLOPS = {{Number \ of\ execute\ floating-point\ operations\ in\ a\ program} \over {Execution\ time \times 10^6 }}$$

##
<!-- more -->

## 3) Amdahl's Law

> The speed up rate between the single core machine and the multiple cores machine.

$$Speedup = {{time\ to\ execute\ program\ on\ a\ single\ processor} \over {time\ to\ execute\ program\ on N\ parallel\ processors}} = {{T{(1 - f)} + Tf} \over {T{(1-f)} + {{Tf} \over N}} } = {1 \over {(1-f) + {f\over N}}}$$

$f$ refer to the code infinitely parallelizable with **no scheduling overhead**.
$(1-f) of code inherently serial$
$T$ is the total execution time for program on single processor
$N$ is number of processors that fully exploite parallel portions of code

> Conclusion:

> - $f$ small, parallel processor has little effect
- $N \sim \infty$, the speedup bound by $1/(1-f)$

##
<!-- more -->

## 4) Supplement
Some important terminology:
- Bit is the binary digit rather 0 or 1.
- A byte is defined as 8 bits
- A **word** is a set of bits constituting the samllest unit of addressable memory
- A kilobyte (KB) is $2^{10}$ bytes.
- A megabyte (MB) is $2^{20}$ bytes.
- A gigabyte (GB) is $2^{30}$ bytes.


## Computer System


<!-- more -->

### 1. Computer Components

- CPU
    - PC: programming counter, store the next instruction's address.
    - IR: instruction register, store the instruction
    - MAR: the memory address register, exchange data with the main memory
    - I/O AR: input and output address register
    - I/O BR: input and output buffer register
- Mian Memory
