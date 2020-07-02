[TOC]

# BFS

minimal length

using queue

## Template

* function BFS takes two parameters target/end and start
* build a queue to maintain the data
* build an array to sotre visited data if needed
* push the start, init the step
* check if it reaches the target 
  * if not, push the surrounding element into the queue
  * if so return with the step
* update the step

## Leetcode

#### [111. Minimum Depth of Binary Tree](https://leetcode-cn.com/problems/minimum-depth-of-binary-tree/)

Given a binary tree, find its minimum depth.

The minimum depth is the number of nodes along the shortest path from the root node down to the nearest leaf node.

Note: A leaf is a node with no children.

```js
var minDepth = function(root) {
    if (!root) return 0

    let q = [], step = 1
    q.push(root)

    while(q.length > 0) {
        let len = q.length
        for(let i=0; i< len; i++) {
            let curr = q.shift()
            if (curr.left === null && curr.right === null) return step

            if (curr.left !== null) {
                q.push(curr.left)
            }
            if (curr.right !== null) {
                q.push(curr.right)
            }
        }
        step ++ 
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
  let count = 0
  let queue = []
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[0].length; j++) {
      if (grid[i][j] === '1') {
        count++
        grid[i][j] = '0' // 做标记，避免重复遍历
        queue.push([i, j])
        turnZero(queue, grid)
      }
    }
  }
  return count
}
function turnZero(queue, grid) {
  const dirs = [[0, 1], [1, 0], [0, -1], [-1, 0]]
  while (queue.length) {
    const cur = queue.shift()
    for (const dir of dirs) {
      const x = cur[0] + dir[0]
      const y = cur[1] + dir[1]
      if (x < 0 || x >= grid.length || y < 0 || y >= grid[0].length || grid[x][y] !== '1') {
        continue
      }
      grid[x][y] = '0'
      queue.push([x, y])
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