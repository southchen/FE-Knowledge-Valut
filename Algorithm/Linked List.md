

[toc]

# Linked List

### [206. Reverse Linked List](https://leetcode-cn.com/problems/reverse-linked-list/)

Reverse a singly linked list.

> Example:
> Input: 1->2->3->4->5->NULL
> Output: 5->4->3->2->1->NULL
> Follow up:

A linked list can be reversed either iteratively or recursively. Could you implement both?

*  iterative

*  时间复杂度：O(n)。 假设 n 是列表的长度，时间复杂度是 O(n)。

*  空间复杂度：O(1)

   ```js
   var reverseList = function (head) {
     if (!head || !head.next) return head;
     let pre = null,
       cur = head;
     while (cur) {
       let next = cur.next;
       cur.next = pre;
       pre = cur;
       cur = next;
     }
     head = pre;
     return head;
   };
   ```

* recursive

* ```js
var reverseList = function (head) {
    if (!head || !head.next) return head;
    let next = head.next;
    let reversedHead = reverseList(next);
    head.next = null;
    next.next = head;
    return reversedHead;
  };
  ```
  
  

### [21. Merge Two Sorted Lists](https://leetcode-cn.com/problems/merge-two-sorted-lists/)

Merge two sorted linked lists and return it as a new list. The new list should be made by splicing together the nodes of the first two lists.

> Example:
> Input: 1->2->4, 1->3->4
> Output: 1->1->2->3->4->4

<div class="css-hgmg3m-Container e1l4e1yy0"><img src="https://assets.leetcode-cn.com/solution-static/21/1.PNG" class="css-58ju5r-Img e1l4e1yy1"><img hidden="" src="https://assets.leetcode-cn.com/solution-static/21/2.PNG" class="css-58ju5r-Img e1l4e1yy1"><img hidden="" src="https://assets.leetcode-cn.com/solution-static/21/3.PNG" class="css-58ju5r-Img e1l4e1yy1"><img hidden="" src="https://assets.leetcode-cn.com/solution-static/21/4.PNG" class="css-58ju5r-Img e1l4e1yy1"><img hidden="" src="https://assets.leetcode-cn.com/solution-static/21/5.PNG" class="css-58ju5r-Img e1l4e1yy1"><img hidden="" src="https://assets.leetcode-cn.com/solution-static/21/6.PNG" class="css-58ju5r-Img e1l4e1yy1"><img hidden="" src="https://assets.leetcode-cn.com/solution-static/21/7.PNG" class="css-58ju5r-Img e1l4e1yy1"><img hidden="" src="https://assets.leetcode-cn.com/solution-static/21/8.PNG" class="css-58ju5r-Img e1l4e1yy1"><img hidden="" src="https://assets.leetcode-cn.com/solution-static/21/9.PNG" class="css-58ju5r-Img e1l4e1yy1"><img hidden="" src="https://assets.leetcode-cn.com/solution-static/21/10.PNG" class="css-58ju5r-Img e1l4e1yy1"><img hidden="" src="https://assets.leetcode-cn.com/solution-static/21/11.PNG" class="css-58ju5r-Img e1l4e1yy1"><img hidden="" src="https://assets.leetcode-cn.com/solution-static/21/12.PNG" class="css-58ju5r-Img e1l4e1yy1"><img hidden="" src="https://assets.leetcode-cn.com/solution-static/21/13.PNG" class="css-58ju5r-Img e1l4e1yy1"><img hidden="" src="https://assets.leetcode-cn.com/solution-static/21/14.PNG" class="css-58ju5r-Img e1l4e1yy1"><img hidden="" src="https://assets.leetcode-cn.com/solution-static/21/15.PNG" class="css-58ju5r-Img e1l4e1yy1"><img hidden="" src="https://assets.leetcode-cn.com/solution-static/21/16.PNG" class="css-58ju5r-Img e1l4e1yy1"><img hidden="" src="https://assets.leetcode-cn.com/solution-static/21/17.PNG" class="css-58ju5r-Img e1l4e1yy1"><img hidden="" src="https://assets.leetcode-cn.com/solution-static/21/18.PNG" class="css-58ju5r-Img e1l4e1yy1"><img hidden="" src="https://assets.leetcode-cn.com/solution-static/21/19.PNG" class="css-58ju5r-Img e1l4e1yy1"><img hidden="" src="https://assets.leetcode-cn.com/solution-static/21/20.PNG" class="css-58ju5r-Img e1l4e1yy1"><img hidden="" src="https://assets.leetcode-cn.com/solution-static/21/21.PNG" class="css-58ju5r-Img e1l4e1yy1"><img hidden="" src="https://assets.leetcode-cn.com/solution-static/21/22.PNG" class="css-58ju5r-Img e1l4e1yy1"><img hidden="" src="https://assets.leetcode-cn.com/solution-static/21/23.PNG" class="css-58ju5r-Img e1l4e1yy1"><img hidden="" src="https://assets.leetcode-cn.com/solution-static/21/24.PNG" class="css-58ju5r-Img e1l4e1yy1"><img hidden="" src="https://assets.leetcode-cn.com/solution-static/21/25.PNG" class="css-58ju5r-Img e1l4e1yy1"><img hidden="" src="https://assets.leetcode-cn.com/solution-static/21/26.PNG" class="css-58ju5r-Img e1l4e1yy1"><img hidden="" src="https://assets.leetcode-cn.com/solution-static/21/27.PNG" class="css-58ju5r-Img e1l4e1yy1"><img hidden="" src="https://assets.leetcode-cn.com/solution-static/21/28.PNG" class="css-58ju5r-Img e1l4e1yy1"><img hidden="" src="https://assets.leetcode-cn.com/solution-static/21/29.PNG" class="css-58ju5r-Img e1l4e1yy1"><img hidden="" src="https://assets.leetcode-cn.com/solution-static/21/30.PNG" class="css-58ju5r-Img e1l4e1yy1"><img hidden="" src="https://assets.leetcode-cn.com/solution-static/21/31.PNG" class="css-58ju5r-Img e1l4e1yy1"><img hidden="" src="https://assets.leetcode-cn.com/solution-static/21/32.PNG" class="css-58ju5r-Img e1l4e1yy1"><img hidden="" src="https://assets.leetcode-cn.com/solution-static/21/33.PNG" class="css-58ju5r-Img e1l4e1yy1"><img hidden="" src="https://assets.leetcode-cn.com/solution-static/21/34.PNG" class="css-58ju5r-Img e1l4e1yy1"><img hidden="" src="https://assets.leetcode-cn.com/solution-static/21/35.PNG" class="css-58ju5r-Img e1l4e1yy1"></div>



