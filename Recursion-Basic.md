[TOC]

# Recursion 🔁

### Complexity

O(*T*)=*R*∗O(*s*)

### Template

Define the `base/edge case`

* what to return 
  * simply pop out the current function in call stack `return ;`
  * return a value or an array so the result can be later combined to next result
  * understand what the functionality of the function

Assuming the previous result has been resolved

Find the `recurrence relation`: 

* pre -> cur   f(cur) = g(f(pre))

* Fabnancci 

  f(n)= f(n-1)+f(n+1)

* Pascal's Triangle

  *f*(*i*,*j*)=*f*(*i*−1,*j*−1)+*f*(*i*−1,*j*)

## Optimization 

#### Memorization

duplicate calculations

<img src='https://leetcode-cn.com/explore/featured/card/recursion-i/258/memorization/Figures/recursion/fibonacci.png' alt='fibonacci'>

using a hash map/array to store/cache the recurrance results

before recursion, check if the results was in the cache

```js
var fib = function (N) {
  let map = [0, 1, 1];
  for (let i = 3; i <= N; i++) {
    map[i] = map[i - 2] + map[i - 1];
  }
  return map[N];
};
```

DP optimize:

```js
var fib = function (N) {
  if (N == 0) return 0;
  if (N == 2 || N == 1) return 1;
  var prev = 1,
    curr = 1;
  for (var i = 3; i <= N; i++) {
    var sum = prev + curr;
    prev = curr;
    curr = sum;
  }
  return curr;
};
```

Complexity with memorization:

O(1)∗*n*=O(*n*)

#### Tail recursion

A recursive function is tail recursive when recursive call is the last thing executed by the function.

<img src='https://assets.leetcode.com/uploads/2019/01/26/card_recursion_tail.png'>

Tail recursion + stack = ieteration

Example fibonacci

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

* in order to use tail recursion, the arugments was tweaked
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
function recurrence(n){
    if(n<=1) return 2;
    if(n===2) return 3;
    return 3*f(n-1)+f(n-2)+f(n-3)-4;
}
recurrence(5)
```

```js
function tailRecurrencey(n, r1, r2, r3) {
  if (n <= 1) return r1;
  if (n === 2) return r2;
  return tailRecurrencey(n - 1, r1, r2, r3, 3 * r3 + r2 + r1 - 4);
}
console.log(tailRecurrencey(5,  2, 3, 9));
```



## Use cases

#### Deep copy

```js
   function deepCopy(obj) {
          let newObj = {};
          function copy(obj) {
            Object.keys(obj).forEach((key) => {
              if (typeof obj[key] === 'object') {
                newObj[key] = deepCopy(obj[key]);
                console.log(newObj[key]);
              } else {
                newObj[key] = obj[key];
                return obj;
              }
            });
          }

          copy(obj);
          return newObj;
        }
```

#### Flaten an array

```js
 function flaten(arr) {
        let res = [];
        const recursion = (arr) => {
          if (!arr.length) return;
          for (let i = 0; i < arr.length; i++) {
            if (Object.prototype.toString.call(arr[i]) != '[object Array]') {
              res.push(arr[i]);
            } else {
              recursion(...arr.slice(i, arr.length + 1));
            }
          }
        };
        recursion(arr);
        return res;
      }

```

#### Curring

```js
   function currying(fn, length) {
        length = length || fn.length;
        return function (...args) {
          return args.length >= length
            ? fn.apply(this, args)
            : currying(fn.bind(this, ...args), length - args.length);
            //👆pass the updated fn aftering bind the current args and the updated length needed for completing the curry
        };
      }
