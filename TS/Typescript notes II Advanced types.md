[toc]

# Typescript nots - II Advanced types

## Generic

Generic types are functions at the metalevel 

承载了从静态定义到动态调用的桥梁，同时也是 TS 对自己类型定义的元编程。

### type parameter

A placeholder type used to enforce a type-level constraint in multiple places. Also known as polymorphic type parameter.

### generic bound

```typescript
//no constraint
function fill<T>(length: number, value: T): T[] {
  return new Array(length).fill(value);
}
//has to have a constraint
function sum<T extends number>(value: T[]): number {
  let count = 0;
  value.forEach(v => count += v);
  return count;
}
```



```ts
type Filter = {
  <T>(array: T[], f: (item: T) => boolean): T[]
}
//Because T is scoped to a single signature, TypeScript will bind the T in this signature to a concrete type when you call a function of type filter. Each call to filter will get its own binding for T.
let filter: Filter = (array, f) =>
  // ...
```

Because we declared <T> as part of a call signature (right before the signature’s opening parenthesis, (), TypeScript will bind a concrete type to T when we actually call a function of type Filter.

```ts
type Filter<T> = {
  (array: T[], f: (item: T) => boolean): T[]
}
//Because T is declared as part of Filter’s type (and not part of a specific signature’s type), TypeScript will bind T when you declare a function of type Filter.

let filter: Filter = (array, f) => // Error TS2314: Generic type 'Filter'
  // ...                           // requires 1 type argument(s).”

//shorthand
type Filter = <T>(array: T[], f: (item: T) => boolean) => T[] 
```

For each of TypeScript’s ways to declare a call signature, there’s a way to add a generic type to it

## Bounded Polymorphism

Sometimes, saying “this thing is of some generic type T and that thing has to have the same type T" just isn’t enough. Sometimes you also want to say **“the type U should be at least T.”** We call this putting an upper bound on U.
Add constraints:

```ts
function mapNode<T extends TreeNode>(  //👈
  node: T, 
  f: (value: string) => string
): T {
      return {
    ...node,
    value: f(node.value)
  }
}
```

#### model arity

Another place where you’ll find yourself using bounded polymorphism is to model variadic functions (functions that take any number of arguments). 

```ts
function call<T extends unknown[], R>( //T is a subtype of unknown[] => an array or tuple of any type.
  f: (...args: T) => R, 
  ...args: T 
): R { 
  return f(...args)
}
```

### Generic Type Defaults

```ts
type MyEvent<T extends HTMLElement = HTMLElement> = {
  target: T
  type: string
}
```

## types operation vs value opration

```ts
//基本数值和literal type
'abc' | 'def', ; // type-level
'hello' // value-level

//类型别名和变量
type Age = number;  // type-level
let age = 1 // value-level

//union和基本运算
type ID = number | string ; 
let id = 1 + 2;

//对象和record type
type Class = { teacher: string, room_no: string} 
let class = {teacher:'yj', room_no: 201}

//复合过程
type MakePair<T,U> = [T,U]
const make_pair = (x,y) => [x,y];
type Id<T> = T; 
const id = x => x;

//函数求值和泛型实例化
let pair = make_pair(1,2)
type StringNumberPair = MakePair<string,number>

//条件表达式和谓词
let res = x === true ? 'true': 'false'
type Result = x extends true ? 'true' : 'false'

//对象解构 和 extractType
const { name } = { name: 'yj'}

type NameType<T> = T extends { name: infer N } ? N : never;
type res = NameType<{name: 'yj'}>


//递归类型和递归函数
type List<T> = {
   val: T,
   next: List<T>
} | null

function length<T>(list: List<T>){
  return list === null ? 0 : 1 + length(list.next);
}


//map && filter && 遍历 & 查找

const res = [1,2,3].filter(x => x%2 ===0).map(x => 2*x)
type A = {
    0: 1,
    1: 2,
    2: '3',
    3: '4'
}
type Filtler<T extends Record<string,any>, Condition> = {
    [K in keyof T]: T[K] extends Condition ? T[K] : never
}[keyof T]
type B = Filtler<A, string> // 不支持内联写type function
```

## Generic component

```tsx
interface Props<T> {
  list: T[];
  children: (item: T, index: number) => React.ReactNode;
}
function List<T>({ list, children }: Props<T>) {
// 列表中其他逻辑...
return <div>{list.map(children)}</div>;
}

interface User {
  id: number;
  name: string;
}
const data: User[] = [
  {
    id: 1,
    name: "wayou"
  },
  {
    id: 1,
    name: "niuwayong"
  }
];
const App = () => {
return (
<div className="App">
<List list={data}>
{item => {
// 😁 此处 item 类型为 User
return <div key={item.name}>{item.name}</div>;
}}
</List>
<List list={["wayou", "niuwayong"]}>
{item => {
// 😁 此处 item 类型为 string
return <div key={item}>{item}</div>;
}}
</List>
</div>
);
};
```

#### Companion Object Pattern

we can use to pair together a type and an object.

## Mapped type

In essence, mapped types allow you to create new types from existing ones by mapping over property types. Each property of the existing type is transformed according to a rule that you specify. The transformed properties then make up the new type.

```ts
/**
 * Make all properties in T optional
 */
type Partial<T> = {
  [P in keyof T]?: T[P]
};

/**
 * From T pick a set of properties K
 */
type Pick<T, K extends keyof T> = {
  [P in K]: T[P]
};

/**
 * Construct a type with a set of properties K of type T
 */
type Record<K extends string, T> = {
  [P in K]: T
};
```

## Operation

### in 

in 只能用在类型的定义中，可以对枚举类型进行遍历

```
[ 自定义变量名 in 枚举类型 ]: 类型
```

A *mapped type* produces an object by looping over a collection of keys – for example:

```ts
// %inferred-type: { a: number; b: number; c: number; }
type Result = {
  [K in 'a' | 'b' | 'c']: number
};

// 这个类型可以将任何类型的键值转化成number类型
type TypeToNumber<T> = {
  [key in keyof T]: number
}
```

The operator `in` is a crucial part of a mapped type: It specifies where the keys for the new object literal type come from.

### keyof

```code
<type> = keyof <type>
```

Use keyof to get all of an object’s keys as a union of string literal types.

We can use the [`keyof` operator](https://mariusschulz.com/blog/keyof-and-lookup-types-in-typescript) to retrieve a union of [string literal types](https://mariusschulz.com/blog/string-literal-types-in-typescript) that contains all property keys of this object type:

```ts
type anyKey =keyof any //type anyKey = string | number | symbol
type anyArrKey = keyof any[]//number | "length" | "toString" | "toLocaleString" | "pop" | "push" | "concat" | "join" | "reverse" | "shift" | "slice" | "sort" | "splice" | "unshift" | "indexOf" | "lastIndexOf" | ... 16 more ... | "flat
type anyObjKey = keyof object//never
```

keyof 的一个典型用途是限制访问对象的 key 合法化，因为 any 做索引是不被接受的。

```typescript
function getValue (p: Person, k: keyof Person) {
  return p[k];  
  // 如果k不如此定义，则无法以p[k]的代码格式通过编译
}
```

### typeof

typeof 只能用在具体的对象上

```typescript
const me: Person = { name: 'gzx', age: 16 };
type P = typeof me;  // { name: string, age: number | undefined }
const you: typeof me = { name: 'mabaoguo', age: 69 }  // 可以通过编译

type PersonKey = keyof typeof me;   // 'name' | 'age'
```



### keying-in/ type lookup

Indexed Access Types

The indexed access operator `T[K]` returns the types of all properties of `T` whose keys are assignable to type `K`.

 `T[K]`, a so-called *indexed access type* or *lookup type*. It represents the type of the property `K` of the type `T`.

Note that you have to use bracket notation, not dot notation, to look up property types when keying in.

类型提取

```ts
type Obj = {
  0: 'a',
  1: 'b',
  prop0: 'c',
  prop1: 'd',
};

// %inferred-type: "a" | "b"
type Result1 = Obj[0 | 1];

// %inferred-type: "c" | "d"
type Result2 = Obj['prop0' | 'prop1'];

// %inferred-type: "a" | "b" | "c" | "d"
type Result3 = Obj[keyof Obj];

//keyof T
type ValueOf<T> = T[keyof T]
```

    ```ts
function prop<T, K extends keyof T>(obj: T, key: K) {
  return obj[key];
}
    ```

```tsx
interface ObjectConstructor {
  // ...
  entries<T extends { [key: string]: any }, K extends keyof T>(o: T): [keyof T, T[K]][];
  // ...
}
```

## nullish coalescing operator

 We can use this operator to provide a fallback value for a value that might be `null` or `undefined`.

```tsx
null ?? "n/a"
// "n/a"

undefined ?? "n/a"
// "n/a"
false ?? true
// false

0 ?? 100
// 0

"" ?? "n/a"
// ""

NaN ?? 0
// NaN
```



### Totality / exhaustiveness checking

 is what allows the typechecker to make sure you’ve covered all your cases.

Another way to precive types & interface

#### 复合类型

TypeScript 的复合类型可以分为两类：**set** 和 **map**。set 是指一个无序的、无重复元素的集合。而 map 则和 JS 中的对象一样，是一些没有重复键的键值对。

```ts
type Size = 'small' | 'default' | 'big' | 'large';
// map
interface IA {
    a: string
    b: number
}
```

#### 复合类型间的转换

```ts
// map => set
type IAKeys = keyof IA;    // 'a' | 'b'
type IAValues = IA[keyof IA];    // string | number
 
// set => map
type SizeMap = {
    [k in Size]: number
}
// 等价于
type SizeMap2 = {
    small: number
    default: number
    big: number
    large: number
}
```

## Advanced Types

#### Record

a way to describe an object as a map from something to something. With a regular index signature you can constrain the types of an object’s values, but the key can only be a regular string, number, or symbol; with Record, you can also constrain the types of an object’s keys to subtypes of string and number.

## Conditional types

distributive conditional types

在上面的conditional types里，如果我们的 checked type是 naked type那么 conditional types就被称为distributive conditional types。distributive conditional types具有如下性质

```ts
type F<T> = T extends U ? X : Y
type union_type = A | B | C
type a = F<union_type>
//那么a的结果为 A extends U ? X :Y | B extends U ? X :Y | C extends U ? X : Y
```

- 必须是checked type
- 必须是naked type
- T实例化为union type
  - boolean , any, never 被当作union

```ts
type Check<T> = T extends true ? 'true' : 'false'

type d = Check<any> // 'true' | 'false'
type e = Check<boolean> // 'true' | 'false'

type Boxed<T> = T extends any ? { value: T } : never;
type res = Boxed<never> // 结果为never
type res2 = never extends any ? { value: never} : never; // 结果为 { value: never}
```

```TS
type NonNullablePropertyKeys<T> = {
  [P in keyof T]: null extends T[P] ? never : P
}[keyof T];
type User = {
  name: string;
  email: string | null;
};

type NonNullableUserPropertyKeys = NonNullablePropertyKeys<User>;

type NonNullableUserPropertyKeys = {
  name: "name";
  email: never;
}[keyof User];
type NonNullableUserPropertyKeys = {
  name: "name";
  email: never;
}["name" | "email"];
type NonNullableUserPropertyKeys = "name";
```





## infer

```TS
type PromiseType<T> = (args: any[]) => Promise<T>;

type UnPromisify<T> = T extends PromiseType<infer U> ? U : never;
```



当infer被同一个类型变量用在多处时，infer推导出来的类型取决于这些位置是协变还是逆变。如果位置是协变的，那么推导出的类型是各个位置分别推导的类型的union，如果位置是逆变的，那么推导的类型是各个位置推导类型的intersection。

```TS
type Foo<T> = T extends { a: infer U, b: infer U } ? U : never;
type T10 = Foo<{ a: string, b: string }>;  // string
type T11 = Foo<{ a: string, b: number }>;  // string | number
```

```TS
type Bar<T> = T extends { a: (x: infer U) => void, b: (x: infer U) => void } ? U : never;
type T20 = Bar<{ a: (x: string) => void, b: (x: string) => void }>;  // string
type T21 = Bar<{ a: (x: string) => void, b: (x: number) => void }>;  // string & number
```

### infer + conditonal types

不用预先指定在泛型列表中，在运行时会自动判断，不过你得先预定义好整体的结构。

infer 的中文是“推断”的意思，一般是搭配上面的泛型条件语句使用的，所谓推断，就是你不用预先指定在泛型列表中，在运行时会自动判断，不过你得先预定义好整体的结构。举个例子

```typescript
type Foo<T> = T extends {t: infer Test} ? Test: string
```

`{t: infer Test}`可以看成是一个包含`t属性`的**类型定义**，这个`t属性`的 value 类型通过`infer`进行推断后会赋值给`Test`类型，如果泛型实际参数符合`{t: infer Test}`的定义那么返回的就是`Test`类型，否则默认给缺省的`string`类型。

```tsx
type One = Foo<number>  // string，因为number不是一个包含t的对象类型
type Two = Foo<{t: boolean}>  // boolean，因为泛型参数匹配上了，使用了infer对应的type
type Three = Foo<{a: number, t: () => void}> // () => void，泛型定义是参数的子集，同样适配
```

## Use cases

### 提取数组子元素

```ts
type Flatten<T> = T extends (infer U)[] ? U : T;
```

### 提取 Promise 值

```ts
type Unpromisify<T> = T extends Promise<infer R> ? R : T;
```

### Tuple 转 Union

```ts
type ElementOf<T> = T extends Array<infer E> ? E : never;
```

### Union 转 Intersection

```ts
type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends ((
  k: infer I
) => void)
  ? I
  : never;
```
