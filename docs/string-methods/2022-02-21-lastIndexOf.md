---
lastIndexOf() 实例方法返回某个指定的字符串值在字符串中最后一次出现的索引位置
---

# *String.prototype.lastIndexOf*

> `String.lashIndexOf(searchValue [, fromIndex])`
>
> - *searchvalue* **必需**，需检索的字符串值
> - *fromindex* **可选的整数参数**，规定在子符串中开始检索的位置（ 默认值为 *string.length* ）
>     - 如省略该参数，则将从子符串的首字符开始检索
>
> #### 描述：
>
> - **千万不要**将此方法与 [array.lastIndexOf](D:\Desktop\笔记\javascript\Array方法详解\lastIndexOf.md) 混淆，因为 `string.lastIndexOf` **不是逆序寻找的❗**
> - 此方法与 `string.indexOf()` 不同的是查找字符串值在字符串中**最后一次**出现的索引位置
> - 若原字符串中**不含有**子字符串，那么会返回 `-1`
> - 此方法存在镜像方法 `string.indexOf()`
>
> |         此方法的返回值         | 兼容性 |      |
> | :----------------------------: | :----: | :--: |
> | 字符串中最后一次出现的索引位置 |   ✅    |      |

### 示例

```js
var str = "To be, or not to be, that is the question. question. question. "; <
console.log(str.lastIndexOf('question.'))//> 53
console.log(str.lastIndexOf('be'))//> 17
console.log(str.lastIndexOf('be',1))//> -1
//> 设置 fromIndex 为 1 时，此时的检查的字符串为 "To"
console.log('abab'.lastIndexOf('ab', 2))//> 2
//> 设置 fromIndex 为 2 时，此时的检查的字符串为 "aba"
```

