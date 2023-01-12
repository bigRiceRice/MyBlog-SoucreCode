---
title: String.prototype.startsWith
author: BigRice
date: 2022-02-21
location: 云梦泽
summary: startsWith() 实例方法判断指定字符串是否在源字符串的开头
tags:
  - API JavaScript
  - StringMethods
---

`startsWith()` 实例方法判断指定字符串是否在源字符串的开头

```js
String.startsWith(searchStr, [start])
```

-    `searchStr` **必需**，要判断的指定字符串（ 开头处 ）
-    `start` **可选**，指定从源字符串的**索引位置**进行判断

> 注意
>

-   此方法是**大小写敏感**的
-   若传入的指定字符串在搜索字符串的末尾则返回 `true`
    -   反之返回 `false`

| 此方法的返回值 | 兼容性 |
| :------------: | :----: |
|    Boolean     |   🔴    |

>  示例
>

```js
var str = "To be, or not to be, that is the question.";
console.log(str.startsWith("question.")); //  false
console.log(str.startsWith("To be")); //  true
console.log(str.startsWith("To be", 1)); //  false
//  设置开头为 1 时，字符串为 "o be, or not to be, that is the question."
```
