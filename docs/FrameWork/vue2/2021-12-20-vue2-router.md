---
title: 【Vue2】Router 总结
author: BigRice
date: 2021-12-20
location: 云梦泽
summary: 此文档为看完张天禹老师的视频后整理的笔记，浅尝辄止，更加推荐看官方文档
tags:
   - Vue2
---

## Router

关于 Vue - Router

-   是 Vue 的一个插件库，**专门用来实现 _SPA_ 应用**
-   _SPA_（Single Page Web Appliaction）：单页面应用
    -   整个应用只有一个完整的页面
    -   点击页面的跳转链接不会刷新页面，只会做局部的刷新
    -   数据通过 AJAX 请求获得

什么是路由？

-   Vue - Router 中一个路由就是一组 Key-Value 映射关系
-   Key 为路径规则，Value 可以为 Function 或 Componet

路由的分类

1. 前端路由
    - Value 是 Componet 组件，用于展示页面内容
    - 工作流程：当浏览器 URL 路径改变时，对应的组件就会显示
2. 后端路由
    - Value 是 Function 函数，用于处理客户点提交的请求（ '/GetData' ）
    - 工作流程：服务器接收到一个请求时，根据请求路径匹配到函数随后处理请求，返回响应数据

​

### 路由规则的配置项

| 配置项      | 配置用途                                                         |
| ----------- | ---------------------------------------------------------------- |
| `routes`    | 所有路由规则都该在此配置项中定义（**数组包含对象形式**）         |
| `name`      | 路由名称（简化多级路由的跳转，无需添加 `/`）                     |
| `path`      | 路由路径（以 `/` 开头）                                          |
| `meta`      | 路径元数据（自定义数据，**对象键值对形式**）                     |
| `params`    | 传递 `params` 参数（`name` 跳转写 `name` ，`path` 跳转写占位符） |
| `query`     | 传递 `query` 参数                                                |
| `props`     | 简化路由组件中参数的读取（三种方式）                             |
| `component` | 展示的路由组件                                                   |
| `children`  | 嵌套路由                                                         |

## 配置路由

配置一个简单的一级路由

1. 项目中安装路由器 `npm i vue-router`

2. 新建一个 `router` 文件夹用作创建路由器

    <img src="https://sbr-1314368469.cos.ap-guangzhou.myqcloud.com/Images/202301091049309.png" alt="image-20220107133030652" style="width:25%;" />

    - 导入 `vue-router` 于 `index.js` 路由器中创建路由规则

    - 配置对象中使用 `routes` 配置属性设置路由规则，值为数组包含对象的形式

        ```js
        // 导入 VueRouter 插件用作创建路由器
        import VueRouter from "vue-router";
        // 导入组件
        import Person from "../components/Person.vue";
        import Student from "../components/Student.vue";

        // 创建并暴露一个路由器
        export default new VueRouter({
            // routes 配置项为数组中包含对象的形式
            routes: [
                {
                    // 定义路由路径：若当前应用端口号的资源路径切换为 path 后，提供组件数据
                    path: "/Person",
                    // 定义组件数据
                    component: Person,
                },
                {
                    // 定义路由路径：若当前应用端口号的资源路径切换为 path 后，提供组件数据
                    path: "/Student",
                    // 定义组件数据
                    component: Student,
                    // 定义子路由
                    childred: [
                        {
                            // 定义路由名，后续可通过 to 属性的对象写法读取
                            name: "Info",
                            path: "Info",
                            component: xxx,
                        },
                    ],
                },
            ],
        });
        ```

3. `main.js` 中加载路由器

    ```js
    import Vue from "vue";
    import App from "./App.vue";
    // 导入 VueRouter 插件
    import VueRouter from "vue-router";
    // 安装插件
    Vue.use(VueRouter);
    // 导入路由器
    import router from "./router/index";
    new Vue({
        el: "#app",
        render: h => h(App),
        // 配置路由器
        router: router,
    });
    ```

4. 若配置成功，那么应用的地址栏资源路径会出现 `/#/`

    - 如：http://localhost:8000/#/

## 路由组件

当我们配置好路由后，我们就要让页面显示处来

