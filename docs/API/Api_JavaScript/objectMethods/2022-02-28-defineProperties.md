---
title: Object.defineProperties
author: BigRice
date: 2022-02-28
location: 云梦泽
summary: defineProperties() 静态方法会直接在一个对象上定义或修改多个自身属性，并深度的赋予权限
tags:
  - API JavaScript
  - ObjectMethods
---

`defineProperties()` 静态方法会直接在一个对象上定义或修改**多个**自身属性，并深度的赋予权限

 ```js
Object.defineProperties(obj, props)
 ```

 - `obj` 需要操作的对象
 - `props` 要定义属性描述符的对象

|   此方法的返回值   | 此方法会影响源对象吗 | 兼容性 |
| :----------------: | :------------------: | :----: |
| 调用此方法的源对象 |        **会**        |   🟢    |

> 注意：

该方法与 `defineProperty` 效果一致，但语法不同



> 示例

```js
var obj = {};
Object.defineProperties(obj, {
  'property1': {
    value: true,
    writable: true
  },
  'property2': {
    value: 'Hello',
    writable: false
  
});
```

