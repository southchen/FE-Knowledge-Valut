# Recursion PartII

## Bubble sorting

```js
function recurBubble(arr) {
  if (arr.length <= 1) return arr;
  let max = -Infinity;
  let maxIndex = -1;
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] >= max) {
      max = arr[i];
      maxIndex = i;
    }
  }
  max = arr.splice(maxIndex, 1);
  return [...recurBubble(arr), ...max];
}
```

