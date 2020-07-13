

# More on Vue 2.0 Reactivity

## Observe updates of Array

{  list:[a,b,c] }   `this.list`  ----->trigger getter

but the list.push('a')/list.pop() etc. wouldn't trigger setter. (because no setter has configureated anywhere)

add configuration on the iterceptor of Array by re-writing the prototype methods.

```js
const arrayProto = Array.prototype
export const arrayMethods = Object.create(arrayProto)  //inheritage from the prototype object of Array

;[
  'push',
  'pop',
  'shift',
  'unshift',
  'splice',
  'sort',
  'reverse'
]
.forEach(function (method) {
  // cache original method
  const original = arrayProto[method]
  //make the .method operation trigger 
  Object.defineProperty(arrayMethods, method, {
    value: function mutator (...args) {
      const result = original.apply(this, args)
      const ob = this.__ob__
      let inserted
      switch (method) {
        case 'push':
        case 'unshift':
          inserted = args
          break
        case 'splice':
          inserted = args.slice(2)
          break
      }
      if (inserted) ob.observeArray(inserted)
      ob.dep.notify()
      return result
    },
    enumerable: false,
    writable: true,
    configurable: true
  })
})
```

