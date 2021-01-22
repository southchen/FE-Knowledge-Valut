# ES6 Datastracture

| Type      | Symbol                                       | Map                                                     | Set                                       |
| --------- | -------------------------------------------- | ------------------------------------------------------- | ----------------------------------------- |
| Summary   | Unique ‘string’                              | Ordered ‘object’ whose key can be primitive & reference | ‘Array’ with all unique value             |
| Construct | let sb = Symbol()                            | let m = new Map([iteratble])                            | let s = new Set([iteratble])              |
| Key-value | Description as 'key' <br />Symbol.keyFor(sb) | key=>any type ordered <br />value=>any type             | key<=>value <br />unique key              |
| Loop      | N\A                                          | For...of  forEach()                                     | for...of forEach()                        |
| Transfer  | sb.toString()                                | [...m] = Array.from(m)  <=> new Map(arr).               | [...s] = Array.from(s)  <=> new Set(arr). |



## Symbol

> An unique 'string' that would never be equvlient to others

* primitive data type

* Symbol 表示独一无二的值

* Symbol 类型的"真实值"无法获取,没有对应的字面量

* Symbol 类型的意义在于区分彼此和不重复,不在于真实值

* `Symbol(< description >)` function returns an anonymous, unique value

  ```js
  Symbol('foo') === Symbol('foo')  // false
  ```

  This functon has its static propertise and methods

  ```js
  let sb = Symbol.for('foo')
  let sb2= Symbol.for('foo') //saved the value in global env in the memory
  sb ===sb2//true
  Symbol.keyFor(sb) //'foo'
  ```

  

* Not `new Symbol()`  ❌ typeof => symbol

  ```js
  let sym = new Symbol()  // TypeError
  ```

  ```js
  let sym = Symbol('foo') //takes string as argument
  typeof sym      // "symbol" 
  let symObj = Object(sym)
  typeof symObj   // "object"
  ```

  But it has instance/prototype properties and methods

  ```js
  Symbol.prototype.toString()
   let sb = Symbol('context');
   console.log(sb.description); //context
  ```

  Returns a string containing the description of the Symbol. Overrides the Object.prototype.toString() method.
  
  ```js
  
  // 1. 对象字面量
  let goods = {};
  let name = Symbol('name');
  goods = {
    [name]: '杯子'
  };
  
  let id = Symbol('id');
  goods[id]= 'a001'; //作为属性名赋值
  console.log(goods[id]); //作为属性名取值 = a001
  // console.log(goods.id); //不能这样取，因为不是字符串属性名
  
  //2. Object.defineProperty方式
  let price = Symbol('price');
  Object.defineProperty(goods, price, {value: 29.99});
  
  // 3. Object.defineProperties方式
  let count = Symbol('count');
  Object.defineProperties(goods,{
    [count]:{value: 101}
  })
  console.log(goods);
  ```
  
  

### Use cases

To dealing with the same string name, use symbol to create unique value;

```js
let user1= {
	name:'Jack'
}
let user2 = {
    name:'Jack'
}
let data = {
    [user1]:{age:19},
    [user2]:{age:22}
}
console.log(data[user1]) //{age: 22}
```

Using symbol:

```js
let user1= {
	name:'Jack',
	key:Symbol()
}
let user2 = {
    name:'Jack',
    key:Symbol()
}
let data = {
    [user1.key]:{age:19},
    [user2.key]:{age:22}
}
console.log(data[user1.key]) //{age: 19}
```

`for...in` can only get the propertise of an object that its key is not a symbol.

The `Object.getOwnPropertySymbols()` method can only get the symbol peroproty

```js
let sb = Symbol('b')
let obj = {
	a:'a',
    [sb]:'symbol'
}
for(let item of Reflect.ownKeys(obj)){
    console.log(item)
}
```

The symbol can protect the propertise to be looped from outside.

### Symbol.for()

1.  Symbol.for() 对每个关键字符串执行幂等操作。即，第一次使用字符串调用时，会在全局运行注册表中查询，如果没有，就创建一个新的符号实例；如果有，就返回该字符串实例。具体用法见下方代码
2. 即使采用相同的符号描述，在全局注册表中定义的符号 跟使用symbol()定义的符号也不等同

