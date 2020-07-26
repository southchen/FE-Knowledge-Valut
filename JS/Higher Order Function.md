[toc]

# Higher Order Function

In JS, the funciton is the first-class citizens. Same as oridnary object/variable it can be:

* passed into a function as argument
* returned from a function as the result statement

## Debounce

debounce focus on the last trigger event. clear the current timer when the next call back function was created.

```js
const debounce = (func) => {
	let timer;
    return function (e) {
    	clearTimeout(timer);
    	timer = setTimeout(() => func(e), 1000);
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
 function boo() {
        console.log('scroll');
      }
const throttle = (fn) => {
    let flag = true;
    return function (args) {
          if (!flag) return;
          if (flag) fn(args);
          flag = false;
          setTimeout(() => {
            flag = true;
          }, 3000);
   };
};
const wrappedBoo = throttle(boo);
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







## Array.prototype.reduce()

Polyfill

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
      // 1. Let O be ? ToObject(this value).
      var o = Object(this);
      // 2. Let len be ? ToLength(? Get(O, "length")).
      var len = o.length >>> 0; 
      // Steps 3, 4, 5, 6, 7      
      var k = 0; 
      var value;

      if (arguments.length >= 2) {
        value = arguments[1];
      } else {
        while (k < len && !(k in o)) {
          k++; 
        }

        // 3. If len is 0 and initialValue is not present,
        //    throw a TypeError exception.
        if (k >= len) {
          throw new TypeError( 'Reduce of empty array ' +
            'with no initial value' );
        }
        value = o[k++];
      }

      // 8. Repeat, while k < len
      while (k < len) {
        // a. Let Pk be ! ToString(k).
        // b. Let kPresent be ? HasProperty(O, Pk).
        // c. If kPresent is true, then
        //    i.  Let kValue be ? Get(O, Pk).
        //    ii. Let accumulator be ? Call(
        //          callbackfn, undefined,
        //          « accumulator, kValue, k, O »).
        if (k in o) {
          value = callback(value, o[k], k, o);
        }

        // d. Increase k by 1.      
        k++;
      }

      // 9. Return accumulator.
      return value;
    }
  });
}
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

