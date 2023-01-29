---
title: Vite 优化策略
author: bigRice
date: 2023-01-29
location: 云梦泽
summary: Vite 一些常用优化策略
tags:
    - Vite
---



## 关于性能优化

性能优化是什么？无非以下几点：

1. **构建速度优化**：当你敲下 `npm dev & yarn dev` 后需要多久才能启动项目。

    - Webpack 在这方面下的功夫很重，有很多 loader：
        - cache-loder：将一些 loader 的结果缓存起来，再次构建的内容一致，则直接使用**缓存**。
            - webpack 5 直接提供 cache 选项。
        - thread-loader：以**多线程方式**运行 loader 从而提升 Webpack 构建性能的插件。
    - Vite 基于 ESM 规范特性实现了按需加载，所以 Vite 项目无需太在意构建速度优化。
    - 以及更多 ...

2. **页面性能指标**：和我们写代码的 JS 逻辑相关，表现形式一般有两个指标。

    - 首屏渲染时长（FCP - First Content Paint）：狭义上指页面上呈现第一个 DOM 元素需要的时间，广义上指呈现**页面视口**能静看到的内容需要的时长。
        - 代码实现懒加载优化。
        - HTPP 优化：强缓存，协商缓存。
            - **强缓存**：后端服务器追加一些字段，比如一个 expires  有效期字段，客户端将记住这个字段并将首次响应体内容存入缓存，在 expires 字段没有过期前，任何请求在发起前都将被拦截转为使用缓存数据。
            - **协商缓存**：客户端在每次请求数据时都会提前发起一个协商缓存请求要求服务器来告知该请求能否使用缓存，若响应 304 则使用缓存数据。若响应其他则使用响应体。
                - 最直观的例子就是加载一个页面，首次请求的响应码都是 200，刷新后响应码会变成 304。
    - 最大元素渲染时长（LCP - Largest Content Paint）：即页面上呈现最大的一个 DOM 元素需要的时间。
    - 以及更多 ...

3. **关注 JS 代码性能**

    - 副作用函数清除，例如事件监听、定时器等需设置清除回调。

    - 事件监听使用 lodash 防抖节流函数。

    - 某些原生函数考虑使用第三方工具函数，例如数组的原生 forEach 在遇到海量数据时会有性能问题，而 lodash_forEach 就可以在一定程度上解决问题。

    - 作用域控制，请看下列代码：

        ```js
        const arr [1,2,3,// 假设有海量数据 ]
        
        for(let i = 0; i < arr.length; i ++){
            // ...
        }
        ```

        上面的代码是有小问题的，即 for 作用域在每一次循环都会重复读取外部作用域的 `arr.length` 。

        我们可以改造成如下代码：

        ```js
        const arr [1,2,3,// 假设有海量数据 ]
        
        for(let i = 0, arrLength = arr.langth; i < arrLength; i ++){
            // ...
        }
        ```

        这样我们就可以每次 for 循环时只读取 for 作用域内部的 arrLength 了

    - 关注页面[重排 & 重绘](https://zhuanlan.zhihu.com/p/377073521)，尽量不直接操作元素的宽高大小与位置。

    - 以及更多 ...

4. **关注 CSS 代码性能**

    - 能继承的不重新定义
    - 避免太深的 CSS 类名嵌套

5. 构建 & 打包优化：

    - 优化体积：TreeShaking 代码压缩、图片压缩、CDN 加载、分包策略



技术栈

- 框架
    - Vue 2 & Vue 3
    - React
    - 微信小程序
- 构建工具 & 工具
    - Vite：项目构建工具，集成了大量的第三方包与插件
    - Webpack：老牌顶流项目构建工具 & 打包工具，社区有大量的第三方包与插件支持
    - Rollup：高效、存粹的打包工具
    - Babel：JS 代码降级 & 兼容工具
    - Postcss：Css 代码降级 & 添加前缀兼容
    - VueUse：Vue 3 Hooks 工具库
    - MockJS：数据模拟库
- UI 库
    - Vant：移动端 UI
    - Element UI & Element Plus
- 规范
    - ESM 模块化规范
    - CommonJS 模块化规范
    - TypeScript：JS 超集，控制类型



## 分包策略





