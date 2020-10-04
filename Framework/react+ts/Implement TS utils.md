[toc]

# 手写TS

## Pick

```ts
type MyPick<T, K extends keyof T> = {
 [key in K]:T[key]
}
```

```ts
type MyReadonly<T> = {
  readonly [key in keyof T]:T[key]
}
```

## ArrayLike

```ts
interface ArrayLike<T> {
    readonly length: number;
    readonly [n: number]: T;
}

```

## Length

For given a tuple, you need create a generic `Length`, pick the length of the tuple

```ts
type Length<T extends any> =T extends ArrayLike<any>? T["length"]:never
```

## TupleToObject

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

## First of Array

```ts
type First<T extends any[]> = T extends [] ? never : T[0]
```

**Empty [],{} extendable** 

```ts
type EmpExten<T extends any[]>=T extends []?true:false
type a = EmpExten<[]>//true
type b = EmpExten<[1]>//false

```

```ts
type EmpExten<T extends {}>=T extends {}?true:false
type a = EmpExten<{}>//true
type b = EmpExten<{a:'a'}>//ture
```

```ts
type If<C extends boolean, T, F> =C extends true?T:F
//cannot be 
type If<C, T, F> =C extends true?T:F
```

```ts
type MyReturnType<T extends(...arg:any[])=>any> = T extends (...args:any[])=>infer R?R:never
//...args have to be an array
```

## Omit

```ts
type MyExclude<T,K>=T extends K?never:T
type MyPick<T,K extends keyof T>={
[key in K]:T[key]
}
type MyOmit<T, K> = MyPick<T,MyExclude<keyof T,K>>

```

## ReadOnly2

 Implement a generic `MyReadonly2<T, K>` which takes two type argument `T` and `K`. 

 `K` specify the set of properties if `T` that should set to Readonly. When `K` is not provided, it should make all properties readonly just like the normal `Readonly<T>`.

```ts
type Combine<T> = {
  [k in keyof T]: T[k]
}

type MyReadonly2<T, K extends keyof T = keyof T> = Combine<T & {  
  readonly [S in K]: T[S]
}>
```



```ts
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

## DeepReadonly

```ts
type DeepReadonly<T> = keyof T extends never
  ? T
  : { readonly [k in keyof T]: DeepReadonly<T[k]> };
```

```ts
// type DeepReadonly<T> = {
//   [key in keyof T]:T[key] extends {}?DeepReadonly<T[key]>:T[key] ❌
// }
// type DeepReadonly<T> = {
//   [key in keyof T]:T[key] extends object?DeepReadonly<T[key]>:T[key] ❌
// }
type DeepReadonly<T> = {
  readonly [key in keyof T]: T[key] extends Function | string | number ? T[key] : DeepReadonly<T[key]>;
};

type DeepReadonly<T> = {
  readonly [k in keyof T]: T[k] extends Record<any, any>
    ? T[k] extends Function
      ? T[k]
      : DeepReadonly<T[k]>
    : T[k]
}
```

## upleToUnion

```ts
type TupleToUnion<T extends any[]> = T[number]
```

## Last

```ts
//type Last<T extends any[]> = T[T['length']-1] ❌

type Last<T extends any[]> = [any, ...T][T["length"]];

type Last<T extends any[]> = T extends [...infer P, infer L] ? L : never
//prepend
type Prepend<T extends any[], V> = ((a: V, ...r: T) => any) extends (...r: infer Q) => any ? Q : never
type Last<T extends any[]> = Prepend<T, any>[T['length']]
```

## Pop
```
type Pop<T extends any[]> = T extends [...infer pre,infer R]?pre:never
```

## PromiseAll

```ts
declare function PromiseAll<T extends any[]>(values: readonly [...T]):
  Promise<{ [K in keyof T]: T[K] extends Promise<infer R> ? R : T[K] }>;

const promiseAllTest1 = PromiseAll([1, 2, 3] as const) //Promise<[1, 2, 3]>
const promiseAllTest2 = PromiseAll([1, 2, Promise.resolve(3)] as const) //Promise<[1, 2, number]>
const promiseAllTest3 = PromiseAll([1, 2, Promise.resolve(3)]) //Promise<[number, number, number]>

```

## LookUp

```ts
type LookUp<U, T extends string> = {
  [K in T]: U extends { type: T } ? U : never
}[T]


interface Cat {
  type: 'cat'
  breeds: 'Abyssinian' | 'Shorthair' | 'Curl' | 'Bengal'
}

interface Dog {
  type: 'dog'
  breeds: 'Hound' | 'Brittany' | 'Bulldog' | 'Boxer'
  color: 'brown' | 'white' | 'black'
}

type Animal = Cat | Dog

LookUp<Animal, 'dog'> //Dog
LookUp<Animal, 'cat'> //Cat
```

## Append Argument

```ts

type AppendArgument<Fn, A> = Fn extends (...args: infer R) => any? (...args:[...R,A])=>ReturnType<Fn>:never

```

## Chainable Options

```ts
type Chainable<T = {}> = {
  option<S extends string | number | symbol, U>(key: S, value: U): Chainable<T & {[k in S]: U}>
  get(): T
}


declare const a: Chainable

const result = a
  .option('foo', 123)
  .option('bar', { value: 'Hello World' })
  .option('name', 'type-challenges')
  .get()

type Expected = {
  foo: number
  bar: {
    value: string
  }
  name: string
}
```

## Required key

```ts
//Pick
type RequiredKeys<T> = {[P in keyof T] -? : {} extends Pick<T, P> ? never : P}[keyof T]

//Record
type RequiredKeys<T> = {
    [K in keyof T]-?: T extends Record<K, T[K]> ? K : never
}[keyof T];

```

## GetRequired

  Implement the advanced util type `GetRequired<T>`, which remains all the required fields

```ts
type GetRequired<T> = Pick<T,{[P in keyof T]-?:{} extends Pick<T,P> ? never : P}[keyof T]>
```

```ts
type MapToNever<T> = {
  [P in keyof T] : never
}

type PickNever<T> = {
  [P in keyof T] -?: T[P] extends never ? P : never
}[keyof T]

type GetRequired<T> = {[P in PickNever<MapToNever<T>>] : T[P]}
```

