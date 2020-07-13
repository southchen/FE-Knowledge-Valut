[toc]

# ES6 Proxy & Reflect API 

Vue 3 reactivity core adopted the es6 proxy api which equipts programmer with the ability to intercept the access to object.

```js
const p = new Proxy(target, handler)
```

With the help of the [`Reflect`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Reflect) class we can give some accessors the original behavior and redefine others:

very versity comparing to Object.defineProperty()

```js
handler.get()  //A trap for getting property values. 
handler.set() //A trap for setting property values.

handler.apply() //A trap for a function call.
handler.construct() //A trap for the new operator.
handler.defineProperty() //A trap for Object.defineProperty.

handler.getOwnPropertyDescriptor()//A trap for Object.getOwnPropertyDescriptor.
handler.getPrototypeOf()//A trap for Object.getPrototypeOf.
handler.has() //A trap for the in operator.
handler.isExtensible() //A trap for Object.isExtensible.
handler.ownKeys() //A trap for Object.getOwnPropertyNames and Object.getOwnPropertySymbols.
handler.preventExtensions() //A trap for Object.preventExtensions.
handler.setPrototypeOf()  //A trap for Object.setPrototypeOf.
handler.deleteProperty() //A trap for the delete operator.
```

using proxy to achieve the `re-wrirte` of the native property

## Array Proxy

```js
function createArray(...elements) {
  let handler = {
    get(target, propKey, receiver) {
      let index = Number(propKey);
      if (index < 0) {
        propKey = String(target.length + index);
      }
      return Reflect.get(target, propKey, receiver);
    }
  };

  let target = [];
  target.push(...elements);
  return new Proxy(target, handler);
}

let arr = createArray('a', 'b', 'c');
arr[-1] // c
```

## Function Proxy



```

```





ref:

<a src="https://es6.ruanyifeng.com/#docs/proxy">ES6 ruanyifeng</a>