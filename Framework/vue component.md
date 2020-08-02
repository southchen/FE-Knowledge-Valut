[toc]

# Component mounting



## createElement

`createElement` 传的参数是一个组件而不是一个原生的标签

```js
import Vue from 'vue'
import App from './App.vue'

var app = new Vue({
  el: '#app',
  render: h => h(App)//createElement(<component>)
})
```

## _createElement

一个 App 对象，它本质上是一个 `Component` 类型

```js
function _createElement(context, tag, data, children, normalizationType) {
    //...
else if (isDef(Ctor = resolveAsset(context.$options, 'components', tag))) {
    // component,调用createComponent
    vnode = createComponent(Ctor, data, context, children, tag)
  } 
   //...
}
```

## createComponent

主要功能构造子类构造函数，安装组件钩子函数和实例化 `vnode`

```js
export default { //导出的是一个plain 对象
  name: 'app',
  components: {
    HelloWorld
  }
}
```

````js
function createComponent(Ctor, data, context, children, tag) {
  //Vue.options._base = Vue
  var baseCtor = context.$options._base;
  if (isObject(Ctor)) {  // plain options object: turn it into a constructor
      //调用了全局extend方法
    Ctor = baseCtor.extend(Ctor);
  }
  // async component...
  data = data || {};
  // resolve constructor options in case global mixins are applied after component constructor creation
  resolveConstructorOptions(Ctor);
  // transform component v-model data into props & events
  if (isDef(data.model)) {
    transformModel(Ctor.options, data);
  }
  // extract props
  var propsData = extractPropsFromVNodeData(data, Ctor, tag);
  // functional component
  if (isTrue(Ctor.options.functional)) {
    return createFunctionalComponent(Ctor, propsData, data, context, children);
  }

  // extract listeners, since these needs to be treated as
  // child component listeners instead of DOM listeners
  var listeners = data.on;
  // replace with listeners with .native modifier
  // so it gets processed during parent component patch.
  data.on = data.nativeOn;

  if (isTrue(Ctor.options.abstract)) {
    // abstract components do not keep anything
    // other than props & listeners & slot
    // work around flow
    var slot = data.slot;
    data = {};
    if (slot) {
      data.slot = slot;
    }
  }
  // install component management hooks onto the placeholder node
  //安装组件钩子函数
  installComponentHooks(data);
    //installComponentHooks函数把 componentVNodeHooks 的钩子函数合并到 data.hook 中，在 VNode 执行 patch 的过程中执行相关的钩子函数，

  // return a placeholder vnode
  var name = Ctor.options.name || tag;
   //实例化 VNode
    //需要注意的是和普通元素节点的 vnode 不同，组件的 vnode 是没有 children 的
  var vnode = new VNode(
    'vue-component-' + Ctor.cid + (name ? '-' + name : ''),
    data,
    undefined,
    undefined,
    undefined,
    context,
    {
      Ctor: Ctor,
      propsData: propsData,
      listeners: listeners,
      tag: tag,
      children: children,
    },
    asyncFactory
  );
//返回vnode对象
  return vnode;
}
````

_init时，merge options，所以Vue 上的一些 `option` 扩展到了 vm.$options 上，

能通过 `vm.$options._base` 拿到 Vue 这个构造函数了

```js
vm.$options = mergeOptions(
  resolveConstructorOptions(vm.constructor),
  options || {},
  vm
)
```

## extend

原型继承的方式把一个纯对象转换一个继承于 `Vue` 的构造器 `Sub` 并返回

然后对 `Sub` 这个对象本身扩展了一些属性，如扩展 `options`、添加全局 API 等；并且对配置中的 `props` 和 `computed` 做了初始化工作；最后对于这个 `Sub` 构造函数做了缓存，避免多次执行 `Vue.extend` 的时候对同一个子组件重复构造。

