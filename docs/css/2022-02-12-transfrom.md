---
title: 你了解 Transfrom 吗？
author: BigRice
date: 2022-02-12
location: 云梦泽
summary: 关于 Css 中的 `Transfrom` 布局，大米饭是这样理解的...
tags:
    - Css
---

# transform 变形属性详解

-   语法为：`transform: rotate | scale | skew | translate |matrix;`
-   若同时进行多个变形时，必须用空格分开而非 "**,**"

## 一、旋转 **rotate**

##### rotate(`<angle>`) ：通过指定的角度参数对原元素指定一个 2D 旋转，其中 `angle` 是指旋转角度，如果设置的值为**正数表示顺时针旋转**，如果设置的值为**负数，则表示逆时针旋转**。如：`transform:rotate(30deg)`

​ <img src="https://sbr-1314368469.cos.ap-guangzhou.myqcloud.com/Images/202301062201729.gif" alt="ROTATE" style="zoom:50%;" />

## 二、移动 **translate**

-   `translate(x,y)` 同时移动水平垂直轴；
-   `translateX(x)` 仅移动水平轴；
-   `translateY()` 仅移动垂直轴；
-   其中正数向下 / 右，负数向上 / 左，单位为长度单位（px,em,rem）

##### `translate(<translation-value>,[<translation-value>])`，第一个值为水平轴移动的距离，第二个值为垂直轴移动的距离。若只有一个参数，则 Y 轴为 `0px`

<img src="https://sbr-1314368469.cos.ap-guangzhou.myqcloud.com/Images/202301062201693.gif" alt="TRANSLATE" style="zoom: 33%;" />

##### `translateX(<translation-value>)`仅设置水平轴移动的距离

<img src="https://sbr-1314368469.cos.ap-guangzhou.myqcloud.com/Images/202301062201051.gif" alt="TRANSLATEX" style="zoom:33%;" />

##### `translateY(<translation-value>)` 仅设置垂直轴移动的距离

<img src="https://sbr-1314368469.cos.ap-guangzhou.myqcloud.com/Images/202301062201317.gif" alt="TRANSLATEY" style="zoom:33%;" />

## 三、缩放 / 拉伸 **scale**

##### `scale` 的语法与 `translate` 相似，意也是三种情况：

-   `scale(x,y)` 使元素水平方向和垂直方向同时缩放（**放大**）；
-   `scaleX(x)` 元素仅水平方向缩放（**左右拉伸**）；
-   `scaleY(y)` 元素仅垂直方向缩放（**上下拉伸**）
-   单位为 `Number` 类型的数字，不带任何单位，表示**倍数**

##### 它们具有相同的缩放中心点和基数，其中心点就是元素的中心位置，缩放基数为 `1` 倍，如果其值**大于 1 元素就放大**，反之其值**小于 1，元素缩小**

##### `scale()` 设置元素**整体（上下左右）缩放**（放大）倍数

<img src="https://sbr-1314368469.cos.ap-guangzhou.myqcloud.com/Images/202301062202506.gif" alt="SCALE" style="zoom:33%;" />

##### `scaleX()` 仅设置元素**左右缩放**（拉伸）倍数

<img src="https://sbr-1314368469.cos.ap-guangzhou.myqcloud.com/Images/202301062202759.gif" alt="SCALEX" style="zoom:33%;" />

##### `scaleY()` 仅设置元素**上下缩放**（拉伸）倍数

<img src="D:/Desktop/APP%20Folders/%E5%B7%A5%E4%BD%9C%E5%8C%BA/%E7%AC%94%E8%AE%B0/%E5%9B%BE%E7%89%87%E6%88%96%E8%A7%86%E9%A2%91/SCALEY.gif" alt="SCALEY" style="zoom:33%;" />

## 四、倾斜 **skew**

跟 `translate()`、`scale()`方法类似，倾斜也有 3 种情况：`skewX()`、`skewY()`、`skew(x,y)`。

参数 x 表示元素在 x 轴方向的倾斜度数，单位为 **deg**（即 degree 的缩写）。如果**度数为正表示元素沿 x 轴方向逆时针倾斜**；如果**度数为负表示元素沿 x 轴方向顺时针倾斜**。

参数 y 表示元素在 y 轴方向的倾斜度数，单位为 **deg**。如果**度数为正表示元素沿 y 轴方向顺时针倾斜**；如果**度数为负则表示元素沿 y 轴方向逆时针倾斜**。

-   对于倾斜的方向，我们不需要去记忆，因为在实际开发中，稍微测试一下就知道了。

##### `skew(x,y)` 同时倾斜 `x` `y` 轴，若只写一个参数，则 `y` 轴为 `0px`

<img src="https://sbr-1314368469.cos.ap-guangzhou.myqcloud.com/Images/202301062202595.gif" alt="SKEW" style="zoom:33%;" />

##### `skewX()` 仅倾斜 `X` 轴

<img src="https://sbr-1314368469.cos.ap-guangzhou.myqcloud.com/Images/202301062202656.gif" alt="SKEWX" style="zoom:33%;" />

##### `skewY()` 仅倾斜 `Y` 轴

<img src="https://sbr-1314368469.cos.ap-guangzhou.myqcloud.com/Images/202301062202823.gif" alt="SKEWY" style="zoom:33%;" />
