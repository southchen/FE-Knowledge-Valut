[toc]



# Binary search

## Template

### Find the target element

```js
var binary_search(nums, target){
    let left = 0,
        right = nums.length - 1;
    while(left <= right){
        let mid = Math.floor((left + right) / 2);
        if (nums[mid] < target){
            left = mid + 1;
        }else if (nums[mid] > target){
            right = mid - 1;
        }else if (nums[mid] === target){
            return mid;
        }
    }
    return -1;
}
```

### For duplicate elements, find the left edge:

```js
var binaryLeft = function (nums, target) {
  let left = 0,
    right = nums.length - 1;
  while (left < right) {//[left,right)
    let mid = left + ((right - left) >> 1);
    if (nums[mid] < target) {
      left = mid + 1;
    } else if (nums[mid] > target) {
      right = mid;
    } else if (nums[mid] === target) {
      right = mid;
    }
  }
    //patch
  if (nums[left] != target) {
    return -1;
  }
  return left;
};
```

version2:

```js
var binaryLeft = function (nums, target) {
  let left = 0,
    right = nums.length;
  while (left <= right) {
    let mid = left + ((right - left) >> 1);
    if (nums[mid] < target) {
      left = mid + 1;
    } else if (nums[mid] > target) {
      right = mid - 1;
    } else if (nums[mid] === target) {
      right = mid - 1;
    }
  }
  //patch
  if (nums[left] != target) {
    return -1;
  }
  return left;
};
```

### Find the right edge:

version1: 

```js
var binaryRight = function (nums, target) {
  let left = 0,
    right = nums.length;
  while (left < right) {//[left,right)
    let mid = left + ((right - left) >> 1);
    if (nums[mid] < target) {
      left = mid + 1; //left was updated by mid+1
    } else if (nums[mid] > target) {
      right = mid;
    } else if (nums[mid] === target) {
      left = mid + 1;
    }
  }
    //exist loop, l===r 
    //while l was updated by mid+1
    //check if left exceeds (only hanppens when nums[mid]<target,and mid already reaches the end)
    if (left >= nums.length) return -1;
    //when nums[mid] is the target, minus one
  return left - 1;
};
```

version 2:

```js
var binaryRight = function (nums, target) {
  let left = 0,
    right = nums.length - 1;
  while (left <= right) {// [left,right]
    let mid = left + ((right - left) >> 1);
    if (nums[mid] < target) {
      left = mid + 1;
    } else if (nums[mid] > target) {
      right = mid - 1; //right was updated by mid-1
    } else if (nums[mid] === target) {
      left = mid + 1; 
    }
  }
    //when nums[mid]==target,l=mid+1,and accross right
    //after loop l==right+1
  if (right < 0 || nums[right] != target) return -1;
  return right;
};
```

the condition of nums[mid]===target affects how we dealwith the loop existing point and patch

## Leetcode

#### [69. Sqrt(x)](https://leetcode-cn.com/problems/sqrtx/)

```js
const mySqrt = function (x) {
  if (x < 2) return x;
  let left = 1, right = x >> 1
  while (left <= right) {
    let mid = left + ((right - left) >> 1)
    if (mid * mid === x) return mid;
    if (mid * mid < x) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }
  return right;
};
```

control the loop exist condition, after loop, [....left,right...]

```js
var mySqrt = function (x) {
  if (x < 2) return x
  let left = 1, right = x >> 1
  while (left + 1 < right) {//when exist loop，left is next right
    let mid = left + ((right - left) >> 1)
    if (mid === x / mid) {
      return mid
    } else if (mid < x / mid) {
      left = mid
    } else {
      right = mid
    }
  }
   //result would be either right or left
  return right > x / right ? left : right
};

```

#### [33. Search in Rotated Sorted Array](https://leetcode-cn.com/problems/search-in-rotated-sorted-array/)

