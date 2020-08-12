# Promise A+

https://promisesaplus.com/

A promise represents the eventual result of an asyncchronous operation

决议（resolve）、完成（fulfill）、拒绝（reject）

## State Machine

States: 'pending';'fulfilled';'rejected';

```js
const PENDING = 'pending';
const FULFILLED = 'fulfilled';
const REJECTED = 'rejected';
```

## executor

executor will be executed immediately, it takes two function as parameters

```js
function Promise(executor){
    this.state = PENDING;
    function resolve()
    function reject()
    //executor(resolve, reject);
    //user input the executor, which may cause error, wrap it with try and catch
      try{
        executor(resolve, reject);
    }catch(error){
        reject(error);
    }
}

```

## resolve & reject

Only when the state is PENDING, a transition can be made;

```js
const resolve=(value)=>{
        if(this.state === PENDING){
            this.state = FULFILLED;
        }
    }
```

## then

chain revoke => Promise.prototype.then(onRes,onRej)

Methods in then can obtain the value passed from the promise instance => use `this` =>pass the value/reason out by passing them into the resolve/rejection function

```js
Promise.prototype.then = function(onFulfilled, onRejected){
    //check if onFuillfilled and onRejected are functions
    if(this.state === FULFILLED){
        typeof onFulfilled === 'function' && onFulfilled(this.value);
    }
    if(this.state === REJECTED){
        typeof onRejected === 'function' && onRejected(this.reason);
    }
    if(this.state === PENDING){
        // TODO
    }
}
```

```js
//constructor:
  const resolve=(value)=> {
   if(this.state === PENDING){
            this.state = FULFILLED;
            this.value = value;
        }
  }
  const resolve=(reason)=> {
   if(this.state === PENDING){
            this.state = FULFILLED;
            this.reason = reason;
        }
  }
```

if onFuillfilled and onRejected are not functions, the result(value/reson) should 'penetrate' to the next then.

Provide a default function: (value)=>value

```js
onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : value => value;
onRejected = typeof onRejected === 'function' ? onRejected : reason => { throw reason };
```

### then() returns a new promise instance

the new promise instance, can keep calling then on itself and pass the previous value/reson to the next then by passing it to the resolve and reject functions of itself.

```js
const promise2 = new Promise((resolve, reject) => {
        if(this.state === FULFILLED){
            let x = onFulfilled(this.value);
            resolve(x);
        }
        if(this.state === REJECTED){
            let x = onRejected(this.reason);
            reject(x);
        }
        if(this.state === PENDING){
            // TODO
        }
    })
 return promise2;

```

the onFullfilled(this.value) and onRejected(this.reason) can possibly create error, wrap it with try and catch;

Furthermore, if the onFullfilled/onRejected returns a promise, it should be processed by another then reursively until the x was not a promise;

Encapsulate the logic in a new function resolvePromise, which takes the new promise `promise2`, the returned value `x`, and the resove and reject function of  new promise as parameters

```js
  if(this.state === FULFILLED){
            try{
                let x = onFulfilled(this.value);
                resolvePromise(promise2, x, resolve, reject);
            }catch(error){
                reject(error);
            }
        }
        if(this.state === REJECTED){
            try{
                let x = onRejected(this.reason);
                resolvePromise(promise2, x, resolve, reject);
            }catch(error){
                reject(error);
            }
        }
```

### this.state===PENDING

if the promise isn't resolved when the then() has already been invoked, how to obtain the value/reson from the promise after it was fullfilled/rejected to run the onFullfilled/onRejected function?

Store the callbacks in the constructor.

```js
this.onResolvedCallback = [];
this.onRejectedCallback = [];
```

```
const resolve=(value)=>{
        if(this.state === PENDING){
            this.state = FULFILLED;
            this.value = value;
            this.onResolvedCallback.length > 0 && 
            this.onResolvedCallback.forEach(fn => fn());
        }
}

```

and add the peding call back in the then() method:

```js
 if(this.state === PENDING){
     //pending
            this.onResolvedCallback.push(() => {
                //use setTimeout to imple the async callback
                setTimeout(()=>{
                    try {
                        let x = onFulfilled(this.value);
                        resolvePromise(promise2, x, resolve, reject);
                    }catch(error){
                        reject(error);
                    }
                })
            });
            this.onRejectedCallback.push(() => {
                setTimeout(()=>{
                    try {
                        let x = onRejected(this.reason);
                        resolvePromise(promise2, x, resolve, reject);
                    }catch(error){
                        reject(error);
                    }
                })
            });
        }
```

## resolvePromise()

When x was a promise instance with 3 possible states:

