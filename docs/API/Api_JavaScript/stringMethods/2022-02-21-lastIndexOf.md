---
title: String.prototype.lastIndexOf
author: BigRice
date: 2022-02-21
location: 云梦泽
summary: lastIndexOf() 实例方法返回指定的字符串值在源字符串中最后一次出现的索引位置
tags:
  - API JavaScript
  - StringMethods
---

`lastIndexOf()` 实例方法返回指定字符串值在源字符串中**最后一次出现**的索引位置

```js
String.lashIndexOf(searchStr, [start])
```

-    `searchStr` **必需**，需检索的字符串值
-    `start` **可选**，指定从源字符串的**索引位置**进行判断

> 注意
>

-   此方法与 `String.indexOf()` 不同的是匹配字符串值在字符串中**最后一次**出现的索引位置
-   若源字符串中**不含有**指定字符串，那么会返回 `-1`
-   此方法存在镜像方法 `String.indexOf()`
-   **千万不要**将此方法与 `Array.lastIndexOf` 混淆，因为 `String.lastIndexOf` **不是逆序匹配的 ❗**

|         此方法的返回值         | 兼容性 |
| :----------------------------: | :----: |
| 字符串中最后一次出现的索引位置 |   🟢   |

>  示例
>

```js
var str = "To be, or not to be, that is the question. question. question. "; <
console.log(str.lastIndexOf('question.'))//  53
console.log(str.lastIndexOf('be'))//  17
console.log(str.lastIndexOf('be',1))//  -1
//  设置 start 为 1 时，此时的检查的字符串为 "To"
console.log('abab'.lastIndexOf('ab', 2))//  2
//  设置 start 为 2 时，此时的检查的字符串为 "aba"
```
