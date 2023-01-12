---
title: 【Vue2】查漏补缺 - 回顾
author: BigRice
date: 2022-04-10
location: 云梦泽
summary: 小伙学完 Vue2 一年后，再度回顾官方文档，居然发现了不得了的细节！
tags:
  - Vue2
---

## v-model

-   在 vue 中，v-model 可以完成一个变量的值在组件外与组件本身保持一致：即**双向数据绑定**

-   vue2 实现对一个自定义的组件进行封装，并实现 v-model 双向绑定功能

    ⬇ 父组件

    ```vue
    <template>
        <Child v-model="number"></Child>
    </template>

    <script>
    export default {
        data() {
            return {
                number: 0,
            };
        },
        components: {
            Child: () => import("./Child.vue"),
        },
    };
    </script>
    ```

    ⬇ 子组件

    ```vue
    <template>
        <button @click="handleClick">{{ value }}</button>
    </template>
    <script>
    export default {
        props: {
            value: Number,
        },
        methods: {
            handleClick() {
                // 通过emit一个input事件出去，实现 v-model
                this.$emit("input", this.value + 1);
            },
        },
    };
    </script>
    ```

## transition

`<transition>` 组件定义了插槽内的单个元素和组件添加在 **(进入/离开)-(显示/隐藏)** 之间的**过渡**效果，注意：并不能定义过渡结束后的样式

<img src="https://sbr-1314368469.cos.ap-guangzhou.myqcloud.com/Images/202301091207382.png" alt="image-20221204135825102" style="zoom:80%" />

在**(进入/离开)-(显示/隐藏)** 【以下称显示/隐藏】的过渡中，会有 6 个 class 切换

1. `v-enter` ：元素或组件从**显示过渡开始前时**的样式。这个类可以用来定义元素的进入效果是怎样的。

    - 这个样式只存在于过渡开始时，在 `v-enter-to` 开启时将会被移除（请避免在这个样式中移动元素，这将会引起抽搐）

2. `v-enter-active` ：元素或组件从**隐藏到显示整个阶段**时的样式。这个类可以被用来定义过渡的时间，延迟和曲线或`动画`。

3. `v-enter-to`：_<2.1.8 版及以上>_ 元素或组件从**隐藏到显示过渡结束前时**的样式 。

    - 这个样式只存在于过渡结束前时，开启时将会被移除（请避免在这个样式中移动元素，这将会引起抽搐）

4. `v-leave`：参考上方 `v-enter` ，取反。

5. `v-leave-active`：参考上方 `v-enter-active` ，取反。

6. `v-leave-to`：_<2.1.8 版及以上>_ 参考上方 `v-enter-to` ，取反。

总结：

始终要明白 transition 定义的只是**过渡**的效果，在过渡后元素会恢复到最初时的样式。

那么根据上条总结就可以明白，假设我们需要定义元素从隐藏到显示时的效果，那么只需要定义

```css
.v-enter-active,
v-leave-active {
    transtion: all 0.8s ease;
}

.v-enter,
v-leave-to {
    /* 因为元素在过渡后会恢复到最初时的样式
       所以此处的效果为：
         显示过渡：{ 透明度为:0 左侧偏移: -50px } ->> { 透明度为:1 左侧偏移:0px }
    	 隐藏过渡：{ 透明度为:1 左侧偏移: 0px } ->> { 透明度为:0 左侧偏移:-50px }
    */
    opacity: 0;
    transform: translateX(-50px);
}
```

```
1. `v-enter-active,v-leave-active`：显示/隐藏 过渡整体的曲线或动画
2. `v-enter,v-leave-to` ：显示过渡一开始时的样式，与隐藏过渡结束时的样式
    1. 不定义 `v-enter-to` 的原因是过渡完后元素将会恢复到定义之初时的样式，所以完全不需要在最后一点时间存在动画，
```

需要定义 `animation` 动画效果时，只需要在 `v-enter-active(进入过渡时)` 与 `v-leave-active(离开过渡时)` 两个样式上开启动画

### 自定义类名

我们可以通过以下 attribute 来自定义过渡类名：

-   `enter-class`
-   `enter-active-class`
-   `enter-to-class` (2.1.8+)
-   `leave-class`
-   `leave-active-class`
-   `leave-to-class` (2.1.8+)

### JavaScript 钩子

如果我们的过渡效果需要依赖 JS 变量来进行展示不同的效果、例如**交错过渡**，那么可以使用 JavaScript 钩子来定义过渡效果

