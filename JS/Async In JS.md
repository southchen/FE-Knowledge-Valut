---
Title : async in JS
---
[toc]

# Async In JS

Single thread JS

ways to implement async

- callback function
- event listener
- Subscribe/publish
- Promise

coroutine: generator

```js
function *asnycJob() {
  // ...
  var f = yield readFile(fileA);//执行到此处，执行权将交给其他协程readFile()。是异步两个阶段的分界线。
  // ...do sth
}
```

Generator 函数可以

* 暂停执行和恢复执行，这是它能封装异步任务的根本原因。
* 函数体内外的数据交换
* 错误处理机制

```js
function* gen(x){
  try {
    var y = yield x + 2;
  } catch (e){ 
    console.log(e);// 出错了
  }
  return y;
}

var g = gen(1);
g.next();
g.throw（'出错了'）;
```

example of async request application using generator

```js
var fetch = require('node-fetch');

function* gen(){
  var url = 'https://api.github.com/users/github';
   //pass the yield value to the iterator
  var result = yield fetch(url); //var result = await fetch(url)
    //obtain the value of result from iterator
  console.log(result.bio);//apply the result obtained from async 
}
/****/
var g = gen();
var result = g.next();//call the fetch(url), result =>iterator 
result.value //result.val=>promise
    .then(function(data){ // deal with the async result:data
  			return data.json(); //pass to the next then
		})
    .then(function(data){ 
  			g.next(data); //pass the result to the generator
		});
```

didirection tunnel 消息双向通道: 

* value = .next() <= yield < value > 可以从 next 函数中拿到 yield 语句后面的值，

* .next(val) => val = yield < ...> 可以通过 next 函数传值把传进去的值变为 yield 语句的返回值。

```js
      function* gen() {
        var ret = yield 1 + 2;
        var num = yield 4; //num ->3
        ret = yield ret + num; //ret->3 ->ret+num 3+4 ret->7
        console.log(ret);
      }
      //1+2+4
      let iter = gen();
      let ret = iter.next(); //ret.val 1+2
      let num = iter.next(ret.value); //num 4
      console.log(ret.value, num.value);
      let final = iter.next(num.value);
      console.log(final); //7
```

Generator 函数就是一个异步操作的容器。它的自动执行需要一种机制，当异步操作有了结果，能够自动交回执行权。

* 回调函数。将异步操作包装成 Thunk 函数，在回调函数里面交回执行权。
* Promise 对象。将异步操作包装成 Promise 对象，用 then 方法交回执行权。			

## Async/await implementation by generator

- `async/await`自带执行器，不需要手动调用next()就能自动执行下一步
- `async`函数返回值是Promise对象，而Generator返回的是生成器对象
- `await`能够返回Promise的resolve/reject的值

```js
function* myGenerator() {
    //yield + async operation
  console.log(yield Promise.resolve(1))   //1
  console.log(yield Promise.resolve(2))   //2
  console.log(yield Promise.resolve(3))   //3
}

//manually run
const gen = myGenerator()
gen.next().value.then(val => {
    //pass the val of result of previous promise
  gen.next(val).value.then(val => {
    gen.next(val).value.then(val => {
      gen.next(val)
    })
  })
})

```

单独的生成器作用并不大, 特别是在异步流程控制中, 即使 yield 后面可以添加异步任务, 但是我们仍然需要一个一个地调用 next 函数, 如果需要流程化控制, 就需要自动执行 next 函数.

我们希望生成器函数能自动往下执行，且yield能返回resolve的值

## thunk function

```js
function run(fn) {
  var gen = fn();
  function next(err, data) {
    var result = gen.next(data); //recursion
    if (result.done) return;
    result.value(next);
  }
  next();
}
run(gen);
```

making sure the async function always returns a promise object:

```js
function run(genFunc) {
        let ite = genFunc();
        return new Promise((res, rej) => {
          const recursion = (val = null) => {
            try {
              var { done, value } = ite.next(val);
            } catch (err) {
              rej(err);
            }
            if (!done) {
              // if (value instanceof Promise) {
              //   value.then((val) => {
              //     recursion(val);
              //   });
              // } else {
              Promise.resolve(value).then((val) => {
                recursion(val);
              });
              //}
            }
            return res(value);
          };
          recursion();
        });
      }
      let r = run(myGenerator);
```

Thunk 函数并不是 Generator 函数自动执行的唯一方案。因为自动执行的关键是，必须有一种机制，自动控制 Generator 函数的流程，接收和交还程序的执行权。回调函数可以做到这一点，Promise 对象也可以做到这一点。

## output test

```js
async function async1() {
     console.log('async1 start');
        let re1 = await async2(); //re =>the value not the promise obj
        let re2 = async2(); //Promise {<resolved>: "async2 result"} wrap a normal value with promise obj,
      console.log('re1:');
        console.log(re1);
        console.log('re2:');
        console.log(re2);
        console.log('async end');
    console.log('async1 end');
}
async function async2() {
     console.log('async2');
     setTimeout(function () {
         console.log('setTimeout');
       }, 0)
    return 'async2 result';
    //return new Promise((res, rej) => {
        //  setTimeout(() => res('new promise'), 2000);
      //  });
}
async1();
new Promise(function (resolve) {
      console.log('promise1');
      resolve();
}).then(function () {
     console.log('promise');
});
console.log('script end')
/**OUTPUT
async1 start
async2
promise1
script end
//async task
async2
re1:
async2 result
re2:
Promise {<resolved>: "async2 result"}
async1 end

promise
setTimeout
setTimeout
**/
```

async函数await 后面的语句被挂起，等待await后的一步操作resolve。相当于then的操作。并执行后面的语句。

async函数若无await，同步；如果返回普通值，得到promise包装后的对象，状态为resolved

如果返回promise，得到promise，状态为pending

```js
let re2 = async2()
re2.then((val)=>{
    console.log(val)
})
//===>
let re1= await async2()
 console.log(re1)
```

Sleep function

```js
const sleep = ms => new Promise(
  resolve => setTimeout(resolve, ms)
);
await sleep(1000);
```

```js
// Sequential Code (~3.0s)
sleep(1000)
  .then(() => sleep(1000));
  .then(() => sleep(1000));
// Concurrent Code (~1.0s)
Promise.all([ sleep(1000), sleep(1000), sleep(1000) ]);
```

task queue

```js
 function queue(arr) {
        let p = Promise.resolve();
        arr.forEach((element) => {
          p = p.then(() => {
            console.log(element);
            //do sth
            return new Promise((res) => {
              setTimeout(() => {
                res();
              }, 1000);
            });
          });
        });
      }
queue(['a', 'b', 'c']);
```

await 后同步/异步操作

````js
async function async1() {
  console.log("async1 start");

 await async2();
 console.log("async1 end");
  //相当于====>
 /*
  new Promise(resolve => {
    console.log("async2")
    resolve()
  })
  .then(res => console.log("async1 end"))
  */
}
async function async2() {
    //同步操作：
  console.log("async2");
}

````

