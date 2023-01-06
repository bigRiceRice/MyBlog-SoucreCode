---
title: Array.prototype.reduceRight
author: BigRice
date: 2022-02-21
location: 云梦泽
summary: reduceRight() 实例方法是一个（从右到左）根据数组长度与数组中的值进行累积计算的方法
tags:
  - JsApi
  - ArrayMethods
---

`reduceRight()` 实例方法是一个**从右到左**根据数组长度与数组中的值进行累积计算的方法

> `reduceRight ` 在功能上与 `reduce` 是一样的
>
> - 但不同的是从数组的**末尾向前**将数组中的数组项做累加

```js
reduceRight(callback(previousValue, item, index, array), [initialValue]);
```

- _`previousValue`_ 的值首次循环中的值有下面两种情况，再后续循环中是 `callback` **上一次执行的返回结果**，

  | 若声明了 _initialValue_ 🟢 | 若没有声明 _initialValue_ 🔴 |
  | :------------------------: | :--------------------------: |
  |    值为 _initialValue_     |        值为 `arr[0]`         |

- `item` 的值在**首次循环**中的值有下面两种情况，再后续随循环递增：

  | 若声明了 _initialValue_ 🟢 | 若没有声明 _initialValue_ 🔴 |
  | :------------------------: | :--------------------------: |
  |     初始值为 `arr[0]`      |      初始值为 `arr[1]`       |

- `elementIndex` 当前元素在数组中的索引

- `array` 为调用 `reduce` 的数组

- `initialValue` **可选**。
  - 若声明了该值，那么 `previousValue` 在第一次循环的值就是该值

|            此方法的返回值            | 此方法会影响源数组吗 | 兼容性 |
| :----------------------------------: | :------------------: | :----: |
| 为最后一次循环 `callback()` 的返回值 |       **不会**       |   🟢   |
