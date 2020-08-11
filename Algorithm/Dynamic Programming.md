[toc]



# Dynamic Programming

recursion + memorization =>DP

key concepts:

* state
* choices
* state transfer function 

Template

* 状态=> 确认`dp[i][j]` 的含义
* 初始值的设置，i==0时，dp？，j==0时，dp？
* base case，边界
* 选择？=>状态转移方程 
  * 最优 max/min
  * 组合方法 dp1 + dp2
* 递推方向

## One dimensional array to store state

#### [322. Coin Change](https://leetcode-cn.com/problems/coin-change/)

原问题：求amount =11 时的最少硬币数；

子问题：已知 amount = 10 的最少硬币数；

原答案=子答案+1(再选一枚面值为 1 的硬币) 

因为硬币的数量是没有限制的，子问题之间没有相互 制，是互相独立的。

硬币无限，amount为状态量

`dp[i]` 意义当前的目标金额是i，至少需要 `dp[i]` 个硬币凑出i。

```js
 var coinChange = function(coins, amount) {
    /*
    首先，构造出amount+1的数组，
    例如：amount[11]存放着总金额11的最少金币组合
    */
    // 数组中每一项都事先赋为正无穷，便于与最小值的判断
    let dp = new Array(amount + 1).fill(Infinity);
    // 首先预先赋值为0，因为金额0的解法有0种
    dp[0] = 0;
    for(let i = 1; i <= amount; i++) {
        for(let coin of coins) {
            //没超额的时候才能选择，超额则为初始值Infinity
            if (i - coin >= 0) {
          // transfer: chose or not chose
          //选: amount为i-coin 时的个数+1
          //不选：之前的最小值
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
    //dp[i]到第i家的最高value
    //dp长度为nums长度+1
    let dp= Array(length+1);
    //init 前两个
    //选0家，0
    //选第一家，nums[0]
    dp[0]=0;
    dp[1]=nums[0];
    for(let i = 2;i<=length;i++){
        //choices:
        //选择第i家，前一个选择的状态，dp[i-2]加上当前价值
        //不选，前一家的状态dp[i-1]
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



## Two dimensional array

#### [213. House Robber II](https://leetcode-cn.com/problems/house-robber-ii/)

one dimension ->two dimension

拆分成两个问题，每个子问题类似于198题；

1:选第一家不选最后家时的答案

2.选最后一家不选第一家时的答案

取最大

```js
var rob = function(nums) {
    let n = nums.length;
    if(n === 0) return 0;
    if(n === 1) return nums[0];
    //max(选第一家不选最后一家，选最后一家不选第一家)
    return Math.max(help(nums.slice(0, n - 1)), help(nums.slice(1, n)))
};

function help(nums) {
    //每个问题是一个dp问题
    const dp = [];
    //空出前两个
    dp[0] = 0;
    dp[1] = 0;
    //i从2开始
    for (let i = 2; i < nums.length + 2; i++) {
        //similar with 198，index minus 2
        dp[i] = Math.max(dp[i-2] + nums[i-2], dp[i-1]);
    }
    return dp[nums.length + 1];
};

