[toc]

# Vue 3.0 Reactivity

in Vue 3.0 the Proxy API was adopted to intercept the access to the data/state object

## Simple implement

```js
const targetsMap = new WeakMap();
let activeEffect=null; //use an global variable to indicate which effect function are currently activated
const track = (target, key) => {
        console.log('tracking');

        let depsMap = targetsMap.get(target);
        if (!depsMap) {
          depsMap = new Map();
          targetsMap.set(target, depsMap);
        }
        let dep = depsMap.get(key);
        if (!dep) {
          dep = new Set();
          depsMap.set(key, dep);
        }
        // console.log(dep);
        dep.add(activeEffect);
      };
const trigger = (target, key) => {
        let depsMap = targetsMap.get(target);
        if (!depsMap) return;
        let dep = depsMap.get(key);
        if (dep) {
          console.log('trigger');
          dep.forEach((eff) => {
            console.log(dep);
            eff();
          });
        }
      };
const effect = (eff) => {
        activeEffect = eff;
        activeEffect();
        activeEffect = null;
      };
const reactive = (obj) => {
        const handler = {
          get(target, key, reci) {
            console.log('getter');
            if (activeEffect) {
              track(target, key);
            }
            return Reflect.get(target, key);
          },
          set(target, key, value, reci) {
            console.log('setter');
            let oldV = target[key];
            let result = Reflect.set(target, key, value);
            if (oldV !== value && result) {
              trigger(target, key);
            }
            return true;
          },
        };
        return new Proxy(obj, handler);
      };
const data = reactive({ price: 10, unit: 2 });
let total = 0;
effect(() => {
        console.log('effecting');
        total = data.price * data.unit;
});
```

usage:

```js
const data = reactive({ price: 10, unit: 2 });
let total = 0;
effect(() => {
     total = data.price * data.unit;
});
```

## Ref

For variable depends on reactive obj but is not a property of a reactive object itself.

use ref to make it reactive with single prop: .value

```js
const ref = (init) => {
    const r = {
        get value() {
            if (activeEffect) {
                track(r, 'value');
            }
            return init;
        },
        set value(newV) {
            init = newV;
            trigger(r, 'value');
        },
    };
    return r;
};
```

```js
let salePrice = ref(0);
effect(() => {
  //salePrice not reactive since it is not a prop of the target obj
  total = salePrice.value * data.unit;
});

```

## Computed prop

```js
const computed = (computation) => {
   let r = ref();
 	//r.value=computation() //trigger setter of ref and inside the computation trigger the getter of data
  	//but the computation function was not reactive since it wasn't in any deps
	//so call effect to manually add the computation
    effect(() => (r.value = computation()));
    return r;
};
```

