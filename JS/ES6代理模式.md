[TOC]

# 代理/中介者模式

**定义：**用一个中介对象来封装一系列的对象交互，中介者使各对象不需要显式地相互引用，从而使其耦合松散，而且可以独立地改变它们之间的交互。

**主要解决：**对象与对象之间存在大量的关联关系，这样势必会导致系统的结构变得很复杂，同时若一个对象发生改变，我们也需要跟踪与之相关联的对象，同时做出相应的处理。

**优点：** 

* 降低了类的复杂度，将一对多转化成了一对一。 
* 各个类之间的解耦。 
* 符合迪米特原则。

**缺点：**中介者会庞大，变得复杂难以维护。

**使用场景：** 

* 系统中对象之间存在比较复杂的引用关系，导致它们之间的依赖关系结构混乱而且难以复用该对象。 
* 想通过一个中间类来封装多个类中的行为，而又不想生成太多的子类。

**注意事项：**不应当在职责混乱的时候使用。

为其他对象提供一种代理以控制对这个对象的访问。在某些情况下，一个对象不适合或者不能直接引用另一个对象，而代理对象可以在客户端和目标对象之间起到中介的作用。

- **单一职责原则**: 面向对象设计中鼓励将不同的职责分布到细粒度的对象中，Proxy 在原对象的基础上进行了功能的衍生而又不影响原对象，符合松耦合高内聚的设计理念。
- **开放-封闭原则**：代理可以随时从程序中去掉，而不用对其他部分的代码进行修改，在实际场景中，随着版本的迭代可能会有多种原因不再需要代理，那么就可以容易的将代理对象换成原对象的调用

## ES6中的代理模式

ES6所提供`Proxy`构造函数能够让我们轻松的使用代理模式:

```JS
var proxy = new Proxy(target, handler);
```

`Proxy`构造函数传入两个参数，第一个参数`target`表示所要代理的对象，第二个参数`handler`也是一个对象用来设置对所代理的对象的行为。

本文将利用`Proxy`实现前端中3种代理模式的使用场景，分别是：**缓存代理**、**验证代理**、**实现私有属性**。

## 缓存代理

缓存代理可以将一些开销很大的方法的运算结果进行缓存，再次调用该函数时，若参数一致，则可以直接返回缓存中的结果，而不用再重新进行运算。例如在采用后端分页的表格时，每次页码改变时需要重新请求后端数据，我们可以将页码和对应结果进行缓存，当请求同一页时就不用在进行ajax请求而是直接返回缓存中的数据。

下面我们以没有经过任何优化的计算斐波那契数列的函数来假设为开销很大的方法，这种递归调用在计算40以上的斐波那契项时就能明显的感到延迟感。

```JS
const getFib = (number) => {
  if (number <= 2) {
    return 1;
  } else {
    return getFib(number - 1) + getFib(number - 2);
  }
}
```

现在我们来写一个创建缓存代理的工厂函数:

```JS
const getCacheProxy = (fn, cache = new Map()) => {
  return new Proxy(fn, {
    apply(target, context, args) {
      const argsString = args.join(' ');
      if (cache.has(argsString)) {
        // 如果有缓存,直接返回缓存数据
        console.log(`输出${args}的缓存结果: ${cache.get(argsString)}`);
        
        return cache.get(argsString);
      }
      const result = fn(...args);
      cache.set(argsString, result);

      return result;
    }
  })
}
```

调用方法如下：

```JS
const getFibProxy = getCacheProxy(getFib);
getFibProxy(40); // 102334155
getFibProxy(40); // 输出40的缓存结果: 102334155
```

当我们第二次调用`getFibProxy(40)`时，`getFib`函数并没有被调用，而是直接从`cache`中返回了之前被缓存好的计算结果。通过加入缓存代理的方式，`getFib`只需要专注于自己计算斐波那契数列的职责，缓存的功能使由`Proxy`对象实现的。这实现了我们之前提到的**单一职责原则**。

## 验证代理

