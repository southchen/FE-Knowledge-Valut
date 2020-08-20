[toc]

# Implementation of JS API

## Object

### New operator

`let a = new ACon(args)` :point_right: `let a =_new(ACon,args)`

创建一个新的对象
将__proto__属性指向构造器函数的prototype
将this关键字指向新创建的对象，使用新创建的对象执行构造器函数
返回这个新建的对象

```js
function _new(Ctor, ...args) {
  let obj = Object.create(Ctor.prototype);
  //bind the 'this'; obtain the result
  let result = Ctor.call(obj, ...args);
     //if the ctor returns a object, return it; otherwise returns the new obj
  return result instanceof Object ? result : obj;
}
```

**if constructor explicitly returns an Object, the created object is not instance of this constructor** 

```js
function Fun2(){return {}}
const f2 = new Fun2()
console.log(f2 instanceof Fun2)  // false
```

### Instanceof operator

object instanceof constructor :point_right: myInstanceOf(leftVaule, rightVaule)

```js
function myInstanceof(obj, cto) {
        if (
          typeof obj != 'object' &&
          typeof obj != 'function' &&
          typeof cto != 'function'
        ) {
          return false;
        }
        let proto = Object.getPrototypeOf(obj);
        if (!proto) return false;
        if (proto == cto.prototype) return true;
        return myInstanceof(proto, cto);
}
```

### Create

let sub = Object.create(Sup.prototype[, propertiesObject]);

```js
function myCreate(_proto,) {
    //F should be a empty function without any instance prop of proto.constructor
  function F() {}
  F.prototype = _proto;
  return new F();
}
let sub = myCreate(Sup.prototype);
```

### Inheritance

```js
function inheritPrototype(subType, superType){
    var prototype = Object.object(superType.prototype); 
    prototype.constructor = subType; 
    subType.prototype = prototype; 
}
```

## Function

### .prototype.call() && .prototype.apply()

```js
Function.prototype.myCall = function (ctx = window, ...args/* args*/) {
  let func = this;
  let foo = Symbol();
  ctx = Object(thisArg);
    //Symbol as prop name, can be only accessed by []
  ctx[foo] = func;
  let result = ctx[foo](...args);
    // let result = ctx[foo](args);
  delete ctx[foo];
  return result;
};
```



### .prototype.bind()

let boo = foo.bind(thisArg,args)

```js
Function.prototype.myBind = function (ctx = window, ...args) {
  return () => {
    let result = this.call(ctx, ...args);
    return result;
  };
};
```

work with `new (funcA.bind(thisArg, args))` function as constructor

```js
if (!Function.prototype.bind)
  (function () {
    var ArrayPrototypeSlice = Array.prototype.slice;
    Function.prototype.bind = function (otherThis) {
      if (typeof this !== 'function') {
        // closest thing possible to the ECMAScript 5
        // internal IsCallable function
        throw new TypeError(
          'Function.prototype.bind - what is trying to be bound is not callable'
        );
      }
        
      var baseArgs = ArrayPrototypeSlice.call(arguments, 1), //arguments without thisArg/ctx
        baseArgsLength = baseArgs.length,
        fToBind = this,
          //clear function for inheritance
        fNOP = function () {},
        fBound = function () {
          baseArgs.length = baseArgsLength; // reset to default base arguments
          baseArgs.push.apply(baseArgs, arguments);//arguments from calling binded function
          return fToBind.apply(
            fNOP.prototype.isPrototypeOf(this) ? this : otherThis,
            baseArgs
          );
        };

      if (this.prototype) {
        // Function.prototype doesn't have a prototype property
        fNOP.prototype = this.prototype;
      }
      fBound.prototype = new fNOP();
      return fBound;
    };
  })();
```

### Currying

```js
function currying(fn) {
  let len = fn.length;
  let fullArg = [];
  return function curry(...args) {
    len -= args.length;
    fullArg.push(...args);
    if (len === 0) return fn(...fullArg);
    return curry;
  };
}
```

### throttle

```js
 function throttle(func, wait) {
        let flag = true;
        return function (...args) {
          if (flag) {
            setTimeout(() => {
              //func(...args);
              func.call(this, ...args);
              flag = true;
            }, wait);
            flag = false;
          }
        };
      }
```

using Date.now()

```js
   function throttleT(func, wait) {
        var start = Date.now();
        let curStart = start;
        return function (...args) {
          var trigger = Date.now();
          if (trigger - curStart > wait) {
            curStart = Date.now();

            func.call(this, ...args);
          }
        };
      }
```

### Debounce