```

#### [337. House Robber III](https://leetcode-cn.com/problems/house-robber-iii/)

递归

```js
var rob = function(root) {
    const traverse(node){
        if(!node) return[0,0]
      const left=traverse(node.left)
      const right =traverse(node.right);
      //抢 当前节点+前2个抢
      let robed=node.val+left[1]+right[1]
    //不抢 前一个状态的最大值，可抢也可不抢
        let notRobed = Math.max(left[0],left[1])+Math.max(right[0],right[1])
    }
    let [robed,notRobed]=traverse(root)
    return Math.max(robed,notRobed)
};
```

DP, 遍历二叉树，做选择

两个变量共同决定一个状态：

* 1、代表不同子树的 root 节点
* 2、是否打劫了 root。

dp 不用数组，用map 代替。key是当前子树的root节点，value是存放两个状态的 res 数组。
选择：

* 没打劫根节点，则左右子树的根节点可打劫可不打劫：
  res[0] = 左子树的两个状态的较大值 + 右子树的两个状态的较大值。
* 打劫了根节点，则左右子树的根节点不能打劫：
  res[1] = root.val + 左子树的 [0] 状态 + 右子树的 [0] 状态。

```js
const rob = (root) => {
  const dp = new Map();
  const helper = (root) => {
    if (root == null) return [0, 0]; // 递归的出口
    const left = helper(root.left);
    const right = helper(root.right);
    if (!dp.has(root)) {
      // 还没遍历过该节点
      dp.set(root, [0, 0]); // 在map中添加该节点对应的res数组
    }
    const res = dp.get(root); // 获取该节点对应的res数组
    res[0] = Math.max(left[0], left[1]) + Math.max(right[0], right[1]);
    res[1] = root.val + left[0] + right[0]; // 在map中记录当前子树的两个状态
    return res; // 返回出这两个状态，供父节点参考
  };
  const res = helper(root); // 递归的入口
  return Math.max(res[0], res[1]);
};
```

#### [746. Min Cost Climbing Stairs](https://leetcode-cn.com/problems/min-cost-climbing-stairs/)

第 i 级台阶是第 i-1 级台阶的阶梯顶部

 踏上第 i 级台阶花费 cost[i] ，直接迈一大步跨过而不踏上去则不用花费。

 楼梯顶部在数组之外，如果数组长度为 len，那么楼顶就在下标为 len

```js
//dp[i-1] + cost[i] or dp[i-2]+cost[i]=>dp[i] = min(dp[i-2], dp[i-1]) + cost[i]
let minCostClimbingStairs = function (cost) {
  //push 0 to init
  cost.push(0);
  let dp = [],
    n = cost.length;
  //init dp with base case
  // 第 0 级 cost[0] 种方案
  dp[0] = cost[0];
  // 第 1 级，有两种情况,都为cost[1]
  // 1：分别踏上第0级与第1级台阶，花费cost[0] + cost[1]
  // 2：直接从地面开始迈两步直接踏上第1级台阶，花费cost[1]
  dp[1] = cost[1];
  //从第二个开始遍历
  for (let i = 2; i < n; i++) {
    dp[i] = Math.min(dp[i - 2], dp[i - 1]) + cost[i];
  }
  console.log(dp);
  return dp[n - 1];
};
```



```js
let minCostClimbingStairs = function (cost) {
  let n = cost.length,
    n1 = cost[0],
    n2 = cost[1];
  for (let i = 2; i < n; i++) {
    let tmp = n2;
    n2 = Math.min(n1, n2) + cost[i];
    n1 = tmp;
  }
  return Math.min(n1, n2);
};

```



#### [72. Edit Distance](https://leetcode-cn.com/problems/edit-distance/)

<img src="https://pic.leetcode-cn.com/501e2518592c5100ca7863f4ebcf0b1c45c72f6b7b5e052087e6cda371cba462-file_1567564774431" style="zoom:50%"/>



* `dp[i-1][j]` : 删除
  * 直接把 s[i] 这个字符删掉，i 需要指向删除后，最后面的数，即前移i，继续跟 j 对比，操作数加一	

* `dp[i][j-1]` : 插入
  * 在 s1[i] 插入一个和 s2[j] 一样的字符 ，s2[j] 被匹配了，前移 j，继续跟 i 对比，操作数加一	
* `dp[i-1][j-1]` : 替换
  * 把 s1[i] 替换成 s2[j]，匹配； 同时前移 i，j 继续对比；操作数加一

```js
let minDistance = (word1, word2)=> {
    let n = word1.length, m = word2.length
    //dp[i][j]表示w1的前i个字母要转换成w2的前j个字母所需的最少操作数。
    let dp = new Array(n+1).fill(0).map(() => new Array(m+1).fill(0))
    //base case:j ==0
    for (let i = 0; i <= n; i++) {
        dp[i][0] = i
    }
    //base case:i==0
    for (let j = 0; j <= m; j++) {
        dp[0][j] = j
    }
    for(let i = 0;i <= n;i++){
        for(let j = 0;j <= m;j++){
            //i*j!==0
            if(i*j){
                if(word1[i-1] == word2[j-1]){
                    dp[i][j] = dp[i-1][j-1]
                }else{
                    dp[i][j] = 1+Math.min(dp[i-1][j],//删除
                                        dp[i][j-1],//插入
                                        dp[i-1][j-1])//替换
                }
            }else{
                //i==0 ||j==0
                //即有一单词为0，到头,直接返回i+j（0+i或j+0）即还有长度的数组每个都删除
                dp[i][j] = i + j
            }
        }
    }
    return dp[n][m]
};