使用 `<router-view>` 组件来定义路由组件的出口位置。

使用 `<router-link>` 定义一个路由跳转组件

-   此标签经过后续的解析成 `<a>` 标签，用作切换路由路径（开启指定路由）

-   `to="/Person"` 为必须属性，分为两种使用方式

    -   字符串形式：点击后跳转到指定**一级路径**，它的值必须由 `/` 开头

        ```JS
        to="/路由组件路径/二级/三级"
        ```

    -   对象形式：`:to="{}"`，可简化多级读取与传递 Query 参数，如

        ```js
        :to="{
        	name:'路由组件的name属性', // 简化多级路由的读取
            query:{
                name:'666',
                info:'哈哈哈'
            }
        }"
        ```

-   `active-class` 属性：路由路径切换后添加字符串形式的类名，值为字符串

​

### 几个注意点

-   路由组件（由路由规则控制的组件）通常存放在 `pages | views` 文件夹下，一般组件通常存放在 `components` 文件夹下
-   通过点击切换，“隐藏”了的路由组件，实际是被**销毁**了的，需要使用时再挂载
-   每个路由组件身上都存在 `$route` 属性：存储着自身的路由信息
-   整个应用只有一个 `$router` 属性：它存在于每个路由组件身上

## 多级路由

又称**嵌套路由**，即一个路由规则包含着更多路由规则（`/Person/Name`）

多级路由按照常理来讲最好只嵌套 4 层

1. 添加 `children` 配置项于路由器中：值为数组包含对象的形式

    - 注意：子路由路径不用配置 `/`
    - 为多级路由配置 `name` 属性，可以简化读取

    ```js
    // 导入 VueRouter 插件用作创建路由器
    import VueRouter from "vue-router";
    // 导入组件
    import Person from "../pages/Person.vue";
    import Name from "../pages/Name.vue";
    import Massage from "../pages/Massage.vue";
    export default new VueRouter({
        // routes 配置项为数组中包含对象的形式
        routes: [
            {
                path: "/Person",
                component: Person,
                children: [
                    {
                        // 一定不要配置 '/'
                        path: "PersonName",
                        component: Name,
                    },
                    {
                        // 一定不要配置 '/'
                        path: "Massage",
                        component: Massage,
                    },
                ],
            },
        ],
    });
    ```

2. 跳转到子路由（完整路径）

    ```html
    <router-link to="/Person/PersonName"></router-link>
    ```

    ```html
    <router-link :to="{name:'PersonName'}"> <router-link></router-link></router-link>
    ```

## 路由之间的传参

### Query 传参

使用 `query` 属性传参的方式进行传递参数

使用语法

