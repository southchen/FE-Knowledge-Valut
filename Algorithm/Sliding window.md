[toc]

# Sliding window

Use case: find target sub-string in a string, return the index/max length ... of the target string

using two pointer to maintain the window (left and right)

## Template

```js
// origin string: s; target srting: word 
let s = ...;
let word = ...;
// pointers
let left = 0,right = 0;
// init the windows
let windows = {};
// the difference between target and window
let needs = {};
// the fullfillment condition
let valid;
// count if all the condition is matched
let match = 0 ;
// update the window
while(right < target.length){
    // if valid, move the right pointer
    if(valid){
    windows.add(B[right]);
    }
    right++;
    // when it reaches the condition
    while(match === needs.length){
        //now shrink the window by moving forward the left pointer
        if(valid){
            //if the original left pointer points to a valid value
        window.remove(B[left]);
        // decrease the match
        match--;
        left++;
        }
    }
}
```

#### [3. Longest Substring Without Repeating Characters](https://leetcode-cn.com/problems/longest-substring-without-repeating-characters/)

```js
var lengthOfLongestSubstring = function (s) {
  let l = 0,
    r = 0;
  let map = {};
  let max = 0;
  while (r < s.length) {
    map[s[r]] ? map[s[r]]++ : (map[s[r]] = 1);
    while (map[s[r]] > 1) {
      map[s[l]]--;
      l++;
    }
    max = Math.max(r - l + 1, max);
    r++;
  }
  return max;
};
```

using map to store the element:index pair

everytime encounter a duplicate element (Map.has()), no need to move left pointer one step per loop

move left pointer to the max (left, and the duplicate + 1)

```js

var lengthOfLongestSubstring = function (s) {
  let map = new Map(),
    max = 0;
  for (let i = 0, j = 0; j < s.length; j++) {
    if (map.has(s[j])) {
      i = Math.max(map.get(s[j]) + 1, i);
    }
    max = Math.max(max, j - i + 1);
    map.set(s[j], j);
  }
  return max;
};
```



#### [76. Minimum Window Substring](https://leetcode-cn.com/problems/minimum-window-substring/)

```js
var minWindow = function (s, t) {
  let needed = 0;
  let map = {};
  let res = Infinity;
  let resStart;
    //let resStart=0 × for 'aa' \'a' should return ''
  for (let c of t) {
    if (map[c]) {
      map[c]++;
    } else {
      map[c] = 1;
      needed++;
    }
  }
  for (let r = 0, l = 0; r < s.length; r++) {
    if (map[s[r]] != undefined) map[s[r]]--;
    //map[s[r]] ? map[s[r]]--:null; ×
    if (map[s[r]] === 0) needed--;
    while (needed === 0) {
      //   res = Math.min(res, r - l + 1); ×
      //   resStart = Math.max(resStart, l);×
      if (r - l + 1 < res) {
        res = r - l + 1; // update the res
        resStart = l; // update the start positon
      }
      if (map[s[l]] != undefined) map[s[l]]++;
      if (map[s[l]] > 0) needed++;
      l++;
    }
  }
//substring from the start positoon + res(len)
  return s.substring(resStart, resStart + res);
};
```

#### [209. Minimum Size Subarray Sum](https://leetcode-cn.com/problems/minimum-size-subarray-sum/)

```js
const minSubArrayLen = (s, nums) => {
  let minLen = Infinity;
  let i = 0;
  let j = 0;
  let sum = 0;
  while (j < nums.length) {  
    sum += nums[j];
    while (sum >= s) {        // rechea the target, start to shrink until it dosen't meet criteria
      minLen = Math.min(minLen, j - i + 1);
      sum -= nums[i];
      i++;
    }
   // expand window
    j++;
  }
    //remeber to deal with the condition if havn't found any matches
  return minLen === Infinity ? 0 : minLen; 
};
```



#### [239. Sliding Window Maximum](https://leetcode-cn.com/problems/sliding-window-maximum/)

the queue stores the index

```js
var maxSlidingWindow = function (nums, k) {
 //maintain a queue to store the index of potential element of result
  const deque = [];
  const result = [];
  for (let i = 0; i < nums.length; i++) {
    //if the distance beyond k, shift it 
    if (i - deque[0] >= k) {
      deque.shift();
    }
    //while the current element is bigger than the last element of queue, pop it
     //until the whole queue is mono-increased
    while (nums[deque[deque.length - 1]] <= nums[i]) {
      deque.pop();
    }
    //always push the current index
    deque.push(i);
      //i is big enough to push the result
    if (i >= k - 1) {
        //the first one of queue is always the biggest one in current window
      result.push(nums[deque[0]]);
    }
  }
  return result;
};
```

#### [438. Find All Anagrams in a String](https://leetcode-cn.com/problems/find-all-anagrams-in-a-string/)

```js
var findAnagrams = function(s, p) {
    const res = [], need = {}, local = {};
    for(const ch of p)  {
        if(ch in need)  ++need[ch];
        else    need[ch]=1;
    }
    let to_match = Object.keys(need).length;
    for(let l=0,r=0;r<s.length;++r){
        if(s[r] in local)   ++local[s[r]];
        else    local[s[r]]=1;
        if(s[r] in need&&local[s[r]]===need[s[r]])  --to_match;
        while(l<=r&&to_match===0){
            if(r-l+1===p.length)    res.push(l);
            local[s[l]]--;
            if(s[l] in need&&local[s[l]]<need[s[l]])    ++to_match;
            ++l;
        }
    }
    return res;
};
```

#### [567. Permutation in String](https://leetcode-cn.com/problems/permutation-in-string/)

similar as 438

```js
var checkInclusion = function(s1, s2) {
    let left = 0,right = 0;
    let needs = {},windows = {};
    let match = 0;
    for(let i = 0;i < s1.length;i++){
        needs[s1[i]] ? needs[s1[i]]++ : needs[s1[i]] = 1;
    }
    let needsLen = Object.keys(needs).length;
    while(right < s2.length){
        let c1 = s2[right];
        if(needs[c1]){
            windows[c1] ? windows[c1]++ : windows[c1] = 1;
            if(windows[c1] === needs[c1]){
                match++;
            }
        }
        right++;
        while(match === needsLen){
            if(right - left === s1.length){
                return true;
            }
            let c2 = s2[left];
            if(needs[c2]){
                windows[c2]--;
                if(windows[c2] < needs[c2]){
                    match--;
                }
            }
            left++;
        }
    }
    return false;
};

```

