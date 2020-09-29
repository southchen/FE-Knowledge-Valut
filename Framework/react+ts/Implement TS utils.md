[toc]

# 手写TS

 Given an array, transform to a object type and the key/value must in the given array.

  ```ts
const tuple = ['tesla', 'model 3', 'model X', 'model Y'] as const
  
const result: TupleToObject<typeof tuple> // expected { tesla: 'tesla', 'model 3': 'model 3', 'model X': 'model X', 'model Y': 'model Y'}
  ```

```ts
type TupleToObject<T extends readonly any[]> = {
  [k in T[number]]:k
}
```

#  First of Array

```
type First<T extends any[]> = T extends [] ? never : T[0]
```



```
type MyExclude<T,K>=T extends K?never:T
type MyPick<T,K extends keyof T>={
[key in K]:T[key]
}
type MyOmit<T, K> = MyPick<T,MyExclude<keyof T,K>>

```





```
type Diff<A, B> = A extends B ? never : A
type Empty<T,K extends keyof T>={
  [S in Diff<keyof T,K>]:T[S]
}

type Only<T, K extends keyof T=keyof T> ={
  readonly [P in K]:T[P]
}
type MyReadonly2<T,K extends keyof T = keyof T>=Only<T,K> & Empty<T,K>
type a = Empty<Todo1,keyof Todo1>
type b = Only<Todo1,keyof Todo1>
type c = a & b
let cc:c={
 title:'a',
 completed:true,

}
```

```
// type DeepReadonly<T> = {
//   [key in keyof T]:T[key] extends {}?DeepReadonly<T[key]>:T[key]
// }

// type DeepReadonly<T> = keyof T extends never
//   ? T
//   : { readonly [k in keyof T]: DeepReadonly<T[k]> };

type DeepReadonly<T> = {
  readonly [k in keyof T]: T[k] extends Record<any, any>
    ? T[k] extends Function
      ? T[k]
      : DeepReadonly<T[k]>
    : T[k]
}
```



```ts
interface ArrayLike<T> {
    readonly length: number;
    readonly [n: number]: T;
}

```

For given a tuple, you need create a generic `Length`, pick the length of the tuple

```ts
type Length<T extends any> =T extends ArrayLike<any>? T["length"]:never
```





```ts
type fromempty<T>=T extends []?true:false
type a= fromempty<[]>//true
type b = fromempty<any[]>//false
```