```js
Vue.extend = function (extendOptions: Object): Function {
  extendOptions = extendOptions || {}
  const Super = this
  const SuperId = Super.cid
  const cachedCtors = extendOptions._Ctor || (extendOptions._Ctor = {})
  if (cachedCtors[SuperId]) {
    return cachedCtors[SuperId]
  }

  const name = extendOptions.name || Super.options.name
  if (process.env.NODE_ENV !== 'production' && name) {
    validateComponentName(name)
  }
//实例化子类时，自动调用_init方法
  const Sub = function VueComponent (options) {
    this._init(options)
  }
  Sub.prototype = Object.create(Super.prototype)
  Sub.prototype.constructor = Sub
  Sub.cid = cid++
  Sub.options = mergeOptions(
    Super.options,
    extendOptions
  )
  Sub['super'] = Super

  if (Sub.options.props) {
    initProps(Sub)
  }
  if (Sub.options.computed) {
    initComputed(Sub)
  }

  // allow further extension/mixin/plugin usage
  Sub.extend = Super.extend
  Sub.mixin = Super.mixin
  Sub.use = Super.use

  // create asset registers, so extended classes
  // can have their private assets too.
  ASSET_TYPES.forEach(function (type) {
    Sub[type] = Super[type]
  })
  // enable recursive self-lookup
  if (name) {
    Sub.options.components[name] = Sub
  }

  // keep a reference to the super options at extension time.
  // later at instantiation we can check if Super's options have
  // been updated.
  Sub.superOptions = Super.options
  Sub.extendOptions = extendOptions
  Sub.sealedOptions = extend({}, Sub.options)

  // cache constructor
  cachedCtors[SuperId] = Sub
  return Sub
}
```

patch 组件时与普通的vnode节点不同

```js
function createElm (
  vnode,
  insertedVnodeQueue,
  parentElm,
  refElm,
  nested,
  ownerArray,
  index
) {
  // 会调用createComponent，返回一个boolean
  if (createComponent(vnode, insertedVnodeQueue, parentElm, refElm)) {
    return
  }
  // ...
}
```

```js
function createComponent(vnode, insertedVnodeQueue, parentElm, refElm) {
    var i = vnode.data;
    if (isDef(i)) {
      var isReactivated = isDef(vnode.componentInstance) && i.keepAlive;
      if (isDef((i = i.hook)) && isDef((i = i.init))) {
          //如果 vnode 是一个组件 VNode，满足，并且得到 i 就是 init 钩子函数
        i(vnode, false /* hydrating */);
      }
      if (isDef(vnode.componentInstance)) {
        initComponent(vnode, insertedVnodeQueue);
        insert(parentElm, vnode.elm, refElm);
        if (isTrue(isReactivated)) {
          reactivateComponent(vnode, insertedVnodeQueue, parentElm, refElm);
        }
        return true;
      }
    }
  }
```



```js
var componentVNodeHooks = {
  init: function init(vnode, hydrating) { 
      const child = vnode.componentInstance = createComponentInstanceForVnode(
      vnode,
      activeInstance
    )
      //自动挂载，因为组件初始化的时候是不传 el 的，因此组件是自己接管了 $mount 的过程
       child.$mount(hydrating ? vnode.elm : undefined, hydrating)
 // 通过 createComponentInstanceForVnode 创建一个 Vue 的实例，然后调用 $mount 方法挂载子组件
  },
  prepatch: function prepatch(oldVnode, vnode) {},
  insert: function insert(vnode) {},
  destroy: function destroy(vnode) {}
};
```



````js
function createComponentInstanceForVnode(vnode,  parent) {
    //定义组件的options
  var options = {
    //_isComponent 为 true 表示它是一个组件，parent 表示当前激活的组件实例
    _isComponent: true,
    _parentVnode: vnode,
    parent: parent,
  };
  var inlineTemplate = vnode.data.inlineTemplate;
  if (isDef(inlineTemplate)) {
    options.render = inlineTemplate.render;
    options.staticRenderFns = inlineTemplate.staticRenderFns;
  }
    //vnode.componentOptions.Ctor 对应的就是子组件的构造函数，我们上一节分析了它实际上是继承于 Vue 的一个构造器 Sub，相当于 new Sub(options)
   //此时创建新的vue实例，并自动执行实例的 _init 方法
  return new vnode.componentOptions.Ctor(options);
}
````

