---
title: 【Vue3】做出了哪些改变？
author: BigRice
date: 2021-12-20
location: 云梦泽
summary: 本文为 Vue3 的入门总结
tags:
  - Vue3
---

## 选择 API 风格

在 Vue3 ，可以按两种不同的风格书写代码：**选项式 API** 和**组合式 API**。

### 选项式 API（Options API）

`Options API` 大致写法于 Vue2 没有什么差异

```html
<script>
    export default {
        // data() 返回的属性将会成为响应式的状态
        // 并且暴露在 `this` 上
        data() {
            return {
                count: 0,
            };
        },

        // methods 是一些用来更改状态与触发更新的函数
        // 它们可以在模板中作为事件监听器绑定
        methods: {
            increment() {
                this.count++;
            },
        },

        // 生命周期钩子会在组件生命周期的各个不同阶段被调用
        // 例如这个函数就会在组件挂载完成后被调用
        mounted() {
            console.log(`The initial count is ${this.count}.`);
        },
    };
</script>
```

### 组合式 API（Composition API）

通过 Composition API，我们可以使用导入的 API 函数来描述组件逻辑。在单文件组件中，组合式 API 通常会与 `<script setup>` 语法糖搭配使用。这个 `setup` 属性是一个标识，告诉 Vue 需要在编译时进行一些处理，让我们可以更简洁地使用组合式 API。比如，`<script setup>` 中的导入和顶层变量/函数都能够在模板中直接使用。

下面是使用了组合式 API 与 `<script setup>` 改造后和上面的模板完全一样的组件：

```html
<script setup>
    import { ref, onMounted } from "vue";

    // 响应式状态
    const count = ref(0);

    // 用来修改状态、触发更新的函数
    function increment() {
        count.value++;
    }

    // 生命周期钩子
    onMounted(() => {
        console.log(`The initial count is ${count.value}.`);
    });
</script>
```

### 🍳 总结

-   composition API 是在 options API 的基础上实现的

-   options API 以“组件实例”的概念为中心，即 `this`

-   composition API 的核心思想是直接在函数作用域内定义响应式状态变量，并将从多个函数中得到的状态组合起来处理复杂问题。

-   ##### 推荐使用 `composition API`

## Vue3 的响应式基础

在 Vue3 中 ，响应式对象是基于 `Proxy` （ES 6 代理对象）实现的。

我们一般使用 `ref` 与 `reactive` 来声明响应式变量

### reactive

可用于创建一个响应式**对象或数组**，它有两条限制：

