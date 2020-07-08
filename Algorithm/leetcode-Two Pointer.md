# leetcode: Two Pointer

### 3 [Longest Substring Without Repeating Characters](https://leetcode-cn.com/problems/longest-substring-without-repeating-characters/)

Given a string, find the length of the longest substring without repeating characters.

> Example 1:
> Input: "abcabcbb"
> Output: 3 

> Example 2:
> Input: "bbbbb"
> Output: 1
> Explanation: The answer is "b", with the length of 1.

**Slide window && two pointers**

<img src="https://pic.leetcode-cn.com/202ea5bd4d4ba4a21afafdf52a9ea2556ba6265c1576840f09ace50aafab095c.png" alt="003" style="zoom:80%;" />

a pointer go through the string, when the pointed element is already in the array container, then remove the element and all the element before it. when the pointed element is new char, push into the arr. The variable max always equals the biggest value of the array length.

Using an array to maintain the window

```js
var lengthOfLongestSubstring = function(s) {
    let arr = [], max = 0;
    for(let i = 0; i < s.length; i++) {
        let index = arr.indexOf(s[i])
        if(index !== -1) { //the element was appeared again
            arr.splice(0, index+1); //splice the arr
        }
        arr.push(s.charAt(i))
        max = Math.max(arr.length, max) 
    }
    return max
};
```

Using the index number to maintain the window

```js
var lengthOfLongestSubstring = function (s) {
  let index = 0;
  let max = 0;
  let j = 0;
  for (let i = 0; i < s.length; i++) {
    index = s.substring(index, i).indexOf(s[i]) + 1;
    if (index == 0) {
      max = Math.max(max, i - j + 1);
    } else {
      j = j + index;
    }
  }
  return max;
};
```

Using the data structure of <a href='https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map'>Map</a>

```js
var lengthOfLongestSubstring = function(s) {
    let map = new Map(), max = 0
    for(let i = 0, j = 0; j < s.length; j++) {
        if(map.has(s[j])) {
            i = Math.max(map.get(s[j]) + 1, i)
        }
        max = Math.max(max, j - i + 1)
        map.set(s[j], j)
    }
    return max
};

```



### 11 [Container With Most Water](https://leetcode-cn.com/problems/container-with-most-water/)

Given n non-negative integers a1, a2, ..., an , where each represents a point at coordinate (i, ai). n vertical lines are drawn such that the two endpoints of line i is at (i, ai) and (i, 0). Find two lines, which together with x-axis forms a container, such that the container contains the most water.

Note: You may not slant the container and n is at least 2.

<img src="https://s3-lc-upload.s3.amazonaws.com/uploads/2018/07/17/question_11.jpg" alt="img" style="zoom:50%;" /> 

The above vertical lines are represented by array [1,8,6,2,5,4,8,3,7]. In this case, the max area of water (blue section) the container can contain is 49.

> Example:
> Input: [1,8,6,2,5,4,8,3,7]
> Output: 49

**Slider window && two pointers**

The water volume was determined by the lower wall of the ends. Move the point of lower wall towards another wall. Record the bigger area in the max variable. When the two points meet, quit the loop.

```js
var maxArea = function (height) {
  let i = 0,
    j = height.length - 1,
    max = 0;
  while (i < j) {
    let area = (j - i) * Math.min(height[i], height[j]);
    max = max > area ? max : area;
    if (height[i] < height[j]) {
      i++;
    } else {
      j--;
    }
  }
  return max;
};
```

### <a name='threesum'>[15. 3Sum](https://leetcode-cn.com/problems/3sum/)</a>

Given an array nums of n integers, are there elements a, b, c in nums such that a + b + c = 0? Find all unique triplets in the array which gives the sum of zero.

Note: The solution set must not contain duplicate triplets.

> Example:
> Given array nums = [-1, 0, 1, 2, -1, -4],
> A solution set is:
> [
>   [-1, 0, 1],
>   [-1, -1, 2]
> ]

```js
var threeSum = function (nums) {
  nums = nums.sort((a, b) => a - b); //sorted from small to big number
  let res = [];
  let sum = 0; //target
  for (let p = 0; p < nums.length; p++) { //starts from the first element
    if (nums[p] > 0) break; //it's impossible for three positive number summed to 0
    if (nums[p] === nums[p - 1]) continue; //same value would result repeating answer, skip it
    let l = p + 1; 
    let r = nums.length - 1;
    while (l < r) { //when l and r meets,quit
      sum = nums[l] + nums[r] + nums[p];
      if (sum === 0) { 
        res.push([nums[p], nums[l], nums[r]]); //push one answer
        while (nums[l] === nums[l + 1]) l++; //same value would lead to repeating answer, jump to the one after it
        l++; //move the pointer
      } else if (sum < 0) { //not big enough
        l++; //move towards to bigger number
      } else {
        r--; //too big, move back
      }
    }
  }
  return res;
};
```



