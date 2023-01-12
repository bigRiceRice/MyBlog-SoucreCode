---
title: 【Demo】伸缩侧边栏
author: BigRice
date: 2022-02-12
location: 云梦泽
summary: 一个有着优美动效的`伸缩侧边栏`小项目
tags:
  - Css
  - Project
---

伸缩侧边栏的案例，使用 `CSS` + `JavaScript`

<img src="https://sbr-1314368469.cos.ap-guangzhou.myqcloud.com/Images/202301062218115.gif" alt="伸缩侧边栏" style="zoom:80%" />

## 配色

文本 / _icon_ : `rgba(255,255,255,.6)`

侧边栏背景色：`rgba(0,0,0,.8)`

-   鼠标滑过背景色：`rgba(0,0,0,.1)`

仿 IOS 关闭栏

-   红`#eb5a56`
-   黄`#f8bc33`
-   绿`#62cb44`

宽度

-   鼠标未滑入：`110px`
-   鼠标滑入：`280px`

长度

-   暂定为 `560px`

思路

-   整体由 `width` 增加与 `transtion` 实现
-   布局由 `Flex` 实现
-   图片的语法：`background: url(img/bg.jpg) center no-repeat;` 居中显示与无重复显示

## 架构

> HTML 架构

```html
<!-- 最外层盒子 -->
<div class="wrap">
    <!-- 导航栏 -->
    <div class="nav">
        <!-- 仿 ios 关闭栏 -->
        <div class="btn">
            <div class="btn-item"></div>
            <div class="btn-item"></div>
            <div class="btn-item"></div>
        </div>
        <!-- 头像与文本 -->
        <div class="icon">
            <div class="icon-img">
                <img src="./img/eric.png" alt="" />
            </div>
            <div class="icon-con">
                <p>Good Day</p>
                <h2>GoodWen T.</h2>
            </div>
        </div>
        <!-- 分隔线 -->
        <div class="line"></div>
        <!-- 标题 -->
        <div class="title">
            <p>Space</p>
        </div>
        <!-- 菜单 -->
        <div class="menu">
            <div class="item">
                <div class="light"></div>
                <div class="licon"><span class="iconfont icon-wenjian"></span></div>
                <div class="con">Dashboard</div>
                <div class="ricon"><span class="iconfont icon-shezhi"></span></div>
            </div>
            <div class="item">
                <div class="light"></div>
                <div class="licon"><span class="iconfont icon-qipao1"></span></div>
                <div class="con">Products</div>
                <div class="ricon"></div>
            </div>
            <div class="item">
                <div class="light"></div>
                <div class="licon"><span class="iconfont icon-shexiang1"></span></div>
                <div class="con">Campaigns</div>
                <div class="ricon"></div>
            </div>
            <div class="item">
                <div class="light"></div>
                <div class="licon"><span class="iconfont icon-xiaolian"></span></div>
                <div class="con">Sales</div>
                <div class="ricon"><span class="iconfont icon-caidan1"></span></div>
            </div>
            <div class="item">
                <div class="light"></div>
                <div class="licon"><span class="iconfont icon-shexiang"></span></div>
                <div class="con">Discount</div>
                <div class="ricon"></div>
            </div>
            <div class="item">
                <div class="light"></div>
                <div class="licon"><span class="iconfont icon-wenjian1"></span></div>
                <div class="con">Payouts</div>
                <div class="ricon"></div>
            </div>
        </div>
        <div class="line"></div>
    </div>
</div>
```

> CSS 样式

```css
* {
    padding: 0;
    margin: 0;
    border: none;
    box-sizing: border-box;
    color: rgba(255, 255, 255, 0.6);
}

.wrap {
    height: 100vh;
    background: url(./img/bg.jpg) no-repeat center;
    background-size: cover;
    display: flex;
    justify-content: center;
    align-items: center;
}

.nav {
    /* width: 280px; */
    width: 110px;
    height: 560px;
    background-color: rgba(0, 0, 0, 0.8);
    border-radius: 25px;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    transition: 0.7s cubic-bezier(0.6, 0.06, 0.26, 1.45);
    margin-right: 180px;
}

.nav:hover {
    width: 280px;
}

.btn {
    width: 60px;
    height: 10px;
    display: flex;
    margin-left: 25px;
    justify-content: space-around;
    margin-top: 25px;
}

.btn-item {
    width: 10px;
    height: 10px;
    border-radius: 50%;
}

.btn-item:nth-child(1) {
    background-color: #eb5a56;
}

.btn-item:nth-child(2) {
    background-color: #f8bc33;
}

.btn-item:nth-child(3) {
    background-color: #62cb44;
}

.icon {
    width: 250px;
    height: 60px;
    margin-left: 30px;
    margin-top: 20px;
    display: flex;
}

.icon-img {
    width: 60px;
    height: 60px;
    border: 4px solid rgba(255, 255, 255, 0.5);
    border-radius: 50%;
    overflow: hidden;
}

.icon-img img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.icon-con {
    margin-left: 20px;
    margin-top: 10px;
    font-size: 15px;
    color: rgba(255, 255, 255, 0.8);
}

.icon-con h2 {
    font-weight: 400;
}

.line {
    width: 60px;
    height: 1px;
    margin: 20px 25px;
    background-color: rgba(255, 255, 255, 0.5);
    transition: 0.7s cubic-bezier(0.6, 0.06, 0.26, 1.45);
}

.nav:hover .line {
    width: 230px;
}

.title {
    width: 60px;
    margin-left: 30px;
    margin-bottom: 10px;
}

.menu {
    width: 230px;
    margin-left: 25px;
}

.item {
    position: relative;
    display: flex;
    border-radius: 5px;
    transition: 0.5s;
}

.item:hover .light {
    opacity: 1;
}

.item:hover {
    background-color: rgba(255, 255, 255, 0.1);
}

.light {
    position: relative;
    left: -25px;
    width: 5px;
    background-color: #eb5a56;
    border-top-right-radius: 5px;
    border-bottom-right-radius: 5px;
    opacity: 0;
    transition: 0.5s;
}

.licon {
    width: 60px;
    height: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
}

.iconfont {
    font-size: 25px !important;
}

.con {
    width: 0;
    height: 50px;
    position: relative;
    left: -20px;
    opacity: 0;
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: 0.5s cubic-bezier(0.6, 0.06, 0.68, 1.56);
    cursor: pointer;
}

.nav:hover .con {
    width: 160px;
    height: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
    opacity: 1;
}

.ricon .iconfont {
    color: #62cb44;
    cursor: pointer;
}

.ricon {
    width: 0;
    height: 50px;
    opacity: 0;
    transition: 0.7s;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
}

.nav:hover .ricon {
    width: 60px;
    display: flex;
    justify-content: center;
    align-items: center;
    opacity: 1;
}
```
