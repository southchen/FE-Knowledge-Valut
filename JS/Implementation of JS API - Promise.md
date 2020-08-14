[toc]

# Implementation of JS API - Promise 

static methods and instance methods

## Race

只要有一个实例率先改变状态，新生成实例的状态就跟着改变。

如果传的迭代是空的，则返回的 promise 将永远等待。

```js
let o = new Promise((res, rej) => setTimeout(res, 1000, 'o'));
let r = new Promise((res, rej) => setTimeout(res, 500, 'r'));
Promise.myRace = function (arr) {
  //第一个resolve/reject的
  return new Promise((res, rej) => {
    arr.forEach((p) => {
      if (p instanceof Promise) {
        p.then(res, rej);
      } else {
        res(p);
      }
    });
  });
};
Promise.myRace([o, r, 6]).then((v) => console.log(v));
```

## All

short-circuits when an input value is rejected

`fulfilled`状态下返回值是一个按顺序存储每一个实例返回值的数组，而`rejected`状态下返回值则是第一个被拒绝实例的返回值

```js
Promise.myAll = function (iterator) {
  let results = [];
  let len = iterator.length;
  let count = 0;
  return new Promise((res, rej) => {
    for (let i = 0; i < len; i++) {
      if (!(iterator[i] instanceof Promise)) {
        results[i] = iterator[i];
        if (count === len - 1) res(result);
        count++;
      } else {
        iterator[i].then(
          (v) => {
            results[i] = v;
            if (count === len - 1) res(results);
            count++;
          },
          (v) => rej(v)
        );
      }
    }
  });
};
```

optimization

```js
Promise.myAll = function (iter) {
  let len = iter.length;
  if (len === 0) return Promise.resolve([]);
  let results = [];
  let count = 0;
  let ind = 0;
  return new Promise((res, rej) => {
    for (let p of iter) {
      //for of for universal iterator
      let i = ind++; //在这里拿到i
      console.log(p);
      Promise.resolve(p).then(
        (v) => {
          //let i = ind++; 不能在这里，因为谁先resolve，谁先执行这里，i和iter中的索引顺序不同
          console.log(i, v);
          results[i] = v;
          if (count++ === len - 1) res(results);
        },
        (r) => {
          rej(r);
        }
      );
    }
  });
};
```

## allSettled

只有等到所有这些参数实例都返回结果，不管是`fulfilled`还是`rejected`，包装实例才会结束。

状态变成`fulfilled`后，`Promise` 的监听函数接收到的参数是一个数组，每个成员对应一个传入`Promise.allSettled()`的 `Promise` 实例。{status:fulfilled,value:x} or {status:rejected,reason:x}

```js
Promise.myAllSettled = function (iter) {
  let len = iter.length;
  let results = [];
  let count = 0;
  let index = 0;
  return new Promise((res, rej) => {
    let i = index++;
    for (let p of iter) {
      let obj = {};
      Promise.resolve(p).then(
        (v) => {
          obj.status = 'fulfilled';
          obj.value = v;
          results[i++] = obj;
          if (count++ === len - 1) {
            res(results);
          }
        },
        (r) => {
          obj.status = 'rejected';
          obj.reason = r;
          results[i++] = obj;
          if (count++ === len - 1) {
            res(results);
          }
        }
      );
    }
  });
};
```

## Any

 stage 4 of the TC39 process

If no promises in the iterable fulfil (if all of the given promises are rejected), then the returned promise is rejected with an AggregateError, a new subclass of Error that groups together individual errors.

只要参数实例有一个变成`fulfilled`状态，包装实例就会变成`fulfilled`状态；如果所有参数实例都变成`rejected`状态，包装实例就会变成`rejected`状态。

https://tc39.es/proposal-promise-any/#sec-aggregate-error-objects

### AggregateErrors

```js
function AggregateError(errors, msg) {
  msg = msg ? msg : 'No Promise in Promise.any was resolved';
  let err = new Error(msg);
  Object.setPrototypeOf(err, AggregateError.prototype);

  delete err.constructor;

  msg = msg.toString();
  const msgDsc = {
    value: msg,
    writable: true,
    enumerable: false,
    configurable: true,
  };
//  errors = errors.map((e) => {
//    e = e.toString();
//    return e;
 // });

  Object.defineProperties(err, {
    message: {
      value: msg,
      writable: true,
      enumerable: false,
      configurable: true,
    },
    errors: {
      value: Array.from(errors),
      writable: true,
      enumerable: false,
      configurable: true,
    },
  });
  return err;
}
Object.defineProperties(AggregateError.prototype, {
  name: {
    value: 'AggregateError',
    writable: false,
    enumerable: false,
    configurable: true,
  },
  constructor: {
    value: AggregateError,
    writable: false,
    enumerable: false,
    configurable: true,
  },
  message: {
    value: '',
    writable: true,
    enumerable: false,
    configurable: true,
  },
});

Object.setPrototypeOf(AggregateError.prototype, Error.prototype);
```

```js
Promise.myAny = function (iter) {
  let len = iter.length;
  let count = 0;
  let errors = [];
  if (len <= 0) return Promise.resolve();
  return new Promise((res, rej) => {
    for (p of iter) {
      p = Promise.resolve(p);
      p.then(
        (v) => {
          res(v);
        },
        (r) => {
          errors.push(r);
          if (count++ == len - 1) {
            let e = new AggregateError(errors);
            rej(`${e.name}:${e.message}`);
          }
        }
      );
    }
  });
};
```

## prototype.finally

```js
Promise.prototype.myFinally = function (onFin) {
  return new Promise((res, rej) => {
    this.then(
      () => onFin(),
      () => onFin()
    );
  });
};
```

## Reject

```js
Promise.reject=function(reason){
    new Promise((res,rej)=>{
        rej(reason)
    })
}
```

## Resolve

```js
Promise.resolve = function(value) {
    if(value instanceof Promise)    return value
    const promise = new Promise(function(resolve, reject) {
        resolvePromise(promise, value, resolve, reject)
    });
    return promise;
}
```

## prototype.catch

```js
Promise.prototype.myCatch = function (onRej) {
	return this.then(null,onRje)
}
```

