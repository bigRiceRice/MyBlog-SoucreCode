---
title: 你了解 Background 吗？
author: BigRice
date: 2022-04-29
location: 云梦泽
summary: 关于 Css 中的 `Background` 属性，大米饭是这样理解的...
tags:
    - Css
---

`background` 简写属性可在一个声明中设置所有能设置的背景属性。

# background

#### 可设置属性如下:

-   `background-image`: 设置背景图片, 可以是真实的图片路径, 也可以是创建的渐变背景;
-   `background-position`: 设置背景图片的位置;
-   `background-size`: 设置背景图片的大小;
-   `background-repeat`: 指定背景图片的铺排方式;
-   `background-attachment`: 指定背景图片是滚动还是固定;
-   `background-origin`: 设置背景图片显示的原点 [`background-position`相对定位的原点] ;
    -   `background-clip`: 设置背景图片向外剪裁的区域;
-   `background-color`: 指定背景颜色。
-   `linear-gradient() repeating-linear-gradient() radial-gradient() repeating-radial-gradient()`：指定渐变色

> `bg-color || bg-image || bg-position [ / bg-size]? || bg-repeat || bg-attachment || bg-origin || bg-clip`

##### 顺序并非固定，但是要**注意**：

-   若需要同时定义 `background-position` 与 `background-size` 属性则**必须连写**，且之间使用 `/` 隔开，顺序必须是 `bg-position` 在前，`bg-size` 在后。
-   若需要同时定义 `background-origin` 与 `background-clip` 属性，`bg-origin` 在前，`bg-clip` 在后，若值相同，则可以只设置一个值

### background-position

> `bg-position(x,|[y])` 用作设置背景图片的偏移量，默认值：`0% 0%`，效果等同于 `left top`

-   取值说明：

    -   若只设置一个值，则该值用作 x 坐标上，纵坐标则默认为 `50%` （即 _center_）
    -   `center` 关键字，等同于 `50% 50%`

    -   若同时设置两个值，则为 `bg-position(x,y)` 的取值语法，`x / y` 可以是**方位关键字^1^**、百分比长度、像素单位（ 可为负值 ），如：`bg-position:right 20%;` / `bg-position:-50px 50%;`

    -   也可同时设置 `3` 或 `4` 个值，但必须设置**方位关键字**，如：`bg-position:right 44px top;` （ 横坐标在 _right_ 的基础上继续偏移 `44px` 纵坐标为 `top` ），`bg-position:left 20px bottom 40px;`

也可使用 `background-position-x` / `background-position-y` 单独设置横纵坐标

[^1]: 即 _left / right / top / bottom_

---

### background-size

> `bg-size(<length>,|<percentage>,|auto,|cover,|contain)` 用作设置背景图片的宽高大小，默认值：`auto`

-   取值说明

    -   `bg-size(width,|[height])` 直接指定背景图片的宽与高，若只有一个值，则 _height_ 为 `auto` （根据宽度等比例设置）
    -   `auto` 关键字，即图片真实大小，这也是默认值
    -   `cover` 关键字，背景图片等比例缩放到完全覆盖容器，**背景图片可能会超出容器**。

        -   （ 即当源图片短的一边等于容器的边时，停止缩放 ）

    -   `contain` 关键字，背景图片等比例缩放到 宽度 / 高度与容器的 宽度 / 高度 相等，**背景图片始终会在容器中**。
        -   （ 即当源图片长的一边等于容器的边时，停止缩放 ）

      <img src="https://sbr-1314368469.cos.ap-guangzhou.myqcloud.com/Images/202301062200628.png" alt="image-20220205110322781" style="zoom:67%;" />

---

### background-repeat

> `bg-repeat(<repeat-style>)` 用作设置背景图片铺排填充的方式，默认值：`repeat`

-   取值说明，**有双值语法与单值语法的区别**

    -   单值语法： `bg-repeat(<repeat-style>)`，双值语法：`bg-repeat(x,|[y])`

    -   `repeat-x` 表示横向平铺，相当于双语的 `repeat no-repeat`

    -   `repeat-y` 表示竖向平铺，相当于双语的 `no-repeat repeat`

    -   `repeat` 表示横纵上均平铺，这也是默认值，相当于双语的 `repeat repeat`

    -   `no-repeat` 表示横纵上不平铺，相当于双语的 `no-repeat no-repeat`

    -   `space` 表示背景图片**以相同的间距平铺并填充**容器或某个方向

        -   ##### 注意：当 `bg-size` 设置为 `conver / contain` 时，此属性将不会生效

    -   `round` 表示背景图片自动缩放直到适应且填充满整个容器

        -   ##### 注意：若设置此属性，那么 `bg-size` 设置的 `conver / contain` 属性将不会生效

      <img src="https://sbr-1314368469.cos.ap-guangzhou.myqcloud.com/Images/202301062200441.png" alt="image-20220205115124688" style="zoom: 67%;" />

---

### background-origin

> `bg-origin(<box>)` 此属性用作设置 `bg-position` 定位时参考的原点，默认值为 `padding-box`

