---
title: React - 进阶
author: BigRice
date: 2023-01-09
location: 云梦泽
summary: Refs、Reder Props、Portals 等进阶总结
tags:
  - React
---



## Refs

 （“Reference” 的缩写）Refs 提供了一种方式，允许我们访问 DOM 节点或在 render 方法中创建的 React 元素。

### 类组件 createRef

类组件的 Refs 是使用 `React.createRef()` 创建的，并通过 `ref` 属性附加到 React 元素。在构造组件时，通常将 Refs 分配给实例属性，以便可以在整个组件中引用它们。

> `createRef` 的 `current` 理论上可以存放任意值，存放 DOM 元素一个方便的语法糖

```js
class MyComponent extends React.Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
  }
  render() {
    return <div ref={this.myRef} />;
  }
}
```

React 会在组件挂载时给 `current` 属性传入 DOM 元素，并在组件卸载时传入 `null` 值。

`ref` 会在 `componentDidMount` 或 `componentDidUpdate` 生命周期钩子触发前就更新。

#### 访问 Refs

当 ref 被传递给 `render` 中的元素时，对该节点的引用可以在 ref 的 `current` 属性中被访问。

```js
const node = this.myRef.current;
```

ref 的值根据节点的类型而有所不同：

- 当 `ref` 属性用于 HTML 元素时，构造函数中使用 `React.createRef()` 创建的 `ref` 接收底层 DOM 元素作为其 `current` 属性。
- 当 `ref` 属性用于自定义 class 组件时，`ref` 对象接收组件的挂载实例作为其 `current` 属性。
- **你不能在函数组件上使用 `ref` 属性**，因为他们没有实例。

以下例子说明了这些差异。



#### 为 DOM 元素添加 Ref

以下代码使用 `ref` 去存储 DOM 节点的引用：

```jsx
class CustomTextInput extends React.Component {
    // 创建一个 ref 来存储 textInput 的 DOM 元素
    textInput = React.createRef();

    focusTextInput = () => {
        // 直接使用原生 API 使 text 输入框获得焦点
        // 注意：我们通过 "current" 来访问 DOM 节点
        this.textInput.current.focus();
    }

    render() {
        // 构造器里创建的 `textInput` 上
        return (
            <div>
                <input
                    ref={this.textInput} // 告诉 React 我们想把 <input> ref 关联到 textInput
                    type="text" />
                <input
                    type="button"
                    value="Focus the text input"
                    onClick={this.focusTextInput}
                    />
            </div>
        );
    }
}
```

#### 为类组件添加 Ref

如果我们想包装上面的 `CustomTextInput`，来模拟它挂载之后立即被点击的操作，我们可以使用 ref 来获取这个自定义的 input 组件并手动调用它的 `focusTextInput` 方法：

```jsx
class AutoFocusTextInput extends React.Component {
    textInput = React.createRef();
    componentDidMount() {
        this.textInput.current.focusTextInput();
    }

    render() {
        return (
            <CustomTextInput ref={this.textInput} />
        );
    }
}
```

请注意，这仅在 `CustomTextInput` 声明为 class 时才有效：

```jsx
class CustomTextInput extends React.Component {
  // ...
}
```



#### Refs 与函数组件

默认情况下，**你不能在函数组件上使用 `ref` 属性**，因为它们没有实例：

```jsx
function MyFunctionComponent() {
    return <input />;
}

class Parent extends React.Component {
    constructor(props) {
        super(props);
        this.textInput = React.createRef();
    }
    render() {
        // 这将不会工作
        return (
            <MyFunctionComponent ref={this.textInput} />
        );
    }
}
```

