[toc]

Generic types are functions at the metalevel – for example:

```ts
type Wrap<T> = [T];
```

The generic type `Wrap<>` has the parameter `T`. Its result is `T`, wrapped in a tuple type. This is how we use this metafunction:

```ts
// %inferred-type: [string]
type Wrapped = Wrap<string>;
```

This is how `keyof` handles intersection types and union types:

```ts
type A = { a: number, shared: string };
type B = { b: number, shared: string };

// %inferred-type: "a" | "b" | "shared"
type Result1 = keyof (A & B);

// %inferred-type: "shared"
type Result2 = keyof (A | B);
```

### Union types (`|`) 

The members of the result are members of **at least one of the operands**.

Due to each member of a union type being a member of *at least* one of the component types, we can only safely access properties that are shared by all component types 



### Intersection types (`&`) 

 The members of the result are members of both operands.

### Conditional types 

A *conditional type* has the following syntax:

```ts
«Type2» extends «Type1» ? «ThenType» : «ElseType»
```

If `Type2` is assignable to `Type1`, then the result of this type expression is `ThenType`. Otherwise, it is `ElseType`.

Conditional types are [*distributive*](https://en.wikipedia.org/wiki/Distributive_property): Applying a conditional type `C` to a **union type** `U` is the same as the union of applying `C` to each component of `U`. distributivity enables us to “loop” over the components of a union type.

Interpreted as a set, type `never` is empty. Therefore, if it appears in a union type, it is ignored:

```ts
// %inferred-type: "a" | "b"
type Result = 'a' | 'b' | never;
```

#### Exclude<T, U> Extract<T, U>

```ts
/**
 * Exclude from T those types that are assignable to U
 */
type Exclude<T, U> = T extends U ? never : T;
```

```ts
/**
 * Extract from T those types that are assignable to U
 */
type Extract<T, U> = T extends U ? T : never;
```



A *mapped type* produces an object by looping over a collection of keys – for example:

```ts
// %inferred-type: { a: number; b: number; c: number; }
type Result = {
  [K in 'a' | 'b' | 'c']: number
};
```

The operator `in` is a crucial part of a mapped type: It specifies where the keys for the new object literal type come from.

create a new object type :

#### Pick<T, K>

```ts
/**
 * From T, pick a set of properties whose keys are in the union K
 */
type Pick<T, K extends keyof T> = {
  [P in K]: T[P];
};
```

#### Omit<T, K>

```ts
**
 * Construct a type with the properties of T except for those in type K.
 */
type Omit<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>;
```

### The index type query operator `keyof`

```ts
type A = { a: number, shared: string };
type B = { b: number, shared: string };

// %inferred-type: "a" | "b" | "shared"
type Result1 = keyof (A & B);

// %inferred-type: "shared"
type Result2 = keyof (A | B);
```

### The indexed access operator `T[K]`

The indexed access operator `T[K]` returns the types of all properties of `T` whose keys are assignable to type `K`. `T[K]` is also called a *lookup type*.

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
```

```ts
type Obj = {
  [key: string]: RegExp, // (A)
};

// %inferred-type: string | number
type KeysOfObj = keyof Obj;

// %inferred-type: RegExp
type ValuesOfObj = Obj[string];
```

`KeysOfObj` includes the type `number` because number keys are a subset of string keys in JavaScript (and therefore in TypeScript).

The bracket operator is also distributive:

```ts
type MyType = { prop: 1 } | { prop: 2 } | { prop: 3 };

// %inferred-type: 1 | 2 | 3
type Result1 = MyType['prop'];

// Equivalent:
type Result2 =
  | { prop: 1 }['prop']
  | { prop: 2 }['prop']
  | { prop: 3 }['prop']
;
```

### The type query operator `typeof`

The type operator `typeof` converts a (JavaScript) value to its (TypeScript) type. Its operand must be an identifier or a sequence of dot-separated identifiers:

```ts
const str = 'abc';

// %inferred-type: "abc"
type Result = typeof str;
```

The first `'abc'` is a value, while the second `"abc"` is its type, a string literal type.