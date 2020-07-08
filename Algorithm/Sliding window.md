# Sliding window

Use case: find target sub-string in a string, return the index/max length ... of the target string

using two pointer to maintain the window (left and right)

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

