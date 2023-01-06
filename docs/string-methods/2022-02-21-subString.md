---
subString() 实例方法截取源字符串的一部分
---

# *String.prototype.subString*

> `String.subString(startIndex [, endIndex])`
>
> - *startIndex* **必需**，规定**开始截取字符串的索引位置**
>     - 若该值为负数，则为 `0`
> - *endIndex* **可选**，规定**停止截取字符串的索引位置** （ 默认值为 `str.length` ）
>     - 若该值为负数，则为 `0`
>
> #### 描述：
>
> - 此方法的效果与 `string.splice` 一致，但需要注意的是，参数如果为 **负值** 将会隐式的变为 `0`
>     - 可以理解为 `string.splice` 的**阉割版**
>
> |   此方法的返回值   | 兼容性 |
> | :----------------: | :----: |
> | 截取出来的新字符串 |   ✅    |

### 示例

```js
var str = "Apple Is My Love";
console.log(str.substring(0,-3));
//> ""：提取源字符串，从索引[0]开始，到索引的[0]结束
console.log(str.substring(2,6));
//> "ple "：提取源字符串，从索引[2]开始，到索引[6]结束（第三个字符到第七个字符之间）
console.log(str.substring(-3))
//> "Apple Is My Love"：提取源字符串，从索引[0]开始到末尾结束
```

