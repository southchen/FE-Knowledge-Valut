[toc]

# Implementation of JS API

## New operator

`let a = new ACon(args)` :point_right:  `let a =_new(ACon,args)`

```js

function _new(Ctor, ...args) {
     let obj = Object.create(Ctor.prototype);
    //bind the 'this'; obtain the result
  let result = Ctor.call(obj, ...args);
  return result instanceof Object ? result : obj;
}

```

## Instanceof operator

object instanceof constructor :point_right:  myInstanceOf(leftVaule, rightVaule) 

```

```

## Sleep

```

```

## Object.create()

let sub = Object.create(Sup.prototype) 

let sub = myCreate(Sup.prototype)

```
function myCreate(_proto){
	function F(){}
	F.prototype=_proto;
	return new F()
}
```



## Inheritance

```

```

## Function.prototype.call()

## Function.prototype.apply()

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



## Function.prototype.bind()

let boo = foo.bind(thisArg,args)

```

```

```
//  Yes, it does work with `new (funcA.bind(thisArg, args))`
if (!Function.prototype.bind) (function(){
  var ArrayPrototypeSlice = Array.prototype.slice;
  Function.prototype.bind = function(otherThis) {
    if (typeof this !== 'function') {
      // closest thing possible to the ECMAScript 5
      // internal IsCallable function
      throw new TypeError('Function.prototype.bind - what is trying to be bound is not callable');
    }

    var baseArgs= ArrayPrototypeSlice.call(arguments, 1),
        baseArgsLength = baseArgs.length,
        fToBind = this,
        fNOP    = function() {},
        fBound  = function() {
          baseArgs.length = baseArgsLength; // reset to default base arguments
          baseArgs.push.apply(baseArgs, arguments);
          return fToBind.apply(
                 fNOP.prototype.isPrototypeOf(this) ? this : otherThis, baseArgs
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
    <script >
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

