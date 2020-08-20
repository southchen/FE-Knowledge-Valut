[toc]

# Implementation of JS API - Function

## .prototype.call() && .prototype.apply()

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



## .prototype.bind()

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

## Currying

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

## throttle

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

## Debounce

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

## Function memorization

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

pipe/compose 将对象和操作对象的方法分离开，更侧重于对函数（逻辑）的操作（组合）

## Function Compose

将需要嵌套执行的函数平铺，嵌套执行就是一个函数的返回值将作为另一个函数的参数。该函数调用的方向是从右至左的（先执行 sum，再执行 toUpper，再执行 add）

```js
function sum(a, b) {
  return a+b;
}
function toUpper(str) {
  return str.toUpperCase();
}
function add(str) {
  return '==='+str+'==='
}
//bofore
console.log(add(toUpper(sum('Admin', '1')))); 
//after compose
console.log(compose(add, toUpper, sum)('Admin', '1')); 
```



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

```js
function compose(...fns) {
  return function (...args) {
    let lastFn = fns.pop();
    return fns.reduceRight((a, b) => {
      return b(a);
    }, lastFn(...args));
  };
}

//  ES6 - reduceRight 
const compose = (...fns) => (...args) => {
  let lastFn = fns.pop();
  return fns.reduceRight((a, b) => b(a), lastFn(...args));
};
```



## Function pipe

pipe函数跟compose函数的作用是一样的，也是将参数平铺，只不过他的顺序是从左往右。（先执行 splitString，再执行 count）

```js
function splitString(str) {
  return str.split(' ');
}
function count(array) {
  return array.length;
}
// 使用 pipe 之前：
console.log(count(splitString('hello cherry'))); // 2
// 使用 pipe 之后：
console.log(pipe(splitString, count)('hello cherry')); // 2
```

```js
  const pipe = function () {
        const args = [].slice.apply(arguments);
        return function (x) {
          return args.reduce((res, cb) => cb(res), x);
        };
      };
```

```js
function pipe(...fns) {
  return function (...args) {
    let lastFn = fns.shift();
    return fns.reduceRight((a, b) => {
      return b(a);
    }, lastFn(...args));
  };
}
```

