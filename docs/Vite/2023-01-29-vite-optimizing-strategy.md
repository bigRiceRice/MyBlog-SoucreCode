---
title: Vite 常见优化策略
author: bigRice
date: 2023-01-29
location: 云梦泽
summary: 关于 Vite 一些常见的优化策略
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
            - **强缓存**：后端服务器追加一些字段，比如一个 expires 有效期字段，客户端将记住这个字段并将首次响应体内容存入缓存，在 expires 字段没有过期前，任何请求在发起前都将被拦截转为使用缓存数据。
            - **协商缓存**：客户端在每次请求数据时都会提前发起一个协商缓存请求要求服务器来告知该请求能否使用缓存，若响应 304 则使用缓存数据。若响应其他则使用响应体。
                - 最直观的例子就是加载一个页面，首次请求的响应码都是 200，刷新后响应码会变成 304。
    - 最大元素渲染时长（LCP - Largest Content Paint）：即页面上呈现最大的一个 DOM 元素需要的时间。
    - 以及更多 ...

3. **关注 JS 代码性能**

    - 副作用函数清除，例如事件监听、定时器等需设置清除回调。

    - 事件监听使用 lodash 防抖节流函数。

    - 某些原生函数考虑使用第三方工具函数，例如数组的原生 forEach 在遇到海量数据时会有性能问题，而 lodash.forEach 就可以在一定程度上解决性能问题。

    - 动态导入（路由懒加载就是动态导入的一种形式）

    - 作用域控制，请看下列代码：

        ```js
        const arr [1,2,3]

        for(let i = 0; i < arr.length; i ++){
            // ...
        }
        ```

        上面的代码是有小问题的，即 for 作用域在每一次循环都会重复读取外部作用域的 `arr.length` 。

        我们可以改造成如下代码：

        ```js
        const arr [1,2,3]

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

    - 优化体积：TreeShaking 摇树优化、Base64、CDN 加载、分包策略

## 分包策略

### 为什么要分包

我们都知道浏览器在请求静态资源时，只要静态资源的名称不变，就直接寻找缓存文件。这就是为什么项目中任何业务代码更改后，打包后文件的 hash 值都会改变，因为它方便浏览重新请求更新后的资源文件。

但这种策略有可能会造成一些不必要的性能浪费。

举个例子:

我们在 main.js 中导入 lodash，随后在里面写一点逻辑：

```js
import { forEach } from "lodash";

