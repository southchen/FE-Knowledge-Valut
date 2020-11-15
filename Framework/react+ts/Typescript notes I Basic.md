[toc]

# Typescript nots - I Basic

## Basic types

<img src="./types.png" alt="types" style="zoom:70%;" />

类型是所有满足某些特征的 JS 值的集合。举个例子，**`number`** 类型，是所有浮点数、`NaN`、±`Infinity`、`-0` 的集合。
我们知道，集合具有下列三个特征：

- 确定性：给定一个元素，可以明确地判断其是否属于该集合。
- 互异性：集合中不存在两个相同的元素。
- 无序性：集合中的元素任意排列，仍然表示相同的集合。

Top typ: super type of any other type

### any

泛指一切可能的类型，对应全集。`T & any = any`，`any` 类型在任意运算中都是有传染性的

```ts
any = AnyTypes
AnyTypes = any
any | AnyTypes =any
```

### Unknown

All types are assignable to `unknown`. The `unknown` type is only assignable to the `any` type and the `unknown` type itself. 

In a union type, `unknown` absorbs every type. This means that if any of the constituent types is `unknown`, the union type evaluates to `unknown`:

```ts
unknown = AnyType
AnyTypes = unknown ❌
AnyTypes | unknown = unknown
any | unknown = any

never extends unknown  //true
keyof unknown //never
```

can be used after the types are narrowed down, otherwise only access to `!=` `==` operation

> You can compare unknown values (with ==, ===, ||, &&, and ?), negate them (with !), and refine them (like you can any other type) with JavaScript’s typeof and instanceof operators. 

We can narrow the `unknown` type to a more specific type in different ways, including the `typeof` operator, the `instanceof` operator, and custom type guard functions.



Bottom type: subtype of any other types

### never

`never` 是 `|` 运算的幺元，即 `x | never = x`。

`never` 类型对应空集。任何值，即使是 `undefined` 或 `null` 也不能赋值给 `never` 类型。对于任意类型 T， `T ∩ never = never`，`T ∪ never = T`。

- 一个中途抛出错误，或者存在死循环的函数永远不会有返回值，其返回类型是 `never`。
- 在某些情况下，TS 会将空数组推断成 `never` 类型，这是因为在实际中，空数组经常被作为默认值使用。
- 访问 never 类型变量的任意属性都是理论上可行的，虽然没有意义，因为 `never` 类型并不会有实例。

```ts
never = AnyTypes  ❌
never = never
AnyTypes = never
AnyTypes & never //never
AnyTypes | never // AnyTypes
```

#### Never vs void

```ts
// Return type: void
function failwith1(message: string) {
  throw new Error(message);
}

// Return type: never
const failwith2 = function(message: string) {
  throw new Error(message);
};
```

 If you want a function declaration to have the return type `never`, you can explicitly annotate it:

```ts
function failwith1(message: string): never {
  throw new Error(message);
}
```

### Tuple

Tuple is subtype of Array

```ts
// An array of train fares, which sometimes vary depending on direction
let trainFares: [number, number?][] = [
  [3.75],
  [8.25, 7.70],
  [10.50]
]
// A list of strings with at least 1 element
let friends: [string, ...string[]] = ['Sara', 'Tali', 'Chloe', 'Claire']
```

Readonly

```ts
let as: readonly number[] = [1, 2, 3]     // readonly number[]
let bs: readonly number[] = as.concat(4)  // readonly number[]
as[4] = 5            // Error TS2542: Index signature in type
```

### void null undefined

In TypeScript the only thing of type `undefined` is the value `undefined`, and the only thing of type` null` is the value `null`.

`undefined` means that something hasn’t been defined yet, and null means an absence of a value (like if you tried to compute a value, but ran into an error along the way). 

### Enum & number

Enums are a way to enumerate the possible values for a type. They are unordered data structures that map keys to values. Think of them like objects where the keys are fixed at compile time

