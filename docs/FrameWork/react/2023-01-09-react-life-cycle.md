---
title: React - 生命周期
author: BigRice
date: 2023-01-09
location: 云梦泽
summary: 关于类组件的生命周期
tags:
    - React
---

## React 生命周期图（旧）V16.4 前

<img src="https://sbr-1314368469.cos.ap-guangzhou.myqcloud.com/Images/202301031545400.png" alt="image-20230103154554327" style="zoom:80%;" />

## 挂载流程

### _constructor_

参数类型：`constructor(props)`

在 React 组件挂载之前，会调用该构造函数，构造函数中应该在顶层声明 `super(Props)` 。

通常，在 React 中，构造函数仅用于以下两种情况：

-   使用 `this.state` 初始化状态
-   为[事件处理函数](https://zh-hans.reactjs.org/docs/handling-events.html)绑定实例

##### 请注意：

-   不要在构造函数中调用 `setState()` 方法，若需要使用内部 state，请直接在构造函数中为 `this.state` 赋值初始 `state`
-   请避免在构造函数中引入任何副作用或订阅。如遇到此场景，请将对应的操作放置在 `componentDidMount` 中。
-   **避免将 props 的值复制给 state！这么做毫无意义**

### ⭕ ~~_componentWillMount_~~

该钩子在组件将要挂载时调用（在 V17 后废弃）

-   可使用 `UNSAFE_componentWillMount` 代替。

### _render_

`render()` 方法是类组件中**唯一必须实现**的方法，它决定了组件的输出内容，在它调用后才会经过底层渲染。

##### 请注意：

-   🟠 `render` 函数调用后不会立即执行更新 DOM 和 Refs，它只是决定了应该渲染的内容！！！

    -   在它之后还会经过一个 `getSnapshotBeforeUpdata` 与钩子。

-   每次调用 `setState` 时都会再次触发 `render` 渲染函数。

-   一定不要在 `render` 中调用 `setState`这将会造成死循环！

-   `render` 应该是个纯函数！这意味着在不修改组件 state 的情况下，每次调用时都返回相同的结果，并且它不会直接与浏览器交互。

### _componentDidMount_

该钩子在组件完成第一次 `render` 并插入 DOM 树后调用，即挂载完毕。

这个方法是比较适合添加或执行副作用函数的地方。如果添加了订阅，请不要忘记在 `componentWillUnmount()` 里取消订阅

##### 请注意：

-   若在 `componentDidMount()` 里调用 `setState()`。它将触发**额外渲染**，但此渲染会发生在浏览器更新屏幕之前。
    -   请谨慎使用该模式，因为它会导致性能问题。

## 更新流程

### ⭕ ~~_componentWillReceiveProps_~~

该钩子只在子组件**将要**接收到父组件传递过来的参数后调用。（在 V17 后废弃）

##### 请注意：

-   父组件第一次传的 Props 不会引起该钩子调用,只有第一次以后的 Render 才会调用
-   可使用 `UNSAFE_componentWillReceiveProps` 代替。

### 👀 _shouldComponentUpdate_

该钩子决定是否允许更新状态，需要返回布尔值决定是否允许更新状态。

该钩子在 ~~`componentWillReceiveProps`~~ 后或 `setState` 后执行。

##### 请注意：

-   当 `props` 或 `state` 发生变化时，`shouldComponentUpdate()` 会在渲染执行之前被调用。
-   返回值默认为 `true` 且**首次渲染**或使用 `forceUpdate()` 时不会经过该方法。
-   此方法仅作为**[性能优化的方式](https://zh-hans.reactjs.org/docs/optimizing-performance.html)**而存在。不要企图依靠此方法来“阻止”渲染，因为这可能会产生 bug。

### ⭕ ~~_componentWillUpdate_~~

该钩子在状态将要更新状态时调用。（在 V17 后废弃）

##### 请注意：

-   该钩子只在 `shouldComponentUpdate` 后或 `forceUpdate` 强制更新状态后调用。

-   可使用 `UNSAFE_componentWillUpdate` 代替。

### _componentDidUpdate_

<img src="https://sbr-1314368469.cos.ap-guangzhou.myqcloud.com/Images/202301031916282.png" alt="code" style="zoom:80%;" />

该钩子在状态完成更新后被立即调用。首次渲染不会执行此方法。

##### 请注意：

-   该钩子只在 `render` 因 `setState` 引起的**重新**渲染后调用。

## 卸载流程

### _componentWillUnmount_

该钩子在组件将要卸载时调用。

##### 请注意：

-   并没有 `componentDidUnmount` 组件卸载完毕这样的方法！

## React 生命周期图（新）V16.4 后

![image-20230103153540791](https://sbr-1314368469.cos.ap-guangzhou.myqcloud.com/Images/202301031535865.png)

##### 新版的生命周期的变化

-   移除了三个钩子：
    -   `componentWillMount`
    -   `componentWillReceiveProps`
    -   `componentWillUpdate`
-   新增了两个钩子
    -   `static getDerivedStateFromProps`
    -   `getSnapshotBeforeUpdata`

## _static getDerivedStateFromProps_

<img src="https://sbr-1314368469.cos.ap-guangzhou.myqcloud.com/Images/202301031815334.png" alt="code" style="zoom:80%;" />

`getDerivedStateFromProps` 直译（获取 Props 将其派生至 State），用于设置状态。

该生命周期钩子在 `constructor` 调用后与组件更新后立即调用，若声明了该钩子，必须返回对象用于 `state` 或 `null`。

> 可以使用该钩子将某个状态当作计算属性，即在钩子中根据 props 计算值并返回用作 state

##### 请注意：

-   该钩子必须使用 `static` 声明，若返回值，那么必须将 `state` 提前初始化。

-   该钩子的**使用场景很特殊**，即 `state` 的值**在任何时候**都取决于 `props`。
    -   所以声明了钩子并返回了值，那么 `state` 将一直是该值且再也不会改变，因为更新后的第一个执行的钩子就是它。
-   派生状态会导致代码冗余，并使组件难以维护！
-   每次渲染前触发此方法！

## _getSnapshotBeforeUpdata_

<img src="https://sbr-1314368469.cos.ap-guangzhou.myqcloud.com/Images/202301031816436.png" alt="code" style="zoom:80%;" />

`getSnapshotBeforeUpdata` 钩子在最近一次渲染输出（提交到 DOM 节点）之前调用。

它的作用是在发生更改之前从 DOM 中记录一些将要不存在的旧数据（例如，滚动位置）后交给 `componentDidUpdate` 在更新后做处理。

##### 请注意：

-   该钩子**必须存在返回值**，它的返回值会作为 `componentDidUpdate` 的第三个参数。

-   此用法并不常见，但它可能出现在 UI 处理中，如需要以特殊方式处理滚动位置的聊天线程等。

#### 例子

我们可以通过一个例子来看一下 `getSnapshotBeforeUpdata` 的使用场景。

在这里例子中，创建了一个窗口，每半秒都有新的朋友圈增加，将之前的挤下去：

<img src="https://sbr-1314368469.cos.ap-guangzhou.myqcloud.com/Images/202301031957364.png" alt="code" style="zoom:80%;" />

<img src="https://sbr-1314368469.cos.ap-guangzhou.myqcloud.com/Images/202301032007671.gif" alt="demo" style="zoom:80%;" />

现在我们将引入一个需求：当滚动条出现后，新增的朋友圈不能将已经存在朋友圈的挤下去，而是在最下方。

再不改变代码逻辑的前提下，要完成这个需求只能在滚动条上找机会，那么我们就可以使用 `getSnapshotBeforeUpdata` 保存修改前的滚动条高度并返回，这样更新后就能拿到更新前的高度做处理了:

<img src="https://sbr-1314368469.cos.ap-guangzhou.myqcloud.com/Images/202301032006912.png" alt="code" style="zoom:80%;" />

<img src="https://sbr-1314368469.cos.ap-guangzhou.myqcloud.com/Images/202301032008357.gif" alt="demo" style="zoom:80%;" />

当然还有更简单的方法，完全不需要用到 `getSnapshotBeforeUpdata`，那就是在更新后对 `lists` 元素使用 `scrollBy` 就好了：

<img src="https://sbr-1314368469.cos.ap-guangzhou.myqcloud.com/Images/202301032012638.png" alt="code" style="zoom:80%;" />
