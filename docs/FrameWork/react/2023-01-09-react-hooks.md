---
title: React - Hooks
author: BigRice
date: 2023-01-09
location: 云梦泽
summary: 关于 Hooks
tags:
    - React
---

## 🌠 什么是 Hooks

_Hook_ 是 React 16.8 的新增特性。它可以让你在不编写 class 的情况下使用 state 以及其他的 React 特性。

下面就让我们来了解 React 那些常用的 Hook 吧！

比如 `useState` 就是一个 _Hook_

```jsx
import React, { useState } from "react";

function Example() {
    // 声明一个新的叫做 “count” 的 state 变量
    const [count, setCount] = useState(0);

    return (
        <div>
            <p>You clicked {count} times</p>
            <button onClick={() => setCount(count + 1)}>Click me</button>
        </div>
    );
}
```

_Hook_ 其实就是 JavaScript 函数，但是使用它们会有两个额外的规则：

-   只能在**函数最外层**调用 Hook。不能在循环、条件判断或者子函数中调用。
-   只能在 **React 的函数组件**中调用 Hook。不能在其他普通 JavaScript 函数中调用。

在我们继续之前，请记住 Hook 是：

-   **完全可选的。** 你无需重写任何已有代码就可以在一些组件中尝试 Hook。但是如果你不想，你不必现在就去学习或使用 Hook。
-   **100% 向后兼容的。** Hook 不包含任何破坏性改动。
-   **现在可用。** Hook 已发布于 v16.8.0。

**没有计划从 React 中移除 class。**

**Hook 不会影响你对 React 概念的理解。** 恰恰相反，Hook 为已知的 React 概念提供了更直接的 API：props， state，context，refs 以及生命周期。稍后我们将看到，Hook 还提供了一种更强大的方式来组合他们。

## 为什么需要 _Hook_ ？

Hook 解决了我们五年来编写和维护成千上万的组件时遇到的各种各样看起来不相关的问题。无论你正在学习 React，或每天使用，或者更愿尝试另一个和 React 有相似组件模型的框架，你都可能对这些问题似曾相识。

### 一、想要复用一个有状态的组件太麻烦了！

我们都知道 react 的核心思想就是，**将一个页面拆成一堆独立的，可复用的组件**，并且用自上而下的单向数据流的形式将这些组件串联起来。

但假如你在大型的工作项目中用 react，你会发现你的项目中实际上很多 react 组件冗长且难以复用。尤其是那些写成 class 的组件，它们本身包含了状态（state），所以复用这类组件就变得很麻烦。

