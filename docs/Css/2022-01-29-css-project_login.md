---
title: 【Demo】翻转登陆注册
author: BigRice
date: 2022-01-29
location: 云梦泽
summary: 一个有着优美动效的`翻转登陆注册`小项目
tags:
  - Css
  - Project
---

> 案例

<img src="https://sbr-1314368469.cos.ap-guangzhou.myqcloud.com/Images/202301062202662.gif" alt="翻转登陆注册" style="zoom:80%" />

## 样式简介

-   卡片的长宽为 300\*300px
-   卡片为 Flex 布局，主轴为垂直轴，主轴均分布局，侧轴居中布局

## 顶部按钮球的制作思路

按钮的样式随意，重要的样式是定位：` position: relative;` 相对定位保持不动，而按钮球则使用 `position:absolute` 绝对定位，`left:0;` 暂时保持不动，使用 `transform: translate(-1px);` 优化一下边框显示，随后点击小球时，将它的 `left` 增加至大按钮的 `width`，即可完成小球的移动

> HTML 构架

```html
<div class="button">
    <div class="ball"></div>
</div>
```

> CSS 样式

```css
.button {
    width: 60px;
    height: 25px;
    background-color: #2f3a8f;
    border-radius: 25px;
    position: relative;
}

/** 按钮球 */
.ball {
    width: 25px;
    height: 25px;
    position: absolute;
    background-color: #feece9;
    left: 0;
    border-radius: 50px;
    box-shadow: 0px 0px 10px #000;
    transition: 0.5s;
    transform: translate(-1px);
}
```

> JS 逻辑

```js
let index = 0;
button.addEventListener("click", () => {
    if (index == 0) {
        index = 1;
        ball.style.left = 61 + "%";
    } else {
        index = 0;
        ball.style.left = 0 + "%";
    }
});
```

## 关于翻转的制作思路

以下为用到的一些关键属性

-   **perspective**: `1000px`; 其子元素会获得透视效果（ 有 3D 的情况 ），而不是元素本身。[Perspective 透视详解](https://www.cnblogs.com/yanggeng/p/11285856.html)
-   **transform-style**: `preserve-3d`; 将子元素往三维空间内塞，内部会创建局部堆叠上下文
-   **transform** 的 `translateZ` 元素的 Z 轴，把它理解为屏幕与人眼之间的距离

> 原理

其实是有两张卡片，一张在 Z 轴的 70px 上，一张在 Z 轴的 -70px 上，我们点击时，实际上旋转了 Z 轴 180 度，看到了它的屁股，也就看到了背后的那张卡片。你也许会纠结那图片岂不是被镜像翻转了？其实我们在样式中已经将它翻转一次了，它正常情况下是这样的:arrow_down_small:

<img src="https://sbr-1314368469.cos.ap-guangzhou.myqcloud.com/Images/202301062203776.png" alt="image-20220128223125129" style="zoom:80%" />

<img src="https://sbr-1314368469.cos.ap-guangzhou.myqcloud.com/Images/202301062204242.png" alt="image-20220128223421549" style="zoom:80%" />

##### HTLM 架构

```html
<div class="bottom">
    <div class="signIn">
        <h2>Signin</h2>
        <input type="text" placeholder="Username" />
        <input type="password" placeholder="Password" />
        <button>Go</button>
    </div>
    <div class="signUp">
        <h2>SignUp</h2>
        <input type="text" placeholder="Username" />
        <input type="password" placeholder="Password" />
        <input type="password" placeholder="confirm Password" />
        <button>Go</button>
    </div>
</div>
```

##### CSS 样式

```css
.bottom {
    margin-top: 20px;
    width: 300px;
    height: 250px;
    background-image: url(../搜图导航_91sotu.com_1643375286981.png);
    /** 开启元素的 3D 空间，子元素将会被塞进去*/
    transform-style: preserve-3d;
    position: relative;
    transition: 0.7s;
    border-radius: 5px;
}

.bottom > div {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-evenly;
}

.bottom > div h2 {
    color: #000;
}

.bottom > div input {
    width: 200px;
    height: 25px;
    padding: 0 10px;
    background-color: #ccd1e4;
    color: #2f3a8f;
}

.bottom button {
    width: 80px;
    height: 30px;
    background-color: #fe7e6d;
    color: #fff;
    border-radius: 10px;
    font-size: 15px;
    transition: 0.3s;
    margin-bottom: 10px;
    cursor: pointer;
}

/* 登陆卡片（第一次看见的） */
.signIn {
    transform: translateZ(70px);
}

/*注册卡片（翻转后看见的） */
.signUp {
    position: absolute;
    top: 0;
    transform: translateZ(-70px) rotateY(180deg);
}
```

##### JS 样式

```js
button.addEventListener("click", () => {
    if (index == 0) {
        index = 1;
        ball.style.left = 61 + "%";
        on.style.opacity = 1;
        off.style.opacity = 0.5;
        bottom.style.transform = "rotateY(180deg)";
    } else {
        index = 0;
        ball.style.left = 0 + "%";
        on.style.opacity = 0.5;
        off.style.opacity = 1;
        bottom.style.transform = "rotateY(0deg)";
    }
});
```
