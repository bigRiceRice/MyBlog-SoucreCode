---
title: VueUse - 超强的 Vue Hook 工具库
author: BigRice
date: 2021-12-20
location: 云梦泽
summary: 根据 VueUse 官方文档整理的一些 API 手册
tags:
 - Vue3
 - API VueUse
---

## 🌌 获取

### NPM

执行 `yarn add @vueuse/core | npm install @vueuse/core` 安装。

使用 `ESMoudle` 语法从 `@vueuse/core` 引用函数使用即可：

```ts
import { useLocalStorage, useMouse, usePreferredDark } from "@vueuse/core";

export default {
    setup() {
        // 跟踪鼠标位置
        const { x, y } = useMouse();

        // 当前是否为黑色主题
        const isDark = usePreferredDark();

        // 将状态保存在localStorage中
        const store = useLocalStorage("my-storage", {
            name: "Apple",
            color: "red",
        });

        return { x, y, isDark, store };
    },
};
```

### CDN

```html
<script src="https://unpkg.com/@vueuse/shared"></script>
<script src="https://unpkg.com/@vueuse/core"></script>
```

将以全局的形式暴露给 `window.VueUse`

## 🛫 最佳实践

### 结构

VueUse 中绝大多数函数都返回一组 Refs 对象，可以使用 ES6 的对象结构来获取需要的值。例如：

```ts
import { useMouse } from "@vueuse/core";

// "x" 与 "y" 是 Ref 对象
const { x, y } = useMouse();
```

### 将 Ref 作为参数传递

在 Vue 中，可以使用 `setup()` 函数来构建数据和逻辑之间的“联系”。

为了使其灵活，大多数 VueUse 函数还接受参数的 Ref 版本。

这里使用 `useTitle` 来举例：

-   ##### 正常使用

    通常 `useTitle` 返回一个页面标题的 Ref 对象，当它的值修改时，页面的标题也会随之修改。

    ```ts
    const isDark = useDark();
    const title = useTitle("VueUse");

    watch(isDark, () => {
        title.value = isDark.value ? "🌙 晚上好!" : "☀️ 早上好!";
    });
    ```

-   ##### 计算参数

    也可以动态的设置 `useTitle` 的入参值来达到修改标题。

    ```ts
    const isDark = useDark();
    const title = computed(() => (isDark.value ? "🌙 晚上好!" : "☀️ 早上好!"));
    useTitle(title);
    ```

-   ##### Getter

    在 VueUse 9.0 以后支持了传入 Getter 函数的形式，使用上跟计算参数类似。

    ```ts
    const isDark = useDark();
    useTitle(() => (isDark.value ? "🌙 晚上好!" : "☀️ 早上好!"));
    ```

### 无渲染组件

VueUse 5.0 中引入了一个新包，`@vueuse/components ` 可以提供某些函数的无渲染组件版本

-   ##### 下载

    ```bash
    yarn add @vueuse/components | npm install @vueuse/components
    ```

-   ##### 使用

    例如：`onClickOutside ` 是一个监听元素外点击事件的函数

    正常使用会代码会显得冗余，这个时候可以使用这个函数的无渲染组件版本。

    ```vue
    <script setup>
    import { ref } from "vue";
    import { onClickOutside } from "@vueuse/core";
    const el = ref();
    function close() {
        /* ... */
    }
    onClickOutside(el, close);
    </script>

    <template>
        <div ref="el">Click Outside of Me</div>
    </template>
    ```

    下面来看看无渲染组件版本：

    ```vue
    <script setup>
    import { OnClickOutside } from "@vueuse/components";
    function close() {
        /* ... */
    }
    </script>

    <template>
        <OnClickOutside @trigger="close">
            <div>Click Outside of Me</div>
        </OnClickOutside>
    </template>
    ```

    `Script` 代码中简洁了许多。

-   ##### 获取返回值

    我们可以访问作用域插槽来获取某些组件的返回值。

    ```vue
    <UseMouse #default="{ x, y }">
      x: {{ x }}
      y: {{ y }}
    </UseMouse>
    ```

    ```vue
    <UseDark #default="{ isDark, toggleDark }">
      <button @click="toggleDark()">
        Is Dark: {{ isDark }}
      </button>
    </UseDark>
    ```

## State 状态相关

### useRefHistory

基于代理对象追踪它的变更创建一个**“历史记录”**。并提供后退、前进、重置功能。

-   ##### 详细信息

    第一个参数为需要追踪的响应式对象，这个参数是必须的。

    第二个参数为可选的配置项对象：

    -   `deep` ：是否为每个历史记录创建克隆并整合为一个，默认为 `false`。
    -   `dump` ：自定义历史记录值的序列化行为，可以传入一个函数来达到格式化的目的。
        -   `deep` 为 `true` 时才会执行。
        -   默认执行 `JSON.parse(JSON.stringify(xxx))`。
    -   `parse` ：自定义历史记录的解析行为。
    -   `flush` ：创建历史记录的时机，默认为 `pre`，其他取值为 `sync`，`post`。

    返回值为多个函数或对象：

    -   `history` ：历史记录对象，有两个属性。【_Object_】

        -   `snapshot` ：快照，即修改后的值。【_String_】
        -   `timestamp` ：修改的时间戳。【_String_】

    -   `redo` ：前进。【_Function_】
    -   `canRedo` ：是否可以前进。【_Boolean_】
    -   `undo` ：后退。【_Function_】
    -   `canUndo` ：是否可以后退。【_Boolean_】
    -   `commit` ：手动提交创建一次历史记录。【_Function_】
    -   `clear` ：使用最后一次历史记录的值重置历史记录列表。【_Function_】

