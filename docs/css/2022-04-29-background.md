---
title: 详解 background
author: BigRice
date: 2022-04-29
location: 云梦泽
summary: 关于 Css 中的 `Background` 属性，大米饭是这样理解的
tags:
  - Css
---

## *[background](https://developer.mozilla.org/zh-CN/docs/Web/CSS/background)*

```css
background: bg-color | bg-image | bg-position | bg-size | bg-repeat | bg-attachment | bg-origin | bg-clip;
```

`background` 简写属性可在一个声明中设置所有能设置的背景属性。

可设置属性如下（以下属性也可以单独设置）：

-   `background-image`：设置背景图片, 可以是真实的图片路径, 也可以是创建的渐变背景;
    -   `linear-gradient()`
    -   `repeating-linear-gradient()`
    -   ` radial-gradient()`
    -   `repeating-radial-gradient()`

-   `background-position`：设置背景图片的位置;
-   `background-size`：设置背景图片的大小;
-   `background-repeat`：指定背景图片的铺排方式;
-   `background-attachment`：指定背景图片是滚动还是固定;
-   `background-origin`：设置背景图片显示的原点，即 `background-position` 定位的原点
-   `background-clip`：设置背景图片向外剪裁的区域;
-   `background-color`：指定背景颜色。



> 顺序并非固定，但是要注意：

-   若需要同时定义 `background-position` 与 `background-size` 属性则**必须连写**，且之间使用 `/` 隔开，顺序必须是 `bg-position` 在前，`bg-size` 在后。
-   若需要同时定义 `background-origin` 与 `background-clip` 属性，`bg-origin` 在前，`bg-clip` 在后，若值相同，则可以只设置一个值



## *[background-position](https://developer.mozilla.org/zh-CN/docs/Web/CSS/background-position)*

```css
/* 关键字 */
background-position: top;
background-position: bottom;
background-position: left;
background-position: right;
background-position: center;

/* 百分比 */
background-position: 25% 75%;

/* 长度单位 */
background-position: 0 0;
background-position: 1cm 2cm;
background-position: 10ch 8em;

/* Multiple images */
background-position: 0 0, center;

/* Edge offsets values */
background-position: bottom 10px right 20px;
background-position: right 3em bottom 10px;
background-position: bottom 10px right;
background-position: top right 10px;
```

用作设置**背景图片的偏移量**，默认值：`0% 0%`，效果等同于 `left top`

> 取值说明

- 取值单位可以是可以是 Css 计量单位，也可以是方位关键字（ _left / right / top / bottom_）

-   若只设置一个值，则该值用作 x 坐标上，纵坐标则默认为 `50%` （即 _center_）
-   若同时设置 `3` 或 `4` 个值，则必须设置**方位关键字**
    -   `bg-position:right 44px top;` ：横坐标在 _right_ 的基础上继续偏移 `44px` 纵坐标为 `top` 
    -   `bg-position:left 20px bottom 40px;`





## *[background-size](https://developer.mozilla.org/zh-CN/docs/Web/CSS/background-size)*

```css
/* 关键字 */
background-size: cover
background-size: contain

/* 一个值：这个值指定图片的宽度，图片的高度隐式的为 auto */
background-size: 50%
background-size: 3em
background-size: 12px
background-size: auto

/* 两个值 */
/* 第一个值指定图片的宽度，第二个值指定图片的高度 */
background-size: 50% auto
background-size: 3em 25%
background-size: auto 6px
background-size: auto auto

/* 逗号分隔的多个值：设置多重背景 */
background-size: auto, auto     /* 不同于 background-size: auto auto */
background-size: 50%, 25%, 25%
background-size: 6px, auto, contain
```

用作设置**背景图片大小**，默认值：`auto`

> 取值说明
>

- `auto` 关键字，即图片真实大小，这也是默认值
- `cover` 关键字，背景图片等比例缩放到完全覆盖容器，**背景图片可能会超出容器**。

    -   （ 即当源图片短的一边等于容器的边时，停止缩放 ）

- `contain` 关键字，背景图片等比例缩放到 宽度 / 高度与容器的 宽度 / 高度 相等，**背景图片始终会在容器中**。
  -   （ 即当源图片长的一边等于容器的边时，停止缩放 ）

  <img src="https://sbr-1314368469.cos.ap-guangzhou.myqcloud.com/Images/202301062200628.png" alt="image-20220205110322781" style="zoom:80%" />



## *[background-repeat](https://developer.mozilla.org/zh-CN/docs/Web/CSS/background-repeat)*

```css
/* 单值语法 */
background-repeat: repeat-x;
background-repeat: repeat-y;
background-repeat: repeat;
background-repeat: space;
background-repeat: round;
background-repeat: no-repeat;

/* 双值语法：水平 horizontal | 垂直 vertical */
background-repeat: repeat space;
background-repeat: repeat repeat;
background-repeat: round space;
background-repeat: no-repeat round;
```

