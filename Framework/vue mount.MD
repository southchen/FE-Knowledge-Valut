[toc]

# vnode mount

## _init

initMixin(Vue) 中初始化_init方法

```js
 Vue.prototype._init = function (options) {
    var vm = this;
//...
    // a flag to avoid this being observed
    vm._isVue = true;
    // merge options
    if (options && options._isComponent) {
      initInternalComponent(vm, options);
    } else {
      vm.$options = mergeOptions(
        resolveConstructorOptions(vm.constructor),
        options || {},
        vm
      );
    }
    /* istanbul ignore else */
    if (process.env.NODE_ENV !== 'production') {
      initProxy(vm);
    } else {
      vm._renderProxy = vm;
    }
    // expose real self
    vm._self = vm;
    initLifecycle(vm);
    initEvents(vm);
    initRender(vm);//实例的render方法，用来创建vnode
    callHook(vm, 'beforeCreate');
    initInjections(vm); // resolve injections before data/props
    initState(vm);
    initProvide(vm); // resolve provide after data/props
    callHook(vm, 'created');
//如果有el选项，自动挂载，没有则需要生成Vue实例后手动调用$mount方法
    if (vm.$options.el) {
      vm.$mount(vm.$options.el);
    }
  };
```

## $mount

Vue原型$mount方法

## mountComponent

```js
Vue.prototype.$mount = function (el, hydrating) {
  el = el && inBrowser ? query(el) : undefined;
  return mountComponent(this, el, hydrating);
};
```

```js
var mount = Vue.prototype.$mount;
//重写
Vue.prototype.$mount = function (el, hydrating) {
  el = el && query(el);
//el="#app"->el=DOMelement
  if (el === document.body || el === document.documentElement) {
      //warn 不能挂到body html上
    return this;
  }
  var options = this.$options;
    //完整版，可以接收template参数，runtime only，只接收renderfunction，是已经被编译好的
  // resolve template/el and convert to render function
  if (!options.render) {
    var template = options.template;
    if (template) {
        //1.'#app' idToTemplate()
        //2.'<div>...</div>'
        //3.ele(DOMelement) ->ele.innerHTML
      if (typeof template === 'string') {/*...*/}
      } else if (template.nodeType) {/*...*/
      } else {//invalid template option
        return this;}
      //无template，查看是否有el
    } else if (el) { template = getOuterHTML(el)}
    //再判断template
    if (template) {
    //...
        //这一步将template转换成render function
      //call compileToFunction @return obj obj.render=>render function
      var ref = compileToFunctions(
        template,
        {
          outputSourceRange: process.env.NODE_ENV !== 'production',
          shouldDecodeNewlines: shouldDecodeNewlines,
          shouldDecodeNewlinesForHref: shouldDecodeNewlinesForHref,
          delimiters: options.delimiters,
          comments: options.comments,
        },
        this
      );
        //返回function
      var render = ref.render;
      var staticRenderFns = ref.staticRenderFns;
        //给options加上render
      options.render = render;
      options.staticRenderFns = staticRenderFns;
    }
  }
//调用暂存的mountComponent
  return mount.call(this, el, hydrating);
};
```

## Compiling

createCompiler用以创建编译器，返回值是compile以及compileToFunctions。

compile是一个编译器，它会将传入的template转换成对应的AST树、render函数以及staticRenderFns函数。而compileToFunctions则是带缓存的编译器，同时staticRenderFns以及render函数会被转换成Funtion对象。

因为不同平台有一些不同的options，所以createCompiler会根据平台区分传入一个baseOptions，会与compile本身传入的options合并得到最终的finalOptions。

调用链：

options.render=ref.render; 

ref = compileToFunctions(template,options,vm); 

compileToFunction=ref$1.compileToFunctions; 

ref$1 = createCompiler(baseOptions); 

createCompiler < object >= createCompilerCreator(basecompile function)

```js
var ref$1 = createCompiler(baseOptions);
var compile = ref$1.compile;
var compileToFunctions = ref$1.compileToFunctions;
```

createCompiler 调用了createCompilerCreator(),并传入一个函数

