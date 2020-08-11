<<<<<<< HEAD
[TOC]

# Sorting

## Bubble

### Time Complexity: O(n^2)

​ 最坏：数组逆序

​ i 取值范围 0~n-2;

​ i 为 0，j 的取值范围是从 0 到 n -1，内循环执行 n - 1 次; i 为 1 ，j 的取值范围是从 0 到 n -2，内循环执行 n - 2 次；j 为 n-2，j 取值为 1 ，内循环一次

​ 1 + 2 + 3 + ... + (n - 2) + (n - 1) ==> n\*(n-1)/2==>O(n^2)

### Space Complexity: O(1)

### Stable

### Template

数组中有 `n` 个数，比较每相邻两个数，如果前者大于后者，就把两个数交换位置；

每一轮就可以选出一个当前最大的数放在最后面；经过 `length - 1` 轮，就完成了所有数的排序。

外层循环：循环的次数

内层循环：两两比较的索引

```js
function bubble(nums) {
  let len = nums.length;
  for (let i = 0; i < len - 1; i++) {
    //len-1轮，i相当于是已经排好序的元素个数，len-i为已排好元素和未排号的边界，“挡板”
    for (let j = 1; j < len - i; j++) {
      //从第二个与前一个开始比，比到未排序的最后
      if (nums[j] < nums[j - 1]) {
        //没有等于，保持稳定
        [nums[j], nums[j - 1]] = [nums[j - 1], nums[j]];
      }
    }
  }
  return nums;
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

用 LastSwappedIndex 确定出已经有序部分和无序部分的边界，更新”挡板“索引

```js
function bubbleOpt(arr) {
  let nums = [...arr];
  let len = nums.length;
  let border = len - 1; //初始化为最后一个元素
  for (let i = 0; i < len - 1; i++) {
    let last = len - i; //初始化为最后一个有序
    for (let j = 1; j < border; j++) {
      //j<border，开区间取不到，last=>j而不是j-1
      if (nums[j] < nums[j - 1]) {
        [nums[j], nums[j - 1]] = [nums[j - 1], nums[j]];
        last = j; //交换过，就更新last
      }
    }
    border = last; //内层循环结束后，更新挡板位置
  }
  return nums;
}
```

### Expanded: a second argument to control the sequence

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

### Time Complexity: O(n^2)

如果数组是近乎倒序的，每次插入都要在数组的第一个位置插入，那么已排序区间内的所有的元素都要往后移动一位，这一步平均是 O(n)，那么重复 n 次就是 O(n^2).

### Space Complexity: O(1)

**sorted in place**，原地排序。

### Stable

<img src="https://www.2cto.com/uploadfile/Collfiles/20180616/20180616142937108.png" alt="insertion" style="zoom:67%;" />

`挡板法` :挡板左边：已排序;右边：未排序

1. 最初挡板是在数组的最左边，假设已排号一个数；
2. **核心思想**就是：
   依次遍历**未排序区间**里的元素，在已排序区间里找到正确的位置插入；
3. 重复这个过程，直到未排序区间为空。

外循环 i，指向第一个未排好序的元素；

内循环 j，指向未排好序的前一个，从后向前遍历排好序的区域，把 temp 放入正确的位置。

通过前一个数覆盖后一个数，来后移数组，最后用 temp 覆盖正确位置的值。

```js
function insertion(arr) {
  let temp;
  for (let i = 1; i < arr.length; i++) {
    temp = arr[i];
    let j = i - 1;
    //shifting
    while (j >= 0 && temp < arr[j]) {
      //没有temp== arr[j]，保持稳定性
      arr[j + 1] = arr[j]; //后移操作逻辑：j+1的元素被j元素覆盖，直到不应该移动的时候退出循环
      j--;
    }
    //insert
    arr[j + 1] = temp; //退出循环的两种情况：1.j==-1，即被插入的temp应该为第一个； 2.temp比arr[j]大了。需要把temp放好
  }
  return arr;
}
```

optimized by binary-search when insert the new element into the sorted array:

```js
function binaryInsertionSort(array) {
  for (var i = 1; i < array.length; i++) {
    var temp = array[i],
      left = 0,
      right = i - 1;
    //找第一个比temp大的数，前一个即为正确的位置
    while (left <= right) {
      var middle = (left + right) >> 1;
      if (temp < array[middle]) {
        right = middle - 1;
      } else {
        //temp>=arr[m]
        left = middle + 1;
      }
    }
    //只需移动该位置之后的元素（包括左边界）
    for (var j = i - 1; j >= left; j--) {
      array[j + 1] = array[j];
    }
    array[left] = temp;
  }
  return array;
}
```

## Selection

### Time Complexity: O(n^2)

外循环 i 为 0 时，内循环 n-1 次；i 为 1 时，内循环 n-2 次；...外循环 i 为 length-2 时，内循环 1 次；

1+2+3...(n-1)==>O(n^2)

### Space Complexity: O(1)

swap 中需要空间，常数

### Unstable

> Selection sort has the property of minimizing the number of swaps. In applications where the cost of swapping items is high, selection sort very well may be the algorithm of choice.

交换位置时，只考虑当前值和当前的最小值，不能考虑到如果当前值重复了，相对顺序无法维持。

要想每一次将最小元素放置在其位置而不进行交换，可以通过将每一次选择出的最小关键字前面的无序数组元素都向后移动一个位置，使选择排序稳定。简单来说，就是利用类似于插入排序的技术将最小的元素插入正确的位置。

### Template

选择排序也是利用了“**挡板法**”这个经典思想。

挡板左边是已排序区间，右边是未排序区间，那么每次的“选择”是去找右边未排序区间的**最小值**，找到之后和挡板后面的第一个值换一下，然后再把挡板往右移动一位，保证排好序的这些元素在挡板的左边。

注意与插入排序的不同：

- 外层循环从 0 开始，因为没有已排好序的元素；

- 初始最小值索引即为外循环当前值，因为有可能当前值即为最小值。

```js
function select(nums) {
  for (let i = 0; i < nums.length - 1; i++) {
    //每次循环完，挡板右移
    let minInd = i;
    for (var j = i + 1; j < nums.length; j++) {
      if (nums[minInd] > nums[j]) {
        minInd = j; //更新最小值位置
      }
    }
    //最小的和挡板右边第一个交换
    [nums[minInd], nums[i]] = [nums[i], nums[minInd]];
  }
  return nums;
}
```

## Quick

分治算法

Left ➡️ pivot ➡️ right recursively

快速排序首先选一个基准 pivot，然后将数组按照选取的基准 pivot 进行划分。

每一趟划分，我们就可以将作为 pivot 的值 x 放到排序数组的正确位置，并且将所有比 x 小的放到 x 的左边，所有比 x 大的元素放到 x 的右边。

之后递归地执行 quick，分别传入 x 左边的数组，x 右边数组

### Time Complexity: O(nlogn)

分析递归树，随机选择 pivot

<img src="https://mmbiz.qpic.cn/mmbiz_png/og5r7PHGHojj6Bibeq2zyOfoVutxZYglou623yhg7QhMu97XCPXQ8xASIRRrmys3qXfEEWwtSOWZrLcicBf9TuDg/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1" style="zoom:67%;" />

- 每次循环的耗时主要就在这个 while 循环里，也就是 O(right - left)；
- 均分的话那就是 logn 层；
- 所以总的时间是 O(nlogn).

最坏情况，每次 pivot 选择为最大值/最小

<img src="https://mmbiz.qpic.cn/mmbiz_png/og5r7PHGHojj6Bibeq2zyOfoVutxZYgloue06BFpovFicUDcBPAb4xZaMibxjR14oRybcwialdIeiblIlqiciavL3mxyg/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1" style="zoom:50%;" />

O(n^2)

平均时间复杂度是 O(nlogn)

### Space Complexity: O(nlogn)

- 递归树的高度是 logn，
- 每层的空间复杂度是 O(1)，
- 所以总共的空间复杂度是 O(logn)

最坏情况：

这棵递归树的高度就变成了 O(n).

### Unstable

交换时无法考虑到有重复值的情况，不稳定

#### Extra space needed:

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

#### Using pointer as partition, no extra space needed:

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
    //用挡板法思路解决将pivot放入正确位置的问题
    //i左边为小于pivot，j右边为大于pivot
  //i从left边界开始，r从right前一位（因为此时right为pivot）
   let i = l，j = r - 1;
    //退出条件，未排序部分为0
  while (i <= j) {
      //i小，正确，挡板移动
    if (nums[i] < pivot) {
      i++;
    } else {
        //i大了，i与j互换，放到后面
      [nums[i], nums[j]] = [nums[j], nums[i]];
      j--;
    }
  }
    //i位置上为第一个大于pivot的值，将pivot与i元素呼唤，则pivot在则正确位置
  [nums[r], nums[i]] = [nums[i], nums[r]];
    //only nums[i] is at the correct positon
    //sort the left and right part recursively
  quick(nums, l, j);
  quick(nums, i + 1, r);
  return nums;
};
```