```



## Leetcode 

#### [344] Reverse String

````js
var reverseString = function (s) {
  if (s.length <= 0) return;
  let cur = s.pop();
  reverseString(s);
  s.unshift(cur);
};
````

#### [118] Pascal's triangle

the argument of generate function was the row num.

a inner function to do the recursion was needed. It takes the previous line and returns the next line.

The recurrence relation is `cur[i+1] = pre[i]+pre[i+1]`

```js
var generate = function (numRows) {
  let res = [];
  if (numRows === 0) return res; 
  res.push([1]); //init the triangle
  const recursion = (lastarr) => {
       //the exist point: when the length is greater than row nums, do nothing, pop out the execution context
    if (lastarr.length < numRows) {
      let arr = [1];
      for (let i = 0; i < lastarr.length - 1; i++) {
          //recurrence relation:
        arr[i + 1] = lastarr[i] + lastarr[i + 1];
      }
        //init the arr
      arr.push(1);
        //push the single line to the result
      res.push(arr);
        //start the next round by passing cur array to get next line
      recursion(arr);
    }
  };
  recursion([1]); //start the recursion, pass the previous array 
  return res;
};
```

#### [119] Pascal's triangle II

change in-place

* copy to next line, insert a '0' at the front, push all the number to right
* update in-place : the updated value equals the original value + the next value;
* loop and updat the whole line

only two previous element are needed

```js
var getRow = function (rowIndex) {
  if (rowIndex === 0) return [1];
  let list = [1];
  for (let i = 0; i < rowIndex; i++) {
    list.unshift(0);
    for (let j = 0; j < i + 1; j++) {
      list[j] = list[j] + list[j + 1];
    }
  }
  return list;
};
```

#### [206] Reverse linked list

the function takes the curent node and returns the new head;

the recursion is done by keeping pass the next node of current one. 

Each time the opeariton on nodes was the same: next.next = cur, cur.next = null.

The cur and next were updated in every call stack.

```js
var reverseList = function (head) {
  if (!head || !head.next) return head; //return the last node of the original list
  let cur = head,
    next = head.next;
  let reversedHead = reverseList(cur.next); //recieve the original last node, assign to the new head
  next.next = cur;
  cur.next = null;
  return reversedHead; //return the new head
};
```

#### [70] Climb Stairs

```js
var climbStairs = function(n) {
 const dp = [0, 1, 2];
  for (let i = 3; i <= n; i++) {
    dp[i] = dp[i - 1] + dp[i - 2];
  }
  return dp[n];
};
```

#### [104] Max depth of binary tree

```js
var maxDepth = function(root) {
 if(!root) {
        return 0;
    } else {
        const left = maxDepth(root.left);
        const right = maxDepth(root.right);
        return Math.max(left, right) + 1;
    }
};
```

#### [21] Merge two ordered linked list

```js
function mergeTwoLists(l1, l2) {
  //always compare two node
  if (l1 === null) {
    //if it reaches the end return the other node
    return l2;
  }
  if (l2 === null) {
    return l1;
  }
  if (l1.val <= l2.val) {
    l1.next = mergeTwoLists(l1.next, l2); //let the next head point to the next result
    //pass the new head l1.next
    return l1; //return the smaller one
  } else {
    l2.next = mergeTwoLists(l2.next, l1); //pass the new head l2.next
    return l2;
  }
}
```

#### [779] The kth Grammar

```js
var kthGrammar = function (N, K) {
  if (N === 1) return 0;
  if (K % 2) return kthGrammar(N - 1, Math.floor(K / 2) + 1);
  return kthGrammar(N - 1, K / 2) === 1 ? 0 : 1;
};
```

## Other sources

#### [Hanota LCCI](https://leetcode-cn.com/problems/hanota-lcci/)

the key of handling recursion is try to find the repeating relation but never dive into the details of each recursion.

split the main task. only care about the single step

```js
var hanota = function (A, B, C) {
        const move = (n, from, buffer, to) => {
          // the 'parent task' move n-layer tower
          if (n === 1) {
            to.push(from.pop());
          } else {
              //split into 'child task' of moving n-1 & 1 layer tower
            //console.log(A, B, C);
            move(n - 1, from, to, buffer);
            //console.log(A, B, C);
            move(1, from, buffer, to);
            //console.log(A, B, C);
            move(n - 1, buffer, from, to);
            //console.log(A, B, C);
          }
        };
        move(A.length, A, B, C);
      };
```

#### Cell spliting

![img](https://mmbiz.qpic.cn/mmbiz_png/OyweysCSeLWvDS0Xny7l5kj0Nj4znUDibK3VJALJuo8IxWjDvPuAWxvO5dbBaLn01GcDnIqiaKXbSWRvwmyEM1uQ/640?wx_fmt=png&wxfrom=5&wx_lazy=1&wx_co=1)

```js
function allCell(n){
    //define 3 function to determine amount of each state
    //the final result would be the sum
    // cells at a state 
    let aCell = function(n){
        if(n==1){
            return 1;
        }else{
            return aCell(n-1)+bCell(n-1)+cCell(n-1);
        }
    }
    // cells at b state
    let bCell = function(n){
        if(n==1){
            return 0;
        }else{
            return aCell(n-1);
        }
    }
    // cells at c state
    let cCell = function(n){
        if(n==1||n==2){
            return 0;
        }else{
            return bCell(n-1);
        }
    }
    return aCell(n)+bCell(n)+cCell(n)
}

```