```js
// 1. Symbol.for的用法。注册表中无--->创建；有--->使用
let globalSymbol = Symbol.for('test');
console.log(globalSymbol);    //Symbol(test)
let test = Symbol.for('test');
console.log(globalSymbol === test); //true

// 2.即使采用相同的符号描述，在全局注册表中定义的符号跟使用symbol()定义的符号也不等同
let localSymbol = Symbol('test');
console.log(globalSymbol === localSymbol); //false

// 3.全局注册表中的符号，必须使用字符串键来创建。无字符串名时，被转换为undefined
let emptySymbol = Symbol.for();
console.log(emptySymbol);   //Symbol(undefined)

//4.Symbol.keyFor用来查询全局注册表
let test1 = Symbol.for('test1');
let test2 = Symbol('test2');
console.log(Symbol.keyFor(test1));  //test1
console.log(Symbol.keyFor(test2));  //undefined
console.log(Symbol.keyFor(1233));  //TypeError: 1233 is not a symbol

```

- Object.getOwnPropertyNames 返回对象的自有 属性 数组
- Object.getOwnPropertySymbols 返回对象的自有 属性符号 数组 
- Reflect.ownKeys 返回对象的自有 属性名（前两者都有）
- Object.getOwnPropertyDescriptors 返回对象的自有 属性描述（前两者都有）

## Map

The Map object holds key-value pairs and remembers the original insertion order of the keys. Any value (both objects and primitive values) may be used as either a key or a value.

> An order object whose key can be any data type

* iterable, can be looped through `for...of`
* Its size can be easily obtained by the `size` property
* use `new Map([iterable])` to create a Map object where the key-value of each iterable were pushed into the Map
* Use `Map.prototype.set([key])` to push a new value, use `.get([key]) `to get the value
* `Map.prototype.has()` return boolean
* The key has to be unique. No repeating keys. The later insertion would overwrite the earlier one.

```js
let obj={a:'a'}
let obj1={b:'b'}
let m = new Map([[obj,'user'],[function foo(){},'function']])
console.log(m)//Map(2) {{…} => "user", ƒ => "function"}
m.set(obj1,'b')
m.get(obj1)//'b'
m.get({b:'b'})//undefined
m.has(obj)//ture
```

* These methods return a new iterator object contains each key/value/entry in the map

````js
[...m] // [[{},'user'],[f,'function'],[{...},'b']]
m.keys() //MapIterator {{…}, ƒ, Array(2)}
[...m.keys() ] // [{…}, ƒ, Array(2)]
m.values()
m.entires()
````

* `Map.prototype.forEach(callbackFn[, thisArg])` can loop the map

```js
m.forEach((value)=>{
    console.log(value);
})
m.forEach((value,key)=>{
    console.log(value,key);
})
for (let item of m){
    cosnole.log(item);
}
```

## Compared with object

* An `Object` has a prototype, so there are default keys in the map. 
* (This can be bypassed using `map = Object.create(null)`.)
* The keys of an Object are Strings or Symbols, where they can be of any value for a Map.

## Use case

use as an advanced version of object (hash map) to store. eg. Store the DOM element as the keys;

```html
<body>
    <div name='first' data-index='1'>
        aaaa
    </div>
    <div name='second' data-index='2'>
        bbbb
    </div>
</body>
```

```js
let map =new Map();
docment.querySelectorAll('div').forEach(item=>{
    map.set(item,{
        name:item.getAttribute('name'),
        index:item.dataset.index
    })
})
map //div=>{} div=>{}
map.forEach((config,ele)=>{
    ele.addEventListener('click'()=>{
        alert(config.name +'at' + config.index)
    })
})
```

```html
I accept aggreement:
<input type="checkbox" name="agreement" error="please accept" />
I am Student:
<input type="checkbox" name="student" error="only open to student" />
<input type="submit" />
```

```js
function post() {
   let map = new Map();
   let inputs = document.querySelectorAll('[error]');
    inputs.forEach((item) => {
       map.set(item, {
        error: item.getAttribute('error'),
        status: item.checked,
          });
    });
        // console.log([...map]);
    return [...map].every(([elem, config]) => {
          config.status || alert(config.error);
          return config.status;
     });
}
```



## Weak Map

The WeakMap object is a collection of key/value pairs in which the keys are `weakly referenced`. **The keys must be objects** and the values can be arbitrary values.

