[toc]

# Higher Order Function

In JS, the function is the first-class citizens. Same as ordinary object/variable it can be:

* passed into a function as argument
* returned from a function as the result statement

## Debounce

debounce focus on the last trigger event. clear the current timer when the next call back function was created.

```js
const debounce = (f,wait) => {
	let timer;
    return function (e) {
    	clearTimeout(timer);
    	timer = setTimeout(() => f(e), wait);
    };
};
function fn(e) {
	console.log(e.target.value);
}
      
const wrappedFn = debounce(fn);
document.querySelector('#input').addEventListener('input', wrappedFn);
```

## Throttle

throttle focus on the delay time and when was the first time the event was triggered.

Normally the events are consecutive like scrolling, resizing and mouse-moving

```js
function boo() {console.log('scroll')}
function throttle (f, wait) {
  let timer
  return (...args) => {
    if (timer) { return }
    timer = setTimeout(() => {
      f(...args)
      timer = null
    }, wait)
  }
}
const wrappedBoo = throttle(boo,2000);
document.addEventListener('scroll',wrappedBoo);
//a trap here the scroll event was property of document not the body element
//or window can also listen scrolling thanks to evet bubbling
```

A example from MDN:

```js
(function() {
  window.addEventListener("resize", resizeThrottler, false);
  var resizeTimeout;
  function resizeThrottler() {
    // ignore resize events as long as an actualResizeHandler execution is in the queue
    if ( !resizeTimeout ) {
      resizeTimeout = setTimeout(function() {
        resizeTimeout = null;
        actualResizeHandler();
       // The actualResizeHandler will execute at a rate of 15fps
       }, 66);
    }
  }

  function actualResizeHandler() {
    // handle the resize event
    ...
  }

}());
```

## Array.prototype

MDN polyfill:

```js
if (!Array.prototype.reduce) {
  Object.defineProperty(Array.prototype, 'reduce', {
    value: function(callback /*, initialValue*/) {
      if (this === null) {
        throw new TypeError( 'Array.prototype.reduce ' + 
          'called on null or undefined' );
      }
      if (typeof callback !== 'function') {
        throw new TypeError( callback +
          ' is not a function');
      }

      var o = Object(this);
      var len = o.length >>> 0; 
  
      var k = 0; 
      var value;
      if (arguments.length >= 2) {
        value = arguments[1];
      } else {
        while (k < len && !(k in o)) {
          k++; 
        }

        if (k >= len) {
          throw new TypeError( 'Reduce of empty array ' +
            'with no initial value' );
        }
        value = o[k++];
      }
      while (k < len) {
        if (k in o) {
          value = callback(value, o[k], k, o);
        }
        k++;
      }
      return value;
    }
  });
}
```

Simplified array.prototype methods:

```js
Array.prototype.myForEach = function myForEach(fn, thisArg) {
  const T = thisArg;
  const O = Object(this);
  const len = O.length;
  let k = 0;
  let kValue;
  while (k < len) {
    if (k in O) kValue = O[k];
    fn.call(T, kValue, k, O);
    k++;
  }
}
```

array.every(function(currentValue, index, arr), thisArg)

```js
Array.prototype.myEvery = function myEvery(fn, thisArg) {
  const O = Object(this);
  const length = O.length >>> 0;
  const T = thisArg;
  let k = 0;
  while (k < length) {
    let kValue;
    if (k in O) {
      kValue = O[k];
    }
    if (!fn.call(T, kValue, k, O)) return false;
    k++;
  }
  return true;
}
```

array.some(function(currentValue, index, arr), thisArg)

```js
Array.prototype.mySome =function mySome(fn, thisArg) {
  const O = Object(this);
  const T = thisArg;
  const length = O.length >>> 0;
  let k = 0;
  while (k < length) {
    let kValue;
    if (k in O) kValue = O[k];
    if (fn.call(T, kValue, k, O)) return true;
    k++;
  }
  return false;
}
```

