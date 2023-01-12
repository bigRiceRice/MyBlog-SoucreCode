---
title: 【Vue2】配置项 - 特性大总结
author: BigRice
date: 2021-12-20
location: 云梦泽
summary: 此文档整理了 Vue2 中的配置项与特性
tags:
  - Vue2
---

## 配置对象属性

| 配置对象属性 | 对象属性用途                                                |
| ------------ | ----------------------------------------------------------- |
| `el`         | 声明 Vue 监管的元素                                         |
| `data`       | 声明 Vue 监管的数据                                         |
| `methods`    | 声明 Vue 监管的事件函数                                     |
| `computed`   | 声明 data 中由计算得来的属性，需要返回值 (拥有**缓存机制**) |
| `watch`      | 声明侦听器 (监视属性的变化)                                 |
| `filters`    | 声明过滤器 (一些简单逻辑的处理)                             |
| `directives` | 自定义指令                                                  |
| `render`     | 值是函数，用于在精简版的 `Vue.js` 中充当模板编译器          |
| `components` | 注册组件                                                    |
| `props`      | 接收数据 (子父组件传递数据)                                 |
| `mixins`     | 混合 JS 文件                                                |
| `store`      | 将 Vuex 核心 store 加载到 vm 实例上                         |
| `router`     | 配置路由器                                                  |

## 生命周期

| 生命周期钩子      | 钩子触发场景                                                                   |
| ----------------- | ------------------------------------------------------------------------------ |
| `beforecreate()`  | 创建**数据代理** \| **监视**完成前 (getter/setter)                             |
| `created()`       | **数据代理** \| **监视**创建完毕                                               |
| ----------        | ----------                                                                     |
| `beforeMount()`   | 将要挂载前                                                                     |
| `mounted()`       | 挂载完毕后，发送 ajax 请求、启动定时器、绑定自定义事件、订阅消息【初始化工作】 |
| ----------        | ----------                                                                     |
| `beforeUpdate()`  | 模板重新渲染前 (此时数据已经更改，但未渲染到页面)                              |
| `updated()`       | 模板渲染完毕                                                                   |
| ----------        | ----------                                                                     |
| `beforeDestroy()` | 实例销毁前，清除定时器、解绑自定义事件、取消订阅消息等【收尾工作】             |
| `destroyed()`     | 实例销毁完毕                                                                   |
| **路由组件钩子**  |                                                                                |
| `activated`       | 当路由组件激活时（展示）                                                       |
| `deavtivated`     | 当路由组件失活时（消失）                                                       |
| **方法钩子**      |                                                                                |
| `$nextTick`       | 在定义后的下一次 DOM 更新结束时执行内部回调函数                                |

关于销毁 Vue 实例：

-   销毁后借助 Vue 开发者工具将看不到任何信息

-   销毁后自定义事件会失效。但原生 DOM 事件依然有效

-   一般不会在 `beforeDestroy()` 操作数据、因为即使操作数据、也无法触发更新的渲染流程了

## 监管元素 ( _el_ )

1. 使用配置对象式监管元素

    ```js
    const vm = new Vue({
        el: "box",
    });
    ```

2. 创建 vue 实例对象后通过 `$mount('seleor')`指定 _el_ 的值

    ```js
    vm.$mount("test");
    ```

## 声明数据 ( _data_ )

1. 使用配置属性式声明数据

    ```js
    new Vue({
        data: {
            name: "张三",
        },
    });
    ```

2. 使用对象返回值式声明属性 ( 脚手架形式 )

    ```js
    new Vue({
        el: "#wrap",
        data() {
            return {
                name: "Hello",
            };
        },
    });
    ```

## 声明方法 ( _method_ )

1. 使用属性式声明方法

    ```js
    new Vue({
        el: "#box",
        methods: {
            helloWorld: function () {
                alert("你好");
            },
            helloWorld2: function (a, b) {
                console.log(a, b);
            },
        },
    });
    ```

