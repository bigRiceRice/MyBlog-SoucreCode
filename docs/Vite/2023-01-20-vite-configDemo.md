---
title: Vite 常用配置项
author: bigRice
date: 2023-01-20
location: 云梦泽
summary: 以代码的形式，记录了一些常用的 vite.congig.js 配置项
tags:
    - Vite
---

## 常用配置

```js
import { defineConfig } from "vite";
import { ViteAliases } from "vite-aliases";
import createDataToHtml from "vite-plugin-html";
import { viteMockServe } from "vite-plugin-mock";
import compressionToGZIP from "vite-plugin-compression";
import importToCdn from "vite-plugin-cdn-import";
const { resolve } = require("path");

export default defineConfig(() => ({
    // 依赖优化
    optimizeDeps: {
        // 排除依赖预构建的包名
        exclude: ["lodash-es"],
    },
    // 自定义环境变量匹配前缀
    envPrefix: "APP_",
    // 对 CSS 文件的打包结果进行配置
    css: {
        modules: {
            // 设置生成的类名映射对象 Key 的格式
            localsConvention: "camelCaseOnly",
            // 自定义生成唯一性类名替换的规则
            generateScopedName: name => Math.random() + name,
            // 将默认规则中的哈希值变得更加独特（可重复性更小）。
            hashPrefix: "h1e2l3lo",
            // 设置一些 CssModule 文件路径，表示这些文件不参与到模块化类名替换中
            globalModulePaths: ["./index.module.css"],
        },
        preprocessorOptions: {
            // 预处理器配置，以下的对象内容都会交给相应的预处理器的 cli 工具
            less: {
                // 定义全局变量
                globalVars: { color1: "hsl(15,50%,50%)" },
                // 以及任何 less 中支持的命令参数，如 --math always 可以写作 { math: "always" }
            },
            // sass、xxss ...
        },
        postcss: {
            // postcss 后处理器配置，同 postcss.config.js
            // 配置插件
            plugins: [
                // 自动预设，包括自动补全前缀，代码降级等功能
                postcssPresetEnv(/* potions */),
                // ...
            ],
        },
        devScurcemap: true, // 是否在开发时开启 css 文件的源文件索引跳转
    },
    resolve: {
        // 配置路径别名
        alias: {
            // key 为唯一标识符 value 为路径真实地址
            "@": resolve(__dirname, "./src"),
        },
    },
    build: {
        // 配置生产相关
        // 自定义打包后存放代码的目录名称，默认值为 dist
        outDir: "MyOutFolder",
        // 自定义打包后存放静态资源的目录名称，默认值为 assets
        assetsDir: "public",
        // 自定义静态资源中 base64 处理的阈值，默认值为 4kb 以下资源自动转换为 base64 格式
        assetsInlineLimit: 1024 * 10,
        // 代码压缩策略,默认为 esbuild
        minify: false,
        // 配置 rullup 打包策略
        rollupOptions: {
            // 控制输出
            output: {
                // asset 目录的静态资源中文件名称的规则
                assetFileNames: "[name].[hash].[ext]",
                // 分包策略：自定义公共模块
                manualChunks: {
                    lodash: ["lodahs"],
                },
            },
            // ... 其他 rollup 配置
        },
    },
    plugins: [
        // 向 index.html 中注入变量
        createDataToHtml({
            inject: {
                // data 内的内容将会被注入到 html 中，html 需要使用 ejs 语法接收
                data: {
                    title: "Home - 首页",
                },
            },
        }),
        // 开启 CDN 加速
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
        // 读取 /src 下的目录自动补全路径别名
        ViteAliases(),
        // 自动扫描根目录下 mock 目录下的 index.js 的返回值，随后监听并拦截本地请求
        viteMockServe(),
        // 开启代码压缩 ---> gzip
        compressionToGZIP(),
    ],
}));
```