A const enum doesn’t let you do reverse lookups, and so behaves a lot like a regular JavaScript object.

```ts
const enum Language {
  English,
  Spanish,
  Russian
}
// Accessing a valid enum key
let a = Language.English  // Language
// Accessing an invalid enum key
let b = Language.Tagalog  // Error TS2339: Property 'Tagalog' does not exist
                          // on type 'typeof Language'.
// Accessing a valid enum value
let c = Language[0]       // Error TS2476: A const enum member can only be
                          // accessed using a string literal.
```

All numbers are also assignable to enums! That behavior is an unfortunate consequence of TypeScript’s assignability rules, 

```ts
function translate(arg:Language):void{
   //...
}
translate(Language.English)
translate(11)
```

### Array, Tuple

When we use non-empty Array literals, TypeScript’s default is to infer list types (not tuple types):

```ts
// %inferred-type: (string | number)[]
const arr = [123, 'abc'];

const pair2: [number, number] = [1, 2];
func(pair2); // OK
```

## Literal type

* boolean

  ```ts
  type Result<T> =
    | { success: true; value: T }
    | { success: false; error: string };
    function parseEmailAddress(
    input: string | null | undefined
  ): Result<string> {
    // If the input is null, undefined, or the empty string
    // (all of which are falsy values), we return early.
    if (!input) {
      return {
        success: false,
        error: "The email address cannot be empty."
      };
    }
  
    // We're only checking that the input matches the pattern
    //   <something> @ <something> DOT <something>
    // to keep it simple. Properly validating email addresses
    // via regex is hard, so let's not even try here.
    if (!/^\S+@\S+\.\S+$/.test(input)) {
      return {
        success: false,
        error: "The email address has an invalid format."
      };
    }
  
    // At this point, control flow based type analysis
    // has determined that the input has type string.
    // Thus, we can assign input to the value property.
    return {
      success: true,
      value: input
    };
  }
  const parsed = parseEmailAddress("example@example.com");
  
  if (parsed.success) {
    parsed.value; // OK
    parsed.error; // Error
  } else {
    parsed.value; // Error
    parsed.error; // OK
  }
  ```

  

* string

  * A string literal type can be considered a subtype of the string type. This means that a string literal type is assignable to a plain string, but not vice-versa.

  ```TS
  interface Cash {
    kind: "cash";
  }
  
  interface PayPal {
    kind: "paypal";
    email: string;
  }
  
  interface CreditCard {
    kind: "credit";
    cardNumber: string;
    securityCode: string;
  }
  type PaymentMethod = Cash | PayPal | CreditCard;
  function describePaymentMethod(method: PaymentMethod) {
    switch (method.kind) {
      case "cash":
        // Here, method has type Cash
        return "Cash";
  
      case "paypal":
        // Here, method has type PayPal
        return `PayPal (${method.email})`;
  
      case "credit":
        // Here, method has type CreditCard
        return `Credit card (${method.cardNumber})`;
    }
  }
  ```

  

* Enum

  ```TS
  const enum HttpPort {
    Http = 80,
    Https = 443
  }
  function getScheme(port: HttpPort.Http): "http";
  function getScheme(port: HttpPort.Https): "https";
  function getScheme(port: HttpPort): "http" | "https" {
    switch (port) {
      case HttpPort.Http:
        return "http";
      case HttpPort.Https:
        return "https";
    }
  }
  
  const scheme = getScheme(HttpPort.Http);
  // Type "http"
  ```

  

* Numeric

#### Unions of string literal types can be checked for exhaustiveness

```ts
enum NoYesEnum {
  No = 'No',
  Yes = 'Yes',
}
function toGerman1(value: NoYesEnum): string {
  switch (value) {
    case NoYesEnum.No:
      return 'Nein';
    case NoYesEnum.Yes:
      return 'Ja';
  }
}
////
function toGerman2(value: NoYesStrings): string {
  switch (value) {
    case 'No':
      return 'Nein';
    case 'Yes':
      return 'Ja';
  }
}
```



