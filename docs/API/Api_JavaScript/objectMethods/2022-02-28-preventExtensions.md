---
title: Object.preventExtensions
author: BigRice
date: 2022-02-28
location: 云梦泽
summary: preventExtensions() 静态方法使指定对象将不可扩展自身属性，也就是永远不能再添加新的属性
tags:
  - API JavaScript
  - ObjectMethods
---

`preventExtensions()` 静态方法使指定对象将**不可扩展自身属性**，也就是永远不能再添加新的属性

 ```js
Object.preventExtensions(obj)
 ```

 - `obj` 指定的对象

| 此方法的返回值 | 此方法会影响源对象吗 | 兼容性 |
| :------------: | :------------------: | :----: |
|     源对象     |        **会**        |   🟢    |



**何为不可扩展？**

 - 不可扩展是对象**安全级别的第 3 级别**（ 仅在所有实例方法的基础上得出此结论 ）
 - 只能阻止一个对象**不能再添加新的自身属**性，但仍然**可以为该对象的原型添加属性**
 - 不可扩展的对象的**原始属性仍然可以被删除 / 修改**
 - 尝试给一个不可扩展对象添加新属性的操作将会**静默失败**（ 不抛出异常 ）
     -  严格模式下会抛出 `TypeError` 异常
     - 通过 `Object.defineProperty` 方法添加属性会抛出 `TypeError` 异常



> 如果我们想让一个对象的所有属性都 **不可配置** 同时也不允许为该对象进行 **扩展** 应该怎么做?
>
>   - 再设置 `configurable : false` ?
>
>   - 一个简单的方法是调用 `Object.seal()` 方法，**密封**一个对象
>



> 示例

一个对象默认是可扩展的，且对象是否可以扩展与属性的 `configurable` 配置项无关

```js
//新对象默认是可扩展的无论何种方式创建的对象，这里使用的是字面量方式
var empty = {a:1};
console.log(Object.isExtensible(empty) === true);//true

//等价于 使用属性描述符
empty = Object.create({},{
    "a":{
        value : 1,
        configurable : true,//可配置
        enumerable : true,//可枚举
        writable : true//可写
    }
});
console.log(Object.isExtensible(empty) === true);//true

//对象是否可以扩展与对象的属性是否可以配置无关
empty = Object.create({},{
    "a":{
        value : 1,
        configurable : false,//不可配置
        enumerable : true,//可枚举
        writable : true//可写
    }
});
console.log(Object.isExtensible(empty) === true);//true
```

##### 使用 `preventExtensions()`

```js
let obj = {}
console.log(`魔镜魔镜告诉我， obj 还是可以扩展的吗? -- 魔镜说：
“${Object.isExtensible(obj) ? '是的' : '已经不是了'}”`)
// true

obj.x = '“我将会是全村的希望!”'
Object.preventExtensions(obj)
console.log(`魔镜魔镜告诉我， obj 还是可以扩展的吗? -- 魔镜说：
“${Object.isExtensible(obj) ? '是的' : '已经不是了'}”`)
// false

// 常规语法添加新属性看看
obj.a = '哈哈哈我回来了' // 添加静默失败
obj['b'] = '哈哈哈又回来了' // 添加静默失败

// 试着打印所有自身属性看看
console.log(Object.getOwnPropertyDescriptors(obj));
// {"x":{"value":"我是全村的希望","writable":true,"enumerable":true,"configurable":true}}

// 严格模式下报错
(function test() {	
    "use strict";
    obj.a = "4";
    // Uncaught TypeError: Cannot add property a, object is not extensible
})(); 

Object.defineProperty(obj,'c',{value:'哈哈哈双回来了'}) 
// Uncaught TypeError: Cannot define property c, object is not extensible

// 修改本来就有的属性是可行的
Object.defineProperty(obj, 'x', { value: '“出门三年了,听说妻子生了个大胖小子呢。”' })

console.log(Object.getOwnPropertyDescriptors(obj));
// {"x":{"value":"“出门三年了,听说妻子生了个大胖小子呢。”"
//,"writable":true,"enumerable":true,"configurable":true}}
```

##### 手动实现**密封**一个对象

```js
//创建一个对象,同时声明其所有属性均为不可配置且不可写
var obj = {a :1,b:2,c:3};
Object.defineProperties(obj,{
    "a":{configurable:false},
    "b":{configurable:false},
    "c":{configurable:false}
});

//等价于
var obj = Object.create({},{
    "a":{value :1,congigurable :false,enumerable :true,writable:true},
    "b":{value :2,congigurable :false,enumerable :true,writable:true},
    "c":{value :3,congigurable :false,enumerable :true,writable:true}
});

//将其转化为不可扩展对象
Object.preventExtensions(obj);

//测试该对象是否即不可扩展同时其所有属性均不可配置
console.log(Object.isExtensible(obj) === true);//false
for(var name of Object.keys(obj)){//遍历该对象的所有可枚举属性名,不包括继承而来的属性
    Object.defineProperty(obj,name,{enumerable:false});//将该属性的 enumerable 特性重新配置为 true
}//抛出异常
```