## Merge

### Time Complexity: O(nlogn)

### Space Complexity: O(n)

### Stable

<a src='https://southchen.github.io/2020/05/21/Template-for-Divided-Conquer-Algorithm/'>Divided conquer </a>

「分」：大问题分解成小问题；

「治」：用同样的方法解决小问题；

「合」：用小问题的解构造大问题的解。

<img src="https://mmbiz.qpic.cn/mmbiz_png/rSmDLkNsngTcufcibyRlPInB4bwk63sOWfwEvSURiaGlwlqFuRT5Szj8ibic4ibgLGOkER2nuYlXkFVQpzNynVojyZw/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1" alt="merge" style="zoom:50%;" />

```js
function mergeSorting(nums) {
  if (nums.length < 2) return nums;
  let mid = Math.floor(nums.length / 2);
  let left = nums.slice(0, mid);
  let right = nums.slice(mid);
  function merge(left, right) {
    let res = [];
    while (left.legth && right.length) {
      if (left[0] <= right[0]) {
        res.push(left.shift());
      } else {
        res.push(right.shift());
      }
    }
    while (left.length) {
      res.push(left.shift());
    }
    while (right.length) {
      res.push(right.shift());
    }
    return res;
  }
  merge(mergeSorting(left), mergeSorting(right));
}
```

