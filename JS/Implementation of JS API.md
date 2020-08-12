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

## Promise

### Static methods

### Resolve

```js
Promise.resolve = function(value) {
    const promise = new Promise(function(resolve, reject) {
        resolvePromise(promise, value, resolve, reject)
    });
    return promise;
}
```

<a src='./Promise.md'>resolvePromise 参见</a>

### Race

只要有一个实例率先改变状态，新生成实例的状态就跟着改变。

如果传的迭代是空的，则返回的 promise 将永远等待。

```js
let o = new Promise((res, rej) => setTimeout(res, 1000, 'o'));
let r = new Promise((res, rej) => setTimeout(res, 500, 'r'));
Promise.myRace = function (arr) {
    //第一个resolve/reject的
  return new Promise((res, rej) => {
    arr.forEach((p) => {
      if (p instanceof Promise) {
        p.then(res, rej);
      } else {
        res(p);
      }
    });
  });
};
Promise.myRace([o, r, 6]).then((v) => console.log(v));
```

### All

`fulfilled`状态下返回值是一个按顺序存储每一个实例返回值的数组，而`rejected`状态下返回值则是第一个被拒绝实例的返回值

```js
Promise.myAll = function (iterator) {
  let results = [];
  let len = iterator.length;
  let count = 0;
  return new Promise((res, rej) => {
    for (let i = 0; i < len; i++) {
      if (!(iterator[i] instanceof Promise)) {
        results[i] = iterator[i];
        if (count === len - 1) res(result);
        count++;
      } else {
        iterator[i].then(
          (v) => {
            results[i] = v;
            if (count === len - 1) res(results);
            count++;
          },
          (v) => rej(v)
        );
      }
    }
  });
};
```

optimization

```js
Promise.myAll = function (iter) {
  let len = iter.length;
  if (len === 0) return Promise.resolve([]);
  let results = [];
  let count = 0;
  let ind = 0;
  return new Promise((res, rej) => {
    for (let p of iter) {//for of for universal iterator
      let i = ind++; //在这里拿到i
      console.log(p);
      Promise.resolve(p).then(
        (v) => {
          //let i = ind++; 不能在这里，因为谁先resolve，谁先执行这里，i和iter中的索引顺序不同
          console.log(i, v);
          results[i] = v;
          if (count++ === len - 1) res(results);
        },
        (r) => {
          rej(r);
        }
      );
    }
  });
};
```

### allSettled

只有等到所有这些参数实例都返回结果，不管是`fulfilled`还是`rejected`，包装实例才会结束。

状态变成`fulfilled`后，`Promise` 的监听函数接收到的参数是一个数组，每个成员对应一个传入`Promise.allSettled()`的 `Promise` 实例。{status:fulfilled,value:x} or {status:rejected,reason:x}

```
Promise.myAllSettled = function (iter) {
  let len = iter.length;
  let results = [];
  let count = 0;
  let index = 0;
  return new Promise((res, rej) => {
    let i = index++;
    for (let p of iter) {
      let obj = {};
      Promise.resolve(p).then(
        (v) => {
          obj.status = 'fulfilled';
          obj.value = v;
          results[i++] = obj;
          if (count++ === len - 1) {
            res(results);
          }
        },
        (r) => {
          obj.status = 'rejected';
          obj.reason = r;
          results[i++] = obj;
          if (count++ === len - 1) {
            res(results);
          }
        }
      );
    }
  });
};
```



```js
Promise.prototype.myFinally = function (onFin) {
  return new Promise((res, rej) => {
    this.then(
      () => onFin(),
      () => onFin()
    );
  });
};
```



### Sleep

```

```

### Task Queue

```

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