* iterative (two pointer)

```js
var mergeTwoLists = function (l1, l2) {
  let p = new ListNode(-1);//dummy head
  let preHead = p;  //store the dummy head!
  while (l1 && l2) {
    if (l1.val >= l2.val) {
      p.next = l2;
      l2 = l2.next;
    } else {
      p.next = l1;
      l1 = l1.next;
    }
      p=p.next
  }
  if (l1) { //add the remaining list
    p.next = l1;
    l1 = l1.next;
  }
  if (l2) {
    p.next = l2;
    l2 = l2.next;
  }
  return preHead.next; //dummy head's next is the first head
};
```

* Recursive

  ```js
  function mergeTwoLists(l1, l2) { //always compare two node
      if(l1 === null) { //if it reaches the end return the other node
          return l2
      }
      if(l2 === null) {
          return l1
      }
      if(l1.val <= l2.val) { 
          l1.next = mergeTwoLists(l1.next, l2) //let the next head point to the next result
        //pass the new head l1.next
          return l1  //return the smaller one
      } else {
          l2.next = mergeTwoLists(l2.next, l1)   //pass the new head l2.next
          return l2
      }
  }
  ```

  

![img](https://pic.leetcode-cn.com/a918cadaf04feddd5429bd4cdc9ef259cdcae6126e194e0284d86287a5ba3006.png)

### [160. Intersection of Two Linked Lists](https://leetcode-cn.com/problems/intersection-of-two-linked-lists/)

Write a program to find the node at which the intersection of two singly linked lists begins.

> Input: intersectVal = 8, 
> listA = [4,1,8,4,5], 
> listB = [5,0,1,8,4,5], 
> skipA = 2, skipB = 3
>
> Output: Reference of the node with value = 8
> Input Explanation: The intersected node's value is 8 (note that this must not be 0 if the two lists intersect). From the head of A, it reads as [4,1,8,4,5]. From the head of B, it reads as [5,0,1,8,4,5]. There are 2 nodes before the intersected node in A; There are 3 nodes before the intersected node in B.

>Input: intersectVal = 2, listA = [0,9,1,2,4], listB = [3,2,4], skipA = 3, skipB = 1
>
>Output: Reference of the node with value = 2
>Input Explanation: The intersected node's value is 2 (note that this must not be 0 if the two lists intersect). From the head of A, it reads as [0,9,1,2,4]. From the head of B, it reads as [3,2,4]. There are 3 nodes before the intersected node in A; There are 1 node before the intersected node in B.

>Input: intersectVal = 0, listA = [2,6,4], listB = [1,5], skipA = 3, skipB = 2
>
>Output: null
>Input Explanation: From the head of A, it reads as [2,6,4]. From the head of B, it reads as [1,5]. Since the two lists do not intersect, intersectVal must be 0, while skipA and skipB can be arbitrary values.
>Explanation: The two lists do not intersect, so return null.

![相交链表.png](https://pic.leetcode-cn.com/e86e947c8b87ac723b9c858cd3834f9a93bcc6c5e884e41117ab803d205ef662-%E7%9B%B8%E4%BA%A4%E9%93%BE%E8%A1%A8.png)

```js
var getIntersectionNode = function (headA, headB) {
  let pA = headA,
    pB = headB;
  while (pA || pB) {
    if (pA === pB) return pA;
    pA === null ? (pA = headB) : (pA = pA.next);
    pB === null ? (pB = headA) : (pB = pB.next);
  }
  return null;
};
```

### [141. Linked List Cycle](https://leetcode-cn.com/problems/linked-list-cycle/)

Given a linked list, determine if it has a cycle in it.

To represent a cycle in the given linked list, we use an integer pos which represents the position (0-indexed) in the linked list where tail connects to. If pos is -1, then there is no cycle in the linked list.

> Example 1:
> Input: head = [3,2,0,-4], pos = 1
> Output: true
> Explanation: There is a cycle in the linked list, where tail connects to the second node.

> Example 2:
>
> Input: head = [1,2], pos = 0
> Output: true
> Explanation: There is a cycle in the linked list, where tail connects to the first node.

> Example 3:
>
> Input: head = [1], pos = -1
> Output: false
> Explanation: There is no cycle in the linked list.

Follow up: Can you solve it using O(1) (i.e. constant) memory?

Use slow & fast pointers:

Space complexity :O(1) Time complexcity: O(n)

```js
var hasCycle = function(head) {
    if(!head || !head.next) {
        return false
    }
    let fast = head.next.next, slow = head
    while(fast !== slow) {
        if(!fast || !fast.next) return false
        fast = fast.next.next
        slow = slow.next
    }
    return true
};
```

Using the list to store a marker/flag to indicate if this node was traversed. 

Space&Time complexcity: O(N)

```js
var hasCycle = function(head) {
    while(head) {
        if(head.flag) return true //this list was marked
        head.flag = true
        head = head.next
    }
    return false
};
```

### [234. Palindrome Linked List](https://leetcode-cn.com/problems/palindrome-linked-list/)

Given a singly linked list, determine if it is a palindrome.

> Example 1:
>
> Input: 1->2
> Output: false

> Example 2:
>
> Input: 1->2->2->1
> Output: true

Follow up: Could you do it in O(n) time and O(1) space?

Two pointer:

```js
var isPalindrome = function (head) {
  if (!head || !head.next) return false;
  if (!head.next.next) {
    if (head.val === head.next.val) return true;
    return false;
  }
  let slow = head,
    fast = head.next.next;
  while (fast.next) {
    slow = slow.next;
    fast = fast.next;
  }
  let reversed = slow.next; //find the mid point 
  pre = null; //reverse the last half
  while (reversed) {
    let next = reversed.next;
    reversed.next = pre;
    pre = reversed;
    reversed = next;
  }
  reversed = pre; //the reversed head
  while (reversed && head) { //compare the two halfs
    if (reversed.val != head.val) return false;
    reversed = reversed.next;
    head = head.next;
  }
  return true
```

Using stack:

```js
var isPalindrome = function (head) {
  let arr = [];
  while (head) {
    arr.push(head.val);
    head = head.next;
  }
  while (arr.length > 1) {
    if (arr.pop() != arr.shift()) return false;
  }
  return true;
};
```

### [148. Sort List](https://leetcode-cn.com/problems/sort-list/)

Sort a linked list in O(n log n) time using constant space complexity.

Merge sorting:

It's easy to just apply the <a href="https://southchen.github.io/2020/05/21/Template-for-Divided-Conquer-Algorithm/">Divided Conqure algorithm template</a> 😁

<!--more-->

```js
var sortList = function (head) {
  //base case
  if (!head || !head.next) return head;
  if (!head.next.next) {
    if (head.val < head.next.val) return head;
    let next = head.next;
    next.next = head;
    head.next = null;
    return next;
  }
  //split
  let slow = head,
    pre = new ListNode(-1), //dummy head
    fast = head.next.next;
  while (fast) {
    pre = slow;
    slow = slow.next;
    fast = fast.next;
  }
  pre.next = null;

  //recu
  let sortedLeft = sortList(head);
  let sortedRight = sortList(slow);
  //merge
  function merge(leftHead, rightHead) {
    let dummy = new ListNode(-1),  //dummy head
      pre = dummy;
    while (rightHead && leftHead) {
      if (leftHead.val >= rightHead.val) {
        pre.next = rightHead;
        rightHead = rightHead.next;
      } else {
        pre.next = leftHead;
        leftHead = leftHead.next;
      }
      pre = pre.next;
    }
    if (leftHead) pre.next = leftHead;
    if (rightHead) pre.next = rightHead;

    return dummy.next;
  }
  return merge(sortedLeft, sortedRight);
};
```

### [19. Remove Nth Node From End of List](https://leetcode-cn.com/problems/remove-nth-node-from-end-of-list/)

Two Pointers:

the faster one is n step ahead of the slower one. Then they move forwards together.  When the fast pointer reaches the end, the slow pointer is pointing to the nth element from end of list.

```js
var removeNthFromEnd = function (head, n) {
  let dummy = new ListNode(0);
  dummy.next = head; //dummy head to store the head in case it would be cut
  let s = dummy;
  let f = dummy;
  while (n) {
    n--;
    f = f.next;//n steps ahead
  }
  while (f.next) { 
    f = f.next;  //move together
    s = s.next;
  }
    //f reaches the null
  s.next = s.next.next; //skip the nth element from end
  return dummy.next; //return the dummy head's next node
};
```

###  [2. Add Two Numbers](https://leetcode-cn.com/problems/add-two-numbers/)

```js
var addTwoNumbers = function (l1, l2) {
  if (l1 === null && l2 === null) return null;
  let temp = 0, //sotre for next position
    dummy = new ListNode(-1),//dummy head
    cur = dummy, //current pointer in answer
    p1 = l1,
    p2 = l2;
  while (p1 || p2  { //at least one of them isn't null
    let v1 = p1 == null ? 0 : p1.val; //if null, insert 0
    let v2 = p2 == null ? 0 : p2.val;
    let sum = v1 + v2 + temp; //include the temp into the sum
    cur.next = new ListNode(sum % 10); //save to the answer
    temp = Math.floor(sum / 10); //save to the temp
    if (p1 !== null) p1 = p1.next; //moveforward if not null
    if (p2 !== null) p2 = p2.next;
    cur = cur.next; //move the current pointer
  }
  if (temp === 1) cur.next = new ListNode(temp); //fot the case both pointer reaches end, it may still has temp from previous node
  return dummy.next;
};
```

