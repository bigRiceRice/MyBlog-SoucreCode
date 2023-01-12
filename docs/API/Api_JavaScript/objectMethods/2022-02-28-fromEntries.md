---
title: Object.fromEntries
author: BigRice
date: 2022-02-28
location: 云梦泽
summary: fromEntries() 静态方法可以将键值对列表转换为一个对象
tags:
  - API JavaScript
  - ObjectMethods
---

`fromEntries()` 静态方法可以将键值对列表转换为一个对象

 ```js
Object.fromEntries(iterable)
 ```

 - `iterable` 为一个类似 `Array` 、`Map` 或者其他实现了[迭代协议](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#the_iterable_protocol)的**可迭代对象**

> 注意

 - 若 Array 数组使用此方法必须为 `[[xxx,xxx],[xxx,xxx]]` 的键值对形式
     - 若多出一个元素，只取 `[0]` 与 `[1]`

 | 此方法的返回值 | 此方法会影响源对象吗 | 兼容性 |
 | :------------: | :------------------: | :----: |
 |  转换后的对象  |       **不会**       |   ⚠    |



> 示例

`Map` 转为对象

```js
let map = new Map([
    ['fruits-1', 'banana'],
    ['fruits-2', 'Kiwi']
])

console.log(Object.fromEntries(map))
// {"fruits-1":"banana","fruits-2":"Kiwi"}

```

`Array` 转为对象

```js
let array = [
     ['fruits-1', 'banana','apple'],
    ['fruits-2', 'Kiwi']
]
console.log(Object.fromEntries(array))
// {"fruits-1":"banana","fruits-2":"Kiwi"}
```

对象转换

```js
let object1 = { a: 1, b: 2, c: 3 };

let object2 = Object.fromEntries(
  Object.entries(object1)
 .map(([ key, val ]) = [ key, val * 2 ])
);

console.log(object2);
// { a: 2, b: 4, c: 6 }
```

