---
title: Object.defineProperty
author: BigRice
date: 2022-02-28
location: 云梦泽
summary: defineProperty() 静态方法会直接在一个对象上定义或修改一个自身属性，并深度的赋予权限
tags:
  - API JavaScript
  - ObjectMethods
---

`defineProperty()` 静态方法会直接在一个对象上定义或修改**一个**自身属性，并深度的赋予权限

```js
Object.defineProperty(obj, prop, descriptor)
```

-   `obj` 需要操作的对象
-   `prop` 要定义或修改的属性或一个 `Symbol`
-   `descriptor` 要定义或修改的属性描述符（对象键值对）

> 注意
>
> 此方法应当直接在 `Object` 构造器对象上使用，而不是在任意一个 `Object` 的实例上调用 

##### 

## descriptor

`descriptor` 分为数据描述符 / 存取描述符

-   数据描述符 是一个具有值的属性
-   存取描述符 是由 `getter` 函数和 `setter` 函数所描述的属性

|   通用的属性   | 描述                                                           |
| :------------: | -------------------------------------------------------------- |
| `configurable` | 定义 `descriptor` 是否可以配置，即二次修改（ 默认为 `false` ） |
|  `enumerable`  | 定义属性是否为可枚举属性（ 是否能遍历 ）（ 默认为 `false` ）   |

| 数据描述符的属性 | 描述                                                                                   |
| :--------------: | -------------------------------------------------------------------------------------- |
|     `value`      | 该属性对应的值，可以是任何有效的 JavaScript 值（数值，对象，函数等）默认为 `undefined` |
|    `writable`    | 定义 `value` 是否为可写状态（ 默认为 `false` ）                                        |

| 存取描述符的属性 | 描述                                                                                         |
| :--------------: | -------------------------------------------------------------------------------------------- |
|      `get`       | 给属性提供 `getter` ，必须要有 `return` 语句，该方法返回值被用作属性值（ 默认为 undefined ） |
|      `set`       | 给属性提供 `setter` ，该方法将接受唯一参数，并将该参数值分配给该 `get`（ 默认为 undefined ） |

要注意的一点是：一个描述符只能是这两者其中之一，使用了 `value` / `writable` 就不能使用 get / set

|   此方法的返回值   | 此方法会影响源对象吗 | 兼容性 |
| :----------------: | :------------------: | :----: |
| 调用此方法的源对象 |         **会**         |   🟢   |



> 示例

属性的 `getter` 与 `setter`

```js
let obj = {};
let str = "谁在用琵琶弹奏一曲东方破~";
Object.defineProperty(obj, "info", {
    set: newValue = (str += newValue),
    get: () = str,
});
obj.info = "看不见你的笑，";
obj.info = "让我怎么睡得着";
console.log(obj.info); // 谁在用琵琶弹奏一曲东方破~看不见你的笑，让我怎么睡得着
```
