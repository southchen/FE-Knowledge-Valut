# Extended Sorting

## Quick sorting related questions

### [75. Sort Colors](https://leetcode-cn.com/problems/sort-colors/)

Partition:

<img src='https://pic.leetcode-cn.com/5b3d372e0bfb293ca3aac12e90421d7612c9e75b78b579f954c42ebfe74705d4-image.png' alt='Dutch national flag'></img>

```js
var sortColors = function (nums) {
  let i = 0,
    j = nums.length - 1,
    cur = 0;
  while (i <= j) {
    if (nums[i] === 0) {
      [nums[i], nums[cur]] = [nums[cur], nums[i]];
      i++;
      cur++;
    } else if (nums[i] === 2) {
      [nums[j], nums[i]] = [nums[i], nums[j]];
      j--;
    } else {
      i++;
    }
  }
};
```



### [215. Kth Largest Element in an Array](https://leetcode-cn.com/problems/kth-largest-element-in-an-array/)

No need to complete the sorting on the whole array. 

When the index of pivot after a single loop equals to N-K, return the pivot; 

if the index of pivot is smaller than N-K it means the K is in the 

```js
var findKthLargest = function (nums, k) {
  var left = 0;
  var right = nums.length - 1;
  return quickSelect(nums, left, right, k);
};

function quickSelect(nums, left, right, k) {
  if (nums.length <= 1) return nums[0];
  let random = Math.floor(Math.random() * (right - left + 1) + left);
  let pivot = nums[random];
  [nums[random], nums[right]] = [nums[right], nums[random]];
  
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
  if (i === right + 1 - k) return nums[i];
  if (i < right + 1 - k) {
    return quickSelect(nums, i + 1, right, k);
  } else {
    return quickSelect(nums, left, i - 1, k - right + i - 1);
  }
}
```

