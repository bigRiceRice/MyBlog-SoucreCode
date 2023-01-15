---
title: React - Hooks
author: BigRice
date: 2023-01-09
location: 云梦泽
summary: 关于 Hooks
tags:
  - React
---

### 🌠 什么是 Hooks - 钩子

Hook 是一些可以让你在函数组件里“钩入” React state 及生命周期等特性的函数。

Hook 其实就是 JavaScript 函数，但是使用它们会有两个额外的规则：

- 只能在**函数最外层**调用 Hook。不要在循环、条件判断或者子函数中调用。
- 只能在 **React 的函数组件**中调用 Hook。不要在其他普通 JavaScript 函数中调用。

下面就让我们来了解 React 那些常用的 Hook 吧！



### useState

> `useState` 的用法与 Vue3 的 `ref` 函数类似，不过它的返回值是一个数组，其中包含**当前**状态和一个让你更新它的函数。

```js
const [state, setState] = useState(initialState);
```

- `initialState`：**必需**，设置初始值
- `state`：初始值的状态引用
- `setState`：更新状态的函数

#### 关于 *setState*

语法：

```js
setState(updater)
updater = callback(lastState => state | state )
```

如果新的 state 需要通过使用先前的 state 计算得出，那么可以将函数传递给 `setState`。该函数将接收先前的 state，并返回一个更新后的值。

> 🔴 注意：
>
> 与类组件中的 `setState` 方法不同，`useState` *Hook* 的 `setState` 的行为将是直接替换原状态，且**在新旧状态引用地址不变的情况下**，将不会触发模板更新！！
>
> 你可以用函数式的 `setState` 结合展开运算符来达到合并更新对象的效果。
>
> ```js
> const [state, setState] = useState({});
> setState(prevState => {
>  // 也可以使用 Object.assign
> 	// 必须更新原状态的引用地址，不然将不会触发模板更新！！！
>  return {...prevState, ...updatedValues};
> });
> ```



#### 关于 *initialState*

*initialState* 用于初始化一个 state 状态，但一定不要写成这样的形式：

```js
// 假设我们的 state 需要经过大量的计算
function clacState (){
    return 1 + 2 + 10086;
}
const [state, setState] = useState( clacState() ); // 🔴

class State {
    data:{/*...*/}
}
const [state, setState] = useState( new State() ); // 🔴
```

不要直接在 *initialState* 中直接调用函数或调用一个类的初始化函数，这将影响性能且可能会造成为止的 BUG，因为每次组件重新渲染都会重新调用。

而且 *initialState* 是可以惰性初始化的。上述代码应该修改成如下：

```js
// 假设我们的 state 需要经过大量的计算
function clacState (){
    return 1 + 2 + 10086;
}
const [state, setState] = useState( clacState ); // 🟢

class State {
    data:{/*...*/}
}
const [state, setState] = useState( new State ); // 🔴
```



### useEffect 

*Effect Hook* 可以让你在函数组件中执行副作用操作：

```jsx
import React, { useState, useEffect } from 'react';

function Example() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    document.title = `You clicked ${count} times`;
  });
}
```

由于 `useEffect` 中极其生草的回调调用，可以把 `useEffect` Hook 看做 `componentDidMount 挂载前` ，`componentDidUpdate 更新前` 和 `componentWillUnmount 卸载阶段` 这三个函数的组合，并且它从某种角度上还能做到类似 Vue 中 `watch` 的功能。

```jsx
const [message] = useState('哈哈哈')
useEffect(() => {
    // 这里的代码挂载前与更新前都会调用
    return ()=>{
        // 返回一个函数，函数中的内容将在卸载阶段时调用
    }
},[message]); // 只有代码挂载前与 message 产生更新时才会调用 useEffect
// 如果想执行只运行一次的 effect（仅在组件挂载和卸载时执行），可以传递一个空数组（[]）作为第二个参数。
```



##### 使用多个 Effect 实现关注点分离

