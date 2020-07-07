[toc]

# Extended Sorting

## Quick sorting related questions 

Using `pointers` as partition

eg. elements within [ left, i) are smaller than pivot/target, ( j, right ] greater.

The loop starts with empty partition and stops when the pointers are not valid

### LeetCode

### [75. Sort Colors](https://leetcode-cn.com/problems/sort-colors/)

0->red 1-> white 2-> blue

two partition/pointer needed

<img src='https://pic.leetcode-cn.com/5b3d372e0bfb293ca3aac12e90421d7612c9e75b78b579f954c42ebfe74705d4-image.png' alt='Dutch national flag'></img>

```js
var sortColors = function (nums) {
  let i = 0,
    j = nums.length - 1,
    cur = 0;
   //0->1->2 
    //[left,i) ->0, [i,j)->1, [j,cur)->unsorted, (j,right]->2
    //i always points to the first 1;
    //j always points to the last 1;
  while (cur <= j) {
    if (nums[cur] === 0) {
      [nums[i], nums[cur]] = [nums[cur], nums[i]];
      i++;
      cur++;
    } else if (nums[cur] === 2) {
      [nums[j], nums[cur]] = [nums[cur], nums[j]];
      j--;
    } else {
      cur++;
    }
  }
};
```



### [215. Kth Largest Element in an Array](https://leetcode-cn.com/problems/kth-largest-element-in-an-array/)

No need to complete the sorting on the whole array. (Array.length = N)

For quick sorting, the pivot after each loop is always at the correctly sorted positon.

When the index of pivot after a single loop equals to N-K, return the pivot; (from small to big)

if the index of pivot is smaller than N-K it means the K is in the 

```js
var findKthLargest = function (nums, k) {
  var left = 0;
  var right = nums.length - 1;
  return quickSelect(nums, left, right, k);
};

function quickSelect(nums, left, right, k) {
  if (nums.length <= 1) return nums[0];
    //randomlize the pivot
  let random = Math.floor(Math.random() * (right - left + 1) + left);
  let pivot = nums[random];
  [nums[random], nums[right]] = [nums[right], nums[random]];
  //one possible partition [left,i) samller; (i,j) (j,right] greater;
  let j = left,
    i = left;
    //i always points to the first element that is greater than pivot
    //j always points to the current element, when it reaches the tail, exit the loop
  while (j < right) {
    if (nums[j] <= pivot) {
      [nums[j], nums[i]] = [nums[i], nums[j]];
      i++;
      j++;
    } else {
      j++;
    }
  }
    //after finishing the loop, the j equals to right, i refers to the correctly sorted positon where belongs to pivot
  [nums[j], nums[i]] = [nums[i], nums[j]];
    //if the sorted index equals to N-K it's the anser
  if (i === right + 1 - k) return nums[i];
    //if it is smaller, the target is on the right
  if (i < right + 1 - k) {
    return quickSelect(nums, i + 1, right, k);
  } else {
    return quickSelect(nums, left, i - 1, k - right + i - 1);
  }
}
```

#### [88. Merge Sorted Array](https://leetcode-cn.com/problems/merge-sorted-array/)

Three pointers:

P1 to the end of the sorted nums1, p2 points to the end of nums2, the p points to the end of the new array;

```js
var merge = function (nums1, m, nums2, n) {
  let p = m + n - 1;
  let p1 = m - 1;
  let p2 = n - 1;
   
  while (p2 >= 0 && p1 >= 0) {
      //always put the bigger one to the end of the new array
    if (nums2[p2] >= nums1[p1]) {
      nums1[p] = nums2[p2];
      p2--;
    } else {
      nums1[p] = nums1[p1];
      p1--;
    }
    p--;
  }
    //when p1 reaches zero, it means all the left elements in nums2 are greater
  while (p2 >= 0) {
    nums1[p] = nums2[p2];
    p2--;
    p--;
  }
    //when p2 reaches zero, the merge is completed
  return nums1;
};
```

