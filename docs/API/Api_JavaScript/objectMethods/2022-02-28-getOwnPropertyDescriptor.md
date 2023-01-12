---
title: Object.getOwnPropertyDescriptor
author: BigRice
date: 2022-02-28
location: 云梦泽
summary: getOwnPropertyDescriptor() 静态方法获取指定对象上某个自有属性的配置信息
tags:
  - API JavaScript
  - ObjectMethods
---

`getOwnPropertyDescriptor()` 静态方法获取指定对象上某个自有属性的配置信息

 ```js
Object.getOwnPropertyDescriptor(obj, prop)
 ```

 - `obj` 指定对象
 - `prop` 指定属性名

> 属性的配置信息相关知识见 `defineProperty`

 |      此方法的返回值      | 此方法会影响源对象吗 | 兼容性 |
 | :----------------------: | :------------------: | :----: |
 | 一个包含了配置信息的对象 |       **不会**       |   ✅    |



> 示例

获取默认属性的配置信息

```js
let obj = {
    info: '如果超人会飞~'
}
console.log(Object.getOwnPropertyDescriptor(obj, 'info'))
```

![image-20220218210244754](https://sbr-1314368469.cos.ap-guangzhou.myqcloud.com/Images/202301062320050.png)



获取带有配置描述符的属性

```js
Object.defineProperty(obj, "fruits", {
  value: 'Apple',
  writable: false,
  enumerable: false
});

console.log(Object.getOwnPropertyDescriptor(obj, 'fruits'))
```

![](https://sbr-1314368469.cos.ap-guangzhou.myqcloud.com/Images/202301062320788.png)
