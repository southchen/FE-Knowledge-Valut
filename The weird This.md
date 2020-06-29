[TOC]

# The weird <strong>This</strong> part I

* `This` was property of a certain context, that is to say, in global context or a function contex

  <img src='https://pic002.cnblogs.com/images/2011/349491/2011123113224058.png'>

  ## The ECMA 2015

  <img src="expression this.png" alt="expression this" style="zoom:67%;" />

Note: 

A `Reference` is a resolved name binding. A Reference consists of three components, the `base value`, the referenced name and the Boolean valued strict reference flag. The base value is either `undefined, an Object, a Boolean, a String, a Number, or an environment record`

```js
var foo = (){console.log(this.value)};
=======>
var fooReference = {
    base: EnvironmentRecord,
    name: 'foo',
    strict: false
};

var foo = {
    bar: function () {
        return this;
    }
};
foo.bar(); 
========>
var BarReference = {
    base: foo,
    propertyName: 'bar',
    strict: false
};

```

* In `strict mode` , `This` in global context refers to undefined, in `non-strict mdoe` it refers to the window object
* Inside a function , `This` pointer was determined when the function was invoked:
  * During the creation phase the `this` was initialized as `undefined`
  * Then during the execution phase the  `this` 
  * Therefore, whom the `This` pointer points to, is subjected to how the funciton was called, which means what is on the left of the `()` operator
* A function can be invoked in the following ways by different `CallExpression `
  * Function invocation  => CallExpression Arguments
  * Method invocation  => CallExpression [ Expression ]      CallExpression . IdentifierName
  * Constructor invocation => new MemberExpression Arguments
  * Indirect invocation =>MemberExpression Arguments

## Function inovation & method invoation

*  When a function is called as a method of an object, the object is passed to the function as its **this** value.

```JS
let value = 'window';
function foo() {
    console.log(this.value)
}
let obj={
    value:'obj',
    foo(){console.log(this.value)}
    inner:{
        value:'inner',
    	foo
    }
}
function doFoo (fn) {
  fn()
}

doFoo(obj.foo)
foo() //window 
obj.foo()//'obj'
obj.inner.foo()//'inner'
(obj.foo=obj.foo)()//'window'
doFoo(obj.foo) //window
```

1. foo()

   ​	foo->MemberExpression=>ref: foo => declaritive enviorment record => global object

2. obj.foo()

   ​	obj.foo => ref=> base=>obj

3. obj.inner.foo()

   ​	obj.inner.foo => base => inner 

4. (obj.foo=obj.foo)()

   ​	'='  assignmetn oprator ->call GetValue -> return a value not a reference => global

5. doFoo(fn)=>fn() 

   ​	arguments: fn = obj.foo => call GetValue -> return a value not a reference => global

   

   

   

   ## Constructor invocation

   According to ECMA2015, the new operator would call the [[construct]] inner method of a function 

   ​	Let *obj* be a newly created native ECMAScript object.

   ​	Let result be the result of calling the [[Call]] internal property of F, providing obj as the` this `value and providing the argument list passed into [[Construct]] as args.

   ​	If Type(result) is Object then return result.

   ​	Return obj.

   ```js
   var name = 'window'
   function Person (name) {
  this.name = name
     this.foo = function () {
       console.log(this.name)
       return function () {
         console.log(this.name)
       }
     }
   }
   var person1 = new Person('person1')
   var person2 = new Person('person2')
   
   person1.foo.call(person2)()//person2 window
   person1.foo().call(person2)//person1 person2
   ```
   

## Arrow function