定义背景图像的重复方式。，默认值：`repeat`

| **单值**    | **等价于双值**        |
| :---------- | :-------------------- |
| `repeat-x`  | `repeat no-repeat`    |
| `repeat-y`  | `no-repeat repeat`    |
| `repeat`    | `repeat repeat`       |
| `space`     | `space space`         |
| `round`     | `round round`         |
| `no-repeat` | `no-repeat no-repeat` |

> 取值说明
>

- `repeat-x` 表示横向平铺，相当于双语的 `repeat no-repeat`

- `repeat-y` 表示竖向平铺，相当于双语的 `no-repeat repeat`

- `repeat` 表示横纵上均平铺，这也是默认值，相当于双语的 `repeat repeat`

- `no-repeat` 表示横纵上不平铺，相当于双语的 `no-repeat no-repeat`

- `space` 表示背景图片**以相同的间距平铺并填充**容器或某个方向

    -   注意：当 `bg-size` 设置为 `conver / contain` 时，此属性将不会生效

- `round` 表示背景图片自动缩放直到适应且填充满整个容器

  -   注意：若设置此属性，那么 `bg-size` 设置的 `conver / contain` 属性将不会生效

  <img src="https://sbr-1314368469.cos.ap-guangzhou.myqcloud.com/Images/202301062200441.png" alt="image-20220205115124688" style="zoom:80%" />





## *[background-origin](https://developer.mozilla.org/zh-CN/docs/Web/CSS/background-origin)*

```css
background-origin: border-box | padding-box | content-box ;
```

此属性用作设置 `bg-position` 定位时参考的原点，默认值为 `padding-box`

> 取值语法
>

-   `padding-box` 为默认值，表示按 `padding` 区的原点来偏移定位
-   `border-box` 表示按 `border` 区的原点来偏移定位
-   `content-box` 表示按 `content` 区的原点来偏移定位

代码示例

```css
background-image: url("./images/月球.jpg");
background-position: 10px 0px;
border: 10px #58a solid;
padding: 20px;
```

