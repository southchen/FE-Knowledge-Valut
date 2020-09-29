# any vs unknown type

That is, when viewing types as sets of values (for more information on what types are, see [“What is a type in TypeScript? Two perspectives”](https://2ality.com/2020/02/understanding-types-typescript.html)), `any` and `unknown` are sets that contain all values. As an aside, TypeScript also has the *bottom type* `never`, which is the empty set.

## any

Every type is assignable to type `any`

Type `any` is assignable to every type

## unknown

The type `unknown` is a type-safe version of the type `any`. Whenever you are thinking of using `any`, try using `unknown` first.

Before we can perform any operation on values of type `unknown`, we must first narrow their types

- [Type assertions](https://2ality.com/2020/06/type-assertions-typescript.html):

  ```ts
  function func(value: unknown) {
    // @ts-ignore: Object is of type 'unknown'.
    value.toFixed(2);
  
    // Type assertion:
    (value as number).toFixed(2); // OK
  }
  ```

- Equality:

  ```ts
  function func(value: unknown) {
    // @ts-ignore: Object is of type 'unknown'.
    value * 5;
  
    if (value === 123) { // equality
      // %inferred-type: 123
      value;
  
      value * 5; // OK
    }
  }
  ```

- [Type guards](https://2ality.com/2020/06/type-guards-assertion-functions-typescript.html):

  ```ts
  function func(value: unknown) {
    // @ts-ignore: Object is of type 'unknown'.
    value.length;
  
    if (typeof value === 'string') { // type guard
      // %inferred-type: string
      value;
  
      value.length; // OK
    }
  }
  ```

- [Assertion functions](https://2ality.com/2020/06/type-guards-assertion-functions-typescript.html):

  ```ts
  function func(value: unknown) {
    // @ts-ignore: Object is of type 'unknown'.
    value.test('abc');
  
    assertionFunction(value);
  
    // %inferred-type: RegExp
    value;
  
    value.test('abc'); // OK
  }
  
  function assertionFunction(arg: unknown): asserts arg is RegExp {
    if (! (arg instanceof RegExp)) {
      throw new TypeError('Not a RegExp: ' + arg);
    }
  }
  ```