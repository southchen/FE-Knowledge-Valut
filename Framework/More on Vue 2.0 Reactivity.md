

# More on Vue 2.0 Reactivity

## Observe updates of Array : Interceptor

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
      //so the trigger would be arr.method =>a mutator function
    value: function mutator (...args) {
        //obtain the result by calling the original array method
      const result = original.apply(this, args)
      //save the observer instance, since the dep of array was stored in the instance of Observer class
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
       //for the added element, obser it as well
      if (inserted) ob.observeArray(inserted)
        //since the array was updated, notify the deps as well
      ob.dep.notify()
      return result
    },
    enumerable: false,
    writable: true,
    configurable: true
  })
})
```

The observer class has to be updated as well

```js
import Dep from './dep.js'
import { arrayMethods } from './array'
import {
  hasProto,
  def,
  isObject,
  hasOwn,
  isValidArrayIndex
} from './util.js'

const arrayKeys = Object.getOwnPropertyNames(arrayMethods)

/**
 * Observer 类会附加到每一个被侦测的 object 上。
 * 一旦被附加上，Observer 会将 object 的所有属性转换为 getter/setter 的形式
 * 来收集属性的依赖，并且当属性发生变化时，会通知这些依赖
 */
export default class Observer {
  constructor (value) {
    this.value = value
      //inorder to access the dep for array, add a private property to the observer
    this.dep = new Dep()
      //use '__ob__' to point 
    def(value, '__ob__', this)

    if (Array.isArray(value)) {
      const augment = hasProto 
        ? protoAugment 
        : copyAugment
      augment(value, arrayMethods, arrayKeys)
    } else {
      this.walk(value)
    }
  }

  /**
   * Walk 会将每一个属性都转换成 getter/setter 的形式来侦测变化
   * 这个方法只有在数据类型为 Object 时被调用
   */
  walk (obj) {
    const keys = Object.keys(obj)
    for (let i = 0; i < keys.length; i++) {
      defineReactive(obj, keys[i], obj[keys[i]])
    }
  }

  observeArray (items) {
    for (let i = 0, l = items.length; i < l; i++) {
      observe(items[i])
    }
  }
}

/**
 * 尝试为 value 创建一个 Observer 实例，
 * 如果创建成功直接返回新创建的 Observer实例。
 * 如果 value 已经已经存在一个 Observer 实例则直接返回它
 */
export function observe (value, asRootData) {
  if (!isObject(value)) {
    return
  }
  let ob
  if (hasOwn(value, '__ob__') && value.__ob__ instanceof Observer) {
    ob = value.__ob__
  } else {
    ob = new Observer(value)
  }
  return ob
}

function defineReactive (data, key, val) {
  let childOb = observe(val)
  let dep = new Dep()
  Object.defineProperty(data, key, {
      enumerable: true,
      configurable: true,
      get: function () {
        dep.depend()
        if (childOb) {
          childOb.dep.depend()
        }
        return val
      },
      set: function (newVal) {
        if(val === newVal){
          return
        }
        val = newVal
        dep.notify()
      }
  })
}

function protoAugment (target, src, keys) {
  target.__proto__ = src
}

function copyAugment (target, src, keys) {
  for (let i = 0, l = keys.length; i < l; i++) {
    const key = keys[i]
    def(target, key, src[key])
  }
}

export function set (target, key, val) {
  if (Array.isArray(target) && isValidArrayIndex(key)) {
    target.length = Math.max(target.length, key)
    target.splice(key, 1, val)
    return val
  }

  if (key in target && !(key in Object.prototype)) {
    target[key] = val
    return val
  }

  const ob = (target).__ob__
  if (target._isVue || (ob && ob.vmCount)) {
    process.env.NODE_ENV !== 'production' && console.warn(
      'Avoid adding reactive properties to a Vue instance or its root $data ' +
      'at runtime - declare it upfront in the data option.'
    )
    return val
  }
  if (!ob) {
    target[key] = val
    return val
  }
  defineReactive(ob.value, key, val)
  ob.dep.notify()
  return val
}

export function del (target, key) {
  if (Array.isArray(target) && isValidArrayIndex(key)) {
    target.splice(key, 1)
    return
  }
  const ob = (target).__ob__
  if (target._isVue || (ob && ob.vmCount)) {
    process.env.NODE_ENV !== 'production' && console.warn(
      'Avoid deleting properties on a Vue instance or its root $data ' +
      '- just set it to null.'
    )
    return
  }
  if (!hasOwn(target, key)) {
    return
  }
  delete target[key]

  if (!ob) {
    return
  }
  ob.dep.notify()
}
```