```js
Array.prototype.myFilter = function (fn, thisArg) {
  let newArr = [];
  const O = Object(this);
  const T = thisArg;
  const length = O.length >>> 0;
  let k = 0;
  let kValue;
  while (k < length) {
    if (k in O) kValue = O[k];
    if (fn.call(T, kValue, k, O)) newArr.push(kValue);
    k++;
  }
  return newArr;
};
```

```js
Array.prototype.myMap = function (fn, thisArg) {
  const O = Object(this);
  const T = thisArg;
  const length = O.length >>> 0;
  let A = new Array(length);
  let k = 0;
  let kValue;
  while (k < length) {
    if (k in O) { 
        kValue = O[k];
    let result = fn.call(T, kValue, k, O);
     A[k]=result
    }
    k++;
  }
  newArr.length=length;//deal with sparse array
  return A;
};
```

version1:

```js
Array.prototype.myReduce = function (fn, initValue) {
  if (initValue != undefined) {
      //path the initValue as the first argument
    this.unshift(initValue);
  }
  const O = Object(this);
  const length = O.length >>> 0;
  let kValue;
    //init res with the initValue
  let res = O[0];
  let k = 1;
  while (k < length) {
    if (k in O) kValue = O[k];
      //the key logic of reduce()
      //update the current res with previous res
    res = fn(res, kValue, k, O);
    k++;
  }
    //restore the array
  this.shift();
  return res;
};
```

version2:

```js
Array.prototype.myreduce = function (callback /*, initialValue*/) {
  let newArr = Object(this);
  let len = newArr.length >>> 0;
  let initialValue,
    k = 0;
  if (arguments.length >= 2) {
    initialValue = arguments[1];
  } else {
    while (k < len && !(k in newArr)) k++;
    if (k >= len)
      throw new TypeError('Reduce of empty array with no initial value');
    initialValue = newArr[k++];
  }

  for (let i = k; i < len; i++) {
    if (i in newArr) {
      initialValue = callback(initialValue, newArr[i], i, newArr);
    }
  }
  return initialValue;
};

```



## Currying

```js
function currying(fn, ...arg) {
          let newArg= arg.slice(0,1);
          fun(newArg){
              return fn.call(this)
          }
          return fun;
        }
function f(a, b, c) {
          return a + b + c;
}
currying(f, 1);
function curry(fn, args) {
     var length = fn.length;
     var args = args || [];
	 return function (...arg) {
            newArgs = [...args, ...arg];
            if (newArgs.length < length) {
              return curry(fn, newArgs);
            } else {
              return fn(...newArgs);
       }
     };
}
function multiFn(a, b, c) {
   console.log(a * b * c);
    return a * b * c;
}
var multi = curry(multiFn);
multi(2)(3)(4);//24
multi(2,3,4)//24
```

```js
  function currying(fn, length) {
        length = length || fn.length;
        return function (...args) {
          return args.length >= length
            ? fn.apply(this, args)
            : currying(fn.bind(this, ...args), length - args.length);
        };
      }
```

## Thunk

call by name

```js
// original version wiht multiple arguments
fs.readFile(fileName, callback);

// Thunk, with single argument
var readFileThunk = Thunk(fileName);
readFileThunk(callback);

var Thunk = (fileName)=>(callback)=> fs.readFile(fileName, callback); 
```

## Function caching

### Memoize

```JS
_.memoize.Cache = WeakMap;
function memoize(func, resolver) {
  if (
    typeof func != "function" ||
    (resolver != null && typeof resolver != "function")
  ) {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  var memoized = function () {
    var args = arguments,
      key = resolver ? resolver.apply(this, args) : args[0],
      cache = memoized.cache;
    if (cache.has(key)) {
      return cache.get(key);
    }
    var result = func.apply(this, args);
    memoized.cache = cache.set(key, result) || cache;
    return result;
  };
  memoized.cache = new (memoize.Cache || MapCache)();
  return memoized;
}
```



```js
function memoize(fn) {
  let isCalculated = false;
  let lastResult;
  return function memoizedFn() {
    if (isCalculated) {
      return lastResult;
    }
    let result = fn();
    lastResult = result;
    isCalculated = true;
    return result;
  };
}
```

LRU（least recently used）cache