```



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

```js
var uniquePathsWithObstacles = function (obstacleGrid) {
  let m = obstacleGrid.length;
  let n = obstacleGrid[0].length;
  let dp = Array(m)
    .fill(null)
    .map(() => Array(n).fill(null));
  if (obstacleGrid[0][0] === 1) return 0;

  for (var i = 0; i < m; i++) {
    for (var j = 0; j < n; j++) {
      if (i == 0 && j == 0) {
        dp[0][0] = 1;
      } else if (obstacleGrid[i][j] === 1) {
        dp[i][j] = 0;
      } else if (i == 0 && j >= 1) {
        dp[i][j] = dp[i][j - 1];
      } else if (j == 0 && i >= 1) {
        dp[i][j] = dp[i - 1][j];
      } else {
        dp[i][j] = dp[i - 1][j] + dp[i][j - 1];
      }
    }
  }

  return dp[m - 1][n - 1];
};
```

Optimization

```js
/**
 * 初始化第一步可达，为1
 * for双循环内就可以少一层判断
 **/
var uniquePathsWithObstacles = function (obstacleGrid) {
  var n = obstacleGrid.length;
  var m = obstacleGrid[0].length;
  var result = Array(m).fill(0);
  for (var i = 0; i < n; i++) {
    for (var j = 0; j < m; j++) {
      if (i == 0 && j == 0) {
        result[j] = 1;
      }
      if (obstacleGrid[i][j] == 1) {
        result[j] = 0;
      } else if (j > 0) {
        result[j] += result[j - 1];
      }
    }
  }
  return result[m - 1];
};
var uniquePathsWithObstacles = function (obstacleGrid) {
  var n = obstacleGrid.length;
  var m = obstacleGrid[0].length;
  var result = Array(m).fill(0);
  result[0] = 1;
  for (var i = 0; i < n; i++) {
    for (var j = 0; j < m; j++) {
      if (obstacleGrid[i][j] == 1) {
        result[j] = 0;
      } else if (j > 0) {
        result[j] += result[j - 1];
      }
    }
  }
  return result[m - 1];
};

```

#### [300. Longest Increasing Subsequence](https://leetcode-cn.com/problems/longest-increasing-subsequence/)

subsequence 不用连续

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
            //只要上升，赋值dp
          dp[i] = Math.max(dp[i], dp[j] + 1);
        }
    } 
  }
  return Math.max(...dp) 
};
```

binary search + greedy：

<img src='https://pic.leetcode-cn.com/d25ebf30e65f08539631b99877fe3e680dc610174e480d3138316bd4b0fd4bb0-300-greed-binary-search-7.png' style='zoom:70%'/>

<img src='https://pic.leetcode-cn.com/4ea79c933335d3589ea30d0069bc5f0d6370a4e1ccf7340ce36150707ed38d57-300-greed-binary-search-11.png' style="zoom:70%"/>

