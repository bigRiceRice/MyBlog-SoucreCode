---
title: Array.prototype.findIndex
author: BigRice
date: 2022-02-21
location: 云梦泽
summary: findIndex() 实例方法用于获取数组内符合要求的首个元素的索引值
tags:
  - JsApi
  - ArrayMethods
---

`findIndex()` 实例方法用于获取数组内**符合要求的首个元素**的索引值

```js
Array.findIndex(calllback(item, index, array));
```

- `element` 为当前被处理的元素（ 初始值 `arr[0]` ）
- `index` 为当前元素在数组中的索引（ 初始值 `0` ）
- `array` 为调用 `findIndex` 的数组
- `callback` 中必须要有**返回值**，此返回值就是提取符合要求元素规则

|        此方法的返回值        | 此方法会影响源数组吗 | 兼容性 |
| :--------------------------: | :------------------: | :----: |
| 符合要求的第一个元素的索引值 |       **不会**       |   🔴   |

> 示例

```js
let arr1 = ['Banana', 'Orange', 'Baby', 'Mango', 'Pig', 'Lion', 'Dog', 'Cat']
let resultArr = arr1.findIndex((element, index, arr) => {
    return element.indexOf('B') == 0
})
console.log(resultArr)//> 0
-----
let arr2 = [10, 15, 20, 25, 30, 40]
resultArr = arr2.findIndex((element, index, arr) => {
    return element >= 20
})
console.log(resultArr)//> 2
```