```js
var search = function (nums, target) {
  let l = 0,
    r = nums.length - 1;
  while (l <= r) {
    let mid = l + ((r - l) >> 1);
    if (nums[mid] === target) return mid;
    if (nums[l] <= nums[mid]) {
      //left order
      if (nums[mid] < target) {
        l = mid + 1;
          //condition <= !
      } else if (nums[l] <= target) {
        r = mid - 1;
      } else {
        l = mid + 1;
      }
    } else {
      //right order
      if (nums[mid] > target) {
        r = mid - 1;
          //condition >= !
      } else if (nums[r] >= target) {
        l = mid + 1;
      } else {
        r = mid - 1;
      }
    }
  }
  return -1;
};
```



#### [74. Search a 2D Matrix](https://leetcode-cn.com/problems/search-a-2d-matrix/)

注意到输入的 m x n 矩阵可以视为长度为 m x n的有序数组。

<img src='https://pic.leetcode-cn.com/d9b47b40a4de17b0c56446b0a4935a5042490ea1d92a6f4c529c2aaa0095c189-287711dcb87bd4d4681fa117f792d1baaaa7ce3e2c65d6a4f6439c0cbbb0345e-image.png' style="zoom:80%;" />

row = idx // n ， col = idx % n。

```js
var searchMatrix = function(matrix, target) {
    var m = matrix.length;
    if(m == 0)return false;
    var n = matrix[0].length;
    var low = 0;
    var high = m*n - 1;
    while(low<=high){
        var mid = (low+high)>>1;
        var row = parseInt(mid/n);
        var col = mid%n;
        var matrixMid = matrix[row][col];
        if(matrixMid < target){
            low = mid + 1;
        }else if(matrixMid > target){
            high = mid -1;
        }else if(matrixMid == target){
            return true;
        }
    }
    return false;
};

```

#### [153. Find Minimum in Rotated Sorted Array](https://leetcode-cn.com/problems/find-minimum-in-rotated-sorted-array/)

```
对比nums[r]的原因：
1.左 < 中, 中值 < 右值 ：没有旋转，最小值在最左边，可以收缩右边界
        右
     中
 左
2.左 > 中, 中 < 右 ：有旋转，最小值在左半边，可以收缩右边界
 左       
          右
     中
3.左< 中, 中 > 右 ：有旋转，最小值在右半边，可以收缩左边界
     中  
 左 
         右
4.左<中<右。不存在
左
    中  
        右
```

```js
var findMin = function (nums) {
  let l = 0,
    r = nums.length - 1;
  while (l < r) {
    let mid = (r + l) >> 1;
    //compare to right pointer
    if (nums[mid] > nums[r]) {
      l = mid + 1;
    } else {
      r = mid;
    }
  }
  //when exist loop l===r
  //r points to the last element, if nums[r]==target, can be found
  return nums[l];
};
```

#### [33. Search in Rotated Sorted Array](https://leetcode-cn.com/problems/search-in-rotated-sorted-array/)

```js
var search = function (nums, target) {
  let l = 0,
    r = nums.length - 1;
  while (l <= r) {
    let mid = l + ((r - l) >> 1);
    if (nums[mid] === target) return mid;
    if (nums[l] <= nums[mid]) {
      //left order
      if (nums[mid] < target) {
        l = mid + 1;
      } else if (nums[l] <= target) {
        r = mid - 1;
      } else {
        l = mid + 1;
      }
    } else {
      //right order
      if (nums[mid] > target) {
        r = mid - 1;
      } else if (nums[r] >= target) {
        l = mid + 1;
      } else {
        r = mid - 1;
      }
    }
  }
  return -1;
};
```

#### [34. Find First and Last Position of Element in Sorted Array](https://leetcode-cn.com/problems/find-first-and-last-position-of-element-in-sorted-array/)

```js
var searchRange = function (nums, target) {
  let l = 0,
    r = nums.length - 1;
  let resL;
  while (l < r) {
    let mid = l + ((r - l) >> 1);
    if (nums[mid] < target) {
      l = mid + 1;
    } else {
      r = mid;
    }
  }
  resL = r;
  let resR;
  (l = 0), (r = nums.length - 1);
  while (l <= r) {
    mid = l + ((r - l) >> 1);
    if (nums[mid] > target) {
      r = mid - 1;
    } else {
      l = mid + 1;
    }
  }
  resR = r;
  return nums[resR] === target ? [resL, resR] : [-1, -1];
};
```

