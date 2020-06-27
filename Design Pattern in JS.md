

[TOC]

# Design Pattern in JS

## Singleton

> Ensure a class has only one instance, and provide a global point of access to it.

using a method to get the instance:

```js
const singleton = function(name) {
  this.name = name
  this.instance = null
}

singleton.prototype.getName = function() {
  console.log(this.name)
}

singleton.getInstance = function(name) {
  if (!this.instance) { 
    this.instance = new singleton(name)
  }
  return this.instance
}

const a = singleton.getInstance('a') 
const b = singleton.getInstance('b')
console.log(a === b)
```

using static property:

```js
 class Singleton {
 	static instance;
    constructor() {
       if (Singleton.instance === null) {
          Singleton.instance = this;//make the first vairable who called the constructor to be the only instance
           //or 
           //Singleton.instance = new Singleton()
          return Singleton.instance;
        } else {
            return Singleton.instance;
          }
        }
      }
Singleton.instance = null;
let single1 = new Singleton(1);
let single2 = new Singleton(2);
console.log(single1 === single2);
```

use case:

single DOM element: login, modal

## Publisher-subscriber

> 

```js
class Event {
        constructor() {
          this.callbacks = {};
        }
        on(type, fn) {
          if (this.callbacks[type]) {
            this.callbacks[type].push(fn);
          } else {
            this.callbacks[type] = [];
            this.callbacks[type].push(fn);
          }
        }
        emit(type, info) {
          if (!this.callbacks[type])
            throw Error('non subscriber for this event');
          this.callbacks[type].forEach((fn) => {
            fn(info);
          });
        }
        remove(type, fn) {
          if (!this.callbacks[type]) throw Error('non this subscriber');
          if (!fn) {
            delete this.callbacks[type];
          } else {
            this.callbacks[type] = this.callbacks[type].filter((f) => f != fn);
          }
        }
      }
```

Use case:

Lazy loading

```xml
<details>
<summary>Eventemmiter in Node JS</summary>
function EventEmitter() {
    //create a object without prototype chain to Object
    this._events = Object.create(null);
}
// 默认最多的绑定次数
EventEmitter.defaultMaxListeners = 10;
EventEmitter.prototype.addListener = EventEmitter.prototype.on;
EventEmitter.prototype.eventNames = function () {
    return Object.keys(this._events);
};
EventEmitter.prototype.setMaxListeners = function (n) {
    this._count = n;
};
EventEmitter.prototype.getMaxListeners = function () {
    return this._count ? this._count : this.defaultMaxListeners;
};
// 监听
EventEmitter.prototype.on = function (type, cb, flag) {
    // 默认值，如果没有_events的话，就给它创建一个
    if (!this._events) {
        this._events = Object.create(null);
    }
    // 不是newListener 就应该让newListener执行以下
    if (type !== 'newListener') {
        this._events['newListener'] && this._events['newListener'].forEach(listener => {
            listener(type);
        });
    }
    if (this._events[type]) {
        // 根据传入的flag来决定是向前还是向后添加
        if (flag) {
            this._events[type].unshift(cb);
        } else {
            this._events[type].push(cb);
        }
    } else {
        this._events[type] = [cb];
    }
    // 监听的事件不能超过了设置的最大监听数
    if (this._events[type].length === this.getMaxListeners()) {
        console.warn('警告-警告-警告');
    }
};
// 向前添加
EventEmitter.prototype.prependListener = function (type, cb) {
    this.on(type, cb, true);
};
EventEmitter.prototype.prependOnceListener = function (type, cb) {
    this.once(type, cb, true);
};
// 监听一次
EventEmitter.prototype.once = function (type, cb, flag) {
    // 先绑定，调用后删除
    function wrap() {
        cb(...arguments);
        this.removeListener(type, wrap);
    }
    // 自定义属性
    wrap.listen = cb;
    this.on(type, wrap, flag);
};
// 删除监听类型
EventEmitter.prototype.removeListener = function (type, cb) {
    if (this._events[type]) {
        this._events[type] = this._events[type].filter(listener => {
            return cb !== listener && cb !== listener.listen;
        });
    }
};
EventEmitter.prototype.removeAllListener = function () {
    this._events = Object.create(null);
};
// 返回所有的监听类型
EventEmitter.prototype.listeners = function (type) {
    return this._events[type];
};
// 发布
EventEmitter.prototype.emit = function (type, ...args) {
    if (this._events[type]) {
        this._events[type].forEach(listener => {
            listener.call(this, ...args);
        });
    }
};

module.exports = EventEmitter;

//ref:https://juejin.im/post/5b125ad3e51d450688133f22
</details>
```

