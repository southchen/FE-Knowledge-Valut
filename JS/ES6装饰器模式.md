[TOC]

# 装饰器模式

**定义：**动态地给一个对象添加一些额外的职责。就增加功能来说，装饰器模式相比生成子类更为灵活。

**主要解决：**一般的，我们为了扩展一个类经常使用继承方式实现，由于继承为类引入静态特征，并且随着扩展功能的增多，子类会很膨胀。

**何时使用：**在不想增加很多子类的情况下扩展类。

**如何解决：**将具体功能职责划分，同时继承装饰者模式。

**优点：**装饰类和被装饰类可以独立发展，不会相互耦合，装饰模式是继承的一个替代模式，装饰模式可以动态扩展一个实现类的功能。

**缺点：**多层装饰比较复杂。

**使用场景：** 

* 扩展一个类的功能。 
* 动态增加功能，动态撤销。

**注意事项：**可代替继承。

向一个现有的对象添加新的功能，同时又不改变其结构的设计模式被称为装饰器模式（Decorator Pattern），它是作为现有的类的一个包装（Wrapper）。

下面我将实现3个装饰器，分别为`@autobind`、`@debounce`、`@deprecate`。

##  `@autobind`实现`this`指向原对象

在JavaScript中，`this`的指向问题一直是一个老生常谈的话题，在Vue或React这类框架的使用过程中，新手很有可能一不小心就丢失了`this`的指向导致方法调用错误。例如下面一段代码：

```JS
class Person {
  getPerson() {
    return this;
  }
}

let person = new Person();
let { getPerson } = person;

console.log(getPerson() === person); // false
```

上面的代码中， `getPerson`方法中的`this`默认指向`Person`类的实例，但是如果将`Person`通过解构赋值的方式提取出来，那么此时的`this`指向为`undefined`。所以最终的打印结果为`false`。

此时我们可以实现一个`autobind`的函数，用来装饰`getPerson`这个方法，实现`this`永远指向`Person`的实例。

```JS
function autobind(target, key, descriptor) {
  var fn = descriptor.value;
  var configurable = descriptor.configurable;
  var enumerable = descriptor.enumerable;
  // 返回descriptor
  return {
    configurable: configurable,
    enumerable: enumerable,
    get: function get() {
      // 将该方法绑定this
      var boundFn = fn.bind(this);
      // 使用Object.defineProperty重新定义该方法
      Object.defineProperty(this, key, {
        configurable: true,
        writable: true,
        enumerable: false,
        value: boundFn
      })
      return boundFn;
    }
  }
}
```

我们通过`bind`实现了`this`的绑定，并在`get`中利用`Object.defineProperty`重写了该方法，将`value`定义为通过`bind`绑定后的函数`boundFn`，以此实现了`this`永远指向实例。下面我们为`getPerson`方法加上装饰并调用。

```JS
class Person {
  @autobind
  getPerson() {
    return this;
  }
}

let person = new Person();
let { getPerson } = person;

console.log(getPerson() === person); // true
```

## `@debounce`实现函数防抖

函数防抖(debounce)在前端项目中有着很多的应用，例如在`resize`或`scroll`等事件中操作DOM，或对用户输入实现实时ajax搜索等会被高频的触发，前者会对浏览器性能产生直观的影响，后者会对服务器产生较大的压力，我们期望这类高频连续触发的事件在触发结束后再做出响应，这就是函数防抖的应用。

```
class Editor {
  constructor() {
    this.content = '';
  }

  updateContent(content) {
    console.log(content);
    this.content = content;
    // 后面有一些消耗性能的操作
  }
}

const editor1 = new Editor();
editor1.updateContent(1);
setTimeout(() => { editor1.updateContent(2); }, 400);


const editor2= new Editor();
editor2.updateContent(3);
setTimeout(() => { editor2.updateContent(4); }, 600);

// 打印结果: 1 3 2 4
```

上面的代码中我们定义了`Editor`这个类，其中`updateContent`方法会在用户输入时执行并可能有一些消耗性能的DOM操作，这里我们在该方法内部打印了传入的参数以验证调用过程。可以看到4次的调用结果分别为`1 3 2 4`。

下面我们实现一个`debounce`函数，该方法传入一个数字类型的`timeout`参数。