如果要在函数组件中使用 `ref`，你可以使用 [forwardRef](https://zh-hans.reactjs.org/docs/forwarding-refs.html)（可与 [`useImperativeHandle`](https://zh-hans.reactjs.org/docs/hooks-reference.html#useimperativehandle) 结合使用），或者可以将该组件转化为 class 组件。



### 函数组件 useRef

函数组件使用 `useRef` 创建引用，它的用法与 `createRef` 一致：

```jsx
// 用法与 `createRef` 一致
const FunctionComponent = props => {
    const textInput = useRef();
    function focusTextInput() {
        textInput.current.focus();
    }
    return (
        <div>
            <input
                ref={textInput} // 告诉 React 我们想把 <input> ref 关联到 textInput
                type="text"
            />
            <input type="button" value="Focus the text input" onClick={focusTextInput} />
        </div>
    );
};
```



#### 为什么是 useRef ？

我们可能会纳闷，`createRef` 与 `useRef` 用法都一样，那 `useRef` 这个后生的意义何在？其实这个问题的答案在官网上就能找到。

<img src="https://sbr-1314368469.cos.ap-guangzhou.myqcloud.com/Images/202301132318159.png" alt="image-20230113231844076" style="zoom: 67%;" />

> *然而，`useRef()` 比 `ref` 属性更有用。它可以[很方便地保存任何可变值](https://zh-hans.reactjs.org/docs/hooks-faq.html#is-there-something-like-instance-variables)，其类似于在 class 中使用实例字段的方式。*

> *而 `useRef()` 和自建一个 `{current: ...}` 对象的唯一区别是，`useRef` 会在每次渲染时返回同一个 ref 对象。*

敲重点，`useRef `  并不局限在引用 DOM 节点上，它可以很方便存放任意值的引用，且**在组件渲染时保持不变**。

所以它与 `createRef` 的本质区别在于：

- `useRef` 创建的引用**不会随着组件的更新而更新**，除非显示的修改它的 `current`。
- `createRef` 创建的引用会随着组件的更新而重新获取

#### **总结**

- useRef 不仅仅是用来管理 DOM ref 的，它还相当于 this , 可以存放任何变量.  
- useRef 可以很好的解决闭包带来的不方便性. 你可以在各种库中看到它的身影,   比如 react-use 中的 useInterval , usePrevious …… 
- 值得注意的是，当 useRef 的内容发生变化时,它不会通知您。更改 .current 属性不会导致重新渲染



### 通用的 Ref Callback

> Ref Callback 是一种通用的创建引用方式，类组件与函数式组件都可使用

React 支持另一种设置 refs 的方式，称为“回调 refs”。它能助你更精细地控制何时 refs 被设置和解除。

不同于传递 `createRef()` 创建的 `ref` 属性，你会传递一个函数。这个函数中接受 React 组件实例或 HTML DOM 元素作为参数，以使它们能在其他地方被存储和访问。

下面的例子描述了一个通用的范例：使用 `ref` 回调函数，在实例的属性中存储对 DOM 节点的引用。

```jsx
class CustomTextInput extends React.Component {
    textInput = null
    
    setTextInputRef = element => {
        this.textInput = element;
    };
    
    focusTextInput = () => {
        // 使用原生 DOM API 使 text 输入框获得焦点
        if (this.textInput) this.textInput.focus();
    };
    
    componentDidMount() {
        // 组件挂载后，让文本框自动获得焦点
        this.focusTextInput();
    }

    render() {
        // 使用 `ref` 的回调函数将 text 输入框 DOM 节点的引用存储到 React
        return (
            <div>
                <input
                    type="text"
                    ref={this.setTextInputRef}
                    />
                <input
                    type="button"
                    value="Focus the text input"
                    onClick={this.focusTextInput}
                    />
            </div>
        );
    }
}
```

这在组件上也同样适用：

```jsx
function CustomTextInput(props) {
    return (
        <div>
            <input ref={props.inputRef} />
        </div>
    );
}

class Parent extends React.Component {
    render() {
        return (
            <CustomTextInput
                inputRef={el => this.inputElement = el}
            />
        );
    }
}
```



## Reder Props

术语 [“render prop”](https://cdb.reacttraining.com/use-a-render-prop-50de598f11ce) 是指一种在 React 组件之间使用一个值为函数的 prop 共享代码的简单技术，是一种组件渲染技巧。

具有 render prop 的组件接受一个返回 React 元素的函数，并在组件内部通过调用此函数就可以实现自己的渲染逻辑。

具体的使用方法就像下段伪代码这样，定义了一个 `DataProvider` 组件，但内部的渲染由 `render` 这个 `prop` 来决定：

> 可以将他理解为在 props 中的插槽
>
> 它是一个用于告知组件需要渲染什么内容的函数 prop。

```jsx
function DataProvider({render}){
    return {render('World')}
}
<DataProvider 
    render={data => (<h1>Hello {data.target}</h1>)}
/>
```



### 使用 Render Props 解决“横切关注点”问题

> 横切关注点（Cross-Cutting Concerns ）指的是一类具有横越多个模块的行为，即使用传统的软件开发方法不能够达到有效模块化的一类特殊的关注点。
>
> 日志功能就是**横切关注点**的一个典型案例。日志功能往往横跨系统中的每个业务模块，即“**横切**”所有需要日志功能的类和方法体。所以我们说日志成为了**横切**整个系统对象结构的**关注点**

组件是 React 代码复用的主要单元，但如何将一个组件封装的状态或行为共享给其他需要相同状态的组件并不总是显而易见。

例如，以下组件跟踪 Web 应用程序中的鼠标位置：

```jsx
function Mouse(props) {
    const [state, setState] = useState({ x: 0, y: 0 });
    function handleMouse(event) {
        setState(
            new Object({
                x: event.clientX,
                y: event.clientY,
            })
        );
    }
    return (
        <div style={{ height: "100vh" }} onMouseMove={handleMouse}>
            <h1>移动鼠标!</h1>
            <p>当前的鼠标位置是 ({state.x}, {state.y})</p>
        </div>
    );
}
```

当光标在屏幕上移动时，组件在 `<p>` 中显示其（x，y）坐标。

现在的问题是：我们如何在另一个组件中复用这个行为？换个说法，若另一个组件需要知道鼠标位置，我们能否封装这一行为，以便轻松地与其他组件共享它？

由于组件是 React 中最基础的代码复用单元，现在尝试重构一部分代码使其能够在 `<Mouse>` 组件中封装我们需要共享的行为。

```jsx
function Mouse(props) {
    const [state, setState] = useState({ x: 0, y: 0 });
    function handleMouse(event) {
        setState(
            new Object({
                x: event.clientX,
                y: event.clientY,
            })
        );
    }
    return (
        <div style={{ height: "100vh" }} onMouseMove={handleMouse}>

            {/* ...但我们如何渲染 <p> 以外的东西? */}
            <p>当前的鼠标位置是 ({state.x}, {state.y})</p>
        </div>
    );
}

function App() {
    return (
        <div>
            <h1>移动鼠标!</h1>
            <Mouse />
        </div>
    );
}
```

现在 `<Mouse>` 组件封装了所有关于监听 `mousemove` 事件和存储鼠标 (x, y) 位置的行为，但其**仍不是真正的可复用**。

举个例子，假设我们有一个 `<Cat>` 组件，它可以呈现一张在屏幕上追逐鼠标的猫的图片。我们或许会使用 `<Cat mouse={{ x, y }}` prop 来告诉组件鼠标的坐标以让它知道图片应该在屏幕哪个位置。

首先, 你或许会像这样，尝试在 `<Mouse>` 内部的渲染方法渲染 `<Cat>` 组件：首先, 你或许会像这样，尝试在 `<Mouse>` 内部的渲染方法渲染 `<Cat>` 组件：

```jsx
function Cat({ mouse }) {
    return (
        <img
            src="https://w7.pngwing.com/pngs/563/269/png-transparent-tom-cat-tom-and-jerry-cat-mammal-animals-cat-like-mammal.png"
            style={{
                position: "absolute",
                left: mouse.x - 75,
                top: mouse.y - 75,
                width: "150px",
            }}
        />
    );
}

function MouseWithCat (props) {
    const [state, setState] = useState({ x: 0, y: 0 });
    function handleMouse(event) {
        setState(
            new Object({
                x: event.clientX,
                y: event.clientY,
            })
        );
    }
    return (
        <div style={{ height: "100vh" }} onMouseMove={handleMouse}>
            <Cat mouse={state} />
        </div>
    );
}

function App() {
    return (
        <div>
            <h1>移动鼠标!</h1>
            <Mouse />
        </div>
    );
}
```

这种方法适用于我们的特定用例，但我们还没有达到以可复用的方式真正封装行为的目标。

现在，每当我们想要鼠标位置用于不同的用例时，我们必须创建一个新的组件（本质上是另一个 `<MouseWithCat>` ），它专门为该用例呈现一些东西。

这也是 render prop 的来历：

- 相比于直接将 `<Cat>` 写死在 `<Mouse>` 组件中，并且有效地更改渲染的结果，我们可以为 `<Mouse>` 提供一个函数 prop 来动态的确定要渲染什么 —— 一个 **render prop**。

```jsx
function Mouse(props) {
    const [state, setState] = useState({ x: 0, y: 0 });
    function handleMouse(event) {
        setState(
            new Object({
                x: event.clientX,
                y: event.clientY,
            })
        );
    }
    return (
        <div style={{ height: "100vh" }} onMouseMove={handleMouse}>
            {props.render(state)}
        </div>
    );
}

function App() {
    return (
        <div>
            <h1>移动鼠标!</h1>
            <Mouse render={mouse => <Cat mouse={mouse} />} />
        </div>
    );
}
```

现在，我们提供了一个 `render prop ` （是一个函数）让 `<Mouse>` 能够动态决定什么需要渲染，而不是克隆 `<Mouse>` 组件然后硬编码来解决特定的用例。

> 可以这样理解，render prop 在组件渲染前就帮我们“预定”了一个渲染结果，而在组件内我们需要做的仅仅是将他**调用和传参**（因为 render prop 是一个函数）

更具体地说，**render prop 是一个用于告知组件需要渲染什么内容的函数 prop。**

这项技术使我们共享行为非常容易。要获得这个行为，只要渲染一个带有 `render prop ` 的 `<Mouse>` 组件就能够告诉它当前鼠标坐标 (x, y) 要渲染什么。

> 关于 render prop 一个有趣的事情是你可以使用带有 render prop 的常规组件来实现大多数[高阶组件](https://zh-hans.reactjs.org/docs/higher-order-components.html) (HOC)。 例如，如果你更喜欢使用 `withMouse` HOC而不是 `<Mouse>` 组件，你可以使用带有 render prop 的常规 `<Mouse>` 轻松创建一个：
>
> ```jsx
> // 如果你出于某种原因真的想要 HOC，那么你可以轻松实现
> // 使用具有 render prop 的普通组件创建一个！
> function withMouse(Component) {
>   return class extends React.Component {
>     render() {
>       return (
>         <Mouse render={mouse => (
>           <Component {...this.props} mouse={mouse} />
>         )}/>
>       );
>     }
>   }
> }
> ```

因此，你可以将任一模式与 render prop 一起使用。



### 更多

记住，render prop 只是**因为模式**才被称为 *render* prop ，**不代表一定要**用名为 `render` 的 prop 才能被称之为 `render prop`。

事实上，**任何**被用于告知组件需要渲染什么内容的函数 prop 在技术上都可以被称为 “render prop”

尽管之前的例子使用了 `render`，我们也可以随便起名，像 A，B，C 都可以

```jsx
function Mouse({A}){
    return {A(x,y)}
}

<Mouse A={mouse => (
  <p>鼠标的位置是 {mouse.x}，{mouse.y}</p>
)}/>

```

我们也可以简单地使用 `children` 插槽来实现，在根本上他们起到的作用是一致的！

```jsx
function Mouse({children}){
    return {children}
}

<Mouse>
  {mouse => (
    <p>鼠标的位置是 {mouse.x}，{mouse.y}</p>
  )}
</Mouse>
```





## Portals

Portal 提供了一种将子节点渲染到存在于父组件以外的 DOM 节点的优秀的方案。

```js
import { createPortal } from "react-dom";
createPortal(child, container)
```

- `child`：是任何[可渲染的 React 子元素](https://zh-hans.reactjs.org/docs/react-component.html#render)，例如一个元素，字符串或 fragment。

- `container`：是一个 DOM 元素。

一个 Portal 的典型用例是当父组件有 `overflow: hidden` 或 `z-index` 样式时，但你需要子组件能够在视觉上“跳出”其容器。例如，对话框、悬浮卡以及提示框。



### 注意

虽然 `createPortal` 可以将组件放置到任意 DOM 节点下，但是它 React 树中仍是一个子节点。

由于 portal 仍存在于 *React 树*， 且与 *DOM 树* 中的位置无关，那么无论其子节点是否是 portal，像 context 这样的功能特性都是不变的。

> 总而言之，虽然在 DOM 树上看 portal 定义的组件与父节点不在同一个位置，但在行为上它仍会跟子节点的行为一致，比如 context、事件冒泡等

下面有一个事件冒泡例子：

HTML 结构如下

```html
<div id="root"></div>
<div id="modal-root"></div>
```

main.js ：

```jsx
const root = document.getElementById("root");
const modalRoot = document.getElementById("modal-root");

function Modal({ children }) {
    // 以下代码创建了一个新的 div 并将他放置到 modalRoot 中
    // 并在此 div 中塞入插槽内容
    let el = document.createElement("div");
    useEffect(() => {
        modalRoot.appendChild(el);
        return () => {
            modalRoot.removeChild(el);
        };
    });

    return createPortal(children, el);
}

function Parent() {
    const [state, setState] = useState({ clicks: 0 });

    function handleClick() {
        // 当子元素里的按钮被点击时，
        // 这个将会被触发更新父元素的 state，
        // 即使这个按钮在 DOM 中不是直接关联的后代
        setState(state => ({
            clicks: state.clicks + 1,
        }));
    }

    return (
        <div onClick={handleClick}>
            <p>事件触发了{state.clicks}次</p>
            <p>
                打开浏览器的开发者工具，你会发现按钮不是元素的子元素
                但点击仍会触发父组件的事件。
            </p>
            <Modal>
                <div className="modal">
                    {/* 这个按钮的点击事件会冒泡到父元素 */}
                    <button>Click</button>
                </div>
            </Modal>
        </div>
    );
}

ReactDOM.createRoot(root).render(<Parent />);
```

当运行起来后，DOM 树结构将是这样的：

<img src="https://sbr-1314368469.cos.ap-guangzhou.myqcloud.com/Images/202301142020310.png" alt="image-20230114202038255" style="zoom:67%;" />

但如果点击 `modal-root` 中的按钮，会将事件冒泡至 React 树中的父节点事件中：

<img src="https://sbr-1314368469.cos.ap-guangzhou.myqcloud.com/Images/202301142013352.gif" alt="demo" style="zoom:67%;" />
