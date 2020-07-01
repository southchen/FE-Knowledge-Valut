[TOC]

# Sorting

## Bubble

Time Complexity: O(n^2)

Space Complexity: O(1)

Stable

```js
function bubbleSort(arr){
    var len=arr.length;
    for(var i=len-1;i>0;i--){
        for(var j=0;j<i;j++){
            if(arr[j]>arr[j+1]){
                [arr[j],arr[j+1]]=[arr[j+1],arr[j]]
            }
        }
    }
    return arr;
}
```

### Optimized by double direction sorting:

```js
function dbBubblue(arr) {
  let l = 0,
    r = arr.length;
  while (l < r) {
    for (let i = l + 1; i < r; i++) {
      if (arr[i] < arr[i - 1]) {
        [arr[i], arr[i - 1]] = [arr[i - 1], arr[i]];
      }
    }
    r--;
    for (let i = r - 1; i > l; i--) {
      if (arr[i] > arr[i + 1]) {
        [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
      }
    }
    l++;
  }
  return arr;
}
```

### Further optimization:

When the original array was partial sorted: [4,2,1,` 5,6,8`]

<img src="G:\study\PrepforInterview\640.png" alt="640" style="zoom:60%;" />

After first round of loop, the array was : [2,1,`4,5,6,8`]

<img src="G:\study\PrepforInterview\640 (1).png" alt="640 (1)" style="zoom: 50%;" />

The element after LastSwappedIndex was already sorted.

```js
function bubbleSort(arr){
    var len=arr.length;
    for(var i=len-1;i>0;i--){
        let swappedIndex=arr.length-1;
        for(var j=0;j<swappedIndex;j++){
            if(arr[j]>arr[j+1]){
                [arr[j],arr[j+1]]=[arr[j+1],arr[j]]
                swappedIndex=j;
            }
        }
    }
    return arr;
}
```

### Expanded: a second argument to control the sqeuence

```js
function bubbleSort(arr, compareFunc) {
  if (arr.length < 1) {
    return arr;
  }
  for (let i = 1; i < arr.length; i++) {
    for (let j = 0; j < arr.length - i; j++) {
      if (compareFunc(arr[j], arr[j + 1]) > 0) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
      }
    }
  }
  return arr;
}
bubbleSort(arr, (a, b) => a - b);
```



## Selection

Time Complexity: O(n^2)

Space Complexity: O(1)

Unstable

> Selection sort has the property of minimizing the number of swaps. In applications where the cost of swapping items is high, selection sort very well may be the algorithm of choice.

```js
function selection(arr) {
  for (let j = 0; j < arr.length; j++) {
    let minIndex = -1,
      min = Infinity;
    for (let i = j; i < arr.length; i++) {
      if (arr[i] <= min) {
        min = arr[i];
        minIndex = i;
      } else {
        continue;
      }
    }

    [arr[j], arr[minIndex]] = [arr[minIndex], arr[j]];
  }
  return arr;
}
```



## Insertion

Time Complexity: O(n^2)

Space Complexity: O(1)

Stable

![insertion](https://www.2cto.com/uploadfile/Collfiles/20180616/20180616142937108.png)

```js
 function insert(arr) {
        var len = arr.length;
        var preIndex, current;
        for (var i = 1; i < len; i++) {
          preIndex = i - 1;
          current = arr[i];
          while (preIndex >= 0 && arr[preIndex] > current) {
            arr[preIndex + 1] = arr[preIndex];
            preIndex--;
          }
          arr[preIndex + 1] = current;
        }
        return arr;
      }
```

optimized by bisection when insert the new element into the sorted array:

```js
function binaryInsertionSort(array) {
        for (var i = 1; i < array.length; i++) {
            var key = array[i], left = 0, right = i - 1;
            while (left <= right) {
                var middle = parseInt((left + right) / 2);
                if (key < array[middle]) {
                    right = middle - 1;
                } else {
                    left = middle + 1;
                }
            }
            for (var j = i - 1; j >= left; j--) {
                array[j + 1] = array[j];
            }
            array[left] = key;
        }
        return array;
    } 
}
```

## Quick

Left ➡️ pivot ➡️ right recursively

Complexity: O(nlogn)

```js
  function quick(nums) {
        if (nums.length <= 1) return nums;
        let mid = Math.floor(nums.length / 2);
        let pivot = nums.splice(mid, 1);
        let left = [],
          right = [];
        for (num of nums) {
          if (num < pivot) left.push(num);
          if (num >= pivot) right.push(num);
        }
   return [...quick(left), ...pivot, ...quick(right)]; //recursion
   }
```

## Merge

Time Complexity: O(nlogn)

Space Complexity: O(n)

Stable

![merge](https://user-gold-cdn.xitu.io/2019/7/23/16c1f400a4920693?imageslim)

```js
function mergeSorting(nums){
    if(nums.length<2) return nums;
    let mid = Math.floor(nums.length/2)
    let left = nums.slice(0,mid)
    let right = nums.slice(mid);
    function merge(left,right){
        let res=[];
        while(left.legth&&right.length){
            if(left[0]<=right[0]){
            res.push(left.shift())
        }else{
            res.push(right.shift())
        }
              }
           while(left.length){
        res.push(left.shift());
    }
    while(right.length){
        res.push(right.shift());
    }
        return res;
    }
    merge(mergeSorting(left),mergeSorting(right))
}
```

Optimization:

```js
function mergeSorting(nums){
    if(nums.length<2) return nums;
    let mid = Math.floor(nums.length/2)
    let left = nums.splice(0,mid)
    let right = nums
    function merge(left,right){
        let res=[];
        while(left.legth&&right.length){
            if(left[0]<=right[0]){
            res.push(left.shift())
        }else{
            res.push(right.shift())
        }
              }
           while(left.length){
        res.push(left.shift());
    }
    while(right.length){
        res.push(right.shift());
    }
        return res;
    }
    merge(mergeSorting(left),mergeSorting(right))
}
```



## Selection

No extra memory sapce;

TimeComplexity: O(n2) double loop

```js
 function selectionSort(arr){
   var len=arr.length;
   var i,j,min;
   for(i=0;i<len-1;i++){
       min=i;   //将当前值设为最小值
    for(j=i+1;j<len;j++){
      if(arr[j]<arr[min]){
         	min=j;  //在后面找到更小的值
      		 }
		[arr[i],arr[min]]= [arr[min],arr[i]]
	}
	return arr;
}
```

### Shell

An optimization of insertion for moving more than 1 positon

```js
function shellSort(arr) {
  const len = arr.length;
  let gap = Math.floor(len / 2);

  while (gap > 0) {
    // 注意下面这段 for 循环和插入排序极为相似
    for (let i = gap; i < len; i++) {
      const temp = arr[i];
      let preIndex = i - gap;

      while (arr[preIndex] > temp) {
        arr[preIndex + gap] = arr[preIndex];
        preIndex -= gap;
      }
      arr[preIndex + gap] = temp;
    }
    gap = Math.floor(gap / 2);
  }

  return arr;
}
```

### Heap

an optimization for insertion. Using heap to store

Time Complexity: O(nlogn)

Space Complexity: O()

```

```





ref:<a src='https://www.rayjune.me/2018/03/22/elegant-javascript-sorting-algorithm-es6/'>优雅的 JavaScript 排序算法（ES6）</a>