```
function debounce(timeout) {
  const instanceMap = new Map(); // 创建一个Map的数据结构，将实例化对象作为key

  return function (target, key, descriptor) {

    return Object.assign({}, descriptor, {
      value: function value() {

        // 清除延时器
        clearTimeout(instanceMap.get(this));
        // 设置延时器
        instanceMap.set(this, setTimeout(() => {
          // 调用该方法
          descriptor.value.apply(this, arguments);
          // 将延时器设置为 null
          instanceMap.set(this, null);
        }, timeout));
      }
    })
  }
}
```

上面的方法中，我们采用了ES6提供的`Map`数据结构去实现实例化对象和延时器的映射。在函数的内部，首先清除延时器，接着设置延时执行函数，这是实现`debounce`的通用方法，下面我们来测试一下`debounce`装饰器。

```
class Editor {
  constructor() {
    this.content = '';
  }

  @debounce(500)  
  updateContent(content) {
    console.log(content);
    this.content = content;
  }
}

const editor1 = new Editor();
editor1.updateContent(1);
setTimeout(() => { editor1.updateContent(2); }, 400);


const editor2= new Editor();
editor2.updateContent(3);
setTimeout(() => { editor2.updateContent(4); }, 600);

//打印结果： 3 2 4
```

上面调用了4次`updateContent`方法，打印结果为`3 2 4`。`1`由于在`400ms`内被重复调用而没有被打印，这符合我们的参数为`500`的预期。

## `@deprecate`实现警告提示

在使用第三方库的过程中，我们会时不时的在控制台遇见一些警告，这些警告用来提醒开发者所调用的方法会在下个版本中被弃用。这样的一行打印信息也许我们的常规做法是在方法内部添加一行代码即可，这样其实在源码阅读上并不友好，也不符合单一职责原则。如果在需要抛出警告的方法前面加一个`@deprecate`的装饰器来实现警告，会友好得多。

下面我们来实现一个`@deprecate`的装饰器，其实这类的装饰器也可以扩展成为打印日志装饰器`@log`，上报信息装饰器`@fetchInfo`等。

```JS
function deprecate(deprecatedObj) {

  return function(target, key, descriptor) {
    const deprecatedInfo = deprecatedObj.info;
    const deprecatedUrl = deprecatedObj.url;
    // 警告信息
    const txt = `DEPRECATION ${target.constructor.name}#${key}: ${deprecatedInfo}. ${deprecatedUrl ? 'See '+ deprecatedUrl + ' for more detail' : ''}`;
    
    return Object.assign({}, descriptor, {
      value: function value() {
        // 打印警告信息
        console.warn(txt);
        descriptor.value.apply(this, arguments);
      }
    })
  }
}
```

上面的`deprecate`函数接受一个对象参数，该参数分别有`info`和`url`两个键值，其中`info`填入警告信息，`url`为选填的详情网页地址。下面我们来为一个名为`MyLib`的库的`deprecatedMethod`方法添加该装饰器吧！

```JS
class MyLib {
  @deprecate({
    info: 'The methods will be deprecated in next version', 
    url: 'http://www.baidu.com'
  })
  deprecatedMethod(txt) {
    console.log(txt)
  }
}

const lib = new MyLib();
lib.deprecatedMethod('调用了一个要在下个版本被移除的方法');
// DEPRECATION MyLib#deprecatedMethod: The methods will be deprecated in next version. See http://www.baidu.com for more detail
// 调用了一个要在下个版本被移除的方法
```

## AOP

比如我们想给 window 绑定 onload 事件，但又不确定这个事件是否已经被其他人绑定过，为了避免覆盖之前的 window.onload 函数中的行为，我们一般都会先保存好原先的 window.onload，把它放入新的 window.onload 里执行。

```js
window.onload = function () {
    alert(1)
}

var _onload = window.onload || function () {}

window.load = function () {
    _onload()
    alert(2)
}
```

#### 用 AOP 装饰函数

```js
Function.prototype.before = function (beforefn) {
  var __self = this // 保存原函数的引用
  return function () { // 返回包含了元函数和新函数的“代理”函数
    // 执行新函数，且保证 this 不被劫持，新函数接受的参数
    // 也会被原封不动地传入原函数，新函数在原函数之前执行
    beforefn.apply(this, arguments)
    
    // 执行原函数并返回原函数的执行结果，并保证 this 不被劫持
    return __self.apply(this, arguments)
  }
}

