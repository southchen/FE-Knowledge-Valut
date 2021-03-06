[TOC]

# BFS

minimal length

depth 每增加⼀次，队列中的所有节点都向前迈
⼀步，这保证了第⼀次到达终点的时候，⾛的步数是最少的。

用 BFS 的话，距离源点更近的点会先被遍历到，这样就能找到到某个点的最短路径了。

DFS 实际上是靠递归的堆栈记录⾛过的路径，你要找到最短路
径，肯定得把⼆叉树中所有树杈都探索完才能对⽐出最短的路径有多⻓对不
对？⽽ BFS 借助队列做到⼀次⼀步「⻬头并进」，是可以在不遍历完整棵
树的条件下找到最短距离的。
BFS 算法套路框架
105

using queue

## Template

- function BFS takes two parameters target/end and start
- build a queue to maintain the data
- build an array to sotre visited data if needed
- push the start, init the step
- check if it reaches the target
  - if not, push the surrounding element into the queue
  - if so return with the step
- update the step

## Leetcode

#### [111. Minimum Depth of Binary Tree](https://leetcode-cn.com/problems/minimum-depth-of-binary-tree/)

Given a binary tree, find its minimum depth.

The minimum depth is the number of nodes along the shortest path from the root node down to the nearest leaf node.

Note: A leaf is a node with no children.

```js
var minDepth = function (root) {
  if (!root) return 0;

  let q = [],
    step = 1;
  q.push(root);

  while (q.length > 0) {
    let len = q.length;
    for (let i = 0; i < len; i++) {
      let curr = q.shift();
      if (curr.left === null && curr.right === null) return step;

      if (curr.left !== null) {
        q.push(curr.left);
      }
      if (curr.right !== null) {
        q.push(curr.right);
      }
    }
    step++;
  }
};
```

#### [200. Number of Islands](https://leetcode-cn.com/problems/number-of-islands/)

Given a 2d grid map of `'1'`s (land) and `'0'`s (water), count the number of islands. An island is surrounded by water and is formed by connecting adjacent lands horizontally or vertically. You may assume all four edges of the grid are all surrounded by water.

**Example 1:**

```
Input:
11110
11010
11000
00000

Output: 1
```

```js
const numIslands = (grid) => {
  let count = 0;
  let queue = [];
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[0].length; j++) {
      if (grid[i][j] === '1') {
        count++;
        grid[i][j] = '0'; // 做标记，避免重复遍历
        queue.push([i, j]);
        turnZero(queue, grid);
      }
    }
  }
  return count;
};
function turnZero(queue, grid) {
  const dirs = [
    [0, 1],
    [1, 0],
    [0, -1],
    [-1, 0],
  ];
  while (queue.length) {
    const cur = queue.shift();
    for (const dir of dirs) {
      const x = cur[0] + dir[0];
      const y = cur[1] + dir[1];
      if (
        x < 0 ||
        x >= grid.length ||
        y < 0 ||
        y >= grid[0].length ||
        grid[x][y] !== '1'
      ) {
        continue;
      }
      grid[x][y] = '0';
      queue.push([x, y]);
    }
  }
}
```

#### [752. Open the Lock](https://leetcode-cn.com/problems/open-the-lock/)

```js
var openLock = function (deadends, target) {
  let queue = [];
  let seen = new Set();
  queue.push(['0000', 0]);
  while (queue.length > 0) {
    let [node, depth] = queue.shift();
    if (node === target) return depth;
    if (deadends.includes(node)) continue;
    for (let i = 0; i < 4; i++) {
      for (let j = -1; j <= 1; j += 2) {
        let newNode =
          node.slice(0, i) +
          String((Number(node[i]) + j + 10) % 10) +
          node.slice(i + 1, 4);
        if (!seen.has(newNode)) {
          queue.push([newNode, depth + 1]);
          seen.add(newNode);
        }
      }
    }
  }
  return -1;
};
```

#### [133. Clone Graph](https://leetcode-cn.com/problems/clone-graph/)

