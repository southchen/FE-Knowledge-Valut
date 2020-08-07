[toc]

# DFS 

* using stack to iterate 

* recursion



#### [144. Binary Tree Preorder Traversal](https://leetcode-cn.com/problems/binary-tree-preorder-traversal/)

recursion:

```js
var preorderTraversal = function(root) {
    let res = [];
    const traversal=(node)=>{
        if(!node) return;
        res.push(node.val)
        traversal(node.left)
        traversal(node.right);
    }
    traversal(root)
    return res;
};
```

iteration

```js
var preorderTraversal = function (root) {
  if (!root) return [];
  let res = [],
    stack = [root];
  while (stack.length > 0) {
    let cur = stack.pop();
    res.push(cur.val);
      //后进才能先出
    if (cur.right) stack.push(cur.right);
    if (cur.left) stack.push(cur.left);
  }
  return res;
};
```

more universal template:

```js
var preorderTraversal = function (root) {
  var result = [];
  var stack = [];
  var p = root;
  while (stack.length != 0 || p != null) {
    if (p != null) {
      stack.push(p);
        result.push(node.val); 
      p = p.left;
    } else {
      var node = stack.pop();
      p = node.right;
    }
  }
  return result;
};
```



#### [94. Binary Tree Inorder Traversal](https://leetcode-cn.com/problems/binary-tree-inorder-traversal/)

recursion:

```js
var inorderTraversal = function (root) {
  let res = [];
  const traversal = (root) => {
    if (root) {
      traversal(root.left);
      res.push(root.val);
      traversal(root.right);
    }
  };
  traversal(root);
  return res;
};
```

iteration:

```js
var inorderTraversal = function (root) {
  var result = [];
  var stack = [];
  var p = root;
  while (stack.length != 0 || p != null) {
    if (p != null) {
      stack.push(p);
      p = p.left;
    } else {
      var node = stack.pop();
      result.push(node.val); // Add after all left children
      p = node.right;
    }
  }
  return result;
};
```

#### [145. Binary Tree Postorder Traversal](https://leetcode-cn.com/problems/binary-tree-postorder-traversal/)

left => right =>root

recursion:

```js
var postorderTraversal = function (root) {
  let res = [];
  const traversal = (root) => {
    if (root) {
      traversal(root.left);
      traversal(root.right);
      res.push(root.val);
    }
  };
  traversal(root);
  return res;
};
```

iteration:

前序：`root=>left=>right` 后序：`left=>right=>root` 

把前序遍历的stack.push(node.val) 变更为 stack.unshift(node.val) （遍历结果逆序）

那么遍历顺序就由 根左右 变更为 右左根，再将 右左根 变更为 左右根 即可完成后序遍

```js
var postorderTraversal = function (root) {
  var result = [];
  var stack = [];
  var p = root;
  while (stack.length != 0 || p != null) {
    if (p != null) {
      stack.push(p);
      result.unshift(p.val); // Reverse the process of preorder
      p = p.right; // Reverse the process of preorder
    } else {
      var node = stack.pop();
      p = node.left; // Reverse the process of preorder
    }
  }
  return result;
};
```

####  [102. Binary Tree Level Order Traversal](https://leetcode-cn.com/problems/binary-tree-level-order-traversal/)

层序遍历也可用DFS，递归:

```js
var levelOrder = function (root) {
  const res = [];
    //needs second argu: depth
  function traversal(root, depth) {
    if (root !== null) {
      if (!res[depth]) {
        res[depth] = [];
      }
        //inorder traversal
      traversal(root.left, depth + 1);
      res[depth].push(root.val);
      traversal(root.right, depth + 1);
    }
  }
  traversal(root, 0);
  return res;
};
```