Function.prototype.after = function (afterfn) {
  var __self = this
  return function () {
    var ret = __self.apply(this, arguments)
    afterfn.apply(this, arguments)
    return ret
  }
}

// 之前的 window.onload 例子

window.onload = function () {
  alert(1)
}

window.onload = (window.onload || function () {}).after(function () {
  alert(2)
}).after(function () {
  alert(3)
}).after(function () {
  alert(4)
})
```

不污染原型的方式：把原函数和新函数都作为参数传入 before 或 after 方法：

```js
var before = function (fn, beforefn) {
  return function () {
    beforefn.apply(this, arguments)
    return fn.apply(this, arguments)
  }
}

var a = before(
  function () {alert(3)},
  function () {alert(2)}
)
a = before(a, function () {alert(1)})

a()
```

#### AOP 的应用案例

##### 1. 数据统计上报

分离业务代码和数据统计代码，无论在什么语言中，都是 AOP 的经典应用之一。在项目开发的结尾开阶段难免要加上很多统计数据的代码，这些过程可能让我们被迫改动早已封装好的函数。

```js
/* 
<html>
  <button tag="login" id="button">点击打开登录浮层</button>
</html>
*/
var showLogin = function () {
  console.log('打开登录浮层')
  log(this.getAttribute('tag'))
}

var log = function (tag) {
  console.log(`上报标签为：${tag}`)
  // (new Image).src = `http://xxx.com/report?tag=${tag}` // 真正的上报代码略
}

document.getElementById('button').onclick = showLogin
```

showLogin 函数里既要负责打开登录图层，又要负责数据上报，这是两个层面的功能，在此处却要被耦合在一个函数里。使用 AOP 分离之后，代码如下：

```js
/* 
<html>
  <button tag="login" id="button">点击打开登录浮层</button>
</html>
*/

Function.prototype.after = function (afterfn) {
  var __self = this

  return function () {
    var ret = __self.apply(__self, arguments)
    afterfn.apply(this, arguments)
    return ret
  }
}

var showLogin = function () {
  console.log('打开登录浮层')
}

var log = function () {
  console.log('上报标签为：', this.getAttribute('tag'))
}

showLogin = showLogin.after(log) // 打开登录浮层之后上传数据

document.getElementById('button').onclick = showLogin
```

##### 2. 用 AOP 动态改变函数的参数

观察 Function.prototype.before 方法：

```js
Function.prototype.before = function (beforefn) {
    var __self = this
    return function () {
        beforefn.apply(this, arguments)
        return __self.apply(this, arguments)
    }
}
var func = function (param) {
  console.log(param) // { a: 'a', b: 'b' }
}

func = func.before(function (param) {
  param.b = 'b'
})

func({ a: 'a' })

var ajax = function (type, url, param) {
  console.dir(param)
  // 发送 ajax 请求的代码略
}

ajax('get', 'http://xxx.com/userinfo', { name: 'sven' })


// 由于受到 CSRF 攻击，最简单的办法是在 HTTP 请求中带上一个 Token 参数。
var getToken = function () {
  return 'token'
}

var ajax = function (type, url, param) {
  param = param || {}
  param.Token = getToken()
}
```

用 AOP 的方式给 ajax 函数动态装饰上 Token 参数，保证了 ajax 函数是一个相对纯净的函数，提高了 ajax 函数的可复用性，它在被迁往其他项目的时候，不需要做任何修改。

```js
var ajax = function (type, url, param) {
  console.dir(param)
}

// 把 Token 参数通过 Function.prototype.before 装饰到 ajax 函数的参数 param 对象中：

var getToken = function () {
  return 'Token'
}

ajax = ajax.before(function (type, url, param) {
  param.token = getToken()
})

ajax('get', 'http://xxx.com/userinfo', { name: 'sven' })

// 从 ajax 函数打印的 log 可以看到，Token 参数已经被附加到了 ajax 请求的参数中：