const arr = [1, 2, 3];
forEach(arr, e => console.log(e));
```

随后进行打包，可以看到打包后的源码将是非常庞大的：

> vite.config.js 中配置 `build:{ minify : false }` 关闭代码压缩以查看源码

![image-20230130165903568](https://sbr-1314368469.cos.ap-guangzhou.myqcloud.com/Images/202301301659677.png)

我们可以看到，这 5000+ 行的 lodash 代码与业务代码耦合在了一起，我们每一次请求这个文件，都将走一次这个庞大 lodash 声明代码，假设我们再定义另一个 JS 文件，里面也使用到了 lodash 中的函数，那么你猜这 5000+ 行的代码会不会也耦合在一起呢。

> 正常情况下打包工具会将代码集中处理，但特殊情况下这是有可能发生的情况。

这毋庸置疑是浪费性能的，因为 lodash 在打包后将不会改变，它被定义在每一个使用到它的函数前是存粹的浪费性能。

如果我们有一个办法将 lodash 导出与业务代码解耦，将 lodash 作为单独的 JS 模块文件导出，就可以解决掉性能浪费问题，这就是**分包策略**：将某些不需要经常更新的代码进行单独打包处理。

不需要经常更新的文件有一个很好辨认的方式，那就是它大概率一定是**第三方包 & 库**或我们自定义的工具函数。

### 实现分包

在 vite 中实现分包策略，实际上是靠配置 Rollup 的打包配置完成的。

```js
// vite.config.js
import { defineConfig } from "vite";
export default defineConfig({
    build: {
        // 在这里配置打包时的rollup配置
        rollupOptions: {
            // ...
        },
    },
});
```

Rollup 的 `output.manualChunks` 这一配置可以实现分包策略，具体内容可以查看官网对它的[描述](https://www.rollupjs.com/guide/big-list-of-options#outputmanualchunks)：

-   该选项允许你创建自定义的公共模块

它有两种使用方式，一种是对象形式，一种是函数形式。

对象形式这样定义：

```js
rollupOptions: {
    output: {
        manualChunks: {
            // 创建一个 lodash 公共模块，它的取值是 'lodash' 包
            lodash: ["lodash"];
        }
    }
}
```

配置好后，再次执行 `yarn build`，可以看到打包后的文件目录如下：

![image-20230130172504633](https://sbr-1314368469.cos.ap-guangzhou.myqcloud.com/Images/202301301725678.png)

业务代码源码：

![image-20230130172608121](https://sbr-1314368469.cos.ap-guangzhou.myqcloud.com/Images/202301301726163.png)

可以看出 lodash 作为一个公共模块被导出了，这样我们源码下不同文件使用 lodash 都将使用同一个模块而非重复定义。

还有一种方式是通过函数定义，这种方式可拓展性更高，当我们将它定义为函数形式，它的类型将是这样的：

```ts
((id: string, {getModuleInfo, getModuleIds}) => string | void)
```

我们可以看看这个 id 属性代表着什么：

```js
rollupOptions: {
    output: {
        manualChunks(id) {
            console.log('id', id)
        }
    }
}
```

![image-20230130174356816](https://sbr-1314368469.cos.ap-guangzhou.myqcloud.com/Images/202301301743867.png)

可以看到，id 属性的值是每个经过解析的模块的绝对地址，我们可以根据 id 参数来完成自定义公共模块的行为。

> 如果函数返回字符串，那么该模块及其所有依赖将被添加到以返回字符串命名的自定义 chunk 中。—— Rollup.js

我们需要识别不需要经常更新的文件然后返回一个字符串，这个字符串的值即为自定义模块的文件名，上面讲到过一个不需要经常更新的文件大概率是第三方包，而只要是第三包就一定会存在 `node_modules` 字符串，所以我们可以这样定义函数：

```js
rollupOptions: {
    output: {
        manualChunks(id) {
            if (id.includes('node_modules')) {
                return 'common'
            }
        }
    }
}
```

随后打包查看输出目录：

![image-20230130175028442](https://sbr-1314368469.cos.ap-guangzhou.myqcloud.com/Images/202301301750482.png)

执行的结果与对象形式一致，这就完成了代码分包。

## GZIP 压缩

在我们执行 `yarn build` 命令输出打包文件时，你可能已经注意到了文件大小后面都紧跟着一个 gzip 数值，其实这串数字指的就是这个文件可以被压缩到多小。

![image-20230130214914357](https://sbr-1314368469.cos.ap-guangzhou.myqcloud.com/Images/202301302149422.png)

Gzip 的工作流程是这样的，首先假设服务器有一份源文件与一份经过压缩的 `.gz` 文件，随后假设浏览器请求这个文件。

1. 此时浏览器请求数据头中的 Accept-Encoding 包含 gzip 选项（表示我支持压缩）
2. 服务器看到请求数据头中的 Accept-Encoding 包含 gzip 选项，则返回经过压缩的那一份 `.gz` 文件。

这样就减少网络实际传输数据的大小，大大提高了传输效率。

-   服务器先传输一个压缩文件，客户端自行解压，有效的减少了一部分服务器传输的压力，而客户端增加了解压缩这方面的压力。

> 这一个优化策略需要在服务器中另行，前端中所能做的工作就是**提供**好压缩文件，再由服务器决定是否开启 gzip 传输。
>
> Gzip 在某些情况下的效果甚微，主要体现在一个文件本身就非常大，解压的时间也就要更久，保不准这个大文件服务器运行的比客户端效果更佳呢。

### 🌰 栗子

我们可以看一个例子，在这里例子中模拟了服务器的 Gzip 策略：

首先这是目录结构，提供了一份 js 源文件与经过压缩的 .js.gz 文件：

![image-20230130231226273](https://sbr-1314368469.cos.ap-guangzhou.myqcloud.com/Images/202301302312324.png)

这是 index.html 文件，它在响应后会发起一个 /main.js 的请求：

```html
<!DOCTYPE html>
<html>
    <head>
        <title>Vite-dev</title>
        <script type="module" src="./main.js"></script>
    </head>
</html>
```

这是 index.js 文件，用于服务器模拟（koa 搭建）：

```js
const koa = require("koa");
const app = new koa();
const { readFileSync } = require("fs");
const { resolve } = require("path");

