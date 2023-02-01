---
title: Webpack 入门
author: BigRice
date: 2022-01-19
location: 云梦泽
summary: Webpack
tags:
    - Webpack
---

## Webpack 是什么?

我们可以引用官方文档上的一段话：

> 本质上，webpack 是一个用于现代 JavaScript 应用程序的 **静态模块打包工具**。当 webpack 处理应用程序时，它会在内部从一个或多个入口点构建一个 依赖图(dependency graph)，然后将你项目中所需的每一个模块组合成一个或多个 bundles，它们均为静态资源，用于展示你的内容。

通俗的来讲，Webpack 是一个打包工具，我们可以将写好的例如 .jsx & .vue & .less 代码使用 Webpack 打包（以及一系列处理）后输出为浏览器能够识别的 JS 代码。

通过一张典中典的图可以直观的感受到 Webpack 的作用：

![image-20230131182409976](https://sbr-1314368469.cos.ap-guangzhou.myqcloud.com/Images/202301311824072.png)

下面我们可以写一个小例子来感受一下 Webpack

### 起步

首先我们创建一个目录，初始化 NPM，随后在本地安装 webpack，以及 webpack-cli（此工具用于在命令行中运行 webpack）

> 可以这么理解 webpack 与 webpack-cli 之间的关系
>
> - webpack 为源代码包。
> - webpack-cli 为调用源代码包的程序，我们需要通过它来调用 webpack 中的代码。

```powershell
mkdir webpack-demo
cd webpack-demo
yarn init -y
yarn add webpack webpack-cli --D
```

现在，我们将创建以下目录结构、文件和内容：

```diff
webpack-Demo
├─ index.html
├─ node_modules
├─ package.json
├─ src
│    └─ index.js
└─ yarn.lock
```

> Webpack 默认入口程序的名称为 index.js 而 Vite 默认入口程序的名称为 main.js

src/index.js

```js
function component() {
  const element = document.createElement('div');

  // lodash（目前通过一个 script 引入）对于执行这一行是必需的
  element.innerHTML = _.join(['Hello', 'webpack'], ' ');

  return element;
}

document.body.appendChild(component());
```

index.html

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>起步</title>
    <script src="https://unpkg.com/lodash@4.17.20"></script>
  </head>
  <body>
    <script src="./src/index.js"></script>
  </body>
</html>
```

在此示例中，`<script>` 标签之间存在隐式依赖关系。在 `index.js` 文件执行之前，还需要在页面中先引入 `lodash`。这是因为 `index.js` 并未显式声明它需要 `lodash`，假定推测已经存在一个全局变量 `_`。

使用这种方式去管理 JavaScript 项目会有一些问题：

- 无法直观的感受项目中使用到了哪些依赖
- 如果依赖不存在，或者引入顺序错误，应用程序将无法正常运行。
- 如果依赖被引入但是并没有使用，浏览器将被迫下载无用代码。

让我们试着使用 webpack 来管理这些脚本。

首先，我们稍微调整下目录结构，创建分发代码(`./dist`)文件夹用于存放分发代码，源代码(`./src`)文件夹仍存放源代码。

- 源代码是指用于书写和编辑的代码。

- 分发代码是指在构建过程中，经过最小化和优化后产生的输出结果，最终将在浏览器中加载。

调整后目录结构如下：

```
Webpack-Demo
├─ dist
│    └─ index.html
├─ node_modules
├─ package.json
├─ src
│    └─ index.js
└─ yarn.lock
```

添加一个 lodash 库：
```powershell
yarn add lodash
```

将 index.js 改写成如下代码：

```js
import _ from 'lodash';

function component() {
    const element = document.createElement('div');
    // lodash 在当前 script 中使用 import 引入
    element.innerHTML = _.join(['Hello', 'webpack'], ' ');

    return element;
}

document.body.appendChild(component());
```

现在，我们将会打包所有脚本，我们必须更新 `index.html` 文件。由于现在是通过 `import` 引入 lodash，所以要将 lodash `<script>` 删除，然后修改另一个 `<script>` 标签来加载 bundle，而不是原始的 `./src` 文件：

将 index.html 改写成这样：

```html
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8" />
        <title>起步</title>
    </head>
    <body>
        <script src="main.js"></script>
    </body>
</html>
```

随后执行 `npx webpack` 进行打包：

![image-20230131193502841](https://sbr-1314368469.cos.ap-guangzhou.myqcloud.com/Images/202301311935924.png)

![image-20230131193845135](https://sbr-1314368469.cos.ap-guangzhou.myqcloud.com/Images/202301311938200.png)

可以看到 webpack 将 index.js 打包输出为了 main.js ，并输出了一行警告，这是因为我们并没有设置模式，默认使用了 `production` 生产模式进行打包，生成模式的打包会尽量将代码压缩到最小，所以我们可以查看 dist/main.js 可以看到代码已经不具有可读性：

![image-20230131194005278](https://sbr-1314368469.cos.ap-guangzhou.myqcloud.com/Images/202301311940358.png)

但这个文件是可以**正常运行**的，我们可以将 dist 目录下的所有文件拷贝至一个新的目录，再使用 live serve 插件启动 index.html 查看运行情况：

![image-20230131194255033](https://sbr-1314368469.cos.ap-guangzhou.myqcloud.com/Images/202301311942109.png)



这就是一个最简单的、使用 Webpack 管理的项目的最小实现，Webpack 的出现帮助了**早期的前端开发**解决了上面提到的几个痛点：

- 无法直观的感受项目中使用到了哪些依赖
- 如果依赖不存在，或者引入顺序错误，应用程序将无法正常运行。
- 如果依赖被引入但是并没有使用，浏览器将被迫下载无用代码。

一个由 Webpack 打包的项目，可以完美解决这几个问题。



### 废话

在项目开发中 Webpack 不仅仅是一个单纯的打包工具，经过数十年的发展，社区贡献了大量的插件与 loader（转换器），这让 Webpack 具有**超强的可扩展性与极度的灵活性**。

早期浏览器没有统一模块化标准的时候，Webpack 的出现在某种程度上统一了模块化标准，因为它在打包的途中可以做文章的地方太多了。虽然现在已经统一为 ESM 标准了，但 Webpack 仍是在兼容性上表现很好的一款打包工具了。

> 如果你有过 Vite 项目的经验，可能会觉得 Webpack 过于繁琐，这是不可避免的。要知道 Webpack 已经火了快 10 年了（2012 ~ 2023），



## 概念

在深入 Webpcak 前我们必须了解以下**核心概念**：

- [入口(entry)](https://www.webpackjs.com/concepts/#entry)
- [输出(output)](https://www.webpackjs.com/concepts/#output)
- [loader](https://www.webpackjs.com/concepts/#loaders)
- [插件(plugin)](https://www.webpackjs.com/concepts/#plugins)
- [模式(mode)](https://www.webpackjs.com/concepts/#mode)
- [浏览器兼容性(browser compatibility)](https://www.webpackjs.com/concepts/#browser-compatibility)
- [环境(environment)](https://www.webpackjs.com/concepts/#environment)

以上这些概念都需要一份配置文件做支撑，默认情况下，webpack-cli 在执行期间会读取根目录下的 `webpack.config.js` 文件。根据配置文件的配置来做出不同的响应。

配置文件的最佳实践一般为这样：
```js
// webpack.congig.js

/**@type {import('webpack'.Configuration)} */
const webpackConfig = {
    // options ...
};
module.exports = webpackConfig;
```



### Entry 入口

默认情况下， webpack 会将src/index.js 作为入口文件，随后根据它的导入依赖递归构建一个[模块依赖关系图](https://www.webpackjs.com/concepts/dependency-graph/)，有了正确的入口，才能确保打包过后的中的模块依赖就不会出错，避免出现使用到的模块还没有定义的情况。

我们可以在配置文件通过 `enrty` 属性配置：

```js
module.exports = {
    entry: './src/index.js',
}; 
```

上面这种定义形式为**单个入口**的简写语法，还可以创建一个数组存放入口文件。

```js
module.exports = {
    entry: ['./main.js', './index.js'],
}; 
```

作为数组形式的两个文件最终会合并为一个文件，但在 ES6 以后我们可以直接通过 `import` 导入另一个文件，所以数组形式很少用。

还有一种对象语法，它看起来是这样的：

```ts
entry: { <entryChunkName> string | [string] } | {}
```

```js
module.exports = {
    entry: {
        newapp: './src/app.js',
        adminApp: {
            dependOn: 'newapp',
            fileName: 'adminApp',
            import: './src/adminApp.js',
        },
    },
};
```

其实上面的 `  entry: './index.js'` 就是如下配置的简写形式：

```js
module.exports = {
    entry: {
        // index.js --> main.js
        main: './src/index.js',
    },
};
```

对象语法会比较繁琐。然而，我们可以在对象语法中提供**更多的配置选项**，如果写成字符串，就无法配置了。

当我们使用对象语法配置 entry 后，还有两种不同的形式：一种是 `key : string` ，一种是 `key : object`，

- 当 value 等于路径字符串时，其实就是 ` entry: ''` 的原配置，之不过它是一个语法糖。
    - 这种形式下的 key 就是 value 路径文件打包过后的文件名。
- 当 value 等于对象时 ，它就支持了更多配置选项，它是一个**描述入口的对象**。
    - 这种形式下的 key 不再是 value  路径文件打包过后的文件名了，而是一个 chunk ，一个流程的统称。

#### 描述入口的对象的配置项

假设你使用了用于描述入口的对象，那么你可以使用如下属性：

- `filename`: 指定要输出的文件名称。
- `import`: 指定的入口文件路径字符串。
- `library`:  指定 library 选项，为当前 entry 构建一个 library。
- `dependOn`: 当前入口所依赖的运行时 chunk 名。它们必须在该入口被加载前被加载。
- `runtime`: 运行时 chunk 的名字。如果设置了，就会创建一个新的运行时 chunk。
    - 在 webpack 5.43.0 之后可将其设为 `false` 以避免一个新的运行时 chunk。
- `publicPath`: 当该入口的输出文件在浏览器中被引用时，为它们指定一个公共 URL 地址。请查看 [output.publicPath](https://www.webpackjs.com/configuration/output/#outputpublicpath)。

##### 关于 Runtime 

> [Runtime 分包](https://juejin.cn/post/6961724298243342344#heading-4)

首先我们要知道一个前提，即每一个描述入口的对象都是一个在 Webpack 打包时的进程，那么一个进程在打包中可能产生一些的资源，如果我们使用了 runtime 记录并共享这个运行过程时的资源，那么另一个进程在打包过程中就可以依赖这个 runtime 运行时名来完成不必要的资源定义了。

另一个进程设置同名 Runtime 配置项即可完成运行时环境绑定。

如何使用？请看如下代码

```js
module.exports = {
    entry: {
        a: {
            fileName: 'a',
            import: './a.js',
            // 设置一个 runtime 运行时环境的名称
            // 我们对 a.js 打包所产生的一些资源将可以共享出去
            runtime: 'aRuntime'
        },
        b: {
            fileName: 'b',
            import: './b.js',
            // 设置一个定义过的 runtime 运行时环境的名称
            // 我们对 b.js 的打包过程中可以使用 a.runtime 运行时来获取共享的资源，避免重复定义资源
             runtime: 'aRuntime'
        },
    },
};
```

需要注意的是，

- 一个描述对象中无**法同时定义 Runtime 和 DepenOn 配置项**。
    - 你不能同时定义依赖与运行时依赖
- 确保 `runtime` 不能指向已存在的**入口名称**，如上例：b.runtime 不能为 "a"

