# Divided Conquer

Template:

* 1.base case

* 2.split to smaller sacle 

  (directly slice from the array otherwise maintain the index, and dynamically updated every call)

* 3.recursion

* 4.combination 

  (define the combination function and pass the returned value from recursion as parameter)

## 🌟 Search the max&min value

```js
  function searchMaxMin(arr) {
      //the base case
        if (arr.length <= 2) {
          return [Math.max(...arr), Math.min(...arr)];
        }
      //split
        var mid = arr.length / 2 - 1;
        let left = arr.slice(0, mid + 1);
        let right = arr.slice(mid + 1, arr.length);
      //recursion
        var sortedLeft = searchMaxMin(left);
        var sortedRight = searchMaxMin(right);
//combination function
         const combine = (left, right) => {
          var result = [];
          result[0] = left[0] > right[0] ? left[0] : right[0];
          result[1] = left[1] > right[1] ? right[1] : left[1];
          return result;
        };
//combine the returned value
        return combine(sortedLeft, sortedRight);
      }
searchMaxMin([11,2,34,0,55,11])
```



## 🌟🌟 Merge Sorting

```js
const mergeSort=arr=>{
    //the edge case
    if(arr.length<2) return arr;
     //split into smaller pieces
    let mid=Math.floor(arr.length/2);
    let left=arr.slice(0,mid),right=arr.slice(mid);
   //recursion
    let sortedLeft = mergeSort(left),sortedRight=(mergeSort(right));
    //combination function
    const merge=(left,right)=>{
    let res=[];
    while(left.length&&right.length){
        if(left[0]<=right[0]){
            res.push(left.shift());
        }else{
            res.push(right.shift());
        }
    }
    while(left.length){
        res.push(left.shift());
    }
    while(right.length){
        res.push(right.shift());
    }
    return res;
};
    //combine the returned value
    return merge(sortedLeft,sortedRight);
};
mergeSort([3, 1, 5, 0, 2]);
```

The call-stack would run in this sequence:

```js
merge(mergesort(3,1),mergersort(5,0,2))
merge(mergesort(3),mergersort(1))
merge(left-3,right-1)
merge(mergesort(5),mergersort(0,2))
merge(mergesort(0),mergersort(2))
merge(left-0,right-2)
merge(left-5,right-0,2)
merge(left-1,3,right-0,2,5)
```



## 🌟🌟 Quick Sorting

```js
function quick(nums) {
    //the base case
        if (nums.length <= 1) return nums;
    
        let mid = Math.floor(nums.length / 2);
        let pivot = nums.splice(mid, 1);
        let left = [],
          right = [];
    //break into two smaller array;
        for (num of nums) {
          if (num < pivot) left.push(num);
          if (num >= pivot) right.push(num);
        }
    //recursively pass the smaller sacle
    let sortedLeft =quick(left); 
    let sortedRight = quick(right);
    //combine the returned result
   return [...sortedLeft, ...pivot, ...sortedRight]; 
      }
```



## 🌟🌟 [169. Majority Element](https://leetcode-cn.com/problems/majority-element/)

Version 1:

```js
const majorityElement = (nums) => {
  //base case

  if (nums.length <= 1) return nums[0];
  //split
  let mid = nums.length / 2;
  let left = nums.slice(0, mid);
  let right = nums.slice(mid, nums.length);

  //recursion
  let majLeft = majorityElement(left);
  let majRight = majorityElement(right);

  if (majLeft === majRight) return majLeft;

  //combination
  const combine = (majLeft, majRight) => {
    let countLeft = 0,
      countRight = 0;
    for (let i = 0; i < nums.length; i++) {
      if (nums[i] === majLeft) {
        countLeft++;
      } else if (nums[i] === majRight) {
        countRight++;
      }
    }
    return countLeft > countRight ? majLeft : majRight;
  };

  return combine(majLeft, majRight);
};
```

Version 2:

```js
const majorityElement=nums=>{
    //combination function
    const count=(arr,num,left,right)=>{
        let count=0;
        for(let i=left;i<=right;i++){
            if(arr[i]===num){
                count++;
            }
        }
        return count;
    };
    
    const conquer=(arr,left,right)=>{
        //
        if(left===right){
            return arr[left];
        }
        //split and recursion
        let mid=Math.floor((left+right)/2);
        let leftRes=conquer(arr,left,mid);
        let rightRes=conquer(arr,mid+1,right);
        if(leftRes===rightRes){
            return leftRes;
        } 
        return (count(arr,leftRes,left,right)>count(arr,rightRes,left,right)?leftRes:rightRes);
    };
    
    return conquer(nums,0,nums.length-1);
};
```

