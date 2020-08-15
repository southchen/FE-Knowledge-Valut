[toc]

# Implementation of JS API

## Object

### New operator

`let a = new ACon(args)` :point_right: `let a =_new(ACon,args)`

```js
function _new(Ctor, ...args) {
  let obj = Object.create(Ctor.prototype);
  //bind the 'this'; obtain the result
  let result = Ctor.call(obj, ...args);
  return result instanceof Object ? result : obj;
}
```

### Instanceof operator

object instanceof constructor :point_right: myInstanceOf(leftVaule, rightVaule)

### Create

```js
let sub = Object.create(Sup.prototype);
let sub = myCreate(Sup.prototype);
function myCreate(_proto) {
  function F() {}
  F.prototype = _proto;
  return new F();
}
```

### Inheritance

## Function

### .prototype.call() && .prototype.apply()

```js
Function.prototype.myCall = function (thisArg = window, ...args) {
  let func = this;
  let foo = Symbol();
  //   值为原始值(数字，字符串，布尔值)的 this 会指向该原始值的自动包装对象(用 Object() 转换）
  thisArg = Object(thisArg);
  thisArg[foo] = func;
  let result = thisArg[foo](...args);
  delete thisArg[foo];
  return result;
};
```

```js
Function.prototype.myApply = function (thisArg = window, ...args) {
  let func = this;
  let foo = Symbol();
  thisArg = Object(thisArg);
  thisArg[foo] = func;
  let result = thisArg[foo](args);
  delete thisArg[foo];
  return result;
};
```

### .prototype.bind()

let boo = foo.bind(thisArg,args)

```js
Function.prototype.myBind = function (thisArg = window, ...args) {
  return () => {
    let result = this.call(thisArg, ...args);
    return result;
  };
};
```

work with `new (funcA.bind(thisArg, args))`

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
      var baseArgs = ArrayPrototypeSlice.call(arguments, 1),
        baseArgsLength = baseArgs.length,
        fToBind = this,
        fNOP = function () {},
        fBound = function () {
          baseArgs.length = baseArgsLength; // reset to default base arguments
          baseArgs.push.apply(baseArgs, arguments);
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

```js
function queue(iter){
	let p =Promise.resolve();
	for(let ele of iter){
        p=p.then(()=>{
            console.log(ele);
            return new Promise(res=>{
                setTimeout(()=>{res()},1000)
            })
        })
    }
}
queue([1,2,3])
```

reduce

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
