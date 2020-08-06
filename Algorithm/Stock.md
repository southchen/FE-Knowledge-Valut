<<<<<<< HEAD

# Stock

**每天都有三种「选择」**：买入、卖出、无操作，我们用 buy, sell, rest 表示这三种选择。

根据题意，不是每天都可以任意选择这三种选择的。

这个问题的「状态」有三个==>三维数组

- 第一个是天数
- 第二个是允许交易的最大次数
- 第三个是当前的**持有状态**（用 1 表示持有，0 表示没有持有）。

`dp[3][2][1]` 的含义就是：今天是第三天，我现在手上持有着股票，至今最多进行 2 次交易。

最终答案是`dp[n - 1][K][0]`，即最后一天，最多允许 K 次交易，最多获得多少利润。

_为什么不是 `dp[n - 1][K][1]`？因为 [1] 代表手上还持有股票，[0] 表示手上的股票已经卖出去了，很显然后者得到的利润一定大于前者。_

```java
dp[i][k][0 or 1]
0 <= i <= n-1, 1 <= k <= K
n 为天数，大 K 为最多交易数
此问题共 n × K × 2 种状态，全部穷举就能搞定。

for 0 <= i < n:
    for 1 <= k <= K:
        for s in {0, 1}:
            dp[i][k][s] = max(buy, sell, rest)
```

如果 buy，就要从利润中减去 prices[i]，如果 sell，就要给利润增加 prices[i]

```js
dp[i][k][1] = max(dp[i - 1][k][1], dp[i - 1][k - 1][0] - prices[i]);
//max(   选择 rest  ,     选择 buy         )
dp[i][k][0] = max(dp[i - 1][k][0], dp[i - 1][k][1] + prices[i]);
//max(   选择 rest  ,      选择 sell      )
```

base case:

```js
dp[-1][k][0] = 0;
//因为 i 是从 0 开始的，所以 i = -1 意味着还没有开始，这时候的利润当然是 0 。
dp[-1][k][1] = -infinity;
//还没开始的时候，是不可能持有股票的，用负无穷表示这种不可能。
dp[i][0][0] = 0;
//因为 k 是从 1 开始的，所以 k = 0 意味着根本不允许交易，这时候利润当然是 0 。
dp[i][0][1] = -infinity;
//不允许交易的情况下，是不可能持有股票的，用负无穷表示这种不可能。
```

#### [121. Best Time to Buy and Sell Stock](https://leetcode-cn.com/problems/best-time-to-buy-and-sell-stock/)

k=1 完成 1 笔，为定值。用二维数组即可；`dp[i][0]` or `dp[i][1]`

```js
dp[i][1] = Max(dp[i - 1][1], dp[i - 1][0] - prices[i]) =
  //dp[i-1][0] 由于只能买卖一次，k<=1，所以买卖之前，原利润只能为0
  Max(dp[i - 1][1], 0 - prices[i]);
```

```js
var maxProfit = function (prices) {
  let n = prices.length;
  if (n == 0) {
    return 0;
  }
  //2D array
  let dp = Array.from(new Array(n), () => new Array(2));
  //loop
  for (let i = 0; i < n; i++) {
    //base case
    //第0天
    if (i == 0) {
      //不持有，profit 0
      dp[i][0] = 0;
      //持有，只能是当天买的
      dp[i][1] = -prices[i];
      //不用算dp[0][1]/dp[0][0],直接i=>1
      continue;
    }
    //transfer
    //不拥有：1昨天没有今天不变 2昨天有今天卖
    dp[i][0] = Math.max(dp[i - 1][0], dp[i - 1][1] + prices[i]);
    //持有：1昨天没有今天买 2昨天有今天不变
    dp[i][1] = Math.max(-prices[i], dp[i - 1][1]);
  }
  //最后一天，不持有（持有的话，利润肯定不如卖出去的大）
  return dp[n - 1][0];
};
```