```js
 function debounce(func, wait) {
        let timer;
        return function (...args) {
          if (timer) {
            clearTimeout(timer);
          }
          timer = setTimeout(() => {
            //func(...args);
           func.call(this,...args)
          }, wait);
        };
      }
```

### Function memorization

```js
Function.prototype.memoized = function () {
  let key = JSON.stringify(arguments);
  this._cache = this.cache || {};
  this._cache[key] = this._cache[key] || this.apply(this, arguments);
  return this._cache[key];
};
Function.prototype.memoize = function () {
  let fn = this;
  if (fn.length === 0 || fn.length > 1) {
    return;
  }
  return function () {
    return fn.memoized.apply(fn, arguments);
  };
};
```

### Function Compose

```js
function compose(...fns) {
  let start = fns.lenght - 1;
  return function (...args) {
    let i = start;
    let result = fns[start].apply(this, args);
    while (i--) {
      result = fns[i].call(this, result);
    }
    return result;
  };
}
```

## Asyncnorous

### Sleep

sleep(500).then(() => { //dosth })

```js
function sleep(delay) {
  return new Promise((res) => {
    setTimeout(res, delay);
  });
}
```

### Task Queue

the traverse inside a iterator is a synchronous action => task queue was built synchronously => the task was pushed into the task queue aligned with the sequence in the iterator => the new Promise was returned to the next   

  

```js
function queue(iter){
	let p =Promise.resolve();
	for(let ele of iter){
         p=p.then(()=>{
            console.log(ele);
             //ele()
            return new Promise(res=>{
            		res()
              //  setTimeout(()=>{
              //     res()
              //  },1000)
            })
        })
    }
}
queue([1,2,3])
//queue([foo,foo,foo])
```

### reduce

```js
 function redQueue(arr) {
        arr.reduce(
          (p, cur) =>
            p.then(
              () =>
                new Promise((res) => {
                  setTimeout(() => res(console.log(cur)), 1000);
                })
            ),
          Promise.resolve()
        );
}
```

```js
const createPromise = (time, id) => () =>
  new Promise(res =>
    setTimeout(() => {
      console.log("promise", id);
      res();
    }, time)
  );
```

```js
async function awaitQueue(iter) {
  for (let value of iter) {
    await value();
  }
}

awaitQueue([
  createPromise(3000, 1),
  createPromise(2000, 2),
  createPromise(1000, 3)
]);
```

Promise 串行队列一般情况下用的不多，因为串行会阻塞，而用户交互往往是并行的。

并行：promise.all 配合await

### Traffic lights

```js
function red() {
    console.log('red');
}
function green() {
    console.log('green');
}
function yellow() {
    console.log('yellow');
}
```

```js
 const light = function (timer, cb) {
        return new Promise((resolve) => {
          setTimeout(() => {
            cb();
            resolve();
          }, timer);
        });
      };
const step = function () {
     Promise.resolve()
          .then(() => {
            return light(3000, red);
          })
          .then(() => {
            return light(2000, green);
          })
          .then(() => {
            return light(1000, yellow);
          })
          .then(() => {
            return step();
          });
};
setp()
```



```js
    async function main() {
        await changeColor('红色', 2000);
        await changeColor('黄色', 1000);
        await changeColor('绿色', 3000);
      }
      main();
```

```js
    function changeColor(color, time) {
        return new Promise((res) => {
          console.log(color);
          setTimeout(res, time);
        });
      }
```



## Encapsulate a draggable element

```html
<html lang="en">
  <style>
    #xxx {
      width: 100px;
      height: 100px;
      background-color: lightcoral;
      position: relative;
    }
  </style>
  <body>
    <div id="xxx"></div>
    <script>
      const Draggable = function (el) {
        this.el = el;
        this.init();
      };
      Draggable.prototype.init = function () {
        this.el.addEventListener('mousedown', (e) => {
          this.dragging = true;
          this.position = [e.clientX, e.clientY];
          console.log(this.dragging);
          this.bind();
        });
      };
      Draggable.prototype.bind = function () {
        document.addEventListener('mousemove', (e) => {
          if (this.dragging === false) return null;
          const x = e.clientX;
          const y = e.clientY;
          const deltaX = x - this.position[0];
          const deltaY = y - this.position[1];
          const left = parseInt(this.el.style.left || 0);
          const top = parseInt(this.el.style.top || 0);
          this.el.style.left = left + deltaX + 'px';
          this.el.style.top = top + deltaY + 'px';
          this.position = [x, y];
        });
        document.addEventListener('mouseup', (e) => {
          this.dragging = false;
        });
      };
      const xxx = document.querySelector('#xxx');
      let x = new Draggable(xxx);
    </script>
  </body>
</html>
```
