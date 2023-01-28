---
title: Vite 配置项讲解
author: bigRice
date: 2023-01-20
location: 云梦泽
summary: Vite 一些常用的配置项的作用笔记
tags:
    - Vite
---

## CSS 预处理 & 模块化配置

### 前言

#### 对 Css 的默认处理

Vite 对 css 文件的支持是开箱即用的，在 js 文件中直接导入一个 css 文件会**直接生效**，内部处理的流程大致如下：

1. Vite 读取到 js 脚本文件中导入了 css 样式文件
2. 使用 fs 模块读取 css 文件内容
3. 新建一个 `<style>` 元素并将读取到的 css 文件内容插入
4. 将这个 `<style>` 元素插入到 index.html 中的 `<head>` 下
5. 将 css 文件的内容替换为 js 脚本，以方便热更新

> 浏览器读取文件的内容其实不关是看文件的后缀名，影响读取方式**权重最大**的是看 `Content-Type` 标头的取值，只要 `Content-Type` 的值为 `text/javascript` 那么无论后缀名是啥，都会把它当作 js 脚本。

#### 预处理器支持

我们都知道，若一个原始的 html 文件想要使用 less、scss 等预处理器工具，直接导入也是无效的，必须先手动的编译生成 css 文件后才能正常引入。

而 Vite 对预处理器支持也是非常顶的 🤙，只需要安装对应的预处理包即可，正常使用的话任何额外配置项都不需要！

#### 后处理器支持

这里所说的“后处理器”指的是 Postcss，相信很多人跟我一样，经常能在各种项目中看到 Postcss 的身影，却不知道它的具体用处何在。

简单来说，Postcss 与 Babel 非常类似，它同样用于完成 Css 代码的降级，语法的兼容，那么为何称它为“**后**”处理器呢？

因为它与 less、sass 这类预处理器有着本质的不同：即 Postcss 的输入与输出产物都是 css 文件。因此，Postcss 也被成为**「后处理器」**，因为其通常在 css 处理链条的**最后端**。

而在 Vite 中也对 Postcss 有着良好的支持 🤟。

#### 模块化支持

假如有很多的模块都需要使用同一个样式文件，项目庞大后，难免会造成样式污染影响到开发，值得庆幸的是，Vite 很好地支持 _CssModule_（Css 模块化）。

在 Vite 项目中若要开启一个 css 文件的模块化，那么它的文件后缀**必须**为 `.module.css` ，这之后就可以在 js 文件中导入使用了。

> 正常情况下 js 脚本中是无法引入 css 样式文件的，Vite 项目中可以引入都是 Vite 底层自动的帮我们处理好了。

我们可以在 Vite 项目中创建一个 `index.module.css` 随后导入看看效果：

```css
/* index.module.css */
.new-div1,
.new-div2 {
    width: 250px;
    height: 250px;
    background-color: bisque;
}

.new-div2 {
    background-color: gold;
}
```

随后在 main.js 中导入并打印输出：

```js
// main.js
import s1 from "./styles/s1.module.css";
console.log("s1", s1);
```