Optimization by replacing slice with splice

```js
let mid = Math.floor(nums.length / 2);
let left = nums.splice(0, mid);
let right = nums;
```

Using pointer as partition to merge the array, (update in-place on the old array)

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

在归并排序中，数组总被划分为两半；而快速排序，数组可能被划分为任意比例，而不是强制要求将数组划分为相等的两部分。

快速排序最坏情况下的时间复杂度为 O(n^2); 归并排序，最坏情况和平均情况下的时间复杂度均为 O(nlogn) 。

归并排序适用于任何类型的数据集，不受数据集大小限制；快速排序不适用于大规模数据集。

归并排序需要额外的存储空间 O(n)，不是一个原地排序算法；而快速排序不需要额外的空间，空间复杂度为 O(1)，为原地排序算法。

归并排序在大规模的数据集上比快速排序更加高效，而快速排序在小规模的数据集上更高效。

快速排序:内排序，所有的数据都存储在主存当中；而归并排序:外排序，待排序的数据无法容纳在主存中，需要额外的存储空间进行辅助合并。

归并排序:稳定;快速排序:不稳定，但是可能通过调整代码让其变得稳定。

快速排序更适用于数组排序，而归并排序两者皆适合。

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

- insertion
- selection

## Stability

<img src='https://mmbiz.qpic.cn/mmbiz_png/rSmDLkNsngTPoibiaO4tryNfibHWTWW6FVuPticdfn8lEWe10fvgn78nRyVfmrOTlreSwlYMe8yhWnWATaRRlI60ng/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1' style="zoom: 67%;">

<img src="https://mmbiz.qpic.cn/mmbiz_png/rSmDLkNsngTPoibiaO4tryNfibHWTWW6FVudIjia1oQEUORkJA7jIfD1ibj9IdUB6XjvYdqZwQ4ImialKic9pADVmkNkA/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1" style="zoom:67%;" />

ref:<a src='https://www.rayjune.me/2018/03/22/elegant-javascript-sorting-algorithm-es6/'>优雅的 JavaScript 排序算法（ES6）</a>
