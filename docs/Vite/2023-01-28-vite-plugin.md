---
title: Vite 插件
author: bigRice
date: 2023-01-29
location: 云梦泽
summary: 关于 Vite 中的一些插件 API
tags:
    - Vite
---

## 关于插件 Plugin

> [社区插件大全](https://github.com/vitejs/awesome-vite#plugins)

相信有过 Webpack 打包经验的小伙伴们都有使用过插件的经历，因为 Webpack 中可以配置的插件真的太多了。

那么在 Vite 中，可以配置的插件在主观上好像并没有几个，这是为啥嘞？

究其原因，就是 Vite 自动启用了大量的内置插件。

-   比如 webpack-plugin-html 插件，用于生成项目的 index.html 文件，Vite 项目中会自动调用，无需下载配置。
-   亦或者像 webpack-plugin-clear 插件，用于清空打包后的 dist 目录，Vite 项目也会自动调用，无需下载配置。

我们也可以手动启用插件，就用一个简单的插件来演示： _vite-aliases_ 插件（#吐槽# 作者好像并没有按照约定命名 🧐）

该插件可以读取 /src 下的目录自动补全路径别名 `resolve.alias`

首先下载插件：

```shell
# 切勿下载最新版，最近版有 BUG ~> https://github.com/Subwaytime/vite-aliases/issues/51
yarn add vite-aliases@0.9.2
```

随后启动在配置项中启用插件：

```js
import { ViteAliases } from "vite-aliases";

/** @type import("vite").UserConfig */
export default {
    plugins: [
        // 关于配置项：https://github.com/subwaytime/vite-aliases#configuration
        ViteAliases({
            /* optionos */
        }),
    ],
};
```

假设你的 Src 目录如下，那么插件会自动生成如下配置：

```
src
    assets
    components
    pages
    store
    utils
```

```js
[
    {
        find: "@",
        replacement: "${your_project_path}/src",
    },
    {
        find: "@assets",
        replacement: "${your_project_path}/src/assets",
    },
    {
        find: "@components",
        replacement: "${your_project_path}/src/components",
    },
    {
        find: "@pages",
        replacement: "${your_project_path}/src/pages",
    },
    {
        find: "@store",
        replacement: "${your_project_path}/src/store",
    },
    {
        find: "@utils",
        replacement: "${your_project_path}/src/utils",
    },
];
```

其实 vite-aliases 的原理是很简单的，只要使用到 Vite 定义好的钩子在配置生命周期的某个阶段修改配置文件即可。我们可以自己定义类似的插件，但在那之前我们需要知道插件的约定。

### 约定

> **致插件创作者**
>
> Vite 努力秉承**开箱即用**的原则，因此在创作一款新插件前，请确保已经阅读过 [Vite 的功能指南](https://vitejs.cn/vite3-cn/guide/features.html)，避免重复劳作。同时还应查看社区是否存在可用插件，包括 [兼容 Rollup 的插件](https://github.com/rollup/awesome) 以及 [Vite 的专属插件](https://github.com/vitejs/awesome-vite#plugins)。

如果插件不使用 Vite 特有的钩子，可以作为 [兼容 Rollup 的插件](https://vitejs.cn/vite3-cn/guide/api-plugin.html#rollup-plugin-compatibility) 来实现，推荐使用 [Rollup 插件名称约定](https://rollupjs.org/guide/en/#conventions)。

> Rollup 是一个纯粹的打包工具，它的插件也应该与打包相关

-   Rollup 插件应该有一个带 `rollup-plugin-` 前缀、语义清晰的名称。
-   在 package.json 中包含 `rollup-plugin` 和 `vite-plugin` 关键字。

这样，插件也可以用于纯 Rollup 或基于 WMR 的项目。

对于 Vite 专属的插件：

-   Vite 插件应该有一个带 `vite-plugin-` 前缀、语义清晰的名称。
-   在 package.json 中包含 `vite-plugin` 关键字。
-   在插件文档增加一部分关于为什么本插件是一个 Vite 专属插件的详细说明（如，本插件使用了 Vite 特有的插件钩子）。

如果你的插件只适用于特定的框架，它的名字应该遵循以下前缀格式：

-   `vite-plugin-vue-` 前缀作为 Vue 插件
-   `vite-plugin-react-` 前缀作为 React 插件
-   `vite-plugin-svelte-` 前缀作为 Svelte 插件

## 插件 API

### Vite 钩子

> Vite 钩子用于配置 & 修改 Vite 原有的某些配置或其他功能

Vite 插件也可以提供钩子来服务于特定的 Vite 目标。这些钩子会被 Rollup 忽略。

#### _config_

```ts
(config: UserConfig, env: { mode: string, command: string }) => UserConfig | null | void
```

用于修改 & 添加原始配置，会在解析 Vite 配置前调用。

钩子会接收原始配置（命令行选项指定的会与配置文件合并）和一个描述配置环境的变量，包含正在使用的 `mode` 和 `command`。

它可以返回一个现有配置中的部分配置对象（将被深度合并到最终配置去），如果默认的合并不能达到预期的结果，你也可以直接修改原始配置。

##### 示例

```js
// 返回部分配置（推荐）
module.export = options => {
    return {
        name: "myPlugin-xxx",
        config: baseConfig => ({
            resolve: {
                alias: {
                    "@": "xxx/src",
                },
            },
        }),
    };
};
```

#### _configResolved_

```ts
(config: ResolvedConfig) => void | Promise<void>
```

该钩子在解析 Vite 配置后**最后**才调用，它的大致使用方式与 `config` 钩子一致。

使用这个钩子读取和存储最终解析的配置。当插件需要根据运行的命令做一些不同的事情时，它也很有用。

##### 示例

```js
module.export = options => {
    return {
        name: "read-config",

        // 解析 Vite 配置后调用
        configResolved(resolvedConfig) {
            // 存储最终解析的配置
            config = resolvedConfig;
        },

        // 在其他钩子中使用存储的配置
        transform(code, id) {
            if (config.command === "serve") {
                // dev: 由开发服务器调用的插件
            } else {
                // build: 由 Rollup 调用的插件
            }
        },
    };
};
```

#### _configureServer_

```ts
(server: ViteDevServer) => (() => void) | void | Promise<(() => void) | void>
```

是一个与服务器相关的钩子，用于配置 & 设置开发服务器。最常见的用例是在内部 [connect](https://github.com/senchalabs/connect) 应用程序中**添加自定义中间件**：

##### 注入前置中间件

`configureServer` 钩子将在内部中间件被安装**前**调用，所以自定义的中间件将会默认会比内部中间件早运行。

```js
const myPlugin = () => ({
    name: "configure-server",
    configureServer(server) {
        // middlewares 意为中间件
        server.middlewares.use((req, res, next) => {
            // 自定义请求处理...
        });
    },
});
```

##### 注入后置中间件

如果你想注入一个在内部中间件 **之后** 运行的中间件，你可以在 `configureServer` 返回一个函数，这个函数将会在内部中间件安装后才被调用

```js
const myPlugin = () => ({
    name: "configure-server",
    configureServer(server) {
        // 返回一个在内部中间件安装后
        // 被调用的后置钩子
        return () => {
            server.middlewares.use((req, res, next) => {
                // 自定义请求处理...
            });
        };
    },
});
```

##### 注意

`configureServer` 在打包后将不会被调用，所以其他钩子需要防范它缺失。

#### _configurePreviewServer_

```ts
(server: { middlewares: Connect.Server, httpServer: http.Server }) => (() => void) | void | Promise<(() => void) | void>
```

与 `configureServer` 钩子作用相同但是作用在**预览服务器**，它的使用语法与 `configureServer` 保持一致。

> 预览服务器广义来讲是一个插件，它可以直接**预览打包过后的 index.html 文件**，就像 VS Code 中的 Live Serve 插件一样。
>
> 可以通过 `npx vite preview` 开启一个预览服务器。

#### _transformIndexHtml_

```ts
IndexHtmlTransformHook | { enforce: "pre" | "post", transform: IndexHtmlTransformHook };
```

转换（修改） `index.html` 的专用钩子。钩子接收当前的 HTML 字符串和转换上下文。上下文在开发期间暴露 [`ViteDevServer`](https://vitejs.cn/vite3-cn/guide/api-javascript.html#vitedevserver) 实例，在构建期间暴露 Rollup 输出的包。

这个钩子可以是异步的，并且可以返回以下其中之一:

-   经过转换的 HTML 字符串
-   注入到现有 HTML 中的标签描述符对象数组（`{ tag, attrs, children }`）。每个标签也可以指定它应该被注入到哪里（默认是在 `<head>` 之前）
-   一个包含 `{ html, tags }` 的对象

##### 示例

```js
module.export = options => {
    return {
        name: "html-transform",
        transformIndexHtml(html) {
            return html.replace(/<title>(.*?)<\/title>/, `<title>Title replaced!</title>`);
        },
    };
};
```

#### _handleHotUpdate_

```ts
(ctx: HmrContext) => Array<ModuleNode> | void | Promise<Array<ModuleNode> | void>
```

该钩子用于执行自定义 HMR 热更新行为。钩子接收一个带有以下签名的上下文对象：

```ts
interface HmrContext {
    file: string;
    timestamp: number;
    modules: Array<ModuleNode>;
    read: () => string | Promise<string>;
    server: ViteDevServer;
}
```

-   `modules` 是受更改文件影响的模块数组。它是一个数组，因为单个文件可能映射到多个服务模块（例如 Vue 单文件组件）。
-   `read` 这是一个异步读函数，它返回文件的内容。之所以这样做，是因为在某些系统上，文件更改的回调函数可能会在编辑器完成文件更新之前过快地触发，并 `fs.readFile` 直接会返回空内容。传入的 `read` 函数规范了这种行为。

钩子可以选择:

-   过滤和缩小受影响的模块列表，使 HMR 更准确。

-   返回一个空数组，并通过向客户端发送自定义事件来执行完整的自定义 HMR 处理:

    ```js
    handleHotUpdate({ server }) {
      server.ws.send({
        type: 'custom',
        event: 'special-update',
        data: {}
      })
      return []
    }
    ```

### Rollup 钩子

> 要记住 Rollup 是一个存粹的打包工具，它的钩子也应该与打包相关，所以 Rollup 钩子用于配置 & 修改 Rollup 原有的某些配置或其他功能

在开发中，Vite 开发服务器会创建一个插件容器来调用 [Rollup 构建钩子](https://rollupjs.org/guide/en/#build-hooks)，与 Rollup 如出一辙。

以下钩子在服务器启动时被调用：

-   [`options`](https://rollupjs.org/guide/en/#options)
-   [`buildStart`](https://rollupjs.org/guide/en/#buildstart)

以下钩子会在每个传入模块请求时被调用：

-   [`resolveId`](https://rollupjs.org/guide/en/#resolveid)
-   [`load`](https://rollupjs.org/guide/en/#load)
-   [`transform`](https://rollupjs.org/guide/en/#transform)

以下钩子在服务器关闭时被调用：

-   [`buildEnd`](https://rollupjs.org/guide/en/#buildend)
-   [`closeBundle`](https://rollupjs.org/guide/en/#closebundle)

> 请注意 [`moduleParsed`](https://rollupjs.org/guide/en/#moduleparsed) 钩子在开发中是 **不会** 被调用的，因为 Vite 为了性能会避免完整的 AST 解析。
>
> [Output Generation Hooks](https://rollupjs.org/guide/en/#output-generation-hooks)（除了 `closeBundle`) 在开发中是 **不会** 被调用的。你可以认为 Vite 的开发服务器只调用了 `rollup.rollup()` 而没有调用 `bundle.generate()`。

### 插件顺序 & 情景应用

一个 Vite 插件可以额外指定一个 `enforce` 属性（类似于 webpack 加载器）来调整它的应用顺序。`enforce` 的值可以是`pre` 或 `post`。解析后的插件将按照以下顺序排列：

-   Alias
-   带有 `enforce: 'pre'` 的用户插件
-   Vite 核心插件
-   没有 enforce 值的用户插件
-   Vite 构建用的插件
-   带有 `enforce: 'post'` 的用户插件
-   Vite 后置构建插件（最小化，manifest，报告）

---

默认情况下插件在开发（serve）和构建（build）模式中都会调用。如果插件只需要在预览或构建期间有条件地应用，请使用 `apply` 属性指明它们仅在 `'build'` 或 `'serve'` 模式时调用：

```js
function myPlugin() {
    return {
        name: "build-only",
        apply: "build", // 或 'serve'
    };
}
```

同时，还可以使用函数来进行更精准的控制：

```js
function myPlugin() {
    return {
        name: "build-only",
        apply: "build", // 或 'serve'
    };
}
```

### 最佳实践

Vite 插件的定义方式多为一个返回对象的函数，对象中将被注入 Vite 特有钩子或全局（Rollup）的钩子。

```js
// myPlugin.js

// ? 假设你的插件同时需要 Rollup 钩子与 Vite 钩子类型补全
/** @type {(import("vite").Plugin | import("vite").PluginContainer )}*/
// ? 假设你的插件同时只需要 Vite 钩子类型补全
/** @type import("vite").Plugin*/
// ? 假设你的插件同时只需要 Rollup 钩子类型补全
/** @type import("vite").PluginContainer*/
module.export = options => {
    // options 为调用时可以传入的配置对象
    return {
        // 插件名称
        name: "myPlugin-xxx",
        // 设置插件执行顺序
        enforce: "pre",
        // 插件执行在哪种环境下 serve 为开发环境 build 为构建环境
        apply: "serve",
        // 修改源配置钩子
        config(baseConfig) {
            // ...
        },
        transformIndexHtml(baseHtml) {
            // ...
        },
    };
};
```

## 常用插件 & 插件原理

除了 vite-aliases，还有几个常用且实用的小插件：

-   vite-plugin-html：向 index.html 中注入变量，这个插件在早期的 vue-cli 使用过。

    -   html 需要使用 ejs （`<%= title %>`）语法接收（其实就是替换的操作）。

-   vite-plugin-mock + mock.js：自动拦截本地请求，并返回 Mock 数据。

### _[vite-plugin-html](https://github.com/vbenjs/vite-plugin-html#usage)_

首先下载插件：

```shell
yarn add vite-plugin-html -D
```

使用插件：

```js
import { createHtmlPlugin } from "vite-plugin-html";

/** @type import("vite").UserConfig */
export default {
    plugin: [
        createHtmlPlugin({
            inject: {
                // data 内的输入将会被注入到 html 中，html 需要使用 ejs 语法接收
                data: {
                    title: "Home - 首页",
                    // types.js 是一个高效的字体动画库
                    injectScript: `https://cdn.bootcdn.net/ajax/libs/typed.js/2.0.12/typed.js`,
                    slogn: "生命不息，战斗不止",
                },
            },
        }),
    ],
};
```

html 内容：

```html
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8" />
        <title><%- title %></title>
    </head>
    <body>
        <script type="module" src="./main.js"></script>
        <script src="<%- injectScript %>"></script>
    </body>
    <h1><%- slogn %></h1>
</html>
```

启动服务查看效果：

![image-20230128193654307](https://sbr-1314368469.cos.ap-guangzhou.myqcloud.com/Images/202301281936355.png)

### _[vite-plugin-mock](https://github.com/vbenjs/vite-plugin-mock)_

该插件会自动扫描根目录下 mock 目录下的 index.js 的返回值，随后监听并拦截本地请求，早最后返回 index.js 下的指定内容，**必须**配合 mock.js 使用。

首先下载插件与 mockjs：

```shell
yarn add vite-plugin-mock mockjs -D
```

随后在根目录下定义 mock 目录定义一个 Index.js 文件，格式如下：

```js
// 该文件是被插件在 node 环境下读取的，所以定义为 commonJs 规范
// 关于此文件的标准格式，可前往官网查看 ~> https://github.com/vbenjs/vite-plugin-mock#mock-file-example
module.exports = [
    {
        method: "post",
        url: "/api/user",
        response({ body }) {
            return {
                code: 200,
                msg: "done",
                data: {
                    name: "大宝",
                },
            };
        },
    },
];
```

最后在 vite.config.js 中启用插件：

```js
// vite.config.js
import { viteMockServe } from "vite-plugin-mock";

/** @type import("vite").UserConfig */
export default {
    plugin: [
        viteMockServe({
            // 以下为默认配置
            mockPath: "mock",
            localEnabled: command === "serve",
        }),
    ],
};
```

配置好后我们可以在 main.js 中 fetch 一下查看结果：

```js
// main.js
fetch("/api/user", {
    method: "post",
})
    .then(v => v.json())
    .then(v => {
        console.log("v", v);
    });
```

![image-20230128210351050](https://sbr-1314368469.cos.ap-guangzhou.myqcloud.com/Images/202301282103099.png)

### 插件大致原理

**vite-plugin-html 插件大致原理：**

-   使用 _transformIndexHtml_ 钩子通过正则匹配替换掉指定的 key 值，需要注意的是钩子运行的时机。

```js
// vite-plugin-my-transfrom-html.js

/** @type import("vite").Plugin*/
module.exports = ({ inject: { data = {} } }) => ({
    // 将这个【插件】的调用时机往前调，非必须
    enforce: "pre",
    transformIndexHtml: {
        // 将这个【钩子】的调用时机往前调
        enforce: "pre", // 必须填 pre 赶在核心插件渲染 html 前修改，不然会报错
        transform(baseHtml) {
            for (const key of Object.keys(data)) {
                const reg = new RegExp(`<%[-=] ${key} %>`, "g");
                baseHtml = baseHtml.replace(reg, data[key]);
            }
            return baseHtml;
        },
    },
});
```

**vite-plugin-mock 插件大致原理：**

-   使用 _configureServer_ 钩子

```js
// vite-plugin-my-mock.js
const { statSync } = require("fs");
const { resolve } = require("path");

/** @type import("vite").Plugin*/
module.exports = () => ({
    name: "vite-plugin-my-mock",
    apply: "serve",
    configureServer(_server) {
        /** @type import("vite").ViteDevServer */
        const server = _server;
        const mockData = getMockDataSync();
        // server.middlewares 即 ViteDevServer 服务器的中间件，每次请求都会触发这个中间件
        // 我们就在这里查看每次请求是否需要拦截
        server.middlewares.use((req, res, next) => {
            const mockItem = mockData.find(item => item?.url === req.url);
            // 如果请求中的 url 中包含 mockdata 中的 url，那么拦截他（不 next 放行 ）
            if (mockItem) {
                // 执行 mockitem 的 response 方法，必须传入 req 请求体，不然会报错（这一步是在模拟请求获取数据）
                const interceptData = mockItem.response(req);
                // 随后设置响应体的格式为 json 不然服务器会以为是二进制数据，导致乱码
                res.setHeader("Content-Type", "application/json");
                res.end(JSON.stringify(interceptData));
            } else {
                // 无关请求直接放行
                next();
            }
        });
    },
});

/**
 * @returns {Array}
 */
function getMockDataSync() {
    // 最后调用这个文件的将是 vite.config.js 那么 process.cwd() 就是根目录
    const mockPath = resolve(process.cwd(), "mock");
    const mockStat = statSync(mockPath);
    let result = [];
    if (mockStat.isDirectory()) {
        const indexPath = mockPath + `/index.js`;
        // 同步加载文件获取数据
        result = require(indexPath);
    }
    return result;
}
```

**vite-plugin-aliases 插件大致原理：**

-   通过 node 模块读取指定目录，再根据文件属性创建合法的配置对象。

```js
// vite-plugin-my-create-aliases.js
const { statSync, readdirSync } = require("fs");
const { resolve } = require("path");

const defaultOptions = {
    // 默认前缀
    prefix: "@",
    // 默认扫描目录
    scan: "src",
};

// 这个文件是在服务器上被调用的，所以使用 CommonJS 规范
/** @type import("vite").Plugin*/
module.exports = ({ scan, prefix = defaultOptions.prefix } = defaultOptions) => ({
    name: "vite-plugin-my-createA-liases",
    config() {
        const scanPath = resolve(__dirname, `../${scan || "src"}`);
        const result = createAliasTree(prefix, scanPath);
        return {
            resolve: {
                alias: result,
            },
        };
    },
});

/**
 * @param {string} prefix
 * @param {string} byPath
 * @returns {Object}
 */
function createAliasTree(prefix, byPath) {
    const result = {};
    const folderTree = readdirSync(byPath);
    for (const folderName of folderTree) {
        const filePath = resolve(__dirname, "../src", folderName);
        // statSync 返回一个文件的所有信息
        const stat = statSync(filePath);
        const outName = prefix + folderName;
        if (stat.isDirectory()) {
            result[outName] = filePath;
        }
    }
    return result;
}
```

##
