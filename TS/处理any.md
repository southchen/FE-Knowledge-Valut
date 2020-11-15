[toc]

# 处理any

### 缩小any的影响范围

```ts
function f1(){
  const x: any = expressionReturningFoo(); // 不建议,后续的x都是any了
  processBar(x)
}

function f2(){
  const x = expressionReturningFoo();
  processBar(x as any) // 建议，只有这里是any
}
```

### 使用更细化的any

```ts
function getLengthBad(arr:any){
  return array.length; // 不推荐
}
function getLength(array:any[]){
  return array.length //推荐
}

const numArgsBad = (...args:any) => args.length //Return any 不推荐
const numArgs = (...args: any[]) => args.length // Return number 推荐
```

### 函数签名和实现想分离：安全的签名不安全的实现

有时候不使用any想编写一个完全类型安全的实现并非易事，但是一般对于使用者 并不关心内部的实现是否安全，只关心对外暴露的签名是否安全，此时我们可以将函数签名和 函数实现相分离，以简化内部的类型实现。这个技巧充分利用了当使用重载时，只有函数签名对外可见， 而函数实现对外不可见 

```ts
// 类型安全的签名
export function useImmer<S = any>(
  initialValue: S | (() => S)
): [S, (f: (draft: Draft<S>) => void | S) => void];

// 没那么安全的实现
export function useImmer(initialValue: any) {
  const [val, updateValue] = useState(initialValue);
  return [
    val,
    useCallback(updater => {
      updateValue(produce(updater));
    }, [])
  ];
}
```

### 理解进化的any

Typescript中的any并不是一成不变的，会随着用户的操作，Typescript会猜测更加合理的类型

```ts
const output = [] // any[]
output.push(1) 
output // number[]
output.push('2')
output // (number|string)[]
```

### 优先使用unknown而非any

考虑下述代码

```ts
function parseYAML(yaml:string):any{

}

const book = parseYAML(`
name: effective typescript
author:yj
`)
console.log(book.title) // no error
book('read') // no error
```

我们发现上述代码在该报错的地方并没有报错， 更加安全的是使用unknown和配合自定义type guide

```ts
function parseYAML(yaml:string):unknown{

}

const book = parseYAML(`name: effective typescript author:yj`)
console.log(book.title) // 报错 
book('read') // 报错
interface Book {
  name: string;
  author: string;
}
function isBook(val:unknown): val is Book {
  return (
    typeof val === 'object' && val !== null && 'name' in val && 'author' in val
  )
}
if(isBook(booke)){
  console.log(book.title)
}
```

同时需要区分{}和object和unknown

- {}: 包含除了null和undefined之外的所有值
- object: 包含了所有的非primitive类型，即不包含12,‘test’等基本类型 在引入unknown之前，多使用{},在引入unknown之后，基本上不需要再使用{}类型

