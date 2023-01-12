---
title: 【Vue2】工程化总结
author: BigRice
date: 2021-12-20
location: 云梦泽
summary: 此文档为看完张天禹老师的视频后整理的笔记，浅尝辄止，更加推荐看官方文档
tags:
   - Vue2
---



## 如何创建工程化项目？

在以前我们可以使用 `@vue/cli` 来创建项目，但 `webpack` 热重载实在过于拉跨，所以以下使用 *[vite](https://vitejs.cn/vite3-cn/)* 创建项目

> 工程化项目的前提需要安装 *[Node.js](https://nodejs.org/zh-cn/)*，使用其 `npm` 进行拉取包

1. 使用 *vite* 创建项目

    ```bash
    yarn create vite
    npm create vite
    ```

    <img src="https://sbr-1314368469.cos.ap-guangzhou.myqcloud.com/Images/202301091107048.png" alt="image-20230109110716937" style="zoom:80%" />

    <img src="https://sbr-1314368469.cos.ap-guangzhou.myqcloud.com/Images/202301091109605.png" alt="image-20230109110902484" style="zoom:80%" />

2. 创建好后会自动创建一个文件夹，进入项目后下载依赖即可启动

    1. `cd [Project-Name]` 进入目录
    2. `yarn` 下载依赖
    3. `yarn dev` 开启项目

#### Vite 工程目录树

```bash
|-node_modules      	-- 项目依赖包的目录
|-public            	-- 项目静态文件目录
  |--favicon.ico    	-- 网站地址栏前面的小图标
|-src               	-- 源文件目录，程序员主要工作的地方
  |-assets          	-- 静态文件目录，图片图标，比如网站 logo
  |-components      	-- 自定义组件目录
  |-- App.vue        	-- 项目的根组件
  |-- style.css      	-- 一般项目的通用CSS样式写在这里，main.js引入
  |-- main.js        	-- 项目入口文件，SPA单页应用都需要入口文件
|-.gitignore            -- 用来配置那些文件不归git管理
|-index.html            -- 项目的默认首页，Vue的组件需要挂载到这个文件上
|-package-lock.json     -- 项目包的锁定文件，用于防止包版本不一样导致的错误
|-package.json    	    -- 描述此 NPM 包的所有相关信息，包括作者、简介、包依赖、构建等信息
|-README.md  			-- 项目的说明文件，使用markdown语法进行编写
|-vite.config.js     	-- 配置 vite 
|-vue.config.json       -- Vue 项目的一些默认配置 (可修改默认设置)
```





## 组件

> ​	在 Vue-Cli 中，组件更多的作用是将页面**模块化**，即：一个组件负责一个区域的显示

于  *Src* 文件夹下的 *components* 文件夹中创建组件 ( 后缀为 `vue` 的文件 )

```vue
<template>
  <div>
    <!-- HTML 结构 -->
  </div>
</template>

<script>
export default {
  // Vue 设置
  name:'i am Componets'
}
</script>

<style>
  /* CSS 设置 */
</style>
```

*app.vue* 导入并载入子组件

```html
<script>
    // 导入子组件
    import component from "./components/component";
    export default {
        name: "Appliaction",
        components: {
            // 载入子组件
            component,
        }
    };
</script>
```

> 注意：

- 所有的子组件都由头部组件 *app.vue* 管理
- 若组件名称为 *camelCase* (驼峰命名法) 时，使用时需要**写成等价的 *kebab-case*** (短横线分隔命名) 











### *Ref*  

Ref 属性用于向元素或组件注册信息 ( 类似 ID )

1. 为一个元素或组件使用 `ref` 属性

    ```html
    <img src="./assets/logo.png" alt="logo" ref="img">
    <h1 ref="h1">文本文本</h1>
    <School ref="scl"></School>
    ```

2. `ref` 属性值将会以对象的形式存入当前组件中的 *$refs* 属性当中

    <img src="https://sbr-1314368469.cos.ap-guangzhou.myqcloud.com/Images/202301091049488.png" alt="image-20211109093737882" style="width:33%;" />

3. 为元素与组件使用 `ref` 属性的不同

    - 为组件使用：得到的将是此组件的实例对象

    - 为元素使用：得到的将是此标签体 HTML 结构

        ```javascript
        console.log(this.$refs.img);
        console.log(this.$refs.h1);
        console.log(this.$refs.scl);
        ```

        <img src="https://sbr-1314368469.cos.ap-guangzhou.myqcloud.com/Images/202301091049500.png" alt="image-20211109094057907" style="width:50%;" />











### *Scoped* 

> 当我们对两个子组件使用了相同的样式时，会造成命名冲突！

- `scoped` 修饰符可以解决这个问题

    - 语法： `<styce scoped>` 

    - 作用：让样式只在局部生效，防止命名冲突

    - 原理：Vue 内部对此组件中的标签生产唯一值类名，于内部完成不同的

        ```html
        <style scoped> </style>
        ```













###   *Pulgin* 

全局插件（ *pulgin* ）：可以理解为**自定义的第三方库**

Vue 中插件的本质是由对象组成的 JS 文件，插件能获得一个重要的参数：Vue 构造函数

Pulgin 插件中融合了 自定义指令 / 自定义事件 / 全局过滤器 / 方法

- 一个重要的方法 `install(Vue)`

1. 创建一个 JS 文件，用作插件的定义

    ```js
    // 这是一个插件文件,它必须调用 install【安装】方法
    export default {
        install(Vue) {
            Vue.filter('mySlice', function (value) {
                return value.slice(0, 4)
            })
    
            Vue.directive('Focus', {
                bind(element, binding) {
                    if(element.value)element.value = binding.value
    
                },
                inserted(element, binding) {
                    if(element.value)element.value = binding.value
                    element.focus()
                },
                update(element, binding) {
                    if(element.value)element.value = binding.value
                }
            });
    
            console.log('插件库加载完毕');
        }
    }
    ```

2. `main.js` 入口文件中引入 + 使用（先于 vm 实例对象）

    ```js
    //引入插件库
    import pulgin from './pulgin'
    //安装插件库
    Vue.use(pulgin)
    ```

3. 使用插件定义的过滤器+指令

    ```html
    <h2>学生名:{{ name | mySlice}}</h2>
    <input type="text" v-Focus>
    ```

    



























### *$NextTick* 

​	`Vue.$nextTick(callback)`：在定义后的下一次 DOM 更新结束时执行内部回调函数（延迟调用）

- 作用：在项目中根据在更新后 DOM 的元素做些新的显示效果时（给予焦点）
- 必要性：用于解决某些显示问题
- **这是一个生命周期函数（钩子）**























## 组件间通信 



### 		Props 与 自定义事件

​	目前 (2021 / 11 / 12)  能实现子父组件通信的有两种方式

- Props 传递函数回调
- 自定义事件



### 一 *Prop* 

> 实现原理：父组件声明一个回调函数，通过 `v-bind:` / `:` 传入子组件，子组件 *Props* 接收函数，**依靠函数回调特性**实现通信

#### 		父组件中定义

1. 创建函数

    ```js
    methods: {
        getSchoolName(name) {
            console.log("我是APP.vue:我收到了来自Scool组件的【" + name + "】");
        }
    },
    ```

2. 将函数传入子组件

    ```html
    <School :getSchoolName="getSchoolName" />
    ```

    

#### 子组件中定义

1. 子组件 *Props* 配置项接收函数

    ```js
    props: ["getSchoolName"]
    ```

2. 子组件调用函数将数据传递回父组件，分两种方式

    1. 直接在指令模板中使用回调函数，无需添加 *this*

        ```html
        <button @click="getSchoolName(name)">向父组件传递学校名字</button>
        ```

    2. 点击事件函数中执行回调函数，需要添加 *this*

        ```html
        <button @click="sendSchoolName">向父组件传递学校名字</button>
        ```

        ```javascript
        methods: {	
            sendSchoolName(){
                //执行回调函数
                this.getSchoolName(this.name)
            }
        }
        ```






------



### 二 自定义事件

实现原理：父组件中创建一个回调函数，通过  `@自定义事件名="函数名" ` 为子组件实例对象绑定事件，子组件在合适的时机触发此事件实现通信

#### 	父组件中定义

1. 创建函数

    ```js
    methods: {
        getStudentName(name) {
            console.log("我是APP.vue:我收到了来自Student组件的【" + name + "】");
        },
    }
    ```

2. 通过事件绑定将函数传入子组件

    ```html
    <Student @LTL="getStudentName" />
    ```



#### 	子组件中定义

调用 `$emit(evnetName,data)` 方法触发函数

- *eventName* ：需要触发的事件名
- *data* ：需要传递的数据

1. 子组件触发事件回调将数据传递回父组件，分两种方式

    1. 直接在指令模板中触发事件函数，无需添加 *this*

        ```html
        //$emit("事件名",(事件参数列表)) 触发事件的方法
        <button @click="$emit('LTL',(name))">向父组件传递学生名字</button>
        ```

    2. 点击事件函数体中触发事件函数，需要添加 *this*

        ```html
        <button @click="sendStudentName">点我向父组件传递学生名字</button>
        ```

        ```javascript
        methods: {
        sendStudentName(){
          this.$emit("liutianle",(this.name))
        }
        ```

    3. 注意

        - 在为**组件标签**绑定事件时，即使本身是原生事件，Vue 也会认为是一个自定义事件，所以需要添加 `native` 修饰符表示为原生事件

        - 调用 `$off()` 方法即可解绑自定义事件

            ```js
            <!--解绑单个自定义事件-->
            <button @click="$off('LTL')">解绑单个自定义事件</button>
            <!--解绑多个自定义事件-->
            <button @click="$off(['LTL','Test'])">解绑多个自定义事件</button>
            <!--解绑所有自定义事件-->
            <button @click="$off()">解绑所有自定义事件</button>
            ```





#### 	自定义事件扩展

使用 `mouted` 钩子与 `ref` 属性相结合，可以更加灵活的添加自定义事件（延时添加）

1. 创建函数 略过

2. 为子组件添加 `ref` 函数

    ```html
    <Student ref="Student" />
    ```

3. 创建挂载钩子函数，将延时绑定自定义事件

    ```js
    mounted() {
    setTimeout(() => {
    //获取到$refs中的实例对象 接着想怎么玩就怎么玩
    this.$refs.Student.$on("LTL", this.getStudentName);
    }, 3000);
    },
    ```

4. 子组件触发事件回调 略过





### 	三 全局事件总线

全局事件总线（GlobalEventBus）：一种组件中通信的方式，用于任意组件的通信

原理：于 Vue 实例对象的原型空间上创建一个属性，将 Vue 的 *this* 作为此属性的属性值，那么这个属性就拥有了自定义事件相关 API ，且所有 vc / vm 都可见

1. 安装全局事件总线，一般定义为 `$bus`

    ```js
    new Vue({
        el: '#app',
        render: h => h(App),
        beforeCreate(){
            //创建全局事件总线,使每一个组件都能看得到并且具备自定义事件的方法 ($on/$off/$emit)
            this.__proto__.$bus = this
            //或者
            Vue.prototype.$bus = this
        }
    })
    ```

2. 使用事件总线

    - 接收数据的组件获取 `$bus` 并绑定自定义事件名与回调函数

        ```js
        methods: {
         getStudent(info) {
             console.log("我是School组件，我收到了信息【", info, "】");
         },
        },
        mounted() {
         this.$bus.$on("Test", this.getStudent);
        }
        ```

    - 发送数据的组件获取 `$bus` 并触发自定义事件

        ```js
        	<button @click="$bus.$emit('Test',([123,456]))">向School组件传递学生名字</button>
        ```

3. 注意

    - 最好定义 ``beforeDestroy()`` 钩子，于销毁前解绑当前组件定义的自定义事件，防止变量冲突

        ```js
        beforeDestroy(){
         this.$bus.$off("Test")
        }
        ```





#### 	四 插件实现通信

消息订阅 / 发布（*Publish* / *Subscribe*）：第三方库实现组件间通信（插件）

1. 准备工作：项目中安装 `pubsub` 库至项目中

    ```bash
    npm i pubsub-js
    ```

    - 组件中引入 `pubsub` 库  `import pubsub from "pubsub-js"`

2. `pubsub` 库主要的 API

    - `pubsub.subscribe(eventName,callback)`：订阅数据，为数据接收方调用，类似 `$on()`
        - 此方法的返回值为 *number* 类型的值，这个值是取消订阅数据的依据
        - 此方法中的回调函数的第一个形参为数据名，没啥用，想要接受到数据得使用第二个形参
        - 使用语法 `pubsub.subscribe(e,(_,data)=>{})`
    - `pubsub.pubsub(eventName,data)`：发布数据，为数据发送方调用，类似 `$emit`
    - `pubsub.unSubscribe(id)` ：取消订阅，需要提前将订阅数据的返回值保存

3. `pubsub` 库使用案例

    - 订阅数据，数据接收方定义如下

        ```js
        export default{
            methods(){
                //_为占位符，因为pubsub定义了第一个形参为订阅的数据名，而这个东西没啥用
                getData(_,data){
                    consloe.log("我是xxx组件,我收到了数据",data)
                }
            },
            mounted(){
                this.pubId = pubsub.subscribe("Test",this.getData)
            },
            beforeDestroy(){
                //取消订阅，根据一个number值来指定，类似取消定时器
                pubsub.unSubscribe(this.pubId)
            }
        }
        ```

    - 发布数据，数据发布方定义如下

        ```html
        <button @click="sendData">点我发送数据</button>
        ```

        ```js
        export default{
            metods(){
                sendData(){
                    //发布数据，类似执行自定义事件
                    pubsub.publish("Test",[456,789])
                }
            }
        }
        ```

        





## 动画效果

Vue 使用 `<transtion>` 标签体包裹内容声明元素的显示 / 消失（`v-show`）将由动画效果接管（如果有）

原理：在插入、更新或溢出 DOM 元素时、于合适的时机给元素添加类名

<img src="https://sbr-1314368469.cos.ap-guangzhou.myqcloud.com/Images/202301091049837.png" alt="image-20211124204504937" style="zoom:80%" />



### 	内部原理 / 语法

`<transtrion>` 标签的解读与属性

1. 当为元素包裹 ` <transtrion>` 标签后，标签体内的元素在 `v-show` 显示 / 消失时都会寻找默认的类名样式触发动画效果
2. 为 `<transtrion>` 标签配置属性
    - 配置 `name` 属性，那么动画效果就会寻找与 *name* 对应的类名样式
    - 配置 `apper=true` / `apper` 属性声明在元素在首次插入时也会播放对应的动画效果（显示）
3. `<transtrion>` 需要配置的类名样式：
    1. 元素显示的样式（默认为 `v-` 开头）
        - `v-enter`：显示的起点
        - `v-enter-active`：显示过程中
        - `v-enter-to`：显示的终点
    2. 元素消失的样式（默认为 `v-` 开头）
        - `v-leave`：消失的起点 
        - `v-leave-active`：消失过程中 
        - `v-leave-to`：消失的终点 
4. 若有多个元素需要动画效果
    - 需要使用 `<transtion-group>` 标签，并为内部属性配置 `key` 值（唯一的）






### 	使用案例

1. 定义一段元素显示与消失的动画效果（ *CSS3* ）

    ```css
    /* v(默认类名)，enter(进入),active(激活)*/
    .v-enter-active {
        /*调用 Show 动画*/
        animation: Show 1s ease-out;
    }
    /* v(默认类名)，leave(离开),active(激活)*/
    .v-leave-active {
        /*调用 Show 动画并反转（消失）*/
        animation: Show 1s ease-in reverse;
    }
    
    /* 定义动画*/
    @keyframes Show {
        from {
            transform: translateX(-100%);
        }
        to {
            transform: translateX(0px);
        }
    }
    ```

2. 使用 `<transition>` 标签包裹声明元素播放动画效果，需要 `v-show` 指令辅助

    ```html
    <div>
        <button @click="isShow = !isShow">显示/隐藏</button>
        <!-- apper=true为默认执行一次开始动画 -->
        <transition appear> 
            <h1 v-show="isShow">HelloWorld</h1>
        </transition>
    </div>
    ```

3. 效果

    ![](D:/Desktop/%E7%AC%94%E8%AE%B0/%E5%9B%BE%E7%89%87%E6%88%96%E8%A7%86%E9%A2%91/%E5%8A%A8%E7%94%BB%E6%95%88%E6%9E%9C.gif)

4. 注意事项

    - 若 <transition>标签声明了 `name` 属性，那么``CSS``中所定义的类名样式开头将要对应``name``值，如下

    - ```html
        <transition name="Tx"></transition >
        ```

    - ```css
        .Tx-enter-active {
            animation: Show 1s ease-out;
        }
        .Tx-leave-active {
            animation: Show 1s ease-in reverse;
        }
        ```





### Animate 动画库

> ​	Animate 是一个可以快速创建动画效果的第三方库。[Animate官网](https://animate.style/)

1. 安装载入此库

    ```bash
    $ npm install animate.css --save
    ```

    ```js
    import 'animate.css';
    ```

2. 前往官网复制类名样式

3. 将类名样式配置给 ``<transform>`` 标签的 `class` 属性使用

    ```html
    <transform class="animate__animated animate__bounce" appear>
        <h1>
            An animated element
        </h1>
    </transform>
    ```

    











## 代理

目前 (2021 / 12 / 29) 遇到跨域问题常见的解决方法有：

| 名称         | 描述                                                    |
| ------------ | ------------------------------------------------------- |
| CORS         | 后端人员设置返回固定请求头放行通过同源                  |
| JSONP        | 通过`script:src` 属性的跨域性特点实现 `get` 请求的跨域  |
| **配置代理** | 通过代理服务器解决跨域 (服务器之间传输数据不受同源影响) |



### 代理服务器语法

​	注意：代理服务器的添加都是在项目的配置文件  *vue-config.js*  中进行的

- 配置项：`deserver{}` 声明开启代理服务器

- 属性 / 语法：`proxy:'url'` / `proxy:{配置属性}`

    - `url`：代理服务其访问目标的端口号 http://localhost:8080 ，资源路径由 AJAX 请求填写

    - `配置属性`：一种更加灵活且多个服务器的使用方法

        | 配置属性       | 用途描述                                                   |
        | -------------- | ---------------------------------------------------------- |
        | `arget`        | 代理服务器访问的目标端口 (**无需资源路径**)                |
        | `ws`           | 用于支持wensocket，默认为 ``true``                         |
        | `changeOrigin` | 用于修改请求头的 `host` 值，默认为 `true`                  |
        | `pathRewrite`  | 用于重写 `url` 搭配前缀方式使用 (**将前缀替换成空字符串**) |

​	





使用前首先要了解 Vue 中代理服务器的工作机制

当 AJAX 请求访问本地服务器端口号时会触发代理服务器，代理将这次请求转发给指定路径来获取资源，随后由代理将数据响应

<img src="https://sbr-1314368469.cos.ap-guangzhou.myqcloud.com/Images/202301091049886.png" alt="image-20211222202154955" style="width: 75%; zoom: 50%;" />







### 	配置代理服务器

配置代理服务器的两种方式：

1. 使用 `url` 配置一个默认代理服务器

    - *vue-config.js* 中配置默认代理服务器

        ```js
        module.exports = {
            lintOnSave: false, // eslint-loader 是否在保存的时候检查语法
            devServer:{
                proxy:'http://localhost:7000'
            }
        }
        ```

    - 页面中使用代理服务器

        ```js
        getStudent() {
            axios.get("http://localhost:8080/student").then(
                (v) => {
                    console.log("请求成功了",v.data);
                },
                (reason) => {
                    console.log("请求失败了", reason);
                }
            );
        }
        ```

        

2. 使用配置对象开启多个代理服务器（更加灵活）

    - *vue-config.js* 中配置多个代理服务器（ **配置对象** ）

        ```js
        devServer: {
                proxy: {
                    'stu': { // 当请求路径出现以它那么就进行代理
                        target: 'http://localhost:7000',// 代理服务器的目标地址
                        ws: true, // 用于支持wensocket,默认为 true
                        changeOrigin: true, // 用于控制请求头值，默认为 true
                        pathRewrite: { '^/sty': '' } // 将匹配路径替换为空字符串 
                    },
                    'tea': { // 开启代理服务器的前缀
                        target: 'http://localhost:7000', // 代理服务器的目标地址
                        ws: true, // 用于支持wensocket,默认为 true
                        changeOrigin: true, // 用于控制请求头值，默认为 true
                        pathRewrite: { '^/tea': '' } // 将匹配路径替换为空字符串 
                    }
                }
        }
        ```

    - 页面中使用代理服务器，需要在端口号后紧跟匹配路径触发来代理服务器

        ```js
        getTeacher() {
            axios.get("http://localhost:8080/tea/teacher").then(
                (v) => {
                    console.log(v);
                },
                (r) => {
                    console.log("请求失败了", r);
                }
            );
        }
        ```



3. 总结两种方式的优缺点
    - 默认代理服务器
        - 默认代理服务器不能配置多个代理，且不能灵活的控制是否需要代理的存在
        - 当本地端口号恰巧有指定的资源路径，那么会优先请求本地端口号的资源方式二：(前缀)
    - 配置对象设置代理服务器
        - 可以配置多个代理
        - 可以灵活的控制是否需要代理





## 插槽

### 什么是插槽

- 在 Vue 中，**引入的子组件标签默认是不允许存在标签体内容的**，为了解决这个问题，官方引入了插槽 ( *slot* ) 的概念
- 插槽，其实就相当于占位符，它在组件中用于向 HTML 预定一个位置，让你来传入一些 HTML 架构作为显示
- 插槽分为**匿名插槽**、**具名插槽**以及**作用域插槽**

#### 	为什么使用插槽

- 想象一个场景，有五个页面，这五个页面中只有一个区域的内容不一样，其他内容相同，你会怎么去写这五个页面呢？复制粘贴是一种办法，但在 vue 中，插槽 ( *slot* ) 是更好的做法。





### 插槽的语法与使用

#### 	语法

- 在组件中 `template` 模板中使用 `<slot>` 标签定义插槽
- 使用组件标签式，在组件标签内部写入 HTML 内容就会正常显示

#### 	使用

1. ##### 默认插槽

    1. 在组件**内部**使用 `<slot>` 标签体声明插槽

        ```html
        <template>
            <div class="box">
                <slot> 如果外部没有输入内容，那么你将会看到我 </slot>
            </div>
        <template/>
        ```

    2. **外部**声明组件标签体内容

        ```html
        <components>
            <!-- 此组件内部的内容将会被解析并存放于 <slot> 标签体中 -->
            <h1> !默认插槽! <h1/>
            <h1> !默认插槽! <h1/>
            <h1> !默认插槽! <h1/>
        <components/>
        ```

    3. 备注

        - 默认插槽下 `<slot>` 会接受定义的所有内容
        - 默认插槽只适用只有一个待填坑的内容时的情况，很笨重

2. ##### 具名插槽

    1. 在组件**内部**使用 `<slot>` 标签体声明插槽，并且声明 `name` 属性

        ```html
        <template>
            <div class="box">
               <slot name="img"/>
               <slot name="text"/>
            </div>
        <template/>
        ```

    2. 外部声明组件标签体内容，`slot` 属性指向 `name` 

        ```html
        <components>
           <img slot="img" src="./assets/羊.jpg" alt="">
           <div class="text" slot="text">
                <a>烤全羊</a>
                <a>羊肉串</a>
           </div>
        <components/>
        ```

    3. 备注

        - 标签体 `slot` 属性必须指向对应的 `name` ，否则不会显示内容
        - 内部使用 `name` 属性，外部 `slot` 指向 *name*
        - 具名插槽可以适应多个插槽的情况

3. ##### 作用域插槽

    > 作用域插槽：将组件内部的数据向外部逆向传递，于组件标签体中使用，数据也只有组件标签体可见

    1. 在组件**内部**使用 `<slot>` 标签体声明插槽，并使用 `v-bind`/ `:` 将数据单向绑定（逆向）

        ```html
        <div class="box">
            <h3>{{ title }}分类</h3>
            <slot :scope="dataObj" />
            <!--   
        		dataObj: {
                moives: ["《告白》", "《横道世之介》", "《罗马假日》", "《E·T》"]
              	} 
        	-->
        </div>
        ```

    2. **外部**必须使用 `<template>` 标签体声明插槽内容，使用 `scope` 属性接收数据 (属性值名称不限)

        ```html
        <Categroy title="电影">
            <template scope="scope">
                <ul>
                    <li v-for="(item, index) in scope.dataObj.moives" :key="index">
                        {{ item }}
                    </li>
                </ul>
            </template>
        </Categroy>
        ```

    3. 备注

        - 内部将数据传递到外部后，会封装一层对象，对象名为数据名
        - 必须使用 `<template>` 标签体，并添加 `scope` 属性
        - 当遇到数据内容在内部组件，而数据的结构则需要在外部定义时，适用作用域插槽























































## 项目打包部署

> 当一个项目完成时，就要考虑打包了，因为浏览器可不认识 `vue` 文件

1. ### 打包

    - 运行 `npm run build` 命令开始打包

    - 生成 `dist` 文件夹

        ![image-20220110202156754](https://sbr-1314368469.cos.ap-guangzhou.myqcloud.com/Images/202301091049741.png)

    - 此时打开 `index.html ` 将不会显示任何内容，还需将静态文件放入服务器部署

2. ### 部署

    - 初识化文件夹 `npm init -y`

    - 创建 `public` /  `static` 文件夹用于存放静态文件（此例命名 *Static*）

    - 创建一个本地端口服务器（ *Express* ）

        ```js
        // 引入 express　服务器框架
        const express = require('express');
        const app = express()
        // 引入静态资源
        app.use(express.static(__dirname+'/static'))
        app.listen(7000, (err) => {
            if(!err)console.log("7000端口服务器启动！");
        })
        ```

    - 打开 http://localhost:7000 即可









## UI 组件库

### 	移动端

- [Vant](https://youzan.github.io/vant)
- [Cube UI](https://didi.github.io/cube-ui)
- [Mint UI](https://mint-ui.github.io)

### 	PC 端

- [Element UI](https://element.eleme.cn)
- [lView UI](https://www.iviewui.com)
