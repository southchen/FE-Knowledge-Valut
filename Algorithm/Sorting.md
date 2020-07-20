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

<img src="https://mmbiz.qpic.cn/mmbiz_png/rSmDLkNsngSW854Q3xq3SbOQ1UtURzYVzEQSvXiapUbccLHiblO05vHiaQ7GzbRYjafwJTrfPicOwWCyXPqPw1rhrA/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1" alt="partialsorted" style="zoom:60%;" />

After first round of loop, the array was : [2,1,`4,5,6,8`]

<img src="https://mmbiz.qpic.cn/mmbiz_png/rSmDLkNsngSW854Q3xq3SbOQ1UtURzYVQd4hQoDmrTTPJU7Jo0Qea8bJX2gwIYojj82B1RGmIR8ic8MAib2SLovQ/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1" alt="lastswappedindex" style="zoom: 50%;" />

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



## Insertion

Time Complexity: O(n^2)

Space Complexity: O(1)

Stable

![insertion](https://www.2cto.com/uploadfile/Collfiles/20180616/20180616142937108.png)

`挡板法`

```js
function insertion(arr) {
  let temp;
  for (let i = 1; i < arr.length; i++) {
    temp = arr[i];
    let j = i - 1;
     //shifting
    while (j >= 0 && temp < arr[j]) {
      arr[j + 1] = arr[j]; //后移操作逻辑：j+1的元素被j元素覆盖，直到不应该移动的时候退出循环
      j--;
    }
     //insert
    arr[j + 1] = temp; //退出循环的两种情况：1.j==-1，即被插入的temp应该为第一个； 2.temp比arr[j]大了。需要把temp放好
  
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
                    //critical: r=m-1
                    right = middle - 1;
                } else {
                    //critical: l=m+1
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



## Quick

Left ➡️ pivot ➡️ right recursively

Complexity: O(nlogn)

unstable

Extra space needed:

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

Using pointer as partition, no extra space needed:

```js
function quickSorting(nums) {
  if (!nums.length) return;
  return quick(nums, 0, nums.length - 1);
}
const quick = (nums, l, r) => {
  if (l >= r) return;
  let random = Math.floor(l + Math.random() * (r - l));
  let pivot = nums[random];
  [nums[random], nums[r]] = [nums[r], nums[random]];
  let i = l;
  j = r - 1;
  while (i <= j) {
    if (nums[i] < pivot) {
      i++;
    } else {
      [nums[i], nums[j]] = [nums[j], nums[i]];
      j--;
    }
  }
  [nums[r], nums[i]] = [nums[i], nums[r]];
    //only nums[i] is at the correct positon
    //sort the left and right part recursively
  quick(nums, l, j);
  quick(nums, i + 1, r);
  return nums;
};
```



## Merge

Time Complexity: O(nlogn)

Space Complexity: O(n)

Stable

<a src='https://southchen.github.io/2020/05/21/Template-for-Divided-Conquer-Algorithm/'>Divided conquer </a>

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

Optimization by replacing slice with splice

```js
    let mid = Math.floor(nums.length/2)
    let left = nums.splice(0,mid)
    let right = nums
```

Using pointer as paritition to merge the array, (update in-place on the old array)

```js
function mergeSort(arr) {
  __mergeSort(arr, 0, arr.length - 1);
  return arr;
}

function __mergeSort(arr, l, r) {
  if (l >= r) return;
  var mid = Math.floor((l + r) / 2);
  __mergeSort(arr, l, mid);
  __mergeSort(arr, mid + 1, r);
  //若左边最大值比右边最小值大，则进行归并操作，否则表示两部分已有序，不需要再进行归并
  if (arr[mid] > arr[mid + 1]) merge(arr, l, mid, r);
}
function merge(arr, l, mid, r) {
  var copy = [];
  for (var m = l; m <= r; m++) {
    copy[m] = arr[m];
  }
  var i = l,
    j = mid + 1,
    k = l;
  while (k <= r) {
    while (i <= mid && j <= r) {
      if (copy[i] <= copy[j]) {
        arr[k] = copy[i];
        i++;
        k++;
      } else {
        arr[k] = copy[j];
        j++;
        k++;
      }
    }
    while (i <= mid) {
      arr[k] = copy[i];
      i++;
      k++;
    }
    while (j <= r) {
      arr[k] = copy[j];
      j++;
      k++;
    }
  }
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

```js
function heapSort(arr) {
  let size = arr.length;

  // 初始化堆，i 从最后一个父节点开始调整，直到节点均调整完毕 
  for (let i = Math.floor(size / 2) - 1; i >= 0; i--) {
    heapify(arr, i, size);
  }
  // 堆排序：先将第一个元素和已拍好元素前一位作交换，再重新调整，直到排序完毕
  for (let i = size - 1; i > 0; i--) {
    swap(arr, 0, i);
    size -= 1;
    heapify(arr, 0, size);
  }

  return arr;
}

function heapify(arr, index, size) {
  let largest = index;
  let left = 2 * index + 1;
  let right = 2 * index + 2;

  if (left < size && arr[left] > arr[largest]) {
    largest = left;
  }
  if (right < size && arr[right] > arr[largest]) {
    largest = right;
  }
  if (largest !== index) {
    swap(arr, index, largest);
    heapify(arr, largest, size);
  }
}
```

## in-place sorting 

* insertion
* selection

## Stability

<img src='https://mmbiz.qpic.cn/mmbiz_png/rSmDLkNsngTPoibiaO4tryNfibHWTWW6FVuPticdfn8lEWe10fvgn78nRyVfmrOTlreSwlYMe8yhWnWATaRRlI60ng/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1' style="zoom: 67%;">

<img src="https://mmbiz.qpic.cn/mmbiz_png/rSmDLkNsngTPoibiaO4tryNfibHWTWW6FVudIjia1oQEUORkJA7jIfD1ibj9IdUB6XjvYdqZwQ4ImialKic9pADVmkNkA/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1" style="zoom:67%;" />



ref:<a src='https://www.rayjune.me/2018/03/22/elegant-javascript-sorting-algorithm-es6/'>优雅的 JavaScript 排序算法（ES6）</a>