---
title: Transform - 变形
author: BigRice
date: 2022-02-12
location: 云梦泽
summary: transform 属性允许你旋转，缩放，倾斜或移动指定元素
tags:
  - Css
---



## 何为 transform 

CSS transform 属性允许你旋转，缩放，倾斜或移动指定元素。这是通过修改 CSS 视觉格式化模型的坐标空间来实现的。

```css
transform: rotate | scale | skew | translate ;
```

-   若同时进行多个变形时，必须用空格分开而非 `,`
-   `rotate`：通过指定的**角度**参**数旋**转元素 
-   `scale`：通过指定的**倍数**参数**收缩或拉伸**元素
-   `translate`：通过指定的**Css计量单位**参数**移动**元素
-   `skew`：通过指定的**倍数**参数**倾斜**元素



## *rotate*

```css
transform: rotate(<angle>) ; 
```

通过指定的角度参数对原元素指定一个 2D 旋转，其中 `angle` 是指旋转角度，

如果设置的值为正数表示顺时针旋转，如果设置的值为负数，则表示逆时针旋转。如：`transform:rotate(30deg)`

 <img src="https://sbr-1314368469.cos.ap-guangzhou.myqcloud.com/Images/202301062201729.gif" alt="ROTATE" style="zoom:80%" />



## *translate*

```css
transform: translate(x,y) | translateX(x) | translateY(y) ; 
```

`translage` 有三个具体的属性：

-   `translate(x,y)` 同时移动水平方向与垂直方向；
-   `translateX(x)` 仅移动水平方向；
-   `translateY()` 仅移动垂直方向；
-   其中正数向下 / 右，负数向上 / 左，单位为规定的 **Css 计量单位**



> translate

<img src="https://sbr-1314368469.cos.ap-guangzhou.myqcloud.com/Images/202301062201693.gif" alt="TRANSLATE" style="zoom:80%" />

> translateX

<img src="https://sbr-1314368469.cos.ap-guangzhou.myqcloud.com/Images/202301062201051.gif" alt="TRANSLATEX" style="zoom:80%" />

> translateY

<img src="https://sbr-1314368469.cos.ap-guangzhou.myqcloud.com/Images/202301062201317.gif" alt="TRANSLATEY" style="zoom:80%" />

## *scale*

```css
transform: scale(x,y) | scaleX(x) | scaleY(y) ; 
```

`scale` 有三个具体的属性：

-   `scale(x,y)`：同时收缩宽度与高度
-   `scaleX(x)`：仅收缩宽度
-   `scaleY(y)`：仅收缩宽度
-   单位为 `Number` 类型的数字，**不带任何单位**，表示倍数

> 它们具有相同的缩放中心点和基数，其中心点就是元素的中心位置，缩放基数为 `1` 倍，如果其值大于 1 元素就放大，反之其值小于 1，元素缩小



> scale()

<img src="https://sbr-1314368469.cos.ap-guangzhou.myqcloud.com/Images/202301062202506.gif" alt="SCALE" style="zoom:80%" />

> scaleX()

<img src="https://sbr-1314368469.cos.ap-guangzhou.myqcloud.com/Images/202301062202759.gif" alt="SCALEX" style="zoom:80%" />

> scaleY()

<img src="https://sbr-1314368469.cos.ap-guangzhou.myqcloud.com/Images/202301081558098.gif" alt="SCALEY" style="zoom:80%" />

## *skew*

```css
transform: skew(x,y) | skewX(x) | skewY(y) ; 
```

`skew` 有三个具体的属性：

- `skew`：同时倾斜 `x` `y` 轴
- `skewX`：仅倾斜 `x` 轴
    - 正数表示沿 x 轴方向逆时针倾斜，负数表示顺时针倾斜。
- `skewY`：仅倾斜 `y` 轴
    - 正数表示沿 x 轴方向顺时针倾斜，负数表示逆时针倾斜。
- 单位为 `<deg>` ，表示角度



> skew(x,y) 

<img src="https://sbr-1314368469.cos.ap-guangzhou.myqcloud.com/Images/202301062202595.gif" alt="SKEW" style="zoom:80%" />

> skewX() 

<img src="https://sbr-1314368469.cos.ap-guangzhou.myqcloud.com/Images/202301062202656.gif" alt="SKEWX" style="zoom:80%" />

> skewY() 
>

<img src="https://sbr-1314368469.cos.ap-guangzhou.myqcloud.com/Images/202301062202823.gif" alt="SKEWY" style="zoom:80%" />
