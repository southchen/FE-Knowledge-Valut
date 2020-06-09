# Async Await & Generator

## Generator function

```js
function* name([param[, param[, ... param]]]) { statements }
```

Generators are functions that can be exited and later re-entered. Their context (variable bindings) will be saved across re-entrances.

Not like a normal function which create a brand new context when it's called.

Calling a generator function does not execute its body immediately; an [iterator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#iterator) object for the function is returned instead. When the iterator's `next()` method is called, the generator function's body is executed until the first [`yield`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/yield) expression, which specifies the value to be returned from the iterator or, with [`yield*`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/yield*), delegates to another generator function. 

The `next()` method returns an object with a `value` property containing the yielded value and a `done` property which indicates whether the generator has yielded its last value, as a boolean. 

Calling the `next()` method with an argument will resume the generator function execution, replacing the `yield` expression where an execution was paused with the argument from `next()`.

with `Recusion`:

```js
function* iterArr(arr) {            //return a iterator
  if (Array.isArray(arr)) {         // check the argument
      for(let i=0; i < arr.length; i++) {
          // loop and recursion. pause after each recursion
          yield* iterArr(arr[i]);   
      }
  } else {                          // exist point    
      yield arr;
  }
}
//for-of 
var arr = ['a', ['b', 'c'], ['d', 'e']];
for(var x of iterArr(arr)) {
        console.log(x);               // a  b  c  d  e
 }

// spread
var arr = [ 'a', ['b',[ 'c', ['d', 'e']]]];
var gen = iterArr(arr);
arr = [...gen];                        // ["a", "b", "c", "d", "e"]
```

Task queue:

```js
// goal: run by sequence valOne->valTwo->valThree
function* someTask(){
try{
  const valOne=yield 1
  const valTwo=yield 2
  const valThree=yield 3
}catch(e){
    //handle error
}
}

scheduler(someTask());

function scheduler(task) {
    //task->generator object {<suspend>}
    //passing the value of value of current task, init with undefined
    //so the variable assined with yield can get this value
  const taskObj = task.next(task.value);
    //call the .next to move to next yield
  if (!taskObj.done) {
      //passing the taskObj.value(obtained from yield xx) to task.value
    task.value = taskObj.value
      //recursion since the task has moved to next yield
    scheduler(task);
  }
}
```



## Async/await

- syntax sugar created by generator function
- async/await can be automatically execute，no need to call next()
- `async` function returns Promise object，`generator` function returns iterator object
- `await`can return the resolve/reject value of Promise

Implement of async/await

```js
//mock async function
const getData = (id = 1) =>
        new Promise((res) => {
          setTimeout(() => {
            res(id + ' data');
          });
        }, 4000);
//generator function
function* testG() {
        const data = yield getData();
        console.log('data: ', data);
        const data2 = yield getData(data);
        console.log('data2: ', data2);
        return 'success';
      }
/*
 *the goal: to get data like this: 
 *var gen = asyncToGenerator(testG); 
 *gen().then((res) => console.log(res));
 */
/*
 *@params function 
 *@return a function that returns a promise
*/
 function asyncToGenerator(genFunc) {
        //console.log(arguments);
        return function (...arg) {
          //console.log(arguments);
          const gen = genFunc.apply(null, arg);
          return new Promise((resolve, reject) => {
            //创建递归操作的函数,来自动完成调用.next方法
            function step(key, arg) {
              //arg为 promise resolve的结果
              let generatorResult;
              try {
                console.log('vale' + arg);
                generatorResult = gen[key](arg); //gen.next(value) or gen.throw(err)//参数会变为yiled左边变量的值 第一次undefined
                //generatorResult =>value=>yield 右边的值
              } catch (err) {
                return reject(err);
              }
              const { value, done } = generatorResult; //value为getdata返回的promise
              if (done) {
                return resolve(value); //最后一次yield的值=>promise resolve的值
              } else {
                //done为false继续递归
                return Promise.resolve(value).then(
                  (val) => {
                    //传入resolve的结果，即上一个yield，给了它左边的变量
                    step('next', val);
                  },
                  (err) => {
                    //promise 如果reject了，就调用generator的throw方法，并把error传入
                    step('throw', err);
                  }
                );
              }
            }
            //调用递归函数
            step('next');
          });
        };
      }
      var gen = asyncToGenerator(testG);
      gen().then((res) => console.log(res));
```