-   ##### 示例

    追踪一个文本框的历史变更记录：

    ```vue
    <script setup lang="ts">
    import { ref } from "vue";
    import { useRefHistory } from "@vueuse/core";

    const newTodo = ref("");
    const { history, undo, redo, commit } = useRefHistory(newTodo, { deep: true });
    </script>
    <template>
        <input type="text" v-model="newTodo" />
        <button @click="undo">后退</button>
        <button @click="redo">前进</button>
        <button @click="commit">手动提交</button>
        <hr />
        <h3>以下为历史记录</h3>
        <pre>{{ history }}</pre>
    </template>
    ```

    -   以上代码有一个错误，因为文本框已经绑定了 `vModel` ，所有每次修改都会自动触发 `commit` ，所以不需要再重复 `commit` 了。
    -   或者使用 `useManualRefHistory` 懒执行。

<img src="https://sbr-1314368469.cos.ap-guangzhou.myqcloud.com/Images/202301091242992.gif" alt="demo" style="zoom:80%" />

利用 `useRefHistory` 还可以创建一个简陋的 Todo-List，并达到“**时光倒流**”的效果：

```vue
<script setup lang="ts">
import { ref } from "vue";
import { useRefHistory } from "@vueuse/core";

const newTodo = ref("");
const todos = ref<string[]>([]);
const { history, undo, redo, clear } = useRefHistory(todos, { deep: true });
</script>
<template>
    <input type="text" v-model="newTodo" />
    <button @click="todos.unshift(newTodo), (newTodo = '')">提交</button>
    <button @click="undo">后退</button>
    <button @click="redo">前进</button>
    <ul>
        <li v-for="(item, index) in todos" :key="index">{{ item }}</li>
    </ul>
    <pre>{{ history }}</pre>
</template>
```

-   注意：这里配置项中的 `deep` 必须开启。

    -   因为在使用对象或数组时，由于更改它们的属性不会更改引用，因此不会触发提交。

    -   或将 `flush` 配置项设置为 `post` ：在元素渲染后再添加快照。

<img src="https://sbr-1314368469.cos.ap-guangzhou.myqcloud.com/Images/202301091242142.gif" alt="demo" style="zoom:80%" />

设置存储历史记录的最大值：

```ts
const refHistory = useRefHistory(target, {
    capacity: 15, // 限制为15条历史记录
});

refHistory.clear(); // 清除所有历史记录
```

-   ##### 参见 https://vueuse.org/core/useRefHistory/

### useManualRefHistory

懒执行版本的 `useRefHistory`，源对象修改不会自动追踪，必须要手动调用 `commit` 才会添加快照。

-   ##### 示例

    ```ts
    import { ref } from "vue";
    import { useManualRefHistory } from "@vueuse/core";

    const counter = ref(0);
    const { history, commit, undo, redo } = useManualRefHistory(counter);

    counter.value += 1;
    // 如果 commit 不手动调用，那么快照不会添加！
    commit();

    console.log(history.value);
    /* [
      { snapshot: 1, timestamp: 1601912898062 },
      { snapshot: 0, timestamp: 1601912898061 }
    ] */
    ```

-   ##### 参见 https://vueuse.org/core/useManualRefHistory/

### useDebouncedRefHistory

用法与 `useRefHistory` 类似，可以添加一个值为 `number` 的 `debounce` “防抖”配置

-   ##### 示例

    ```ts
    import { ref } from "vue";
    import { useDebouncedRefHistory } from "@vueuse/core";

    const counter = ref(0);
    const { history, undo, redo } = useDebouncedRefHistory(counter, {
        deep: true,
        debounce: 1000,
    });
    ```

-   ##### 参见 https://vueuse.org/core/useDebouncedRefHistory/

### useThrottledRefHistory

用法与 `useRefHistory` 类似，可以添加一个值为 `number` 的 `throttle` “节流”配置

-   ##### 示例

    ```ts
    import { ref } from "vue";
    import { useThrottledRefHistory } from "@vueuse/core";

    const counter = ref(0);
    const { history, undo, redo } = useThrottledRefHistory(counter, {
        deep: true,
        throttle: 1000,
    });
    ```

-   ##### 参见 https://vueuse.org/core/useThrottledRefHistory/

### 💎 useStorage

返回一个 Ref 对象，并响应式的设置 `LocalStorage` 或 `SessionStorage` 中的值。