```js
var createCompiler = createCompilerCreator(function baseCompile(
  template,
  options
) {
    //parse会用正则等方式解析template模板中的指令、class、style等数据，形成AST语法树。
  var ast = parse(template.trim(), options);
    //optimize的主要作用是标记static静态节点，这是Vue在编译过程中的一处优化，后面当update更新界面时，会有一个patch的过程，diff算法会直接跳过静态节点，从而减少了比较的过程，优化了patch的性能。
  if (options.optimize !== false) {
    optimize(ast, options);
  }
 //generate是将AST语法树转化成render funtion字符串的过程，得到结果是render的字符串以及staticRenderFns字符串。
  var code = generate(ast, options);
  return {
    ast: ast,
    render: code.render,
    staticRenderFns: code.staticRenderFns,
  };
});
```

createCompilerCreator接收一个basecompile方法，返回一个createCompiler函数

在createCompiler函数中创建compile函数，

compile函数将平台自有的option与传入的option进行合并，调用baseCompile，进行模板template的编译。

```js
function createCompilerCreator(baseCompile) {
    //返回一个createCompiler函数
  return function createCompiler(baseOptions) {
      //compile函数，接收template和options参数
    function compile(template, options) {
      var finalOptions = Object.create(baseOptions);
        // merge custom modules
        // merge custom directives
        // copy other options
		//调用传入的参数，baseCompile
      var compiled = baseCompile(template.trim(), finalOptions);
      return compiled;
    }
//返回一个命名空间，里面有刚创建的compile函数
    return {
      compile: compile,
      compileToFunctions: createCompileToFunctionFn(compile),
    };
  };
}
```

createCompileToFunctionFn() 接收一个函数

```js
function createCompileToFunctionFn(compile) {
    //有缓存
  var cache = Object.create(null);
    //返回compileToFunctions函数，在外面被赋值给ref的compileToFunctions属性
  return function compileToFunctions(template, options, vm) {
    options = extend({}, options);
    // check cache
    var key = options.delimiters
      ? String(options.delimiters) + template
      : template;
    if (cache[key]) {
      return cache[key];
    }
    // compile
    var compiled = compile(template, options);
    // check compilation errors/tips
    // turn code into functions
    var res = {};
    var fnGenErrors = [];
      //返回的结果，是一个对象，有两个属性render，staticRender
    res.render = createFunction(compiled.render, fnGenErrors);
    res.staticRenderFns = compiled.staticRenderFns.map(function (code) {
      return createFunction(code, fnGenErrors);
    });
    }
    return (cache[key] = res);
  };
}
```

返回实例vm，创建updateComponent函数，即调用vm._update(VNODE,hyd)

创建render watcher，观察updateComponent函数

```js
function mountComponent(vm, el, hydrating) {
  vm.$el = el;
  if (!vm.$options.render) {
    vm.$options.render = createEmptyVNode;
    if (process.env.NODE_ENV !== 'production') {
      /* istanbul ignore if */
      if ((vm.$options.template && vm.$options.template.charAt(0) !== '#')||vm.$options.el ||el) {
       //前一步没把template编译成render funciton ->runtimeonly build
      } else {/*render function 有问题*/ }
    }
  }
  callHook(vm, 'beforeMount');
  var updateComponent;
   //...
    updateComponent = function () {
      vm._update(vm._render(), hydrating);
    }
  //render watcher
   //watcher (vm,expOrFn,cb,options)
  new Watcher(vm,updateComponent,noop,
    {before: function before() {
        if (vm._isMounted && !vm._isDestroyed) {
          callHook(vm, 'beforeUpdate');}}},
    true /* isRenderWatcher */
  );
  hydrating = false;
  // manually mounted instance, call mounted on self
  // mounted is called for render-created child components in its inserted hook
  if (vm.$vnode == null) {
    vm._isMounted = true;
    callHook(vm, 'mounted');
  }
  return vm;
}
```

## _render

方法返回vnode