const jointPath = path => resolve(__dirname, path);

app.use(({ request: req, response: res }) => {
    let u = req.url;
    if (u === "/") {
        let html = readFileSync(jointPath("./index.html")).toString();
        res.set("Content-Type", "text/html");
        res.body = html;
    }
    if (u === `/main.js`) {
        // 在 /main.js 请求中我们直接返回源文件的字符串
        let file = readFileSync(jointPath("./index-84ef3335.js")).toString();
        res.set("Content-Type", "text/javascript");
        // res.set("Content-Encoding", "gzip");
        res.body = file;
    }
});

app.listen(5173, () => {
    console.log("服务器启动在 5173 端口 - http://localhost:5173");
});
```

此时我们可以打开 http://localhost:5173 查看网络请求：

![image-20230130231750093](https://sbr-1314368469.cos.ap-guangzhou.myqcloud.com/Images/202301302317159.png)

可以看到直接返回了大小为 287Kb 的源文件。

我们查看请求头，可以看到浏览器是默认支持 gzip 解压缩的：

![image-20230130231946509](https://sbr-1314368469.cos.ap-guangzhou.myqcloud.com/Images/202301302319565.png)

那么我们此时修改 index.js ：

```js
if (u === `/main.js`) {
    // 直接返回 .gz 文件
    let file = readFileSync(jointPath("./index-646f9e52.js.gz")); // 注意去掉 toSting()
    res.set("Content-Type", "text/javascript");
    // 记得设置 Content-Encoding 响应头为 gzip
    res.set("Content-Encoding", "gzip");
    res.body = file;
}
```

再打开项目查看网络请求：
![image-20230130232248760](https://sbr-1314368469.cos.ap-guangzhou.myqcloud.com/Images/202301302322832.png)

这样就完成了 Gzip 相关的优化了。

## CDN 加速

### 何为 CDN

> CDN 即 Content Delivery Network — 内容发布网络

我们都知道 JS 库除了可以从 NPM 中下载到本地，还有一种原始的使用方式：通过 Script 标签引入 CDN 直接从目标服务器上获取，两者的效果都是一样的。

所以我们可以在打包后将所有用到第三方包 & 库转为 CDN 加载形式，这可以有效**缓解我们自己服务器的压力**。

-   因为 CDN 加载有个强大之处：根据所在地来分发网络，比如请求来自在广州，那么就会从广州附近的服务器上响应。
-   说的简单点就是使用高效的服务器获取资源（白嫖）。

### 使用 CDN 加速

在 Vite 中可以通过一个 Vite [插件](https://github.com/MMF-FE/vite-plugin-cdn-import/blob/master/README.zh-CN.md)来完成 CDN 加速：`vite-plugin-cdn-import` 来完成。

下面以打包 lodash 为例，我们使用一个导入了 lodash 的 js 打包代码为例，这是它打包后的大小：

![image-20230131113021587](https://sbr-1314368469.cos.ap-guangzhou.myqcloud.com/Images/202301311130644.png)

随后我们尝试使用 CDN 加速优化：

1. 首先下载插件：

    ```shell
    yarn add vite-plugin-cdn-import -D
    ```

2. 随后在 vite.config.js 中使用插件：

    ```js
    import { defineConfig } from "vite";
    import importToCdn from "vite-plugin-cdn-import";

    let lodashCdnPath = `https://cdn.bootcdn.net/ajax/libs/lodash.js/4.17.21/lodash.core.min.js`;
    export default defineConfig({
        build: {
            minify: false,
        },
        plugins: [
            importToCdn({
                modules: [
                    {
                        // 包名
                        name: "lodash",
                        // 打包后的变量名
                        var: "lodash_CDN",
                        // CDN 地址
                        path: lodashCdnPath,
                    },
                ],
            }),
        ],
    });
    ```

3. 查看 CDN 加速后的大小：

    从 214.55kb 缩小至 1.4 kb

    ![image-20230131113950963](https://sbr-1314368469.cos.ap-guangzhou.myqcloud.com/Images/202301311139016.png)

4. CDN 加速会将指定所加速到的地址往加载 main.js 顶部通过 Script 的形式加载：

    我们可以启动生成服务器查看项目：`npx vite preview`

    ![image-20230131114233686](https://sbr-1314368469.cos.ap-guangzhou.myqcloud.com/Images/202301311142749.png)

这就是 CDN 加速优化。
