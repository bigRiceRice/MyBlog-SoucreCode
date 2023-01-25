---
title: Vite 配置项讲解
author: bigRice
date: 2023-01-20
location: 云梦泽
summary: Vite 一些常用的配置项的作用笔记
tags:
    - Vite
---

## CSS 预处理与模块化配置

### 前言

#### 对 Css 的默认处理

Vite 对 css 文件的支持是开箱即用的，在 js 文件中直接导入一个 css 文件会**直接生效**，内部处理的流程大致如下：

1. Vite 读取到 js 脚本文件中导入了 css 样式文件
2. 使用 fs 模块读取 css 文件内容
3. 新建一个 `<style>` 元素并将读取到的 css 文件内容插入
4. 将这个 `<style>` 元素插入到 index.html 中的 `<head>` 下
5. 将 css 文件的内容替换为 js 脚本，以方便热更新

> 浏览器读取文件的内容其实不关是看文件的后缀名，影响读取方式**权重最大**的是看 `Content-Type` 标头的取值，只要 `Content-Type` 的值为 `text/javascript` 那么无论后缀名是啥，都会把它当作 js 脚本。

####  预处理器支持

我们都知道，若一个原始的 html 文件想要使用 less、scss 等预处理器工具，直接导入也是无效的，必须先手动的编译生成 css 文件后才能正常引入。

而 Vite 对预处理器支持也是非常顶的🤙，只需要安装对应的预处理包即可，正常使用的话任何额外配置项都不需要！

#### 后处理器支持

这里所说的“后处理器”指的是 Postcss，相信很多人跟我一样，经常能在各种项目中看到 Postcss 的身影，却不知道它的具体用处何在。

简单来说，Postcss 与 Babel 非常类似，它同样用于完成 Css 代码的降级，语法的兼容，那么为何称它为“**后**”处理器呢？

因为它与 less、sass 这类预处理器有着本质的不同：即 Postcss 的输入与输出产物都是 css 文件。因此，Postcss 也被成为**「后处理器」**，因为其通常在 css 处理链条的**最后端**。

而在 Vite 中也对 Postcss 有着良好的支持🤟。

####  模块化支持

假如有很多的模块都需要使用同一个样式文件，项目庞大后，难免会造成样式污染影响到开发，值得庆幸的是，Vite 很好地支持 *CssModule*（Css 模块化）。

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

#### *modules.localsConvention*

```ts
localsConvention?: 'camelCase' | 'camelCaseOnly' | 'dashes' | 'dashesOnly' | ((originalClassName: string, generatedClassName: string, inputFile: string) => string);
```

localsConvention 配置项定义了 CssModule 文件中默认导出对象中 Key 的**格式**，取值为：

- *camelCase*：小驼峰写法
    - `.test-demo--> testDemo`
- *camelCaseOnly*：只有小驼峰写法
- *dashes*：短横线写法
- *dashesOnly*：**默认值**，只有短横线写法
- 或者自定义一个函数返回自定义映射关系

> Vite^4.0.4 版本中貌似有 BUG，只要 localsConvention 有值，那么**都将会**生产小驼峰的映射关系

#### *modules.generateScopedName*

```ts
generateScopedName?: string | ((name: string, filename: string, css: string) => string);
```

generateScopedName 配置项可以自定义生成唯一性类名替换的规则

- *string*：是一个 *[interpolateName](https://github.com/webpack/loader-utils#interpolatename)* 语法的占位符，它看起来像这样：`"[local]_[hash:5]"`
- 或者自定义一个规则函数

#### *modules.hashPrefix*

```ts
hashPrefix?: string;
```

hashPrefix 配置项用于将默认规则中的哈希值变得更加独特（可重复性更小）。

> 该配置项用于给哈希值添加一个前缀，因为内部的规则是根据 **文件名 + 哈希值 + 其他依据** 生成的唯一类名，而哈希值的生成规则是**字符串不同的越多，可重复性更小**。

#### *modules.globalModulePaths*

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
            less:{
                // ...
            },
            sass:{
                // ...
            }
        },
    },
}));

```

preprocessorOptions 中对预处理的配置需要查看官方文档来获知：[less](https://less.bootcss.com/usage/#lessjs-options)、[sass]()

- 比如 less 中的 ***lessc*** 编译指令是可以携带参数

    假设 *lessc* 命令是这样配置的：

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


#### *less.globalVars*

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
>

### *devSourcemap*

该配置项定义是否开启**记录源文件索引地址**

在我们的开发过程中，如果我们想查看某个样式的源文件在哪，是无法直接跳转的，而是会跳转到相应的 style 标签体中，而当我们配置了 devScurcemap 这个配置项后，就可以追踪到源文件的路径了。



### Postcss 配置项

在原生项目中，若需要加工处理 Css 代码，需要安装 *postcss 、postcss-cli* 两个包，随后调用类似 `npx postcss [filename].css -o out.css` 命令完成处理，而且配置项需写在 `postcss.config.js` 文件中，这非常的繁琐！

而在 Vite 中，只需要填写 postcss 字段，即可完成 Postcss 的配置：

```js
/** @type import("vite").UserConfig */
export default {
    css: {
        postcss:{
            // ...
        }
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
        postcss:{
            plugins: [postcssPresetEnv(/* optins */) ]
        }
    },
};
```

随后我们项目中所有的 Css 代码都将被自动加工处理👋。

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



## 参考文章 & 视频

- [Vite世界指南（带你从0到1深入学习 vite）](https://www.bilibili.com/video/BV1GN4y1M7P5/?spm_id_from=333.337.search-card.all.click&vd_source=8d08e7af2575a84783be5a41708ac09e)

- [浏览器、ESM规范、模块化、webpack和vite之间联系？](