* Similar API with Map
* `WeakMap` keys are not enumerable (i.e., there is no method giving you a list of the keys). If they were, the list would depend on the state of garbage collection, introducing non-determinism.
*  they are a target of garbage collection (GC) if there is no other reference to the object anymore.

```js
let wm = new WeakMap()
let obj={a:'a'}
wm.set(obj,1)
wm.keys()//TypeError: wm.keys is not a function
wm.values()//❌
wm.entries()//❌
```

### Use case

to store private data for an object, or to hide implementation details.

```js
const privates = new WeakMap();

function Public() {
  const me = {
    // Private data goes here
  };
  privates.set(this, me);
}

Public.prototype.method = function () {
  const me = privates.get(this);
  // Do stuff with private data in `me`...
};

module.exports = Public;
```

## Set

The Set object lets you store `unique` values of any type, whether primitive values or object references.

* 'unique': `NaN` and `undefined` can also be stored in a Set. 
* All `NaN` values are equated (i.e. NaN is considered the same as NaN, even though NaN !== NaN).

```js
let set = new Set(['a',2])
set.size//2
set.add({obj:'obj'})
set.has('b')//false
set.delete('a')//return true
set// Set(1) {2}
set.delete('b')//false
set.clear()
```

Loop:

iterator: since set only has keys so the set.values() return the keys as well. the entries() returns [[keys:keys]]

```js
set.keys()
set.values()
set.entries()
set.forEach(((item)=>{
    console.log(item)
}))

let isSuperSet = (subSet,superSet)=>{
    let(item of subSet){
        !superSet.has(item) return false
    }
    return true;
}
```

string type can also be transfered

```js
 let text = 'India';
 let mySet = new Set(text); // Set {'I', 'n', 'd', 'i', 'a'}
 mySet.size; // 5
```

```js
let set= new Set('17323845');
set = new Set([...set].filter(num=>num<5))//Set(4) {"1", "3", "2", "4"
```

### Use case

* remove duplicate from an array

```js
let arr=[1, 2, 3, 2, 'b', 1, 'b']
let set = new Set(arr);
arr=Array.from(set)
arr= [...set]
//or in one line:
arr = [... new Set(arr)]
```

* borrow API from Array

```js
let intersection = new Set([...set1].filter(x => set2.has(x)));
let difference = new Set([...set1].filter(x=>!set2.has(x)))

```

Search history

```js
 let obj = {
    data: new Set(), 
    keyword(word) {
    	this.data.add(word);
	},
    show() {
       let ul = document.querySelector('ul');
       ul.innerHTML = '';
       this.data.forEach((value)=> {
         	ul.innerHTML += `<li>${value}</li>`;
        	});
 	}
};
let input = document.querySelector("[name='hd']");
input.addEventListener('blur', function () {
	obj.keyword(this.value);
	obj.show();
}
```

## WeakSet

WeakSet objects are collections of objects. All objects in a WeakSet's collection are unique.

Key difference with set:

* `WeakSets` are collections of **objects only**.  
* `WeakSets` are not enumerable.



```js
var ws = new WeakSet();
var foo = {};//has to be an object
var bar = {};

ws.add(foo);
ws.add(bar);

ws.has(foo);    // true
ws.has(bar);    // true
```

### Use case

Store DOM element, if the element was deleted from the DOM, the weakset lost the reference as well. No wasting memory.

```html
<body>
         <li>houdunren.com <a href="javascript:;">x</a></li>
      <li>hdcms.com <a href="javascript:;">x</a></li>
      <li>houdunwang.com <a href="javascript:;">x</a></li>
</body>
<style>
      .remove {
      border: solid 2px #eee;
      opacity: 0.8;
      color: #eee;
    }
    .remove a {
      background: #eee;
    }
</style>
```



```js
 class Todo {
      constructor() {
        this.items = document.querySelectorAll('ul>li');
        this.lists = new WeakSet();
        this.items.forEach((item) => this.lists.add(item));
      }
      run() {
        this.addEvent();
      }
      addEvent() {
        this.items.forEach((item) => {
          let a = item.querySelector('a');
          a.addEventListener('click', (event) => {
            const parentElement = event.target.parentElement;
            if (this.lists.has(parentElement)) {
              parentElement.classList.add('remove');
              this.lists.delete(parentElement);
            } else {
              parentElement.classList.remove('remove');
              this.lists.add(parentElement);
            }
          });
        });
      }
    }
    new Todo().run();
```

