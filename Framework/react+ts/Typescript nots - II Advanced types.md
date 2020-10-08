[toc]

# Typescript nots - II Advanced types



#### Companion Object Pattern

we can use to pair together a type and an object.



in 



### keyof

Use keyof to get all of an object’s keys as a union of string literal types.

```ts
type anyKey =keyof any //type anyKey = string | number | symbol
type anyArrKey = keyof any[]//number | "length" | "toString" | "toLocaleString" | "pop" | "push" | "concat" | "join" | "reverse" | "shift" | "slice" | "sort" | "splice" | "unshift" | "indexOf" | "lastIndexOf" | ... 16 more ... | "flat
type anyObjKey = keyof object//never
```

#### keying-in

just as you might look up a value in an object, so you can look up a type in a shape. Note that you have to use bracket notation, not dot notation, to look up property types when keying in.

[keyof T]

```ts
type ValueOf<T> = T[keyof T]
```

​    

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



#### Allowing excess properties in object literals

What if we want to allow excess properties in object literals? As an example, consider interface `Point` and function `computeDistance1()`:

```
interface Point {
  x: number;
  y: number;
}

function computeDistance1(point: Point) { /*...*/ }

// @ts-ignore: Argument of type '{ x: number; y: number; z: number; }'
// is not assignable to parameter of type 'Point'.
//   Object literal may only specify known properties, and 'z' does not
//   exist in type 'Point'. (2345)
computeDistance1({ x: 1, y: 2, z: 3 });
```

One option is to assign the object literal to an intermediate variable:

```
const obj = { x: 1, y: 2, z: 3 };
computeDistance1(obj);
```

A second option is to use a type assertion:

```
computeDistance1({ x: 1, y: 2, z: 3 } as Point); // OK
```

A third option is to rewrite `computeDistance1()` so that it uses a type parameter:

```
function computeDistance2<P extends Point>(point: P) { /*...*/ }
computeDistance2({ x: 1, y: 2, z: 3 }); // OK
```

A fourth option is to extend interface `Point` so that it allows excess properties:

```
interface PointEtc extends Point {
  [key: string]: any;
}
function computeDistance3(point: PointEtc) { /*...*/ }

computeDistance3({ x: 1, y: 2, z: 3 }); // OK
```

We’ll continue with two examples where TypeScript not allowing excess properties, is an issue.

##### 15.4.7.5.1 Allowing excess properties: example `Incrementor`

In this example, we’d like to implement an `Incrementor`, but TypeScript doesn’t allow the extra property `.counter`:

```
interface Incrementor {
  inc(): void
}
function createIncrementor(start = 0): Incrementor {
  return {
    // @ts-ignore: Type '{ counter: number; inc(): void; }' is not
    // assignable to type 'Incrementor'.
    //   Object literal may only specify known properties, and
    //   'counter' does not exist in type 'Incrementor'. (2322)
    counter: start,
    inc() {
      // @ts-ignore: Property 'counter' does not exist on type
      // 'Incrementor'. (2339)
      this.counter++;
    },
  };
}
```

Alas, even with a type assertion, there is still one type error:

```
function createIncrementor2(start = 0): Incrementor {
  return {
    counter: start,
    inc() {
      // @ts-ignore: Property 'counter' does not exist on type
      // 'Incrementor'. (2339)
      this.counter++;
    },
  } as Incrementor;
}
```

We can either add an index signature to interface `Incrementor`. Or – especially if that is not possible – we can introduce an intermediate variable:

```
function createIncrementor3(start = 0): Incrementor {
  const incrementor = {
    counter: start,
    inc() {
      this.counter++;
    },
  };
  return incrementor;
}
```

##### 15.4.7.5.2 Allowing excess properties: example `.dateStr`

The following comparison function can be used to sort objects that have the property `.dateStr`:

```
function compareDateStrings(
  a: {dateStr: string}, b: {dateStr: string}) {
    if (a.dateStr < b.dateStr) {
      return +1;
    } else if (a.dateStr > b.dateStr) {
      return -1;
    } else {
      return 0;
    }
  }
```

For example in unit tests, we may want to invoke this function directly with object literals. TypeScript doesn’t let us do this and we need to use one of the workarounds.