```ts
// %inferred-type: readonly ["igneous", "metamorphic", "sedimentary"]
const rockCategories =
  ['igneous', 'metamorphic', 'sedimentary'] as const;

// %inferred-type: string[]
const rockCategories2 = ['igneous', 'metamorphic', 'sedimentary'];
```

```ts
const messages: string[] = ['Hello'];

// %inferred-type: string
const message = messages[3]; // (A)

const messages: [string] = ['Hello'];
// @ts-ignore: Tuple type '[string]' of length '1' has no element
// at index '1'. (2493)
const message = messages[1];
```

### object (non-primitive type) 

```ts
let a: object = {
  b: 'x'
}
a.b   // Error TS2339: Property 'b' does not exist on type 'object'.
```

use object literal syntax to define the type of object (not to be confused with type literals). 

> TYPE LITERAL
> A type that represents a single value and nothing else.
>
> 对象类型的单一属性、单一函数类型叫做一条签名。

```ts
interface ExampleInterface {
  // Property signature
  myProperty: boolean;

  // Method signature
  myMethod(str: string): number;

  // Index signature
  [key: string]: any;

  // Call signature
  (num: number): string;

  // Construct signature
  new(str: string): ExampleInstance; 
}
```

签名可以类比成集合间的映射。 它把冒号左边的原像集、连同签名方式，映射到右边的像集。

### Object vs object vs {}

`Object` (uppercase “O”) in TypeScript: instances of class `Object`

TypeScript has two built-in interfaces:

- Interface `Object` specifies the properties of instances of `Object`, including the properties inherited from `Object.prototype`.
- Interface `ObjectConstructor` specifies the properties of class `Object`.

In TypeScript, `object` is the type of all non-primitive values (primitive values are `undefined`, `null`, booleans, numbers, bigints, strings). With this type, we can’t access any properties of a value.

If an interface is empty (or the object type literal `{}` is used), excess properties are always allowed:

```ts
interface Empty { }
interface OneProp {
  myProp: number;
}

// @ts-ignore: Type '{ myProp: number; anotherProp: number; }' is not
// assignable to type 'OneProp'.
//   Object literal may only specify known properties, and
//   'anotherProp' does not exist in type 'OneProp'. (2322)
const a: OneProp = { myProp: 1, anotherProp: 2 };
const b: Empty = {myProp: 1, anotherProp: 2}; // OK
```

TypeScript has three confusing types: `Object`, `{}` and `object`.

You can assign `null` and `undefined` to all three types if `strictNullChecks` compiler option is disabled otherwise the compile error occurs.

### Object

Contains stuff (like `toString()`, `hasOwnProperty()`) that is present in all JavaScript objects. Any value (primitive, non-primitive) can be assigned to `Object` type.

### {}

`{}` is an empty object. It is the same as `Object`.

### object

`object` [was introduced in TypeScript 2.2](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-2.html). It is any **non-primitive type**. You can't assign to it any primitive type like `bool`, `number`, `string`, `symbol`.

Thus, if you will try this:

```js
var strictTypeHeaders: { [key: string]: string } = {}; // non-primitive type
var header: object = {};
header = strictTypeHeaders; // its OK
strictTypeHeaders = header; // causes error "Type 'object' is not assignable to type '{ [key: string]: string }`"
```

you will get the compile error on the last line. This happens because `{ [key: string]: string }` type is more specific than `object` type. There is no any error on `header = strictTypeHeaders` since both types are non-primitive and `object` is more common type than `{ [key: string]: string }`



### Excess object member - object literal type

### excess property checking

when you try to assign a fresh object literal type T to another type U, and T has properties that aren’t present in U, TypeScript reports an error.

If that object literal either uses a type assertion or is assigned to a variable, then the fresh object literal type is widened to a regular object type, and its freshness disappears.

Object literal notation has one special case: empty object types ({}). 

Every type—except null and undefined—is assignable to an empty object type, which can make it tricky to use. Try to avoid empty object types when possible:

```ts
let danger: {};
danger = {};
danger = { x: 1 };
console.log(danger);  //{ x: 1 }
danger.x=2   //Property 'x' does not exist on type '{}'.
danger = [];
danger = 2;
```

```ts
// %inferred-type: Object
const obj1 = new Object();
// %inferred-type: any
const obj2 = Object.create(null);
// %inferred-type: {}
const obj3 = {};
// %inferred-type: { prop: number; }
const obj4 = {prop: 123};
// %inferred-type: object
const obj5 = Reflect.getPrototypeOf({});
```

In principle, the return type of `Object.create()` could be `object`. However, `any` allows us to add and change properties of the result.

### function signatures/ call signatures

```ts
(a: number, b: number) => number

