[toc]

# Vue 3.0 Reactivity

in Vue 3.0 the Proxy API was adopted to intercept the access to the data/state object

## Simple implement

only consider one target/data to be reactive

```js
const depMaps = new Map();
let activeEffect; //use an global variable to indicate which effect function are currently activated
const track = (target, key) => {
   if (!depMaps.has(key)) {
       let dep = new Set();
       depMaps.set(key, dep);
   }
   let dep = depMaps.get(key);
	dep.add(activeEffect);
};
const trigger = (target, key) => {
        let dep = depMaps.get(key);
        if (dep) {
          dep.forEach((eff) => eff());
        }
      };

const effect = (eff) => {
        activeEffect = eff;
        activeEffect();
    //run eff(), trigger the getter to track the listened prop
        activeEffect = null;
      };

const reactive = (obj) => {
    const handler = {
       get(target, key, reci) {
          if (activeEffect) {
              //every time visit the prop, call the track function
              track(target, key);
          }
          return Reflect.get(target, key);
    },
       set(target, key, value, reci) {
            let oldV = target[key];
            let result = Reflect.set(target, key, value, receiver);
            if (oldV !== value && result) {
             //every time set a new value to prop, call the trigger
              trigger(target, key);
            }
          return true;
     },
   };
  return new Proxy(obj, handler);
};
```

usage:

```js
const data = reactive({ price: 10, unit: 2 });
let total = 0;
effect(() => {
     total = data.price * data.unit;
});
```