-   ##### 详细信息

    第一个参数为键名，必须为字符串。

    第二个参数为默认值，当指定的 `Storage` 中没有该键时，创建一个对应的键并设置该参数值。

    -   这个参数是必须的，它可以同时指定值的类型，假如将这个参数的类型设置为基本类型，修改源值为对象或数组将不会经过序列化。

    第三个参数为**可选**指定的 `Storage`，可传入 `LocalStorage` 或 `SessionStorage`，默认为 `LocalStorage`。

    第四个参数是**可选**的配置项：

    -   TS 类型如下：

        ```ts
        interface UseStorageOptions<T>
            extends ConfigurableEventFilter,
                ConfigurableWindow,
                ConfigurableFlush {
            // 是否开启深度监听，默认为 True
            deep?: boolean;
            // 是否监听 Storage 的修改，这在多标签页中有用，默认为 True
            listenToStorageChanges?: boolean;
            // 当默认值或键不存在时，是否将其写入 Storage，默认为 True
            writeDefaults?: boolean;
            // 当绑定的键上有值，是否将默认值进行浅合并，默认为 False
            // 也可以传入一个自定义合并行为的函数
            mergeDefaults?: boolean | ((storageValue: T, defaults: T) => T);
            // 自定义序列化行为,类型在下方
            // 默认行为是遇到对象|数组使用 JSON.stringify / JSON.parse
            // 遇到数字|字符串使用 Number.toString / parseFloat
            serializer?: Serializer<T>;
            // 错误回调函数 默认执行 `console.error
            onError?: (error: unknown) => void;
            // 是否使用浅引用作为参考，默认为 False
            shallow?: boolean;
        }

        interface Serializer<T> {
            read(raw: string): T;
            write(value: T): string;
        }
        // Serializer 用法
        const storage = useStorage<string[]>("my-storage", ["test"], localStorage, {
            serializer: {
                // 当用户读取 localStorage.getItem('my-storage') 时触发
                // 此函数必须返回 useStorage 的泛型类型
                read(raw: string) {
                    // raw 的类型是 string
                    return [raw];
                },
                // 当 Ref 对象值修改时触发，初始化默认值也会自动触发一次
                // 此函数必须返回 string 类型，因为要写入到 Storage 中
                write(value: string[]) {
                    // value 的类型一定是泛型的类型
                    return JSON.stringify(value);
                },
            },
        });
        ```

    返回值是一个 `Ref` 对象，修改这个 `Ref` 对象的值也会同步修改 `Storage` 中的值。

-   ##### 示例

    响应式更改 `LocalStorage` 。

    ```vue
    <script setup lang="ts">
    import { useStorage } from "@vueuse/core";
    const storage = useStorage<Array<any>>("my-storage", []);
    setTimeout(() => {
        storage.value = [{ name: 1 }];
    }, 2000);
    </script>
    ```

    ![demo](https://sbr-1314368469.cos.ap-guangzhou.myqcloud.com/Images/202301091243590.gif)

    响应式修改 `SessionStorage` 。

    ```vue
    <script setup lang="ts">
    import { useStorage } from "@vueuse/core";
    const storage = useStorage<Array<any>>("my-storage", [], sessionStorage);
    setTimeout(() => {
        storage.value = [{ name: 1 }];
    }, 2000);
    </script>
    ```

-   ##### 参见 https://vueuse.org/core/useStorage/

### useSessionStorage

返回一个 Ref 对象，并响应式的设置 `SessionStorage` 中的值。

用法与 useStorage 类似，不过没有了 设置 Storage 的参数。

-   ##### 参见 https://vueuse.org/core/useSessionStorage/

### useLocalStorage

返回一个 Ref 对象，并响应式的设置 `LocalStorage` 中的值。

用法与 useStorage 类似，不过没有了 设置 Storage 的参数。

-   ##### 参见 https://vueuse.org/core/useLocalStorage/

## DOM 元素相关

### useActiveElement

动态的获取当前文档中聚焦状态的元素。此处的 **聚焦** 不是单纯的文本框 `:Focus` 或 `:active` 聚焦的状态。

而是指用户使用 Tab 切换焦点时对应的元素。

没有焦点元素时默认返回 `<Body>` 或 `null`

-   ##### 示例

    为焦点元素添加样式：

    ```vue
    <script setup lang="ts">
    import { useActiveElement } from "@vueuse/core";
    import { computed, watch } from "vue";
    const aEL = useActiveElement<HTMLInputElement | HTMLButtonElement>();
    const activeValue = computed(() => {
        if (aEL.value?.tagName == "BODY") {
            return "<Body>";
        }
        return aEL?.value?.value == "" ? aEL.value.textContent : aEL.value?.value;
    });
    watch(aEL, (nV, oV) => {
        oV?.classList.remove("active");
        nV?.classList.add("active");
    });
    </script>

    <template>
        <main>
            <button class="items" v-for="item in 6" :key="item">Button-{{ item }}</button>
        </main>
        <main>
            <input class="items" v-for="item in 6" :key="item" :value="`Input-${item}`" />
        </main>
        <p>Current Active Element: 【{{ activeValue }}】</p>
    </template>
    ```

      <img src="https://sbr-1314368469.cos.ap-guangzhou.myqcloud.com/Images/202301091243209.gif" alt="demo" style="zoom:80%" />

-   ##### 参见 https://vueuse.org/core/useActiveElement/

### 💎 useElementBounding

动态的获取元素的边界信息，如：宽度、高度、X 轴、Y 轴等。

-   ##### TS 类型

    ```ts
    declare function useElementBounding(
        target: MaybeComputedElementRef,
        options?: UseElementBoundingOptions
    ): {
        // 元素高度
        height: vue_demi.Ref<number>;
        // 距离视口底部多少像素
        bottom: vue_demi.Ref<number>;
        // 距离视口左边多少像素
        left: vue_demi.Ref<number>;
        // 距离视口右边多少像素
        right: vue_demi.Ref<number>;
        // 距离视口底部多少像素
        top: vue_demi.Ref<number>;
        // 元素宽度
        width: vue_demi.Ref<number>;
        // 元素的绝对定位 X 值,与 left 相同
        x: vue_demi.Ref<number>;
        // 元素的绝对定位 X 值,与 top 相同
        y: vue_demi.Ref<number>;
        update: () => void;
    };
    ```

-   ##### 示例

    动态获取元素边界信息：

    ```ts
    const el = ref(null);
    const { x, y, top, right, bottom, left, width, height } = useElementBounding(el);
    ```

    支持无渲染组件：

    ```vue
    <UseElementBounding #default="{ width, height }">
      Width: {{ width }}
      Height: {{ height }}
    </UseElementBounding>
    ```

-   ##### 参见 https://vueuse.org/core/UseElementBounding/

### useElementSize

动态的获取元素的宽度与高度。

-   ##### 示例

    动态获取宽度与高度：

    ```ts
    const el = ref(null);
    const { width, height } = useElementSize(el);
    ```

    支持无渲染组件：

    ```html
    <UseElementSize #default="{ width, height }">
        Width: {{ width }} Height: {{ height }}
    </UseElementSize>
    ```

-   ##### 参见 https://vueuse.org/core/useElementSize/

### 💎 useElementVisibility

判断元素是否还在浏览器视口中出现。

-   ##### 示例

    ```vue
    <script setup lang="ts">
    import { useElementVisibility } from "@vueuse/core";
    import { computed, ref } from "vue";
    const main = ref();
    const targetIsVisible = useElementVisibility(main);
    const IsVisible = computed(() =>
        targetIsVisible.value ? "于视口中可见" : "于视口中消失"
    );
    </script>

    <template>
        <main ref="main"></main>
        <div class="tool">元素{{ IsVisible }}</div>
    </template>
    ```

      <img src="https://sbr-1314368469.cos.ap-guangzhou.myqcloud.com/Images/202301091243753.gif" alt="demo" style="zoom:80%" />

    支持无渲染组件：

    ```vue
    <UseElementVisibility v-slot="{ isVisible }">
      Is Visible: {{ isVisible }}
    </UseElementVisibility>
    ```

-   ##### 参见 https://vueuse.org/core/useElementVisibility/

### 💎 useMouseInElement

动态的获取鼠标于元素之间的关系。

-   ##### 详细信息

    返回值为：

    ```ts
    declare function useMouseInElement(
        target?: MaybeElementRef,
        options?: MouseInElementOptions
    ): {
        // 鼠标的 X 轴值
        x: vue_demi.Ref<number>;
        // 鼠标的 Y 轴值
        y: vue_demi.Ref<number>;
        sourceType: vue_demi.Ref<MouseSourceType>;
        // 鼠标距离元素左边多少像素
        elementX: vue_demi.Ref<number>;
        // 鼠标距离元素顶部多少像素
        elementY: vue_demi.Ref<number>;
        // 元素 X 轴位置值
        elementPositionX: vue_demi.Ref<number>;
        // 元素 Y 轴位置值
        elementPositionY: vue_demi.Ref<number>;
        // 元素高度
        elementHeight: vue_demi.Ref<number>;
        // 元素宽度
        elementWidth: vue_demi.Ref<number>;
        // 鼠标是否在元素内部
        isOutside: vue_demi.Ref<boolean>;
        // 停止监听
        stop: () => void;
    };
    ```

-   ##### 示例

      <img src="https://sbr-1314368469.cos.ap-guangzhou.myqcloud.com/Images/202301091243567.gif" alt="demo" style="zoom:80%" />

    支持无渲染组件：

    ```vue
    <UseMouseInElement v-slot="{ elementX, elementY, isOutside }">
      x: {{ elementX }}
      y: {{ elementY }}
      Is Outside: {{ isOutside }}
    </UseMouseInElement>
    ```

-   ##### 参见 https://vueuse.org/core/useMouseInElement/

### 💎 useWindowScroll

动态获取滚动框 X、Y 值，值越大距离越远。

-   ##### 示例

    ```ts
    import { useWindowScroll } from "@vueuse/core";

    const { x, y } = useWindowScroll();
    ```

-   ##### 参见 https://vueuse.org/core/useWindowScroll/

### 💎 useWindowSize

动态获取视口的宽度与高度。

-   ##### 示例

    ```ts
    import { useWindowSize } from "@vueuse/core";

    const { width, height } = useWindowSize();
    ```

      <img src="https://sbr-1314368469.cos.ap-guangzhou.myqcloud.com/Images/202301091243932.gif" alt="demo" style="zoom:80%" />

    支持无渲染组件：

    ```vue
    <UseWindowSize v-slot="{ width, height }">
      Width: {{ width }}
      Height: {{ height }}
    </UseWindowSize>
    ```

-   ##### 参见 https://vueuse.org/core/useWindowSize/

## BOM 相关

### useDark

获取当前是否为深色模式，返回一个值为布尔值的 Ref 对象。

-   ##### 详细信息

    使用了这个 API，会默认在 HTML 标签中创建一个类，若当前是深色模式，则类的值为 `drak`，若是浅色模式是，则类的值为空。

    并会在 `LocalStorage` 中响应式创建一个值为 `drak` 或 `light` 或 `auto` 的 `vueuse-color-scheme` 默认键。

-   ##### 示例

    ```ts
    const isDark = useDark({
        // 如果为深色模式，赋给 selector 上 attribute 的值
        valueDark: "drak",
        // 如果为浅色模式，赋给 selector 上 attribute 的值
        valueLight: "light",
        // 需要赋值的元素选择器
        selector: "body",
        // 赋值的属性名
        attribute: "color-scheme",
        // 需要保存到 Storage 中的键名
        storageKey: "color-scheme",
        // 保存到 sessionStorage
        storage: sessionStorage,
    });
    ```

-   ##### 参见 https://vueuse.org/core/useDark/

### 💎 useEventListener

轻松使用事件监听器，在装载时使用 `addEventListener` 注册，在卸载时自动使用 `removeEventListener` 注册。

-   ##### 详细信息

    第一个参数为监听的对象。

    第二个参数为事件的名称。

    第三个参数为回调函数。

    返回值为卸载监听器的函数

-   ##### 示例

    ```ts
    import { useEventListener } from "@vueuse/core";

    useEventListener(document, "click", ev => {
        console.log(ev);
    });
    ```

    也可以传递一个 Ref 模板引用作为事件目标，当 Ref 目标切换时，会自动删除绑定在之前引用上的事件监听并注册新的事件监听。

    ```ts
    import { useEventListener } from "@vueuse/core";

    const element = ref<HTMLDivElement>();
    useEventListener(element, "keydown", e => {
        console.log(e.key);
    });
    ```

    ```html
    <template>
        <div v-if="cond" ref="element">Div1</div>
        <div v-else ref="element">Div2</div>
    </template>
    ```

    使用返回值卸载监听器：

    ```ts
    import { useEventListener } from "@vueuse/core";

    const cleanup = useEventListener(document, "keydown", e => {
        console.log(e.key);
    });

    cleanup(); // 卸载监听器
    ```

-   ##### 参见 https://vueuse.org/core/useEventListener/

### 💎 useFileDialog

轻松打开文件对话框。

-   ##### TS 类型

    ```ts
    export declare function useFileDialog(options?: UseFileDialogOptions): UseFileDialogReturn;
    // 入参配置项
    export interface UseFileDialogOptions extends ConfigurableDocument {
        // 是否支持多个,默认为 True
        multiple?: boolean;
        // 限制文件类型，默认为 `*`
        accept?: string;
        capture?: string;
    }
    export interface UseFileDialogReturn {
        // 获取到的文件
        files: Ref<FileList | null>;
        // 打开文件选择框的函数
        open: (localOptions?: Partial<UseFileDialogOptions>) => void;
        // 重置文件
        reset: () => void;
    }
    ```

-   ##### 详细信息

    ```vue
    <script setup lang="ts">
    import { useFileDialog } from "@vueuse/core";
    const { files, open, reset } = useFileDialog();
    </script>
    <template>
        <button type="button" @click="open()">Choose file</button>
        <button type="button" @click="reset">reset</button>
        <pre v-if="files">名称：{{ files[0].name }}，大小：{{ files[0].size }}字节</pre>
    </template>
    ```

      <img src="https://sbr-1314368469.cos.ap-guangzhou.myqcloud.com/Images/202301091243638.gif" alt="demo" style="zoom:80%" />

-   ##### 参见 https://vueuse.org/core/useFileDialog/

### 💎 useTitle

动态的设置当前页面标题

-   ##### 示例

    ```ts
    import { useTitle } from "@vueuse/core";

    const title = useTitle();
    title.value = "Hello"; // 修改当前标题
    ```

    入参为默认标题：

    ```ts
    const title = useTitle("初始标题");
    ```

    支持计算属性：

    ```ts
    const isDark = useDark();
    const title = computed(() => (isDark.value ? "🌙 晚上好!" : "☀️ 早上好!"));
    useTitle(title);
    ```

    或者 Getter 函数

    ```ts
    const isDark = useDark();
    useTitle(() => (isDark.value ? "🌙 晚上好!" : "☀️ 早上好!"));
    ```

-   ##### 参见 https://vueuse.org/core/useTitle/

## 监听相关

### onClickOutside

响应式监听对指定元素外的点击，对模式或下拉菜单很有用。

-   ##### 示例

    ```ts
    const target = ref(null);
    onClickOutside(target, event => console.log("点击元素外"));
    ```

      <img src="https://sbr-1314368469.cos.ap-guangzhou.myqcloud.com/Images/202301091243091.gif" alt="demo" style="zoom:80%" />

    提供无渲染组件版本：

    ```vue
    <OnClickOutside
        @trigger="count++"
        :options="{
            ignore: [
                /* ... */
            ],
        }">
      <div>点我外面</div>
    </OnClickOutside>
    ```

-   ##### 参见 https://vueuse.org/core/onClickOutside/

### useElementHover

响应式监听对元素的悬停状态。

-   ##### 示例

    ```vue
    <script setup lang="ts">
    import { useElementHover } from "@vueuse/core";
    import { ref, watch } from "vue";
    const target = ref(null);
    const isHovered = useElementHover(target);
    watch(isHovered, nV => console.log(nV ? "进来了" : "出去了"));
    </script>

    <template>
        <main>
            <button ref="target" type="button">Button</button>
        </main>
    </template>
    ```

      <img src="https://sbr-1314368469.cos.ap-guangzhou.myqcloud.com/Images/202301091243468.gif" alt="demo" style="zoom:80%" />

-   ##### 参见 https://vueuse.org/core/useElementHover/

### 💎 useInfiniteScroll

无限滚动，监听指定元素的滚动条到底后执行回调函数。

-   ##### 详细信息

    第一个参数指定元素。

    第二个参数指定回调函数。

    第三个参数为配置项对象：

    ```ts
    export interface UseInfiniteScrollOptions extends UseScrollOptions {
        // 距离指定方向到头多少像素时触发回调函数，默认为 `0`
        distance?: number;
        // 指定监听的方位，默认为 `bottom`
        direction?: "top" | "bottom" | "left" | "right";
        // 是否每次触发回调后回到原点，默认为 `False`
        preserveScrollPosition?: boolean;
    }
    ```

-   ##### 示例

    监听 window 滚动条到底增加元素高度。

    ```ts
    const { height } = useElementSize(document.documentElement);
    useInfiniteScroll(
        window,
        () => {
            document.documentElement.style.height = height.value + 100 + "px";
        },
        {
            distance: 100,
        }
    );
    ```

      <img src="https://sbr-1314368469.cos.ap-guangzhou.myqcloud.com/Images/202301091243980.gif" alt="demo" style="zoom:80%" />

    无限添加元素：

    ```vue
    <script setup lang="ts">
    import { useInfiniteScroll } from "@vueuse/core";
    import { ref } from "vue";
    const main = ref();
    const items = ref([1, 2, 3, 4, 5, 6]);
    useInfiniteScroll(
        main,
        () => {
            const length = items.value.length + 1;
            for (let i = length; i < length + 6; i++) {
                items.value.push(i);
            }
        },
        {
            distance: 100,
        }
    );
    </script>

    <template>
        <main ref="main">
            <div class="items" v-for="item in items" :key="item">{{ item }}</div>
        </main>
    </template>
    ```

      <img src="https://sbr-1314368469.cos.ap-guangzhou.myqcloud.com/Images/202301091243042.gif" alt="demo" style="zoom:80%" />

-   ##### 参见 https://vueuse.org/core/useInfiniteScroll/

### 💎 useScroll

响应式获取指定元素滚动条的所有消息，如滚动是否到底、是否正在滚动、滚动条位置值等...

-   ##### TS 类型

    ```ts
    declare function useScroll(
        element: MaybeComputedRef<
            HTMLElement | SVGElement | Window | Document | null | undefined
        >,
        options?: UseScrollOptions
    ): {
        // 滚动条的 X 轴位置值
        x: vue_demi.WritableComputedRef<number>;
        // 滚动条的 Y 轴位置值
        y: vue_demi.WritableComputedRef<number>;
        // 滚动条是否正在滚动
        isScrolling: vue_demi.Ref<boolean>;
        // 滚动条位置状态
        arrivedState: {
            // `底部`滚动条是否在`最左边`，即 `X` 是否为 `0`
            left: boolean;
            // `底部`滚动条是否在`最右边`，即 `X` 是否为`最大`
            right: boolean;
            // `右边`滚动条是否在`最上面`，即 `Y` 是否为 `0`
            top: boolean;
            // `右边`滚动条是否在`最下面`，即 `Y` 是否为`最大`
            bottom: boolean;
        };
        // 滚动条运动状态
        directions: {
            // `底部`滚动条是否正在向`左`滚动
            left: boolean;
            // `底部`滚动条是否正在向`右`滚动
            right: boolean;
            // `右边`滚动条是否正在向`上`滚动
            top: boolean;
            // `右边`滚动条是否正在向`下`滚动
            bottom: boolean;
        };
    };
    ```

-   ##### 详细信息

    第一个参数为指定监听的元素。

    第二个参数为指定的配置项对象，类型如下：

    ```ts
    interface UseScrollOptions {
        // 节流事件，默认为 `0`
        throttle?: number;
        // 滚动结束时的检查时间，默认值为 `200`
        // 当`throttle`被配置时，此配置将被设置为 `(throttle + idle)`。
        idle?: number;
        // 以x像素偏移到达状态，不知道有啥用
        offset?: {
            left?: number;
            right?: number;
            top?: number;
            bottom?: number;
        };
        // 滚动中触发
        onScroll?: (e: Event) => void;
        // 滚动停止触发
        onStop?: (e: Event) => void;
        // 滚动事件的监听器选项
        // 默认为 `{capture: false, passive: true}`
        eventListenerOptions?: boolean | AddEventListenerOptions;
        // 当设置滚动条位置时是否开启平滑移动，默认值为 `auto`，可选值为 `smooth`
        behavior?: MaybeComputedRef<ScrollBehavior>;
    }
    ```

    返回值为：见上方 TS 类型。

-   ##### 示例

    手动无限添加元素：

    ```vue
    <script setup lang="ts">
    import { useScroll } from "@vueuse/core";
    import { ref, watchEffect } from "vue";
    const main = ref();
    const items = ref([1, 2, 3, 4, 5, 6]);

    const { x, y, directions, arrivedState } = useScroll(main, {
        behavior: "smooth",
    });

    watchEffect(() => {
        if (arrivedState.bottom) {
            const length = items.value.length + 1;
            for (let i = length; i < length + 6; i++) {
                items.value.push(i);
            }
        }
    });
    </script>

    <template>
        <div class="btns">
            <button @click="y += 200">去下面</button>
            <button @click="y -= 200">去上面</button>
        </div>
        <main ref="main">
            <div class="items" v-for="(item, index) in items" :key="index">{{ item }}</div>
        </main>
    </template>
    ```

      <img src="https://sbr-1314368469.cos.ap-guangzhou.myqcloud.com/Images/202301091243990.gif" alt="demo" style="zoom:80%" />

-   ##### 参见 https://vueuse.org/core/useScroll/

### useTextSelection

响应式获取用户选中文本

-   ##### 示例

    ```ts
    const { text } = useTextSelection();
    ```

      <img src="https://sbr-1314368469.cos.ap-guangzhou.myqcloud.com/Images/202301091243499.gif" alt="demo" style="zoom:80%" />

-   ##### 参见 https://vueuse.org/core/useTextSelection/

## 动画相关

### useTransition

监听源值的修改，并返回一个以过渡形式不断修改的原值镜像。

-   ##### TS 类型

    ```ts
    declare function useTransition(
        source: Ref<number>,
        options?: UseTransitionOptions
    ): ComputedRef<number>;
    declare function useTransition<T extends Ref<number[]>>(
        source: T,
        options?: UseTransitionOptions
    ): ComputedRef<number[]>;
    ```

-   ##### 详细信息

    第一个参数为监听的对象值。

    第二个参数为配置项对象。

    ```ts
    interface UseTransitionOptions {
        // 开始之前等待的时间，单位为 `ms`，默认为 0
        delay?: MaybeRef<number>;
        // 是否禁用过渡效果
        disabled?: MaybeRef<boolean>;
        // 过渡持续的时间，单位为 `ms`
        duration?: MaybeRef<number>;
        // 过渡完成时执行的回调
        onFinished?: () => void;
        // 过渡开始时执行的回调
        onStarted?: () => void;
        // 指定贝塞尔曲线，值为 [x,x,x,x]
        transition?: MaybeRef<EasingFunction | CubicBezierPoints>;
    }
    ```

-   ##### 示例

    数字过渡效果：

    ```vue
    <script setup lang="ts">
    import { useTransition } from "@vueuse/core";
    import { ref } from "vue";
    const num = ref(0);
    // 修改 num 的值会以`过渡`的形式改变 tNum 的值
    const tNum = useTransition(num, {
        transition: [0.04, 0.34, 0.52, 0.91],
        duration: 100,
    });
    </script>
    <template>
        <button @click="num += 500">增加500</button>
        <main>
            {{ tNum.toFixed(0) }}
        </main>
    </template>
    ```

      <img src="https://sbr-1314368469.cos.ap-guangzhou.myqcloud.com/Images/202301091243498.gif" alt="demo" style="zoom:80%" />

HSL 颜色过渡效果：

```vue
<script setup lang="ts">
import { useTransition } from "@vueuse/core";
import { ref, computed } from "vue";
const color = ref([110, 40, 60]);
// 修改 color 的值会以`过渡`的形式改变 outHalColor 的值
// outHalColor 为 color 的`镜像`
const outHalColor = useTransition(color.value, {
    duration: 500,
    transition: [0.04, 0.34, 0.52, 0.91],
});
const hslStyle = computed(() => {
    const [h, s, l] = outHalColor.value;
    return `hsl(${h.toFixed(0)}deg, ${s.toFixed(0)}%, ${l.toFixed(0)}%)`;
});
</script>

