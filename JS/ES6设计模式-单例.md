[TOC]

# 单例模式

**定义：**1.只有一个实例。2.可以全局访问

**主要解决：**一个全局使用的类频繁地创建与销毁。

**何时使用：**当您想控制实例数目，节省系统资源的时候。

**如何解决：**判断系统是否已经有这个单例，如果有则返回，如果没有则创建。

**优点：** 

* 在内存里只有一个实例，减少了内存的开销，尤其是频繁的创建和销毁实例（比如管理首页页面缓存）。 
* 避免对资源的多重占用（比如写文件操作）。

**缺点：**没有接口，不能继承，与单一职责原则冲突，一个类应该只关心内部逻辑，而不关心外面怎么样来实例化。

**使用场景：** 1.全局缓存。2.弹窗

单例模式是指在一个类只能有一个实例，即使多次实例化该类，也只返回第一次实例化后的实例对象。单例模式不仅能减少不必要的内存开销, 并且在减少全局的函数和变量冲突也具有重要的意义。

## 最简单的单例模式：字面量

```js
let timeTool = {
  name: '处理时间工具库',
  getISODate: function() {},
  getUTCDate: function() {}
}
```

以对象字面量创建对象的方式在JS开发中很常见。上面的对象是一个处理时间的工具库, 以对象字面量的方式来封装了一些方法处理时间格式。全局只暴露了一个`timeTool`对象, 在需要使用时, 只需要采用`timeTool.getISODate()`调用即可。`timeTool`对象就是单例模式的体现。在JavaScript创建对象的方式十分灵活, 可以直接通过对象字面量的方式实例化一个对象, 而其他面向对象的语言必须使用类进行实例化。所以，这里的`timeTool`就已经是一个实例， 且ES6中`let`和`const`不允许重复声明的特性，确保了`timeTool`不能被重新覆盖。

## 惰性单例

下面就是使用立即执行函数和构造函数的方式改造上面的`timeTool`工具库。

```JS
let timeTool = (function() {
  let _instance = null;
  
  function init() {
    //私有变量
    let now = new Date();
    //公用属性和方法
    this.name = '处理时间工具库',
    this.getISODate = function() {
      return now.toISOString();
    }
    this.getUTCDate = function() {
      return now.toUTCString();
    }
  }
  
  return function() {//赋值给timeTool的函数
    if(!_instance) {
      _instance = new init();//调用闭包中的init函数，并存给在闭包中的变量_instance
    }
    return _instance;
  }
})()
```

上面的`timeTool`实际上是一个函数，`_instance`作为实例对象最开始赋值为`null`，`init`函数是其构造函数，用于实例化对象，立即执行函数返回的是匿名函数用于判断实例是否创建，只有当调用`timeTool()`时进行实例的实例化，这就是惰性单例的应用，不在js加载时就进行实例化创建， 而是在需要的时候再进行单例的创建。 如果再次调用， 那么返回的永远是第一次实例化后的实例对象。

```js
let instance1 = timeTool();
let instance2 = timeTool();
console.log(instance1 === instance2); //true
```

## ES6中的单例模式

Before

```jS
class Apple {
  constructor(name, creator, products) {
    this.name = name;
    this.creator = creator;
    this.products = products;
  }
}
```

After

```JS
class SingletonApple {
  constructor(name, creator, products) {
    //首次使用构造器实例
    if (!SingletonApple.instance) {
      this.name = name;
      this.creator = creator;
      this.products = products;
      //将this挂载到SingletonApple这个类的instance静态属性上
      SingletonApple.instance = this;
    }
    return SingletonApple.instance;
  }
}
//直接创建实例
let appleCompany = new SingletonApple('苹果公司', '乔布斯', ['iPhone', 'iMac', 'iPad', 'iPod']);
let copyApple = new SingletonApple('苹果公司', '阿辉', ['iPhone', 'iMac', 'iPad', 'iPod']);

console.log(appleCompany === copyApple);  //true
```

ES6中提供了为`class`提供了`static`关键字定义静态方法， 我们可以将`constructor`中判断是否实例化的逻辑放入一个静态方法`getInstance`中，调用该静态方法获取实例， `constructor`中只包需含实例化所需的代码，这样能增强代码的可读性、结构更加优化。

```js
class SingletonApple {
  constructor(name, creator, products) {
      this.name = name;
      this.creator = creator;
      this.products = products;
  }
  //静态方法
  static getInstance(name, creator, products) {
    if(!this.instance) {
      this.instance = new SingletonApple(name, creator, products);
    }
    return this.instance;
  }
}
//通过调用静态方法创建实例
let appleCompany = SingletonApple.getInstance('苹果公司', '乔布斯', ['iPhone', 'iMac', 'iPad', 'iPod']);
let copyApple = SingletonApple.getInstance('苹果公司', '阿辉', ['iPhone', 'iMac', 'iPad', 'iPod'])
console.log(appleCompany === copyApple); //true
```

应用：<a link="完整的项目代码见: [CodePen(单例模式案例——登录框)](https://codepen.io/LITANGHUI/project/editor/Axbnbb)">实现登陆弹框</a>



Ref:[从ES6重新认识JavaScript设计模式(一): 单例模式](https://segmentfault.com/a/1190000013864944)