此时的_init方法与普通vnode不同

会调用  initInternalComponent(vm, options)

```js
export function initInternalComponent (vm, options)
    //初始opts，空{}
  const opts = vm.$options = Object.create(vm.constructor.options)
  // doing this because it's faster than dynamic enumeration.
  const parentVnode = options._parentVnode
  //把之前我们通过 createComponentInstanceForVnode 函数传入的几个参数合并到内部的选项 $options 里了
  opts.parent = options.parent
  opts._parentVnode = parentVnode
  const vnodeComponentOptions = parentVnode.componentOptions
  opts.propsData = vnodeComponentOptions.propsData
  opts._parentListeners = vnodeComponentOptions.listeners
  opts._renderChildren = vnodeComponentOptions.children
  opts._componentTag = vnodeComponentOptions.tag

  if (options.render) {
    opts.render = options.render
    opts.staticRenderFns = options.staticRenderFns
  }
}
```

回_init钩子函数

```js
child.$mount(hydrating ? vnode.elm : undefined, hydrating)
//相当于执行 
child.$mount(undefined, false)
```

mountComponent->_render

```js
Vue.prototype._render = function (): VNode {
  const vm: Component = this
  const { render, _parentVnode } = vm.$options
  //initLifeCycle(vm)时，  var parent = options.parent;
// vm.$vnode 存父node
  vm.$vnode = _parentVnode
  // render self
  let vnode
  try {
    vnode = render.call(vm._renderProxy, vm.$createElement)//render 函数生成的 vnode 当前组件的渲染 vnode
  } catch (e) {
    // ...
  }
  // set parent
  vnode.parent = _parentVnode
  return vnode
}
```



## 全局与局部组件

全局定义，初始化了 3 个全局函数，调用this.options._base.extend()，即Vue.extend把这个对象转换成一个继承于 Vue 的构造函数

```js
var ASSET_TYPES = ['component', 'directive', 'filter'];
function initAssetRegisters(Vue) {
  ASSET_TYPES.forEach(function (type) {
    Vue[type] = function (id, definition) {
      if (!definition) {
      } else {
        if (type === 'component' && isPlainObject(definition)) {
          definition.name = definition.name || id;
          definition = this.options._base.extend(definition);//extend
        }
        if (type === 'directive' && typeof definition === 'function') {
          definition = { bind: definition, update: definition };
        }
        this.options[type + 's'][id] = definition; //把它挂载到 Vue.options.components 上。
        return definition;
      }
    };
  });
}

```

每个组件的创建都是通过 `Vue.extend` 继承而来

把 `Vue.options` 合并到 `Sub.options`，也就是组件的 `options` 上

```js
Sub.options = mergeOptions(
  Super.options,
  extendOptions
)
```

在组件的实例化阶段，会执行 `merge options` 逻辑，把 `Sub.options.components` 合并到 `vm.$options.components` 上。

```js
vm.$options = mergeOptions(
        resolveConstructorOptions(vm.constructor),
        options || {},
        vm
);
```

然后在创建 `vnode` 的过程中，会执行 `_createElement` 方法

```js
if (typeof tag === 'string') {
    var Ctor;
    ns = (context.$vnode && context.$vnode.ns) || config.getTagNamespace(tag);
    if (config.isReservedTag(tag)) {//...
    } else if (
      (!data || !data.pre) &&
        //resolveAsset(context.$options, 'components', tag))拿到vm.$options.components[tag]赋值给Ctor构造函数
      isDef((Ctor = resolveAsset(context.$options, 'components', tag)))
    ) {
        //执行createComponent
      vnode = createComponent(Ctor, data, context, children, tag);
    } else {
      //..
    }
  }
```

局部注册只有在实例化是mergeoptions到`vm.$options.components` 

没有到Vue全局构造函数上