{ name: 'sven', Token: 'token' }
```

##### 3. 插件式的表单验证

formSubmit 函数在此处承担了两个职责，除了提交 ajax 请求之外，还要验证用户输入的合法性。这种代码以来会造成函数臃肿，职责混乱，二来谈不上任何可复用性。代码如下：

```js
var username = document.getElementById('username')
var password = document.getElementById('password')
var submitBtn = document.getElementById('submitBtn')

var formSubmit = function () {
  if (username.value === '') {
    return alert('用户名不能为空')
  }
  if (password.value === '') {
    return alert('密码不能为空')
  }

  var param = {
    username: username.value,
    password: password.value
  }

  ajax('http://xxx.com/login', param)
}

submitBtn.onclick = function () {
  formSubmit()
}
```

现在的代码有一些改进，把校验的逻辑都放到了 validate 函数中，但 formSubmit 函数内部还要计算 validate 函数的返回值，因为返回的结果表明了是否通过校验。代码如下：

```JS
var validate = function () {
  if (username.value === '') {
    alert('用户名不能为空')
    return false
  }
  if (password.value === '') {
    alert('密码不能为空')
    return false
  }
}

var formSubmit = function () {
  if (validate() === false) {
    return
  }
  var param = {
    username: username.value,
    password: password.value
  }
  ajax('http://xxx.com/login', param)
}

submitBtn.onclick = function () {
  formSubmit()
}
```

校验输入和提交表单的代码完全分离开开来，不再有任何耦合关系。代码如下：

```JS
Function.prototype.before = function (beforefn) {
  var __self = this
  return function () {
    // beforefn 返回 false 的情况直接 return，不再执行后面的函数
    if (beforefn.apply(this, arguments === false)) {
      return
    }
    return __self.apply(this, arguments)
  }
}

var validate = function () {
  if (username.value === '') {
    alert('用户名不能为空')
    return false
  }
  if (password.value === '') {
    alert('密码不能为空')
    return false
  }
}

var formSubmit = function () {
  var param = {
    username: username.value,
    password: password.value
  }
  ajax('http://xxx.com', param)
}

formSubmit.before(validate)

submitBtn.onclick = function () {
  formSubmit()
}
```

函数通过 Function.prototype.before 或 Function.prototype.after 被装饰之后，返回的实际上是一个新的函数，如果在原函数保存了一些属性，那么这些属性会丢失。另外，装饰方式也叠加了函数的作用域，如果装饰的链条过长，性能上也会受到一些影响。

## 装饰者模式和代理模式

两者的机构看起来非常相像，都描述了怎样为对象提供一定程度上的间接引用，它们的实现部分都保留了对另外一个对象的引用，并且向那个对象发送请求。

代理模式和装饰者模式最重要的区别在于它们的意图和目的。

代理模式的目的是：当直接访问本体不方便或者不符合需求时，为这个本体提供一个替代者。本体定义了关键功能，而代理提供货拒绝对它的访问，或者在访问本体之前做一些额外的事情。

装饰者模式的作用就是为对象动态加入行为。

换句话说，代理模式强调一种关系（Proxy 与它的实体之间的关系），这种关系可以静态的表达，也就是说，这种关系在一开始就可以被确定。而装饰者模式用于一开始不能确定对象的全部功能时。代理模式通常只有一层代理-本体的引用，而装饰者模式经常会形成一条常常的装饰链。

在虚拟代理实现突破预加载的例子中，本体负责设置 img 节点的 src，代理则提供了预加载的功能，这看起来也是“加入行为”的一种方式，但这种加入行为的方式和装饰者模式的偏重点是不一样的。装饰者模式是实实在在的为对象增加新的职责和行为，而代理做的事情还是跟本体一样，最终都是设置 src。但代理可以加入一些“聪明”的功能，比如在图片真正加载好之前，先使用一张站位的 loading 图片。

## 总结

通过ESnext中的装饰器实现装饰器模式，不仅有为类扩充功能的作用，而且在阅读源码的过程中起到了提示作用。上面所举到的例子只是结合装饰器的新语法和装饰器模式做了一个简单封装，请勿用于生产环境。如果你现在已经体会到了装饰器模式的好处，并想在项目中大量使用，不妨看一下[`core-decorators`](https://www.npmjs.com/package/core-decorators)这个库，其中封装了很多常用的装饰器.