interface Repeat {
  (str: string, times: number): string; 
}
type Repeat = (str: string, times: number) => string;
```

This is TypeScript’s syntax for a function’s type, or call signature (also called a type signature)

shorthand

```ts
type ShortHand = (a:number)=>void
```

Longhand

```ts
type LongHand ={
(a:number):void
}
```

### function overload

> A function with multiple call signatures. 

```ts
function addEventListener(elem: HTMLElement, type: 'click',
  listener: (event: MouseEvent) => void): void;
function addEventListener(elem: HTMLElement, type: 'keypress',
  listener: (event: KeyboardEvent) => void): void;
function addEventListener(elem: HTMLElement, type: string,  // (A)
  listener: (event: any) => void): void {
    elem.addEventListener(type, listener); // (B)
  }
```

### Function Assignbility

```ts
Trg=Src
```

`Src` and `Trg` are function types and:

- `Trg` has a rest parameter or the number of required parameters of `Src` is less than or equal to the total number of parameters of `Trg`.
- For parameters that are present in both signatures, each parameter type in `Trg` is assignable to the corresponding parameter type in `Src`.
- The return type of `Trg` is `void` or the return type of `Src` is assignable to the return type of `Trg`.

## Type Relationship

### Subtyping

If you have two types A and B, and B is a subtype of A, then you can safely use a B anywhere an A is required 

```ts
A extends B => A is subtype of B
```

### Variance

A <: B    "A is a subtype of or the same as the type B.”
A >: B    "A is a supertype of or the same as the type B.”

* Invariance
  You want exactly a T.
* Covariance
  You want a <:T.
* Contravariance
  You want a >:T.
* Bivariance
  You’re OK with either <:T or >:T.

A function A is a subtype of function B if A has the same or lower arity (number of parameters) than B and:

* A’s this type either isn’t specified, or is >: B’s this type.
* Each of A’s parameters is >: its corresponding parameter in B.
* A’s return type is <: B’s return type.

**parameters must be >: their counterparts in B, while its return type has to be <:!**

### Assignability

当且仅当类型 B 是 A 的子集时，A 兼容 B，B 可以被当成 A 处理。

`assignability` refers to TypeScript’s rules for whether or not you can use a type A where another type B is required)

For non-enum types, A is assignable to B if either of the following is true:

* A <: B.
* A is any

For enum types created with the enum or const enum keywords, a type A is assignable to an enum B if either of these is true:

* A is a member of enum B.
* B has at least one member that’s a number, and A is a number.

## Interface & type alias

Interfaces don’t have to extend other interfaces. In fact, an interface can extend any shape: an object type, a class, or another interface.

when you extend an interface, TypeScript will make sure that the interface you’re extending is assignable to your extension. 

```ts
interface A {
  good(x: number): string
  bad(x: number): string
}