> *ArrowFunction* **:** *ArrowParameters* `=>` *ConciseBody*
>
> If the function code for this *ArrowFunction* is [strict mode code](http://www.ecma-international.org/ecma-262/6.0/index.html#sec-strict-mode-code) ([10.2.1](http://www.ecma-international.org/ecma-262/6.0/index.html#sec-strict-mode-code)), let *strict* be **true**. Otherwise let *strict* be **false**.
>
> Let *scope* be the [LexicalEnvironment](http://www.ecma-international.org/ecma-262/6.0/index.html#sec-execution-contexts) of [the running execution context](http://www.ecma-international.org/ecma-262/6.0/index.html#sec-execution-contexts).
>
> Let *parameters* be CoveredFormalsList of *ArrowParameters*.
>
> Let *closure* be [FunctionCreate](http://www.ecma-international.org/ecma-262/6.0/index.html#sec-functioncreate)(Arrow, *parameters*, *ConciseBody, scope*, *strict*).
>
> Return *closure*.
>
> **lexical** means that `this` refers to the **this** value of a lexically enclosing function. 

* before arrow function `This` is nothing to do with scope!!

* In arrow functions, JavaScript sets the this lexically. It means the arrow function does not create its own execution context, but inherits the this  from the outer function where the arrow function is defined. 

* ```js
  var name = 'window'
  var obj1 = {
    name: 'obj1',
    foo: function () {
      console.log(this.name)
      return function () {
        console.log(this.name)
      }
    }
  }
  var obj2 = {
    name: 'obj2',
    foo: function () {
      console.log(this.name)
      return () => {
        console.log(this.name)
      }
    }
  }
  var obj3 = {
    name: 'obj3',
    foo: () => {
      console.log(this.name)
      return function () {
        console.log(this.name)
      }
    }
  }
  var obj4 = {
    name: 'obj4',
    foo: () => {
      console.log(this.name)
      return () => {
        console.log(this.name)
      }
    }
  }
  obj1.foo()() // 'obj1' 'window'
  obj2.foo()() // 'obj2' 'obj2'
  obj3.foo()() // 'window' 'window'
  obj4.foo()() // 'window' 'window'
  ```

* The apply(), call(), bind() can not change the `this` of a arrow function since it dosen't has one in its scope

* ```js
  var fn = () => {
      console.log(this.name);
  }
  var name = "window"
  var obj = {
      name: "obj"
  }
  fn.call(obj);//window
  var obj1 = {
    name: 'obj1',
    foo1: function () {
      console.log(this.name)
      return () => {
        console.log(this.name)
      }
    },
    foo2: () => {
      console.log(this.name)
      return function () {
        console.log(this.name)
      }
    }
  }
  var obj2 = {
    name: 'obj2'
  }
  obj1.foo1().call(obj2)//obj1  obj1  //fail to bind obj2 to an arrow function
  obj1.foo2.call(obj2)()//window window 
  //👆arrow function and normal function called in global context
  obj1.foo2().call(obj2)//window obj2
  
  ```

## Combining constructor call and arrow function

```js
var name = 'window'
function Person (name) {
    //call by 'new' key word: this->the newly created object
  this.name = name
  this.foo1 = function () {
    console.log(this.name)
  }
  this.foo2 = () => {
      //arrow function dosen't has 'this', looks for it along the scope chain
    console.log(this.name)
  }
   this.foo3 = () => {
    console.log(this.name)
    return function () {
   //called as normal function in the global context 'this'->window
      console.log(this.name)
    }
  }
    this.foo4 = () => {
    console.log(this.name)
    return () => {
      console.log(this.name)
    }
  }
}
var person1 = new Person('person1')
person1.foo1()///person1
person1.foo2()//person1
person1.foo3()()//person1  window
person1.foo4()()//person1 person1
person1.foo4()() // 'person1'

```

```js
var name = 'window'
var person1 = {
  name: 'person1',
  foo2: () => console.log(this.name),
  foo4: function () {
     //person1.foo4() this->person1
    return () => {
        //'this' inside the arrow function always equals to the outter 'this' 
      console.log(this.name)
    }
  }
}
var person2 = { name: 'person2' }

person1.foo2() // 'window'
person1.foo2.call(person2) // 'window'

person1.foo4()() // 'person1' //inner arrow function looks for this in outter function
person1.foo4.call(person2)() // 'person2' //call() binds 'this' to person2 in outter functon
person1.foo4().call(person2) // 'person1' //call() didn't work for arrow function
```

Comparing with the constructor function:

````js
var name = 'window'
function Person (name) {
  this.name = name
  this.foo2 = () => console.log(this.name),
  this.foo4 = function () {
    return () => {
      console.log(this.name)
    }
  }
}
var person1 = new Person('person1')
var person2 = new Person('person2')

person1.foo2() // 'person1'
person1.foo2.call(person2) // 'person1'

person1.foo4()() // 'person1'
person1.foo4.call(person2)() // 'person2'
person1.foo4().call(person2) // 'person1'
````

For nested object inside a constructor function same rules applies

```js
var name = 'window'
function Person (name) {
  this.name = name
  this.obj = {
    name: 'obj',
    foo2: function () {
        //called by person1.obj.foo() this->obj
      return () => {
          //looks for 'this' outside the arrow function
        console.log(this.name)
      }
    }
  }
}
var person1 = new Person('person1')
var person2 = new Person('person2')

person1.obj.foo2()()//obj 
person1.obj.foo2.call(person2)() //person2 //binds the person2 to the outter function
person1.obj.foo2().call(person2)//obj //call() fails to bind for arrow function
```

## Strict mode

```js
function foo() {
  console.log( this.a ); //2 this->window
}
var a = 2;
(function(){
  "use strict";
    console.log(this) //this->undefined
  foo(); //call function foo in global context
})();
```

Comapring to:

```js
"use strict";
function foo() {
  console.log( this.a ); //2 this->undefined
}
var a = 2;
(function(){
  console.log(this) //this->undefined
  foo(); //call function foo in global context
})();
```



Ref: <a src='http://www.ecma-international.org/ecma-262/6.0/index.html'>ECMA2015</a>

Test source: <a src='https://juejin.im/post/5e6358256fb9a07cd80f2e70#heading-40'>Juejin</a>

