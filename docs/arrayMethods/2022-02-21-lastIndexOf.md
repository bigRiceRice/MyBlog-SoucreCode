---
title: Array.prototype.lastIndexOf
author: BigRice
date: 2022-02-21
location: 云梦泽
summary: lastIndexOf() 实例方法寻找数组中第一个符合要求的元素并返回其索引位置
tags:
  - JsApi
  - ArrayMethods
---

`lastIndexOf()` 实例方法寻找数组中第一个符合要求的元素并返回其索引位置

```js
Array.lastIndexOf(item, [start]);
```

- `item` **必需**，要寻找的元素（字符串）
- `start` **可选**，规定**逆序寻找**的开始位置（ 默认值为从 _arr.length_ 开始向前寻找 ）
  - 若此**参数为负数**，则表示从**倒数开始从后往前**

> 注意：
>
> 如果指定元素出现多次，只取**最后一次出现的索引位置**
>
> `array.lastIndexOf()` 的功能与 `array.indexOf()` 镜像相反，主要体现在 _start_ **参数的使用上**

|    此方法的返回值    | 此方法会影响源数组吗 | 兼容性 |
| :------------------: | :------------------: | :----: |
| 符合要求元素的索引值 |       **不会**       |   🟢   |

> 示例

```js
let arr1 = ["Banana", "Orange", "Apple", "Mango", "Banana", "Orange", "Apple"];
console.log(arr1.lastIndexOf("Banana", 1)); //> 0
console.log(arr1.lastIndexOf("Banana", -1)); //> 4
console.log(arr1.lastIndexOf("Banana")); //> 4
```

> 原理图

<img src="https://sbr-1314368469.cos.ap-guangzhou.myqcloud.com/Images/202301061815430.png" alt="image-20220214230301313" style="zoom:80%;" />
