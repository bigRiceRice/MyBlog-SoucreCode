<img src="https://sbr-1314368469.cos.ap-guangzhou.myqcloud.com/Images/202301062157542.gif" alt="高斯模糊" style="zoom:80%;" />

##### CSS 样式

-   **filter** 将模糊或颜色偏移等图形效果应用于元素。滤镜通常用于调整图像，背景和边框的渲染[filter](https://developer.mozilla.org/zh-CN/docs/Web/CSS/filter)
    -   `blur()` 高斯模糊函数，单位为 `px`，不接收百分比
    -   `contrast()` 对比度函数
-   **backdrop-filter** 为一个元素后面区域添加图形效果（如模糊或颜色偏移）。 因为它适用于元素*背后*的所有元素，为了看到效果，必须使元素或其背景至少部分透明 [backdrop-filter](https://developer.mozilla.org/zh-CN/docs/Web/CSS/backdrop-filter)

## 实例

```CSS
html,
body {
    height: 100%;
    width: 100%;
}

body {
    background-image: url('./img/搜图导航_91sotu.com_1643375286981.png');
    background-position: center center;
    background-repeat: no-repeat;
    background-size: cover;
}

.container {
    align-items: center;
    display: flex;
    justify-content: center;
    height: 100%;
    width: 100%;
}

.box {
    border-radius: 5px;
    font-family: sans-serif;
    text-align: center;
    line-height: 1;
    backdrop-filter: blur(500px);
    max-width: 50%;
    max-height: 50%;
    padding: 20px 40px;
}
```

```html
<div class="container">
    <div class="box">
        <p>backdrop-filter: blur(500px)</p>
    </div>
</div>
```