使用 Hook 其中一个[目的](https://zh-hans.reactjs.org/docs/hooks-intro.html#complex-components-become-hard-to-understand)就是要解决 class 中生命周期函数经常包含不相关的逻辑，但又把相关逻辑分离到了几个不同方法中的问题。可是 `useEffect` 所运行的方式实在是多样，所以我们可以多次调用 `useEffect` ，这会将不相关逻辑分离到不同的 effect 中：

```js
useEffect(() => {
    // 这个 effect 只在每次挂载前都执行
},[]); 
useEffect(() => ()=>{
    // 这个 effect 只在卸载阶段执行
}); 
useEffect(() => {
    // 这个 effect 充当 watchEffect(vue)
},[xx,xxx,xxxx]); 
```



### useContext

顶级组件可以使用 `createContext` 创建一个全局上下文对象，然后使用 `<Context.Provider>` 包裹的所有子组件都可以共享数据。

那么子组件想要获取数据可以通过在 `<Context.Consumer>` 标签中返回函数来访问数据，也可以使用 `useContext` 快速结构数据！

首先顶级组件一定要将 `createContext` 返回的对象暴露给需要使用数据的子组件，然后将 `Context` 传递给 `useContext` ：

```jsx
import { Context } from "./App";
const { name,setName } = useContext(Context);
```

 

### useMemo

> `useMemo` 是一个性能优化钩子，它可以缓存一个任意值，并指定依赖，只有当依赖变了，值才会重新获取。

`useMemo` 钩子是性能优化相关的钩子，要理解它的使用场景，我们先要看几个性能问题。

<img src="https://sbr-1314368469.cos.ap-guangzhou.myqcloud.com/Images/202301132150751.png" alt="code" style="zoom: 50%;" />

<img src="https://sbr-1314368469.cos.ap-guangzhou.myqcloud.com/Images/202301132150786.gif" alt="demo" style="zoom:67%;" />

我们假设上面这段代码中的 `processiCount` 中经过了大量的计算才得出 `count` ，但是每次 `time` 更新进而引发整个组件更新时。`processiCount` 这个函数作为显示内容就会自动执行一次，这在代码层面是合乎情理的，因为我们就是这么写的。

但 `time` 的更新与 `processiCount` 并没有直接的联系，我们或许根本不想 `processiCount` 重复执行，那就要使用 `useMemo` Hook 来包装 `processiCount` 函数，如下面这段伪代码：

<img src="https://sbr-1314368469.cos.ap-guangzhou.myqcloud.com/Images/202301132150646.png" alt="code" style="zoom:50%;" />

`useMemo` 的作用非常像**缓存**，它将第一次获得的值存起来，只有当依赖更新时，才会重新计算。

##### 请注意：

- `useMemo` 的第一个参数是一个 `getter` 函数，函数中必须明确返回值，返回值就是 `useMemo` 的返回值。
- `useMemo` 的第二个参数以数组的形式定义依赖项，只有当依赖项改变，内部函数或值才会重新获取。

##### 换一种方式

所以，`useMemo` 钩子确实可以帮助我们在这里避免不必要的计算……但它*真的*是这里最好的解决方案吗？

但 `useMemo` 能做到的，我们通常可以将其封装成两个互不相干的组件即可解决问题，就像这段伪代码：

<img src="https://sbr-1314368469.cos.ap-guangzhou.myqcloud.com/Images/202301022244122.png" alt="code" style="zoom:50%;" />

但这也不是最优解，因为在真实的开发中，很多组件不得不将状态集中到一起，分开放置通常是不行的。

其实我们可以将某些组件定义成**纯组件(Pure components)**，纯组件通常意味着：

- ##### 组件的输入，应该有一个与之对应的输入，输入不变，输出永远不变。

    - 可以理解为若组件的 `props` 不变，那么它不会因为其他的东西而重新渲染，它只关注 `props` 的变化。 
    - 通过 `React.memo()` 定义纯组件



### React.memo

> React.memo 是一个性能优化钩子，它的用法与 useMemo 差不多，不过 memo 时组件层面的缓存组件，也被成为纯组件。

结合 `useMemo` 的例子，我们知道有时候是无法做到将两个组件彻底分开的，大多时候都需要将状态集中，这也意味着当前组件因为某些值重新渲染时会导致子组件也重新渲染，就像下面这个例子：

<img src="https://sbr-1314368469.cos.ap-guangzhou.myqcloud.com/Images/202301022246260.png" alt="code" style="zoom:50%;" />

<img src="https://sbr-1314368469.cos.ap-guangzhou.myqcloud.com/Images/202301022246571.png" alt="code" style="zoom:50%;" />

上面这个例子，每当 `time` 更新引起 `App` 组件重新渲染时，`Counter` 组件也会被迫重新渲染，而且它没有更新任何东西。这个时候就可以使用 `React.memo` 将它定义为纯组件，如下面这段伪代码：

<img src="https://sbr-1314368469.cos.ap-guangzhou.myqcloud.com/Images/202301022247882.png" alt="code" style="zoom:50%;" />

> `memo` 更常见的是在导出时就定义，而不是在引入时定义：`export default memo(function xxx ())`

这样定义后，每当 `time` 更新时，`Counter` 不会被迫重新渲染了



##### 一个 memo 失效的场景

下面我们来看一个例子，在这个例子中 `memo` “失效了”：

<img src="https://sbr-1314368469.cos.ap-guangzhou.myqcloud.com/Images/202301022248846.png" alt="code" style="zoom:50%;" />

<img src="https://sbr-1314368469.cos.ap-guangzhou.myqcloud.com/Images/202301022250850.png" alt="code" style="zoom:50%;" />

这是使用场景：

<img src="https://sbr-1314368469.cos.ap-guangzhou.myqcloud.com/Images/202301021749023.gif" alt="demo" style="zoom: 50%;" />

我们定义了一组 `styles` 将它传入 `Boxes` 纯组件中。理想的情况下只有当我们移动滚轮才会触发 `Boxes` 渲染。但如果我们打开控制台就会看到 `Boxes` 组件并没有像我们想的那样渲染：

<img src="https://sbr-1314368469.cos.ap-guangzhou.myqcloud.com/Images/202301021752510.gif" alt="demo" style="zoom: 50%;" />

其实问题并不复杂，并不是 `memo` 失效了，而是我们定义的那一组 `styles` 出问题了，我们一步步来看到底发生了什么事。

1. 首先我们定义了一个 `styles` 数组，将它传入了 `<Boxes>` 中。
    -  数组是引用对象，而 `time` 每次更新都会重新定义 `styles` 数组，那么 `styles` 的地址其实每秒都在变更。
2. `styles` 数组地址每秒都在更改，导致 `<Boxes>` 每秒都接收着不同的 `props`。
3. `<Boxes>` 每秒重新渲染。



问题很好解决，只需要将 `styles` 使用 `useMemo` 给他一个依赖缓存起来就行了：

<img src="https://sbr-1314368469.cos.ap-guangzhou.myqcloud.com/Images/202301022253689.png" alt="code" style="zoom:50%;" />

<img src="https://sbr-1314368469.cos.ap-guangzhou.myqcloud.com/Images/202301021852786.gif" alt="demo" style="zoom: 50%;" />



### useCallback

> useCallback 是一个性能优化钩子，它可以缓存一个函数，并指定依赖，只有当依赖变更时，才会重新定义函数。

`useCallback` 的作用与 `useMemo` 差不多，不过 `useMemo` 在语义化层面更加侧重缓存**值类型**，`useCallback` 侧重缓存**函数类型**。

还是 `useMemo` 中的例子，我们给子组件传入一个回调函数，但组件中的 `time` 每秒都在变更，那么所定义的函数也会重复定义，且重复传入子组件中，从而引起子组件的重新渲染：

<img src="https://sbr-1314368469.cos.ap-guangzhou.myqcloud.com/Images/202301022255980.png" alt="code" style="zoom:50%;" />

<img src="https://sbr-1314368469.cos.ap-guangzhou.myqcloud.com/Images/202301021955708.gif" alt="demo" style="zoom:50%;" />

解决方法也很简单，使用 `useCallback` 包裹函数体即可。

- `useCallback` 第一个参数可以传入一个函数或函数体，它的返回值就是传入的函数或函数体

- `useCallback` 第二个参数以数组的形式定义依赖项，只有当依赖项改变，内部函数才会重新调用。

下面有两个解决方法：

<img src="https://sbr-1314368469.cos.ap-guangzhou.myqcloud.com/Images/202301022300680.png" alt="code" style="zoom:50%;" />

