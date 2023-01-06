---
startsWith() 实例方法判断子字符串是否在源字符串的开头
---

# *String.prototype.startsWith*

> `String.startsWith(searchString[, position])`
>
> - *searchString* **必需**，要判断的子字符串（ 开头处 ）
> - *position* **可选**，一个 Number 数字，设置从源字符串哪里的索引位置进行判断
>
> #### 描述：
>
> - 此方法是**大小写敏感**的
> - 如果传入的子字符串在搜索字符串的末尾则返回 `true` 
>     - 反之返回 `false`
>
> | 此方法的返回值 | 兼容性 |
> | :------------: | :----: |
> |    Boolean     |   ⚠    |

### 示例

```js
var str = "To be, or not to be, that is the question.";
console.log(str.startsWith('question.'))//> false
console.log(str.startsWith('To be'))//> true
console.log(str.startsWith('To be',1))//> false
//> 设置开头为 1 时，字符串为 "o be, or not to be, that is the question."
```