interface B extends A {
  good(x: string | number): string
  bad(x: string): string  // Error TS2430: Interface 'B' incorrectly extends
```

And if your interface declares generics, those generics have to be declared the exact same way for two interfaces to be mergeable—down to the generic’s name!

```ts
interface User<Age extends number> {  // Error TS2428: All declarations of 'User'
  age: Age                            // must have identical type parameters.
}

interface User<Age extends string> {
  age: Age
}
```

### constructor signature

TypeScript’s way of saying that a given type can be instantiated with the new operator

```ts
interface StringDatabaseConstructor {
  new(): StringDatabase //construcor signature
  from(state: State): StringDatabase
}
```

```ts
let a = [1, true] // (number | boolean)[]
//too general
//create our own tuple creator function:
function tuple< 
  T extends unknown[] //T is subtype of unkonwn[] => an array of any type
>(
  ...ts: T 
): T { 
  return ts 
}
let a = tuple(1, true) // [number, boolean]
```

## Type Widening

```ts
enum FlexDirection {
  Row,
  Column
}
const enumLiteral = FlexDirection.Row; // Type FlexDirection.Row
let widenedEnumLiteral = enumLiteral; // Type FlexDirection


// Type: "GET"
const httpRequestMethod = "GET";
// Type: string
let httpRequestMethod = "GET";
// OK, no type error
httpRequestMethod = "POST";
//for enum-style mapping objec
const HTTPRequestMethod = {
  CONNECT: "CONNECT",
  DELETE: "DELETE",
  GET: "GET",
  HEAD: "HEAD",
  OPTIONS: "OPTIONS",
  PATCH: "PATCH",
  POST: "POST",
  PUT: "PUT",
  TRACE: "TRACE"
};
// Type: string
const httpRequestMethod = HTTPRequestMethod.GET;
```

The following example makes it a bit more obvious why TypeScript shouldn't infer a string literal type for object properties initialized with a string literal:

```ts
// Type: { name: string, jobTitle: string }
const person = {
  name: "Marius Schulz",
  jobTitle: "Software Engineer"
};

// OK, no type error
person.jobTitle = "Front End Engineer";
```

- `String literal types` are widened to type `string`
- `Numeric literal types`are widened to type `number`
- `Boolean literal types` are widened to type `boolean`
- [Enum literal types]are widened to the type of the containing enum

```ts
const a: {b: number} = { //use const
  b: 12
}            // Still {b: number}
```

That’s because JavaScript objects are mutable, and for all TypeScript knows you might update their fields after you create them.

```ts
let a = 'x'               // string
const d = {x: 3}          // {x: number}
enum E {X, Y, Z}
let e = E.X               // E
//Not so for immutable declarations:
const a = 'x'             // 'x'
const c = true            // true
```

### explicit type annotation 

to prevent your type from being widened:

```ts
let a: 'x' = 'x'          // 'x'
const d: {x: 3} = {x: 3}  // {x: 3}”
```

## as const

`const` Assertions for Literal Expressions

A `const` assertion is a special type assertion that uses the `const` keyword instead of a specific type name. Using a `const` assertion on a literal expression has the following effects:

1. No literal types in the literal expression will be [widened]
2. Object literals will get [`readonly` properties]
3. Array literals will become [`readonly` tuples]

const opts your type out of widening and recursively marks its members as readonly, even for deeply nested data structures

```ts
let a = {x: 3}                // {x: number}
let b: {x: 3}                 // {x: 3}
let c = {x: 3} as const       // {readonly x: 3}
```

read only

### Using TypeScript Enums

```tsx
enum HTTPRequestMethod {
  CONNECT = "CONNECT",
  DELETE = "DELETE",
  GET = "GET",
  HEAD = "HEAD",
  OPTIONS = "OPTIONS",
  PATCH = "PATCH",
  POST = "POST",
  PUT = "PUT",
  TRACE = "TRACE"
}
// Type: "GET"
const httpRequestMethod = HTTPRequestMethod.GET;
```



## Type Guard / Type narrowing

TypeScript performs flow-based type inference, which is a kind of symbolic execution

### user-defined type guard

using type directive `is`

> As soon as you leave that scope, the refinement doesn’t carry over to whatever new scope you’re in.