-   字符串形式：用 `&` 相隔

    ```html
    <router-link :to="`/Person/Massage/Info?name=张三&info=爱喝酒"></router-link>
    ```

-   配置对象形式

    ```js
    <router-link
          :to="{
              path:'/Person/Massage/Info'
              query:
               {
               	name:'张三',
               	info:'爱喝酒'
               }
              }"
    </router-link>
    ```

接收语法

-   `this.$route.query.数据名`

### Params 传参

若想给**即将显示的路由组件传递参数**：可以使用 `Params` 属性传参的方式进行传递参数

若要使用 Params 传递参数

1. 若后续使用配置对象形式传递参数，那么路由规则项中**必须**要配置 `name` 配置项

2. 若后续使用字符串形式传递参数，那么 `path` 配置项中**必须**要预留以 `:` 开头的占位符，此占位符就作为 `params` 属性名查询

    ```js
    [{
        name: 'NameInfo',// 必须配置 name 配置项
        path: 'NameInfo/:msg/:info', // 预留占位符
        component: NameInfo
    ]}
    ```

使用 Params 传递参数

1. 字符串形式（_path_）

    ```js
    <router-link :to="`/NameInfo/张三/爱喝酒`"></router-link>
    ```

2. 配置对象形式：**必须**使用 `name` 配置项指向路由组件

    ```js
    <router-link :to={
        name:'NameInfo',
        params:{
            // 手动配置占位符( 与index.js 中应对应)
            msg: m.msg,
            info: m.info,
        }}>
    </router-link>
    ```

接收语法

-   `this.$route.prarms.数据名`

    _Params_ 与 _Jquery_ 传值区别

<img src="https://sbr-1314368469.cos.ap-guangzhou.myqcloud.com/Images/202301091049339.png" alt="image-20220107183342856" style="width:55%;" />

![image-20220107183411872](https://sbr-1314368469.cos.ap-guangzhou.myqcloud.com/Images/202301091049374.png)

### Props 传参

路由组件中接收参数也可以简化接收语法，使用 `props` 配置项接收参数，只需在路由规则中配置

### 三种配置方式

1. 值为对象（固定值）

    ```json
    {
        name: 'NameInfo',
        path: 'NameInfo/:msg/:info',
        component: NameInfo,
        // 第一种方式：直接以对象形式传递固定参数（Props 形式）
        props:{id:007,title:'TII'},
    }
    ```

    - 直接接收即可

        ```json
        {
            "props": ["id", "tittle"]
        }
        ```

2. 值为布尔值，即只传递 `params` 中已有的数据

    ```json
    {
        name: 'NameInfo',
        path: 'NameInfo/:msg/:info',
        component: NameInfo,
        // 第二种方式：布尔值 将传递 prarms 中拥有的参数（Props 形式）
        props:true,
    }
    ```

    - 接收（根据 `params` 占位符）

        ```json
        {
            "props": ["msg", "info"]
        }
        ```

3. 值为回调函数，可灵活传递自定义数据、 `query` 或 `params` 中已有的数据（**对象键值对形式**）

    ```json
    {
        name: 'NameInfo',
        path: 'NameInfo/:msg/:info',
        component: NameInfo,
        // 第三种方式：函数返回对象形式传递可选的参数 Query / prarms （Props 形式）
        props({query}){ // $route 此路由组件的路由属性
            return {id:query.id,info:query.info}
        }
    }
    ```

    - 接收

        ```json
        {
            "props": ["id", "info"]
        }
        ```

    - 解构赋值

        ![image-20220110115055856](https://sbr-1314368469.cos.ap-guangzhou.myqcloud.com/Images/202301091049397.png)

## 路由的历史记录

若不希望每一次切换路由都产生历史记录（可前进回退），只需于 `<route-link>` 中定义 `:replace='true'` / `replace` 属性即可每一次点击都替换上一次的指针

路由切换指针默认为 `push` 添加历史记录（向上添加）

![image-20220110120501635](https://sbr-1314368469.cos.ap-guangzhou.myqcloud.com/Images/202301091049424.png)

![image-20220110120521036](https://sbr-1314368469.cos.ap-guangzhou.myqcloud.com/Images/202301091049646.png)

## 缓存路由

即切换不会自动销毁的路由组件

![缓存路由01](https://sbr-1314368469.cos.ap-guangzhou.myqcloud.com/Images/202301091138979.gif)

-   为即将显示的路由组件包裹 <keep-active></keep-active> 标签即可使路由组件缓存

    ```html
    <!-- 指定一个 -->
    <keep-alive include="Name">
        <router-view></router-view>
    </keep-alive>
    <!-- 指定多个 -->
    <keep-alive :include="['Name','Message ']">
        <router-view></router-view>
    </keep-alive>
    ```

    -   `include` 属性指定的为组件内部名

        ![image-20220110130120563](https://sbr-1314368469.cos.ap-guangzhou.myqcloud.com/Images/202301091049695.png)

    ![缓存路由02](https://sbr-1314368469.cos.ap-guangzhou.myqcloud.com/Images/202301091138831.gif)

### 路由组件的两个钩子

当我们为路由组件设置了 `<keep-active>` 缓存后，组件就不会自动销毁了，那么某些情况根据钩子指定回调改如何应对？

-   `activated`：激活后调用（显示）
-   `deactivated`：失活后调用（消失）

## 编程式路由导航

`<route-link>` 虽然好用，但只能转换成 `<a>` 标签，且某些时刻存在限制

我们也可以直接访问路由器来跳转路由，这被称为编程式路由跳转

语法如下：

-   `$router.push/replace(path|{配置项})`
    -   _Push_ 为新增记录跳转
    -   _Replace_ 为替换记录条状
-   `$router.go(number)`
    -   当` number` 为正数时，向**前进** `number` 步
    -   当` number` 为负数时，向后退 `number` 步
-   `$router.back()`：后退
-   `$router.forward`：前进

```js
goName() {
    this.$router.push("/Person/Name");
},
goMessage() {
    this.$router.replace({
        path:'/Person/Message',
        query:{...},
        prarms:{...}
    });
},
```

### 路由导航守卫

总的来说，路由导航守卫分为四个

1. 全局前置一般用于限制页面跳转（权限设置）
    - `router.beforeEach((to, form, next) => {})`
        - `to` 为即将前往的路由组件
        - `form` 为来自哪个路由组件
        - `next()` 为函数，用于跳转至 `to` 路由组件
2. 全局后置一般用于更换页面标题（用的少）
    - `router.afterEach((to, form) => {})`
        - `to` 为即将前往的路由组件
        - `form` 为来自哪个路由组件
3. 独享路由组件（配置项中配置）
    - `beforeEnter:((to, form,next) => {})`
        - 参数同上
4. 组件内路由守卫
    - 通过路由规则进入此组件被调用，需要放行才能进入
        - `beforeRouteEnter((to, form,next) => {})`
            - 参数同上
    - 通过路由规则离开此组件被调用，需要放行才能离开
        - `afterRouteEnter((to, form,next) => {})`
            - 参数同上

#### 全局守卫

1. 接收路由规则，将暴露（ _export_ ）后移

    ```js
    const routers = new VueRouter({});
    ```

2. `meta` 中定义路由元数据

    ```js
    const routers = new VueRouter({
        name: "Info",
        path: "/info",
        // meta 中的数据为元数据
        meta: {
            isAuth: true,
            school: "ZJJHY",
        },
    });
    ```

3. 定义守卫

    前置路由组件：于组件跳转前执行回调函数

    ```js
    router.beforeEach((to, form, next) => {
        if (to.meta.isAuth) {
            if (sessionStorage.getItem('school') = to.meta.school) {
                next()
            } else {
                alert("权限限制！无法访问！");
            }
        } else
            next()
    })
    ```

    后置路由组件：于组件跳转后执行回调函数

    ```js
    router.afterEach((to, form) => {
       if (form.name  null) {
           document.title = "VueDemo"
       } else
           document.title = to.name
    })
    ```

#### 独享路由守卫

在配置项中配置 `beforeEnter((to,form,next)=>{})` 配置项

```js
const routers = new VueRouter({
    name: "Info",
    path: "/info",
    // meta 中的数据为元数据
    meta: {
        isAuth: true,
        school: "ZJJHY",
        beforeEnter: (to, form, next) => {
            // ......
        },
    },
});
```

#### 组件内守卫

> 组件内守卫类似钩子

通过路由规则进入此组件前被调用，需要放行才能进入

-   `beforeRouteEnter((to, form,next) => {})`
    -   参数同上

通过路由规则离开此组件前被调用，需要放行才能离开

-   `afterRouteEnter((to, form,next) => {})`
    -   参数同上

## 路由的两种工作模式

#### _Hash_ 模式

-   Hash 模式为默认模式：其特点就是地址栏中会一直存在 `/#/` ，它之后的资源被称为 **hash** 值

-   hash 值刷新时不会提交至服务器，且兼容性较好

-   若以后将地址通过第三方手机 App 分享，若 App 检测严格，则地址会标记为不合法

#### _History_ 模式

-   地址干净美观

-   兼容性相比 Hash 略差

-   项目部署上线后需要后端人员维护解决刷新 404 的问题

    -   安装 `connect-history-api-fallback` 中间件

        ```js
        // 引入 express　服务器框架
        const express = require("express");
        // 引入解决　History 刷新 404 的插件
        const history = require("connect-history-api-fallback");
        const app = express();
        // 引入静态资源
        app.use(express.static(__dirname + "/static"));
        // 使用插件
        app.use(history());
        ```

-   如何更换 History 模式？

    -   于 `Router` 文件夹的 `index.js` 配置项中配置 `mode='history'`
