[toc]

## Arraylike

常用的类数组都有自己的定义，如`IArguments`,`NodeList`,`HTMLCollection`等：

```tsx
function sum(){
        let args:IArguments = arguments;
}
```

`IArguments`是 `TypeScript`中定义好的类型：

```tsx
interface IArguments {
        [index: number]: any;
        length: number;
        callee: Function;
}
```



## infer

```
type ReturnType<T extends (...args: any) => any> = T extends (...args: any) => infer R ? R : any;
```

如果传入的类型 `T` 能够赋值给 `(...args: any) => R` 则返回类型 `R`。

但是这里类型 `R` 从何而来？讲道理，泛型中的变量需要外部指定，即 `RetrunType<T,R>`，但我们不是要得到 R 么，所以不能声明在这其中。这里 `infer` 便解决了这个问题。表达式右边的类型中，加上 `infer` 前缀我们便得到了反解出的类型变量 `R`，配合 `extends` 条件类型，可得到这个反解出的类型 `R`。这里 `R` 即为函数 `(...args: any) => R` 的返回类型。

有了上面的基础，推而广之就很好反解 `Promise<T>` 中的 `T` 了。

```tsx
type PromiseType<T> = (args: any[]) => Promise<T>;

type UnPromisify<T> = T extends PromiseType<infer U> ? U : never;
```

反解还可用在其他很多场景，比如解析函数入参的类型。

```tsx
type VariadicFn<A extends any[]> = (...args: A) => any;
type ArgsType<T> = T extends VariadicFn<infer A> ? A : never;
 
type Fn = (a: number, b: string) => string;
type Fn2Args = ArgsType<Fn>; // [number, string]
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

## is

```ts
function isString(s: unknown): boolean {
  return typeof s === 'string'
}

function toUpperCase(x: unknown) {
  if(isString(x)) {
    x.toUpperCase() // Error, Object is of type 'unknown'
  }
}
```

**代码解释：**

第 7 行，可以看到 TypeScript 抛出了一个错误提示，一个 unknown 类型的对象不能进行 toUpperCase() 操作，可是在上一行明明已经通过 `isString()` 函数确认参数 x 为 string 类型，但是由于函数嵌套 TypeScript 不能进行正确的类型判断。

这时，就可以使用 `is` 关键字：

```ts
const isString = (s: unknown): s is string => typeof val === 'string'

function toUpperCase(x: unknown) {
  if(isString(x)) {
    x.toUpperCase()
  }
}
```

**解释：** 通过 is 关键字将类型范围缩小为 string 类型，这也是一种代码健壮性的约束规范。

## Type Guard

`instanceof`的右侧要求是一个构造函数，TypeScript将细化为：

1. 此构造函数的 `prototype`属性的类型，如果它的类型不为 `any`的话
2. 构造签名所返回的类型的联合



## unknown

`unknown` 类型不能赋值给除了 `unknown` 或 `any` 的其他任何类型，使用前必需显式进行指定类型，或是在有条件判断情况下能够隐式地进行类型推断的情况。

```ts
let a: unknown;
let b: number = <number>a;
function isNumber(val: any): val is number {
return typeof val === "number";
}

if (isNumber(a)) {
b = a;
}
```

正交类型（intersection type）中，`unknown` 不起作用：

联合类型（union type）中 `unknown` 起绝对作用：

```typescript
type T00 = unknown & null;  // null
type T01 = unknown & undefined;  // undefined
type T02 = unknown & null & undefined;  // null & undefined (which becomes never)
type T03 = unknown & string;  // string
type T04 = unknown & string[];  // string[]
type T05 = unknown & unknown;  // unknown
type T06 = unknown & any;  // any

type T10 = unknown | null;  // unknown
type T11 = unknown | undefined;  // unknown
type T12 = unknown | null | undefined;  // unknown
type T13 = unknown | string;  // unknown
type T14 = unknown | string[];  // unknown
type T15 = unknown | unknown;  // unknown
type T16 = unknown | any;  // any
```

条件类型（conditional type）中，

```typescript
type T30<T> = unknown extends T ? true : false;  // Deferred
type T31<T> = T extends unknown ? true : false;  // Deferred (so it distributes)

// `unknown` 不能赋值给 `number`
type foo = T30<number>; // false
// `unknown` 可以赋值给 `any`
type bar = T30<any>; // true
// 任何类型都可赋值给 unknown，所以都为 true
type a = T31<number>; // true
type b = T31<any>; // true
```

### 具体使用场景

`unknown` 用于变量类型不确定，但肯定可以确定的情形下，比如下面这个示例中，入参总归会有个值，根据这个值的类型进行不同的处理，这里使用 `unknown` 替代 `any` 则会更加类型安全。

```tsx
function prettyPrint(x: unknown): string {
  if (Array.isArray(x)) {
    return "[" + x.map(prettyPrint).join(", ") + "]"
  }
  if (typeof x === "string") {
    return `"${x}"`
  }
  if (typeof x === "number") {
    return String(x)
  } 
  return "etc."
}
```