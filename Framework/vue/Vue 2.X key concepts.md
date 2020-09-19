[toc]

# Vue 2.X key concepts - Part I Reactivity

## About Reactivity

Keep your `DOM` and `state` in-sync

MVVM double binding

## Implementation of `Reactivity`

### convert function

A convert function takes an Object as the argument and converts the Object's properties in-place into getter/setters using Object.defineProperty 

The converted object should retain original behavior, but at the same time log all the get/set operations.

```js
function isObject(obj) {
  return Object.prototype.toString.call(obj) == '[object Object]';
}
function convert(obj) {
  if (!isObject(obj)) throw TypeError('Please convert an object');
  Object.keys(obj).forEach((key) => {
    //important to store the obj[key] to a variable otherwise looping
      //use case of closure
    let internalValue = obj[key];
    Object.defineProperty(obj, key, {
      get() {
        console.log(`gettign key '${key}': ${internalValue}`);
        return internalValue;
      },
      set(newValue) {
        internalValue = newValue;
        console.log(`wetting key '${key}' to:${internalValue}`);
      },
      enumerable: false,
      configurable: true,
    });
  });
}
const obj = { foo: 123 };
convert(obj);

obj.foo; // should log: 'getting key "foo": 123'
obj.foo = 234; // should log: 'setting key "foo" to: 234'
obj.foo; // should log: 'getting key "foo": 234'
```

### Dependencies tracking

using `observer pattern` 

- Create a `Dep` class with two methods: `depend` and `notify`.
- Create an `autorun` function that takes an updater function.
- Inside the updater function, you can explicitly depend on an instance of `Dep` by calling `dep.depend()`
- Later, you can trigger the updater function to run again by calling `dep.notify()`.

In order to implement this, it's neccesary to associate an instance of Dep to a function/computation (the argument pass to the autorun function)

Therefore, the function/computation has to be sotred somewhere in global scope that marks itself to the function is being called.

```js
// a class representing a dependency
// exposing it on window is necessary for testing
window.Dep = class Dep {
    constructor () {
      this.subscribers = new Set()
    }
    depend () {
        //watch on the global variable
      if (activeUpdate) {
        // register the current active update as a subscriber
        this.subscribers.add(activeUpdate)
      }
    }
    notify () {
      // run all subscriber functions
      this.subscribers.forEach(subscriber => subscriber())
    }
}
//create a varaible in global scope
let activeUpdate
//autorun takes a subscriber function as argument
function autorun (update) {
      wrappedUpdate()
  function wrappedUpdate () {
      //the vairable references to the current funciton on the top of the call stack!
      //so we know outside the autorun which function we're currently in 
    activeUpdate = wrappedUpdate
      //inside the wrapped function call the funcion passed in by argument
    update() //trigger dep to track the subscriber function
      //after calling the function, set the global vairable to null
    activeUpdate = null
  }
}

autorun(()=>{
    console.log(activeUpdate) //inside this funciton it has the access to the variable refering to the function!
    //this is the subscriber function
})
```

```js
const dep = new Dep()

autorun(() => {
  dep.depend()//it has the accss to the activeUpdate variable
  console.log('updated')
})

dep.notify()  // should log: "updated"
```

### mini observer

Rewrite the `convert` function to implement a observer that takes in an object, conver its prop to getters and setters and do sth with `dep` inside it:

​														getter->tracking            setter->triggering/notifying

- `observe()` converts the properties in the received object and make them reactive. For each converted property, it gets assigned a `Dep` instance which keeps track of a list of subscribing update functions, and triggers them to re-run when its setter is invoked.
- `autorun()` takes an update function and re-runs it when properties that the update function subscribes to have been mutated. An update function is said to be "subscribing" to a property if it relies on that property during its evaluation.

```js
function observe (obj) {
  if (!isObject(obj)) {
    throw new TypeError()
  }

  Object.keys(obj).forEach(key => {
    let internalValue = obj[key]
    let dep = new Dep()
    Object.defineProperty(obj, key, {
      get () {
        dep.depend()
        return internalValue
      },
      set (newValue) {
        const isChanged = internalValue !== newValue
        if (isChanged) {
          internalValue = newValue
          dep.notify()
        }
      }
    })
  })
}
```

```js
const state = {count: 0}
observe(state)
autorun(() => {
    //state.count tirggers the getter, call the .depend()
  console.log(state.count)
})
// should immediately log "count is: 0"
//trigger the setter, call the .notify()
state.count++
// should log "count is: 1"
```





Ref: <a src="https://frontendmasters.com/courses/advanced-vue/">Course by Evan You</a>