2. 使用函数时简洁声明

    ```js
    new Vue({
        el: "#box",
        methods: {
            helloWorld() {
                alert("你好");
            },
            helloWorld2(a, b) {
                console.log(a, b);
            },
        },
    });
    ```

3. 指令绑定方法

    ```html
    <button v-on:click="helloWorld">点我(不传参)</button>
    <button @click="show1($event,66)">点我(传参)</button>
    ```

    - _$event_ 为指定形参，且只能写在第一位

## 计算属性 ( _computed_ )

通过已有的数据计算得出的计算数据

> 底层借助了 ES6 定义的数据代理方法提供的 getter 和 setter

```javascript
new Vue({
    el: "#wrap"，
    data: {
        name1: "王"，
        name2: "三"
    }，
    computed: {
		// 请注意 fullname 是一个属性，它的值通过 getter 的返回值得到
        fullname:{
            get(){
                return this.name1 +"-"+ this.name2
            }，
            set(value) {//this为vm
                const arr = value.split("-")
                this.name1 = arr[0]
                this.name2 = arr[1]
            }
        }，
        // 简写语法
        fullname(){
            return this.name1 +"-"+ this.name2
        }
    }
})
```

> _computed_ 能做到的 *methods*也能做到，那么他的优势是什么呢?
>
> 答案是**缓存机制**，fullname 会在初次调用时执行代码，随后会将其存放到缓存当中，那么其他处调用 fullname 时就不会重复执行代码，fullname 会在依赖属性产生变化时更新代码。

## 侦听器 ( _watch_ )

设置一个侦听器，当被监视的属性发生变化时，回调函数自动调用

> 注意：监视的属性必须存在，才能进行监视 `handler(newValue,oldValue)`函数为**指定函数**，语法如下：

### 实例内语法：更加全面

```javascript
var vm = new Vue({
    el: "#wrap"，
    data: {
        ishot: true
    }，
    watch: {//watch 配置项监视属性的变化
        ishot:{//要监视的属性
            immediate: true，//watch 内置配置项:此函数直接调用一次
            handler(newV，oldV){//当ishot变化时此函数会调用，他具有两个参数，newvalue与oldvalue
                console.log('ishot被修改了，新值为:'+newV+"-旧值为:"+oldV);
            }
        }

    }
})
```

> Vue 本身支持深度监视，但 watch 默认不支持深度监视，如果需要开启则需要配置项 `deep=true`

### 简写语法：无法设置配置项

```javascript
watch: {
    ishot(newV， oldV) {
        console.log('ishot被修改了，新值为:' + newV + "-旧值为:" + oldV);
    }
}
```

### 外部实例方法式语法

```javascript
vm.$watch('ishot'， function (n， o) {
    console.log("简写语法下被修改了，新值为:" + n + "-旧值为:" + o);
})
```

## _watch_ PK _computed_

computed 能完成的工作，watch 一定能完成，watch 能完成的工作，computed 不一定能完成

watch 可以进行异步操作，computed 是依靠返回值(结果)工作的，而 watch 是函数工作的

> 例如：我想要文本慢 0.5s 显示更新，computed 是依靠返回值瞬间工作的，不可能做到异步工作

```javascript
watch: {
    name1(n， o) {
        setTimeout(() => {
            this.fullname = n + "-" + this.name2
        }， 500)
    }
}
```

## ~~过滤器 ( _filters_ )~~

> Vue3 中过滤器已被砍掉，因为使用场景太少了

要显示的数据进行特定格式化后再显示 (适用于一些简单逻辑的处理)

例如：我想要将当前时间戳自动格式化

1. 注册局部过滤器：须带返回值

