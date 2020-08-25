[toc]

# Recursion Part II

## Bubble sorting: recursive way

```js
function recurBubble(arr) {
  if (arr.length <= 1) return arr;
  let max = -Infinity;
  let maxIndex = -1;
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] >= max) {
      max = arr[i];
      maxIndex = i;
    }
  }
  max = arr.splice(maxIndex, 1);
  return [...recurBubble(arr), ...max];
}
```

## Insert sorting

<img alt="insrtsorting" src="https://mmbiz.qpic.cn/mmbiz_png/rSmDLkNsngSqWBfYzlutsadsdibAGcVaDvdwnmKYD06mojp4UuMgme7mep3O562WSvNUdJo3PpqG6aE5zUVX0RA/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1" style="zoom:67%;" >

```js
function insertRecu(arr) {
  let nums = [...arr];
  const recursion = (nums, n) => {
    if (n <= 1) return;
    recursion(nums, n - 1);
    let temp = nums[n - 1];
    let j = n - 2;
    while (j >= 0 && temp < nums[j]) {
      nums[j + 1] = nums[j];
      j--;
    }
    nums[j + 1] = temp;
  };
  recursion(nums, nums.length);
  return nums;
}
```

## Sort linked list

//todo

## Tail recursion & currying

<img src='https://assets.leetcode.com/uploads/2019/01/26/card_recursion_tail.png'>

Example Fibonacci

**Before**

```js
const fibonacci = (n) => {
    //base case
    if (n <2) {
        return 1;
    }
    //return recursively call + recursively call
    return fibonacci(n-1) + fibonacci(n - 2);
};
```

**After**

* in order to use tail recursion, the arguments was tweaked
  * init the function with first two result: r1:1 and r2:1;
  * one parameter was to store the cur number r1;
  * one parameter was to store the previous result r2 (sum of f(n-1) and f(n-2), so no need to do the  fibonacci(n-1) + fibonacci(n - 2) inside the function
  * the n was used to record the needed recursion times; when it reaches 2, return the base case

```js
//1,1,2,3,5....
const fibonacci = (n, r1, r2) => {
    //base case
    if (n < 2) {
        return r2;
    }
    //return only one recursively call
    //r2->r1 r1+r2->r2 n-1->n
    return fibonacci(n-1, r2, r1+r2);
};
fibonacci(10, 1, 1);
```

Example factorial

**Before**

```js
function factorial(n){
    if(n<=1){
        return n;
    }
    return factorial(n-1)*n
}
factorial(5)
```

**After**

```js
function tailFactorial(n,res){
    if(n<=1) return res;
	return factorial(n-1,n*res)
}
tailFactorial(5,1)
```

Example: Random given recurrence 

`function: f(n) = 3 * f(n-1) + f(n - 2) + f(n - 3) - 4; f(0) = 2; f(1) = 2; f(2) = 3;`

```js
function recurrence(n) {
  if (n <= 1) return 2;
  if (n === 2) return 3;
  return 3 * recurrence(n - 1) + recurrence(n - 2) + recurrence(n - 3) - 4;
}
recurrence(5)
```

```js
function tailRecurrencey(n, r1, r2, r3) {
  if (n <= 1) return r1;
  if (n === 2) return r2;
    //n>=3
    //r2->r1, r3->r2 r3->recurrence(r3)
  return tailRecurrencey(n - 1, r2,r3,3* r3 + r2 + r1 - 4);
}
tailRecurrencey(5,  2, 3, 9);
```

Sometimes it's not natural to call a function that takes a second parameter which is seems not that related. Currying can transfer a function that takes multiple parameters to a function takes single parameter every time until it accumulated parameters number meets the requirement it returns the answer.  

```js
function tailFactorial(n, res) {
  res = res * n;
  return tailFactorial(n - 1, res);
}
function currying(fn, initRes) {
  return function (n) {
    //return fn(n, initRes);
    return fn.call(this, n, initRes);
  };
}
const factorial = currying(tailFactorial, 1);
factorial(5);
```

ES6的尾调用优化只在严格模式下开启，正常模式是无效的。

这是因为在正常模式下，函数内部有两个变量，可以跟踪函数的调用栈。

> - `arguments`：返回调用时函数的参数。
> - `func.caller`：返回调用当前函数的那个函数。

尾调用优化发生时，函数的调用栈会改写，因此上面两个变量就会失真。严格模式禁用这两个变量，所以尾调用模式仅在严格模式下生效。

## Using generator to create fibonacci

```js
function* fibonacci(){
  let [prev, cur] = [0, 1];
  console.log(cur);
  while(true) {
    [prev, cur] = [cur, prev + cur];
    yield cur;
  }
}

for(let item of fibonacci()) {
  if(item > 50) break;
  console.log(item);
}
```