# Promise

A promise represents the eventual result of an asyncchronous operation

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