<template>
    <div class="btns">
        <i>Hue - 色相</i>
        <el-slider v-model="color[0]" max="360" />
        <i>Saturation - 饱和度</i>
        <el-slider v-model="color[1]" />
        <i>Lightness - 亮度</i>
        <el-slider v-model="color[2]" />
    </div>
    <main ref="main" :style="{ backgroundColor: hslStyle }">
        {{ hslStyle }}
    </main>
</template>
```

<img src="https://sbr-1314368469.cos.ap-guangzhou.myqcloud.com/Images/202301091243283.gif" alt="demo" style="zoom:80%" />

-   ##### 参见 https://vueuse.org/core/useTransition/

## 增强 Watch

### watchArray

`watchArray ` 更加侧重于监听数组源对象。

-   ##### 详细信息

    第一个参数为监听的响应式数组对象。

    第二个参数为执行的回调函数，回调函数的形参如下：

    -   ```ts
        export declare type WatchArrayCallback<V = any, OV = any> = (
            // 新值
            value: V,
            // 旧值
            oldValue: OV,
            // 添加的元素，用 `[]` 包裹
            added: V,
            // 移除的元素，用 `[]` 包裹
            removed: OV,
            // 执行回调函数前的清理函数
            onCleanup: (cleanupFn: () => void) => void
        ) => any;
        ```

-   ##### 示例

    ```ts
    import { watchArray } from "@vueuse/core";
    import { ref, onMounted } from "vue";

    const arr = ref([1, 2, 3, 4, 5]);
    watchArray(arr, (newList, oldList, added, removed) => {
        console.log(newList); // [1, 2, 3, 4, 5, 6]
        console.log(oldList); // [1, 2, 3, 4, 5]
        console.log(added); // [6]
        console.log(removed); // []
    });

    onMounted(() => {
        arr.value = [...arr.value, 6];
    });
    ```

-   ##### 参见 https://vueuse.org/shared/watchArray/

### watchDebounced

为普通的 `watch` 增加防抖功能

-   ##### 示例

    ```ts
    watchThrottled(
        source,
        () => {
            console.log("changed!");
        },
        { debounce: 100 }
    );
    ```

      <img src="https://sbr-1314368469.cos.ap-guangzhou.myqcloud.com/Images/202301091243408.gif" alt="demo" style="zoom:80%" />

-   ##### 参见 https://vueuse.org/shared/watchDebounced/

### watchThrottled

为普通的 `watch` 增加节流功能

-   ##### 示例

    ```ts
    watchThrottled(
        source,
        () => {
            console.log("changed!");
        },
        { throttle: 500 }
    );
    ```

-   ##### 参见 https://vueuse.org/shared/watchThrottled/

### watchPausable

为普通的 `watch` 增加暂停、恢复、停止功能

-   ##### 示例

    ```ts
    const source = ref("foo");
    // stop   删除监听器
    // pause  暂停监听器
    // resume 恢复监听器
    const { stop, pause, resume } = watchPausable(source, v =>
        console.log(`Changed to ${v}!`)
    );
    ```

-   ##### 参见 https://vueuse.org/core/watchPausable/

## 时间相关

### useNow

响应式获取当前时间：格式为 `Now: Tue Dec 20 2022 xx:xx:xx GMT+0800 (中国标准时间)`

-   ##### 示例

    ```ts
    import { useNow } from "@vueuse/core";

    const now = useNow();
    const { now, pause, resume } = useNow({ controls: true });
    ```

-   ##### 参见 https://vueuse.org/core/useNow/

### useDateFormat

根据传入的标记字符串获取格式化的日期。

-   ##### 详细信息

    第一个参数为时间|日期信息。

    第二个参数为格式化配置。

    -   常用：`YYYY-MM-DD HH:mm:ss` 年-月-日 时:分:秒

        -   |  输入  |       输出       | 说明                     |
            | :----: | :--------------: | ------------------------ |
            |  `YY`  |        18        | 年份：两位数             |
            | `YYYY` |       2018       | 年份：四位数             |
            |  `M`   |       1-12       | 月份：一位数             |
            |  `MM`  |      01-12       | 月份：两位数             |
            | `MMM`  |     Jan-Dec      | 月份简写                 |
            | `MMMM` | January-December | 月份简写                 |
            |  `D`   |       1-31       | 日期：一位数开始         |
            |  `DD`  |      01-31       | 日期：二位数开始         |
            |  `H`   |       0-23       | 二十四小时制：一位数开始 |
            |  `HH`  |      00-23       | 二十四小时制：二位数开始 |
            |  `h`   |       1-12       | 十二小时制：一位数开始   |
            |  `hh`  |      01-12       | 十二小时制：二位数开始   |
            |  `m`   |       0-59       | 分钟：一位数开始         |
            |  `mm`  |      00-59       | 分钟：二位数开始         |
            |  `s`   |       0-59       | 秒：一位数开始           |
            |  `ss`  |      00-59       | 秒：一位数开始           |
            | `SSS`  |     000-999      | 毫秒：三位数开始         |
            |  `A`   |      AM PM       | 大写上下午时间           |
            |  `AA`  |    A.M. P.M.     | 大写上下午时间：带 `.`   |
            |  `a`   |      am pm       | 小写上下午时间           |
            |  `aa`  |    a.m. p.m.     | 小写上下午时间：带 `.`   |
            |  `d`   |       0-6        | 星期几：周日为 `0`       |
            |  `dd`  |       S-S        | 星期几的最小名称         |
            | `ddd`  |     Sun-Sat      | 一周中一天的简称         |
            | `dddd` | Sunday-Saturday  | 一周中一天的全称         |

    第三个参数为配置项对象。

    -   ```ts
        interface UseDateFormatOptions {
            // 设置地区，配合 `dd/ddd/dddd/MMM/MMMM` 格式化使用
            locales?: Intl.LocalesArgument;
            // 一个自定义函数，用于重新修改子午线的显示方式
            customMeridiem?: (
                hours: number,
                minutes: number,
                isLowercase?: boolean,
                hasPeriod?: boolean
            ) => string;
        }
        ```

    返回值为格式化后的日期字符串

    -   ##### 示例

        ```ts
        import { useNow, useDateFormat } from "@vueuse/core";

        const formatted = useDateFormat(useNow(), "YYYY-MM-DD HH:mm:ss");
        ```

-   ##### 参见 https://vueuse.org/shared/useDateFormat/

## 工具相关

### useToggle

接收一个布尔值作为入参，返回一个函数可以切换源值的布尔值。

-   ##### 示例

    ```ts
    const bool = ref(false);
    const switchBool = useToggle(bool);

    switchBool();
    console.log(bool.value); // true

    switchBool();
    console.log(bool.value); // false
    ```

      <img src="https://sbr-1314368469.cos.ap-guangzhou.myqcloud.com/Images/202301091244371.gif" alt="demo" style="zoom:80%" />

-   ##### 参见 https://vueuse.org/shared/useToggle/