[515. Find Largest Value in Each Tree Row](https://leetcode-cn.com/problems/find-largest-value-in-each-tree-row/)

```js
var largestValues = function (root) {
  if (!root || root.length == 0) {
    return [];
  }
  var result = [];
  function dfs(currNode, level) {
    if (currNode) {
      result[level] == undefined
        ? (result[level] = currNode.val)
        : Math.max(currNode.val, result[level]);
      currNode.left && dfs(currNode.left, level + 1);
      currNode.right && dfs(currNode.right, level + 1);
    }
  }
  dfs(root, 0);
  return result;
};
```



#### [199. Binary Tree Right Side View](https://leetcode-cn.com/problems/binary-tree-right-side-view/)

DFS

```js
var rightSideView = function(root) {
  if(!root) return []
  let arr = []
  dfs(root, 0, arr)
  return arr
};
function dfs (root, step, res) {
  if(root){
    if(res.length === step){
      res.push(root.val)           // 当数组长度等于当前 深度 时, 把当前的值加入数组
    }
    dfs(root.right, step + 1, res) // 先从右边开始, 当右边没了, 再轮到左边
    dfs(root.left, step + 1, res)
  }
}
```

#### [236. Lowest Common Ancestor of a Binary Tree](https://leetcode-cn.com/problems/lowest-common-ancestor-of-a-binary-tree/)

recursion

```js
var lowestCommonAncestor = function (root, p, q) {
  // 遇到null节点返回null，遇到p或q，返回p或q
  if (root == null || root == p || root == q) {
    return root;
  }
    //子问题的解（递归入口）
  let left = lowestCommonAncestor(root.left, p, q);
  let right = lowestCommonAncestor(root.right, p, q);
  //原问题的解
    if (left && right) {
    return root;
  }
  return left ? left : right;
};
```

#### [104. Maximum Depth of Binary Tree](https://leetcode-cn.com/problems/maximum-depth-of-binary-tree/)

recursion:

```js
var maxDepth = function(root) {
if(!root) {
    return 0;
} else {
    const left = maxDepth(root.left);
    const right = maxDepth(root.right);
    return Math.max(left, right) + 1;
}
};
```

iteration:

```js
var maxDepth = function (root) {
  if (!root) return 0;
  var queue = [[root, 1]];
  var maxD = 1;
  while (queue.length) {
    var [p, d] = queue.shift();
    p.left && queue.push([p.left, d + 1]);
    p.right && queue.push([p.right, d + 1]);
    maxD = Math.max(maxD, d);
  }
  return maxD;
};
```

#### [101. Symmetric Tree](https://leetcode-cn.com/problems/symmetric-tree/)

recursion:

```js
var isSymmetric = function (root) {
  const symmetric = (left, right) => {
    if (!left && !right) return true;
    if (!left || !right) return false;
    return (
      left.val === right.val &&
      symmetric(left.left, right.right) &&
      symmetric(right.left, left.right)
    );
  };
  return symmetric(root, root);
};
```

iteration:

```js
var isSymmetric = function (root) {
  if (!root) return true;
  let stack = [root.left, root.right];
  while (stack.length > 0) {
    let right = stack.pop();
    left = stack.pop();
    if (left && right) {
      if (left.val !== right.val) return false;
      stack.push(left.left, right.right);
      stack.push(left.right, right.left);
    } else if (left || right) {
      return false;
    }
  }
  return true;
};
```



#### [106. Construct Binary Tree from Inorder and Postorder Traversal](https://leetcode-cn.com/problems/construct-binary-tree-from-inorder-and-postorder-traversal/)

```js
var buildTree = function (inorder, postorder) {
  if (inorder.length <= 0) return null;
  let length = inorder.length;
  let curRoot = postorder[length - 1];
  let mid = inorder.indexOf(curRoot);
  let root = new TreeNode(curRoot);
  root.left = buildTree(inorder.slice(0, mid), postorder.slice(0, mid));
  root.right = buildTree(
    inorder.slice(mid + 1),
    postorder.slice(mid, length - 1)
  );
  return root;
};
```



#### [112. Path Sum](https://leetcode-cn.com/problems/path-sum/)

```js
var hasPathSum = function (root, sum) {
    //base case
  if (!root) return false;
    //match
  if (root.val === sum && !root.left && !root.right) return true;
  let target = sum - root.val;
    //原问题 = left子问题 || right子问题
  return hasPathSum(root.left, target) || hasPathSum(root.right, target);
};
```



#### [105. Construct Binary Tree from Preorder and Inorder Traversal](https://leetcode-cn.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal/)

*  从前序找到当前root => new TreeNode

* 在中序中根据root，找到中心点索引，划分左右两边

* 在前序根据中心点索引划分两边

* root.left是左边的下一个root；root.right是右边的下一个root

* 子问题，相当于把已经确定的node去掉，再次调用，递归实现

```js
var buildTree = function (preorder, inorder) {
  if (!preorder.length) return null;
  let curRoot = preorder[0];
  let mid = inorder.indexOf(curRoot);
  let root = new TreeNode(curRoot);
    //从第二个到mid后切分前序，从mid切分中序
  root.left = buildTree(preorder.slice(1, mid + 1), inorder.slice(0, mid));
  root.right = buildTree(preorder.slice(mid + 1), inorder.slice(mid + 1));
  return root;
};
```

#### [226. Invert Binary Tree](https://leetcode-cn.com/problems/invert-binary-tree/)

can be done by all three types of DFS

pre:

```js
var invertTree = function(root) {
    if(root === null) return null;
    [root.left,root.right] = [root.right,root.left];
    invertTree(root.left);
    invertTree(root.right);
    return root;
};
```

inorder:

```js
var invertTree = function(root) {
    if(root === null) return null;
    invertTree(root.left);
    [root.left,root.right] = [root.right,root.left];
    // 此时的root.left 是上一步的 root.right
    invertTree(root.left);
    return root;
};
```

postorder:

```js
var invertTree = function(root) {
    if(root === null) return null;
    invertTree(root.left);
    invertTree(root.right);
    [root.left,root.right] = [root.right,root.left];
    return root;
};
```

iterartion && BFS

```js
var invertTree = function(root) {
    //using queue to impl BFS
    let queue = [root];
    while(queue.length > 0){
        let cur = queue.pop();
        if(cur === null) continue;
        [cur.left,cur.right] = [cur.right,cur.left];
        queue.unshift(cur.left);
        queue.unshift(cur.right);
    }
    return root;
};
```



[200. Number of Islands](https://leetcode-cn.com/problems/number-of-islands/)

```js
const numIslands = (grid) => {
  let count = 0;
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[0].length; j++) {
      if (grid[i][j] === '1') {
          //从当前 1 为入口
        count++;
        turnZero(i, j, grid);
      }
    }
  }
  return count;
};
function turnZero(i, j, grid) {
  if (
    i < 0 ||
    i >= grid.length ||
    j < 0 ||
    j >= grid[0].length ||
    grid[i][j] === '0'
  )
      //DFS 做的事情：沉岛，边界外不用沉，0不用沉
      //dfs 出口：超出矩阵边界，或遇到 0 ，不用变 0
    return;
    //将当前的 1 变 0
  grid[i][j] = '0';
    //将当前坐标的上下左右都递归 DFS ，即都变 0 ，并且会继续深度 dfs
    //同处一个岛的 1 都变 0 了
  turnZero(i, j + 1, grid);
  turnZero(i, j - 1, grid);
  turnZero(i + 1, j, grid);
  turnZero(i - 1, j, grid);
}

```

- [695. 岛屿的最大面积](https://leetcode-cn.com/problems/max-area-of-island/solution/mo-ban-ti-dao-yu-dfspython3-by-fe-lucifer/) 中等
- [979. 在二叉树中分配硬币](https://leetcode-cn.com/problems/distribute-coins-in-binary-tree/solution/tu-jie-dfspython3-by-fe-lucifer/) 中等

