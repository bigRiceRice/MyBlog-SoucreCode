---
title: React - APIS
author: BigRice
date: 2023-01-15
location: 云梦泽
summary: 记录了一些 React 中的常用 API
tags:
    - React
---

## React 顶层 API

`React` 是 React 库的入口。如果你通过使用 `<script>` 标签的方式来加载 React，则可以通过 `React` 全局变量对象来获得 React 的顶层 API。

-   当你使用 ES6 与 npm 时，可以通过编写 `import React from 'react'` 来引入它们。
-   当你使用 ES5 与 npm 时，则可以通过编写 `var React = require('react')` 来引入它们。

## 概览

### 组件

使用 React 组件可以将 UI 拆分为独立且复用的代码片段，每部分都可独立维护。你可以通过子类 `React.Component` 或 `React.PureComponent` 来定义 React 组件。

-   [Reacat.Compenent]()
-   [Reacat.PureComponent]()

React 组件也可以被定义为可被包装的函数：

-   [`React.memo`](https://zh-hans.reactjs.org/docs/react-api.html#reactmemo)

### 创建 React 元素

建议[使用 JSX](https://zh-hans.reactjs.org/docs/introducing-jsx.html) 来编写你的 UI 组件。

每个 JSX 元素都是 [`React.createElement()`](https://zh-hans.reactjs.org/docs/react-api.html#createelement) 的语法糖。一般来说，如果你使用了 JSX，就不再需要调用以下方法。

-   [createElement()](https://zh-hans.reactjs.org/docs/react-api.html#createelement)
-   ~~[createFactory()](https://zh-hans.reactjs.org/docs/react-api.html#createfactory)~~

### 转换元素

`React` 提供了几个用于操作元素的 API：

-   [cloneElement()](https://zh-hans.reactjs.org/docs/react-api.html#cloneelement)
-   [isValidElement()](https://zh-hans.reactjs.org/docs/react-api.html#isvalidelement)
-   [React.Children](https://zh-hans.reactjs.org/docs/react-api.html#reactchildren)

### Fragments

`React` 还提供了用于减少不必要嵌套的组件。

-   [React.Fragment](https://zh-hans.reactjs.org/docs/react-api.html#reactfragment)

### Suspense

Suspense 使得组件可以“等待”某些操作结束后，再进行渲染。

目前，Suspense 仅支持的使用场景是：[通过 `React.lazy` 动态加载组件](https://zh-hans.reactjs.org/docs/code-splitting.html#reactlazy)。它将在未来支持其它使用场景，如数据获取等。

-   [`React.lazy`](https://zh-hans.reactjs.org/docs/react-api.html#reactlazy)
-   [`React.Suspense`](https://zh-hans.reactjs.org/docs/react-api.html#reactsuspense)

### Hooks

_Hook_ 是 React 16.8 的新增特性。它可以让你在不编写 class 的情况下使用 state 以及其他的 React 特性。Hook 拥有[专属文档章节](https://zh-hans.reactjs.org/docs/hooks-intro.html)和单独的 API 参考文档：

-   [基础 Hook](https://zh-hans.reactjs.org/docs/hooks-reference.html#basic-hooks)
    -   [`useState`](https://zh-hans.reactjs.org/docs/hooks-reference.html#usestate)
    -   [`useEffect`](https://zh-hans.reactjs.org/docs/hooks-reference.html#useeffect)
    -   [`useContext`](https://zh-hans.reactjs.org/docs/hooks-reference.html#usecontext)
-   [额外的 Hook](https://zh-hans.reactjs.org/docs/hooks-reference.html#additional-hooks)
    -   [`useReducer`](https://zh-hans.reactjs.org/docs/hooks-reference.html#usereducer)
    -   [`useCallback`](https://zh-hans.reactjs.org/docs/hooks-reference.html#usecallback)
    -   [`useMemo`](https://zh-hans.reactjs.org/docs/hooks-reference.html#usememo)
    -   [`useRef`](https://zh-hans.reactjs.org/docs/hooks-reference.html#useref)
    -   [`useImperativeHandle`](https://zh-hans.reactjs.org/docs/hooks-reference.html#useimperativehandle)
    -   [`useLayoutEffect`](https://zh-hans.reactjs.org/docs/hooks-reference.html#uselayouteffect)
    -   [`useDebugValue`](https://zh-hans.reactjs.org/docs/hooks-reference.html#usedebugvalue)
    -   [`useDeferredValue`](https://zh-hans.reactjs.org/docs/hooks-reference.html#usedeferredvalue)
    -   [`useTransition`](https://zh-hans.reactjs.org/docs/hooks-reference.html#usetransition)
    -   [`useId`](https://zh-hans.reactjs.org/docs/hooks-reference.html#useid)
-   [Library Hooks](https://zh-hans.reactjs.org/docs/hooks-reference.html#library-hooks)
    -   [`useSyncExternalStore`](https://zh-hans.reactjs.org/docs/hooks-reference.html#usesyncexternalstore)
    -   [`useInsertionEffect`](https://zh-hans.reactjs.org/docs/hooks-reference.html#useinsertioneffect)

## API

### _Reacat.Compenent_

`React.Component` 是使用 [ES6 classes](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Classes) 方式定义 React 类组件的基类，所有类组件都应该继承它

```jsx
class Greeting extends React.Component {
    render() {
        return <h1>Hello, {this.props.name}</h1>;
    }
}
```

### _React.PureComponent_

`React.PureComponent` 与 `React.Component` 很相似。

两者的区别在于 `React.Component` 并未实现 [`shouldComponentUpdate()`](https://zh-hans.reactjs.org/docs/react-component.html#shouldcomponentupdate)，而 `React.PureComponent` 中以浅层对比 prop 和 state 的方式来实现了该函数。

如果赋予 React 组件相同的 props 和 state，`render()` 函数会渲染相同的内容，那么在某些情况下使用 `React.PureComponent` 可提高性能。

> 注意：
>
> `React.PureComponent` 中的 `shouldComponentUpdate()` 将跳过所有子组件树的 prop 更新。因此，请确保所有子组件也都是“纯”的组件。

### 🥂*React.memo*

```jsx
const MyComponent = React.memo(function MyComponent(props) {
    /* 使用 props 渲染 */
});
```

`React.memo` 为[HOC 高阶组件](https://zh-hans.reactjs.org/docs/higher-order-components.html)。用于缓存一个组件的输出，若组件在相同 props 的情况下应该渲染相同的结果，那么你可以通过将其包装在 `React.memo` 中返回

`React.memo` **仅检查 props 变更**。如果函数组件被 `React.memo` 包裹，且其实现中拥有 [`useState`](https://zh-hans.reactjs.org/docs/hooks-state.html)，[`useReducer`](https://zh-hans.reactjs.org/docs/hooks-reference.html#usereducer) 或 [`useContext`](https://zh-hans.reactjs.org/docs/hooks-reference.html#usecontext) 的 Hook，当 state 或 context 发生变化时，它**仍会重新渲染**。

默认情况下 `memo` 只会对复杂对象做浅层对比，如果你想要控制对比过程，那么请将自定义的比较函数通过第二个参数传入来实现。

```jsx
function MyComponent(props) {
    /* 使用 props 渲染 */
}
function areEqual(prevProps, nextProps) {
    /*
  如果把 nextProps 传入 render 方法的返回结果与
  将 prevProps 传入 render 方法的返回结果一致则返回 true，
  否则返回 false
  */
}
export default React.memo(MyComponent, areEqual);
```

此方法仅作为**[性能优化](https://zh-hans.reactjs.org/docs/optimizing-performance.html)**的方式而存在。但请**不要依赖它来“阻止”渲染**，因为这会产生 bug。

### _React.cloneElement_

```js
React.cloneElement(element, [config], [...children]);
```

以 `element` 元素为模板克隆并返回新的 React 元素。

`config` 中应包含新的 props，`key` 或 `ref`。返回元素的 props 是将新的 props 与原始元素的 props 浅层合并后的结果。

新的子元素将取代现有的子元素，如果在 `config` 中未出现 `key` 或 `ref`，那么原始元素的 `key` 和 `ref` 将被保留。

`React.cloneElement()` 几乎等同于：

```jsx
<element {...element.props} {...props}>{children} />
```

> 一个使用的例子：[HOC - 修改渲染树](https://bigricerice.github.io/bigRiceRice.io/dist/2023/01/09/react-higher-order-components/#%E6%8E%A7%E5%88%B6%E6%B8%B2%E6%9F%93) 请往下滑找到【反向继承：修改渲染树】

### _React.isValidElement_

```js
React.isValidElement(object);
```

验证对象是否为 React 元素，返回值为 `true` 或 `false`。

### _React.Children_

`React.Children` 提供了一套用于处理 `this.props.children` 不透明数据结构的实用方法，其中包含：

以下所有方法的第一个参数都是 `children` 插槽内容参数。

-   _React.Children.map_
-   _React.Children.forEach_
-   _React.Children.count_
-   _React.Children.only_
-   _React.Children.toArray_

#### _React.Children.map_

```js
React.Children.map(children, callback(items));
```

行为与 _Array.prototype.map_ 一致，遍历数组元素并返回一组 React 元素。

-   如果 `children` 是一个数组，它将被遍历并为数组中的每个子节点调用该函数。
-   如果 `children` 为 `null` 或是 `undefined`，则此方法将返回 `null` 或是 `undefined`，而不会返回数组。

使用场景：可以使用它结合 `cloneElement` 完成 HOC 渲染劫持

> 注意
>
> 如果 `children` 是一个 `Fragment` 对象，它将被视为单一子节点的情况处理，而不会被遍历。

#### _React.Children.forEach_

```js
React.Children.forEach(children, callback(items));
```

与 _React.Children.map_ 类似，但它不会返回一个数组。

#### _React.Children.count_

```js
React.Children.count(children);
```

返回 `children` 中的组件总数量，等同于通过 `map` 或 `forEach` 调用回调函数的次数。

#### _React.Children.only_

```js
React.Children.only(children);
```

验证 `children` 是否只有一个子节点（一个 React 元素），如果有则返回它，否则此方法会抛出错误。

> 注意：
>
> `React.Children.only()` 不接受 `React.Children.map()` 的返回值，因为它是一个数组而并不是 React 元素。

#### _React.Children.toArray_

```js
React.Children.toArray(children);
```

将 `children` 这个复杂的数据结构以数组的方式扁平展开并返回，并为每个子节点分配一个 key。当你想要在渲染函数中操作子节点的集合时，它会非常实用，特别是当你想要在向下传递 `this.props.children` 之前对内容重新排序或获取子集时。

### 🥂*React.Fragment*

`React.Fragment` 组件能够在不额外创建 DOM 元素的情况下，让 `render()` 方法中返回多个元素。

```jsx
render() {
  return (
    <React.Fragment>
      Some text.
      <h2>A heading</h2>
    </React.Fragment>
  );
}
```

你也可以使用其简写语法 `<></>`：

```jsx
render() {
  return (
    <>
      Some text.
      <h2>A heading</h2>
    </>
  );
}
```

### _React.createRef_

```js
const myRef = createRef(initial);
```

-   `initial`：可选，赋给 `myRef.current` 引用的初始值

`React.createRef` 创建一个能够通过 ref 属性附加到 React 元素的 Ref 引用，可用于引用 **DOM 节点或组件实例**。

`createRef` 创建的 Ref 会在每次组件渲染时重新获取引用！

```jsx
class MyComponent extends React.Component {
    constructor(props) {
        super(props);

        this.inputRef = React.createRef();
    }

    render() {
        return <input type="text" ref={this.inputRef} />;
    }

    componentDidMount() {
        this.inputRef.current.focus();
    }
}
```

### 🥂*React.forwardRef*

```js
React.forwardRef(rederFn(props, ref));
```

`React.forwardRef` 只有一个参数，即渲染函数，这个渲染函数接收两个参数，一个是传递下来的 _props_，里一个是传递下来的 _ref prop_ ，主要用法就是在这个渲染函数中 _ref prop_ 传递下去。

`React.forwardRef` 的返回值为**包装后的 React 组件**。

具体使用场景如下：

```jsx
const FancyButton = React.forwardRef((props, ref) => (
    <div>
        <button ref={ref} className="FancyButton">
            {props.children}
        </button>
    </div>
));

// 现在我们的 ref prop 将被转发至组件内部的 button 而非 div
const ref = React.createRef();
<FancyButton ref={ref}>Click me!</FancyButton>;
```

> 这种技术并不常见，但在以下两种场景中特别有用：
>
> -   [转发 refs 到 DOM 组件](https://zh-hans.reactjs.org/docs/forwarding-refs.html#forwarding-refs-to-dom-components)
> -   [在高阶组件如何跨层级捕获 Ref](https://bigricerice.github.io/bigRiceRice.io/dist/2023/01/09/react-higher-order-components/#%E5%9B%9B%E3%80%81%E5%A6%82%E4%BD%95%E8%B7%A8%E5%B1%82%E7%BA%A7%E6%8D%95%E8%8E%B7-ref)

### _React.lazy_

`React.lazy()` 允许你定义一个动态加载的组件。这有助于缩减 bundle 的体积，并延迟加载在初次渲染时未用到的组件。

> `lazt()` 是一个高阶组件
>
> 大致的原理如下：
>
> ```jsx
> /* 路由懒加载HOC */
> export default function lazy(lazyComponent) {
>     return class Content extends React.Component {
>         state = { Component: null };
>         componentDidMount() {
>             if (this.state.Component) return;
>             lazyComponent()
>                 .then(module => module.default)
>                 .then(Component => this.setState({ Component }));
>         }
>         render() {
>             const { Component } = this.state;
>             return Component ? <Component {...this.props} /> : null;
>         }
>     };
> }
> ```

用法如下：

```js
// 这个组件是动态加载的
const SomeComponent = React.lazy(() => import("./SomeComponent"));
```

请注意，渲染 `lazy` 组件依赖该组件渲染树上层的 `<React.Suspense>` 组件。这是指定加载指示器（loading indicator）的方式。

### _React.Suspense_

`React.Suspense` 可以指定加载指示器（loading indicator），以防其组件树中的某些子组件尚未具备渲染条件。

如今，懒加载组件是 `<React.Suspense>` 支持的唯一用例：

```jsx
// 该组件是动态加载的
const OtherComponent = React.lazy(() => import("./OtherComponent"));

function MyComponent() {
    return (
        //  OtherComponent 组件加载完成之前都会显示 <Foo> 组件
        <React.Suspense fallback={<Foo />}>
            <div>
                <OtherComponent />
            </div>
        </React.Suspense>
    );
}
```

请注意，`lazy` 组件可以位于 `Suspense` 组件树的深处——它不必包装树中的每一个延迟加载组件。

最佳实践是将 `<Suspense>` 置于你想展示加载指示器（loading indicator）的位置，而 `lazy()` 则可被放置于任何你想要做代码分割的地方。
