---
title: Array.prototype.copyWithin
author: BigRice
date: 2022-02-21
location: 云梦泽
summary: copyWithin() 实例方法将数组元素复制粘贴到数组中的另一个位置，覆盖现有值
tags:
  - JsApi
  - ArrayMethods
---

`copyWithin()` 实例方法将数组元素复制粘贴到数组中的另一个位置，覆盖现有值

```js
Array.copyWithin(target, [start, end]);
```

- `target` **必需**，将元素**粘贴到目标**的索引位置
- `start` **可选**，开始复制元素的索引位置（默认值为 `arr[0]`）。
- `end` **可选**，复制停止的索引位置（默认为 `array.length`）

|   此方法的返回值   | 此方法会影响源数组吗 | 兼容性 |
| :----------------: | :------------------: | :----: |
| 复制粘贴后的源数组 |        **会**        |   🔴   |

> 示例

```js
let arr1 = ["H", "e", "l", "l", "o", "W", "o", "r", "l", "d"];
let arr2 = ["H", "e", "l", "l", "o", "W", "o", "r", "l", "d"];
// 从原数组下标[2]的位置开始粘贴，粘贴的内容是原数组的从[0]至length的元素
arr1.copyWithin(2);
// 从原数组下标[5]的位置开始粘贴，粘贴的内容是原数组的从[0]至[4]的元素
arr2.copyWithin(5, 0, 4);
//
console.log(arr1); // ["H","e","H","e","l","l","o","W","o","r"]
console.log(arr2); //  ["H","e","l","l","o","H","e","l","l","d"]
```