## [53. Maximum Subarray](https://leetcode-cn.com/problems/maximum-subarray/)

**`DC is not the best solution, but it works`**

<img src="https://pic.leetcode-cn.com/3aa2128a7ddcf1123454a6e5364792490c5edff62674f3cfd9c81cb7b5e8e522-file_1576478143567" alt="img" style="zoom:67%;" />

```js
var maxSubArray = function (nums) {
  //base case
  if (nums.length == 1) return nums[0];
  //split
  const mid = Math.floor(nums.length / 2);
  const left = nums.slice(0, mid);
  const right = nums.slice(mid, nums.length);
  //rec
  //console.log(left);
  return combine(maxSubArray(left), maxSubArray(right));
  //combination fun ⚠️⚠️⚠️this is the hardest part
  function combine(lSum, rSum) {
    let leftMax = -Number.MAX_SAFE_INTEGER;
    let rightMax = -Number.MAX_SAFE_INTEGER;
    let ltorSum = 0,
      rtolSum = 0;
    for (let i = left.length - 1; i >= 0; i--) {
      ltorSum += left[i];

      leftMax = Math.max(leftMax, ltorSum);
    }
    for (let j = 0; j < right.length; j++) {
      rtolSum += right[j];
      rightMax = Math.max(rightMax, rtolSum);
    }
    let crossSum = leftMax + rightMax;
    return Math.max(crossSum, lSum, rSum);
  }
};
```

## [215. Kth Largest Element in an Array](https://leetcode-cn.com/problems/kth-largest-element-in-an-array/)

![image.png](https://pic.leetcode-cn.com/1c1fe2ba0c651a7916a77114d58478fd5f52a7fc9b4bf554101f0b3c1047a8c0-image.png)

Similar as quick sort.

A pivot is chosen, and 'shuffle' the array into two side: left side is smaller than pivot and right side is bigger.

Check if the index of the pivot is greater than K, if yes, meaning the number we're looking for is in the lefter part; otherwise in the right part. Recursivly look through the half part of the array untile the index of pivot is equal to K.

```js
var findKthLargest = function (nums, k) {
  var left = 0;
  var right = nums.length - 1;
  return quickSelect(nums, left, right, k);
};

function quickSelect(nums, left, right, k) {
    //base case
  if (nums.length <= 1) return nums[0];
    //randomnize the pivot, to aviod the pivot was constantly assign to the max/min number of array
  let random = Math.floor(Math.random() * (right - left + 1) + left);
  let pivot = nums[random];
  [nums[random], nums[right]] = [nums[right], nums[random]];
    //use two pointer similar as leetcode[75]
  let j = left,
    i = left;
  while (j < right) {
    if (nums[j] <= pivot) {
      [nums[j], nums[i]] = [nums[i], nums[j]];
      i++;
      j++;
    } else {
      j++;
    }
  }
  [nums[j], nums[i]] = [nums[i], nums[j]];
    //campare the i with the N-k
  if (i === right + 1 - k) return nums[i];
  if (i < right + 1 - k) {
    return quickSelect(nums, i + 1, right, k);
  } else {
    return quickSelect(nums, left, i - 1, k - right + i - 1);
  }
}
```

## [932. Beautiful Array](https://leetcode-cn.com/problems/beautiful-array/)

For some fixed N, an array A is beautiful if it is a permutation of the integers 1, 2, ..., N, such that:

For every i < j, there is no k with i < k < j such that A[k] * 2 = A[i] + A[j].

Given N, return any beautiful array A.  (It is guaranteed that one exists.)

> Example 1:
> Input: 4
> Output: [2,1,4,3]
> Example 2:
> Input: 5
> Output: [3,1,2,5,4]

The key points is detecting the pattern of the A[k] * 2 = A[i] + A[j]. This suggest that A[i] and A[j] are not odds/even at the same time.

```js
var beautifulArray = function (N) {
  //base, fill the array with 1
  if (N <= 1) return [1];
  //init
  let mid = N % 2 === 0 ? N / 2 : Math.floor(N / 2) + 1;
  //recursion
  let left = beautifulArray(mid);
  let right = beautifulArray(N - mid);
  //combination
  const merge = (left, right) => {
    for (let i = 0; i < left.length; i++) {
      left[i] = 2 * left[i];
      left[i] -= 1;
    }
    for (let j = 0; j < right.length; j++) {
      right[j] = 2 * right[j];
    }
    return [...left, ...right];
  };
  return merge(left, right);
};
```