#### [122. Best Time to Buy and Sell Stock II](https://leetcode-cn.com/problems/best-time-to-buy-and-sell-stock-ii/)

你可以尽可能地完成更多的交易（多次买卖一支股票）

k=Infinity 不用考虑，二维数组即可

```js
dp[i][1] = Math.max(dp[i - 1][0] - prices[i], dp[i - 1][1]);
//k为无限次；昨天没有，今天卖：总利润=原利润-买股票花的钱
```

```js
var maxProfit = function (prices) {
  let n = prices.length;
  if (n == 0) {
    return 0;
  }
  let dp = Array.from(new Array(n), () => new Array(2));
  for (let i = 0; i < n; i++) {
    if (i == 0) {
      //base case
      dp[0][0] = 0;
      dp[0][1] = -prices[0];
      continue;
    }
    //transfer
    //今天不持有：1昨天未持有今天不变 2：昨天持有，今天卖
    dp[i][0] = Math.max(dp[i - 1][0], dp[i - 1][1] + prices[i]);
    //今天持有： 1昨天未持有今天买 2：昨天持有，今天不变
    dp[i][1] = Math.max(dp[i - 1][0] - prices[i], dp[i - 1][1]);
  }
  return dp[n - 1][0];
};
```

optimization:

```js
var maxProfit = function (prices) {
  let n = prices.length;
  if (n == 0) {
    return 0;
  }
  let dp_i_0 = 0;
  let dp_i_1 = -Infinity;
  for (let i = 0; i < n; i++) {
    var tmp = dp_i_0;
    dp_i_0 = Math.max(dp_i_0, dp_i_1 + prices[i]);
    dp_i_1 = Math.max(tmp - prices[i], dp_i_1);
  }
  return dp_i_0;
};
```

#### [123. Best Time to Buy and Sell Stock III](https://leetcode-cn.com/problems/best-time-to-buy-and-sell-stock-iii/)

k=2，买之前必须卖掉手头的

三维数组

k，每买一次，就--

```js
//今天不持有，且至今买卖k次：1昨天未持有，今天不变 2昨天持有今天卖
dp[i][k][0] = max(dp[i - 1][k][0], dp[i - 1][k][1] + prices[i]);
//今天持有：1昨天持有今天不变 2昨天不持有，今天买，（k需要-1，因为今天买了）
dp[i][k][1] = max(dp[i - 1][k][1], dp[i - 1][k - 1][0] - prices[i]);
```

这道题由于没有消掉 k 的影响，所以必须要对 k 进行穷举

```JS
var maxProfit = function (prices) {
  let n = prices.length;
  if (n == 0) {
    return 0;
  }
  let K = 2;
  //init 3D array
  let dp = Array(n)
    .fill(null)
    .map(() =>
      Array(K + 1)
        .fill(null)
        .map(() => Array(2).fill(0))
    );
  for (let i = 0; i < n; i++) {
    //这道题由于没有消掉 k 的影响，所以必须要对 k 进行穷举：
    for (let k = K; k >= 1; k--) {
      if (i == 0) {
        //base case
        dp[i][k][0] = 0;
        dp[i][k][1] = -prices[i];
        continue;
      }
      //transfer
      //第i天不持有：1前一天不持有，今天不变 2：前一天持有，今天售出
      dp[i][k][0] = Math.max(dp[i - 1][k][0], dp[i - 1][k][1] + prices[i]);
      //第i天持有： 1前一天持有，今天不变 2：前一天不持有，进买入（k-1，因为今天买入，使用了一次k）
      dp[i][k][1] = Math.max(dp[i - 1][k][1], dp[i - 1][k - 1][0] - prices[i]);
    }
  }
  //最终，第n天，交易K次，不持有
  return dp[n - 1][K][0];
};
```

#### [309. Best Time to Buy and Sell Stock with Cooldown](https://leetcode-cn.com/problems/best-time-to-buy-and-sell-stock-with-cooldown/)