![image-20230125151342515](https://sbr-1314368469.cos.ap-guangzhou.myqcloud.com/Images/202301251513595.png)

可以看到，我们在 js 导入了 css 文件非但没有报错，且 css 文件还给我们导出了东西。

我们可以再看看 style 标签与服务器响应的 index.module.css 的文件内容：

style 标签内容：

![image-20230125151748047](https://sbr-1314368469.cos.ap-guangzhou.myqcloud.com/Images/202301251517107.png)

index.module.css 文件内容：

![image-20230125151926364](https://sbr-1314368469.cos.ap-guangzhou.myqcloud.com/Images/202301251519438.png)

正常情况下 js 脚本中是无法引入 css 样式文件的，这里可以引入都是 Vite 底层自动的帮我们处理好了。

内部处理的流程大致如下：

1. Vite 读取到 js 脚本中导入了 CssModule 模块化样式表文件
2. 使用 fs 模块读取 CssModule 文件内容，并进行一定规则的替换，达到唯一性
    - 比如将 `.footer-box` 替换为 `_footer_box_xxxx_f1`
3. 同时创建一个类名映射对象，比如 `{footer-box : "_footer_box_xxxx_f1"}`
4. 新建一个 `<style>` 元素并将替换后的 CssModule 文件内容插入
5. 将这个 `<style>` 元素插入到 index.html 中的 `<head>` 下
6. 将 CssModule 文件的内容替换为 js 脚本，脚本的内容是一映射对象的默认导出与一些方便热更新的内容，最后设置 `Content-Type = "text/javascript"`

### 模块化配置项

假如你知道了 Vite 是默认支持 CssMoule 的，我们就可以了解一下几个配置项了，配置文件定义如下：

> 以下的配置项最后都将传给叫做 postcss-modules 的第三方包，Postcss 是 Css 后处理器，可以完成 Css 代码的语法降级，添加前缀等效果，而 postcss-modules 可以完成 Css 模块化

```js
// vite.config.js
import { defineConfig } from "vite";
export default defineConfig(() => ({
    // 对 CSS 文件的打包结果进行配置
    css: {
        // 对 CssModule 文件结果进行配置
        modules: {
            // ...
        },
    },
}));
```

#### _modules.localsConvention_

```ts
localsConvention?: 'camelCase' | 'camelCaseOnly' | 'dashes' | 'dashesOnly' | ((originalClassName: string, generatedClassName: string, inputFile: string) => string);
```

localsConvention 配置项定义了 CssModule 文件中默认导出对象中 Key 的**格式**，取值为：

-   _camelCase_：小驼峰写法
    -   `.test-demo--> testDemo`
-   _camelCaseOnly_：只有小驼峰写法
-   _dashes_：短横线写法
-   _dashesOnly_：**默认值**，只有短横线写法
-   或者自定义一个函数返回自定义映射关系

> Vite^4.0.4 版本中貌似有 BUG，只要 localsConvention 有值，那么**都将会**生产小驼峰的映射关系

#### _modules.generateScopedName_

```ts
generateScopedName?: string | ((name: string, filename: string, css: string) => string);
```

generateScopedName 配置项可以自定义生成唯一性类名替换的规则

-   _string_：是一个 _[interpolateName](https://github.com/webpack/loader-utils#interpolatename)_ 语法的占位符，它看起来像这样：`"[local]_[hash:5]"`
-   或者自定义一个规则函数

#### _modules.hashPrefix_

```ts
hashPrefix?: string;
```

hashPrefix 配置项用于将默认规则中的哈希值变得更加独特（可重复性更小）。

> 该配置项用于给哈希值添加一个前缀，因为内部的规则是根据 **文件名 + 哈希值 + 其他依据** 生成的唯一类名，而哈希值的生成规则是**字符串不同的越多，可重复性更小**。

#### _modules.globalModulePaths_

```ts
 globalModulePaths?: RegExp[];
```

globalModulePaths 配置项可以设置一些 CssModule 的文件路径，表示这些文件不参与到模块化类名替换中

### 预处理器配置项

知道了 Vite 良好的支持预处理器，我们就可以了解一下几个配置项了，配置文件定义如下：

> 以下的配置项最后都将传给 less & sass 等第三方预处理工具

```js
// vite.config.js
import { defineConfig } from "vite";
export default defineConfig(() => ({
    // 对 CSS 文件的打包结果进行配置
    css: {
        // 对预处理器工具进行配置
        preprocessorOptions: {
            less: {
                // ...
            },
            sass: {
                // ...
            },
        },
    },
}));
```

preprocessorOptions 中对预处理的配置需要查看官方文档来获知：[less](https://less.bootcss.com/usage/#lessjs-options)、[sass]()

-   比如 less 中的 **_lessc_** 编译指令是可以携带参数

    假设 _lessc_ 命令是这样配置的：

    ```powershell
    npx lessc --math="always" index.less
    ```

    那么在 vite 中就可以这样完成自动配置：

    ```js
    preprocessorOptions: {
        less:{
            math: "always"
        },
    }
    ```

#### _less.globalVars_

globalVars 配置项可以让我们在配置文件中直接定义 less 的全局变量

假设我们在 globarVars 中定义了一个合法的 css 变量对象，那么在 less 文件中是可以直接使用的：

```js
/** @type import("vite").UserConfig */
export default {
    css: {
        preprocessorOptions: {
            less: {
                globalVars: {
                    color1: "hsl(1,50%,50%)",
                    color2: "hsl(150,50%,50%)",
                },
            },
        },
    },
};
```

less 文件内容：

```less
/* styles/s2.module.less */
.less-div1,
.less-div2 {
    width: (500px / 2);
    height: (500px / 2);
    background-color: @color2;
    border-radius: 50%;
}

.less-div2 {
    background-color: @color1;
}
```

main.js 文件内容：

```js
// main.js
import { lessDiv1, lessDiv2 } from "./styles/s2.module.less";
const l1 = document.createElement("div");
const l2 = document.createElement("div");

l1.className = lessDiv1;
l2.className = lessDiv2;

document.body.appendChild(l1);
document.body.appendChild(l2);
```

效果：

<img src="https://sbr-1314368469.cos.ap-guangzhou.myqcloud.com/Images/202301251740423.png" alt="image-20230125174057365" style="zoom:50%;" />

> 其实更好的做法是额外定义一个 js 文件定义全局变量后默认导出，再导入使用即可。

### _devSourcemap_

该配置项定义是否开启**记录源文件索引地址**

在我们的开发过程中，如果我们想查看某个样式的源文件在哪，是无法直接跳转的，而是会跳转到相应的 style 标签体中，而当我们配置了 devScurcemap 这个配置项后，就可以追踪到源文件的路径了。

```js
/** @type import("vite").UserConfig */
export default {
    css: {
        devScurcemap: true,
    },
};
```

### Postcss 配置项

在原生项目中，若需要加工处理 Css 代码，需要安装 _postcss 、postcss-cli_ 两个包，随后调用类似 `npx postcss [filename].css -o out.css` 命令完成处理，而且配置项需写在 `postcss.config.js` 文件中，这非常的繁琐！

而在 Vite 中，只需要填写 postcss 字段，即可完成 Postcss 的配置：

```js
/** @type import("vite").UserConfig */
export default {
    css: {
        postcss: {
            // ...
        },
    },
};
```

比如我们可以为 Postcss 添加一个预设（就跟 babel-parset-env 类似的预设），就可以自动的完成 Css 代码处理。

首先下载 `postcss-parset-env` 包：

```powershell
yarn add postcss-preset-env
```

随后添加如下配置：

```js
const postcssPresetEnv = require("postcss-preset-env");
/** @type import("vite").UserConfig */
export default {
    css: {
        postcss: {
            plugins: [postcssPresetEnv(/* optins */)],
        },
    },
};
```

随后我们项目中所有的 Css 代码都将被自动加工处理 👋。

比如我导入一个这样的样式文件：

```css
/* index.css */
:root {
    --color1: hsl(15, 50%, 50%);
}
body {
    height: 100%;
    background-color: var(--color1);
    width: clamp(500px, 50vw, 70vw);
    color: #fff;
    border: 1px solid;
    user-select: none;
}
```

那么将会自动处理为如下：

```css
/* index.css */
:root {
    --color1: hsl(15, 50%, 50%);
}
body {
    height: 100%;
+   background-color: hsl(15, 50%, 50%);
    background-color: var(--color1);
    width: max(500px, min(50vw, 70vw));
    color: #fff;
    border: 1px solid;
+   -webkit-user-select: none;
+      -moz-user-select: none;
            user-select: none;
}
```

## 静态资源处理 & 路径别名

### 静态资源

Vite 中对任何的静态资源都是**开箱即用**的，无论你引入的是 _png & jpeg & jpg & svg & mp4 & mp3 ..._ 内容，Vite 都会默认将它转换为**资源的相对路径**，我们可以尝试引入资源：

> 在开发中，静态资源是狭义的图片、SVG、视频、.ico 等资源，而在服务器上，项目中 99% 的内容都是广义上的静态资源，除了需要动态获取的数据。

假设项目中有一个 src/assets/ 目录，现在它们的内容如下：

```
src/assets
├─ images
│	├─ img1.jpg
│	└─ shield_icon.svg
└─ video1.mp4
```

随后定义一个 JS 文件导入文件后打印输入：

```js
// @ 开头的目录为路径别名，需要在 viet.config.js 中配置
import video1 from "@assets/video1.mp4";
import svg1 from "@images/shield_icon.svg";
import img1 from "@images/img1.jpg";

console.log("video1", video1); // -> /src/assets/video1.mp4
console.log("svg1", svg1); // -> /src/assets/images/shield_icon.svg
console.log("img1", img1); // -> /src/assets/images/img1.jpg
```

没错，会直接获取到指定文件的相对路径，因为 Vite 自动将资源的内容处理为 JS 脚本，并默认导出相对路径。其实它们的二进制内容已经被替换为 JS 脚本了：

<img src="https://sbr-1314368469.cos.ap-guangzhou.myqcloud.com/Images/202301271405751.png" alt="image-20230127140522677" style="zoom:67%;" />

所以我们就可以直接将路径用于 img & video 标签的 src 属性上了，这就是对静态资源的开箱即用。

那么其实这里有一个问题，就是导入的 svg 矢量图将如何显示？你可能知道可以直接使用 img 标签来导入 svg 的路径使用，这显然也是可行的：

```js
import svg1 from "@images/shield_icon.svg";
const i1 = document.createElement("img");
i1.src = svg1;
document.body.appendChild(l1);
```

<img src="https://sbr-1314368469.cos.ap-guangzhou.myqcloud.com/Images/202301271412253.png" alt="image-20230127141203191" style="zoom:67%;" />

但这样我们就失去了 svg 图片的一些特性，比如修改颜色等。那么这个时候我们就可以传递一个 `raw` 参数，指定需要的是原始数据而非资源路径。

#### _raw_

我们可以通过在资源路径的最末尾加上 `?raw` 表示需要的是**原始数据**（二进制文本）。

```js
import svg1 from "@images/shield_icon.svg?raw";
document.body.innerHTML += svg1;
```

<img src="https://sbr-1314368469.cos.ap-guangzhou.myqcloud.com/Images/202301271520302.png" alt="image-20230127152044239" style="zoom:67%;" />

与之对应的是 `url` 参数，也就是默认值。

#### _url_

我们可以通过在资源路径的最末尾加上 `?url` 表示需要的是**资源相对路径**。

```js
import svg1 from "@images/shield_icon.svg?url";
```

### 路径别名

当我们遇到一个组件定义在很深的目录下，导致引用的层级变得非常烦人，在大型项目中甚至可能遇见 `../../../../src/assets/images/img.jpg` 这样的迷惑路径。

那么**路径别名**可以很好的帮到你，它的功能就像 Moba 游戏中在指定位置中插一个眼，需要过去的时候再 _传送_ 过去。

路径别名的定义是这样的：

```js
const { resolve } = require("path");

/** @type import("vite").UserConfig */
export default {
    resolve: {
        // 配置别名，将会传递给 @rollup/plugin-alias 的 entries 配置
        alias: {
            // resolve 的返回值是一个绝对路径
            "@src": resolve(__dirname, "../../src"),
            "@assets": resolve(__dirname, "../assets"),
            "@images": resolve(__dirname, "../assets/images"),
        },
    },
};
```

我们需要在 `resolve` 属性下定义一个名为 `alias` 的对象，此对象的 key 是一个唯一的标识符，value 是指定的真实资源路径。

当我们定义好别名对象后，Vite 就会在打包时检查一遍所有资源的导入路径，若发现标识符 key ，则将它替换为 value。

**value 路径需要注意的点：**

-   value 路径请始终使用**绝对路径**。相对路径的别名值会原封不动地被使用，因此无法被正常解析。
    -   所以最好使用 `path` 模块的 `resolve` 方法来拼接，以消除*某些可能存在的 BUG 或不同操作系统下的兼容性*。

当我们定义好路径别名后，在项目中就可以像这样使用了：

```js
import video1 from "@assets/video1.mp4";
import svg1 from "@images/shield_icon.svg";
import img1 from "@images/img1.jpg";
```

如果你打开浏览器查看真实生效的源代码，会发现以上代码会被替换为如下代码：

```js
import video1 from "/src/assets/video1.mp4";
import svg1 from "/src/images/shield_icon.svg";
import img1 from "/src/images/img1.jpg";
```

## 关于打包 & 打包配置

### 前言

#### 😮 打包后使用 live serve 插件启动项目报错

当我们执行 `yarn build` 后，会在根目录下生成一个 dist 目录，里面存放的是我们所有代码的压缩文件，以我的 Demo 为例，打包后的文件目录长这样：

![image-20230127231209938](https://sbr-1314368469.cos.ap-guangzhou.myqcloud.com/Images/202301272312014.png)

此时直接在 index.html 启用一个 `live serve` 服务器，是无法正常的打开页面的，会提示 `404` 错误，这里的原因很简单，因为 `live serve` 插件默认是启用根据工程目录来启用服务器的，它的本地地址应该是这样的

```
http://127.0.0.1:60649/dist/index.html
```

而我们项目中的资源导入的地址是基于根目录的（即 127.0.0.1），而此时插件的本地服务器根目录是 dist，所以自然而然无法访问到资源，所以报错，解决方法也很简单：新建一个空的文件夹，将 dist 目录下的所有内容全部拷贝进去。再启用 `live serve` 就可以正常打开页面了。

#### 😮 文件后的哈希乱码有何用处

你也肯定也注意到了，打包后除了 index.html 文件，所有文件的末尾都有一个 `-` 开头的哈希乱码，那么这串哈希乱码有何用处呢？

简单来说，是一个利用哈希乱码的巧妙运用，旨在绕过浏览器引用缓存文件机制，达到更新文件。

-   浏览器文件缓存机制
    -   浏览器为了减少性能占用，在第一次请求文件完成后，会将此文件丢到缓存去，那么下一次刷新后就可以直接利用缓存中的文件从而减少性能占用了。
-   哈希乱码生成规则
    -   哈希乱码的生成根据内容而产生不同的结果，若传入的内容不变，那么生成的结果不变，若内容修改，结果修改。

### 打包配置

在 Vite 中，底层使用了 _rollup_ 第三方包来完成小模块的打包。

> rollup 提供一个充分利用 ESM 各项特性的打包器，可以构建出结构比较扁平，性能比较出众的类库，一个纯粹、高效的代码打包工具

Vite 的打包配置没什么值得说道的地方，所以这里直接上代码：

```js
/** @type import("vite").UserConfig */
export default {
    // 配置生产相关
    build: {
        // 自定义打包后存放代码的目录名称，默认值为 dist
        outDir: "MyOutFolder",
        // 自定义打包后存放静态资源的目录名称，默认值为 assets
        assetsDir: "public",
        // 自定义静态资源中 base64 处理的阈值，默认值为 4kb 以下资源自动转换为 base64 格式
        assetsInlineLimit: 1024 * 10,
        // 配置 rullop 打包策略
        rollupOptions: {
            // 控制输出
            output: {
                // asset 目录的静态资源中文件名称的规则
                assetFileNames: "[name].[hash].[ext]",
            },
        },
    },
};
```

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

> ##### 致插件创作者
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

### 全局钩子

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

请注意 [`moduleParsed`](https://rollupjs.org/guide/en/#moduleparsed) 钩子在开发中是 **不会** 被调用的，因为 Vite 为了性能会避免完整的 AST 解析。

[Output Generation Hooks](https://rollupjs.org/guide/en/#output-generation-hooks)（除了 `closeBundle`) 在开发中是 **不会** 被调用的。你可以认为 Vite 的开发服务器只调用了 `rollup.rollup()` 而没有调用 `bundle.generate()`。

### Vite 独有钩子（常用）

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

在解析 Vite 配置后调用。使用这个钩子读取和存储最终解析的配置。当插件需要根据运行的命令做一些不同的事情时，它也很有用。

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

#### _transformIndexHtml_

```ts
IndexHtmlTransformHook | { enforce: "pre" | "post", transform: IndexHtmlTransformHook };
```

转换（修改） `index.html` 的专用钩子。钩子接收当前的 HTML 字符串和转换上下文。上下文在开发期间暴露[`ViteDevServer`](https://vitejs.cn/vite3-cn/guide/api-javascript.html#vitedevserver)实例，在构建期间暴露 Rollup 输出的包。

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

## 常用插件 & 手写插件

如果你知道 Vite 的独有钩子，那么你就可能已经知道如何手写 vite-aliases 了，就是通过 node 模块读取指定目录，再根据文件属性创建合法的配置对象就好了。

我们先在根目录下创建一个 `plugins` 目录，里面用于存放我们自己写的插件。

```
mkdia plugins
```

随后创建一个 `vite-plugin-my-create-aliases.js` 文件，随后输入以下代码，代码很好理解：

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

// 这个文件是在服务器上运行的，所以使用 CommonJS 规范
/** @type {(import("vite").Plugin | import("vite").PluginContainer )}*/
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
 * @returns object
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

随后使用插件：

```js
import createAliases from "./plugins/vite-plugin-my-create-aliases";
/** @type import("vite").UserConfig */
export default {
    plugin: [createAliases()],
};
```

## 参考文章 & 视频

-   [Vite 世界指南（带你从 0 到 1 深入学习 vite）](https://www.bilibili.com/video/BV1GN4y1M7P5/?spm_id_from=333.337.search-card.all.click&vd_source=8d08e7af2575a84783be5a41708ac09e)