```js
Vue.prototype._render = function () {
    var vm = this;
    var ref = vm.$options;
    //得到render function
    var render = ref.render;
    var _parentVnode = ref._parentVnode;
    if (_parentVnode) {
      vm.$scopedSlots = normalizeScopedSlots(
        _parentVnode.data.scopedSlots,
        vm.$slots,
        vm.$scopedSlots
      );
    }
    vm.$vnode = _parentVnode;
    // render self
    var vnode;
    try {
      currentRenderingInstance = vm;
        //调用render.call()，传入vm.$createElement为参数
        //即return vm.$createElement(args)
      vnode = render.call(vm._renderProxy, vm.$createElement);
    } catch (e) {
     //...
    } finally { currentRenderingInstance = null;}
    // return empty vnode in case the render function errored out
    if (!(vnode instanceof VNode)) {
     //...
      vnode = createEmptyVNode();
    }
    // set parent
    vnode.parent = _parentVnode;
    return vnode;
  };
}
```

  初始化Vue实例时，initRender(vm)，传入实例

```js
 function initRender(vm) {
  vm._vnode = null; // the root of the child tree
  vm._staticTrees = null; // v-once cached trees
  var options = vm.$options;
  var parentVnode = (vm.$vnode = options._parentVnode); 
  var renderContext = parentVnode && parentVnode.context;
//...
  vm._c = function (a, b, c, d) { //被模板编译成的 render 函数使用
    return createElement(vm, a, b, c, d, false);
  };
  vm.$createElement = function (a, b, c, d) {// 用户在options中写的render functions.
    return createElement(vm, a, b, c, d, true);
  };
     //...
}
```

## createElement

```JS
function createElement (context,tag,data,children,normalizationType,alwaysNormalize) {
  if (Array.isArray(data) || isPrimitive(data)) {
    normalizationType = children
    children = data
    data = undefined
  }
  if (isTrue(alwaysNormalize)) {
    normalizationType = ALWAYS_NORMALIZE
  }
//调用了_createElement，实际就是对_createElement的封装
  return _createElement(context, tag, data, children, normalizationType)
}
```

## _createElement

重点流程：`children` 的规范化以及 VNode 的创建。

```JS
function _createElement(context, tag, data, children, normalizationType) {
  //...
  //children 的规范化
  if (Array.isArray(children) && typeof children[0] === 'function') {
    data = data || {};
    data.scopedSlots = { default: children[0] };
    children.length = 0;
  }
  if (normalizationType === ALWAYS_NORMALIZE) {
    children = normalizeChildren(children);
  } else if (normalizationType === SIMPLE_NORMALIZE) {
    children = simpleNormalizeChildren(children);
  }
    //VNode 的创建
  var vnode, ns;
  if (typeof tag === 'string') {
    var Ctor;
    ns = (context.$vnode && context.$vnode.ns) || config.getTagNamespace(tag);
    if (config.isReservedTag(tag)) {
        //如果是内置的一些节点，则直接创建一个普通 VNode
      }
      vnode = 
new VNode(config.parsePlatformTagName(tag),data,children,undefined,undefined,context);
    } else if (
      (!data || !data.pre) &&
        //获取constructor
        // 如果是为已注册的组件名，则通过 createComponent 创建一个组件类型的 VNode
      isDef((Ctor = resolveAsset(context.$options, 'components', tag)))
    ) {
      vnode = createComponent(Ctor, data, context, children, tag);
    } else {
        //否则创建一个未知的标签的 VNode。 
      vnode = new VNode(tag, data, children, undefined, undefined, context);
    }
  } else {
    // direct component options / constructor
    //如果是 tag 一个 Component 类型，则直接调用 createComponent 创建一个组件类型的 VNode 节点。
    vnode = createComponent(tag, data, context, children);
  }
  if (Array.isArray(vnode)) {
    return vnode;
  } else if (isDef(vnode)) {
    if (isDef(ns)) {
      applyNS(vnode, ns);
    }
    if (isDef(data)) {
      registerDeepBindings(data);
    }
    return vnode;
  } else {
    return createEmptyVNode();
  }
}
```

被调用的时机有 2 个，一个是首次渲染，一个是数据更新的时候;

`_update` 方法的作用是把 VNode 渲染成真实的 DOM

lifecycleMixin(Vue) 时初始化

