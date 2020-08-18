



[toc]

# Object对象

`封装`、`继承`、`多态`。

# 封装 :

把客观事物封装成抽象的类，隐藏属性和方法，仅对外公开接口。

## 属性和方法的scope

私有属性和方法：只能在构造函数内访问不能被外部所访问(在构造函数内使用`var`声明的属性)

实例属性和方法：对象外可以访问到对象内的属性和方法(在构造函数内使用`this`设置，或者设置在构造函数原型对象上比如`Cat.prototype.xxx`)

静态属性和方法：定义在构造函数上的方法(比如`Cat.xxx`)，不需要实例就可以调用(例如`Object.assign()`)

## 遍历属性

| syntax                         | chain                      | enumerable   | symbol |
| ------------------------------ | -------------------------- | ------------ | ------ |
| `for ... in`                   | instance & prototype chain | true         | none   |
| Object.keys/entries/values()   | instance                   | true         | none   |
| Object.getOwnPropertyNames()   | instance                   | true & false | none   |
| Object.getOwnPropertySymbols() | instance                   | true & false | yes    |

## ES6 class

```js
 class Person {
     constructor(name) {
         this.name = name;
     }
    nationality = 'china'; //实例属性
    read = function () {//实例方法
        console.log('reading');
    };
    sayHi() {//原型方法
        console.log('hi');
    }
}
var jack = new Person('jack');
```

# 继承

### 1. 原型链继承

将子类的原型对象指向父类的实例

```js
Child.prototype = new Parent()
```

### 2. 构造继承

在子类构造函数内部使用`call或apply`来调用父类构造函数

```js
function Child () {
    Parent.call(this, ...arguments)
}
```

### 3. 组合继承

- 使用**原型链继承**来保证子类能继承到父类原型中的属性和方法
- 使用**构造继承**来保证子类能继承到父类的实例属性和方法

```js
// 构造继承
function Child () {
  Parent.call(this, ...arguments)
}
// 原型链继承
Child.prototype = new Parent()
// 修正constructor
Child.prototype.constructor = Child
```

### 4. 寄生组合继承

```js
// 构造继承
function Child () {
  Parent.call(this, ...arguments)
}
// 原型式继承
Child.prototype = Object.create(Parent.prototype)
// 修正constructor
Child.prototype.constructor = Child
```

### 5. 原型式继承

```js
var child = Object.create(parent)
```

### 6. 寄生式继承

在**原型式继承**的基础上再封装一层，来增强对象，之后将这个对象返回。

```js
function createAnother (original) {
    var clone = Object.create(original);; // 通过调用 Object.create() 函数创建一个新对象
    clone.fn = function () {}; // 以某种方式来增强对象
    return clone; // 返回这个对象
}
```

### 7. 混入方式继承/多继承

```js
function Child () {
    Parent.call(this)
    OtherParent.call(this)
}
Child.prototype = Object.create(Parent.prototype)
Object.assign(Child.prototype, OtherParent.prototype)
Child.prototype.constructor = Child
```

应用：**Vue.extend** :star:

```js
 Vue.extend = function (extendOptions) {
    extendOptions = extendOptions || {};
     //Super-> Vue ctor
    var Super = this;
    var SuperId = Super.cid;
    //...cache
    var name = extendOptions.name || Super.options.name;
//similar with Vue.call(<sub instance>,options)
//usage: let vComponent = new Sub(options)
    var Sub = function VueComponent (options) {
      this._init(options);
    };
     //原型继承
    Sub.prototype = Object.create(Super.prototype);
    Sub.prototype.constructor = Sub;
  
    Sub.options = mergeOptions(
      Super.options,
      extendOptions
    );
     //point 'super' to the super ctor
    Sub['super'] = Super;
     
    // init props&computed for sub...

     //静态方法需要手动
    Sub.extend = Super.extend;
    Sub.mixin = Super.mixin;
    Sub.use = Super.use;

    // 手动拷贝私有asset
    ASSET_TYPES.forEach(function (type) {
      Sub[type] = Super[type];
    });
    // enable recursive self-lookup
    if (name) {
      Sub.options.components[name] = Sub;
    }

    // keep a reference to the super options at extension time.
    Sub.superOptions = Super.options;
    Sub.extendOptions = extendOptions;
    Sub.sealedOptions = extend({}, Sub.options);
    // cache...
     
    return Sub
  };
}
```





**Object.setPrototypeOf(obj, prototype)** 方法设置一个指定的对象的原型 ( 即, 内部[[Prototype]]属性）到另一个对象或  [`null`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/null)。

**Object.crate(proto, [ propertiesObjecy ])** 方法会使用指定的\*原型对象\*以及属性去创建一个新的对象。

# 多态

多态的实际含义是：同一操作作用于不同的对象上，可以产生不同的解释和不同的执行结果。

**多态最根本的作用就是通过把过程化的条件语句转化为对象的多态性，从而消除这些条件分支语句**。

