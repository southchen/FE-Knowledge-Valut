[toc]



# Dynamic Programming

key concepts:

* state
* choices
* state transfer function 

## One dimensional array to store state

#### [322. Coin Change](https://leetcode-cn.com/problems/coin-change/)

```js
 var coinChange = function(coins, amount) {
    // 本题采用 自底向上 的动态规划解法
    /*
    首先，构造出amount+1的数组，
    之所以+1,是为了保障最后的金额（最初的原始金额）有位置可以存放
    例如：amount[11]存放着总金额11的最少金币组合
    */
    // 数组中每一项都事先赋为正无穷，便于与最小值的判断
    let dp = new Array(amount + 1).fill(Infinity);
    // 首先预先赋值为0，因为金额0的解法有0种
    dp[0] = 0;

    /*
    破题关键
    每种金额的解法至1金币始，循环到金额amount为止。
    每次外层for循环时，内部的for...of循环来判断是否可用现有的金币组合来组成amount金币量
    举例：amount为11，coins为[1,2,5]，则取以下解法的最小值
    coins为1时，amount[11] = 1(利用硬币金额1来解，故占一个金额的位置) + amount[11-1]（假设已知，且为最小值）
    coins为2时，amount[11] = 1(利用硬币金额2来解，故占一个金额的位置) + amount[11-2]（假设已知，且为最小值）
    coins为5时，amount[11] = 1(利用硬币金额5来解，故占一个金额的位置) + amount[11-5]（假设已知，且为最小值）
    */
    for(let i = 1; i <= amount; i++) {
        for(let coin of coins) {
            if (i - coin >= 0) {
                // dp[i]本身的解法 和 dp[当前的总金额i(即amount) - 遍历的icon] + 1(遍历的icon) 的解法的最小值
                dp[i] = Math.min(dp[i], dp[i - coin] + 1);
            }
        }
    }

    // 如果结果为无穷大，则无解
    return dp[amount] === Infinity ? -1 : dp[amount];
};

```

#### [198. House Robber](https://leetcode-cn.com/problems/house-robber/)

```js
var rob = function(nums) {
    let length = nums.length;
    if(length===0) return 0;
    let dp= Array(length+1);
    dp[0]=0;
    dp[1]=nums[0];
    for(let i = 2;i<=length;i++){
        dp[i]= Math.max(dp[i-1],dp[i-2]+nums[i-1]);
    }
    return dp.pop();
};
```





#### [70. Climbing Stairs](https://leetcode-cn.com/problems/climbing-stairs/)

```js
var climbStairs = function (n) {
  const dp = [0, 1, 2];
  for (let i = 3; i <= n; i++) {
    dp[i] = dp[i - 1] + dp[i - 2];
  }
  return dp[n];
};
```



62

516

#### [300. Longest Increasing Subsequence](https://leetcode-cn.com/problems/longest-increasing-subsequence/)

```js
  //dp[i] 表示以 nums[i] 结尾的最长上升子序列；
  var lengthOfLIS = function(nums) { 
  let n = nums.length
  if(!n) return 0;
  let dp = new Array(n)
  //init 为1，每个元素本身也是一个子序列，长度为1
  dp[0]=1;
  for(let i = 1; i < n; i++){
    //我们需要找前面比自己小的；
    for(let j = 0; j < i; j++){
        if(nums[i] > nums[j]){
          dp[i] = Math.max(dp[i], dp[j] + 1);
        }
    } 
  }
  return Math.max(...dp) 
};

```

## Two dimensional array

#### [474. Ones and Zeroes](https://leetcode-cn.com/problems/ones-and-zeroes/)

```

```

