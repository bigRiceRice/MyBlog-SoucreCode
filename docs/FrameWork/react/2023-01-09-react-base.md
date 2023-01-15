---
title: React - 基础
author: BigRice
date: 2023-01-09
location: 云梦泽
summary:
tags:
    - React 入门基础总结
---

## 创建 React 应用

1. 使用 `npx create-react-app [project-name] ` 创建工程目录
2. `cd [project-name]`
3. `yarn start`

> 💎 推荐使用 vite 创建
> `npm create vite` 随后选择 React 模板

## JSX 语法

在 React 中使用 JSX 语法来定义 **HTML** 中的内容，即将 HTML 之间写在 JS 代码中，就像这样：

<img src="https://sbr-1314368469.cos.ap-guangzhou.myqcloud.com/Images/202301032058871.png" alt="code" style="zoom:50%;" />

### JS 表达式

在 JSX 中，在单个花括号 `{}` 中填写 JS 表达式来完成数据的绑定或函数的运算：

<img src="https://sbr-1314368469.cos.ap-guangzhou.myqcloud.com/Images/202301032059209.png" alt="code" style="zoom: 50%;" />

JSX 也是一个表达式：在编译之后，JSX 表达式会被转为普通 JavaScript 函数调用，并且对其取值后得到 JavaScript 对象。

这意味着可以在 `if` 语句和 `for` 循环的代码块中使用 JSX，将 JSX 赋值给变量，把 JSX 当作参数传入，以及从函数中返回 JSX。

### 绑定事件

在 JSX 中，使用 `onXXX` 来绑定事件，例如 `onClick` 用来监听点击事件，并传入需要执行的函数：

<img src="https://sbr-1314368469.cos.ap-guangzhou.myqcloud.com/Images/202301032101566.png" alt="code" style="zoom: 50%;" />

-   ##### JSX 的事件传参只能通过使用箭头函数二次调用待执行函数后传参

-   或调用一个柯里化函数：

      <img src="https://sbr-1314368469.cos.ap-guangzhou.myqcloud.com/Images/202301032110905.png" alt="code" style="zoom: 50%;" />

### 列表渲染

在 React 中，没有 `wx:for` 或 `v-for` 这样的语法糖，只能使用原生的遍历渲染，**且有且只有** `.map` 可以完成，因为 `.forEach` 没有返回值：

> `key` 属性也是必不可少的！

<img src="https://sbr-1314368469.cos.ap-guangzhou.myqcloud.com/Images/202301032112506.png" alt="code" style="zoom:50%;" />

### 注意

JSX 中有许多小细节，比如：

-   定义元素的类不再是 `class` 而是 `className`
-   `<label>` 元素的 `for` 属性变成了 `htmlFor`
-   JSX 元素必须有一个共同的父标签，就像 `VUE2` 那样
    -   但可以使用 `<></>` 这样诡异的语法糖 🙄
-   注释的语法为 `{/* */}`

## 两种组件定义

在 React 中，一般有两种方式定义组件：

1. 函数式组件
2. 类组件

它们都必须满足以下条件：

1. 用户定义的组件**必须以大写字母开头**
2. 都必须返回 JSX 语法形式或 `createElement()` 创建的元素

### 函数式组件

函数式组件的定义更像 Vue3 的 Composition API，因为它可以配合 **_Hook_** 函数使用，灵活性更高！

<img src="https://sbr-1314368469.cos.ap-guangzhou.myqcloud.com/Images/202301032119413.png" alt="code" style="zoom:67%;" />

函数式组件无法像类组件那样正常的定义生命周期与私有状态。但是，它可以使用 **_Hooks_** 钩子来定义！

> _Hook_ 是 \*React 16.8 的新增特性。它可以让你在不编写 class 的情况下使用 state 以及其他的 React 特性。

就像这样，弥补不能正常定义私有状态的缺点，且更加灵活：

<img src="https://sbr-1314368469.cos.ap-guangzhou.myqcloud.com/Images/202301032120566.png" alt="code" style="zoom:67%;" />

### 类组件

类组件像 _Vue2_ 的 Options API 风格。

<img src="https://sbr-1314368469.cos.ap-guangzhou.myqcloud.com/Images/202301032121965.png" alt="code" style="zoom:67%;" />

类组件相比于函数组件直接将状态定义在 `state` 中，且直接定义生命周期钩子，而且必须返回一个 `render` 方法。

