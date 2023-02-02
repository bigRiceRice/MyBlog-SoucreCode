---
title: 一文吃透React高阶组件 - HOC
author: 我不是外星人 - 稀土掘金
date: 2023-01-09
location: 云梦泽
summary: Higher-Order Components）高阶组件是 React 中用于复用组件逻辑的一种高级技巧。
tags:
    - React
---

## 关于高阶组件

> （Higher-Order Components）高阶组件是 React 中用于复用组件逻辑的一种高级技巧。HOC 自身不是 React API 的一部分，它是一种基于 React 的组合特性而形成的设计模式。

`React` 中的高阶组件，对于很多 `react` 开发者来说并不陌生，它是灵活使用 `react` 组件的一种技巧，高阶组件本身不是组件，它是一个参数为组件，返回值**也是一个组件**的函数。

高阶作用用于**强化组件，复用逻辑，提升渲染性能等**作用。高阶组件也并不是很难理解，其实接触过后还是蛮简单的，接下来我将按照，高阶组件理解高、阶组件具体怎么使用？应用场景、 高阶组件实践(源码级别) 为突破口，带大家详细了解一下高阶组件。

我们带着问题去开始今天的讨论：

-   1 什么是高阶组件，它解决了什么问题？
-   2 有几种高阶组件，它们优缺点是什么？
-   3 如何写一个优秀高阶组件？
-   4 `HOC` 怎么处理静态属性，跨层级 `ref` 等问题？
-   5 高阶组件怎么控制渲染，隔离渲染？
-   6 高阶组件怎么监控原始组件的状态？
-   ...

<img src="https://sbr-1314368469.cos.ap-guangzhou.myqcloud.com/Images/202301142212476.jpg" alt="7b05e1efc4e84808a0bb84c9cac4ab4b_tplv-k3u1fbpfcp-zoom-in-crop-mark_4536_0_0_0" style="zoom: 50%;" />

### 高阶组件产生初衷

组件是把 `prop` 渲染成 `UI` ，而高阶组件是将组件转换成另外一个组件，我们更应该注意的是，经过包装后的组件，获得了那些强化，节省多少逻辑，或是解决了原有组件的那些缺陷，这就是高阶组件的意义。我们先来思考一下高阶组件究竟解决了什么问题 🤔🤔🤔？

1. **复用逻辑**：高阶组件更像是一个加工 `react` 组件的工厂，批量对原有组件进行**加工**，**包装**处理。我们可以根据业务需求定制化专属的 `HOC` ，这样可以解决逻辑复用。
2. **强化 props**：这个是 `HOC` 最常用的用法之一，高阶组件返回的组件，可以劫持上一层传过来的 `props` ，然后混入新的 `props` ，来增强组件的功能。代表作 `react-router` 中的 `withRouter` 。
3. **赋能组件**： `HOC` 有一项独特的特性，就是可以给被 `HOC` 包裹的业务组件，提供一些拓展功能，比如说**额外的生命周期，额外的事件**，但是这种 `HOC` ，可能需要和业务组件紧密结合。典型案例 `react-keepalive-router` 中的 `keepaliveLifeCycle` 就是通过 `HOC` 方式，给业务组件增加了额外的生命周期。
4. **控制渲染**：劫持渲染是 `HOC` 一个特性，在 `wrapComponent` 包装组件中，可以对原来的组件，进行**条件渲染**，**节流渲染**，**懒加载**等功能，后面会详细讲解，典型代表做 `react-redux` 中 `connect` 和 `dva` 中 `dynamic` 组件懒加载。

我会针对高阶组件的初衷展开，详细介绍其原理已经用法。跟上我的思路，我们先来看一下，高阶组件**如何在我们的业务组件中使用的**。

### 高阶组件使用和编写结构

`HOC` 使用指南是非常简单的，只需要将我们的组件进行包裹就可以了。

#### 装饰器模式和函数包裹模式

对于 `class` 声明的有状态组件，我们可以用装饰器模式，对类组件进行包装：

