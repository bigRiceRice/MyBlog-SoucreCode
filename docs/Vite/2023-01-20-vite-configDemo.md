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
export default defineConfig(() => ({
    // 依赖优化
    optimizeDeps: {
        // 需要取消依赖预构建的包名
        exclude: ["lodash-es"],
    },
    // 自定义环境变量匹配前缀
    envPrefix: "APP_",
}));
```