```javascript
// dayjs 为时间库，拥有可以快速获取当前时间 API
<script src="https://cdn.bootcdn.net/ajax/libs/dayjs/1.10.6/dayjs.min.js"></script>
new Vue({
    filters: {//局部过滤器
        timeFormater(value，str='YYYY年MM月DD日-HH:mm:ss'){
            return dayjs(value).format(str)
        }，
        mySlice(value){
            return value.slice(0，5)
        }
    }
})
```

2. 使用过滤器的语法
    - 属性 | 方法名 | 方法名 (**支持链式调用**)
    - 过滤器方法的第一个形参会由调用这个方法的属性代替

```html
<!-- 属性|方法名(默认传入|前的属性，自定义参数) -->
<h2>过滤器格式化：{{now | timeFormater('YYYY年MM月DD日')}}</h2>
<h2>过滤器链式调用：{{now | timeFormater('YYYY年MM月DD日') | mySlice}}</h2>
```

3. 还可以定义全局的过滤器供不同的 vm 使用
    - `Vue.filter(filterName，callback())`
    - 全局过滤器定义需要先于 Vue 实例的创建

```javascript
Vue.filter('testFil'，function (value，str) {
    return str.slice(0，6)
})
```

## 自定义指令 ( _directives_ )

1. 使用 _directives_ 配置项自定义指令

    ```js
    export default {
        directives: {
            myDiy: {
                bind(element, binding) {
                    // 一些操作......
                },
                inserted(element, binding) {
                    // 一些操作......
                },
                update(element, binding) {
                    // 一些操作......
                },
            },
        },
    };
    ```

2. 指令函数的形参 `(element,binding)`

    - _element_ ：即绑定了此指令的标签体
    - _binding_ ：即绑定了此指令的属性详情

3. 指令函数的三个钩子

    - `bind(element,binding)`：指定元素绑定指令时自调用(一开始)
    - `inserted(element,binding)`：指定元素被解析插入到页面时自调用
    - `update(element,binding)`：每次模板更新时自调用

4. 指令属性的简写形式：仅会在一开始绑定时调用与模板更新时自调用（省略了插入时的自调用）

    ```js
    export default {
        directives: {
            myDiy(element, binding) {
                // 一些操作......
            },
        },
    };
    ```

5. 全局指令函数：简写形式`Vue.directives('name',()=>)`

6. 相关实例：定义一个 `v-focus` 指令,它可以使被绑定的元素默认获取焦点

    ```html
    <input v-focus:value="100" type="text" />
    ```

    ```js
    export default {
        directives: {
            focus: {
                bind(element, binding) {},
                inserted(element, binding) {
                    element.focus();
                },
                update(element, binding) {
                    element.focus();
                },
            },
        },
    };
    ```

## 模板编译器 ( _render_ )

首先我们要知道一个大前提，在 `import Vue from 'vue'` 中

-   Vue-cli 中 _main.js_ 入口文件中默认导入的 Vue 为**精简（阉割）版**
-   此版本精简掉了 Vue 中的模板编译器，此时填写在 vm 实例中的 `<template>` 浏览器是无法解析的

两个解决办法

1. 引入核心完整版的 _vue.js_

    ```js
    // 修改为核心Vue.js
    import Vue from "vue/dist/vue.js";
    ```

2. 使用模板编译器

    - 此函数由 Vue 自调用且必须有返回值，用于在精简版的 Vue 实例对象里充当模板渲染器

    - 他的形参是一个函数,里面须定义对应的模板【字符串就渲染 html 代码】/【组件就渲染组件中的模板】

        ```js
        //1.使用 render 渲染 HTML 代码
        render: function (creareElement){
            return creareElement('h1','你好啊Vue')
        }
        //2.使用 render 渲染组件的模板
        render: creareElement => creareElement(app)
        ```

## 注册组件 ( _components_ )

1. 新建子组件 `son.vue`

    ```vue
    <template>
        <div class="containeer"></div>
    </template>
    <script>
    export default {
        name: "Categroy",
        data() {
            return {
                sumNumber: 1,
            };
        },
    };
    </script>
    <style></style>
    ```

