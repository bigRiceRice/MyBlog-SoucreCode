---
title: 原型 & ES5 的那些继承模式一览
author: BigRice
date: 2023-02-01
location: 云梦泽
summary: 根据红宝书第 8 章提炼出来的关于原型、继承模式的知识点
tags:
    - 红宝书
---

## 原型

> 原型即构造函数身上的一个名为 `prototype` 属性指向的对象，该对象中存放着在各个实例中共享的属性与方法。

无论何时，只要创建了对象（包括函数，函数也是对象），都会按照特定的规则为这个函数创建一个 prototype 属性（指向原型对象）。默认情况下，所有原型对象自动获得一个名为 `constructor` 属性，指回与之关联的构造函数。

在自定义构造函数时，原型对象默认只会获得 `constructor` 属性，其他的所有方式都继承自 Object，每次调用构造函数创建一个新实例，这个实例的内部 `[[prototype]]` 指针就会被赋值为构造函数的原型对象。在原生 JS 中没有访问 `[[prototype]]` 特性的标准方式，但 Fixfox、Safari、Chrome 会在每个对象上暴露 `__proto__` 属性，通过这个属性可以访问到对象的原型。

关键在于一点：**实例与构造函数原型之间有直接的联系，但实例与构造函数之间没有**。

![image-20230201175454377](https://sbr-1314368469.cos.ap-guangzhou.myqcloud.com/Images/202302011754454.png)

> 只有实例对象才会被添加 `__proto__` 属性，构造函数默认暴露 `prototype` ，也就没有 `__proto__` 存在的必要了

## 原型链

我们都知道一个实例对象的 prototype 指向的是构造函数的 prototype，那么这个构造函数的原型对象中还会通过 prototype 属性链接到 Objec.prototype 直到 null 的出现，原型链才算到头了。我们需要获取一个对象的属性时，就会沿着原型链不断向上查找，直到找到。初次之外，原型链是 ES6 之前完成继承的主要方式之一。

假设我有一个实例对象，这个时候我先若想访问这个实例上的属性，那么首先会去该实例对象上查找，如果有就返回，如果没有就去往改构造函数的原型（ `prototype` ）上查找，如果找到就返回，如果还是没有就在这个原型的 `prototype` 上接着查找，直到找到原型链的最顶层 `Object.prototype` 上。那么这个属性查找的规则就可以看出原型链的存在了。

## ES5 继承

## 前言

纵观 ECMAScript 规范的历次发布，每个版本的特性似乎都出人意料，ECMAScript 5.1 并没有正式支持面向对象的结构， 例如类或继承。但是，正如接下来几节会介绍的，巧妙运用原型式继承可以成功地模拟同样的行为。

ECMAScript6 开始正式支持类和继承。ES6 的类，旨在完全涵盖之前规范设计的基于原型的继承模式。不论从哪方面看，ES6 的类都仅仅式封装了 ES5.1 构造函数加原型继承的**语法糖**罢了。

> 注意：不要误会：采用面向对象编程模式的 JavaScript 代码还是应该使用 ECMAScript6 的类。但不管怎么说，了解 ES6 类出现之前的惯例总是有益无害的。特别是 ES6 类定义本身就相当于对原有结构的封装。

### 前置知识

-   构造函数的返回值将是一个对象，并不是函数。
-   JS 中的任何类型都是对象，函数也不例外。
-   任何对象都存在原型以及原型链。

## 关于继承

继承是面向对象编程中讨论最多的话题。很多面向对象语言都支持两种继承：接口继承与实现继承。前者只继承方法签名，后者继承实际的方法。但接口继承在 ECMAScript 中是不可能的，因为函数没有签名。实现继承是 ECMAScript 唯一支持的方式，而这主要是通过原型链实现的。

在 ES5 时期，总共有以下几种继承模式

-   原型链继承
-   盗用构造函数继承
-   组合继承
-   原型式继承
-   寄生式继承
-   寄生式组合继承

## 原型链继承

> ECMA-262 把**原型链**定义为 ECMAScript 的主要继承方式，下面任何一样继承模式都是在原型链的基础上实现的。

原型链继承的基本思想是通过原型继承多个引用类型的属性和方法。回想一下构造函数、原型、实例之间的关系就可以看出原型链继承是 JS 无处不在的东西。

若想在一段原型链中继承一个父类，代码看起来像这样：

```js
function Person() {
    this.body = true;
}

Person.prototype.sayBody = function () {
    return this.body;
};

function Women() {
    this.sex = "female";
}
// 修改原型链，使 Anya 继承 Person 的实例
Women.prototype = new Person();
Women.prototype.saySex = function () {
    return this.sex;
};

const anya = new Women();
console.log(anya.saySex()); // 'female'
console.log(anya.sayBody()); // true
```

以上代码定义了两个类型：Person 超类与 Women 类，这两个类型分别定义了一个属性和方法。

代码中 Women 类通过创建 Person 类的实例并将它赋值给自己的原型，实现了对 Person 超类的继承。然后又创建了一个 anya 实例对象。如果将这段关系可视化，将是这样的：

![image-20230201230237910](https://sbr-1314368469.cos.ap-guangzhou.myqcloud.com/Images/202302012302972.png)

这个例子中实现继承的关键，是 Women 类并没有使用默认的原型，而是将它替换为了 Person 的实例对象。这样一来，Women 的实例对象不仅能从 Person 的实例中继承属性和方法，而且还通过原型链与 Person 的原型挂上了钩。

于是 anya 实例对象就可以一路通过原型链来查找属性与方法了。我们尝试调用的 saySex()，其实调用的是 Women.prototype 上的方法，调用 sayBody() 其实是 Person.prototype 上的方法。

你可能会注意到在 Person 构造函数中定义的 body 属性怎么存在了 Women 的原型上，这是因为 Women 的原型是 Person 的实例对象，那么原本的 Person.body 自然而然成为了 Women.prototype.body，这其实是原型链继承的一个瑕疵，我们将在后面的继承模式中修复这个瑕疵。

### 问题

原型链继承存在着一些问题：

在使用原型链继承时，子类原型实际上变成了超类的一个实例，那么父类**实例中的属性就变成了原型对象属性**

-   比如 body 属性应该是一个实例属性，但由于创建了一个实例来实现继承，这个本该是实例属性的属性摇身一变成了原型属性。

以及子类向超类实例传参问题

-   因为我们是在外部修改的原型链，导致我们在使用 new Women() 创建实例时，是无法给超类 new Person() 传参的

同样还有的一个老生常谈的问题：

假如原型中包含引用值，那么每个实例都将共享这个值，实例 A 修改了原型的值，实例 B 也会同步改变。

-   在某些情况这不是一个问题。

## 盗用构造函数

为了解决原型链包含应用值导致的实例共享问题，一种叫做“盗用构造函数（constructor stealing）” 的技术在开发社区流行起来。

这种思路很简单：在子类构造函数中之间盗用父类构造函数并调用。因为毕竟函数就是在特定上下文中执行代码的简单对象，所有可以使用 `apply ` & `call` 来实现创建新的 `this` 达到“盗用”。来看下面的例子：

```js
function Person() {
    this.colors = ["red", "blue"];
}

function Women() {
    // 盗用 Person 的构造函数并调用实现继承
    Person.call(this);
}
const anya = new Women();
anya.colors.push("blcak");
const goodwin = new Women();

console.log("anya", anya); //  ['red', 'blue', 'blcak']
console.log("goodwin", goodwin); // ['red', 'blue']
```

在第 7 行展示了盗用构造函数的调用。通过使用 `call` 方法，Person 构造函数在为 Women 的实例创建的新对象上下文中执行了。这相当于性的 Women 对象上运行了 Person 中的所有初始化代码。结果就是每个实例都有自己 colors 属性，且互不共享。

### 传递参数

相比于原型链继承，盗用构造函数的一个优点就是可以在子类构造函数中**向父类构造函数传参**。来看下面的例子

```js
function Person(name) {
    this.name = name;
}

function Women(name, age) {
    // 继承 Person 并传参
    Person.call(this, name);
    // 自定义的实例属性
    this.age = age;
}

const anya = new Women("anya", 17);
console.log(anya.name); // 'anya'
console.log(anya.age); // 17
```

### 问题

盗用构造函数的主要问题，也是使用构造函数模式自定义类型的问题：

-   因为没有原型的参加，导致父类上所有函数/属性必须在构造函数中定义，一些可复用的函数无法定义在原型上。
-   因为没有原型的参加，导致我们无法获取父类原型上的任何属性了。

## 🍭 组合继承

组合继承（有时候也称为为经典继承）综合了原型链和盗用构造函数，将两者的优点集中了起来。基本的思路是使用原型链继承原型上的属性和方法，而通过盗用构造函数继承实例属性。

这样即可以把方法定义在原型上以实现重用，又可以让每个实例都有自己的属性。来看下面的例子：

```js
function Person(name) {
    this.name = name;
    this.colors = ["red", "blue"];
}

Person.prototype.sayName = function () {
    console.log(this.name);
};

function Women(name, age) {
    // 继承实例属性
    Person.call(this, name);
    this.age = age;
}

// 继承原型方法
Women.prototype = new Person();
Women.prototype.sayAge = function () {
    console.log(this.age);
};

const anya = new Women("anya", 17);
anya.colors.push("black");
console.log(anya.colors); // ['red', 'blue', 'black']
anya.sayName(); // 'anya'
anya.sayAge(); // 17

const goodwin = new Women("goodwin", 20);
console.log(goodwin.colors); // ['red', 'blue']
goodwin.sayName(); // 'goodwin'
goodwin.sayAge(); // 20
```

在这个例子中，Person 构造函数定义了两个属性，name 和 colors，而它的原型上定义了一个 sayName() 方法。

而在 Women 构造函数中，通过盗用构造函数继承了实例属性，通过将原型赋值为 Person 的实例对象来继承 Person 的原型方法。

这样一来，Women 的实例可以拥有 Women 和 Person 构造函数中定义属性，且还能共享调用 Person 超类的原型方法 sayName()。

> 组合继承弥补了原型链继承与盗用构造函数的不足之处，是 JavaScript 使用最多的继承方法。而且组合继承也保留了 instanceof() 操作符和 isPrototype() 方法识别合成对象的能力。

### 问题

一个效率问题，由于组合继承

-   在继承实例属性时盗用了构造函数并调用

-   在继承原型方法时调用了 new Person()

这导致 Person 的构造函数不可避免地被调用了两次，直接的影响就是 **定义在父类构造函数中实例属性变成了子类的原型属性** ，虽然子类的实例属性遮蔽了原型上的同名属性，但原型上的这些属性是完全没必要被定义的。

> 解决方式就是使用 **寄生组合式继承**

一个规范问题

-   Women.prototype 将不存在 constructor 属性，这不是一个正规的构造函数的原型的表现形式。
-   当然这个问题可以直接被解决掉

## 原型式继承

2006 年，Douglas Crockford 写了一篇文章：《JavaScript 中的原型式继承》（“Prototypal Inheritance in JavaScript”）。这篇文章介绍了一种不涉及严格意义上构造函数的继承方式。它的出发点是即使不自定义类型也可以通过原型实现**对象之间的信息共享**。文章在最后给出了一个函数：

```js
function object(o) {
    function F() {}
    F.prototype = o;
    return new F();
}
```

这个 object() 函数会创建一个临时构造函数，将传入的对象赋值给这个构造函数的原型，随后返回这个临时对象的实例。

本质上，object() 是对传入的对象执行了一次浅复制。来看下面的例子：

```js
let person = {
    name: "john",
    firends: ["goodwin", "timi", "Anya"],
};

const person1 = object(person);
person1.name = "rob";
person1.firends.push("adc");
const person2 = object(person1);
person1.name = "jack";
person1.firends.push("36D");

console.log(person1.firends); // ["goodwin", "timi", "Anya", "adc", "36D"]
console.log(person1);
```

原型式继承适用于这种情况：你有一个对象，想在它的基础上在创建一个新的对象。你需要把这个对象先传给 object() 函数，然后再对返回的对象进行适当修改。

在这个例子中，person 定义了另一个对象也可以访问的共享信息，把他传给 obejct() 函数后会返回一个新的对象。这个新对象的原型指向了 person ，意味着原型上既有原始值属性又有引用值属性。这也意味着 person.friends 不仅是 person 的属性，还会和 person1 、person2 共享。所以一套流程下来实际克隆了两个 person。

> ES5 新增的 Object.create() 就是将原型式继承的概念规范化了。

寄生式继承（object()）的原理十分简单，就是不断对一个对象如同套娃一般不断的叠加原型，使上一个对象所有属性都在原型上共享下去。

## 寄生式继承

与原型式继承比较接近的一种继承方式是**寄生式继承（parasitic inheritance）**，也是 Crockfod 在当时首倡的一种模式。

寄生式继承的背后的思路类似于寄生构造函数与工厂模式：创建一个实现继承的函数，以某种方式增强对象，然后返回这个对象。

基本的寄生继承模式如下：

```js
function createAnother(original) {
    const clone = object(original); // 通过调用 object 叠加一层原型创建一个新对象
    clone.sayHello = () => console.log("Hello~"); // 增强这个新对象
    // 返回这个新对象
    return clone;
}
```

在这段代码中，createAnother() 函数接收一个参数，就是新对象的基准对象。这个对象 original 会被传递给 object 函数叠加一层原型，然后将返回的新对象赋值给 clone 。接着给 clone 添加一个 sayHello 方法。最后返回 clone。

我们可以像下面这样使用 createAnother() 函数：

```js
let person = {
    name: "john",
    firends: ["goodwin", "timi", "Anya"],
};
const antherPerson = createAnother(person);
antherPerson.sayHello(); // 'Hello~'
```

寄生式继承同样适合主要关注对象，而不在乎类型和构造函数的场景。且 object() 函数不是寄生式继承所必需的，任何返回新对象的函数都可以在这里使用。

## 🍧 寄生式组合继承

前面说到过，组合继承也存在着诸多问题。好在有办法解决这些问题。

寄生式组合继承通过盗用构造函数的思路继承属性，但使用但使用混合式原型链继承方式。其思路是不调用父类的构造函数，而是直接克隆父类原型的副本。

说到底就是通过**寄生式继承来继承父类原型**，然后将返回的函数对象赋值给子类原型。

寄生式组合继承的基本模式如下所示：

```js
function inheritPrototype(subType, superType) {
    function _object(o) {
        function F() {}
        F.prototype = o;
        return new F();
    }
    // 创建原型函数对象
    const prototype = _object(superType.prototype);
    // 补全原型函数对象
    prototype.constructor = superType;
    // 赋值子类原型
    subType.prototype = prototype;
}
```

这个 inheritPrototype() 函数中实现了寄生式组合继承的核心逻辑。

这个函数接收两个参数：父类构造函数与子类构造函数。在函数内部，第一步先创建父类原型的一个副本。然后，给返回的 prototype 对象设置 constructor 属性，解决由于重写原型导致默认 constructor 丢失的问题。最后将新创建的对象赋给子类型的原型。如下例所示，调用 inheritPrototype() 可以实现前面例子中的子类型原型赋值：

```js
function Person(name) {
    this.name = name;
    this.colors = ["red", "blue"];
}

Person.prototype.sayName = function () {
    console.log(this.name);
};

function Women(name, age) {
    // 继承实例属性
    Person.call(this, name);
    this.age = age;
}

// 继承原型属性
function inheritPrototype(subType, superType) {
    function object(o) {
        function F() {}
        F.prototype = o;
        return new F();
    }
    // 创建原型函数对象
    const prototype = object(superType.prototype);
    // 补全原型函数对象
    prototype.constructor = subType;
    // 赋值子类原型
    subType.prototype = prototype;
}
inheritPrototype(Women, Person);

Women.prototype.sayAge = function () {
    console.log(this.age);
};

const anya = new Women("anya", 17);
anya.colors.push("black");
console.log(anya.colors); // ['red', 'blue', 'black']
anya.sayName(); // 'anya'
anya.sayAge(); // 17
console.log("anya", anya);

const goodwin = new Women("goodwin", 20);
console.log(goodwin.colors); // ['red', 'blue']
goodwin.sayName(); // 'goodwin'
goodwin.sayAge(); // 20
```

使用寄生式组合继承后，只调用了一次 Person 构造函数，避免了 Women.prototype 上不必要也用不到的属性。

## 温习

![code](https://sbr-1314368469.cos.ap-guangzhou.myqcloud.com/Images/202302020121017.png)