```js
function lengthOfLIS(nums) {
    //tail[i] 的定义：长度为 i + 1 的所有最长上升子序列的结尾的最小值。
  let tails = [];
  for (const num of nums) {
    let left = 0,
      right = tails.length - 1;
    while (left <= right) {
        //在有序数组 tail 中查找第 1 个等于大于 num 的那个数，试图让它变小；
      let mid = (left + right) >> 1;
      if (tails[mid] < num) {
        left = mid + 1;
      } else {
        right = mid - 1;
      }
    }
      //left两种情况：
     //如果这个数严格大于有序数组 tail 的最后一个元素，left为末尾，就把 num 放在有序数组 tail 的后面
     //如果找到比nums小的第一个数，最后左边的元素即为查找到的需要被替换的结果元素
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



```js
var canPartition = function (nums) {
  if (nums === null || nums.length <= 0) return false;
  let length = nums.length;
  let sum = nums.reduce(function (pre, cur) {
    return pre + cur;
  });
  if (sum & 1) {
    return false;
  }
  let target = sum / 2;
  // dp[i][j]表示下标0~i之间是否存在和为j的子集
  let dp = new Array(length);
  for (let i = 0; i < length; i++) {
    dp[i] = new Array(target + 1).fill(false);
  }
  // 对i=0进行初始化
  for (let i = 0; i < target + 1; i++) {
    if (nums[0] === i) {
      dp[0][i] = true;
    }
  }
  // i从1开始
  for (let i = 1; i < length; i++) {
    for (let j = 0; j <= target; j++) {
      // 状态转移方程
      if (j >= nums[i]) {
        dp[i][j] = dp[i - 1][j] || dp[i - 1][j - nums[i]];
      } else {
        dp[i][j] = dp[i - 1][j];
      }
    }
  }
  return dp[length - 1][target];
};
```

#### [416. Partition Equal Subset Sum](https://leetcode-cn.com/problems/partition-equal-subset-sum/)

Similar with package problem

the target is the sum/2

```js
var canPartition = function (nums) {
  if (nums === null || nums.length <= 0) return false;
  let sum = nums.reduce(function (pre, cur) {
    return pre + cur;
  });
  if (sum & 1) {
    return false;
  }
  let target = sum / 2;
    //init with false
  let dp = new Array(target + 1).fill(false);
//one element fits the target, break with true
  for (let i = 0; i < target + 1; i++) {
    if (nums[0] === i) {
      dp[i] = true;
      break;
    }
  }
  for (let i = 1; i < nums.length; i++) {
    for (let j = target; j >= 0; j--) {
        if( j >= nums[i]){
            dp[j] = dp[j] || dp[j - nums[i]];
        }
    }
  }
  return dp[target];
};
```

#### [518. Coin Change 2](https://leetcode-cn.com/problems/coin-change-2/)



```js
var change = function(amount, coins) {
if (amount === 0) return 1;

const dp = [Array(amount + 1).fill(1)];

for (let i = 1; i < amount + 1; i++) {
  dp[i] = Array(coins.length + 1).fill(0);
  for (let j = 1; j < coins.length + 1; j++) {
    // 从1开始可以简化运算
    if (i - coins[j - 1] >= 0) {
      // 注意这里是coins[j -1]而不是coins[j]
        //transfer 选的方法个数+不选的方法个数
      dp[i][j] = dp[i][j - 1] + dp[i - coins[j - 1]][j]; // 由于可以重复使用硬币所以这里是j不是j-1
    } else {
      dp[i][j] = dp[i][j - 1];
    }
  }
}

return dp[dp.length - 1][coins.length];
}
```



#### [516. Longest Palindromic Subsequence](https://leetcode-cn.com/problems/longest-palindromic-subsequence/)

```js
var longestPalindromeSubseq = function (s) {
  let length = s.length;

  // dp[i][j]表示的是从s[i]至s[j]之间的最长回文子序列的长度
  let dp = new Array(length);
  for (let i = 0; i < length; i++) {
    dp[i] = new Array(length).fill(0);
  }

  for (let i = length - 1; i >= 0; i--) {
    // 每一个字符都是一个回文字符串，因此对于dp[i][i]设置为1
    dp[i][i] = 1;
    for (let j = i + 1; j < length; j++) {
      // 状态转移方程为:
      // 当s[i]等于s[j]时，dp[i][j] = dp[i-1][j+1] + 2;
      // 当s[i]不等于s[j]时，dp[i][j] = max(dp[i-1][j], dp[i][j+1])
      if (s[i] === s[j]) {
        dp[i][j] = dp[i + 1][j - 1] + 2;
      } else {
        dp[i][j] = Math.max(dp[i + 1][j], dp[i][j - 1]);
      }
    }
  }
  return dp[0][length - 1];
};
```

#### [5. Longest Palindromic Substring](https://leetcode-cn.com/problems/longest-palindromic-substring/)

```js
var longestPalindrome = function (s) {
  let n = s.length;
  let res = '';
  let dp = Array.from(new Array(n), () => new Array(n).fill(0));
  for (let i = n - 1; i >= 0; i--) {
    for (let j = i; j < n; j++) {
        //fill the table only when s[i] == s[j] because substring
        //if s[i] != s[j] table填0
      dp[i][j] = s[i] == s[j] && (j - i < 2 || dp[i + 1][j - 1]);
      if (dp[i][j] && j - i + 1 > res.length) {
          //update res
        res = s.substring(i, j + 1);
      }
    }
  }
  return res;
};
```



[542. 01 Matrix](https://leetcode-cn.com/problems/01-matrix/)

两次DP：一次从左上到右下，一次从右下到左上

```js
var updateMatrix = function (matrix) {
  if (!matrix.length || !matrix[0].length) return null;

  let n = matrix.length;
  let m = matrix[0].length;
  let ans = new Array(n);
  for (let i = 0; i < n; i++) ans[i] = new Array(m).fill(n + m);

  for (let i = 0; i < n; i++)
    for (let j = 0; j < m; j++) if (matrix[i][j] === 0) ans[i][j] = 0;

  for (let i = 0; i < n; i++)
    for (let j = 0; j < m; j++) {
      if (i - 1 >= 0) ans[i][j] = Math.min(ans[i][j], ans[i - 1][j] + 1);
      if (j - 1 >= 0) ans[i][j] = Math.min(ans[i][j], ans[i][j - 1] + 1);
    }

  for (let i = n - 1; i >= 0; i--)
    for (let j = m - 1; j >= 0; j--) {
      if (i + 1 < n) ans[i][j] = Math.min(ans[i][j], ans[i + 1][j] + 1);
      if (j + 1 < m) ans[i][j] = Math.min(ans[i][j], ans[i][j + 1] + 1);
    }

  return ans;
};

```