`Proxy`构造函数第二个参数中的`set`方法，可以很方便的验证向一个对象的传值。我们以一个传统的登陆表单举例，该表单对象有两个属性,分别是`account`和`password`，每个属性值都有一个简单和其属性名对应的验证方法，验证规则如下：

```JS
// 表单对象
const userForm = {
  account: '',
  password: '',
}

// 验证方法
const validators = {
  account(value) {
    // account 只允许为中文
    const re = /^[\u4e00-\u9fa5]+$/;
    return {
      valid: re.test(value),
      error: '"account" is only allowed to be Chinese'
    }
  },
  password(value) {
    // password 的长度应该大于6个字符
    return {
      valid: value.length >= 6,
      error: '"password "should more than 6 character'
    }
  }
}
```

下面我们来使用`Proxy`实现一个通用的表单验证器

```JS
const getValidateProxy = (target, validators) => {
  return new Proxy(target, {
    _validators: validators,
    set(target, prop, value) {
      if (value === '') {
        console.error(`"${prop}" is not allowed to be empty`);
        return target[prop] = false;
      }
      const validResult = this._validators[prop](value);
      if(validResult.valid) {
        return Reflect.set(target, prop, value);
      } else {
        console.error(`${validResult.error}`);
        return target[prop] = false;
      }
    }
  })
}
```

调用方式如下

```JS
const userFormProxy = getValidateProxy(userForm, validators);
userFormProxy.account = '123'; // "account" is only allowed to be Chinese
userFormProxy.password = 'he'; // "password "should more than 6 character
```

我们调用`getValidateProxy`方法去生成了一个代理对象`userFormProxy`，该对象在设置属性的时候会根据`validators`的验证规则对值进行校验。

## 实现私有属性

代理模式还有一个很重要的应用是实现访问限制。总所周知，JavaScript是没有私有属性这一个概念的，通常私有属性的实现是通过函数作用域中变量实现的，虽然实现了私有属性，但对于可读性来说并不好。

私有属性一般是以`_`下划线开头，通过`Proxy`构造函数中的第二个参数所提供的方法，我们可以很好的去限制以`_`开头的属性的访问。

下面我来实现`getPrivateProps`这个函数，该函数的第一个参数`obj`是所被代理的对象，第二个参数`filterFunc`是过滤访问属性的函数，目前该函数的作用是用来限制以`_`开头的属性访问。

```js
function getPrivateProps(obj, filterFunc) {
  return new Proxy(obj, {
    get(obj, prop) {
      if (!filterFunc(prop)) {
        let value = Reflect.get(obj, prop);
        // 如果是方法, 将this指向修改原对象
        if (typeof value === 'function') {
          value = value.bind(obj);
        }
        return value;
      }
    },
    set(obj, prop, value) {
      if (filterFunc(prop)) {
        throw new TypeError(`Can't set property "${prop}"`);
      }
      return Reflect.set(obj, prop, value);
    },
    has(obj, prop) {
      return filterFunc(prop) ? false : Reflect.has(obj, prop);
    },
    ownKeys(obj) {
      return Reflect.ownKeys(obj).filter(prop => !filterFunc(prop));
    },
    getOwnPropertyDescriptor(obj, prop) {
      return filterFunc(prop) ? undefined : Reflect.getOwnPropertyDescriptor(obj, prop);
    }
  });
}

function propFilter(prop) {
  return prop.indexOf('_') === 0;
}
```

在上面的`getPrivateProps`方法的内部实现中, `Proxy`的第二个参数中我们使用了提供的`get`,`set`,`has`,`ownKeys`, `getOwnPropertyDescriptor`这些方法，这些方法的作用其实本质都是去最大限度的限制私有属性的访问。其中在`get`方法的内部，我们有个判断，如果访问的是对象方法使将`this`指向被代理对象，这是在使用`Proxy`需要十分注意的，如果不这么做方法内部的`this`会指向`Proxy`代理。

下面来看一下`getPrivateProps`的调用方法，并验证其代理提供的访问控制的能力。

```js
const myObj = {
  public: 'hello',
  _private: 'secret',
  method: function () {
    console.log(this._private);
  }
},

