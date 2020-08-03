[toc]



# Dynamic Programming

recursion + memorization =>DP

key concepts:

* state
* choices
* state transfer function 

## One dimensional array to store state

#### [322. Coin Change](https://leetcode-cn.com/problems/coin-change/)

```js
 var coinChange = function(coins, amount) {
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

72

## Two dimensional array

#### [62. Unique Paths](https://leetcode-cn.com/problems/unique-paths/)

```js
var uniquePaths = function (m, n) {
  if (m <= 0 || n <= 0) return 0;
  let dp = Array(m).fill(null).map(()=>Array(n).fill(1)));
  for (let i = 1; i < m; i++) {
    for (let j = 1; j < n; j++) {
      dp[i][j] = dp[i - 1][j] + dp[i][j - 1];
    }
  }
  return dp[m - 1][n - 1];
};
```

#### [63. Unique Paths II](https://leetcode-cn.com/problems/unique-paths-ii/)

```

```



#### [516. Longest Palindromic Subsequence](https://leetcode-cn.com/problems/longest-palindromic-subsequence/)

```

```



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

```js
function lengthOfLIS(nums) {
  let tails = [];
  for (const num of nums) {
    let left = 0,
      right = tails.length - 1;
    while (left <= right) {
      let mid = (left + right) >> 1;
      if (tails[mid] < num) {
        left = mid + 1;
      } else {
        right = mid - 1;
      }
    }
    tails[left] = num;
  }
  return tails.length;
}
```

#### [718. Maximum Length of Repeated Subarray](https://leetcode-cn.com/problems/maximum-length-of-repeated-subarray/)

暴力法：O(n^3)

```js
var findLength = function(A, B) {
    var max = 0;
    for(var i = 0;i < A.length;i++) {
        //loop A
        var a = A[i];
        for (var j = 0;j < B.length;j++) {
            //loop B
            var b = B[j];
            if (a === b) {
                var len = 1;
                //when equals, loop A&B
                while(i + len < A.length && j + len < B.length && A[i + len] === B[j+len]) {
                    len += 1;
                }
                if (len > max) {
                    max = len;
                }
            }
        }
    }
    return max;
};

```

DP:

```js
var findLength = function (A, B) {
  let resMax = 0;
  let n1 = A.length,
    n2 = B.length;
  let dp = Array.from(new Array(n1 + 1), () => new Array(n2 + 1).fill(0));
  for (let i = 1; i <= n1; i++) {
    for (let j = 1; j <= n2; j++) {
      if (A[i - 1] === B[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
        resMax = Math.max(resMax, dp[i][j]);
      }
    }
  }
  return resMax;
};
```



#### [1035. Uncrossed Lines](https://leetcode-cn.com/problems/uncrossed-lines/)

如果想要不相交，则必然相对位置要一致，换句话说就是：公共子序列

Similar with 1143

```js
var maxUncrossedLines = function (A, B) {
  let m = A.length;
  let n = B.length;
  let max = 0;
  let dp = Array(m + 1)
    .fill(null)
    .map(() => Array(n + 1).fill(0));
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (A[i - 1] === B[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
        max = Math.max(max, dp[i][j]);
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }
  //   console.log(dp);
  return max;
};
```



#### [474. Ones and Zeroes](https://leetcode-cn.com/problems/ones-and-zeroes/)

```

```

#### [1143. Longest Common Subsequence](https://leetcode-cn.com/problems/longest-common-subsequence/)

**最长公共子序列**

DP table -> status transfer

<img src='https://pic.leetcode-cn.com/be4d0c3b1a9e9f594c4498a666fa63359f690324bd5605f1896bb4f6fdb2762b.png' style="zoom:80%;" >

找状态转移方程的方法是，思考每个状态有哪些「选择」，只要我们能用正确的逻辑做出正确的选择，算法就能够正确运行。

recursive:

```js
var longestCommonSubsequence = function(text1, text2) {
    let n = text1.length;
    let m = text2.length;
 	let dp =function(i,j){
        if(i==-1||j==0) return 0;
        if(text1[i-1] == text2[j-1]){
            //recursive call dp(),the new result was updated by adding one (the common element)
             return dp(i-1,j-1)+1
            }else{
                 //recursive call dp(),the new result was updated by the biggest previous result
                return Math.max(dp(i-1,j),dp(i,j-1))
            }
    }
    return dp(n-1,m-1)
}
```

optimized with DP table

```js
var longestCommonSubsequence = function(text1, text2) {
    let n = text1.length;
    let m = text2.length;
    //init the table with n+1 row and m+1 columns
    //filled it with init res:0
   let dp = Array(n+1).fill(null).map(()=>Array(m+1).fill(1)));
    for(let i = 1;i <= n;i++){
        for(let j = 1;j <= m;j++){
            if(text1[i-1] == text2[j-1]){
                dp[i][j] = dp[i-1][j-1] + 1;
            }else{
                dp[i][j] = Math.max(dp[i][j-1],dp[i-1][j]);
            }
        }
    }
    return dp[n][m];
};
```