2. 导入子组件 `import son from 'son.vue'`

3. 将子组件载入父组件

    ```vue
    <script>
    import son from "son.vue";
    export default {
        name: "Appliaction",
        components: {
            son,
        },
    };
    </script>
    ```

## 接收数据 （ _props_ ）

接收从组件外部传入的数据

-   Props 可以接收父组件传递的静态属性与动态属性，例如：`title='xxx'` `:name='张三'`

具体的使用步骤

1. 由外部组件传递数据

    ```html
    <template>
        <Student name="诸葛亮" :age="88"></Student>
        <hr />
        <Student name="黄月英" :age="68"></Student>
    </template>
    ```

2. 子组件接收数据

    - 第一种接收形式：简单的声明接收

        ```js
        export default {
            name: "Student",
            props: ["name", "age"],
        };
        ```

    - 第二种接收形式：限制类型接收

        ```js
        export default {
            name: "Student",
            props: {
                name: String,
                age: Number,
            },
        };
        ```

    - 第三种接收形式：严格的限制接收

        ```js
        export default {
            name: "Student",
            props: {
                name: {
                    // 接收的数据名
                    type: String, // 类型必须是String
                    required: true, // 此参数必须被接收
                    default: "goodWin", // 设置初始值
                },
            },
        };
        ```

    - 注意：_required_ 与 _default_ 配置项通常不会出现在同一个限制内

3. 通过插值语法使用数据：

    ```html
    <template>
        <h2>学生名:{{ name }}</h2>
        <h2>年龄:{{ age }}</h2>
    </template>
    ```

##### 注意

-   `props` 接收的数据是**只读**的，且优先级高于 `data` 数据，同时定义会优先读取 `props` 参数

-   修改 `props` 接收的数据将报错，若业务需求需要更改，请参考如下方法：后续只修改 ` studentName` 即可

    ```html
    <template>
        <h2>学生名:{{ studentName }}</h2>
        <h2>年龄:{{ age }}</h2>
    </template>
    ```

    ```js
    export default {
        data () {
            console.log(this);
            return {
                studentName = this._props.name,
                age:18
            }
        },
        //简单的声明接收
        props: ["name", "age"],
    };
    ```

> _Prop_ 的大小写问题：
>
> HTML 中的 _attribute_ 名是大小写不敏感的，所以浏览器会把所有大写字符解释为小写字符，若 `props` 中的数据为 _camelCase_ (驼峰命名法) 时，使用时需要**写成等价的 _kebab-case_** (短横线分隔命名)

## ~~混合对象 ( _mixin_ )~~

> Vue3 已不再推荐 Minin 而是使用 Hooks 取代

当遇到不同的组件使用的某个功能重复时,可将此功能提取出来用一个 JS 文件存储

> 注意：_mixin_ 是一个 Vue 风格的对象

1. 创建一个 JS 文件用作定义 _mixin_ 对象

    ```js
    const mixins = {
        data() {
            return {
                x: 100,
                y: "Test",
            };
        },
        methods: {
            showMe() {
                console.log(this.name);
            },
        },
        mounted() {
            console.log("挂载完毕");
        },
    };
    export { mixins };
    ```

2. 组件中导入 _mixin_ 对象文件

    ```js
    import { myMixins } from "../mixins";
    ```

3. 组件中使用 _mixin_ 对象

    ```js
    export default {
        mixins: [myMmixins],
    };
    ```

4. 注意点：

    - 每个使用了 _mixin_ 对象的组件都会多出相应的 **方法与数据**
    - 如果组件与 _mixin_ 对象中都定义了钩子函数，因为其特殊性不会被替换掉而是全部依次执行
    - 如果组件与 _mixin_ 对象的 _data_ 中存在相同数据，会使用自身的数据
    - 若想将 _mixin_ 对象存入 Vue 实例对象中，可以调用 `Vue.mixin(mixinName)` 静态方法来事件
