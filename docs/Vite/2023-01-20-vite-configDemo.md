---
title: Vite Configs Demo
author: bigRice
date: 2023-01-20
location: 云梦泽
summary: 记录了一些 Vite 常用的配置项 
tags:
    - Vite
---



```js
import { defineConfig } from "vite";
const postcssPresetEnv = require("postcss-preset-env");

export default defineConfig(() => ({
    optimizeDeps: { // 依赖优化配置
        // 需要取消依赖预构建的包名
        exclude: ["lodash-es","..."],
    },
    envPrefix: "APP_", // 自定义环境变量匹配前缀
    css:{  // css 文件处理配置
        modules:{ // 模块化处理，以下的配置内容都会交给 postcss-modules 第三方包处理 
            // 定义了 CssModule 文件中默认导出对象中 Key 的格式
            localsConvention: "camelCaseOnly",
            // 自定义生成唯一性类名替换的规则
            generateScopedName: "[local]_[hash:5]",
            // 用于将默认规则中的哈希值变得更加独特（可重复性更小）
            hashPrefix: "test-hello",
            // 设置一些 CssModule 的文件路径，表示这些文件不参与到模块化类名替换中
            globalModulePaths: ["./xxx.module.css","..."]
        },
        preprocessorOptions: { // 预处理器配置，以下的对象内容都会交给相应的预处理器的 cli 工具
            less:{
                // 定义全局变量
                globalVars: { color1 : "hsl(15,50%,50%)" }
                // 以及任何 less 中支持的命令参数，如 --math always 可以写作 { math: "always" }                
            },
            // sass、xxss ...
        },
        postcss:{ // postcss 后处理器配置，同 postcss.config.js
            // 配置插件
            plugins: [ 
                // 自动预设，包括自动补全前缀，代码降级等功能
                postcssPresetEnv( /* potions */ ),
                // ...
            ]
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

    build: { // 配置生产相关
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
}));
```