## _update

```js
Vue.prototype._update = function (vnode, hydrating) {
    var vm = this;//获取vm实例
    var prevEl = vm.$el;//获取当前$el，
    //是mountComponent(vm,el,hyd)函数中，定义vm.$el = el;
    //而参数el在mount函数中被定义为el = el && inBrowser ? query(el) : undefined;
    //el是一个dom 元素
    var prevVnode = vm._vnode;//此时_vonde属性存储的是vm未更新时的node，prevnode
    var restoreActiveInstance = setActiveInstance(vm);
    vm._vnode = vnode;//用新生成的vnode覆盖
    //对于初次渲染和更新渲染，传入的参数不同，都是调用__patch__方法
    if (!prevVnode) { // initial render
        //更新vm.$el，把当前的vm.$el作为参数传入
      vm.$el = vm.__patch__(vm.$el, vnode, hydrating, false /* removeOnly */);
    } else {// updates
      vm.$el = vm.__patch__(prevVnode, vnode);
    }
    restoreActiveInstance();
    // update __vue__ reference
    if (prevEl) {
      prevEl.__vue__ = null;
    }
    if (vm.$el) {
      vm.$el.__vue__ = vm;
    }
    // if parent is an HOC, update its $el as well
    if (vm.$vnode && vm.$parent && vm.$vnode === vm.$parent._vnode) {
      vm.$parent.$el = vm.$el;
    }
    // updated hook is called by the scheduler to ensure that children are
    // updated in a parent's updated hook.
  };
```

```JS
Vue.prototype.__patch__ = inBrowser ? patch : noop
```

每个平台都有各自的 `nodeOps` 和 `modules`

## patch

```js
var modules = platformModules.concat(baseModules); //modules 定义了一些模块的钩子函数的实现
//nodeOps:原生DOM方法
var patch = createPatchFunction({ nodeOps: nodeOps, modules: modules });
```

```js
var baseModules = [ref, directives];
var ref = {
  create: function create(_, vnode) {
    registerRef(vnode);
  },
  update: function update(oldVnode, vnode) {
    if (oldVnode.data.ref !== vnode.data.ref) {
      registerRef(oldVnode, true);
      registerRef(vnode);
    }
  },
  destroy: function destroy(vnode) {
    registerRef(vnode, true);
  },
};

var directives = {
  create: updateDirectives,
  update: updateDirectives,
  destroy: function unbindDirectives(vnode) {
    updateDirectives(vnode, emptyNode);
  },
};
var nodeOps = /*#__PURE__*/ Object.freeze({
  createElement: createElement$1,
  createElementNS: createElementNS,
  createTextNode: createTextNode,
//...
});
```

## createPatchFunction

createPatchFunction 最终返回一个 `patch` 方法

不同平台的 `patch` 的主要逻辑部分是相同的，所以这部分公共的部分托管在 `core` 这个大目录下。

差异化部分只需要通过参数来区别，这里用到了一个函数柯里化的技巧，通过 `createPatchFunction` 把差异化参数提前固化，这样不用每次调用 `patch` 的时候都传递 `nodeOps` 和 `modules` 了

假设首次渲染，

```JS
vm.$el = vm.__patch__(vm.$el, vnode, hydrating, false /* removeOnly */)
```

由于我们传入的 `oldVnode` 实际上是一个 DOM container，所以 `isRealElement` 为 true，接下来又通过 `emptyNodeAt` 方法把 `oldVnode` 转换成 `VNode` 对象，然后再调用 `createElm` 方法

