[toc]

#### 泛型工具类型

为了方便开发者 TypeScript 内置了一些常用的工具类型，比如 Partial、Required、Readonly、Record 和 ReturnType 等。出于篇幅考虑，这里我们只简单介绍 Partial 工具类型。不过在具体介绍之前，我们得先介绍一些相关的基础知识，方便读者自行学习其它的工具类型。

##### 1.typeof

在 TypeScript 中，`typeof` 操作符可以用来获取一个变量声明或对象的类型。

```typescript
interface Person {
  name: string;
  age: number;
}

const sem: Person = { name: 'semlinker', age: 33 };
type Sem= typeof sem; // -> Person

function toArray(x: number): Array<number> {
  return [x];
}

type Func = typeof toArray; // -> (x: number) => number[]

```

##### 2.keyof

`keyof` 操作符是在 TypeScript 2.1 版本引入的，该操作符可以用于获取某种类型的所有键，其返回类型是联合类型。

```typescript
interface Person {
  name: string;
  age: number;
}

type K1 = keyof Person; // "name" | "age"
type K2 = keyof Person[]; // "length" | "toString" | "pop" | "push" | "concat" | "join" 
type K3 = keyof { [x: string]: Person };  // string | number

```

在 TypeScript 中支持两种索引签名，数字索引和字符串索引：

```typescript
interface StringArray {
  // 字符串索引 -> keyof StringArray => string | number
  [index: string]: string; 
}

interface StringArray1 {
  // 数字索引 -> keyof StringArray1 => number
  [index: number]: string;
}

```

为了同时支持两种索引类型，就得要求数字索引的返回值必须是字符串索引返回值的子类。**其中的原因就是当使用数值索引时，JavaScript 在执行索引操作时，会先把数值索引先转换为字符串索引**。所以 `keyof { [x: string]: Person }` 的结果会返回 `string | number`。

##### 3.in

`in` 用来遍历枚举类型：

```typescript
type Keys = "a" | "b" | "c"

type Obj =  {
  [p in Keys]: any
} // -> { a: any, b: any, c: any }

```

##### 4.infer

在条件类型语句中，可以用 `infer` 声明一个类型变量并且对它进行使用。

```typescript
type ReturnType<T> = T extends (
  ...args: any[]
) => infer R ? R : any;

```

以上代码中 `infer R` 就是声明一个变量来承载传入函数签名的返回值类型，简单说就是用它取到函数返回值的类型方便之后使用。

##### 5.extends

有时候我们定义的泛型不想过于灵活或者说想继承某些类等，可以通过 extends 关键字添加泛型约束。

```typescript
interface Lengthwise {
  length: number;
}

function loggingIdentity<T extends Lengthwise>(arg: T): T {
  console.log(arg.length);
  return arg;
}

```

现在这个泛型函数被定义了约束，因此它不再是适用于任意类型：

```typescript
loggingIdentity(3);  // Error, number doesn't have a .length property

```

这时我们需要传入符合约束类型的值，必须包含必须的属性：

```typescript
loggingIdentity({length: 10, value: 3});

```



##### Extend

接口和类型别名都能够被扩展，但语法有所不同。此外，接口和类型别名不是互斥的。接口可以扩展类型别名，而反过来是不行的。

**Interface extends interface** 

```typescript
interface PartialPointX { x: number; }
interface Point extends PartialPointX { 
  y: number; 
}

```

**Type alias extends type alias**

```typescript
type PartialPointX = { x: number; };
type Point = PartialPointX & { y: number; };

```

**Interface extends type alias**

```typescript
type PartialPointX = { x: number; };
interface Point extends PartialPointX { y: number; }

```

**Type alias extends interface**

```typescript
interface PartialPointX { x: number; }
type Point = PartialPointX & { y: number; };

```