可以在 attribute 中声明的 JavaScript 钩子

```html
<transition
    @before-enter="beforeEnter"
    @enter="enter"
    @after-enter="afterEnter"
    @enter-cancelled="enterCancelled"
    @before-leave="beforeLeave"
    @leave="leave"
    @after-leave="afterLeave"
    @leave-cancelled="leaveCancelled">
    <!-- ... -->
</transition>
```

```javascript
// ...
methods: {
  // --------
  // 过渡进入中
  // --------
  // 设置过渡进入之前的组件状态
  beforeEnter: function (el) {
    // ...
  },
  // 设置过渡进入完成时的组件状态
  enter: function (el, done) {
    // ...
    done()
  },
  // 设置过渡进入完成之后的组件状态
  afterEnter: function (el) {
    // ...
  },
  // enterCancelled 只用于 v-show 中
  enterCancelled: function (el) {
    // ...
  },

  // --------
  // 过渡离开时
  // --------
  // 设置过渡离开之前的组件状态
  beforeLeave: function (el) {
    // ...
  },
  // 设置过渡离开之前的组件状态
  leave: function (el, done) {
    // ...
    done()
  },
  // 设置过渡进入完成之后的组件状态
  afterLeave: function (el) {
    // ...
  },
  // leaveCancelled 只用于 v-show 中
  leaveCancelled: function (el) {
    // ...
  }
}
```

使用钩子定义过渡效果有几个注意事项：

