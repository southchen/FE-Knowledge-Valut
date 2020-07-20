# Binary search

## Template

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
第二种：取左边界

var binary_search(nums, target){
    let left = 0,
        right = nums.length - 1;
    while(left <= right){
        let mid = Math.floor(left + (right - left) / 2);
        if (nums[mid] < target){
            left = mid + 1;
        }else if (nums[mid] > target){
            right = mid - 1;
        }else if (nums[mid] === target){
            // 不返回，锁定左边界
            right = mid - 1;
        }
    }
    // 检查left越界情况
    if (left >= nums.length || nums[left] != target){
        return -1;
    }
    return left;
}
第三种：取右边界

var binary_search(nums, target){
    let left = 0,
        right = nums.length - 1;
    while(left <= right){
        let mid = Math.floor(left + (right - left) / 2);
        if (nums[mid] < target){
            left = mid + 1;
        }else if (nums[mid] > target){
            right = mid - 1;
        }else if (nums[mid] === target){
            // 不返回，锁定右边界
            left = mid + 1;
        }
    }
    // 检查right越界情况
    if (right < 0 || nums[left] != target){
        return -1;
    }
    return right;
}

```

