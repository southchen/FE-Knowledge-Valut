[TOC]

# Sorting

### Insertion

![insertion](https://www.2cto.com/uploadfile/Collfiles/20180616/20180616142937108.png)

```js
 function insert(arr) {
        var len = arr.length;
        var preIndex, current;
        for (var i = 1; i < len; i++) {
          preIndex = i - 1;
          current = arr[i];
          while (preIndex >= 0 && arr[preIndex] > current) {
            arr[preIndex + 1] = arr[preIndex];
            preIndex--;
          }
          arr[preIndex + 1] = current;
        }
        return arr;
      }
```

用二分法改进插入过程

```js
function binaryInsertionSort(array) {
        for (var i = 1; i < array.length; i++) {
            var key = array[i], left = 0, right = i - 1;
            while (left <= right) {
                var middle = parseInt((left + right) / 2);
                if (key < array[middle]) {
                    right = middle - 1;
                } else {
                    left = middle + 1;
                }
            }
            for (var j = i - 1; j >= left; j--) {
                array[j + 1] = array[j];
            }
            array[left] = key;
        }
        return array;
    } 
}
```



### Quick

Left ➡️ pivot ➡️ right recursively

Complexity: O(nlogn)

```js
  function quick(nums) {
        if (nums.length <= 1) return nums;
        let mid = Math.floor(nums.length / 2);
        let pivot = nums.splice(mid, 1);
        let left = [],
          right = [];
        for (num of nums) {
          if (num < pivot) left.push(num);
          if (num >= pivot) right.push(num);
        }
   return [...quick(left), ...pivot, ...quick(right)]; //recursion
   }
```

### Merge

Complexity: O(nlogn)

![merge](https://user-gold-cdn.xitu.io/2019/7/23/16c1f400a4920693?imageslim)

```js
function mergeSorting(nums){
    if(nums.length<=0) return nums;
    let mid = Math.floor(nums.length/2)
    let left = nums.slice(0,mid)
    let right = nums.slice(mid);
    function merge(left,right){
        let res=[];
        while(left.legth&&right.length){
            if(left[0]<=right[0]){
            res.push(left.shift())
        }else{
            res.push(right.shift())
        }
              }
           while(left.length){
        res.push(left.shift());
    }
    while(right.length){
        res.push(right.shift());
    }
        return res;
    }
    merge(mergeSorting(left),mergeSorting(right))
}
```

### Selection

No extra memory sapce;

TimeComplexity: O(n2) double loop

```js
 function selectionSort(arr){
   var len=arr.length;
   var i,j,min;
   for(i=0;i<len-1;i++){
       min=i;   //将当前值设为最小值
    for(j=i+1;j<len;j++){
      if(arr[j]<arr[min]){
         	min=j;  //在后面找到更小的值
      		 }
		[arr[i],arr[min]]= [arr[min],arr[i]]
	}
	return arr;
}
```

### Bubble

Complexity: O(n^2)

```js
function bubbleSort(arr){
    var len=arr.length;
    for(var i=len-1;i>0;i--){
        for(var j=0;j<i;j++){
            if(arr[j]>arr[j+1]){
                var tmp = arr[j];
                arr[j]=arr[j+1];
                arr[j+1]=tmp
            }
        }
    }
    return arr;
}
```

