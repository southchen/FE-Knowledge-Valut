## initComputed

对 `computed` 对象做遍历，拿到计算属性的每一个 `userDef`，然后尝试获取这个 `userDef` 对应的 `getter` 函数

```js
var computedWatcherOptions = { lazy: true };

function initComputed(vm, computed) {
  var watchers = (vm._computedWatchers = Object.create(null));
  // computed properties are just getters during SSR
  var isSSR = isServerRendering();
    //遍历computed对象
  for (var key in computed) {
    var userDef = computed[key];
    var getter = typeof userDef === 'function' ? userDef : userDef.get;
    if (process.env.NODE_ENV !== 'production' && getter == null) {
      warn('Getter is missing for computed property "' + key + '".', vm);
    }
    if (!isSSR) {
      // create internal watcher for the computed property.
        //对每个key实例化一个watcher
      watchers[key] = new Watcher( 
          //computed watcher，因为 const computedWatcherOptions = { computed: true }
        vm,
        getter || noop,
        noop,
        computedWatcherOptions
      );
    }
    // component-defined computed properties are already defined on the
    // component prototype. We only need to define computed properties defined
    // at instantiation here.
    if (!(key in vm)) {
    //因为 computed 属性是直接挂载到实例对象中的，所以在定义之前需要判断对象中是否已经存在重名的属性，如果 key 不是 vm 的属性，则调用 defineComputed(vm, key, userDef)
      defineComputed(vm, key, userDef);
        //eg. computed:{price:function(){this.unit}}
        //define之后，有vm.price
    } else if (process.env.NODE_ENV !== 'production') {
      if (key in vm.$data) {
        warn(
          'The computed property "' + key + '" is already defined in data.',
          vm
        );
      } else if (vm.$options.props && key in vm.$options.props) {
        warn(
          'The computed property "' + key + '" is already defined as a prop.',
          vm
        );
      }
    }
  }
}
```

## defineComputed

设置一个公共对象

```js
var sharedPropertyDefinition = {
  enumerable: true,
  configurable: true,
  get: noop,
  set: noop,
};
```

给target[key]加上getter，setter

```js
function defineComputed(target, key, userDef) {
  var shouldCache = !isServerRendering();
  if (typeof userDef === 'function') {//usedef是函数
    sharedPropertyDefinition.get = shouldCache
      ? createComputedGetter(key) //用vue定义的
      : createGetterInvoker(userDef); //用用户定义的function
    sharedPropertyDefinition.set = noop;
  } else {//usedef不是函数，是对象，调用对象的getter
    sharedPropertyDefinition.get = userDef.get
      ? shouldCache && userDef.cache !== false
        ? createComputedGetter(key)
        : createGetterInvoker(userDef.get)
      : noop;
    sharedPropertyDefinition.set = userDef.set || noop;
  }
 //判断计算属性对于的 key 是否已经被 data 或者 prop 所占用
  Object.defineProperty(target, key, sharedPropertyDefinition);
}
```

## createGetterInvoker

```
function createGetterInvoker(fn) {
  return function computedGetter() {
    return fn.call(this, this);
  };
}
```



##  createComputedGetter

返回getter函数

```js
function createComputedGetter (key) {
  return function computedGetter () {
     //获取该vm的wathers数组，获取当前key对应的watcher
    const watcher = this._computedWatchers && this._computedWatchers[key]
    if (watcher) {
      watcher.depend()
   
      return watcher.evaluate()
    }
  }
}
```

2.6.11 改为

```js
function createComputedGetter(key) {
  return function computedGetter() {
    var watcher = this._computedWatchers && this._computedWatchers[key];
    if (watcher) {
      if (watcher.dirty) {//dirty为true时（computed）才callevaluate，执行getter函数
        watcher.evaluate();      //调用evaluate，更新value并更新dirty=false
      }
      if (Dep.target) {//如果当前在render function中，加入
        watcher.depend();//即触发所有订阅了该watcher的dep中的函数
      }
      return watcher.value;//返回value
    }
  };
}

```