-   取值语法

    -   `padding-box` 为默认值，表示按 `padding` 区的原点来偏移定位
    -   `border-box` 表示按 `border` 区的原点来偏移定位
    -   `content-box` 表示按 `content` 区的原点来偏移定位

    代码示例

    ```css
    background-position: 10px 0px;
    border: 10px #58a solid;
    padding: 20px;
    ```

    ![image-20220205121229443](https://sbr-1314368469.cos.ap-guangzhou.myqcloud.com/Images/202301062200826.png)

---

### background-clip

> `bg-clip(<box>)` 用作指定背景图片向外裁剪的区域原点，默认值为 `border-box`

取值语法

-   `padding-box` 表示按 `padding` 区的原点来裁剪背景区域
-   `border-box` 为默认值，表示按 `border` 区的原点来裁剪背景区域
-   `content-box` 表示按 `content` 区的原点来裁剪背景区域

代码示例

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

---

### linear-gradient()

> `linear-gradient( [<angle> | 方位关键字,]? <color-stop-list> ) ` 此函数创建一个由两种或多种颜色**线性渐变**的**背景图片**，属于`<image>`数据类型

语法说明：

-   第一个参数指定了渐变整体的走向，默认值为 `to bottom (180%)`，此值可定义为具体的角度或方位关键字 `to left / to right / to top / to bottom` 或 `to bottom right / to bottom left / to top left / to top right`

-   第二个参数指定了渐变的颜色，此参数由类似伪数组的形式组成，长度至少为 `2` （ 即两种颜色 ）

    -   具体语法为 `[color stop,color stop || [color stop,]]` 颜色为必填，停止位置为非必填，可以是 **长度单位或百分比**

        -   停止位置表示此颜色结束渐变的位置

    -   如：`linear-gradient(red 30%, blue 80%)` 表示：从 `0% ~ 30%` 为红色，`30% ~ 80%` 为渐变色，`80% ~ 100%` 为蓝色

        ![image-20220212233639770](https://sbr-1314368469.cos.ap-guangzhou.myqcloud.com/Images/202301062200894.png)

-   各个参数间使用 `逗号` 隔开

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

### repeating-linear-gradient()

> `repeating-linear-gradient` 可以创建重复的线性渐变图像，它的语法与 `linear-gradient` 大致一样
>
> 使用 `repeating-linear-gradient()` 的好处是, 不需要借助 `background-size` 控制大小, 而且**角度可以随意设置，不会乱**

-   注意：`repeating-linear-gradient()` **除开头外必须明确指定**每一个颜色的停止值, 而 `linear-gradient()` 则可以适当省略

##### 两者的区别

![image-20220213112214750](https://sbr-1314368469.cos.ap-guangzhou.myqcloud.com/Images/202301062200283.png)

---

### radial-gradient()

> `radial-gradient(<shape> <size> <position> ? <color-stop-list>)`
>
> 此函数用于创建**径向渐变**的背景图片，同样属于`<imgage>`类型

语法说明：径向渐变的圆心为除最后一个颜色以外的所有颜色

-   `<shape>` 参数指定渐变的类型，取值为 `circle` **圆形**渐变或 `ellipse` **椭圆形**渐变，默认为值为 `ellipse`

-   `<size>` 参数指定**圆心**（==除最后一个颜色以外的所有颜色==）的半径 / 直径，有两种使用场景

    -   当渐变类型为 `circle` 圆形渐变时，只需要一个 `xy-size` 值：这个值为 **水平 + 垂直的半径值**
        -   长度单位**不能**为百分比
    -   当渐变类型为 `ellipse` 椭圆形渐变时，则必须要两个`x-size y-size`值：分别对应了 **水平半径** 与 **垂直半径**
        -   长度单位**可以**为百分比

      <img src="https://sbr-1314368469.cos.ap-guangzhou.myqcloud.com/Images/202301062200415.png" alt="image-20220213134843890" style="zoom:50%;" />

-   `position` 参数**专门指定圆心**的 `x轴 y轴` 偏移量（ 即第一个 `<color-stop>` 参数 ）。默认值为 `center center`

    -   单位可以使用方位关键字（ _left right top bottom_ ）
    -   一个关键字 `center`
    -   如 _px em %_ 之类的长度单位
    -   若只写一个 `x轴` 参数，那么 `y轴` 默认为 `center`
    -   此参数必须使用 `at` 关键字修饰，如：`radial-gradient(5% 5%` **at** ` right, red, blue)`

      <img src="D:\Desktop\APP Folders\工作区\笔记\图片或视频\image-20220213135202324.png" alt="image-20220213135202324" style="zoom:50%;" />

-   `<color-stop-list>` 与线性渐变语法一致，但需要知道，径向渐变的除最后一个颜色以外的所有颜色将为**圆心**。若设置了 `<size>` 效果就显而易见了

### repeating-radial-gradient()

> 此函数语法与 `radial-gradient()` 一致，效果跟 `repeating-linear-gradient` 一致为创建重复版

##### 两者的区别

```css
background: repeating-radial-gradient(
    rgba(200, 0, 0, 0.5) 0,
    rgba(200, 0, 0, 0.5) 20px,
    transparent 0,
    transparent 40px
);
```

![image-20220213140954152](https://sbr-1314368469.cos.ap-guangzhou.myqcloud.com/Images/202301062200328.png)