* rejected: call onRejected with same reason
* resolved: call onFullfilled with same value
* pending: keep pending unitil it's resolved/rejected

the same logic was applied within then resolve method

```js
const resolvePromise =(promise2, x, resolve, reject)=>{
	resolve(x)
}
```

When x was function or other type of object,

```js
if(x && typeof x === 'object' || typeof x === 'function'){
        let called = false; // check for single invoke
        try{
            let then = x.then;  //If retrieving the property x.then results in a thrown exception e, reject promise with e as the reason.
            if(typeof then === 'function'){
                //(y)=>{},(r)=>{},catch(e) only one of the three cb would run
                then.call(x, y => {
                    if(called)  return;
                    called = true;
                    //recursion
                    resolvePromise(promise2, y, resolve, reject);   
                }, r => {
                    if(called)  return;
                    called = true;
                    reject(r);
                });
            }else{
                resolve(x);//即便p1rejected了，x= onRejected(this.resaon),return p2时，会走到resolve(x)中，即p2的state为resolved
            }
        }catch(e){
            if(called)  return;
            called = true;
            reject(e);
        }
```

Aviod dead loop:

When x === p2, it would cause dead loop: p2.then().then()

```js
 if(x === promise2)  
        return reject(new TypeError('Chaining cycle detected for promise #<Promise>'));
```



## Implement

```js
class myPromise {
        constructor(executor) {
          this.value = null;
          this.state = myPromise.PENDING;
          this.onFullfilledCB = [];
          this.onRejectedCB = [];
          if (typeof executor !== 'function') {
            throw new Error('executor has to be a function');
          }
          this.executor = executor;
          try {
            this.executor(this.resolve.bind(this), this.reject.bind(this));
          } catch (error) {
            console.error('Promise error: ' + error);
          }
        }
        resolve(value) {
          if (this.state === 'pending') {
            this.value = value;
            this.state = myPromise.RESOLVED;
            this.onFullfilledCB.forEach((fn) => fn(this.value));
            //console.log(this);
          }
        }
        reject(value) {
          if (this.state === 'pending') {
            this.value = value;
            this.state = myPromise.REJECTED;
            this.onRejectedCB.forEach((fn) => fn(this.value));
          }
        }
        then(onFullfilled, onRejected) {
          //第一个then接收的两个参数
          if (typeof onFullfilled !== 'function') {
            onFullfilled = () => this.value;
          }
          if (typeof onRejected !== 'function') {
            onRejected = () => this.value;
          }

          let p2 = new myPromise((resolve, reject) => {
            //第二个then接收的两个函数
            setTimeout(() => {
              // console.log(this);
              if (this.state === myPromise.RESOLVED) {
                this.parse(p2, onFullfilled(this.value), resolve, reject);
              }
              if (this.state === myPromise.REJECTED) {
                //console.log('run onrejected');
                //console.log(this);
                this.parse(p2, onRejected(this.value), resolve, reject);
              }
              if (this.state === myPromise.PENDING) {
                this.onFullfilledCB.push((value) => {
                  this.parse(p2, onFullfilled(value), resolve, reject);
                });
                this.onRejectedCB.push((value) => {
                  this.parse(p2, onRejected(value), resolve, reject);
                });
              }
            });
          });
          return p2;
        }
        parse(promise, result, resolve, reject) {
          if (promise === result) {
            throw new Error('cycle!');
          }
          try {
            if (result instanceof myPromise) {
              if (result instanceof myPromise) {
                result.then(resolve, reject);
              } else {
                resolve(error);
              }
            }
          } catch (error) {
            reject(error);
          }
        }
      }
      myPromise.PENDING = 'pending';
      myPromise.RESOLVED = 'resolved';
      myPromise.REJECTED = 'rejected';

      myPromise.resolve = (value) => {
        return new myPromise((res, rej) => {
          if (value instanceof myPromise) {
            value.then(res, rej);
          } else {
            res(value);
          }
        });
      };
      myPromise.reject = (reason) => {
        return new myPromise((res, rej) => {
          if (reason instanceof myPromise) {
            reason.then(res, rej);
          } else {
            rej(reason);
          }
        });
      };
      myPromise.all = (promises) => {
        let resolves = [];
        return new myPromise((res, rej) => {
          promises.forEach((promise) => {
            promise.then(
              (value) => {
                resolves.push(value);
                if (resolves.length === promises.length) {
                  res(resolves);
                }
              },
              (reason) => {
                rej(reason);
              }
            );
          });
        });
      };
      myPromise.race = (promises) => {
        return new myPromise((res, rej) => {
          promises.forEach((promise) => {
            promise.then((value) => {
              res(value);
            });
          });
        });
      };
```