## Observer

> Define a one-to-may dependency between objects so that when one object changes state, all its dependents are notified and updated automatically.

Setter

```js
class Target {
    constructor(name) {
        this.name = name;
    }
    set name(val) {
        observer(this.name, val);
        this.name = val;
    }
}
let target = new Target('Tom');
function observer(oldVal, newVal) {
    console.log(oldVal +' has changed to ' + newVal);
}
target.name = 'Jack';
```

ES6 Proxy API

```js
class Target {
    constructor( name) {
        this.name = name;
    }
}

let target = new Target('Tom');
let observerProxy = new Proxy(target, {
    set(target, property, value) {
        if (target[property]) {
            observer(target[property], value);
        }
        //update the target as well
        Reflect.set(target, property, value);
    }
});

function observer(oldVal, newVal) {
    console.info(oldVal+ ' has changed to ' +newVal);
}
//change on proxy not the target
observerProxy.name = 'Jack';
console.info(target);
console.info(observerProxy);
```



## Decorator

> Attach additional responsibilities to an object dynamically kepping the same interface. Decorators provid a flexible alternative to subclassing for extending functionality.

* AOP
* replacement of inheritance
* One kind of wrapper pattern

ES7 @decorator syntax sugar from Object.definePropertise()

```js
class Math {
  @log
  add(a, b) {
    return a + b;
  }
  function log(target, name, descriptor) {
    // 保存旧的方法add
    const oldValue = descriptor.value; 
    descriptor.value = function() {
      // 输出日志
      console.log(`Calling ${name} with`, arguments);
      return oldValue.apply(this, arguments);
    };

    // 必须返回descriptor对象
    return descriptor;
  }
}

let math = new Math();
math.add(1, 2);
```

```js
class MyReactComponent extends React.Component {}
export default connect(mapStateToProps, mapDispatchToProps)(MyReactComponent)
=====>
@connect(mapStateToProps, mapDispatchToProps)
export default class MyReactComponent extends React.Component {}
```



## Adapter

Convert the interface of a calss into another interface clients expect.

Adapter lets classese work together that couldn't otherwise because of incompatible interfaces.

(one kind of wrapper)

```js
//the original interfae
function render(component) {
        component.display();
      }
class OldComp {
        display() {
          console.log('rendered old comp');
        }
}
render(new OldComp());
class NewComp {
        show() {
          console.log('new comp rendered');
        }
}
//Adaptor
class Adaptor extends NewComp {
        display() {
          this.show();
        }
      }
let adaptedComp = new Adaptor();
render(adaptedComp);
```



## Strategies

> Define a family of alogorithms, encapsulate each one, and make them interchangeable.

1. Strategies class
2. Context class

In javascript, it is the nature of the language that all object are intercahngeable. The function is the first-class citizen, it can be passed as an argument of another function.