myProxy = getPrivateProps(myObj, propFilter);

console.log(JSON.stringify(myProxy)); // {"public":"hello"}
console.log(myProxy._private); // undefined
console.log('_private' in myProxy); // false
console.log(Object.keys(myProxy)); // ["public", "method"]
for (let prop in myProxy) { console.log(prop); }    // public  method
myProxy._private = 1; // Uncaught TypeError: Can't set property "_private"
```

一场测试结束后，公布结果：告知解答出题目的人挑战成功，否则挑战失败。

```js
const player = function(name) {
  this.name = name
  playerMiddle.add(name)
}

player.prototype.win = function() {
  playerMiddle.win(this.name)
}

player.prototype.lose = function() {
  playerMiddle.lose(this.name)
}

const playerMiddle = (function() { // 将就用下这个 demo，这个函数当成中介者
  const players = []
  const winArr = []
  const loseArr = []
  return {
    add: function(name) {
      players.push(name)
    },
    win: function(name) {
      winArr.push(name)
      if (winArr.length + loseArr.length === players.length) {
        this.show()
      }
    },
    lose: function(name) {
      loseArr.push(name)
      if (winArr.length + loseArr.length === players.length) {
        this.show()
      }
    },
    show: function() {
      for (let winner of winArr) {
        console.log(winner + '挑战成功;')
      }
      for (let loser of loseArr) {
        console.log(loser + '挑战失败;')
      }
    },
  }
}())

const a = new player('A 选手')
const b = new player('B 选手')
const c = new player('C 选手')

a.win()
b.win()
c.lose()

// A 选手挑战成功;
// B 选手挑战成功;
// C 选手挑战失败;
```

## 虚拟代理合并 HTTP 请求

```JS
/* 
 * 点击 checkbox 即同步文件
 * 反面例子
 */
var syncFile = function (id) {
  console.log('开始同步文件，id 为' + id)
}

var checkbox = document.getElementsByTagName('input')

for (var i = 0, c; c = checkbox[i++]; ) {
  c.onclick = function () {
    if (this.checked === true) {
      syncFile(this.id)
    }
  }
}

// 使用代理
var syncFile = function (id) {
  console.log('开始同步文件，id 为' + id)
}

var proxySyncFile = (function () {
  var cache = []
  var timer

  return function (id) {
    cache.push(id)
    if (timer) {
      return
    }

    timer = setTimeout(function () {
      syncFile(cache.join(',')) // 2 秒后向本体发送需要同步的 ID 集合。
      clearTimeout(timer)
      timer = null
      cache.length = 0
    }, 2000)
  }
})()

var checkbox = document.getElementsByTagName('input')
for (var i = 0, c; c = checkbox[i++]; ) {
  c.onclick = function () {
    if (this.checked === true) {
      proxySyncFile(this.id)
    }
  }
}
```

## 缓存代理用于 Ajax 异步请求数据

与计算乘积不同的是，请求数据是个异步操作，无法直接把计算结果放到代理对象的缓存中，而是要通过回调的方式。

```JS
var pageProxy = (function () {
  var cache = {}
  return function (fn) { // fn 作为处理页码数据的函数
    var pageData = cache[page]
    if (pageData) {
      return fn(pageData) //返回制定页码的数据
    }
    http.getPage(page) // 获取制定页码的数据
      .then((data) => {
        cache[page] = data //存放数据
        fn(data)
      })
  }
})()
```

## 用高阶函数动态创建代理

通过传入高阶函数这种更加灵活的方式，可以为各种计算方法创建缓存代理。

```JS
/* 
 * 创建缓存代理的工厂
 */

var createProxyFactory = function (fn) {
  var cache = {}
  return function () {
    var args = Array.prototype.join.call(arguments, ',')
    if (args in cache) {
      return cache[args]
    }
    return cache[args] = fn.apply(this, arguments)
  }
}

var proxyMult = createProxyFactory(mult)

proxyMult(1, 2, 3, 4)
```