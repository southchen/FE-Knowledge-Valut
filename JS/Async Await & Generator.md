[toc]

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

### `for of`  implemetation for `Object` 

```js
Object.prototype[Symbol.iterator] = function* () {
    for (const [key, value] of Object.entries(this)) {
          yield { key, value };
    }
 };
for (const { key, value } of { a: 1, b: 2, c: 3 }) {
  console.log(key, value);
}
```

### Task queue:

#### incorrect implement:

```js
async function test() {
	let arr = [4, 2, 1]
	arr.forEach(async item => {
		const res = await handle(item)
		console.log(res)
	})
	console.log('end')
}

function handle(x) {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			resolve(x)
		}, 1000 * x)
	})
}

test()
/**end
1
2
4**/
```

#### iteration:

```js
async function test() {
  let arr = [4, 2, 1]
  let iterator = arr[Symbol.iterator]();
  let res = iterator.next();
  while(!res.done) {
    let value = res.value;
    console.log(value);
    await handle(value);
    res = iterater.next();
  }
	console.log('结束')
}
// 4
// 2
// 1
// 结束
```

#### recursion:

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

V1: directly returns a promise:

```js
function run(genFunc) {
        let ite = genFunc();
        return new Promise((res, rej) => {
          const recursion = (val) => {
            try {
              var { done, value } = ite.next(val);
            } catch (err) {
              return rej(err);
            }
            if (!done) {
                //yield => promise wrap with Promise.resolve()
              Promise.resolve(value)
                //recursion call with obtained value
                  .then((val) => recursion(val),(err)=>rej(err));
            }else{
              return res(value);
            }
          };
          recursion();
        });
      }
      let r = run(myGenerator);
```

Bable:

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
        return function (...arg) {//for the arguments the generator recieves
          const gen = genFunc.apply(null, arg);
          return new Promise((resolve, reject) => {
            function step(key, val) {
              try {
                 const { value, done }= gen[key](val); 
              } catch (err) {
                return reject(err);
              }
              if (done) {
                return resolve(value); //complelte:yield value=>promise resolve(value)
              } else {
                return Promise.resolve(value).then(
                  (val) => {
                    step('next', val);//call gen.next(val)
                  },
                  (err) => {
                    step('throw', err);//cal gen.throw(err)
                  }
                );
              }
            }
            //recursion entry
            step('next'/*,null*/);
          });
        };
      }
      var gen = asyncToGenerator(testG);
      gen().then((res) => console.log(res));
```