冷冻期 1 天

k=Infinity，k 对整个三维状态转移方程毫无影响，可以化掉

```js
dp[i][0] = max(dp[i - 1][0], dp[i - 1][1] + prices[i]);
dp[i][1] = max(dp[i - 1][1], dp[i - 2][0] - prices[i]);
//第 i 天选择 buy 的时候，要从 i-2 的状态转移，而不是 i-1 。
```

```js
var maxProfit = function (prices) {
  let n = prices.length;
  if (n == 0) {
    return 0;
  }
  let dp = Array.from(new Array(n), () => new Array(2));
  for (var i = 0; i < n; i++) {
    //base case1
    if (i == 0) {
      //第0天，不持有，利润为0
      dp[0][0] = 0;
      //持有，0-买入的花费
      dp[0][1] = -prices[i];
      continue;
    } else if (i == 1) {
      //base case2
      //第一天，不持有，1第0天不持有，第一天不变  2第0天持有，冷冻期，第一天不变
      dp[1][0] = Math.max(dp[0][0], dp[0][1] + prices[i]);
      //第一天持有， 1第0天持有，冷冻期，第一天不变 2第1天买入
      dp[1][1] = Math.max(dp[0][1], 0 - prices[i]);
      continue;
    }
    //transfer
    //第i天不持有 1：前一天不持有，今天不变 2：前一天持有，今天卖
    dp[i][0] = Math.max(dp[i - 1][0], dp[i - 1][1] + prices[i]);
    //第i天持有 1:前一天持有，今天不变 2：前两天
    dp[i][1] = Math.max(dp[i - 1][1], dp[i - 2][0] - prices[i]);
  }
  return dp[n - 1][0];
};
```

```js
var maxProfit = function (prices) {
  let n = prices.length;
  if (n == 0) {
    return 0;
  }
  let dp_i_0 = 0;
  let dp_i_1 = -Infinity;
  let dp_pre = 0;
  for (var i = 0; i < n; i++) {
    let tmp = dp_i_0;
    dp_i_0 = Math.max(dp_i_0, dp_i_1 + prices[i]);
    dp_i_1 = Math.max(dp_i_1, dp_pre - prices[i]);
    dp_pre = tmp;
  }
  return dp_i_0;
};
```

188

最多可以完成 **k** 笔交易。

一次交易由买入和卖出构成，至少需要两天。所以说有效的限制 k 应该不超过 n/2，如果超过，就没有约束作用了，相当于 k = +infinity。这种情况是之前解决过的。

```

```

714

```

```

## Template

```js
var maxProfit = function(k, prices) {
    // 交易天数
    let n = prices.length;
    // 最大交易次数
    //-----如果当题k不影响状态转移方程，此处去掉
    let maxTime = k;
    if(n == 0){
        return 0;
    }
    // 初始化三维数组
    //-----如果当题k不影响状态转移方程，此处初始化去掉
    let dp = Array.from(new Array(n),() => new Array(maxTime+1));
    for(let i = 0;i < n;i++){
        for(let r = 0;r <= maxTime;r++){
            dp[i][r] = new Array(2);
        }
    }
    //-----如果当题k不影响状态转移方程，则只需二维数组
    // let dp = Array.from(new Array(n),() => new Array(2));

    // 遍历递推
    for(let i = 0;i < n;i++){
        //-----如果当题k不影响状态转移方程，内循环去掉
        for(let k = maxTime;k >= 1;k--){
            if(i == ...){
                // 边界条件处理
                //
                continue;
            }
            // 递推公式
            dp[i][k][0] = Max(前一天交易次数k：买，卖，不买也不卖);
            dp[i][k][1] = Max(前一天交易次数k-1：买，卖，不买也不卖);
        }
    }
    // 返回结果
    return dp[n-1][maxTime][0];
    //-----如果当题k不影响状态转移方程
    // return dp[n-1][0];
};
```