computed watcher 与render watcher不同。构造函数中，

computed watcher 有.dep属性

```js
  if (this.computed) {
      //computed watcher
    this.value = undefined
    this.dep = new Dep()
  } else {
      //render watcher
    this.value = this.get()
  }
```

version 2.6.11中，改为

```js
this.deep = this.user = this.lazy = this.sync = false;
//对于computed wather，this.lazy为true：
//var computedWatcherOptions = { lazy: true };
this.value = this.lazy ? undefined : this.get();
```

流程：

init时，遍历computed中属性，创建watcher实例；对于computed watcher，this.lazy=true

render函数渲染组件时，触发computed的getter，调用watcher.evaluate(); 

Dep.target指向当前调用函数，不为空时调用该watcher的depend方法，并返回该watcher的value

```js
/**
  * Depend on this watcher. Only for computed property watchers.
  */
depend () {
  if (this.dep && Dep.target) {
    this.dep.depend()
  }
}
```

depend方法将当前Dep.target（即render函数）放入当前watcher的dep中。

**即computed watcher把render watcher 放入了自己dep的订阅列表中**

```js
/**
 * Evaluate the value of the watcher.
 * This only gets called for lazy watchers.
 */
evaluate () {
    this.value = this.get()
    //即value = this.getter.call(vm, vm) 就是执行了计算属性定义的 getter 函数，
    this.dirty = false
}
```

evaluate中，计算this.value时，会触发里面所有用到的响应式数据的getter，把他们的dep放入computed watcher中，**即computed wather把计算属性用到的响应式数据dep拿到。**



## setter

一旦我们对计算属性依赖的数据做修改，则会触发 setter 过程，通知所有订阅它变化的 `watcher` 更新，执行 `watcher.update()` 方法：

````js
if (this.computed) {
  if (this.dep.subs.length === 0) {//没有人去订阅这个 computed watcher 的变化，
    this.dirty = true//只有当下次再访问这个计算属性的时候才会重新求值
  } else {
    this.getAndInvoke(() => {//调用watcher的getAndInvoke方法
      this.dep.notify()
    })
  }
} else if (this.sync) {
  this.run()
} else {
  queueWatcher(this)
}
````

2.6.11改为

````js
/**
 * Subscriber interface.
 * Will be called when a dependency changes.
 */
Watcher.prototype.update = function update() {
  /* istanbul ignore else */
  if (this.lazy) {
    this.dirty = true;//将flag设为true
  } else if (this.sync) { //同步
    this.run(); 
  } else { //加入队列
    queueWatcher(this);
  }
};
````



## getAndInvoke

**2.6.11中用不到**

 函数会重新计算，然后对比新旧值，如果变化了则执行回调函数，那么这里这个回调函数是 `this.dep.notify()`，在我们这个场景下就是触发了渲染 `watcher` 重新渲染。

```js
getAndInvoke (cb: Function) { //cb->this.dep.notify()
  const value = this.get()
  if (
    value !== this.value ||
    isObject(value) ||
    this.deep
  ) {
    // set new value
    const oldValue = this.value
    this.value = value
    this.dirty = false
//...
      cb.call(this.vm, value, oldValue)

  }
}
```

## queueWatcher

```js
/**
 * Push a watcher into the watcher queue.
 * Jobs with duplicate IDs will be skipped unless it's
 * pushed when the queue is being flushed.
 */
function queueWatcher(watcher) {
  var id = watcher.id;
  if (has[id] == null) {
    has[id] = true;
    if (!flushing) {
      queue.push(watcher);
    } else {
      // if already flushing, splice the watcher based on its id
      // if already past its id, it will be run next immediately.
      var i = queue.length - 1;
      while (i > index && queue[i].id > watcher.id) {
        i--;
      }
      queue.splice(i + 1, 0, watcher);
    }
    // queue the flush
    if (!waiting) {
      waiting = true;
//..
      nextTick(flushSchedulerQueue);
    }
  }
}
```