-   当只用钩子进行过渡的时候，**在 `enter` 和 `leave` 中必须使用 `done` 进行回调**。否则，它们将被同步调用，过渡会立即完成。
    -   `done()` 的调用时机应该设计为在一个定时器后执行，若直接调用那么过渡还未结束就会停止。
    -   可以使用 [Velocity.js](http://shouce.jb51.net/velocity/option.html) 来完成钩子过渡的效果，也可以查看 [Vue 官网](https://v2.cn.vuejs.org/v2/guide/transitions.html#JavaScript-%E9%92%A9%E5%AD%90) 上的例子。
-   对于仅使用钩子过渡的元素添加 `:css="false"`，这样 Vue 会跳过 CSS 的检测。这也可以避免过渡过程中 CSS 的影响。
-   每个钩子中设置的元素样式**将一直存在**，所以使用钩子需要自己来定义元素过渡时每个阶段对应的效果。

### 过渡模式

-   `<transition>` 存在一些问题

<img src="https://sbr-1314368469.cos.ap-guangzhou.myqcloud.com/Images/202301091207781.gif" alt="toggle" style="zoom:80%" />

-   在“Toggel”按钮和“Togge2”按钮的过渡中，两个按钮都被重绘了，一个离开过渡的时候另一个开始进入过渡。这是 `<transition>` 的默认行为 - `进入和离开同时发生`。

-   通常遇到这种情况我们可以使用**绝对定位**来消除这种影响

<img src="https://sbr-1314368469.cos.ap-guangzhou.myqcloud.com/Images/202301091207167.gif" alt="${1}" style="zoom:80%" />

-   加上 `translate ` 动画

<img src="https://sbr-1314368469.cos.ap-guangzhou.myqcloud.com/Images/202301091207725.gif" alt="02" style="zoom:80%" />

不过同时生效的进入和离开的过渡不能满足所有要求，所以 Vue 提供了**过渡模式**

-   我们可以设置 `mode` 属性为 `in-out` 或 `out-in`

-   `in-out`：新元素先进行过渡，完成之后当前元素过渡离开。
-   `out-in`：当前元素先进行过渡，完成之后新元素过渡进入。

##### 用 `out-in` 重写之前的开关按钮过渡：

<img src="https://sbr-1314368469.cos.ap-guangzhou.myqcloud.com/Images/202301091207547.gif" alt="${1}" style="zoom:80%" />

只用添加一个简单的属性，就解决了之前的过渡问题而无需任何额外的代码。

`in-out` 模式不是经常用到，但对于一些稍微不同的过渡效果还是有用的。将之前滑动淡出的例子结合：

<img src="https://sbr-1314368469.cos.ap-guangzhou.myqcloud.com/Images/202301091207296.gif" alt="03" style="zoom:80%" />

```vue
<script>
export default {
    components: {},
    data() {
        return {
            show: true,
        };
    },
    methods: {},
};
</script>

<template>
    <div>
        <transition name="btn" mode="in-out">
            <button key="toole1" v-if="show" @click="show = !show">Toggle 1</button>
            <button key="toole2" v-else @click="show = !show">Toggle 2</button>
        </transition>
    </div>
</template>

<style scoped>
button {
    position: absolute;
}

@keyframes enter {
    from {
        z-index: 5;
        opacity: 0;
        transform: translateX(50px);
    }
    to {
        transform: translateX(0px);
    }
}
@keyframes leave {
    from {
        transform: translateX(0px);
    }
    to {
        opacity: 0;
        transform: translateX(-50px);
    }
}

.btn-enter-active {
    animation: enter 0.5s ease-in-out;
}
.btn-leave-active {
    animation: leave 0.5s ease-in-out;
}
</style>
```

## transition-group

transition-group 中的内部可以存放多个元素或组件并为他们添加过渡效果，不过有几个注意事项

-   不同于 `<transition>`，它会以一个真实元素呈现：默认为一个 `<span>`。也可以通过 `tag` 属性将其更换为其他元素。
-   [过渡模式](https://v2.cn.vuejs.org/v2/guide/transitions.html#过渡模式)不可用，因为我们不再相互切换特有的元素。
-   内部元素**必须**提供唯一的 `key` 值。
-   CSS 过渡的类将会应用在内部的元素中，而不是这个组/容器本身。
-   还有一个特殊之处。不仅可以设置进入和离开动画，还可以设置定位动画

### 列表的排序过渡

<img src="https://sbr-1314368469.cos.ap-guangzhou.myqcloud.com/Images/202301091207224.gif" alt="04" style="zoom:80%" />

```vue
<script>
import { shuffle } from "lodash";
export default {
    components: {},
    data() {
        return {
            items: [1, 2, 3, 4, 5, 6, 7, 8, 9],
        };
    },
    methods: {
        onShuffle: function () {
            this.items = shuffle(this.items);
        },
    },
};
</script>

<template>
    <div style="width:80px;">
        <button @click="onShuffle">打乱</button>
        <transition-group name="flip-list" tag="ul">
            <li v-for="item in items" v-bind:key="item">
                {{ item }}
            </li>
        </transition-group>
    </div>
</template>

<style scoped>
.flip-list-move {
    transition: transform 1s;
}
</style>
```

代码非常简单，只设置了 `.flip-list-move` 这个类名在元素发生定位改变的时候进行过渡。

> 这个看起来很神奇，内部的实现，Vue 使用了一个叫 [FLIP](https://aerotwist.com/blog/flip-your-animations/) 简单的动画队列
> 使用 transforms 将元素从之前的位置平滑过渡新的位置。 —— Vue.js

> 需要注意的是使用 FLIP 过渡的元素**一定不能**设置为 `display: inline` 。作为替代方案，可以设置为 `display: inline-block` 或者放置于 flex 中

## 属性过渡

Vue 的过渡系统提供了非常多简单的方法设置进入、离开和列表的动效。那么对于数据元素本身的动效呢，比如：

-   数字和运算
-   颜色的显示
-   SVG 节点的位置
-   元素的大小和其他的 property

这些数据要么本身就以数值形式存储，要么可以转换为数值。有了这些数值后，我们就可以结合 Vue 的响应式和组件系统，使用第三方库来实现切换元素的过渡状态。

只需要使用 `gsap.js` 与 catch 侦听器，我们就可以完成这个例子

<img src="https://sbr-1314368469.cos.ap-guangzhou.myqcloud.com/Images/202301091207267.gif" alt="05" style="zoom:80%" />

```vue
<script>
// yarn add gsap
import gsap from "gsap";
export default {
    components: {},
    data() {
        return {
            number: 0,
            tweenedNumber: 0,
        };
    },
    computed: {
        animatedNumber() {
            // 去除小数点
            return this.tweenedNumber.toFixed(0);
        },
    },
    watch: {
        number(value) {
            // 以下代码将 tweenedNumber 的值不断接近 value 就像执行了动画一样
            gsap.to(this.$data, { duration: 0.5, tweenedNumber: value });
        },
    },
};
</script>

<template>
    <div id="animated-number-demo">
        <input v-model.number="number" type="number" step="20" />
        <p>{{ animatedNumber }}</p>
    </div>
</template>
```

## 自定义指令

在 vue 中，可以使用 `directive` 属性自定义指令，对普通 DOM 元素进行底层操作。

```js
// 全局注册一个全局自定义指令 `v-focus`
Vue.directive('focus', {
  // 当被绑定的元素插入到 DOM 中时……
  inserted: function (el) {
    // 聚焦元素
    el.focus()
  }
})

// 局部注册一个全局自定义指令 `v-focus`
directives: {
  focus: {
    // 指令的定义
    inserted: function (el) {
      el.focus()
    }
  }
}
```

### 钩子函数

钩子函数可以指定更改元素的时机

-   `bind`：只调用一次，指令第一次绑定到元素时调用。在这里可以进行一次性的初始化设置。
-   `inserted`：被绑定元素插入父节点时调用 (仅保证父节点存在，但不一定已被插入文档中)。
-   `update`：所在组件的 VNode 更新时调用，**但是可能发生在其子 VNode 更新之前**。指令的值可能发生了改变，也可能没有。但是你可以通过比较更新前后的值来忽略不必要的模板更新 (详细的钩子函数参数见下)。
-   `componentUpdated`：指令所在组件的 VNode **及其子 VNode** 全部更新后调用。
-   `unbind`：只调用一次，指令与元素解绑时调用。

若只需要使用 `bind` 与 `update` 钩子，可以将指令**简写**成一个函数：

```js
directives: {
    test() {
        console.log(...arguments);
    }
}
```

### 钩子函数参数

指令钩子函数会被传入以下参数：

-   `el`：指令所绑定的元素，可以用来直接操作 DOM。
-   `binding`：一个对象，包含以下属性：
    -   `name`：指令名，不包括 `v-` 前缀。
    -   `value`：指令的绑定值，例如：`v-my-directive="1 + 1"` 中，绑定值为 `2`。
    -   `oldValue`：指令绑定的前一个值，仅在 `update` 和 `componentUpdated` 钩子中可用。无论值是否改变都可用。
    -   `expression`：字符串形式的指令表达式。例如 `v-my-directive="1 + 1"` 中，表达式为 `"1 + 1"`。
    -   `arg`：传给指令的参数，可选。例如 `v-my-directive:foo` 中，参数为 `"foo"`。
    -   `modifiers`：一个**包含修饰符的对象**。例如：`v-my-directive.foo.bar` 中，修饰符对象为 `{ foo: true, bar: true }`。
-   `vnode`：Vue 编译生成的虚拟节点。移步 [VNode API](https://v2.cn.vuejs.org/v2/api/#VNode-接口) 来了解更多详情。
-   `oldVnode`：上一个虚拟节点，仅在 `update` 和 `componentUpdated` 钩子中可用。

> ❗ 注意：除了 `el` 参数之外，其它参数都应该是只读的，切勿进行修改。如果需要在钩子之间共享数据，建议通过元素的 dataset 来进行。

### 🍳 总结

一个自定义指令最全的写法可以这样定义 `v-directive:foo.boo="value"`

-   `v-directive` 这一部分为指令名。

-   `:foo` 这一部分被称为 `arg` 参数，是一个字符串或动态的值。

    -   使用动态的值需要这样定义 `v-directive:[foo]` 。

-   `.boo` 这一部分被称为修饰符，以布尔值的形式存在 `modifiers` 对象中。

    -   此时的 `modifiers` 值为 `{ boo : true }`。

-   `="value"` 这一部分被称为 `value` 参数，值是一个合法的 JavaScript 表达式。
    -   `"{ color: 'white', text: 'hello!' }"` 与 `"[1,2,3,4]"` 都是支持的

#### 案例

来看一个 `v-absolute` 指令，它可以使用 `args` 参数与 `value` 值指定单方位偏移量，或使用对象形式的（合法方位） `value` 值来指定多个方位的偏移量

<img src="https://sbr-1314368469.cos.ap-guangzhou.myqcloud.com/Images/202301091208694.png" alt="image-20221206180831727" style="zoom:80%" />

```vue
<template>
    <div>
        <span v-absolute:top="100">测试自定义指令</span>
        <span v-absolute:left="100">测试自定义指令</span>
        <span v-absolute="{ top: 100, left: 100 }">测试自定义指令</span>
    </div>
</template>

<script>
export default {
    directives: {
        absolute(el, { arg, value }) {
            el.style = "";
            el.style.position = "absolute";
            if (value instanceof Object) {
                for (const [k, v] of Object.entries(value)) {
                    el.style[k] = v + "px";
                    el.textContent += ` ${k}:${v}px `;
                }
            } else if (typeof value == "number" && arg) {
                el.style[arg] = value + "px";
                el.textContent += ` ${arg}:${value}px `;
            }
        },
    },
};
</script>
```

## Dom Tree

HTML 的结构是一个树状结构，在内存中形成一棵树，例如 HTML 结构

```html
<div>
    <h1>My title</h1>
    Some text content
    <!-- TODO: Add tagline -->
</div>
```

当浏览器读到这些代码时，它会建立一个[“DOM 节点”树](https://javascript.info/dom-nodes)来保持追踪所有内容，如同你会画一张家谱树来追踪家庭成员的发展一样。

上述 HTML 对应的 DOM 节点树如下图所示：

<img src="https://sbr-1314368469.cos.ap-guangzhou.myqcloud.com/Images/202301091208588.png" alt="image-20221206202940335" style="zoom:80%" />

每个元素都是一个节点。每段文字也是一个节点。甚至注释也都是节点。一个节点就是页面的一个部分。就像家谱树一样，每个节点都可以有孩子节点 (也就是说每个部分可以包含其它的一些部分)。

高效地更新所有这些节点会是比较困难的，不过所幸你不必手动完成这个工作。你只需要告诉 Vue 你希望页面上的 HTML 是什么，这可以是在一个模板里：

```html
<h1>{{ blogTitle }}</h1>
```

或者一个渲染函数里：

```js
render(createElement) {
  return createElement('h1', this.blogTitle)
}
```

在这两种情况下，Vue 都会自动保持页面的更新，即便 `blogTitle` 发生了改变。

> Vue 通过建立一个**虚拟 DOM/VNode** 来追踪自己要如何改变真实 DOM。请仔细看这行代码：

## Render 渲染函数

Vue 推荐在绝大多数情况下使用模板来创建你的 HTML。然而在一些场景中，你真的需要 JavaScript 的完全编程的能力。这时你可以用**渲染函数**，它比模板更接近编译器。

下面就是一个通过 `level` prop 动态生成标题 (heading) 的组件，通过 Render 函数渲染

```js
const getChildrenTextContent = children => {
    return children
        .map(function (node) {
            return node.children ? getChildrenTextContent(node.children) : node.text;
        })
        .join("");
};

Vue.component("anchored-heading", {
    render(h) {
        let name = getChildrenTextContent(this.$slots.default);
        return h("h" + this.level, [
            h(
                "a",
                {
                    attrs: {
                        name: name,
                        href: "#" + name,
                    },
                },
                this.$slots.default
            ),
        ]);
    },
    props: {
        level: {
            type: Number,
            required: true,
        },
    },
});
```

### createElement 函数参数

```js
// @return {VNode}
createElement(
    // { String | Object | Function }
    // 一个 HTML 标签名、组件选项对象，或者
    // resolve 了上述任何一种的一个 async 函数。【必填项】。
    "div",
    // {Object}
    // 一个与模板中 attribute 对应的数据对象。【可选】。
    {
        // (详情见下一节)
    },
    // {String | Array}
    // 子级虚拟节点 (VNodes)，由 `createElement()` 构建而成，
    // 也可以使用字符串来生成“文本虚拟节点”。【可选】。
    // (可以将个参数看作元素的 innerHTML 属性)
    [
        "先写一些文字",
        createElement("h1", "一则头条"),
        createElement(MyComponent, {
            props: {
                someProp: "foobar",
            },
        }),
    ]
);
```

> 有一点要注意：正如 v-bind:class 和 v-bind:style 在模板语法中会被特别对待一样，它们在 VNode 数据对象中也有对应的顶层字段。该对象也允许你绑定普通的 HTML attribute，也允许绑定如 innerHTML 这样的 DOM property (这会覆盖 v-html 指令)。

```js
Object: {
          // 与 `v-bind:class` 的 API 相同，
          // 接受一个字符串、对象或字符串和对象组成的数组
        'class': {
            foo: true,
            bar: false
        },
        // 与 `v-bind:style` 的 API 相同，
        // 接受一个字符串、对象，或对象组成的数组
        style: {
            color: 'red',
            fontSize: '14px'
        },
        // 普通的 HTML attribute
        attrs: {
            id: 'foo'
        },
        // 组件 prop
        props: {
            myProp: 'bar'
        },
        // 定义元素的各种属性，可以看作此属性就是元素本身
        domProps: {
           // 定义元素内元素为 ”baz“ ，那么下一个参数将会失效
            innerHTML: 'baz'
            onclick: () => {
                alert(1);
            },
        },
        // 事件监听器在 `on` 内，
        // 但不再支持如 `v-on:keyup.enter` 这样的修饰器。
        // 需要在处理函数中手动检查 keyCode。
        on: {
            click: this.clickHandler
        },
        // 仅用于组件，用于监听原生事件，而不是组件内部使用
        // `vm.$emit` 触发的事件。
        nativeOn: {
            click: this.nativeClickHandler
        },
        // 需要使用的指令（这个指令必须为全局指令或先于这个函数前创建好）。
        // 注意，不需要添加 ”v-“ ，并且无法对 `binding` 中的 `oldValue`
        // 赋值，因为 Vue 已经自动进行了同步。
        directives: [
            {
                name: 'absolute',
                value: 200,
                expression: '1 + 1',
                arg: 'left',
                modifiers: {
                    isRender: true
                }
            }
        ],
        // 作用域插槽的格式为
        // { name: props => VNode | Array<VNode> }
        scopedSlots: {
            default: props => createElement('span', props.text)
        },
        // 如果组件是其它组件的子组件，需为插槽指定名称
        slot: 'name-of-slot',
        // 其它特殊顶层 property
        key: 'myKey',
        ref: 'myRef',
        // 如果你在渲染函数中给多个元素都应用了相同的 ref 名，
        // 那么 `$refs.myRef` 会变成一个数组。
        refInFor: true
    }
```

### 🍳 总结

-   `createElement` 函数的作用就是使用 JS 将组件渲染为 VNode 的形式，然后返回给 `render` 进而渲染成一个真实 DOM 、

    -   `React.js` 的风格就是 **JSX**

-   `render` 函数是一个回调函数，只有当写出这个组件时才会调用

    -   所以若 `createElement` 中定义了具名插槽，例如以下代码指定了必须传入 `header` 具名插槽

        ```js
        Vue.component("diyDiv", {
            props: ["message"],
            render(h) {
                // `<div><slot name="header" :message="message"></slot></div>`
                return h("div", [
                    this.$scopedSlots.header({
                        message: this.message,
                    }),
                ]);
            },
        });
        ```

        ```html
        <diyDiv :message="{test:'测试'}">
            <template #header="data">
                {{data}}
                <!-- {message:{test:'测试'}} -->
            </template>
        </diyDiv>
        ```

### 使用 JavaScript 代替模板功能

#### `v-if` 和 `v-for`

只要在原生的 JavaScript 中可以轻松完成的操作，Vue 的渲染函数就不会提供专有的替代方法。比如，在模板中使用的 `v-if` 和 `v-for`：

```html
<ul v-if="items.length">
    <li v-for="item in items">{{ item.name }}</li>
</ul>
<p v-else>No items found.</p>
```

这些都可以在渲染函数中用 JavaScript 的 `if`/`else` 和 `map` 来重写：

```js
props: ['items'],
render: function (createElement) {
  if (this.items.length) {
    return createElement('ul', this.items.map(function (item) {
      return createElement('li', item.name)
    }))
  } else {
    return createElement('p', 'No items found.')
  }
}
```

#### `v-model`

渲染函数中没有与 `v-model` 的直接对应——你必须自己实现相应的逻辑：

```js
props: ['value'],
render: function (createElement) {
  var self = this
  return createElement('input', {
    domProps: {
      value: self.value
    },
    on: {
      input: function (event) {
        self.$emit('input', event.target.value)
      }
    }
  })
}
```

这就是深入底层的代价，但与 `v-model` 相比，这可以让你更好地控制交互细节。

#### 事件&按键修饰符

对于 `.passive`、`.capture` 和 `.once` 这些事件修饰符，Vue 提供了相应的前缀可以用于 `on`：

| 修饰符                             | 前缀 |
| :--------------------------------- | :--- |
| `.passive`                         | `&`  |
| `.capture`                         | `!`  |
| `.once`                            | `~`  |
| `.capture.once` 或 `.once.capture` | `~!` |

例如：

```js
on: {
  '!click': this.doThisInCapturingMode,
  '~keyup': this.doThisOnce,
  '~!mouseover': this.doThisOnceInCapturingMode
}
```

对于所有其它的修饰符，私有前缀都不是必须的，因为你可以在事件处理函数中使用事件方法：

| 修饰符                                      | 处理函数中的等价操作                                                                                            |
| :------------------------------------------ | :-------------------------------------------------------------------------------------------------------------- |
| `.stop`                                     | `event.stopPropagation()`                                                                                       |
| `.prevent`                                  | `event.preventDefault()`                                                                                        |
| `.self`                                     | `if (event.target !== event.currentTarget) return`                                                              |
| 按键： `.enter`, `.13`                      | `if (event.keyCode !== 13) return` (对于别的按键修饰符来说，可将 `13` 改为[另一个按键码](http://keycode.info/)) |
| 修饰键： `.ctrl`, `.alt`, `.shift`, `.meta` | `if (!event.ctrlKey) return` (将 `ctrlKey` 分别修改为 `altKey`、`shiftKey` 或者 `metaKey`)                      |

这里是一个使用所有修饰符的例子：

```js
on: {
  keyup: function (event) {
    // 如果触发事件的元素不是事件绑定的元素
    // 则返回
    if (event.target !== event.currentTarget) return
    // 如果按下去的不是 enter 键或者
    // 没有同时按下 shift 键
    // 则返回
    if (!event.shiftKey || event.keyCode !== 13) return
    // 阻止 事件冒泡
    event.stopPropagation()
    // 阻止该元素默认的 keyup 事件
    event.preventDefault()
    // ...
  }
}
```

#### 插槽

你可以通过 `this.$slots` 访问静态插槽的内容，每个插槽都是一个 VNode 数组：

```js
render: function (createElement) {
  // `<div><slot></slot></div>`
  return createElement('div', this.$slots.default)
}
```

也可以通过 [`this.$scopedSlots`](https://v2.cn.vuejs.org/v2/api/#vm-scopedSlots) 访问作用域插槽，每个作用域插槽都是一个返回若干 VNode 的函数：

```js
props: ['message'],
render: function (createElement) {
  // `<div><slot :text="message"></slot></div>`
  return createElement('div', [
    this.$scopedSlots.default({
      text: this.message
    })
  ])
}
```

如果要用渲染函数向子组件中传递作用域插槽，可以利用 VNode 数据对象中的 `scopedSlots` 字段：

```js
render: function (createElement) {
  // `<div><child v-slot="props"><span>{{ props.text }}</span></child></div>`
  return createElement('div', [
    createElement('child', {
      // 在数据对象中传递 `scopedSlots`
      // 格式为 { name: props => VNode | Array<VNode> }
      scopedSlots: {
        default: function (props) {
          return createElement('span', props.text)
        }
      }
    })
  ])
}
```

## 函数式组件

之前创建的锚点标题组件是比较简单，没有管理任何状态，也没有监听任何传递给它的状态，也没有生命周期方法。实际上，它只是一个接受一些 prop 的函数。在这样的场景下，我们可以将组件标记为 `functional`，这意味它无状态 (没有[响应式数据](https://v2.cn.vuejs.org/v2/api/#选项-数据))，也没有实例 (没有 `this` 上下文)。一个**函数式组件**就像这样：

```js
Vue.component("my-component", {
    functional: true,
    // Props 是可选的
    props: {
        // ...
    },
    // 为了弥补缺少的实例
    // 提供第二个参数作为上下文
    render: function (createElement, context) {
        // ...
    },
});
```

组件需要的一切都是通过 `context` 参数传递，它是一个包括如下字段的对象：

-   `props`：提供所有 prop 的对象
-   `children`：子节点的 VNode 数组
-   `slots`：一个函数，返回了包含所有插槽的对象
    -   若访问 `default` 插槽可以 这样访问：`slots().default`
-   `scopedSlots`：(2.6.0+) 一个暴露传入的作用域插槽的对象。也以函数形式暴露普通插槽。
-   `data`：传递给组件的整个[数据对象](https://v2.cn.vuejs.org/v2/guide/render-function.html#深入数据对象)，作为 `createElement` 的第二个参数传入组件
-   `parent`：对父组件的引用
-   `listeners`：(2.3.0+) 一个包含了所有父组件为当前组件注册的事件监听器的对象。这是 `data.on` 的一个别名。
-   `injections`：(2.3.0+) 如果使用了 [`inject`](https://v2.cn.vuejs.org/v2/api/#provide-inject) 选项，则该对象包含了应当被注入的 property。