1. 仅对对象类型有效，（对象、数组和 `Map`、`Set` 这样的[集合类型](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects#使用键的集合对象)），而对 `string`、`number` 和 `boolean` 这样的 [原始类型](https://developer.mozilla.org/zh-CN/docs/Glossary/Primitive) 无效。

2. 不可随意**替换**由 `reactive` 定义的响应式变量，因为这将导致对初始引用的响应性连接丢失：

    > 因为 Vue 的响应式系统是通过属性访问进行追踪的，因此我们必须始终保持对该响应式对象的相同引用

    ```js
    let state = reactive({ count: 0 });
    // 上面的引用 ({ count: 0 }) 将不再被追踪（响应性连接已丢失！）
    state = reactive({ count: 1 });
    // 同时这也意味着当我们将响应式对象的属性赋值或解构至本地变量时，或是将该属性传入一个函数时，我们会失去响应性：
    
    // n 是一个局部变量，同 state.count
    // 失去响应性连接
    let n = state.count;
    // 不影响原始的 state
    n++;
    
    // count 也和 state.count 失去了响应性连接
    let { count } = state;
    // 不会影响原始的 state
    count++;
    
    // 该函数接收一个普通数字，并且
    // 将无法跟踪 state.count 的变化
    callSomeFunction(state.count);
    ```

### ref

可用于创建任何值类型的响应式变量

-   `reactive()` 的种种限制归根结底是因为 JavaScript 没有可以作用于所有值类型的 “引用” 机制。为此，Vue 提供了一个 [`ref()`](https://cn.vuejs.org/api/reactivity-core.html#ref) 方法来允许我们创建可以使用任何值类型的响应式 **ref**：

-   `ref()` 将传入参数的值包装为一个带 `.value` 属性的 ref 对象：

    -   这意味着访问/修改 `ref` 变量的值需要通过 `xxx.value.xxx` 来修改

        ```js
        const objectRef = ref({ count: 0 });
        
        // 这是响应式的替换
        objectRef.value = { count: 1 };
        
        // ref 被传递给函数或是从一般对象上被解构时，不会丢失响应性：
        const obj = {
            foo: ref(1),
            bar: ref(2),
        };
        
        // 该函数接收一个 ref
        // 需要通过 .value 取值
        // 但它会保持响应性
        callSomeFunction(obj.foo);
        
        // 仍然是响应式的
        const { foo, bar } = obj;
        ```

### ref 变量在模板中的解包

当 ref 在模板中作为顶层属性被访问时，它们会被自动“解包”，所以不需要使用 `.value`。下面是之前的计数器例子，用 `ref()` 代替：

```vue
<script setup>
import { ref } from "vue";

const count = ref(0);

function increment() {
    count.value++;
}
</script>
<template>
    {{ count }}
    <!-- 无需 .value -->
</template>
```

**请注意**，仅当 `ref` 变量是 `<script setup>` 中定义的顶级属性时才适用自动“解包”。

-   例如， foo 是顶层属性，但 object.foo 不是。

    ```js
    const object = { foo: ref(1) };
    const { foo } = object;
    {
        {
            object.foo + 1;
        }
    } // 表达式将不会工作，将会渲染出 [object Object] + 1 进而报错
    {
        {
            foo + 1;
        }
    } // 表达式正常工作，输入 2
    ```

-   如果 `{{}}` 中写入的表达式不需要使用到 `JS` 计算，那么也会自动解包，这只是文本插值的一个方便功能。

    ```js
    const object = { foo: ref(1) };
    {
        {
            object.foo;
        }
    } // 2
    ```

## 元素 Ref 与 defineExpose

`ref` 可以用来创建一个响应式变量，同时也可以用来获取 DOM 元素或子组件

```html
<script setup>
    import { ref, onMounted } from "vue";

    // 声明一个 ref 来存放该元素的引用
    // 必须和模板里的 ref 同名
    const input = ref(null);

    onMounted(() => {
        input.value.focus();
    });
</script>

<template>
    <input ref="input" />
</template>
```

### 组件上的 ref

`ref` 引用也可以被用在一个子组件上。这种情况下引用中获得的值是组件实例：

```html
<script setup>
    import { ref, onMounted } from "vue";
    import Child from "./Child.vue";

    const child = ref(null);

    onMounted(() => {
        // child.value 是 <Child /> 组件的实例
    });
</script>

<template>
    <Child ref="child" />
</template>
```

> 注意：

-   若子组件的代码风格为 options API 且没有使用 `setup()` 钩子函数，`ref` 引用的值才是完整的组件实例。

-   使用了 `<script setup>` 的组件是**默认私有**的：一个父组件无法访问到一个使用了 `<script setup>` 的子组件中的任何东西，除非子组件在其中通过 `defineExpose` 宏显式暴露：

    ```html
    <script setup>
        import { ref } from "vue";
    
        const a = 1;
        const b = ref(2);
    
        defineExpose({
            a,
            b,
        });
    </script>
    ```

    -   当父组件通过模板引用获取到了该组件的实例时，得到的实例类型为 `{ a: 1, b: 2}` (ref 都会自动解包，和一般的实例一样)。

## 生命周期名称变化

|      Vue2       |     |        Vue3        |
| :-------------: | :-: | :----------------: |
| `beforeCreate`  | --> |      `setup`       |
|    `created`    | --> |      `setup`       |
|  `beforeMount`  | --> |  `onBeforeMount`   |
|    `Mounted`    | --> |    `onMounted`     |
| `beforeUpdate`  | --> |  `onBeforeUpdate`  |
|    `updated`    | --> |    `onUpdated`     |
| `beforeDestroy` | --> | `onBeforeUnmount ` |
|   `destroyed`   | --> |   `onUnmounted`    |

## Transition 类名变化

vue3 的 `Transition` 类名也有一点变化

|   Vue2    |     | Vue3           |
| :-------: | :-: | -------------- |
| `v-enter` | --> | `v-enter-from` |
| `v-leave` | --> | `v-leave-from` |

## 关于 Watch | watchEffect

Vue3 的侦听器相较于 Vue2 是有很大的变化的，有几种用法。

### watch

-   第一个参数：**数据源**，可以是一个 `ref`、`reactive`、Getter 函数或多个数据源组成的数组：

    ```js
    // 单个 ref
    watch(x, newX => {
        console.log(`x is ${newX}`);
    });

    // getter 函数,函数中的任何值发生改变都会触发
    watch(
        () => x.value + y.value,
        sum => {
            console.log(`sum of x + y is: ${sum}`);
        }
    );

    // 多个来源组成的数组
    watch([x, () => y.value], ([newX, newY]) => {
        console.log(`x is ${newX} and y is ${newY}`);
    });
    ```

-   第二个参数：**回调函数**

    -   回调函数的参数：
        -   若为单个监听源，回调函数的参数为 `callback(newValue,oldValye)`
        -   若为多个监听源，回调函数的参数为 `cakkback(newArray,oldArray)`
            -   `const [newValue,oldValue] = newArray` ， oldArray 同理

-   第三个参数：**配置项**，可以设置是否为深度监听、是否立即执行等

> 注意：

1. 不能**直接侦听响应式对象的属性值**，例如:

    ```js
    const obj = reactive({ count: 0 });
    // 错误，因为 watch() 得到的参数是一个 number 而不是一个响应式代理
    watch(obj.count, count => {
        console.log(`count is: ${count}`);
    });
    ```

    - 需要将其定义为 `getter` 函数的形式

        ```js
        watch(
            () => obj.count,
            count => {
                console.log(`count is: ${count}`);
            }
        );
        ```

2. 直接给 `watch()` 传入一个 `reactive` 响应式对象，会隐式地创建一个深层侦听器——该回调函数在所有嵌套的变更时都会被触发：

### watchEffect

`watch()` 是懒执行的：**仅当数据源变化时，才会执行回调**。但在某些场景中，我们希望在创建侦听器时，立即执行一遍回调。举例来说，我们想请求一些初始数据，然后在相关状态更改时重新请求数据。我们可以这样写：

```js
const url = ref("https://接口地址");
const data = ref(null);

async function fetchData() {
    const response = await fetch(url.value);
    data.value = await response.json();
}

// 立即获取
fetchData();
// ...再侦听 url 变化
watch(url, fetchData);
```

但我们可以用 `watchEffect` 函数来简化上面的代码。

-   `watchEffect()` 会**立即执行一遍**回调函数

-   如果这时函数产生了副作用，Vue 会**自动追踪副作用的依赖关系，自动分析出响应源**。

上面的例子可以重写为：

```js
watchEffect(async () => {
    const response = await fetch(url.value);
    data.value = await response.json();
});
```

这个例子中，回调会立即执行。在执行期间，它会自动追踪 `url.value` 作为依赖（和计算属性的行为类似）。

每当 `url.value` 变化时，回调会再次执行。

### watch VS watchEffect

`watch` 和 `watchEffect` 都能响应式地执行有副作用的回调。它们之间的主要区别是追踪响应式依赖的方式

-   `watch` 只追踪明确侦听的数据源。它不会追踪任何在回调中访问到的东西。另外，仅在数据源确实改变时才会触发回调。`watch` 会避免在发生副作用时追踪依赖，因此，我们能更加精确地控制回调函数的触发时机。

-   `watchEffect`，则会在副作用发生期间追踪依赖。它会在同步执行过程中，自动追踪所有能访问到的响应式属性。这更方便，而且代码往往更简洁，但有时其响应性依赖关系会不那么明确。

-   ##### watchEffect 更像 watch 的升级自动版

### 侦听器回调触发时机

当你更改了响应式状态，它可能会同时触发 Vue 组件更新和侦听器回调。

默认情况下，用户创建的侦听器回调，都会在 Vue 组件更新**之前**被调用。这意味着你在侦听器回调中访问的 DOM 将是被 Vue 更新之前的状态。

如果想在侦听器回调中能访问被 Vue 更新**之后**的 DOM，需要指明 `flush: 'post'` 选项：

```js
watch(source, callback, {
    flush: "post",
});

watchEffect(callback, {
    flush: "post",
});
```

后置刷新的 `watchEffect()` 有个更方便的别名 `watchPostEffect()`：

```js
import { watchPostEffect } from "vue";

watchPostEffect(() => {
    /* 在 Vue 更新后执行 */
});
```

### 删除侦听器

在 `setup()` 或 `<script setup>` 中定义的侦听器大多数情况下不用关心它会在何时销毁，因为它会自动绑定到宿主组件实例上，并且会在宿主组件卸载时自动停止。

但如果使用异步语句创建一个侦听器，那么它不会绑定到当前组件上，你必须手动删除它，以防内存泄漏。

```html
<script setup>
    import { watchEffect } from "vue";

    // 它会自动停止
    watchEffect(() => {});

    // ...这个则不会！
    setTimeout(() => {
        watchEffect(() => {});
    }, 100);
</script>
```

要手动停止一个侦听器，需要调用 `watch` 或 `watchEffect` 返回的函数：

```js
const unwatch = watchEffect(() => {});

// ...当该侦听器不再需要时
unwatch();
```

注意，需要异步创建侦听器的情况很少，请尽可能选择同步创建。如果需要等待一些异步数据，你可以使用条件式的侦听逻辑：

```js
// 需要异步请求得到的数据
const data = ref(null);

watchEffect(() => {
    if (data.value) {
        // 数据加载后执行某些操作...
    }
});
```

## vue-router

Vue3 的路由用法也与之前也有差别

1. 下载 `vue-roter`

    ```bash
    yarn add vue-router@laster | npm install vue-router@laster
    ```

2. 创建 `router` 文件夹，并创建 `index.ts | index.js ` 文件

    `createWebHashHistory` ：设置模式为 `history`，即带 `#` 的路径

    ```ts
    import { createRouter, createWebHashHistory } from "vue-router";
    import routes from "./routes";
    export default createRouter({
        history: createWebHashHistory(),
        routes,
    });
    ```

3. 创建 `routes.ts | routes.js` 路由文件

    `RouteRecordRaw` ：路由类型

    ```ts
    import type { RouteRecordRaw } from "vue-router";

    const routes: RouteRecordRaw[] = [
        {
            name: "xxx",
            path: "xxx",
            component: () => import("../xxx/xxx.vue"),
        },
    ];

    export default routes;
    ```

4. 最后在 `Main.ts | Main.js ` 中注册 `router/index` 文件

    ```ts
    import { createApp } from "vue";
    import App from "./App.vue";
    import router from "./router/index";
    const root = createApp(App);
    root.use(router); // 必须在挂载前注册路由文件
    root.mount("#app");
    ```

##### 为路由切换添加过渡效果

```vue
<router-view #default="{ Component }">
    <transition name="fade" mode="out-in" appear>
        <component :is="Component" />
    </transition>
</router-view>
<style scoped>
.fade-enter-from,
.fade-leave-to {
    opacity: 0;
    transform: translateY(-20px) scale(0.9);
}

.fade-enter-active,
.fade-leave-active {
    transition: all 0.5s cubic-bezier(0.52, -0.22, 0.29, 1.92);
}
</style>
```

> 效果

![01](https://sbr-1314368469.cos.ap-guangzhou.myqcloud.com/Images/202301121343540.gif)
