---
title: String.prototype.startsWith
author: BigRice
date: 2022-02-21
location: 云梦泽
summary: subString() 实例方法截取源字符串的一部分
tags:
  - API JavaScript
  - StringMethods
---

`subString()` 实例方法截取源字符串的一部分

```js
String.subString(startIndex, [endIndex])
```

-    `startIndex` **必需**，指定开始截取字符串的索引位置
    -   若该值为负数，则为 `0`
-    `endIndex` **可选**，指定停止截取字符串的索引位置 （ 默认值为 `str.length` ）
    -   若该值为负数，则为 `0`

> 注意
>

-   此方法的效果与 `String.splice` 一致，但需要注意的是，参数若为 **负值** 将会隐式的变为 `0`
    -   可以理解为 `String.splice` 的**阉割版**

|   此方法的返回值   | 兼容性 |
| :----------------: | :----: |
| 截取出来的新字符串 |   🟢   |

>  示例
>

```js
var str = "Apple Is My Love";
console.log(str.substring(0, -3));
//  ""：提取源字符串，从索引[0]开始，到索引的[0]结束
console.log(str.substring(2, 6));
//  "ple "：提取源字符串，从索引[2]开始，到索引[6]结束（第三个字符到第七个字符之间）
console.log(str.substring(-3));
//  "Apple Is My Love"：提取源字符串，从索引[0]开始到末尾结束
```