[102. Binary Tree Level Order Traversal](https://leetcode-cn.com/problems/binary-tree-level-order-traversal/)

Using queue and a flag(length) to check if the traversal is completed for one level

```js
var levelOrder = function (root) {
  if (!root) return [];
  let queue = [root];
  let res = [];
  while (queue.length > 0) {
    //record the amount of the nodes in the same level
    let length = queue.length;
    let arr = [];
    //when i ==len-1, completed current level
    for (let i = 0; i < len; i++) {
      let cur = queue.shift();
      arr.push(cur.val);
      cur.left && queue.push(cur.left);
      cur.right && queue.push(cur.right);
    }
    res.push(arr);
  }
  return res;
};
```

#### [103. Binary Tree Zigzag Level Order Traversal](https://leetcode-cn.com/problems/binary-tree-zigzag-level-order-traversal/)

```js
var zigzagLevelOrder = function (root) {
  if (!root) return [];
  let queue = [root];
  let level = 0;
  let res = [];
  while (queue.length > 0) {
    let len = queue.length;
    let arr = [];
    for (let i = 0; i < len; i++) {
      if (level % 2 != 0) {
        let cur = queue.shift();
        cur.right && queue.push(cur.right);
        cur.left && queue.push(cur.left);

        arr.push(cur.val);
      } else {
        let cur = queue.pop();
        cur.left && queue.unshift(cur.left);
        cur.right && queue.unshift(cur.right);

        arr.push(cur.val);
      }
    }
    level++;
    res.push(arr);
  }
  return res;
};
```

#### [515. Find Largest Value in Each Tree Row](https://leetcode-cn.com/problems/find-largest-value-in-each-tree-row/)

```
var largestValues = function (root) {
  if (!root) return [];
  let queue = [root];
  let res = [];
  while (queue.length > 0) {
    let len = queue.length;

    let max = -Infinity;
    for (let i = 0; i < len; i++) {
      let cur = queue.shift();
      cur.left && queue.push(cur.left);
      cur.right && queue.push(cur.right);
      max = Math.max(max, cur.val);
    }
    res.push(max);
  }
  return res;
};
```

[101. Symmetric Tree](https://leetcode-cn.com/problems/symmetric-tree/)

```js
var isSymmetric = (root) => {
  if (!root) return true;
  let queue = [root.left, root.right];
  while (queue.length) {
    // 队列为空代表没有可入列的节点，遍历结束
    let len = queue.length; // 获取当前层的节点数
    for (let i = 0; i < len; i += 2) {
      // 一次循环出列两个，所以每次+2
      let left = queue.shift(); // 左右子树分别出列
      let right = queue.shift(); // 分别赋给left和right变量
      if ((left && !right) || (!left && right)) return false; // 不满足对称
      if (left && right) {
        // 左右子树都存在
        if (left.val !== right.val) return false; // 左右子树的根节点值不同
        queue.push(left.left, right.right); // 让左子树的left和右子树的right入列
        queue.push(left.right, right.left); // 让左子树的right和右子树的left入列
      }
    }
  }
  return true; // 循环结束也没有遇到返回false
};
```

#### [117. Populating Next Right Pointers in Each Node II](https://leetcode-cn.com/problems/populating-next-right-pointers-in-each-node-ii/)

```js
var connect = function (root) {
  if (root == null) return null;
  var queue = [root];
  while (queue.length > 0) {
    var len = queue.length;
    for (let i = 0; i < len; i++) {
      var node = queue.shift();
      if (i == len - 1) {
        node.next = null;
      } else {
        node.next = queue[0];
        node.left && queue.push(node.left);
        node.right && queue.push(node.right);
      }
    }
  }
  return root;
};
```

#### [279. Perfect Squares](https://leetcode-cn.com/problems/perfect-squares/)

```js
var numSquares = function (n) {
  let queue = [n];
  let visited = {};
  let level = 0;
  while (queue.length > 0) {
    // 层序遍历
    level++;
    let len = queue.length;
    for (let i = 0; i < len; i++) {
      let cur = queue.pop();
      for (let j = 1; j * j <= cur; j++) {
        let tmp = cur - j * j;
        // 找到答案
        if (tmp === 0) {
          return level;
        }
        if (!visited[tmp]) {
          queue.unshift(tmp);
          visited[tmp] = true;
        }
      }
    }
  }
  return level;
};
```

#### [200. Number of Islands](https://leetcode-cn.com/problems/number-of-islands/)

沉岛。遇到1，陆地，计数一次。把相连的陆地都沉下，即标记为海洋0；

用队列记录相邻的陆地，依次取出，依次沉岛。

```js
const numIslands = (grid) => {
  let count = 0;
  let queue = [];
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[0].length; j++) {
      if (grid[i][j] === '1') {
        //遇到 1 就计数 +1 ，开始 BFS 沉岛
        count++;
        grid[i][j] = '0'; // 做标记，避免重复遍历
        //维护一个队列，遇到 1 就让它的坐标入列
        queue.push([i, j]);
        turnZero(queue, grid);
      }
    }
  }
  return count;
};
function turnZero(queue, grid) {
  const dirs = [
    [0, 1],
    [1, 0],
    [0, -1],
    [-1, 0],
  ];
  //一层层的出列入列，直到没有可以入列的节点，则当前岛屿的所有 1 都转 0 了
  while (queue.length) {
    //节点出列，并考察四个方向，如果是 1 ，将它转为 0 ，并将节点入列
    const cur = queue.shift();
    for (const dir of dirs) {
      const x = cur[0] + dir[0];
      const y = cur[1] + dir[1];
      if (
        x < 0 ||
        x >= grid.length ||
        y < 0 ||
        y >= grid[0].length ||
        grid[x][y] !== '1'
      ) {
        //如果越界了或遇到 0 ，则跳过，不用转 0
        continue;
      }
      grid[x][y] = '0';
      queue.push([x, y]);
    }
  }
}
```

#### [994. Rotting Oranges](https://leetcode-cn.com/problems/rotting-oranges/)

```js
const orangesRotting = (grid) => {
  const queue = [];
  let unrotten = 0; // 完好的个数
  const height = grid.length;
  const width = grid[0].length;
  for (let i = 0; i < height; i++) {
    for (let j = 0; j < width; j++) {
      if (grid[i][j] === 2) {
        queue.push([i, j]); // 所有的坏橘子的坐标推入队列
      } else if (grid[i][j] === 1) {
        unrotten++; // 统计好橘子的个数
      }
    }
  }
  if (unrotten == 0) return 0; //如果没有好橘子，直接返回0
  let level = 0; // 树的层次，即腐坏所用的时间
  const dx = [0, 1, 0, -1];
  const dy = [1, 0, -1, 0]; // 代表4个方向
  while (queue.length) {
    // queue队列不为空就继续循环
    const levelSize = queue.length; // 当前层节点个数
    level++; // 层次+1
    for (let i = 0; i < levelSize; i++) {
      // 当前层节点出列
      let cur = queue.shift();
      for (let j = 0; j < 4; j++) {
        let x = cur[0] + dx[j];
        let y = cur[1] + dy[j];
        if (x < 0 || x >= height || y < 0 || y >= width || grid[x][y] !== 1)
          continue; // 腐化好橘子，超出边界或本身就不是好橘子，跳过
        grid[x][y] = 2; // 将好橘子腐化，避免它被重复遍历
        queue.push([x, y]); // 推入队列，下次循环就将它们出列
        unrotten--; // 好橘子个数-1
      }
    }
  }
  return unrotten === 0 ? level - 1 : -1; // 好橘子如果还存在，返回-1
};
```



# 多源BFS

**「Tree 的 BFS」 （典型的「单源 BFS」）** ：

- 首先把 root 节点入队，再一层一层无脑遍历就行了。
- 从起点开始向四周扩散，遇到终点时停⽌；

⽽双向 BFS 则是从起点和终点同时开始扩散，当两边有交集的时候停⽌。双向 BFS 也有局限，因为你必须知道终点在哪⾥

**对于 「图 的 BFS」 （「多源 BFS」）**

* Tree 只有 1 个 root，而图可以有多个源点，所以首先需要把多个源点都入队；
* Tree 是有向的因此不需要标识是否访问过，而对于无向图来说，必须得标志是否访问过！为了防止某个节点多次入队，需要在其入队之前就将其设置成已访问！

Template

- 寻找多源；
- 多源的广度优先遍历
- 遍历时，不断与当前最大值比较，并更新；



#### [542. 01 Matrix](https://leetcode-cn.com/problems/01-matrix/)

首先把每个源点 0 入队，然后从各个 0 同时开始一圈一圈的向 1 扩散（每个 1 都是被离它最近的 0 扩散到的 ），扩散的时候可以设置 `dist` 来记录距离（即扩散的层次）并同时标志是否访问过。

对于本题是可以直接修改原数组 `matrix` 来记录距离和标志是否访问的，这里要注意先把`matrix` 数组中 1 的位置设置成 -1 （无效的距离值来标志这个位置的 1 没有被访问过）

* 每个点入队出队一次，所以时间复杂度：O(n * m)*O*(*n*∗*m*)

- 最差的情况下即全都是 00 时，需要把 m * n*m*∗*n* 个 00 都入队，因此空间复杂度是 O(n * m)*O*(*n*∗*m*)

```js
var updateMatrix = function (matrix) {
  if (!matrix.length || !matrix[0].length) return null;

  let n = matrix.length;
  let m = matrix[0].length;
  let ans = new Array(n);
  for (let i = 0; i < n; i++) ans[i] = new Array(m).fill(-1);

  let queue = [];
  for (let i = 0; i < n; i++)
    for (let j = 0; j < m; j++) {
      if (matrix[i][j] === 0) {
        ans[i][j] = 0;
        queue.push([i, j]);
      }
    }

  let dist = 0;
  while (queue.length) {
    let len = queue.length;
    dist++;
    for (let i = 0; i < len; i++) {
      let top = queue.shift();

      if (top[0] + 1 < n && ans[top[0] + 1][top[1]] === -1) {
        queue.push([top[0] + 1, top[1]]);
        ans[top[0] + 1][top[1]] = dist;
      }
      if (top[0] - 1 >= 0 && ans[top[0] - 1][top[1]] === -1) {
        queue.push([top[0] - 1, top[1]]);
        ans[top[0] - 1][top[1]] = dist;
      }
      if (top[1] + 1 < m && ans[top[0]][top[1] + 1] === -1) {
        queue.push([top[0], top[1] + 1]);
        ans[top[0]][top[1] + 1] = dist;
      }
      if (top[1] - 1 >= 0 && ans[top[0]][top[1] - 1] === -1) {
        queue.push([top[0], top[1] - 1]);
        ans[top[0]][top[1] - 1] = dist;
      }
    }
  }
  return ans;
};
```



[LeetCode 1162. As Far from Land as Possible](https://leetcode.com/problems/as-far-from-land-as-possible/)

将初始陆地坐标放进队列，然后从各个陆地**同时开始**一层一层的向海洋扩散，即逐次取出队列坐标，判断其上下左右是否有海洋，有则将海洋的值改为11，放进队列，第一轮结束后距离加一；之后每轮都是一样的操作，直至队列没有元素，那么最后扩散到的海洋就是最远的海洋

```js
var maxDistance = function(grid) {
    let [ queue_1, maxDistance] = [ [], -1]
    for(let i = 0; i < grid.length; i++){
        for(let j = 0; j < grid[0].length; j++){
            if(grid[i][j] == 1)
                queue_1.push([i, j])
        }        
    }
    if(queue_1.length == (0 || (grid.length*grid[0].length))) return -1
    while(queue_1.length != 0){
        let len = queue_1.length;
        for(let k = 0; k < len; k++){
            let [i1, j1] = queue_1.shift();
            if(i1 > 0 && grid[i1-1][j1] == 0){
                grid[i1-1][j1] = 1;
                queue_1.push([i1-1,j1]);
            }
            if(i1 < grid.length - 1 && grid[i1+1][j1] == 0){
                grid[i1+1][j1] = 1;
                queue_1.push([i1+1,j1]);
            }
            if(j1 > 0 && grid[i1][j1-1] == 0){
                grid[i1][j1-1] = 1;
                queue_1.push([i1,j1-1]);
            }
            if(j1 < grid[0].length - 1 && grid[i1][j1+1] == 0){
                grid[i1][j1+1] = 1;
                queue_1.push([i1,j1+1]);
            }
        }
        maxDistance++;
    }
    return maxDistance;
};
```