```JS
const strategies = {
        isNonEmpty(value, errorMsg) {
            value === '' ? return errorMsg : null
        },
        minLength(value, length, errorMsg) {
        value.length < length ? return errorMsg : null
        },
        isMoblie(value, errorMsg) {
        !/^1(3|5|7|8|9)[0-9]{9}$/.test(value) ?return errorMsg : null
        },
    }
class Validator {
    constructor() {
        this.cache = [] //保存校验规则
    }
    add(dom, rules) {
        for (let rule of rules) {
            let strategyAry = rule.strategy.split(':') 
            let errorMsg = rule.errorMsg 
            this.cache.push(() => {
                let strategy = strategyAry.shift() //用户挑选的strategy
                strategyAry.unshift(dom.value) //把input的value添加进参数列表
                strategyAry.push(errorMsg) //把errorMsg添加进参数列表[dom.value,errorMsg]
                return strategies[strategy].apply(dom, strategyAry)
            })
        }
    }
    start() {
        for (let validatorFunc of this.cache) {
            let errorMsg = validatorFunc()
            if (errorMsg) {
                return errorMsg
            }
        }
    }
}
let registerForm = document.querySelector('#registerForm')
const validatorFunc = () => {
    let validator = new Validator()
    validator.add(registerForm.userName, [{
        strategy: 'isNonEmpty',
        errorMsg: '用户名不能为空！'
    }, {
        strategy: 'minLength:6',
        errorMsg: '用户名长度不能小于6位！'
    }])
    validator.add(registerForm.passWord, [{
        strategy: 'isNonEmpty',
        errorMsg: '密码不能为空！'
    }, {
        strategy: 'minLength:',
        errorMsg: '密码长度不能小于6位！'
    }])
    validator.add(registerForm.phoneNumber, [{
        strategy: 'isMoblie',
        errorMsg: '手机号码格式不正确！'
    }])
    let errorMsg = validator.start()
    return errorMsg
}

registerForm.addEventListener('submit', function() {
    let errorMsg = validatorFunc()
    if (errorMsg) {
        alert(errorMsg)
        return false
    }
}, false)
```



## Proxy

> Provide a surrogate or placeholder for another object to control access to it.

```js
function factorial(N) {
  if (N === 1) return 1;
  return N * factorial(N - 1);
}
function proxyFun(fn) {
   const cache = {};
   return function (args) {
     if (cache[args]) {
        return cache(args);
     } else {
        cache[args] = fn(args);
        return cache[args];
      }
   };
}
let facProxy = proxyFun(factorial);
console.log(facProxy(5));
```

Use case:

* Preloading
* Data binding

```js
var myImage = (function(){
	var imgNode = document.createElement( 'img' ); 
	document.body.appendChild( imgNode );
	return {
		setSrc: function( src ){
			imgNode.src = src; }
	} 
})();
var proxyImage = (function(){ 
    var img = new Image; 
    img.onload = function(){
		myImage.setSrc( this.src ); 
    }
	return {
		setSrc( src ){
			myImage.setSrc( 'xxx/loading.gif' );
			img.src = src; 
        }
	} 
})();
proxyImage.setSrc( 'http://xxx.com/actualImage.jpg' );
```



```html
<details>
<summary>Bidirectional binding</summary>
<input type="text" model="title" />
<input type="text" model="title" />
<h4 bind="title">这里也会发生更新</h4>
<script>
 function View() {
     //proxy
     let proxy = new Proxy({}, {//a private property, use empty {} to store data
     //getter
     get(obj, property) {},
     //set data value
	set(obj, property, value) {
    //console.log(value);
    document.querySelectorAll(`[modle=${property}]`).forEach(item => {
    	item.value = value;
    })
    document.querySelectorAll(`[bind=${property}]`).forEach(item => {
    	item.innerHTML = value;
     	})
   	 }
	})
     //method of View
      //bind event
      this.init = function () {
      const eles = document.querySelectorAll('[model]');
      eles.forEach(e => {
        e.addEventListener('keyup', function () {
        //keyup，即input更新后触发代理，更新database
         proxy[this.getAttribute('model')] = this.value;
      	 })
		})
	}
}
new View().init();
</script>
    </details>
```