<img src="https://sbr-1314368469.cos.ap-guangzhou.myqcloud.com/Images/202301032131087.png" alt="code" style="zoom:67%;" />

### 两者之间的异同

#### 不同

函数式组件

- 根基是 FP(函数式编程)，与数学中的函数思想类似，所以假定输入和输出存在某种关联的话，那么相同输入必定会有**相同的输出（状态同步问题）**

- 代码风格依赖 *Hook*
- 无法实现继承
- Hook 完成代码复用方便
- `this` 为 `undefinde`

类组件

- 根基是 OOP(面向对象编程)，所以它会有继承，有内部状态管理等
- 代码风格依赖配置项
- 可以实现继承
- HOC 高阶组件完成代码复用很麻烦

> 相对于类组件，函数组件更加的纯粹，简单，更利于测试，这是本质上的区别

#### 相同 

组件是 React 可复用的最小代码片段，它们会返回要在页面中渲染 React 元素。

也正是基于这一点，所以**在 React 中无论是函数组件，还是类组件，其实它们最终呈现的效果都是一致的**，如果你原因也可以把类组件重构成函数组件，反之也可以（虽然不推荐）。

#### 关于“状态同步问题”

> 参考文章：[react 函数式组件与类组件区别](https://zhuanlan.zhihu.com/p/208551225#:~:text=%E4%BA%8C%E3%80%81%E5%87%BD%E6%95%B0%E5%BC%8F%E7%BB%84%E4%BB%B6%E4%B8%8E%E7%B1%BB%E7%BB%84%E4%BB%B6%E7%9A%84%E5%8C%BA%E5%88%AB)

上面所说的函数式组件相同输入必定会有**相同的输出**，其实就体现在**函数组件会一直保存捕获当前渲染时所用的值**

下面有一个例子：

>  函数式组件与类组件在点击按钮的两秒后显示当前的 Prop 值

<img src="https://sbr-1314368469.cos.ap-guangzhou.myqcloud.com/Images/202301131641171.png" alt="code" style="zoom: 50%;" />

> 在父组件中添加两个组件

<img src="https://sbr-1314368469.cos.ap-guangzhou.myqcloud.com/Images/202301131642989.png" alt="code" style="zoom:50%;" />

> 显示效果：

<img src="https://sbr-1314368469.cos.ap-guangzhou.myqcloud.com/Images/202301131644855.png" alt="image-20230113164406093" style="zoom:67%;" />

定义好后，我们按以下操作测试代码：

1. 点击函数查询 / 类查询
2. 在两秒中内切换 `select` 框中的值
3. 查看弹出信息

- 下面是点击类查询的结果：

    <img src="https://sbr-1314368469.cos.ap-guangzhou.myqcloud.com/Images/202301131702115.gif" alt="demo" style="zoom: 67%;" />

- 下面是点击函数查询的结果：

    <img src="https://sbr-1314368469.cos.ap-guangzhou.myqcloud.com/Images/202301131705340.gif" alt="demo" style="zoom:67%;" />

通过上述操作，函数式组件中弹出的值都是点击按钮那一刻的值（印证了相同输入必定会有**相同的输出**），而类组件可以保持输入最新的值。

原因如下：

当我们更新状态的时候, React 会重新渲染组件, 每一次渲染都会拿到独立的 `user` 状态,  并重新渲染一个  `handleClick`  函数.  每一个 `handleAlertClick` 里面都有它自己的 `user` 。这就是为什么函数组件会出现这种情况。

但是在类组件中， `this` 是一直在改变的，所以类组件中的方法点击时可以获取到最新的实例（即 `this`）进而显示出最新的值了。

> 那么有没有一种方式解决呢？
>
> 在这个例子中将两者的行为对调了：[类组件使用闭包，函数组件使用 useRef](https://codesandbox.io/s/eloquent-glitter-zh900?file=/src/FunctionComponent.js)

## 组件传参

### 父子组件传参

在 React 中，在子组件上自定义属性即可完成传参，父组件传递回调函数子组件也可以完成传参。

下面是一个子组件增加父组件数字的例子：

<img src="https://sbr-1314368469.cos.ap-guangzhou.myqcloud.com/Images/202301032132828.png" alt="code" style="zoom: 50%;" />

<img src="https://sbr-1314368469.cos.ap-guangzhou.myqcloud.com/Images/202301032132394.png" alt="code" style="zoom: 50%;" />

<img src="https://sbr-1314368469.cos.ap-guangzhou.myqcloud.com/Images/202301032133851.png" alt="code" style="zoom: 50%;" />

### Context 传参

更多时候，通过 `<Son />`  这个中间组件将参数传递到最底部的组件这种方式太过繁琐（可能中间组件并不需要 props）这个时候我们可以使用 `context API` 来解决这个问题。

#### API

React 提供了一套 `Context API` 一种在组件之间共享值的方式，不必显式地通过组件树的逐层传递 props。



##### [*React.createContext*](https://react.docschina.org/docs/context.html#reactcreatecontext)

```js
const MyContext = React.createContext(defaultValue);
```

创建一个 Context 上下文对象。

**只有**当组件所处的树中没有匹配到 Provider 时，其 `defaultValue` 参数才会生效。

此默认值有助于在不使用 Provider 包装组件的情况下对组件进行测试。

> 注意：将 `undefined` 传递给 Provider 的 value 时，消费组件的 `defaultValue` 不会生效。



##### [*Context.Provider*](https://react.docschina.org/docs/context.html#contextprovider)

```jsx
<MyContext.Provider value={/* 某个值 */}>
```

每个 `React.createContext` 创建出来的 *Context* 对象都会返回一个 *Context.Provider* 组件，它将作为数据提供组件。

Provider 接收一个 `value` 属性，传递给消费组件。一个 Provider 可以和多个消费组件有对应关系。多个 Provider 也可以嵌套使用，里层的会覆盖外层的数据。



##### [*Context.Consumer*](https://react.docschina.org/docs/context.html#contextconsumer)

```jsx
<MyContext.Consumer>
  {value => /* 基于 context 值进行渲染*/}
</MyContext.Consumer>
```

Consumer 消费者组件可以使函数组件获取到 Context 上下文提供的数据。

这种方法需要一个[函数作为子元素（function as a child）](https://react.docschina.org/docs/render-props.html#using-props-other-than-render)。这个函数接收当前的 Context 上下文对象，并要求返回一个 React 节点。

函数的 `value` 将为最近的 Provider 提供的 `value` （因为可能有嵌套可能）。如果没有 Provider，`value` 等同于传递给 `createContext()` 的 `defaultValue`。

> 在函数式组件中更加推荐使用 `useContext hook`  来获取 Context 上下文对象



##### [*Class.contextType*](https://react.docschina.org/docs/context.html#classcontexttype)

ContextType 可以使类组件获取到 Context 上下文提供的数据。

```js
class MyClass extends React.Component {
    state = {
		context : null
    }
    componentDidMount() {
        this.setState({ coutext : this.context })
        /* 在组件挂载完成后，使用 MyContext 组件的值来执行一些有副作用的操作 */
    }
}
MyClass.contextType = MyContext;
```

当将类组件的 `contextType` 赋值为 `Context` 上下文对象后，就可以在类组件中访问 `this.context` 了。

> 也可以使用  [public class fields 语法](https://babeljs.io/docs/plugins/transform-class-properties/) 赋值 `contextType`
>
> ```jsx
> class MyClass extends React.Component {
>   static contextType = MyContext;
>   render() {
>     let value = this.context;
>     /* 基于这个值进行渲染工作 */
>   }
> }
> ```



##### [*Context.displayName*](https://react.docschina.org/docs/context.html#contextdisplayname)

context 对象接受一个名为 `displayName` 的 property，类型为字符串。React DevTools 使用该字符串来确定 context 要显示的内容。

示例，下述组件在 DevTools 中将显示为 MyDisplayName：

```jsx
const MyContext = React.createContext(/* some value */);
MyContext.displayName = 'MyDisplayName';

<MyContext.Provider> // "MyDisplayName.Provider" 在 DevTools 中
<MyContext.Consumer> // "MyDisplayName.Consumer" 在 DevTools 中
```



#### 使用

使用 `React.createContext` 创建一个 `context` 上下文空间。

被 `context.Provider` 包裹的所有组件都将可以访问 `context` 上下文空间：

<img src="https://sbr-1314368469.cos.ap-guangzhou.myqcloud.com/Images/202301032136483.png" alt="code" style="zoom: 50%;" />

<img src="https://sbr-1314368469.cos.ap-guangzhou.myqcloud.com/Images/202301032135450.png" alt="code" style="zoom:67%;" />

<img src="https://sbr-1314368469.cos.ap-guangzhou.myqcloud.com/Images/202301032134843.png" alt="code" style="zoom: 50%;" />

值得注意的是，`Context.Consumer` 中内容**必须**是一个返回 JSX 元素的函数。

但是使用这样的方式来传参会显得代码冗余，我们可以使用 `useContext Hook` 来获取 Context 对象！

就像这样：

<img src="https://sbr-1314368469.cos.ap-guangzhou.myqcloud.com/Images/202301032137606.png" alt="code" style="zoom: 50%;" />

## State

在 React 中，数据都定义在 `state` 状态中，可以将它看成 Vue 的 `data`，只有定义在 `state` 中的数据被修改才能触发视图更新！

### Class State

类组件可直接初始化 `state`，或在 `constructor` 中初始化 `state` 

<img src="https://sbr-1314368469.cos.ap-guangzhou.myqcloud.com/Images/202301032140241.png" alt="code" style="zoom: 50%;" />

类组件使用实例上的 `setState` 更新状态

<img src="https://sbr-1314368469.cos.ap-guangzhou.myqcloud.com/Images/202301032144928.png" alt="code" style="zoom: 50%;" />

#### 关于 *setState*

语法：

```js
setState(updater, [callback])

updater = callback((lastState, props) => state | state)
```

- `updater` ：**必需**
    - 可以传入一个新的 `state` 对象**合并**旧的 state 对象，若旧的不存在，则创建。
    - 可以传入一个回调函数，此回调函数的参数是将为最新的 state 和最新的 props，**必须**返回一个新的 state
- `endCallback`：可选，将在 `setState` 完成合并并重新渲染组件后执行。
    - 通常，建议使用 `componentDidUpdate()` 来代替此方式。

`setState()` 将对组件 state 的更改排入队列，并通知 React 需要使用更新后的 state 重新渲染此组件及其子组件。这是用于更新用户界面以响应事件处理器和处理服务器数据的主要方式。

> 注意：

`setState()` 并不总是立即更新组件。它会批量推迟更新。这使得在调用 `setState()` 后立即读取 `this.state` 成为了隐患。、

为了消除隐患，请使用 `componentDidUpdate` 或者 `setState` 的回调函数（`setState(updater, callback)`），这两种方式都可以保证在应用更新后触发。如需基于之前的 state 来设置当前的 state，可以为 `updater`  传入一个回调函数。



#### 正确地使用 State

在类组件中使用 `setState()` 我们应该了解三件事：

##### 不要直接修改 State！

例如，此代码不会重新渲染组件：

<img src="https://sbr-1314368469.cos.ap-guangzhou.myqcloud.com/Images/202301032144989.png" alt="code" style="zoom:67%;" />

而是应该使用 `setState()` ：

<img src="https://sbr-1314368469.cos.ap-guangzhou.myqcloud.com/Images/202301032145006.png" alt="code" style="zoom:67%;" />

##### State 的更新可能是异步的

出于性能考虑，React 可能会把多个 `setState()` 调用合并成一个调用。

因为 `this.props` 和 `this.state` 可能会异步更新，所以你不要依赖他们的值来更新下一个状态。

例如，此代码可能会无法更新计数器：

<img src="https://sbr-1314368469.cos.ap-guangzhou.myqcloud.com/Images/202301032146262.png" alt="code" style="zoom: 50%;" />

要解决这个问题，可以让 `setState()` 接收一个函数而不是一个对象。

这个函数用上一个 state 作为第一个参数，将此次更新被应用时的 props 做为第二个参数：

<img src="https://sbr-1314368469.cos.ap-guangzhou.myqcloud.com/Images/202301032148676.png" alt="code" style="zoom:50%;" />

##### State 的更新会被合并

当调用 `setState()` 的时候，React 会把提供的对象合并到当前的 state。

例如，state 包含几个独立的变量：

<img src="https://sbr-1314368469.cos.ap-guangzhou.myqcloud.com/Images/202301032148528.png" alt="code" style="zoom: 67%;" />

然后你可以分别调用 `setState()` 来单独地更新它们：

<img src="https://sbr-1314368469.cos.ap-guangzhou.myqcloud.com/Images/202301032149974.png" alt="code" style="zoom: 50%;" />

这里的合并是浅合并，所以 `this.setState({comments})` 完整保留了 `this.state.posts`， 但是完全替换了 `this.state.comments`。

> 值得注意的是函数组件中的 useState 将是**替换**操作，而不是合并 



### Function State

函数组件定义 `state` 只能通过 `useState` *Hook* 来实现，语法如下：

```js
const [state, setState] = useState(initialState);
```

- `initialState`：**必需**，设置初始值
- `state`：初始值的状态引用
- `setState`：更新状态的函数

<img src="https://sbr-1314368469.cos.ap-guangzhou.myqcloud.com/Images/202301032142128.png" alt="code" style="zoom: 50%;" />

当 State 中的数据需要修改时，直接修改它是不会触发视图更新的，需要调用 `ustState` 返回的数组中的第二个元素，即以 `set` 开头的函数来修改数据。

下面是一个点击累加的例子：

<img src="https://sbr-1314368469.cos.ap-guangzhou.myqcloud.com/Images/202301032143017.png" alt="code" style="zoom:50%;" />

#### 关于 *setState*

语法：

```js
setState(updater)
updater = callback(lastState => state | state )
```

如果新的 state 需要通过使用先前的 state 计算得出，那么可以将函数传递给 `setState`。该函数将接收先前的 state，并返回一个更新后的值。

> 🔴注意：
>
> 与类组件中的 `setState` 方法不同，`useState` *Hook* 的 `setState` 的行为将是直接替换原状态，且**在新旧状态引用地址不变的情况下**，将不会触发模板更新！！
>
> 你可以用函数式的 `setState` 结合展开运算符来达到合并更新对象的效果。
>
> ```js
> const [state, setState] = useState({});
> setState(prevState => {
>     // 也可以使用 Object.assign
> 	// 必须更新原状态的引用地址，不然将不会触发模板更新！！！
>     return {...prevState, ...updatedValues};
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



## Props

（“*properties*” 的缩写）在 React 思想中，数据是通过 Props 向下流动的，也叫单向数据流。

我们在组件调用时所写的任何赋值操作都会以对象的形式赋值给组件的 Props 供内部调用：

<img src="https://sbr-1314368469.cos.ap-guangzhou.myqcloud.com/Images/202301032150894.png" alt="code" style="zoom:67%;" />

#### 请确保 Props 的只读性

React 非常灵活，但它也有一个严格的规则，即：

**所有 React 组件都必须像纯函数一样保护它们的 props 不被更改。**





## 插槽

在 React 中，并没有 **插槽** 这种概念，但是却有相同的思路，即 `props.children` 这个特殊的 Prop。

来看下面这个例子：

```jsx
function Children(props){
    return (
    	<div>
        	{props.children}
        <div/>
    )
}

function App(props){
    return (
    	<Children>
            <p>Hello World!</p>
            <i>This is Slot~</i>
        </Children>
    )
}
```

`<Children>` JSX 标签体中的所有内容都会作为一个 `children` prop 传递给 `Children` 组件。

因为 `Children` 将 `{props.children}` 渲染在一个 `<div>` 中，被传递的这些子组件最终都会出现在输出结果中。

那么如何实现具名插槽呢？只要将需要传递的组件直接写到 Props 中就行了 😀

<img src="https://sbr-1314368469.cos.ap-guangzhou.myqcloud.com/Images/202301032151998.png" alt="code" style="zoom:67%;" />

## 受控组件

在 HTML 中，表单元素（如`<input>`、 `<textarea>` 和 `<select>`）通常自己维护 state，并根据用户输入进行更新。

但在 React 中，可变状态通常保存在组件的 `state` 属性中，并且只能通过使用 `setState()` 来更新。

我们可以把两者结合起来，使 React 的 state 成为“唯一数据源”。渲染表单的 React 组件还控制着用户输入过程中表单发生的操作。被 React 以这种方式控制取值的表单输入元素就叫做“受控组件”。

> V-Model 的原理

例如，如果我们想让前一个示例在提交时打印出名称，我们可以将表单写为受控组件：

<img src="https://sbr-1314368469.cos.ap-guangzhou.myqcloud.com/Images/202301032152888.png" alt="code" style="zoom:67%;" />

举一反三，`<textarea>` 标签的套路与 `<input>` 一致，甚至 `<select>` 也是一样的：

<img src="https://sbr-1314368469.cos.ap-guangzhou.myqcloud.com/Images/202301032153767.png" alt="code" style="zoom:67%;" />

总的来说，这使得 `<input type="text">`, `<textarea>` 和 `<select>` 之类的标签都非常相似。

-   它们都接受一个 `value` 属性，你可以使用它来实现受控组件。







​	