那之前，官方推荐怎么解决这个问题呢？答案是：[渲染属性（Render Props）](https://link.juejin.cn/?target=https%3A%2F%2Freactjs.org%2Fdocs%2Frender-props.html)和[高阶组件（Higher-Order Components）](https://link.juejin.cn/?target=https%3A%2F%2Freactjs.org%2Fdocs%2Fhigher-order-components.html)。

但是这类方案需要重新组织你的组件结构，这可能会很麻烦，使你的代码难以理解。

如果你在 React DevTools 中观察过 React 应用，你会发现由 providers，consumers，高阶组件，render props 等其他抽象层组成的组件会形成“**嵌套地狱**“：

<img src="https://sbr-1314368469.cos.ap-guangzhou.myqcloud.com/Images/202301151749461.webp" style="zoom:67%;" />

尽管我们可以[在 DevTools 过滤掉它们](https://github.com/facebook/react-devtools/pull/503)，但这说明了一个更深层次的问题：**React 需要为共享状态逻辑提供更好的原生途径**。

但你可以使用 Hook 从组件中提取状态逻辑，使得这些逻辑可以单独测试并复用。**Hook 使你在无需修改组件结构的情况下复用状态逻辑。** 这使得在组件间或社区内共享 Hook 变得更便捷。

### 二、生命周期钩子函数里的逻辑太乱了吧！

我们通常希望一个函数只做一件事情，但我们的生命周期钩子函数里通常同时做了很多事情。

比如我们需要在 `componentDidMount` 中发起 ajax 请求获取数据，绑定一些事件监听等等。同时，有时候我们还需要在`componentDidUpdate` 做一遍同样的事情。当项目变复杂后，书写这种重复的代码是很浪费时间的。

为了解决这个问题，**Hook 将组件中相互关联的部分拆分成更小的函数（比如设置订阅或请求数据）**，而并非强制按照生命周期划分。你还可以使用 reducer 来管理组件的内部状态，使其更加可预测。

### 三、class 真的太让人困惑了！

除了代码复用和代码管理会遇到困难外，class 是学习 React 的一大屏障。你必须去理解 JavaScript 中 `this` 的工作方式，这与其他语言存在巨大差异。

而且你还不能忘记绑定事件处理器。如果不使用 [ES2022 public class fields](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/Public_class_fields#public_instance_fields)，这些代码非常冗余。大家可以很好地理解 props，state 和自顶向下的数据流，但对 class 却一筹莫展。

即便在有经验的 React 开发者之间，对于函数组件与 class 组件的差异也存在分歧，甚至还要区分两种组件的使用场景。

为了解决以上这些问题，**Hook 使你在非 class 的情况下可以使用更多的 React 特性。**

从概念上讲，React 组件一直更像是函数。而 Hook 则拥抱了函数，同时也没有牺牲 React 的精神原则。Hook 提供了问题的解决方案，无需学习复杂的函数式或响应式编程技术。

## 一些常用的 _Hook_

### 🍧 _useState_

> `useState` 的用法与 Vue3 的 `ref` 函数类似，不过它的返回值是一个数组，其中包含**当前**状态和一个让你更新它的函数。

```js
const [state, setState] = useState(initialState);
```

-   `initialState`：**必需**，设置初始值
-   `state`：初始值的状态引用
-   `setState`：更新状态的函数

#### 关于 _setState_

语法：

```js
setState(updater);
updater = callback(lastState => state | state);
```

如果新的 state 需要通过使用先前的 state 计算得出，那么可以将函数传递给 `setState`。该函数将接收先前的 state，并返回一个更新后的值。

> 🔴 注意：
>
> 与类组件中的 `setState` 方法不同，`useState` _Hook_ 的 `setState` 的行为将是直接替换原状态，且**在新旧状态引用地址不变的情况下**，将不会触发模板更新！！
>
> 你可以用函数式的 `setState` 结合展开运算符来达到合并更新对象的效果。
>
> ```js
> const [state, setState] = useState({});
> setState(prevState => {
>     // 也可以使用 Object.assign
>     // 必须更新原状态的引用地址，不然将不会触发模板更新！！！
>     return { ...prevState, ...updatedValues };
> });
> ```

#### 关于 _initialState_

_initialState_ 用于初始化一个 state 状态，但一定不要写成这样的形式：

```js
// 假设我们的 state 需要经过大量的计算
function clacState() {
    return 1 + 2 + 10086;
}
const [state, setState] = useState(clacState()); // 🔴

class State {
    data: {
        /*...*/
    };
}
const [state, setState] = useState(new State()); // 🔴
```

不要直接在 _initialState_ 中直接调用函数或调用一个类的初始化函数，这将影响性能且可能会造成为止的 BUG，因为每次组件重新渲染都会重新调用。

而且 _initialState_ 是可以惰性初始化的。上述代码应该修改成如下：

```js
// 假设我们的 state 需要经过大量的计算
function clacState() {
    return 1 + 2 + 10086;
}
const [state, setState] = useState(clacState); // 🟢

class State {
    data: {
        /*...*/
    };
}
const [state, setState] = useState(new State()); // 🔴
```

### 🍗 _useReducer_

```js
const [state, dispatch] = useReducer(reducer, initialArg, init);
```

-   `reducer`：**必需**，状态的规则
-   `initialArg`：**必需**，状态的初始值
-   `init`：可选，状态的惰性初始化函数
-   `state`：最新的状态
-   `dispatch`：调用规则的函数，语法为 `dispatch({type: 'xxx'})}`

`useReducer` 为 [`useState`](https://zh-hans.reactjs.org/docs/hooks-reference.html#usestate) 的替代方案。它接收一个形如 `(state, action) => newState` 的 reducer，并返回当前的 state 以及与其配套的 `dispatch` 方法。（如果你熟悉 Redux 的话，就已经知道它如何工作了。）

在某些场景下，`useReducer` 会比 `useState` 更适用，例如 state 逻辑较复杂且包含多个子值，或者下一个 state 依赖于之前的 state 等。

并且，使用 `useReducer` 还能给那些会触发深更新的组件做性能优化，因为[你可以仅向子组件传递一个 `dispatch` 而不是多个回调函数](https://zh-hans.reactjs.org/docs/hooks-faq.html#how-to-avoid-passing-callbacks-down) 。

以下为一个计数器例子：

```jsx
const initialState = { count: 0 };

function reducer(state, action) {
    switch (action.type) {
        case "increment":
            return { count: state.count + 1 };
        case "decrement":
            return { count: state.count - 1 };
        default:
            throw new Error();
    }
}

function Counter() {
    const [state, dispatch] = useReducer(reducer, initialState);
    return (
        <>
            Count: {state.count}
            <button onClick={() => dispatch({ type: "decrement" })}>-</button>
            <button onClick={() => dispatch({ type: "increment" })}>+</button>
        </>
    );
}
```

#### 惰性初始化

你可以选择惰性地创建初始 state。为此，需要将 `init` 函数作为 `useReducer` 的第三个参数传入，这样初始 state 将被设置为 `init(initialArg)`。

这么做可以将用于计算 state 的逻辑提取到 reducer 外部，这也为将来对重置 state 的 action 做处理提供了便利：

```jsx
function init(initialCount) {
    return { count: initialCount };
}

function reducer(state, action) {
    switch (action.type) {
        case "increment":
            return { count: state.count + 1 };
        case "decrement":
            return { count: state.count - 1 };
        case "reset":
            return init(action.payload);
        default:
            throw new Error();
    }
}

function Counter({ initialCount }) {
    const [state, dispatch] = useReducer(reducer, initialCount, init);
    return (
        <>
            Count: {state.count}
            <button onClick={() => dispatch({ type: "reset", payload: initialCount })}>
                Reset
            </button>
            <button onClick={() => dispatch({ type: "decrement" })}>-</button>
            <button onClick={() => dispatch({ type: "increment" })}>+</button>
        </>
    );
}
```

### 🍤 _useEffect_

你之前可能已经在 React 组件中执行过数据获取、订阅或者手动修改过 DOM。我们统一把这些操作称为“副作用”，或者简称为“作用”。

`useEffect` 就是一个 Effect Hook，给函数组件增加了操作副作用的能力。它跟 class 组件中的 `componentDidMount`、`componentDidUpdate` 和 `componentWillUnmount` 具有相同的用途（注意：某些行为并不完全相同），只不过被合并成了一个 API。

例如，下面这个组件在 React 更新 DOM 后会设置一个页面标题：

```jsx
import React, { useState, useEffect } from "react";

function Example() {
    const [count, setCount] = useState(0);

    useEffect(() => {
        document.title = `You clicked ${count} times`;
    });
}
```

#### _useEffect_ 解绑副作用

这种场景很常见，当我们在 `componentDidMount` 里添加了一个事件监听或定时器，我们应该在 `componentWillUnmount` 中，也就是组件被注销之前清除掉我们添加的事件监听或定时器，否则内存泄漏的问题就出现了。

那么应该如何解绑呢？

只需要在 `useEffect` 中返回一个新的函数即可：

```jsx
useEffect(() => {
    return ()=>{
        // 返回一个函数，将在重新渲染前调用
    }
}
```

这里有一个点**需要重视**，`useEffect` 中返回的函数 **不！等！于！** `componentWillUnmount`。

-   `componentWillUnmount` 只会在组件**被销毁前执行一次**（狭义上的组件死了— 真正卸载）。
-   `useEffect` 中返回的函数是在组件**重新渲染前执行**的（广义上的组件死了 — 重新渲染）。

#### 怎么跳过一些不必要的副作用函数

假如每次重新渲染都要执行一遍这些副作用函数，显然是不经济且浪费性能的。怎么跳过一些不必要的计算呢？

我们只需要给 useEffect 传第二个依赖项参数即可。

-   若传值，必须为数组形式或空数组。

用第二个参数来告诉 react 只有当这个依赖项参数的值发生改变时，才执行我们传的副作用函数（第一个参数）。

```jsx
useEffect(() => {
    document.title = `You clicked ${count} times`;
}, [count]); // 只有当count的值发生变化时，才会重新执行`document.title`这一条代码
```

当我们第二个参数传一个空数组 `[]` 时，其实就相当于只在首次渲染（`componentDidMount`）的时候执行。

> 不过这种用法可能带来 `bug`
>
> 详情可以参考 [在依赖列表中省略参数是否安全？](https://zh-hans.reactjs.org/docs/hooks-faq.html#is-it-safe-to-omit-functions-from-the-list-of-dependencies)

#### 使用多个 Effect 实现关注点分离

使用 Hook 其中一个[目的](https://zh-hans.reactjs.org/docs/hooks-intro.html#complex-components-become-hard-to-understand)就是要解决 class 中生命周期函数经常包含不相关的逻辑，但又把相关逻辑分离到了几个不同方法中的问题。可是 `useEffect` 所运行的方式实在是多样，所以我们可以多次调用 `useEffect` ，这会将不相关逻辑分离到不同的 effect 中：

```js
useEffect(() => {
    // 这个 effect 只在每次挂载前都执行
}, []);
useEffect(() => () => {
    // 这个 effect 只在重新渲染前执行
});
useEffect(() => {
    // 这个 effect 充当 watchEffect(vue)
}, [xx, xxx, xxxx]);
```

### 🥗 _useContext_

接收一个 context 对象（`React.createContext` 的返回值）并返回该 context 的当前值。当前的 context 值由上层组件中距离当前组件最近的 `<MyContext.Provider>` 的 `value` prop 决定。

我们都知道 `MyContext.Provider` 用于提供数据，而 `MyContext.Consumer` 用于获取数据，那么 `useContext` 其实就是专门给无状态组件用于获取 `MyContext` 数据的 API。

首先顶级组件一定要将 `createContext` 返回的对象暴露给需要使用数据的子组件，然后将 `Context` 传递给 `useContext` ：

```jsx
import { Context } from "./App";
const { name, setName } = useContext(Context);
```

#### 注意：

别忘记 `useContext` 的参数必须是 _context 对象本身_：

-   **正确：** `useContext(MyContext)`
-   **错误：** `useContext(MyContext.Consumer)`
-   **错误：** `useContext(MyContext.Provider)`

如果你在接触 Hook 前已经对 context API 比较熟悉，那应该可以理解，`useContext(MyContext)` 其实相当于 class 组件中的 `static contextType = MyContext` 或者 `<MyContext.Consumer>`。

`useContext(MyContext)` 只是让你能够*读取* context 的值以及订阅 context 的变化。

**你仍然需要在上层组件树中使用** `<MyContext.Provider>` 来为下层组件*提供* context，这一步是不可或缺的。

### 🍔 useMemo

> `useMemo` 是一个性能优化钩子，它可以缓存一个任意值，并指定依赖，只有当依赖变了，值才会重新获取。

`useMemo` 钩子是性能优化相关的钩子，要理解它的使用场景，我们先要看几个性能问题。

<img src="https://sbr-1314368469.cos.ap-guangzhou.myqcloud.com/Images/202301132150751.png" alt="code" style="zoom: 50%;" />

<img src="https://sbr-1314368469.cos.ap-guangzhou.myqcloud.com/Images/202301132150786.gif" alt="demo" style="zoom:67%;" />

我们假设上面这段代码中的 `processiCount` 中经过了大量的计算才得出 `count` ，但是每次 `time` 更新进而引发整个组件更新时。`processiCount` 这个函数作为显示内容就会自动执行一次，这在代码层面是合乎情理的，因为我们就是这么写的。

但 `time` 的更新与 `processiCount` 并没有直接的联系，我们或许根本不想 `processiCount` 重复执行，那就要使用 `useMemo` Hook 来包装 `processiCount` 函数，如下面这段伪代码：

<img src="https://sbr-1314368469.cos.ap-guangzhou.myqcloud.com/Images/202301132150646.png" alt="code" style="zoom:50%;" />

`useMemo` 的作用非常像**缓存**，它将第一次获得的值存起来，只有当依赖更新时，才会重新计算。

##### 请注意：

-   `useMemo` 的第一个参数是一个 `getter` 函数，函数中必须明确返回值，返回值就是 `useMemo` 的返回值。
-   `useMemo` 的第二个参数以数组的形式定义依赖项，只有当依赖项改变，内部函数或值才会重新获取。

##### 换一种方式

所以，`useMemo` 钩子确实可以帮助我们在这里避免不必要的计算……但它*真的*是这里最好的解决方案吗？

但 `useMemo` 能做到的，我们通常可以将其封装成两个互不相干的组件即可解决问题，就像这段伪代码：

<img src="https://sbr-1314368469.cos.ap-guangzhou.myqcloud.com/Images/202301022244122.png" alt="code" style="zoom:50%;" />

但这也不是最优解，因为在真实的开发中，很多组件不得不将状态集中到一起，分开放置通常是不行的。

其实我们可以将某些组件定义成**纯组件(Pure components)**，纯组件通常意味着：

-   ##### 组件的输入，应该有一个与之对应的输入，输入不变，输出永远不变。

    -   可以理解为若组件的 `props` 不变，那么它不会因为其他的东西而重新渲染，它只关注 `props` 的变化。
    -   通过 `React.memo()` 定义纯组件

#### React.memo

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
    - 数组是引用对象，而 `time` 每次更新都会重新定义 `styles` 数组，那么 `styles` 的地址其实每秒都在变更。
2. `styles` 数组地址每秒都在更改，导致 `<Boxes>` 每秒都接收着不同的 `props`。
3. `<Boxes>` 每秒重新渲染。

问题很好解决，只需要将 `styles` 使用 `useMemo` 给他一个依赖缓存起来就行了：

<img src="https://sbr-1314368469.cos.ap-guangzhou.myqcloud.com/Images/202301022253689.png" alt="code" style="zoom:50%;" />

<img src="https://sbr-1314368469.cos.ap-guangzhou.myqcloud.com/Images/202301021852786.gif" alt="demo" style="zoom: 50%;" />

### 🌯 useCallback

> useCallback 是一个性能优化钩子，它可以缓存一个函数，并指定依赖，只有当依赖变更时，才会重新定义函数。

`useCallback` 的作用与 `useMemo` 差不多，不过 `useMemo` 在语义化层面更加侧重缓存**值类型**，`useCallback` 侧重缓存**函数类型**。

还是 `useMemo` 中的例子，我们给子组件传入一个回调函数，但组件中的 `time` 每秒都在变更，那么所定义的函数也会重复定义，且重复传入子组件中，从而引起子组件的重新渲染：

<img src="https://sbr-1314368469.cos.ap-guangzhou.myqcloud.com/Images/202301022255980.png" alt="code" style="zoom:50%;" />

<img src="https://sbr-1314368469.cos.ap-guangzhou.myqcloud.com/Images/202301021955708.gif" alt="demo" style="zoom:50%;" />

解决方法也很简单，使用 `useCallback` 包裹函数体即可。

-   `useCallback` 第一个参数可以传入一个函数或函数体，它的返回值就是传入的函数或函数体

-   `useCallback` 第二个参数以数组的形式定义依赖项，只有当依赖项改变，内部函数才会重新调用。

下面有两个解决方法：

<img src="https://sbr-1314368469.cos.ap-guangzhou.myqcloud.com/Images/202301022300680.png" alt="code" style="zoom:50%;" />

### 🥟 _useRef_

`useRef` 返回一个可变的 ref 对象，其 `.current` 属性被初始化为传入的参数（`initialValue`）。返回的 ref 对象在组件的整个生命周期内持续存在。

一个常见的用例便是将组件或元素的 `ref` 定义为 `useRef` 返回的 `Ref` 对象：

```jsx
function TextInputWithFocusButton() {
    const inputEl = useRef(null);
    const onButtonClick = () => {
        // `current` 指向已挂载到 DOM 上的文本输入元素
        inputEl.current.focus();
    };
    return (
        <>
            <input ref={inputEl} type="text" />
            <button onClick={onButtonClick}>Focus the input</button>
        </>
    );
}
```

本质上，`useRef` 就像是可以在其 `.current` 属性中保存一个可变值的“盒子”。

你应该熟悉 ref 这一种[访问 DOM](https://zh-hans.reactjs.org/docs/refs-and-the-dom.html) 的主要方式。如果你将 ref 对象以 `<div ref={myRef} />` 形式传入组件，则无论该节点如何改变，React 都会将 ref 对象的 `.current` 属性设置为相应的 DOM 节点。

在类组件我们需要引用 DOM 节点可以使用 `createRef`，`useRef` 与 `createRef` 的用法一致，但 `useRef ` 并不局限在引用 DOM 节点上，它可以很方便存放任意值的引用，且**在组件渲染时保持不变**。

> 请记住，当 ref 对象内容发生变化时，`useRef` 并*不会*通知你。变更 `.current` 属性不会引发组件重新渲染。如果想要在 React 绑定或解绑 DOM 节点的 ref 时运行某些代码，则需要使用[回调 ref](https://zh-hans.reactjs.org/docs/hooks-faq.html#how-can-i-measure-a-dom-node) 来实现。

> 关于 `useRef` ，可以参考 React 进阶中的 [函数组件 useRef](https://bigricerice.github.io/bigRiceRice.io/dist/2023/01/09/react-hight/#%E5%87%BD%E6%95%B0%E7%BB%84%E4%BB%B6-useref)

## Hooks FAQ

### **[采纳策略](https://zh-hans.reactjs.org/docs/hooks-faq.html#adoption-strategy)**

-   [哪个版本的 React 包含了 Hook？](https://zh-hans.reactjs.org/docs/hooks-faq.html#which-versions-of-react-include-hooks)
-   [我需要重写所有的 class 组件吗？](https://zh-hans.reactjs.org/docs/hooks-faq.html#do-i-need-to-rewrite-all-my-class-components)
-   [有什么是 Hook 能做而 class 做不到的？](https://zh-hans.reactjs.org/docs/hooks-faq.html#what-can-i-do-with-hooks-that-i-couldnt-with-classes)
-   [我的 React 知识还有多少是仍然有用的？](https://zh-hans.reactjs.org/docs/hooks-faq.html#how-much-of-my-react-knowledge-stays-relevant)
-   [我应该使用 Hook，class，还是两者混用？](https://zh-hans.reactjs.org/docs/hooks-faq.html#should-i-use-hooks-classes-or-a-mix-of-both)
-   [Hook 能否覆盖 class 的所有使用场景？](https://zh-hans.reactjs.org/docs/hooks-faq.html#do-hooks-cover-all-use-cases-for-classes)
-   [Hook 会替代 render props 和高阶组件吗？](https://zh-hans.reactjs.org/docs/hooks-faq.html#do-hooks-replace-render-props-and-higher-order-components)
-   [Hook 对于 Redux connect() 和 React Router 等流行的 API 来说，意味着什么？](https://zh-hans.reactjs.org/docs/hooks-faq.html#what-do-hooks-mean-for-popular-apis-like-redux-connect-and-react-router)
-   [Hook 能和静态类型一起用吗？](https://zh-hans.reactjs.org/docs/hooks-faq.html#do-hooks-work-with-static-typing)
-   [如何测试使用了 Hook 的组件？](https://zh-hans.reactjs.org/docs/hooks-faq.html#how-to-test-components-that-use-hooks)
-   [lint 规则具体强制了哪些内容？](https://zh-hans.reactjs.org/docs/hooks-faq.html#what-exactly-do-the-lint-rules-enforce)

### **[从 Class 迁移到 Hook](https://zh-hans.reactjs.org/docs/hooks-faq.html#from-classes-to-hooks)**

-   [生命周期方法要如何对应到 Hook？](https://zh-hans.reactjs.org/docs/hooks-faq.html#how-do-lifecycle-methods-correspond-to-hooks)
-   [我该如何使用 Hook 进行数据获取？](https://zh-hans.reactjs.org/docs/hooks-faq.html#how-can-i-do-data-fetching-with-hooks)
-   [有类似实例变量的东西吗？](https://zh-hans.reactjs.org/docs/hooks-faq.html#is-there-something-like-instance-variables)
-   [我应该使用单个还是多个 state 变量？](https://zh-hans.reactjs.org/docs/hooks-faq.html#should-i-use-one-or-many-state-variables)
-   [我可以只在更新时运行 effect 吗？](https://zh-hans.reactjs.org/docs/hooks-faq.html#can-i-run-an-effect-only-on-updates)
-   [如何获取上一轮的 props 或 state？](https://zh-hans.reactjs.org/docs/hooks-faq.html#how-to-get-the-previous-props-or-state)
-   [为什么我会在我的函数中看到陈旧的 props 和 state ？](https://zh-hans.reactjs.org/docs/hooks-faq.html#why-am-i-seeing-stale-props-or-state-inside-my-function)
-   [我该如何实现 getDerivedStateFromProps？](https://zh-hans.reactjs.org/docs/hooks-faq.html#how-do-i-implement-getderivedstatefromprops)
-   [有类似 forceUpdate 的东西吗？](https://zh-hans.reactjs.org/docs/hooks-faq.html#is-there-something-like-forceupdate)
-   [我可以引用一个函数组件吗？](https://zh-hans.reactjs.org/docs/hooks-faq.html#can-i-make-a-ref-to-a-function-component)
-   [我该如何测量 DOM 节点？](https://zh-hans.reactjs.org/docs/hooks-faq.html#how-can-i-measure-a-dom-node)
-   [const [thing, setThing] = useState() 是什么意思？](https://zh-hans.reactjs.org/docs/hooks-faq.html#what-does-const-thing-setthing--usestate-mean)

### **[性能优化](https://zh-hans.reactjs.org/docs/hooks-faq.html#performance-optimizations)**

-   [我可以在更新时跳过 effect 吗？](https://zh-hans.reactjs.org/docs/hooks-faq.html#can-i-skip-an-effect-on-updates)
-   [在依赖列表中省略函数是否安全？](https://zh-hans.reactjs.org/docs/hooks-faq.html#is-it-safe-to-omit-functions-from-the-list-of-dependencies)
-   [如果我的 effect 的依赖频繁变化，我该怎么办？](https://zh-hans.reactjs.org/docs/hooks-faq.html#what-can-i-do-if-my-effect-dependencies-change-too-often)
-   [我该如何实现 shouldComponentUpdate？](https://zh-hans.reactjs.org/docs/hooks-faq.html#how-do-i-implement-shouldcomponentupdate)
-   [如何记忆计算结果？](https://zh-hans.reactjs.org/docs/hooks-faq.html#how-to-memoize-calculations)
-   [如何惰性创建昂贵的对象？](https://zh-hans.reactjs.org/docs/hooks-faq.html#how-to-create-expensive-objects-lazily)
-   [Hook 会因为在渲染时创建函数而变慢吗？](https://zh-hans.reactjs.org/docs/hooks-faq.html#are-hooks-slow-because-of-creating-functions-in-render)
-   [如何避免向下传递回调？](https://zh-hans.reactjs.org/docs/hooks-faq.html#how-to-avoid-passing-callbacks-down)
-   [如何从 useCallback 读取一个经常变化的值？](https://zh-hans.reactjs.org/docs/hooks-faq.html#how-to-read-an-often-changing-value-from-usecallback)

### **[底层原理](https://zh-hans.reactjs.org/docs/hooks-faq.html#under-the-hood)**

-   [React 是如何把对 Hook 的调用和组件联系起来的？](https://zh-hans.reactjs.org/docs/hooks-faq.html#how-does-react-associate-hook-calls-with-components)
-   [Hook 使用了哪些现有技术？](https://zh-hans.reactjs.org/docs/hooks-faq.html#what-is-the-prior-art-for-hooks)