![image-20220205121229443](https://sbr-1314368469.cos.ap-guangzhou.myqcloud.com/Images/202301062200826.png)





## *[background-clip](https://developer.mozilla.org/zh-CN/docs/Web/CSS/background-clip)*

```css
/* Keyword values */
background-clip: border-box;
background-clip: padding-box;
background-clip: content-box;
background-clip: text;
```

此属性用作指定背景图片应该从哪个区域开始展示，默认值为 `border-box`

> 取值语法

-   `padding-box` 表示背景图片仅在 `padding` 中显示
-   `border-box` 为默认值，表示背景图片仅在 `border` 中显示
-   `content-box ` 表示背景图片仅在 `content` 中显示
-   `text` 表示背景图片仅在文本中显示
    -   `text`  属性在 chrome 中需要添加 `-webkit-` 前缀


> 代码示例
>

```css
border: 10px rgba(235, 199, 38, 0.438) dashed;
padding: 40px;
background-image: url("./images/月球.jpg");
background-repeat: no-repeat;
background-size: 150px;
background-origin: border-box;
background-color: #58a;
background-clip: border-box; //1 默认
background-clip: padding-box; //2
background-clip: content-box; //3
```

![image-20220205123606357](https://sbr-1314368469.cos.ap-guangzhou.myqcloud.com/Images/202301062200335.png)



## 渐变



### *[linear-gradient](https://developer.mozilla.org/zh-CN/docs/Web/CSS/gradient/linear-gradient)*

```css
linear-gradient( [<angle> | 方位关键字]  <color-stop-list> 
color-stop-list = [ color length ]
```

此函数创建一个由两种或多种颜色**线性渐变**的**背景图片**，属于`<image>`数据类型

> 语法说明
>

- 第一个参数指定了渐变整体的走向，默认值为 `to bottom (180%)`

    -   此值可定义为具体的角度或方位关键字 `to left / to right / to top / to bottom` 或 `to bottom right / to bottom left / to top left / to top right`

- 第二个参数指定了渐变的颜色，此参数由类似伪数组的形式组成，长度至少为 `2` （ 即两种颜色 ）

    -   具体语法为 `[color stop,color stop || [color stop,]]` 颜色为必填，停止位置为非必填，可以是 **长度单位或百分比**

        -   停止位置表示此颜色结束渐变的位置

    -   如：`linear-gradient(red 30%, blue 80%)` 表示：从 `0% ~ 30%` 为红色，`30% ~ 80%` 为渐变色，`80% ~ 100%` 为蓝色

        ![image-20220212233639770](https://sbr-1314368469.cos.ap-guangzhou.myqcloud.com/Images/202301062200894.png)

- 各个参数间使用**逗号**隔开



#### 实现**条纹**效果

> 当相邻两个颜色的位置值相同时, 颜色之间会产生无限小的过渡区域，其产生的效果就和条纹一样。

![image-20220212235042806](https://sbr-1314368469.cos.ap-guangzhou.myqcloud.com/Images/202301062200169.png)

```css
background: linear-gradient(#fc4f4f 50%, #2666cf 50%);
background: linear-gradient(#fc4f4f 30%, #2666cf 0);
background: linear-gradient(#fc4f4f 33%, #fb3 33%, #fb3 66%, #2666cf 66%);
```

> 若需要复杂的条纹图案，则需要指定 `bg-size` 来实现（与 `bg-repeat` 的默认值）

```css
background: linear-gradient(to right, rgb(235, 90, 90) 33%, white 33%, white 66%, rgb(105, 105, 224) 66%);
background-size: 33.33% 100%;
------
background: linear-gradient(rgb(235, 90, 90) 50%, rgb(105, 105, 224) 10%);
background-size: 100% 20%;
```

![image-20220213110611295](https://sbr-1314368469.cos.ap-guangzhou.myqcloud.com/Images/202301062200630.png)



### *[repeating-linear-gradient](https://developer.mozilla.org/zh-CN/docs/Web/CSS/gradient/repeating-linear-gradient)*

`repeating-linear-gradient` 函数可以创建重复的线性渐变图像，它的语法与 `linear-gradient` 大致一样

使用 `repeating-linear-gradient()` 的好处是, 不需要借助 `background-size` 控制大小, 而且**角度可以随意设置，不会乱**

-   注意：`repeating-linear-gradient()` **除开头外必须明确指定**每一个颜色的停止值, 而 `linear-gradient()` 则可以适当省略

> 两者的区别

![image-20220213112214750](https://sbr-1314368469.cos.ap-guangzhou.myqcloud.com/Images/202301062200283.png)



### *[radial-gradient](https://developer.mozilla.org/zh-CN/docs/Web/CSS/gradient/radial-gradient)*

```css
radial-gradient: [ circle | ellipse ] [ Width , height ] | [<position>] , <color-stop-list> ;
```

此函数用于创建**径向渐变**的背景图片，同样属于`<imgage>`类型

> 语法说明：除了最后一个颜色，其他的颜色将聚合在一起形成**圆心**

- `<shape>` **可选**：指定渐变的类型

    -   `circle`：圆形
    -   `ellipse`：（默认值）椭圆形

- `<size>` **可选**：参数指定**圆心**整体的半径 / 直径，有两种使用场景

    -   当渐变类型为 `circle` 圆形渐变时，只需要一个值表示半径
        -   **不能**为百分比
    -   当渐变类型为 `ellipse` 椭圆形渐变时，则必须要两个`xWidth yHeight`值：分别对应了宽高度
      -   **可以**为百分比

    -   默认为 `100%`

        <img src="https://sbr-1314368469.cos.ap-guangzhou.myqcloud.com/Images/202301062200415.png" alt="image-20220213134843890" style="zoom:80%" />

- `position` 参数**专门指定圆心**X，Y轴的偏移量。默认值为 `center center`

    - 单位可以使用

        -   方位关键字（ _left right top bottom_ *center* ）
        -   如 _px em %_ 之类的长度单位

    - 此参数**必须使用** `at` 关键字修饰，如：`radial-gradient(5% 5% at right, red, blue)`

      <img src="https://sbr-1314368469.cos.ap-guangzhou.myqcloud.com/Images/202301081306970.png" alt="image-20220213135202324" style="zoom:80%" />

- `<color-stop-list>` 与线性渐变语法一致，但需要知道，径向渐变的除最后一个颜色以外的所有颜色将为**圆心**。若设置了 `<size>` 效果就显而易见了



### *[repeating-radial-gradient](https://developer.mozilla.org/zh-CN/docs/Web/CSS/gradient/repeating-radial-gradient)*

> 此函数语法与 `radial-gradient()` 一致，效果跟 `repeating-linear-gradient` 一致为创建重复

两者的区别

```css
background: repeating-radial-gradient(
    rgba(200, 0, 0, 0.5) 0,
    rgba(200, 0, 0, 0.5) 20px,
    transparent 0,
    transparent 40px
);
background: radial-gradient(
    rgba(200, 0, 0, 0.5) 0,
    rgba(200, 0, 0, 0.5) 20px,
    transparent 0,
    transparent 40px
);
```

![image-20220213140954152](https://sbr-1314368469.cos.ap-guangzhou.myqcloud.com/Images/202301062200328.png)