```js
function createPatchFunction(backend) {
  var i, j;
  var cbs = {};
  var modules = backend.modules;
  var nodeOps = backend.nodeOps;
  
  function emptyNodeAt(elm) {}
  function createRmCb(childElm, listeners) {}
  function removeNode(el) {}
  function isUnknownElement$$1(vnode, inVPre) {}
  var creatingElmInVPre = 0;
//定义createelm方法，通过虚拟节点创建真实的 DOM 并插入到它的父节点中
  function createElm(vnode,insertedVnodeQueue,parentElm,refElm,nested,ownerArray,index) {
    vnode.isRootInsert = !nested; // for transition enter check
      //尝试创建子组件
    if (createComponent(vnode, insertedVnodeQueue, parentElm, refElm)) {
      return;
    }
    var data = vnode.data;
    var children = vnode.children;
    var tag = vnode.tag;
    if (isDef(tag)) {
      if (process.env.NODE_ENV !== 'production') {
        if (data && data.pre) {
          creatingElmInVPre++;
        }
        if (isUnknownElement$$1(vnode, creatingElmInVPre)) {
        }
      }
        //定义vnode.elm
      vnode.elm = vnode.ns
        ? nodeOps.createElementNS(vnode.ns, tag)
        : nodeOps.createElement(tag, vnode);
      setScope(vnode);

     if(){} else{
          //调用 createChildren 方法去创建子元素：
          createChildren(vnode, children, insertedVnodeQueue);
        if (isDef(data)) {
             //调用 invokeCreateHooks 方法执行所有的 create 的钩子并把 vnode push 到 insertedVnodeQueue 中。
          invokeCreateHooks(vnode, insertedVnodeQueue);
        }
       //最后调用 insert 方法把 DOM 插入到父节点中
        insert(parentElm, vnode.elm, refElm);
      }

    } else if (isTrue(vnode.isComment)) {
      vnode.elm = nodeOps.createComment(vnode.text);
      insert(parentElm, vnode.elm, refElm);
    } else {
      vnode.elm = nodeOps.createTextNode(vnode.text);
      insert(parentElm, vnode.elm, refElm);
    }
  }

  function createComponent(vnode, insertedVnodeQueue, parentElm, refElm) {}
  function initComponent(vnode, insertedVnodeQueue) {  }
  function reactivateComponent(vnode, insertedVnodeQueue, parentElm, refElm) {}
  function insert(parent, elm, ref$$1) {
    //调用一些 nodeOps 把子节点插入到父节点中
  }
  function createChildren(vnode, children, insertedVnodeQueue) {
    //实际上是遍历子虚拟节点，递归调用 createElm，这是一种常用的深度优先的遍历算法，这里要注意的一点是在遍历过程中会把 vnode.elm 作为父容器的 DOM 节点占位符传入。
  }

  function isPatchable(vnode) {}
  function invokeCreateHooks(vnode, insertedVnodeQueue) {
   //执行所有的 create 的钩子并把 vnode push 到 insertedVnodeQueue 中。
  }
  function addVnodes(parentElm,refElm,vnodes,startIdx,endIdx,insertedVnodeQueue) {}
  function invokeDestroyHook(vnode) {}
  function removeVnodes(vnodes, startIdx, endIdx) {}
  function removeAndInvokeRemoveHook(vnode, rm) {}
  function updateChildren(parentElm, oldCh,newCh,insertedVnodeQueue,removeOnly
  ) {
   //...
  }
  function checkDuplicateKeys(children) {}
  function findIdxInOld(node, oldCh, start, end) {}
  function patchVnode(oldVnode,vnode,insertedVnodeQueue,ownerArray,index,removeOnly
  ) {  }
  function invokeInsertHook(vnode, queue, initial) {}

  var hydrationBailed = false;
  var isRenderedModule = makeMap('attrs,class,staticClass,staticStyle,key');
  function hydrate(elm, vnode, insertedVnodeQueue, inVPre) {}
function assertNodeMatch(node, vnode, inVPre) {}
    
//returned patch function
  return function patch(oldVnode, vnode, hydrating, removeOnly) {
    if (isUndef(vnode)) {
      if (isDef(oldVnode)) {
        invokeDestroyHook(oldVnode);
      }
      return;
    }
    var isInitialPatch = false;
    var insertedVnodeQueue = [];
    if (isUndef(oldVnode)) {//首次渲染
      // empty mount (likely as component), create new root element
      isInitialPatch = true;
      createElm(vnode, insertedVnodeQueue);
    } else {
     //更新渲染
      }
    }
    invokeInsertHook(vnode, insertedVnodeQueue, isInitialPatch);
    //返回vnode的elm
    return vnode.elm;
  };
}
```