> 关于 ES6 装饰器：
>
> -   [深入理解 es6 class 和装饰器](https://juejin.cn/post/6844904165647319048#heading-12)
> -   [如何在 React 中使用装饰器-即@修饰符](https://zhuanlan.zhihu.com/p/335290638)
> -   如果是使用 vite 创建的 react 项目，那么需要在 `vite.config.js` 中配置如下选项
>
>     ```bash
>     yarn add @babel/plugin-proposal-decorators @babel/plugin-proposal-class-properties
>     ```
>
>     ```js
>     import { defineConfig } from "vite";
>     import react from "@vitejs/plugin-react";
>
>     // https://vitejs.dev/config/
>     export default defineConfig({
>         plugins: [
>             react({
>                 babel: {
>                     plugins: [
>                         ["@babel/plugin-proposal-decorators", { legacy: true }],
>                         ["@babel/plugin-proposal-class-properties", { loose: true }],
>                     ],
>                 },
>             }),
>         ],
>     });
>     ```

```js
@withStyles(styles)
@withRouter
@keepaliveLifeCycle
class Index extends React.Componen {
    /* ... */
}
```

我们要注意一下包装顺序，越靠近 `Index` 组件的，就是越内层的 `HOC` ，离组件 `Index` 也就越近。

对于无状态组件(函数声明）我们可以这么写：

```js
function Index() {
    /* .... */
}
export default withStyles(styles)(withRouter(keepaliveLifeCycle(Index)));
```

> 注意，上面这种嵌套的写法是不被推荐的，因为可读性太差了。更好的写法是将不同用途的 HOC 拆开，编写成组合工具函数，就像这样：
>
> ```jsx
> // withStyles(styles)(withRouter(keepaliveLifeCycle(Index))); 可读性太差
>
> // 以下的 compose 是一段伪代码，它在实际的工具库中可能不是这样的实现
> function compose(a, b, c) {
>     return component => a(styles)(b(c(component)));
> }
> const enhance = compose(withStyles, withRouter, keepaliveLifeCycle);
> const EnhancedComponent = enhance(Index);
> ```
>
> 许多第三方库都提供了 `compose` 工具函数，包括 lodash （比如 [`lodash.flowRight`](https://lodash.com/docs/#flowRight)）， [Redux](https://redux.js.org/api/compose) 和 [Ramda](https://ramdajs.com/docs/#compose)。

#### 嵌套 HOC

对于不需要传递参数的 `HOC` ，编写模型我们只需要嵌套一层就可以，比如 `withRouter`

```js
function withRouter() {
    return class wrapComponent extends React.Component {
        /* 编写逻辑 */
    };
}
```

对于需要参数的 `HOC` ，我们需要一层代理，如下：

```js
function connect(mapStateToProps) {
    /* 接受第一个参数 */
    return function connectAdvance(wrapCompoent) {
        /* 接受组件 */
        return class WrapComponent extends React.Component {};
    };
}
```

我们看出两种 `HOC` 模型很简单，对于代理函数，可能有一层，可能有很多层，不过不要怕，无论多少层本质上都是一样的，我们只需要一层一层剥离开，分析结构，整个 `HOC` 结构和脉络就会清晰可见。吃透 `HOC` 也就易如反掌。

### 两种不同的高阶组件

常用的高阶组件有两种方式**正向的属性代理**和**反向的组件继承**，两者之前有一些共性和区别。接下具体介绍两者区别，在第三部分会详细介绍具体实现。

#### 正向属性代理

所谓正向属性代理，就是用组件包裹一层代理组件，在代理组件上，我们可以做一些对源组件的代理操作。在 `fiber tree` 上，先 `mounted` 代理组件，然后才是我们的业务组件。我们可以理解为父子组件关系，父组件对子组件进行一系列强化操作。

```js
function HOC(WrapComponent) {
    return class Advance extends React.Component {
        state = {
            name: "alien",
        };
        render() {
            return <WrapComponent {...this.props} {...this.state} />;
        }
    };
}
```

##### 例子

```jsx
class Index extends React.Component {
    render() {
        return <div> hello,world </div>;
    }
}
Index.say = function () {
    console.log("my name is alien");
};
function HOC(Component) {
    return class wrapComponent extends React.Component {
        render() {
            return <Component {...this.props} {...this.state} />;
        }
    };
}
const newIndex = HOC(Index);
console.log(newIndex.say);
```

![](https://sbr-1314368469.cos.ap-guangzhou.myqcloud.com/Images/202301142240248.jpeg)

##### 优点

-   正常属性代理可以和业务组件低耦合，甚至零耦合，对于**条件渲染**和**props 属性增强**，只负责控制子组件渲染和传递额外的 `props` 就可以，所以无须知道的具体逻辑。所以正向属性代理，更适合做一些开源项目的 `HOC` ，目前开源的 `HOC` 基本都是通过这个模式实现的。
-   同样适用于 `class` 声明组件，和 `function` 声明的组件。
-   可以完全隔离业务组件的渲染，相比反向继承，属性代理这种模式。可以完全控制业务组件渲染与否，可以避免 `反向继承` 带来一些副作用，比如生命周期的执行。
-   可以嵌套使用，多个 `HOC` 是可以嵌套使用的，而且一般不会限制包装 `HOC` 的先后顺序。

##### 缺点

-   一般无法**直接获取业务组件的状态**，如果想要获取，需要 `ref` 获取组件实例。
-   无法直接继承静态属性。如果需要继承需要手动处理，或者引入第三方库。

#### 反向继承

反向继承和属性代理有一定的区别，在于包装后的组件继承了业务组件本身，所以我们我无须在去实例化我们的业务组件。当前高阶组件就是继承后，加强型的业务组件。这种方式类似于组件的强化，所以你必须知道当前业务组件的情况并看清编写 `HOC` 。

```jsx
class Index extends React.Component {
    render() {
        return <div> hello,world </div>;
    }
}
function HOC(Component) {
    return class wrapComponent extends Component {
        /* 直接继承需要包装的组件 */
    };
}
export default HOC(Index);
```

##### 例子

```jsx
class Index extends React.Component {
    render() {
        return <div> hello,world </div>;
    }
}
Index.say = function () {
    console.log("my name is alien");
};
function HOC(Component) {
    return class wrapComponent extends Component {};
}
const newIndex = HOC(Index);
console.log(newIndex.say);
```

![](https://sbr-1314368469.cos.ap-guangzhou.myqcloud.com/Images/202301142244595.jpeg)

##### 优点

-   方便获取组件内部状态，比如 `state` ， `props` ，生命周期，绑定的事件函数等
-   `es6` 继承可以良好继承静态属性。我们无须对静态属性和方法进行额外的处理。

##### 缺点

-   无状态（函数）组件无法使用。
-   和被包装的组件强耦合，需要知道被包装的组件的内部状态，具体是做什么？
-   如果多个反向继承 `HOC` 嵌套在一起，当前状态会覆盖上一个状态。这样带来的隐患是非常大的，比如说有多个 `componentDidMount` ，当前 `componentDidMount` 会覆盖上一个 `componentDidMount` 。这样副作用串联起来，影响很大。

## 如何编写高阶组件

接下来我们来看看，如何编写一个高阶组件，你可以参考如下的情景，去编写属于自己的 `HOC` 。

### 强化 props

#### 一、混入 props

这个是高阶组件最常用的功能，承接上层的 `props` ，在混入自己的 `props` ，来强化组件。

##### 有状态组件(属性代理)

```jsx
function classHOC(WrapComponent) {
    return class Idex extends React.Component {
        state = {
            name: "alien",
        };
        componentDidMount() {
            console.log("HOC");
        }
        render() {
            return <WrapComponent {...this.props} {...this.state} />;
        }
    };
}
function Index(props) {
    const { name } = props;
    useEffect(() => {
        console.log("index");
    }, []);
    return <div>hello,world , my name is {name}</div>;
}

export default classHOC(Index);
```

##### 有状态组件(属性代理)

同样也适用与无状态（函数）组件。

```jsx
function functionHoc(WrapComponent) {
    return function Index(props) {
        const [state, setState] = useState({ name: "alien" });
        return <WrapComponent {...props} {...state} />;
    };
}
```

##### 效果

![](https://sbr-1314368469.cos.ap-guangzhou.myqcloud.com/Images/202301150908996.jpeg)

#### 二、抽离 state 控制更新

高阶组件可以将 `HOC` 的 `state` 的配合起来，控制业务组件的更新。这种用法在 `react-redux` 中 `connect` 高阶组件中用到过，用于处理来自 `redux` 中 `state` 更改，带来的订阅更新作用。

我们将上述代码进行改造。

```jsx
function classHOC(WrapComponent) {
    return class Idex extends React.Component {
        constructor() {
            super();
            this.state = {
                name: "alien",
            };
        }
        changeName = name => {
            this.setState({ name });
        };
        render() {
            return (
                <WrapComponent {...this.props} {...this.state} changeName={this.changeName} />
            );
        }
    };
}
function Index(props) {
    const [value, setValue] = useState(null);
    const { name, changeName } = props;
    return (
        <div>
            <div> hello,world , my name is {name}</div>
            改变name <input onChange={e => setValue(e.target.value)} />
            <button onClick={() => changeName(value)}>确定</button>
        </div>
    );
}

export default classHOC(Index);
```

##### 效果

![](https://sbr-1314368469.cos.ap-guangzhou.myqcloud.com/Images/202301150913057.jpeg)

### 控制渲染

控制渲染是高阶组件的一个很重要的特性，上边说到的两种高阶组件，都能完成对组件渲染的控制。具体实现还是有区别的，我们一起来探索一下。

#### 一、条件渲染

##### 1️⃣ 基础：动态渲染

对于属性代理的高阶组件，虽然不能在内部操控渲染状态，但是可以在外层控制当前组件是否渲染，这种情况应用于，**权限隔离**，**懒加载** ，**延时加载**等场景。

下面实现一个动态挂载组件的 HOC：

```jsx
import { Component } from "react";

function RenderHOC(WrapComponent) {
    function Foo() {
        return <h2>我是最二的组件😎</h2>;
    }
    return class Index extends Component {
        state = { visible: true };
        toggleVisible = () => {
            this.setState(({ visible }) => ({
                visible: !visible,
            }));
        };
        render() {
            const { visible } = this.state;
            return (
                <fieldset className="box">
                    <legend>
                        <button onClick={this.toggleVisible}>切换组件</button>
                    </legend>
                    <main>
                        {visible ? (
                            <WrapComponent
                                {...this.props}
                                toggleVisible={this.toggleVisible}
                            />
                        ) : (
                            <Foo />
                        )}
                    </main>
                </fieldset>
            );
        }
    };
}

function Index(props) {
    return (
        <img
            style={{ width: `150px` }}
            src="https://w7.pngwing.com/pngs/563/269/
                 png-transparent-tom-cat-tom-and-jerry-cat-mammal-animals-cat-like-mammal.png"
        />
    );
}

export default RenderHOC(Index);
```

效果：

![demo](https://sbr-1314368469.cos.ap-guangzhou.myqcloud.com/Images/202301150945633.gif)

##### 2️⃣ 进阶：分片渲染

是不是感觉不是很过瘾，为了让大家加强对 `HOC` 条件渲染的理解，我再做一个**分片渲染+懒加载**功能。为了让大家明白，我也是绞尽脑汁啊 😂😂😂。

进阶：实现一个懒加载功能的 HOC，可以实现组件的分片渲染，用于分片渲染页面，不至于一次渲染大量组件造成白屏效果

```jsx
import { useEffect, useState, Component } from "react";

// 加载队列
const renderQueue = [];
// 第一次渲染是否完成
let isFirstrender = false;

// 队列中的加载函数，调用此函数即代表 500 毫秒后加载渲染
function tryRender() {
    const render = renderQueue.shift();
    if (!render) return;
    setTimeout(() => {
        render();
    }, 500);
}

function renderHOC(WrapComponent) {
    return function Index(props) {
        // 每个 isRender 状态都控制着 WrapComponent 是否渲染
        const [isRender, setRender] = useState(false);
        useEffect(() => {
            // 每次高阶组件挂载完成后，都将开启渲染的函数（修改 isRender）传入队列
            renderQueue.push(() => {
                setRender(true);
            });
            // 如果是第一个，直接渲染
            if (!isFirstrender) {
                tryRender();
                isFirstrender = true;
            }
        }, []);

        return isRender ? (
            <WrapComponent tryRender={tryRender} {...props} />
        ) : (
            <div className="loading">加载中......</div>
        );
    };
}

class Index extends Component {
    // 在每个组件挂载后开启渲染
    componentDidMount() {
        const { tryRender } = this.props;
        tryRender();
    }
    render() {
        let defaultImg = `https://w7.pngwing.com/pngs/563/269/png-transparent-tom-cat-tom-and-jerry-cat-mammal-animals-cat-like-mammal.png`;
        return <img style={{ width: `150px` }} src={defaultImg} />;
    }
}
const Item = renderHOC(Index);

export default () => {
    return (
        <>
            <Item />
            <Item />
            <Item />
            <Item />
            <Item />
            <Item />
        </>
    );
};
```

效果如下：

<img src="https://sbr-1314368469.cos.ap-guangzhou.myqcloud.com/Images/202301151012774.gif" alt="demo" style="zoom:67%;" />

大致流程，初始化的时候， `HOC` 中将渲染真正组件的渲染函数，放入 `renderQueue` 队列中，然后初始化渲染一次，接下来，每一个项目组件，完成 `didMounted` 状态后，会从队列中取出下一个渲染函数，渲染下一个组件， 一直到所有的渲染任务全部执行完毕，渲染队列清空，有效的进行分片的渲染，这种方式对海量数据展示，很奏效。

用 `HOC` 实现了条件渲染-分片渲染的功能，实际条件渲染理解起来很容易，就是通过变量，控制是否挂载组件，从而满足项目本身需求，条件渲染可以演变成很多模式，我这里介绍了条件渲染的二种方式，希望大家能够理解精髓所在。

##### 3️⃣ 进阶：异步组件(懒加载)

不知道大家有没有用过 `dva` ，里面的 `dynamic` 就是应用 `HOC` 模式实现的组件异步加载，我这里简化了一下，提炼核心代码，如下：

```jsx
/* 路由懒加载HOC */
export default function AsyncRouter(loadRouter) {
    return class Content extends React.Component {
        state = { Component: null };
        componentDidMount() {
            if (this.state.Component) return;
            loadRouter()
                .then(module => module.default)
                .then(Component => this.setState({ Component }));
        }
        render() {
            const { Component } = this.state;
            return Component ? <Component {...this.props} /> : null;
        }
    };
}
```

使用：

```jsx
const Index = AsyncRouter(() => import("../pages/index"));
```

##### 4️⃣ 反向继承：渲染劫持

HOC 反向继承模式，可以实现颗粒化的渲染劫持，也就是可以控制基类组件的 `render` 函数，还可以篡改 props，或者是 `children` ，我们接下来看看，这种状态下，怎么使用高阶组件。

```jsx
const HOC = WrapComponent =>
    class Index extends WrapComponent {
        render() {
            if (this.props.visible) {
                return super.render();
            } else {
                return <div>暂无数据</div>;
            }
        }
    };
```

##### 5️⃣ 反向继承：修改渲染树

修改渲染状态，劫持 render 并用 `cloneElement` 替换子节点

```jsx
import React from "react";
function HOC(Component) {
    return class Advance extends Component {
        render() {
            // 获取到组件的渲染节点
            const element = super.render();
            const otherProps = {
                name: "alien",
            };
            const appendElement = React.createElement(
                "li",
                {},
                `hello ,world , my name  is ${otherProps.name}`
            );
            // Children.map 遍历 JSX 类型的子节点并返回新数组
            // 这里 element...children 访问到的将是三个 li

            const newchild = React.Children.map(
                element.props.children.props.children,

                // element.props.children.props.children
                //    ⬆:<div>       ⬆:<ul>         ⬆:<li>*3

                (child, index) => {
                    /* 替换 Angular 元素节点 */
                    if (index === 2) return appendElement;
                    return child;
                }
            );

            // cloneElement 用于以 element 元素为样板克隆并返回新的 React 元素，新的子元素将取代现有的子元素
            // 现在 newchild 的第三项 li 内容是  `hello ,world ...`  所以它会将  `Angular`  取代
            return React.cloneElement(element, element.props, newchild);
        }
    };
}
class Index extends React.Component {
    render() {
        return (
            <div>
                <ul>
                    <li>react</li>
                    <li>vue</li>
                    <li>Angular</li>
                </ul>
            </div>
        );
    }
}

export default HOC(Index);
```

结果

![](https://sbr-1314368469.cos.ap-guangzhou.myqcloud.com/Images/202301151119125.jpeg)

我们用劫持渲染的方式，来操纵 `super.render()` 后的 `React.element` 元素，然后配合 `createElement` ， `cloneElement` ， `React.Children` 等 `api` 灵活操纵，从而改变真正的渲染 `react.element` ，可以说是偷天换日，不亦乐乎。

#### 二、节流渲染

`HOC` 除了可以进行**条件渲染**，**渲染劫持**功能外，还可以进行**节流渲染**，也就是可以优化性能，具体怎么做，请跟上我的节奏往下看。

##### 1️⃣ 基础: 节流原理

`HOC` 配合 `useMemo` 等 `API` 配合使用，可以实现对业务组件的渲染控制，减少渲染次数，从而达到优化性能的效果。

如下案例，我们将组件的渲染依赖项设置为 `num` ，只有当 `num` 改变的时候，才会重新渲染组件，我们应该这样写我们的 `HOC` 。

```jsx
import React, { useState, useMemo } from "react";
function HOC(Component) {
    return function renderWrapComponent(props) {
        const { dependencies } = props;
        // 使用 useMemo 将 Component 缓存起来，并指定依赖，只有依赖项变更才会重新渲染
        const RenderElement = useMemo(() => <Component {...props} />, [dependencies]);
        return RenderElement;
    };
}
class Index extends React.Component {
    render() {
        console.log(`当前组件是否渲染`, this.props);
        return <div>hello,world, my name is alien </div>;
    }
}
const IndexHoc = HOC(Index);

export default () => {
    const [num, setNumber] = useState(0);
    const [num1, setNumber1] = useState(0);
    const [num2, setNumber2] = useState(0);
    return (
        <div>
            <IndexHoc dependencies={num} num1={num1} num2={num2} />
            <button onClick={() => setNumber(num + 1)}>num++</button>
            <button onClick={() => setNumber1(num1 + 1)}>num1++</button>
            <button onClick={() => setNumber2(num2 + 1)}>num2++</button>
        </div>
    );
};
```

效果：

![demo](https://sbr-1314368469.cos.ap-guangzhou.myqcloud.com/Images/202301151133592.gif)

如图所示，当我们只有点击 `num++` 时候，才重新渲染子组件，点击其他按钮，只是负责传递 `props` 达到了期望的效果。

##### 2️⃣ 进阶：定制化渲染流

思考：🤔 上一个案例只是介绍了原理，在实际项目中，是量化生产不了的，原因是，我们需要针对不同 `props` 变化，写不同的 `HOC` 组件，这样根本起不了 `Hoc` 真正的用途，也就是 `HOC` 产生的初衷。

所以我们需要对上述 `HOC` 进行改造升级，是组件可以根据定制化方向，去渲染组件。也就是 `Hoc` 生成的时候，已经按照某种契约去执行渲染。

一个很好的定制化就是使用 ES6 的装饰器：

```jsx
function HOC(rule) {
    return function (Component) {
        return function renderWrapComponent(props) {
            const dep = rule(props); // 根据传入的规则函数获取到依赖项
            const RenderElement = useMemo(() => <Component {...props} />, [dep]);
            return RenderElement;
        };
    };
}
// 只有 props 中 num 变化 ，渲染组件
@HOC(props => props["num"]) // 这行代码调用了 HOC 并传入一个函数，具体这个函数的利用请看第 4 行
class IndexHoc extends React.Component {
    render() {
        console.log(`组件一渲染`, this.props);
        return <div> 组件一 ： hello,world </div>;
    }
}

// 只有 props 中 num1 变化 ，渲染组件
@HOC(props => props["num1"])
class IndexHoc1 extends React.Component {
    render() {
        console.log(`组件二渲染`, this.props);
        return <div> 组件二 ： my name is alien </div>;
    }
}

export default () => {
    const [num, setNumber] = useState(0);
    const [num1, setNumber1] = useState(0);
    const [num2, setNumber2] = useState(0);
    return (
        <div>
            <IndexHoc num={num} num1={num1} num2={num2} />
            <IndexHoc1 num={num} num1={num1} num2={num2} />
            <button onClick={() => setNumber(num + 1)}>num++</button>
            <button onClick={() => setNumber1(num1 + 1)}>num1++</button>
            <button onClick={() => setNumber2(num2 + 1)}>num2++</button>
        </div>
    );
};
```

效果：

![demo](https://sbr-1314368469.cos.ap-guangzhou.myqcloud.com/Images/202301151212874.gif)

完美实现了效果。这用高阶组件模式，可以灵活控制 `React` 组件层面上的，** `props` 数据流**和**更新流**，优秀的高阶组件有 `mobx` 中 `observer` ， `inject` ， `react-redux` 中的 `connect` ，感兴趣的同学，可以抽时间研究一下。

### 赋能组件

高阶组件除了上述两种功能（强化 props ，控制渲染）之外，还可以赋能组件，比如加一些**额外生命周期**，**劫持事件**，**监控日志**等等

#### 一、劫持原型链-劫持生命周期，事件函数

##### 1️⃣ 属性代理实现

```jsx
function HOC(Component) {
    const proDidMount = Component.prototype.componentDidMount;
    Component.prototype.componentDidMount = function () {
        console.log("劫持生命周期：componentDidMount");
        proDidMount.call(this);
    };
    return class wrapComponent extends React.Component {
        render() {
            return <Component {...this.props} />;
        }
    };
}
@HOC
class Index extends React.Component {
    componentDidMount() {
        console.log("———didMounted———");
    }
    render() {
        return <div>hello,world</div>;
    }
}
```

效果

![](https://sbr-1314368469.cos.ap-guangzhou.myqcloud.com/Images/202301151259317.jpeg)

##### 2️⃣ 反向继承实现

反向继承，因为在继承原有组件的基础上，可以对原有组件的**生命周期**或**事件**进行劫持，甚至是替换

```jsx
function HOC(Component) {
    const proDidMount = Component.prototype.componentDidMount;
    return class wrapComponent extends Component {
        componentDidMount() {
            console.log("劫持生命周期：componentDidMount");
            proDidMount.call(this);
        }
        render() {
            return super.render();
        }
    };
}
@HOC
class Index extends React.Component {
    componentDidMount() {
        console.log("———didMounted———");
    }
    render() {
        return <div>hello,world</div>;
    }
}

export default Index;
```

#### 二、事件监控

`HOC` 还可以对原有组件进行监控。比如对一些**事件监听**，**错误监听**，**事件监听**等一系列操作。

##### 组件内的事件监听

接下来，我们做一个 `HOC` ，只对组件内的点击事件做一个监听效果。

```jsx
function ClickHoc(Component) {
    return function Wrap(props) {
        const dom = useRef(null);
        useEffect(() => {
            const handerClick = () => console.log("发生点击事件");
            dom.current.addEventListener("click", handerClick);
            return () => dom.current.removeEventListener("click", handerClick);
        }, []);
        return (
            <div ref={dom}>
                <Component {...props} />
            </div>
        );
    };
}

@ClickHoc
class Index extends React.Component {
    render() {
        return (
            <div className="index">
                <p>hello，world</p>
                <button>组件内部点击</button>
            </div>
        );
    }
}
export default () => {
    return (
        <div className="box">
            <Index />
            <button>组件外部点击</button>
        </div>
    );
};
```

效果

![demo](https://sbr-1314368469.cos.ap-guangzhou.myqcloud.com/Images/202301151337430.webp)

## 高阶组件注意事项

### 一、请谨慎修改原型链

```jsx
function HOC(Component) {
    const proDidMount = Component.prototype.componentDidMount;
    Component.prototype.componentDidMount = function () {
        console.log("劫持生命周期：componentDidMount");
        proDidMount.call(this);
    };
    return Component;
}
```

这样做会产生一些不良后果。比如如果你再用另一个同样会修改 `componentDidMount` 的 `HOC` 增强它，那么前面的 `HOC` 就会失效！同时，这个 `HOC` 也无法应用于没有生命周期的函数组件。

### 二、请注意静态属性继承

在用属性代理的方式编写 `HOC` 的时候，要注意的是就是，静态属性丢失的问题，前面提到了，如果不做处理，静态方法就会全部丢失。

#### 手动继承

我们可以手动将原始组件的静态方法 `copy` 到 `HOC` 组件上来，但前提是必须准确知道应该拷贝哪些方法。

```js
function HOC(Component) {
    class WrappedComponent extends React.Component {
        /*...*/
    }
    // 必须准确知道应该拷贝哪些方法
    WrappedComponent.staticMethod = Component.staticMethod;
    return WrappedComponent;
}
复制代码;
```

#### 引入第三方库

这样每个静态方法都绑定会很累，尤其对于开源的 `HOC` ，**对原生组件的静态方法是未知的**，我们可以使用 `hoist-non-react-statics` 自动拷贝所有的静态方法:

```bash
yarn add hoist-non-react-statics -D
```

```js
import hoistNonReactStatic from "hoist-non-react-statics";
function HOC(Component) {
    class WrappedComponent extends React.Component {
        /*...*/
    }
    hoistNonReactStatic(WrappedComponent, Component);
    return WrappedComponent;
}
```

### 三、请不要在 render 中声明 HOC

请看如下代码：

```jsx
// 🔴🔴🔴
class Index extends React.Component {
    render() {
        const WrapHome = HOC(Home);
        return <WrapHome />;
    }
}
```

如果这么写，会造成一个极大的问题，因为每一次 `HOC` 都会返回一个新的 `WrapHome` ， `react diff` 算法会判定两次**不是同一个组件**，那么每次 `Index` 组件重新渲染， `WrapHome` 也会重新挂载，导致状态会**全都丢失**。

如果想要动态绑定 `HOC` ，请参考如下方式：

```jsx
// 🟢🟢🟢
const WrapHome = HOC(Home);
class index extends React.Component {
    render() {
        return <WrapHome />;
    }
}
```

### 四、如何跨层级捕获 Ref

高阶组件的约定是将所有 `props` 传递给被包装组件，但这对于 `refs` 并不适用。

那是因为 `ref` 实际上并不是一个 `prop` - 就像 `key` 一样，它是由 `React` 专门处理的。

如果将 `ref` 添加到 `HOC` 的返回组件中，则 `ref` 引用指向容器组件，而不是被包装组件。

为了解决这个问题我们可以通过 `forwardRef` 来解决这个问题。

> 不知道什么是 fowardRef？可以看看这篇文章 [React 中的 forwardRef 究竟该怎么用？](https://juejin.cn/post/6985068487479656461)

```jsx
/**
 *
 * @param {*} Component 原始组件
 * @param {*} isRef  是否开启ref模式
 */
function HOC(Component, isRef) {
    class Wrap extends React.Component {
        render() {
            const { forwardedRef, ...otherprops } = this.props;
            return <Component ref={forwardedRef} {...otherprops} />;
        }
    }
    if (isRef) {
        // 此处的 ref 为调用传入进来的 ref，forwardRef 的作用就是接收它，并转发
        // 此处的 forwardedRef 不能写为 ref，如果写 ref 将不会起到转发的作用
        return React.forwardRef((props, ref) => <Wrap forwardedRef={ref} {...props} />);
    }
    return Wrap;
}

class Index extends React.Component {
    componentDidMount() {
        console.log(666);
    }
    render() {
        return <div>hello,world</div>;
    }
}

const HocIndex = HOC(Index, true);

export default () => {
    const node = useRef(null);
    useEffect(() => {
        /* 就可以跨层级，捕获到 Index 组件的实例了 */
        console.log(node.current.componentDidMount);
    }, []);
    return (
        <div>
            <HocIndex ref={node} />
        </div>
    );
};
```

打印结果：

![](https://sbr-1314368469.cos.ap-guangzhou.myqcloud.com/Images/202301151531604.webp)

如上就解决了， `HOC` 跨层级捕获 `ref` 的问题。

## 总结

本文从高阶组件功能为切入点，介绍二种不同的高阶组件如何编写，应用场景，以及实践。涵盖了大部分耳熟能详的开源高阶组件的应用场景，如果你觉得这篇文章对你有启发，最好还是按照文章中的 `demo` ，跟着敲一遍，加深印象，知道什么场景用高阶组件，怎么用高阶组件。

`实践是检验真理的唯一标准` ，希望大家能把高阶组件 `码` 起来，用起来。

最后 ， 送人玫瑰，手留余香，觉得有收获的朋友可以给笔者**点赞，关注**一波 ，陆续更新前端超硬核文章。

> 本文摘抄于稀土掘金
>
> 作者大大：[我不是外星人](https://juejin.cn/user/2418581313687390)——[原文地址](https://juejin.cn/post/6940422320427106335#heading-53)
