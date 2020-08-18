[TOC]

# Implementation of class in ES5 :candy:

## Declaration

### ES6

```js
class Person {
    constructor(name, age) {
        this.name = name;//实例属性 1
    }
     expression = function () { //实例方法2
          console.log('exp');
        };
   type='es6'//实例属性1
    eat() {//原型方法3
        return  'eat'
    }
    static say() {//静态方法4
        return 'say'
    }
}
```

### ES5

```js
"use strict";
// 判断某对象是否为某构造器的实例
function _instanceof(left, right) { 
    if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) {
        return !!right[Symbol.hasInstance](left); 
    } else { 
        return left instanceof right; 
    }
}
// 检查声明的class类是否通过new的方式调用，否则会报错
function _classCallCheck(instance, Constructor) { 
    if (!_instanceof(instance, Constructor)) { 
    throw new TypeError("Cannot call a class as a function"); } 
}

function _defineProperties(target, props) { //props:Array
    // 遍历函数数组，分别声明其描述符 并添加到对应的对象上
    for (var i = 0; i < props.length; i++) { 
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false; // 枚举属性。默认为 false
        descriptor.configurable = true; // 能够被改变，被删除。
        if ("value" in descriptor) descriptor.writable = true; // 如果属性中存在value,可以改变。
        Object.defineProperty(target, descriptor.key, descriptor); 
    }
}

function _createClass(Constructor, protoProps, staticProps) { 
    if (protoProps) _defineProperties(Constructor.prototype, protoProps); // 原型方法->prototype
    if (staticProps) _defineProperties(Constructor, staticProps); // 静态方法->构造函数 
    return Constructor; // 返回构造函数
}
function _defineProperty(obj, key, value) {
  if (key in obj) {//自身的实例属性
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true,
    });
  } else {//原型链上
    obj[key] = value;
  }
  return obj;
}
```

```js
var Person = (function () {
  function Person(name, age) {
    _classCallCheck(this, Person);
      //实例属性&方法
    _defineProperty(this, 'type', 'es6');
    _defineProperty(this, 'expression', function () {
      console.log('exp');
    });
  }
  _createClass(
    Person,
      //原型方法
    [{
        key: 'eat',
        value: function eat() {
          return 'eat';
        },
      },
    ],
      //静态方法
    [{
        key: 'say',
        value: function say() {
          return 'say';
        },
      },
    ]
  );
  return Person;
})();
```



## Extends

### ES6

```js
class  Child  extends  Person {
	constructor() {
		super()
		this.name  =  1;
	}
    childMethod() {}
}
```

### ES5

```js
//子类继承父类的方法
function _inherits(subClass, superClass) {
  if (typeof superClass !== 'function' && superClass !== null) {
    throw new TypeError('Super expression must either be null or a function');
  }
  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: { value: subClass, writable: true, configurable: true }, 
      //subClass.prototype .__proto__ == superCalss.prototype
  });
  if (superClass) _setPrototypeOf(subClass, superClass); //subClass.__proto__ ==superClass 
}
//绑定prototype
function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf ||
    function _setPrototypeOf(o, p) {
      o.__proto__ = p;
      return o;
    };
  return _setPrototypeOf(o, p);
}

//获取父类的构造函数
function _createSuper(Derived) {
  var hasNativeReflectConstruct = _isNativeReflectConstruct();
  return function _createSuperInternal() {
    var Super = _getPrototypeOf(Derived),
      result;
    if (hasNativeReflectConstruct) {
      var NewTarget = _getPrototypeOf(this).constructor;
      result = Reflect.construct(Super, arguments, NewTarget);
    } else {
      result = Super.apply(this, arguments);
    }
    return _possibleConstructorReturn(this, result);
  };
}
function _possibleConstructorReturn(self, call) {
  if (call && (_typeof(call) === 'object' || typeof call === 'function')) {
    return call;
  }
  return _assertThisInitialized(self);
}
function _assertThisInitialized(self) { 
    if (self === void 0) { 
        throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); 
    } 
    return self; 
}
function _isNativeReflectConstruct() {
  if (typeof Reflect === 'undefined' || !Reflect.construct) return false;
  if (Reflect.construct.sham) return false;
  if (typeof Proxy === 'function') return true;
  try {
    Date.prototype.toString.call(Reflect.construct(Date, [], function () {}));
    return true;
  } catch (e) {
    return false;
  }
}
```



```js
var Clild = (function (Person) {
  _inherins(Clild, Person);
  var _super = _createSuper(Child);
  function Clild() {
      
    var _this;
    _classCheck(this, Clild);
    _this = _super.call(this); //按照父类构造函数创建子类的实例属性
      
    _this.name = 1; //子类的实例属性
    return _this;
  }
    //同样的方法给子类创建实例、原型属性
  _createClass(Child, [
    {
      key: 'childMethod',
      value: function childMethod() {},
    },
  ]);
  return Clild;
})(Person);
```

