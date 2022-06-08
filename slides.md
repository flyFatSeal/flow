---
# try also 'default' to start simple
theme: seriph
# random image from a curated Unsplash collection by Anthony
# like them? see https://unsplash.com/collections/94734566/slidev
background: https://source.unsplash.com/collection/94734566/1920x1080
# apply any windi css classes to the current slide
class: 'text-center'
# https://sli.dev/custom/highlighters.html
highlighter: shiki
# show line numbers in code blocks
lineNumbers: false
# some information about the slides, markdown enabled
info: |
  ## Slidev Starter Template
  Presentation slides for developers.

  Learn more at [Sli.dev](https://sli.dev)
# persist drawings in exports and build
drawings:
  persist: false
---

# 递归与函数式的奥妙

<div class="pt-12">
  <span @click="$slidev.nav.next" class="px-2 py-1 rounded cursor-pointer" hover="bg-white bg-opacity-10">
    请按空格到下一页 <carbon:arrow-right class="inline"/>
  </span>
</div>

<div class="abs-br m-6 flex gap-2">
  <button @click="$slidev.nav.openInEditor()" title="Open in Editor" class="text-xl icon-btn opacity-50 !border-none !hover:text-white">
    <carbon:edit />
  </button>
  <a href="https://github.com/slidevjs/slidev" target="_blank" alt="GitHub"
    class="text-xl icon-btn opacity-50 !border-none !hover:text-white">
    <carbon-logo-github />
  </a>
</div>

<!--
The last comment block of each slide will be treated as slide notes. It will be visible and editable in Presenter Mode along with the slide. [Read more in the docs](https://sli.dev/guide/syntax.html#notes)
-->

---

# 内容前言

本次主要分享内容来源于[计算机程序的构造与解释](https://book.douban.com/subject/1148282/)的第三章和第一章

- 📝 **递归与迭代** - 代换模型的区别
- 🎨 **树形递归** - 斐波拉契数列
- 🧑‍💻 **动态规划** - 状态转移方程
- 🤹 **函数式与面向对象** - 思维模式的区别与建模方法论
- 🎥 **流** - 函数式中流的概念
- 📝 **数据结构和术语** - 流的核心数据结构和术语
- 📤 **延时计算** - 实现流的关键技术
- 🛠 **无穷流** - 无穷流的表示方式
- 🎥 **React 与函数式** - 漫谈 React 与函数式

<br>
<br>

<!--
You can have `style` tag in markdown to override the style for the current page.
Learn more: https://sli.dev/guide/syntax#embedded-styles
-->

<style>
h1 {
  background-color: #2B90B6;
  background-image: linear-gradient(45deg, #4EC5D4 10%, #146b8c 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

---

# 参考资料

本次分享主要代码片段来自于新加坡国立大学计算机学院 cs1101 课程，分享者对于实际内容理解有限，如有困惑或者启发，建议阅读原书籍和源码。

- 📝 **计算机程序的构造与解释** - [书籍](https://book.douban.com/subject/1148282/) [配套视频](https://www.bilibili.com/video/av8515129/) [练习题参考答案](https://github.com/jiacai2050/sicp)
- 📝 **JavaScript 版** - [新加坡大学 JS 版](https://sourceacademy.org/sicpjs/index) [配套源码](https://github.com/source-academy/sicp)
- 🎨 **The Little Schemer：递归与函数式的奥妙** - [书籍](https://book.douban.com/subject/27080946/) 可以作为阅读 SICP 的前置书籍
- 🧑‍💻 **电子书** - 推荐[zlibrary](https://zh.jp1lib.org/) 只是增加知识的获取方式，建议有条件还是购买正版书籍

---

# 递归与迭代

代换模型

```js
function square(x) {
  return x * x;
}
(square(6) + square(10))
//将参数带入 规约为
(6 * 6 + 10 * 10)
//通过乘法进一步规约
36 + 100
//加法运用
136,
```

以上代码的过程运用方式就称为代换模型，它将运用在下面的内容中帮助我们理解代码的执行过程

需要强调的是，代换模型只是帮助我们理解代码执行过程的一种方式，并不代表实际解析器和编译器就是这样工作的

---

# 递归中的形状

通过代换模型的思维方式拆解代码执行，我们可以清晰的看到代码执行过程中的"形状"，而这个形状就是研究代码执行速度和消耗资源的重要指标。

以阶乘函数为例: $n!=n\cdot(n-1)\cdot(n-2)\cdots3\cdot2\cdot1$

```js
function factorial(n) {
  return n === 1 ? 1 : n * factorial(n - 1);
}
factorial(6);
```

<div class="flex justify-center p-6 h-60">
  <img border="rounded" src="https://sicp.sourceacademy.org/img_javascript/ch1-Z-G-7.svg">
</div>

---

# 递归中的形状

上一页的代码可以理解为对阶乘公式的代码表示，现在我们换一个角度来计算阶乘，我们可以将计算阶乘 $n!$ 描述为：先乘 1 和 2，而后将结果乘以 3，再乘以 4，直到 n。更形式地说，我们维护两个变量，counter 和 product，count 是 1 ～ n 的计数器，这两个变量按照下面的规则变换：

$$
\begin{array}{lll}
\textrm{product}  \leftarrow  \textrm{counter} \cdot \textrm{product}\\
\textrm{counter}  \leftarrow  \textrm{counter} + 1
\end{array}
$$

<div  grid="~ cols-2 gap-2" >
<div>

按照这个规则我们可以把程序重新描述成

```js
function factorial(n) {
  return fact_iter(1, 1, n);
}
function fact_iter(product, counter, max_count) {
  return counter > max_count
    ? product
    : fact_iter(counter * product, counter + 1, max_count);
}

factorial(5);
```

</div>
<div class="w-full flex justify-center" >
<img border="rounded" class="max-h-3/5  " src="https://sicp.sourceacademy.org/img_javascript/ch1-Z-G-10.svg">
</div>
</div>

---

从计算结果看，两种方式并无区别，但从代换模型展开的计算过程来说，大不相同。第一个函数中，计算模型展示出一种先逐步展开而后收缩的形状，在这个过程中，解释器需要不断保存上一个函数中信息，保存的信息随着 n 而线性增长，这种计算过程称为**线性递归过程**。第二个函数中，计算模型形状并没有任何增长和收缩，所有的信息都被包含在了 product 和 counter 以及 max-counter 这三个变量中，我们称这种过程为**线性迭代过程**

<div grid="~ cols-2 gap-2" m="-t-2">

```js
function factorial(n) {
  return n === 1 ? 1 : n * factorial(n - 1);
}
```

```js
function factorial(n) {
  return fact_iter(1, 1, n);
}
function fact_iter(product, counter, max_count) {
  return counter > max_count
    ? product
    : fact_iter(counter * product, counter + 1, max_count);
}
```

<img border="rounded" class="h-1/3" src="https://sicp.sourceacademy.org/img_javascript/ch1-Z-G-7.svg">

<img border="rounded" class="h-1/3"  src="https://sicp.sourceacademy.org/img_javascript/ch1-Z-G-10.svg">

</div>

---

# 树形递归

另一种常见的计算模式称为树形递归，来看一下斐波那契数列，这一序列中的每个数都是前面两个数的和。

$$
0, 1, 1, 2, 3, 5, 8, 13, 21, \ldots
$$

公式如下：

$$
 \begin{array}{lll}
      \textrm{Fib}(n)  =  \left\{ \begin{array}{ll}
      0 \qquad \qquad \qquad \qquad \qquad \qquad if \; n=0\\
      1\qquad \qquad \qquad \qquad \qquad \qquad if \; n=1\\
      \textrm{Fib}(n-1)+\textrm{Fib}(n-2) \qquad otherwise
      \end{array}
      \right.
      \end{array}
$$

<div grid="~ cols-2 gap-1" m="-t-2">

```js
function fib(n) {
  return n === 0 ? 0 : n === 1 ? 1 : fib(n - 1) + fib(n - 2);
}

fib(5);
```

<img border="rounded"  src="https://sicp.sourceacademy.org/img_javascript/ch1-Z-G-13.svg">

</div>

---

这是一个典型的树形递归，但它却是一个糟糕的设计，因为它做了太多的冗余计算，在这种模式下，计算的复杂度是相对于 n 指数级别增长的按照对阶乘函数的重新构建，也可以运用与该函数中，观察整个模型的变换规则，不难发现。

$$
    \begin{array}{lll}
      a  \leftarrow  a+b \\
      b  \leftarrow  a
      \end{array}
$$

这里的 a，b 对应$\textrm{Fib}(n+1)$ $\textrm{Fib}(n)$ 按照这个关系重新构建函数。

```js
function fib(n) {
  return fib_iter(1, 0, n);
}
function fib_iter(a, b, count) {
  return count === 0 ? b : fib_iter(a + b, a, count - 1);
}
```

将函数构建为线性迭代模型后，可以发现两种方式在计算量上的巨大差别。不过树形结构是天然的递归表诉，非常符合人脑的思考方式。

---

# 动态规划

如同阶乘函数和斐波那契函数的这种处理，将函数变化状态放入到参数中处理的方式，就是**动态规划**。将一个问题拆成几个子问题，分别求解这些子问题，即可推断出大问题的解。而在划分子问题中，往往存在大量的重复计算和最优子结构，通过一些 memo 方式可以极大的节省计算量。

核心：**状态转移方程** 在动态规划中下一阶段的状态是由上一阶段所决定的，而状态转移方程就是描述变量在上一阶段状态和下一节点状态之间的关系的方程

阶乘函数：$
\begin{array}{lll}
\textrm{product}  \leftarrow  \textrm{counter} \cdot \textrm{product}\\
\textrm{counter}  \leftarrow  \textrm{counter} + 1
\end{array}
$

斐波那契函数：$
  \begin{array}{lll}
      a  \leftarrow  a+b \\
      b  \leftarrow  a
      \end{array}
$

试一试描述这个函数的状态转移方程：

$$
f(n)=n \qquad if \;n < 3 \\f(n)={f(n-1)}+2f(n-2)+3f(n-3) \qquad if \;n≥3
$$

这只是简单的描述，从动态规划中，衍生出很多子问题，例如 0-1 背包，抢劫等，可以说是面试中的压轴类型了。

---

# 函数式与面向对象

两者的区别有一个重要的判断标准：两者在思维建模中对**时间**的表诉方式

面向对象中：时间表示为 **状态->变量** 我们通过对一段时间内变量的不同变化(赋值)表示实际世界的状态改变，我们是通过时间认识和表达事物的变化。

函数式中：函数式没有**赋值**，时间被包含在事物中，函数式不关注某一时刻的状态信息，而是关注该事物的整体信息。

由于我们无法脱离时间认知物体，来建立真实世界与计算机程序的映射关系，在这种思维模式下，导致了许多经典问题的出现

并发：临界区就是典型的例子，在临界区中程序语句执行的顺序被多线程打破，如果两个变量之间存在时间依赖关系，就很容易出现 bug，并且并发程序的问题，由于不确定性，很难排查，而为了保证临界区的执行时间顺序，又引入的锁的概念，锁的引入，又导致可能出现死锁和线程饥饿的情况，而为了解决这些问题，又引入了优先级，优先级又导致优先权反转问题出现，为了优化性能，又实现无锁结构。可以看出为了保证时间概念在程序执行的正确，整个计算机体系付出了巨大的代价。

[延伸视频，时间之矢](https://www.bilibili.com/video/BV1ha4y157tg?spm_id_from=333.337.search-card.all.click)

---

# 流

前端领域近几年关于函数式的谈论越来越多，但大部分都只是聚焦于 map filter reduce 这些比较浅显的函数上

如果将视角放在这些函数执行的过程中，不难发现，固有印象中的函数式是一种**看似优雅实则低效**的执行方式

假定，我们要实现一个程序，功能是计算出一个区间内的素数之和，按照上述的思维，很容易写出这段程序

```js
enumerate_interval(0, 1000).filter(isPrime).reduce(getSum);
```

从执行流中，很容易知道，会把[0-1000]区间的数组遍历了三遍。如果将程序功能换成获取[10000-1000000]中的第二个素数呢？

```js
enumerate_interval(10000, 1000000).filter(isPrime)[1];
```

这种方式就更不可以接受了，为了获取第二个素数，需要构造出一百万个元素的数组然后整个遍历过滤掉后，马上丢掉几乎所有的结果。产生了大量的空间和时间浪费。

我们需要一种新的函数式结构来达到执行程序优雅又同时具有高性能和过程的高可控性，那就是**流**

---

# 数据结构和术语

为了更精准的表达**流** 的形式，需要引入一个新的数据结构**序对**以及对应的一些操作函数(stream.js)

<div grid="~ cols-2 gap-1" m="-t-2">

```js
function pair<H, T>(x: H, xs: T): Pair<H, T> {
  return [x, xs];
}
function list(...elements: any[]): List {
  let theList = null;
  for (let i = elements.length - 1; i >= 0; i -= 1) {
    theList = pair(elements[i], theList);
  }
  return theList;
}
list(1, 2, 3, 4);

// [ 1, [ 2, [ 3, [ 4, null ] ] ] ]
```

<img border="rounded"  src="https://sicp.sourceacademy.org/img_javascript/ch2-Z-G-13.svg">

</div>

流的基本结构就是通过序对构造出一个流结构，简单来讲就是序对的前一个元素是**数据**，后一个元素是生产该数据的**函数**，我们可以将生产数据的函数看成一个**Promise**，由该函数保障能够在我们需要的时候生成需要的数据。

我们在需要的时候拿出序对中的函数，然后构造数据，在不断的加入到整个序对中。至此，我们完成了流结构的搭建，能够让整个流自动的构建下去。

---

# 重构

以上面例子说生产区间的函数 enumerate_interval 为例 我们重构为 stream_enumerate_interval

```js
function stream_enumerate_interval(low, high) {
  return low > high
    ? null
    : pair(low, () => stream_enumerate_interval(low + 1, high));
}
stream_enumerate_interval(1000, 1000000);
// pair(1000, () => stream_enumerate_interval(1001, 1000000))
// [1000,() => stream_enumerate_interval(1001, 1000000)]
// 如果展开 [1000,1001,() => stream_enumerate_interval(1002, 1000000)]
```

那么获取[10000-1000000]中的第二个素数将改写为

```js
stream_ref(
  stream_filter(
              is_prime,
              stream_enumerate_interval(1000,1000000)))
  ,2)
```

---

# 延时计算

流的核心就是延时计算，通过延时计算，我们将整个数据生产过程变成了“按需求驱动”的模式，其中流处理的每个阶段都仅仅活动到足够满足下一阶段需要的程度。

我们松弛了计算中事件发生的实际顺序与过程的表面结构关系，这样写出的流具有高度的表达能力和足够的抽象，并且能够像面向过程式编程模式那样，将计算逐步进行。

延时计算的实现也很简单 **delay** **force**

将生成数据的过程包装成函数 就是 delay 将函数取出并执行 就是 force

```js
//delay
pair(low, () => stream_enumerate_interval(low + 1, high));
//force
function stream_tail(stream) {
  return tail(stream)();
}
```

---

# 无穷流

这其实是一个很有意思的话题，即如何用程序用**有限**去表达一个**无限**的概念。

前面的例子已经表示，通过流结构，我们可以像对待完整的实体一样去对流进行各自操作，即使只会在使用时才构造出数据，因此我们可以表达一个很长的流，甚至于无穷。

用流表达整数集合

```js
function integers_starting_from(n) {
  return pair(n, () => integers_starting_from(n + 1));
}
const integers = integers_starting_from(1);
```

对无穷流进行操作：过滤出不被 7 整出的整数流：

```js
const no_sevens = stream_filter((x) => !is_divisible(x, 7), integers);
stream_ref(no_sevens, 100);
```

无穷流有很多有趣的运用方式，时间关系，书中有完整表达。

---

# React 与函数式