### [16. 3Sum Closest](https://leetcode-cn.com/problems/3sum-closest/)

Given an array nums of n integers and an integer target, find three integers in nums such that the sum is closest to target. Return the sum of the three integers. You may assume that each input would have exactly one solution.

> Example:
> Given array nums = [-1, 2, 1, -4], and target = 1.
> The sum that is closest to the target is 2. (-1 + 2 + 1 = 2).

**Two pointers**

similar with <a href='#threesum'>3 sum</a>

```js
var threeSumClosest = function (nums, target) {
  nums = nums.sort((a, b) => a - b); //sort
  let res = nums[0] + nums[1] + nums[2]; //initial result
  for (let p = 0; p < nums.length; p++) {
    let l = p + 1,
      r = nums.length - 1;
    while (l < r) {
      let sum = nums[p] + nums[l] + nums[r]; //sum of current pointers
      res = Math.abs(sum - target) < Math.abs(res - target) ? sum : res; //pick the closes one
      if (sum === target) return sum; //when equal, return this answer
      if (sum < target) {
        l++; // move towards to bigger
      } else {
        r--;// move towards to smaller
      }
    }
  }
  return res;
};
```

####  [42. Trapping Rain Water](https://leetcode-cn.com/problems/trapping-rain-water/)

Given n non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it is able to trap after raining.

<img src="https://assets.leetcode.com/uploads/2018/10/22/rainwatertrap.png" alt="img" style="zoom:75%;" />

The above elevation map is represented by array [0,1,0,2,1,0,1,3,2,1,2,1]. In this case, 6 units of rain water (blue section) are being trapped. Thanks Marcos for contributing this image!

> Example:
> Input: [0,1,0,2,1,0,1,3,2,1,2,1]
> Output: 6

**Two pointers**

A pointer loop through the array. The left pointer points to the highest wall on the left of current pointer. The right pointer points to the highest wall on the right of the current pointer. Calculate the volue of rain from the lower one of the two walls. Whenver the current pointer moves, update both left and right pointer.

```js
var trap = function (height) {
  if (height.length === 0) return 0;
  let sum = 0;
  for (let cur = 0; cur < height.length; cur++) { //cur pointer loop through the whole array
    let lMax = 0,
      rMax = 0;
    for (let l = cur - 1; l >= 0; l--) { //loop the left of the cur pointer to find the lmax
      lMax = height[l] > lMax ? height[l] : lMax;
    }
    for (let r = cur + 1; r < height.length; r++) { //loop the right of the cur pointer to find the rmax
      rMax = height[r] > rMax ? height[r] : rMax;
    }
    let min = Math.min(rMax, lMax); //the lower one of the two walls
    if (min > height[cur]) {
      sum += min - height[cur];
    }
  }
  return sum;
```

### [75. Sort Colors](https://leetcode-cn.com/problems/sort-colors/)

Given an array with n objects colored red, white or blue, sort them in-place so that objects of the same color are adjacent, with the colors in the order red, white and blue.

Here, we will use the integers 0, 1, and 2 to represent the color red, white, and blue respectively.

Note: You are not suppose to use the library's sort function for this problem.

> Example:
> Input: [2,0,2,1,1,0]
> Output: [0,0,1,1,2,2]
> Follow up:

A rather straight forward solution is a two-pass algorithm using counting sort.
First, iterate the array counting number of 0's, 1's, and 2's, then overwrite array with total number of 0's, then 1's and followed by 2's.
Could you come up with a one-pass algorithm using only constant space?

