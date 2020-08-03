## initWatch

```js
function initWatch(vm, watch) {
  for (var key in watch) {
    var handler = watch[key];
    if (Array.isArray(handler)) { //Vue 是支持 watch 的同一个 key 对应多个 handler
      for (var i = 0; i < handler.length; i++) {
        createWatcher(vm, key, handler[i]);
      }
    } else {
      createWatcher(vm, key, handler);
    }
  }
}
```



## createWatcher

```js
function createWatcher(vm, expOrFn, handler, options) {
  if (isPlainObject(handler)) {
    options = handler;
    handler = handler.handler;
  }
  if (typeof handler === 'string') {
    handler = vm[handler];
  }
  return vm.$watch(expOrFn, handler, options);//$watch 是 Vue 原型上的方法，它是在执行 stateMixin 的时候定义的
}
```

## Vue.prototype.$watch

通过 `vm.$watch` 创建的 `watcher` 是一个 `user watcher`

```js
Vue.prototype.$watch = function (expOrFn, cb, options) {
    var vm = this;
    if (isPlainObject(cb)) {//如果传入的handler是对象，递归调用createWatche
      return createWatcher(vm, expOrFn, cb, options);
    }
    options = options || {};
    options.user = true; //这是一个 user watcher
    var watcher = new Watcher(vm, expOrFn, cb, options);//创建watcher实例
    if (options.immediate) {
      try {
        cb.call(vm, watcher.value);
      } catch (error) {
       //...
    }
    return function unwatchFn() { //返回取消订阅的函数
      watcher.teardown();
    };
  };
}
```

watcher 的构造函数中：

```js
if (options) {
    this.deep = !!options.deep;
    this.user = !!options.user;
    this.lazy = !!options.lazy;
    this.sync = !!options.sync;
    this.before = options.before;
  } else {
    this.deep = this.user = this.lazy = this.sync = false;
  }
```

```js
if (this.user) {
        try {
          this.cb.call(this.vm, value, oldValue);
        } catch (e) {//对于用户定义的wather，增加了错误捕获
          handleError(
            e,
            this.vm,
            'callback for watcher "' + this.expression + '"'
          );
        }
      } else {
        this.cb.call(this.vm, value, oldValue);
      }
```