<div class="css-hgmg3m-Container e1l4e1yy0"><img src="https://pic.leetcode-cn.com/2823021bb0ce1c12afd4320592b5a42f7644969b389f66de623c5c53afd0b7c0-image.png" class="css-58ju5r-Img e1l4e1yy1"><img hidden="" src="https://pic.leetcode-cn.com/fe866418cf2c4a3f952e306244154bedf08de877cd32c90a3360037083f824f3-image.png" class="css-58ju5r-Img e1l4e1yy1"><img hidden="" src="https://pic.leetcode-cn.com/cf9424fc35b46c2cc22245bcabd1a6c9174b45330fa3583ad1d0b7ffccd24467-image.png" class="css-58ju5r-Img e1l4e1yy1"><img hidden="" src="https://pic.leetcode-cn.com/f46f4c36b5e934da0970336fd1d354bf8ab62fe8b839e0941983363187527912-image.png" class="css-58ju5r-Img e1l4e1yy1"><img hidden="" src="https://pic.leetcode-cn.com/5b5fcb1b0d97634f98a48367c3d165627f70774ca9509b7a1842cb54aef725c8-image.png" class="css-58ju5r-Img e1l4e1yy1"><img hidden="" src="https://pic.leetcode-cn.com/2e3068fdf815aba9a9aae31b8c9fcd2046ddf60b807018380ae95bb3c4c81d56-image.png" class="css-58ju5r-Img e1l4e1yy1"><img hidden="" src="https://pic.leetcode-cn.com/2a52a5f05c7ae0fedaaf7ed868e811d7527ace707dd62a9ca35c56eca1508b16-image.png" class="css-58ju5r-Img e1l4e1yy1"><img hidden="" src="https://pic.leetcode-cn.com/37d97fa81e2a9c8c745792aea95cb4662a1e3b8995f56ec6cccd2f24ab7c6376-image.png" class="css-58ju5r-Img e1l4e1yy1"><img hidden="" src="https://pic.leetcode-cn.com/c572ca6c0f8597650e78a46c0a0d9a911385f8c3abde37323426a96e5abad130-image.png" class="css-58ju5r-Img e1l4e1yy1"><img hidden="" src="https://pic.leetcode-cn.com/796a2abd8b7c06df30eab6c9e379c0b5e7d8691ed8643c2558eaa2dca0a3440b-image.png" class="css-58ju5r-Img e1l4e1yy1"><img hidden="" src="https://pic.leetcode-cn.com/6c85efd7087ee544a9182fc473150a5ec209eb166d3d6a22555afd3952d858e9-image.png" class="css-58ju5r-Img e1l4e1yy1"><img hidden="" src="https://pic.leetcode-cn.com/c5cc0460d604522a6cd4026059acb87d6bb83626f5d0cd84cfb41cdf99ebf618-image.png" class="css-58ju5r-Img e1l4e1yy1"><img hidden="" src="https://pic.leetcode-cn.com/6182aa82356ca67139d2a7fc686832694e1edd3b925a3b51f8b0d53c3688ee1a-image.png" class="css-58ju5r-Img e1l4e1yy1"></div>

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



```js
var sortColors = function (nums) {
  let count = [0, 0, 0];
  for (let num of nums) {
    count[num] += 1;
  }
  for (let i = 0, j = 0; i < 3; i++) {
    while (count[i]) {
count[i]--;
      nums[j] = i;
j++
    }
  }
};
```

#### [18. 4Sum](https://leetcode-cn.com/problems/4sum/)

> Given an array nums of n integers and an integer target, are there elements a, b, c, and d in nums such that a + b + c + d = target? Find all unique quadruplets in the array which gives the sum of target.
>

```js
var fourSum = function(nums, target) {
    let res = [];
    nums.sort((a,b) => a - b);
    let n = nums.length;
    for(let i = 0;i < n - 3;i++){
        if(i > 0 && nums[i] === nums[i-1]) continue;
        if(nums[i] + nums[i+1] + nums[i+2] + nums[i+3] > target) break;
        if(nums[i] + nums[n-1] + nums[n-2] + nums[n-3] < target) continue;
        for(let j = i + 1;j < n - 2;j++){
            if(j - i > 1 && nums[j] === nums[j-1]) continue;
            if(nums[i] + nums[j] + nums[j+1] + nums[j+2] > target) break;
            if(nums[i] + nums[j] + nums[n-1] + nums[n-2] < target) continue;
            let left = j + 1;
            let right = n - 1;
            while(left < right){
                let tmpRes = nums[i] + nums[j] + nums[left] + nums[right];
                if(tmpRes === target){
                    res.push([nums[i],nums[j],nums[left],nums[right]]);
                    while(left < right && nums[left] === nums[left + 1]) left++;
                    while(left < right && nums[right] === nums[right - 1]) right--;
                    left++;
                    right--;
                }else if(tmpRes > target){
                    right--;
                }else{
                    left++;
                }
            }
        }
    }
    return res;
};
```

